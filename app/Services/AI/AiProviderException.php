<?php

namespace App\Services\AI;

use RuntimeException;

/**
 * Every way a provider can let us down — a missing key, a transport error, an
 * HTTP error, or a completion that is not the JSON we asked for. Callers catch
 * this one type so an AI outage degrades instead of 500ing the request.
 */
class AiProviderException extends RuntimeException
{
    //
}
