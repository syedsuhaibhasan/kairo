import { useState, useRef, useCallback } from 'react';
import { Paperclip, ArrowUp } from 'lucide-react';

export default function NewChat() {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleInput = useCallback((e) => {
        setInput(e.target.value);
        const ta = e.target;
        ta.style.height = 'auto';
        ta.style.height = `${ta.scrollHeight}px`;
    }, []);

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
        <div className="flex h-dvh flex-col">
            {/* Centered Welcome / Hero Area */}
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6">
                <h1 className="font-serif text-[44px] md:text-[56px] leading-[1.1] text-center text-[#2B1810] tracking-tight">
                    What's on your mind?
                </h1>
                <p className="mt-3 text-[15px] text-[#6F4636] text-center max-w-md">
                    Ask anything. Kairo is here to help you think, create, and explore.
                </p>
            </div>

            {/* Composer docked below */}
            <div className="px-8 pb-1.5">
                <form
                    onSubmit={handleSend}
                    className="mx-auto max-w-[760px] rounded-3xl border border-[#F0DCCB]/90 bg-white/90 shadow-xl shadow-orange-950/10 p-[14px]"
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
                        <button
                            type="button"
                            aria-label="Attach file"
                            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[#F0DCCB] bg-white cursor-pointer hover:bg-[#FDF6F0] transition-colors"
                        >
                            <Paperclip size={18} className="text-[#6F4636]" />
                        </button>
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            aria-label="Send message"
                            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#ff6b0f] text-white disabled:opacity-40 cursor-pointer hover:brightness-105 active:scale-95 transition-all"
                        >
                            <ArrowUp size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-[#6F4636] py-2">
                Kairo can make mistakes. Check important info.
            </p>
        </div>
    );
}
