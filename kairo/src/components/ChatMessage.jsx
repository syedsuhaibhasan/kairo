import { useState } from 'react'
import { Copy, RefreshCw, Check, FileText } from 'lucide-react'
import { Card } from './ui/card'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip'

export default function ChatMessage({ message, onRegenerate }) {
  const [copied, setCopied] = useState(false)
  

  if (message.role === 'system') return null

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (message.role === 'user') {
    const attachmentName =
      message.attachment?.fileName ||
      message.attachment?.name ||
      (typeof message.attachment === 'string' ? message.attachment : null) ||
      message.fileName ||
      message.file_name ||
      null

    return (
      <div className="self-end max-w-[70%] rounded-[20px_20px_6px_20px] bg-[#FFE0C7] border border-[#A83A04]/15 px-4 py-3 text-[15px] leading-[1.55] text-[#2B1810] shadow-sm shadow-orange-950/5 transition-all">
        {attachmentName && (
          <div className="flex items-center gap-2 mb-2 p-1.5 px-3 rounded-xl bg-white/80 border border-[#A83A04]/20 w-fit max-w-full text-xs font-medium text-[#2B1810] shadow-xs">
            <FileText size={15} className="text-[#ff6b0f] shrink-0" />
            <span className="truncate max-w-[240px] sm:max-w-[360px]" title={attachmentName}>
              {attachmentName}
            </span>
          </div>
        )}
        {message.content && (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex gap-3 group">
      <Avatar className="h-[30px] w-[30px] shrink-0 rounded-full bg-[#ff6b0f] font-serif text-lg text-white after:border-0 border-0 shadow-sm shadow-orange-900/10">
        <AvatarFallback className="bg-[#ff6b0f] text-white font-serif text-lg">k</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1.5 max-w-[85%]">
        <Card className="rounded-[6px_20px_20px_20px] border border-[#F0DCCB] bg-white/80 px-[18px] py-4 text-[15px] leading-[1.65] text-[#2B1810] shadow-sm shadow-orange-950/5 ring-0 gap-0">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </Card>
        <TooltipProvider delay={150}>
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Copy message"
                    onClick={handleCopy}
                    className="h-7 w-7 rounded-lg text-[#6F4636] hover:bg-white/80 p-0 cursor-pointer transition-colors"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-600 animate-in zoom-in-50" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </Button>
                }
              />
              <TooltipContent>{copied ? "Copied!" : "Copy"}</TooltipContent>
            </Tooltip>

            {onRegenerate && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Regenerate"
                      onClick={onRegenerate}
                      className="h-7 w-7 rounded-lg text-[#6F4636] hover:bg-white/80 p-0 cursor-pointer transition-colors"
                    >
                      <RefreshCw size={14} />
                    </Button>
                  }
                />
                <TooltipContent>Regenerate</TooltipContent>
              </Tooltip>
            )}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
