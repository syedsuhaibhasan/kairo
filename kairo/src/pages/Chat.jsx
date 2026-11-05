import { useState, useRef, useEffect, useCallback } from 'react'
import { Paperclip, ArrowUp } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { Button } from '../components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  const title = 'New chat'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleInput = useCallback((e) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [])

  const handleSend = (e) => {
    e.preventDefault()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      textareaRef.current?.form?.requestSubmit()
    }
  }

  return (
    <TooltipProvider delay={200}>
      <div className="flex h-dvh flex-col">
        {/* Header */}
        <header className="max-w-[824px] mx-auto w-full px-10 pt-6 pb-3">
          <h1 className="font-serif text-[28px] text-[#2B1810] tracking-tight">{title}</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-serif text-[#6F4636]">Start the conversation</p>
            </div>
          ) : (
            <div className="mx-auto max-w-[760px] flex flex-col gap-6">
              {messages.map((message) => (
                <ChatMessage key={message.message_id} message={message} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Composer */}
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
  )
}
