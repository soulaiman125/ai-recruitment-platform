import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, FileText, Briefcase, GraduationCap, MessageSquare } from 'lucide-react';
import { useState, FormEvent } from 'react';

export default function AiCoachPage() {
    const [input, setInput] = useState('');

    // Sprint 1: makayn hta API call, ghir console.log bach ntsna l'events khaddamin.
    // F Sprint 2 ghadi nbedlo hadi b axios.post(route('ai-coach.ask'), ...)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        console.log('Ask AI submitted with:', input);
    };

    const handleSuggestedPrompt = (prompt: string) => {
        console.log('Suggested prompt clicked:', prompt);
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

                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask AI anything..."
                            />
                            <Button type="submit" disabled={!input.trim()}>Ask AI</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Suggested Prompts</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-2">
                        <Button variant="outline" className="justify-start" onClick={() => handleSuggestedPrompt('Review my CV')}>
                            <FileText className="mr-2 h-4 w-4" />
                            Review my CV
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleSuggestedPrompt('Recommend Jobs')}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Recommend Jobs
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleSuggestedPrompt('Skills to Learn')}>
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Skills to Learn
                        </Button>
                        <Button variant="outline" className="justify-start" onClick={() => handleSuggestedPrompt('Interview Preparation')}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Interview Preparation
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}