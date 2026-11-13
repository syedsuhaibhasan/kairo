import { useState, useRef, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { supabase } from '../../supabaseConfig'
import DBService from '../supabase/config'
import { useParams } from 'react-router-dom'
import { Paperclip, ArrowUp, FileText, X } from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { Button } from '../components/ui/button'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [attachedFile, setAttachedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [path, setPath] = useState('')
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const { conversation_id } = useParams()
  const user = useSelector((state) => state.auth.userData)

  const MAX_FILE_SIZE = 15 * 1024 * 1024;
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  const title =  'New chat'

  const ALLOWED_EXTENSIONS = [
  "png", "jpg", "jpeg", "webp", "gif",
  "pdf", "docx", "txt",
];

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFileError("Unsupported file format.");
      e.target.value = "";
      return;
    }

    const isImage = ["png", "jpg", "jpeg", "webp", "gif",]
                    .includes(extension);

    const sizeLimit = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;

    if (file.size > sizeLimit) {
      setFileError(
        isImage
          ? "Image exceeds 10MB limit."
          : "Document exceeds 15MB limit."
      );

      e.target.value = "";
      return;
    }

    if (!user || !conversation_id) {
      setFileError("Please open a conversation first.");
      e.target.value = "";
      return;
    }

    setFileError("");
    setPath("");

    setAttachedFile({
      name: file.name,
      size: file.size,
      file: file,
    });

    setIsUploading(true);

    try {
      const uploaded = await DBService.uploadDocument(user, file, conversation_id);

      if (!uploaded?.path) {
        throw new Error("Upload failed.");
      }

      setPath(uploaded.path);

      console.log("File uploaded:", uploaded.path);

    } catch (error) {
      console.error("File upload error:", error);

      setFileError("Could not upload file. Please try again.");
      setAttachedFile(null);
      setPath("");

      e.target.value = "";

    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async() => {
    const filePath = path
    if (user && filePath) {
      await DBService.deleteDocument(user, conversation_id, filePath)
    }
    setFileError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setPath('')
    setAttachedFile(null)
  }


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
  e?.preventDefault?.();

  if (isSending || isUploading) return;

  const userMessage = input.trim();

  if (!userMessage && !attachedFile) return;

  // the file must finish uploading before we send its path.
  if (attachedFile && !path) {
    setFileError("Please wait until the file finishes uploading.");
    return;
  }

  // keep a snapshot of the attachment before changing state.
  const currentAttachment = attachedFile && path
    ? {
        storageKey: path,
        fileName: attachedFile.name,
        mimeType: attachedFile.file.type,
      }
    : null;

  const messageToDisplay = userMessage ||
    `Please analyze the attached file: ${attachedFile.name}`;

  const temporaryMessageId = crypto.randomUUID();

  setIsSending(true);
  setFileError("");

  // optimistically display the user message.
  setMessages((prev) => [
    ...prev,
    {
      message_id: temporaryMessageId,
      role: "user",
      content: messageToDisplay,
    },
  ]);

  try {
    const { data, error } = await supabase.functions.invoke(
      "chat",
      {
        body: {
          conversationId: conversation_id,
          message: userMessage,

          // null for normal messages.
          // object for image/document messages.
          attachment: currentAttachment,
        },
      }
    );

    if (error) {
      throw error;
    }

    if (!data?.reply) {
      throw new Error(data?.error || "AI returned no response.");
    }

    // replacing temporary user message ID with DB message ID.
    setMessages((prev) => [
      ...prev.map((item) =>
        item.message_id === temporaryMessageId
          ? {
              ...item,
              message_id: data.userMessageId,
            }
          : item
      ),

      // display assistant response.
      {
        message_id: data.messageId,
        role: "assistant",
        content: data.reply,
      },
    ]);

    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setAttachedFile(null);
    setPath("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

  } catch (error) {
    console.error("Error sending message:", error);

    // remove optimistic message so it isn't displayed twice.
    setMessages((prev) =>
      prev.filter(
        (item) => item.message_id !== temporaryMessageId
      )
    );

    // Keep input and attachment so the user can retry.
    setFileError(
      error?.message || "Could not send message. Please try again."
    );

  } finally {
    setIsSending(false);
  }
};


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
              className="w-full resize-none font-serif text-[19px] text-[#2B1810] placeholder:text-[#7D5F4E] bg-transparent outline-none max-h-40 overflow-y-auto"
            />
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach file (max 15MB)"
                aria-label="Attach file"
                className="h-[38px] w-[38px] rounded-xl border border-[#F0DCCB] bg-white hover:bg-[#FDF6F0] p-0 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Paperclip size={18} className="text-[#6F4636]" />
              </button>

              <button
                type="submit"
                onClick={handleSend}
                disabled={!input.trim() && !attachedFile}
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
