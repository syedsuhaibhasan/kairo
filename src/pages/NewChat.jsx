import { useState, useRef, useCallback } from 'react';
import { Paperclip, ArrowUp, Lightbulb, PenTool, Code, Compass, FileText, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { TooltipProvider } from '../components/ui/tooltip';

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
    const [attachedFile, setAttachedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setFileError('File exceeds 15MB limit');
            setAttachedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setFileError('');
        setAttachedFile({
            name: file.name,
            size: file.size,
            file: file,
        });
    };

    const handleRemoveFile = () => {
        setAttachedFile(null);
        setFileError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
            <div className="flex h-[calc(100dvh-3.5rem)] lg:h-dvh flex-col">
                {/* Centered Welcome / Hero Area */}
                <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto py-6">
                    <Badge
                        variant="warm"
                        className="mb-3.5 gap-1.5 px-3 py-1 font-serif text-[13px] border-[#F0DCCB] shadow-sm shadow-orange-950/5 animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                        <img
                            src="/svg/kairo-mark.svg"
                            alt=""
                            className="h-4 w-auto shrink-0"
                            draggable={false}
                        />
                        <span>Kairo Assistant</span>
                    </Badge>

                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-center text-[#2B1810] tracking-tight">
                        What's on your mind?
                    </h1>
                    <p className="mt-2.5 text-sm sm:text-base text-[#6F4636] text-center max-w-md">
                        Ask anything. Kairo is here to help you think, create, and explore.
                    </p>

                    {/* Creative suggestion prompt cards */}
                    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[760px]">
                        {SUGGESTIONS.map((sug, idx) => {
                            const Icon = sug.icon;
                            return (
                                <Card
                                    key={idx}
                                    onClick={() => handleSelectSuggestion(sug.prompt)}
                                    className="p-3 sm:p-3.5 rounded-2xl border-[#F0DCCB]/80 bg-white/70 hover:bg-white/95 hover:border-[#ff6b0f]/40 hover:shadow-md hover:shadow-orange-950/5 transition-all cursor-pointer text-left ring-0 gap-1 group"
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
                <div className="px-3 sm:px-8 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                    <form
                        onSubmit={handleSend}
                        className="mx-auto max-w-[760px] rounded-3xl border border-[#F0DCCB]/90 bg-white/90 shadow-xl shadow-orange-950/10 p-3 sm:p-[14px] transition-all focus-within:ring-2 focus-within:ring-[#ff6b0f]/20 focus-within:border-[#ff6b0f]/50"
                    >
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Attached file preview chip */}
                        {attachedFile && (
                            <div className="flex items-center gap-2 mb-2.5 p-1.5 px-3 rounded-xl bg-[#FFF4EA] border border-[#F0DCCB] w-fit max-w-full text-xs text-[#2B1810] shadow-sm animate-in fade-in zoom-in-95">
                                <FileText size={15} className="text-[#ff6b0f] shrink-0" />
                                <span className="truncate font-medium max-w-[200px] sm:max-w-[320px]" title={attachedFile.name}>
                                    {attachedFile.name}
                                </span>
                                <span className="text-[10px] text-[#7D5F4E]">
                                    ({(attachedFile.size / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    aria-label="Remove attachment"
                                    className="ml-1 text-[#7D5F4E] hover:text-[#A83A04] hover:bg-white/80 rounded-full p-0.5 cursor-pointer transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        {fileError && (
                            <p role="alert" className="text-xs text-[#A83A04] mb-2 px-1">
                                {fileError}
                            </p>
                        )}

                        <textarea
                            ref={textareaRef}
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Message Kairo..."
                            aria-label="Message Kairo"
                            rows={1}
                            className="w-full resize-none font-serif text-base sm:text-[19px] text-[#2B1810] placeholder:text-[#7D5F4E] bg-transparent outline-none max-h-40 overflow-y-auto"
                        />
                        <div className="flex items-center justify-between mt-2">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                title="Attach file (max 15MB)"
                                aria-label="Attach file"
                                className="h-11 w-11 sm:h-[38px] sm:w-[38px] rounded-xl border border-[#F0DCCB] bg-white hover:bg-[#FDF6F0] p-0 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                            >
                                <Paperclip size={18} className="text-[#6F4636]" />
                            </button>

                            <button
                                type="submit"
                                onClick={handleSend}
                                disabled={!input.trim() && !attachedFile}
                                title="Send (Enter)"
                                aria-label="Send message"
                                className="h-11 w-11 sm:h-[44px] sm:w-[44px] rounded-full bg-[#ff6b0f] text-white disabled:opacity-40 flex items-center justify-center p-0 cursor-pointer hover:brightness-105 active:scale-95 transition-all shadow-md shadow-orange-800/15 disabled:cursor-not-allowed shrink-0"
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-[11px] sm:text-xs text-[#6F4636] py-1.5 px-4 text-balance">
                    Kairo can make mistakes. Check important info.
                </p>
            </div>
        </TooltipProvider>
    );
}
