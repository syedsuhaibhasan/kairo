import { useState, useRef, useCallback } from 'react';
import { Paperclip, ArrowUp, Sparkles, Lightbulb, PenTool, Code, Compass } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';

const SUGGESTIONS = [
    {
        icon: Lightbulb,
        title: "Brainstorm ideas",
        desc: "Fresh concepts for your next project",
        prompt: "Brainstorm 5 innovative concepts for a modern AI application with exceptional user experience",
    },
    {
        icon: PenTool,
        title: "Refine writing",
        desc: "Polish tone, clarity, and narrative",
        prompt: "Help me rewrite and polish this draft for executive clarity and impact:",
    },
    {
        icon: Code,
        title: "Code & Architecture",
        desc: "Design patterns & clean systems",
        prompt: "Explain how to structure a scalable, type-safe fullstack React application architecture",
    },
    {
        icon: Compass,
        title: "Explore concepts",
        desc: "Break down complex topics simply",
        prompt: "Explain how transformer models and attention mechanisms work using intuitive real-world analogies",
    },
];

export default function NewChat() {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleInput = useCallback((e) => {
        setInput(e.target.value);
        const ta = e.target;
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    }, []);

    const handleSelectSuggestion = (promptText) => {
        setInput(promptText);
        if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.style.height = 'auto';
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                }
            }, 0);
        }
    };

    const handleSend = (e) => {
        e.preventDefault();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            textareaRef.current?.form?.requestSubmit();
        }
    };

    return (
        <TooltipProvider delay={200}>
            <div className="flex h-dvh flex-col">
                {/* Centered Welcome / Hero Area */}
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 overflow-y-auto py-6">
                    <Badge
                        variant="warm"
                        className="mb-3.5 gap-1.5 px-3 py-1 font-serif text-[13px] border-[#F0DCCB] shadow-sm shadow-orange-950/5 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                        <Sparkles size={13} className="text-[#ff6b0f]" />
                        <span>Kairo Assistant</span>
                    </Badge>

                    <h1 className="font-serif text-[42px] md:text-[54px] leading-[1.1] text-center text-[#2B1810] tracking-tight">
                        What's on your mind?
                    </h1>
                    <p className="mt-2.5 text-[15px] text-[#6F4636] text-center max-w-md">
                        Ask anything. Kairo is here to help you think, create, and explore.
                    </p>

                    {/* Creative suggestion prompt cards */}
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[760px]">
                        {SUGGESTIONS.map((sug, idx) => {
                            const Icon = sug.icon;
                            return (
                                <Card
                                    key={idx}
                                    onClick={() => handleSelectSuggestion(sug.prompt)}
                                    className="p-3.5 rounded-2xl border-[#F0DCCB]/80 bg-white/70 hover:bg-white/95 hover:border-[#ff6b0f]/40 hover:shadow-md hover:shadow-orange-950/5 transition-all cursor-pointer text-left ring-0 gap-1 group"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-xl bg-[#FFF0E2] text-[#ff6b0f] group-hover:scale-105 transition-transform">
                                            <Icon size={16} />
                                        </div>
                                        <span className="font-serif text-[15px] font-medium text-[#2B1810]">
                                            {sug.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#7D5F4E] pl-8 line-clamp-1">
                                        {sug.desc}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Composer docked below */}
                <div className="px-8 pb-1.5">
                    <form
                        onSubmit={handleSend}
                        className="mx-auto max-w-[760px] rounded-3xl border border-[#F0DCCB]/90 bg-white/90 shadow-xl shadow-orange-950/10 p-[14px] transition-all focus-within:ring-2 focus-within:ring-[#ff6b0f]/20 focus-within:border-[#ff6b0f]/50"
                    >
                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Kairo..."
                            aria-label="Message Kairo"
                            rows={1}
                            className="w-full resize-none font-serif text-[19px] text-[#2B1810] placeholder:text-[#7D5F4E] bg-transparent outline-none max-h-40 overflow-y-auto"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            aria-label="Attach file"
                                            className="h-[38px] w-[38px] rounded-xl border border-[#F0DCCB] bg-white hover:bg-[#FDF6F0] p-0 cursor-pointer transition-colors"
                                        >
                                            <Paperclip size={18} className="text-[#6F4636]" />
                                        </Button>
                                    }
                                />
                                <TooltipContent>Attach file</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger
                                    render={
                                        <Button
                                            type="submit"
                                            disabled={!input.trim()}
                                            aria-label="Send message"
                                            className="h-[44px] w-[44px] rounded-full bg-[#ff6b0f] text-white disabled:opacity-40 p-0 cursor-pointer hover:brightness-105 active:scale-95 transition-all shadow-md shadow-orange-800/15"
                                        >
                                            <ArrowUp size={20} strokeWidth={2.5} />
                                        </Button>
                                    }
                                />
                                <TooltipContent>Send (Enter)</TooltipContent>
                            </Tooltip>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-[#6F4636] py-2">
                    Kairo can make mistakes. Check important info.
                </p>
            </div>
        </TooltipProvider>
    );
}
