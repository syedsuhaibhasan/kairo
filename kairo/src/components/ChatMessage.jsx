import { Copy, RefreshCw } from 'lucide-react'

export default function ChatMessage({ message, onRegenerate }) {
  if (message.role === 'system') return null

  if (message.role === 'user') {
    return (
      <div className="self-end max-w-[70%] rounded-[20px_20px_6px_20px] bg-[#FFE0C7] border border-[#A83A04]/15 px-4 py-3 text-[15px] leading-[1.55] text-[#2B1810]">
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#ff6b0f] font-serif text-lg text-white">
        k
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="rounded-[6px_20px_20px_20px] border border-[#F0DCCB] bg-white/80 px-[18px] py-4 text-[15px] leading-[1.65] text-[#2B1810] shadow-sm shadow-orange-950/5">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Copy"
            onClick={() => navigator.clipboard.writeText(message.content)}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[#6F4636] hover:bg-white/60"
          >
            <Copy size={14} />
          </button>
          {onRegenerate && (
            <button
              type="button"
              aria-label="Regenerate"
              onClick={onRegenerate}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[#6F4636] hover:bg-white/60"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

