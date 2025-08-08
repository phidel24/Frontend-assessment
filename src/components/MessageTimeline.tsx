'use client'

import { motion } from 'framer-motion'
import { Message } from '@/lib/db'
import { Smile, Frown, MessageSquare } from 'lucide-react'

interface MessageTimelineProps {
  messages: Message[]
}

export function MessageTimeline({ messages }: MessageTimelineProps) {
  const getSentimentIcon = (sentiment: string | null) => {
    if (sentiment === 'positive') return <Smile className="h-4 w-4 text-green-500" />
    if (sentiment === 'negative') return <Frown className="h-4 w-4 text-red-500" />
    return <MessageSquare className="h-4 w-4 text-gray-400" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {messages.map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {getSentimentIcon(message.sentiment_label)}
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                User {message.user_uid.slice(0, 8)}...
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(message.creationdate)}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {message.text}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{message.word_count || 0} words</span>
            <span>{message.char_count || 0} chars</span>
            {message.has_emojis && (
              <span className="text-yellow-500">😊</span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
} 