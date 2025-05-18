import React, { useState, useRef, useEffect } from 'react'
import { Loader2, CornerDownLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ChatMessage = {
  role: 'system' | 'assistant' | 'user'
  content: string
  status?: 'loading' | 'error' | 'complete'
  timestamp?: Date
  messageId?: string
}

export type ChatInterfaceProps = {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isSendingMessage: boolean
  placeholder?: string
  className?: string
}

export function ChatInterface({
  messages,
  onSendMessage,
  isSendingMessage,
  placeholder = "Type a message...",
  className
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('')

  // Add ref to messages container for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim() || isSendingMessage) return
    onSendMessage(inputValue)
    setInputValue('')
  }

  // Render timestamp in a readable format
  const formatTimestamp = (date?: Date) => {
    if (!date) return ''

    // Make sure date is a valid Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      // If date is not a valid Date object, try to convert it
      const parsedDate = date instanceof Date ? date : new Date(date)
      if (isNaN(parsedDate.getTime())) {
        return '' // Return empty string if we can't create a valid date
      }
      return parsedDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }

    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={cn("flex flex-col h-full min-h-[400px]", className)}>
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-12 h-12 bg-[#f0f7ff] dark:bg-[#172338]/50 rounded-full flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-[#1c64f2] dark:text-[#93c5fd]" />
            </div>
            <h3 className="text-base font-medium text-[#0f172a] dark:text-[#f8fafc] mb-1">No messages yet</h3>
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">
              Start a conversation by sending a message.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.messageId || `${index}-${message.status || 'default'}`}
              className={cn(
                "flex",
                message.role === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-xl p-3.5",
                message.role === 'user'
                  ? "bg-[#f0f7ff] dark:bg-[#172338]/50 text-[#0f172a] dark:text-[#f8fafc] rounded-tr-none"
                  : "bg-white dark:bg-[#202327] border border-[#f0f0f0] dark:border-[#2e3238] rounded-tl-none text-[#0f172a] dark:text-[#e5e7eb]"
              )}>
                {message.status === 'loading' ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#1c64f2] dark:text-[#93c5fd]" />
                    <span className="text-sm text-[#64748b] dark:text-[#9ca3af]">Thinking...</span>
                  </div>
                ) : message.status === 'error' ? (
                  <div className="text-sm text-[#dc2626] dark:text-[#fca5a5]">{message.content}</div>
                ) : (
                  <div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="mt-1 text-right">
                      <span className="text-[10px] text-[#94a3b8] dark:text-[#6b7280]">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 mt-auto border-t border-[#f0f0f0] dark:border-[#2e3238]">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={placeholder}
            className="w-full border border-[#e2e8f0] dark:border-[#374151] rounded-lg py-2 pl-3 pr-10 bg-white dark:bg-[#1e2024] text-[#0f172a] dark:text-[#f8fafc] text-sm placeholder:text-[#64748b] dark:placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1c64f2] dark:focus:ring-[#3b82f6]"
            disabled={isSendingMessage}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1 h-7 w-7 rounded-full border-0 bg-transparent text-[#1c64f2] dark:text-[#3b82f6] hover:bg-[#f0f7ff] dark:hover:bg-[#172338]/50"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isSendingMessage}
          >
            {isSendingMessage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CornerDownLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Create a new component that's connected to the store
import { useAIChatStore } from '@/stores/ai-chat.store'

export function ZustandChatInterface({
  placeholder = "Type a message...",
  className,
  errorContext
}: {
  placeholder?: string
  className?: string
  errorContext?: {
    errorName: string
    errorMessage: string
    rootCause?: string
    explanation?: string
  }
}) {
  // Use specific selectors to prevent unnecessary re-renders
  const messages = useAIChatStore(state => state.messages)
  const isSendingMessage = useAIChatStore(state => state.isSendingMessage)
  const sendMessage = useAIChatStore(state => state.sendMessage)

  const handleSendMessage = (message: string) => {
    sendMessage(message, errorContext)
  }

  return (
    <ChatInterface
      messages={messages}
      onSendMessage={handleSendMessage}
      isSendingMessage={isSendingMessage}
      placeholder={placeholder}
      className={className}
    />
  )
} 