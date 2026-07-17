<?php

namespace App\Mail\Transport;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\Mailer\Exception\TransportException;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\Part\DataPart;
use Throwable;

/**
 * Sends Symfony email messages through Brevo's HTTPS API, allowing Laravel's
 * mailers and notifications to keep their normal Mail::to() behaviour.
 */
class BrevoTransport extends AbstractTransport
{
    private const BASE_URL = 'https://api.brevo.com/v3';

    public function __construct(
        private readonly string $apiKey,
        private readonly int $timeout = 30,
    ) {
        parent::__construct();
    }

    public function __toString(): string
    {
        return 'brevo';
    }

    protected function doSend(SentMessage $message): void
    {
        $email = $message->getOriginalMessage();

        if (! $email instanceof Email) {
            throw new TransportException('Brevo can only send Symfony Email messages.');
        }

        try {
            $response = Http::baseUrl(self::BASE_URL)
                ->acceptJson()
                ->withHeaders(['api-key' => $this->apiKey])
                ->timeout($this->timeout)
                ->retry(3, 500, fn (Throwable $e): bool => $e instanceof ConnectionException
                    || ($e instanceof RequestException && $e->response->serverError()), throw: false)
                ->post('smtp/email', $this->payload($email));
        } catch (ConnectionException $e) {
            throw new TransportException('Could not reach Brevo: '.$e->getMessage(), previous: $e);
        }

        if ($response->failed()) {
            throw new TransportException(
                "Brevo returned HTTP {$response->status()}: ".str($response->body())->limit(1000, ''),
            );
        }

        $messageId = $response->json('messageId');

        if (is_string($messageId) && $messageId !== '') {
            $message->setMessageId($messageId);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Email $email): array
    {
        $from = $email->getFrom()[0] ?? null;

        if (! $from instanceof Address) {
            throw new TransportException('Brevo requires a sender address.');
        }

        $payload = [
            'sender' => $this->address($from),
            'to' => $this->addresses($email->getTo()),
            'subject' => $email->getSubject() ?? '',
        ];

        $html = $this->body($email->getHtmlBody());
        $text = $this->body($email->getTextBody());

        if ($html !== '') {
            $payload['htmlContent'] = $html;
        }

        if ($text !== '') {
            $payload['textContent'] = $text;
        }

        foreach ([
            'cc' => $email->getCc(),
            'bcc' => $email->getBcc(),
            'replyTo' => $email->getReplyTo(),
        ] as $key => $addresses) {
            if ($addresses !== []) {
                $payload[$key] = $key === 'replyTo'
                    ? $this->address($addresses[0])
                    : $this->addresses($addresses);
            }
        }

        $attachments = $this->attachments($email->getAttachments());

        if ($attachments !== []) {
            $payload['attachment'] = $attachments;
        }

        return $payload;
    }

    /**
     * @param  Address[]  $addresses
     * @return array<int, array<string, string>>
     */
    private function addresses(array $addresses): array
    {
        return array_map($this->address(...), $addresses);
    }

    /**
     * @return array<string, string>
     */
    private function address(Address $address): array
    {
        return array_filter([
            'email' => $address->getAddress(),
            'name' => $address->getName(),
        ], static fn (string $value): bool => $value !== '');
    }

    /**
     * @param  resource|string|null  $body
     */
    private function body(mixed $body): string
    {
        if (is_resource($body)) {
            $metadata = stream_get_meta_data($body);

            if ($metadata['seekable']) {
                rewind($body);
            }

            return stream_get_contents($body) ?: '';
        }

        return is_string($body) ? $body : '';
    }

    /**
     * @param  DataPart[]  $attachments
     * @return array<int, array<string, string>>
     */
    private function attachments(array $attachments): array
    {
        return array_map(static fn (DataPart $attachment): array => [
            'name' => $attachment->getFilename() ?? 'attachment',
            'content' => base64_encode($attachment->getBody()),
        ], $attachments);
    }
}
