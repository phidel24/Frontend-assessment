'use client'

import { motion } from 'framer-motion'
import { Smile, Heart, Trophy, Beer } from 'lucide-react'

interface EmojiInsightsProps {
  data: {
    total_messages: number
    messages_with_emojis: number
    emoji_percentage: number
  }
}

export function EmojiInsights({ data }: EmojiInsightsProps) {
  const emojiStats = [
    {
      icon: Smile,
      label: 'Emoji-Nutzer',
      value: data.messages_with_emojis,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      icon: Heart,
      label: 'Emoji-Rate',
      value: `${data.emoji_percentage}%`,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      icon: Trophy,
      label: 'Engagement',
      value: Math.round(data.emoji_percentage / 10),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      suffix: '/10'
    },
    {
      icon: Beer,
      label: 'Stimmung',
      value: data.emoji_percentage > 30 ? 'Hoch' : data.emoji_percentage > 15 ? 'Mittel' : 'Niedrig',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          😊 Emoji-Engagement
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Wie emotional sind die HSV-Fans?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {emojiStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Emoji-Nutzung
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {data.messages_with_emojis} von {data.total_messages} Nachrichten
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.emoji_percentage}%
            </div>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${Math.min(data.emoji_percentage, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 