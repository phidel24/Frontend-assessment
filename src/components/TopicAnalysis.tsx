'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TopicAnalysisProps {
  data: Array<{
    topic: string
    count: number
  }>
}

const topicColors = {
  'Aufstieg': '#10B981',
  'Bier/Sponsoring': '#F59E0B',
  'Präsidentschaft': '#3B82F6',
  'Spiele/Aufstellung': '#EF4444',
  'Stadion/Atmosphäre': '#8B5CF6',
  'Sonstiges': '#6B7280'
}

export function TopicAnalysis({ data }: TopicAnalysisProps) {
  const chartData = data.map(item => ({
    ...item,
    color: topicColors[item.topic as keyof typeof topicColors] || '#6B7280'
  }))

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🔥 Top Diskussionsthemen
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Was beschäftigt die HSV-Fans am meisten?
        </p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="topic" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`${value} Nachrichten`, 'Anzahl']}
              labelStyle={{ color: '#374151' }}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.slice(0, 4).map((topic, index) => (
          <motion.div
            key={topic.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {topic.topic}
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {topic.count}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 