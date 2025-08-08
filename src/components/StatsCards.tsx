'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Users, TrendingUp, Smile } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    total_messages: number
    avg_chars: number
    avg_words: number
    messages_with_emojis: number
    unique_users: number
  }
}

const cards = [
  {
    title: 'Total Messages',
    value: 'total_messages',
    icon: MessageSquare,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    title: 'Unique Users',
    value: 'unique_users',
    icon: Users,
    color: 'bg-green-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    title: 'Avg. Words',
    value: 'avg_words',
    icon: TrendingUp,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  {
    title: 'With Emojis',
    value: 'messages_with_emojis',
    icon: Smile,
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
]

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon
        const value = stats[card.value as keyof typeof stats]
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${card.bgColor} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {typeof value === 'number' ? Math.round(value).toLocaleString() : value}
                </p>
              </div>
              <div className={`p-4 rounded-full ${card.color} text-white shadow-lg`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
} 