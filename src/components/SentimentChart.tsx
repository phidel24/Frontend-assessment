'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface SentimentChartProps {
  data: Array<{
    sentiment_label: string
    count: number
    avg_score: number
  }>
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B']

export function SentimentChart({ data }: SentimentChartProps) {
  const chartData = data.map(item => ({
    name: item.sentiment_label === 'positive' ? 'Positive' : 'Negative',
    value: item.count,
    score: item.avg_score,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any, name: any) => [
              `${value} messages`,
              name
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        {data.map((item, index) => {
          const avgScore = typeof item.avg_score === 'number' ? item.avg_score : parseFloat(item.avg_score as any) || 0
          return (
            <div key={item.sentiment_label} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.count}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {item.sentiment_label} messages
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Avg score: {avgScore.toFixed(2)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 