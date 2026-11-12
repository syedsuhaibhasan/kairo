import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../../supabaseConfig'
import DBService from '../supabase/config'
import { useParams } from 'react-router-dom'
import { Paperclip, ArrowUp } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { Button } from '../components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const { conversation_id } = useParams()

  const title = 'New chat'

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!conversation_id) return
        const res = await DBService.getChatHistory(conversation_id)
        setMessages(Array.isArray(res) ? res : [])
      } catch (error) {
        console.log("Error fetching messages:: fetchMessages ::", error)
        setMessages([])
      }
    }
    fetchMessages()
  }, [conversation_id])


  const handleInput = useCallback((e) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
  }, [])

  const handleSend = async (e) => {
    e?.preventDefault?.()

    const userMessage = input.trim()
    if (!userMessage) return

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ])
    setInput('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          conversationId: conversation_id,
          message: userMessage,
        },
      })

      if (error) {
        console.error("Supabase function error:", error)
        return
      }

      const assistantReply = data?.reply
      if (assistantReply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: assistantReply,
          },
        ])
      }
    } catch (error) {
      console.log("Error sending message: ", error)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <TooltipProvider delay={200}>
      <div className="flex h-dvh flex-col">
        {/* Header */}
        <header className="max-w-[824px] mx-auto w-full px-10 pt-6 pb-3">
          <h1 className="font-serif text-[28px] text-[#2B1810] tracking-tight">{title}</h1>
        </header>

        {/* Messages */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-4">
          {(!messages || messages.length === 0) ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-serif text-[#6F4636]">Start the conversation</p>
            </div>
          ) : (
            <div className="mx-auto max-w-[760px] flex flex-col gap-6">
              {messages?.map((message) => (
                <ChatMessage key={message.message_id || message.id || Math.random()} message={message} />
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

              <button
                type="submit"
                onClick={handleSend}
                disabled={!input.trim()}
                title="Send (Enter)"
                aria-label="Send message"
                className="h-[44px] w-[44px] rounded-full bg-[#ff6b0f] text-white disabled:opacity-40 flex items-center justify-center p-0 cursor-pointer hover:brightness-105 active:scale-95 transition-all shadow-md shadow-orange-800/15 disabled:cursor-not-allowed"
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
    </TooltipProvider>
  )
}
