import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, FileText, Briefcase, GraduationCap, MessageSquare, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import axios from 'axios';
import { ask } from '@/routes/candidate/ai-coach';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
};

// crypto.randomUUID() khadam f browsers modernes o f Node 19+
const generateId = () => crypto.randomUUID();

export default function AiCoachPage() {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto scroll l akher rissala
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const sendMessage = async (text: string) => {
        const message = text.trim();
        if (!message || loading) return;

        setLoading(true);
        setError(null);
        setInput('');

        // Rissalat user kat-bane mabachra, qbel majawbach l AI
        setMessages((prev) => [
            ...prev,
            {
                id: generateId(),
                role: 'user',
                content: message,
                createdAt: new Date().toISOString(),
            },
        ]);

        try {
            const response = await axios.post(ask().url, {
                message,
                conversation_id: conversationId,
            });

            if (response.data.conversation_id) {
                setConversationId(response.data.conversation_id);
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: 'assistant',
                    content: response.data.answer,
                    createdAt: new Date().toISOString(),
                },
            ]);
        } catch (err) {
            console.error(err);
            setError('Wqe chi mochkil, 3awd jarreb men b3d.');

            // Zid rissala fl chat bach l mohadata tbqa wadha
            setMessages((prev) => [
                ...prev,
                {
                    id: generateId(),
                    role: 'assistant',
                    content: 'Sorry, something went wrong. Please try again.',
                    createdAt: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    // Enter = sift, Shift+Enter = satr jdid
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    // Suggested prompt: ghi kaye3mar Textarea, user howa li kaydoz Ask AI
    const handleSuggestedPrompt = (prompt: string) => {
        setInput(prompt);
    };

    return (
        <AppLayout>
            <Head title="AI Career Coach" />
            <div className="mx-auto max-w-5xl space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-6 w-6 text-primary" />
                            AI Career Coach
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold">👋 Welcome!</h2>
                            <p className="text-muted-foreground">
                                Ask anything about your career, resume, jobs or interviews.
                            </p>
                        </div>

                        {(messages.length > 0 || loading) && (
                            <div
                                ref={scrollRef}
                                className="max-h-[500px] space-y-4 overflow-y-auto rounded-md border p-4"
                            >
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${
                                                msg.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                            }`}
                                        >
                                            <p className="mb-1 text-xs font-semibold">
                                                {msg.role === 'user' ? 'You' : 'AI Coach'}
                                            </p>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    rehypePlugins={[rehypeHighlight]}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] rounded-lg bg-muted p-3">
                                            <p className="mb-1 text-xs font-semibold">AI Coach</p>
                                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                AI is typing...
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask AI anything... (Enter to send, Shift+Enter for new line)"
                                disabled={loading}
                                rows={2}
                                className="resize-none"
                            />
                            <Button type="submit" disabled={loading || !input.trim()}>
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ask AI'}
                            </Button>
                        </form>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Suggested Prompts</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleSuggestedPrompt('Review my CV')}
                            disabled={loading}
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Review my CV
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleSuggestedPrompt('Recommend Jobs')}
                            disabled={loading}
                        >
                            <Briefcase className="mr-2 h-4 w-4" />
                            Recommend Jobs
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleSuggestedPrompt('Skills to Learn')}
                            disabled={loading}
                        >
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Skills to Learn
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-start"
                            onClick={() => handleSuggestedPrompt('Interview Preparation')}
                            disabled={loading}
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Interview Preparation
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}