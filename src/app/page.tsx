import { Suspense } from 'react'
import { getMessages, getSentimentStats, getMessageStats, getTopTopics, getEmojiAnalysis, getSentimentTrends } from '@/lib/db'
import { SentimentChart } from '@/components/SentimentChart'
import { MessageTimeline } from '@/components/MessageTimeline'
import { StatsCards } from '@/components/StatsCards'
import { TopicAnalysis } from '@/components/TopicAnalysis'
import { EmojiInsights } from '@/components/EmojiInsights'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default async function Dashboard() {
  const [messages, sentimentStats, messageStats, topTopics, emojiAnalysis, sentimentTrends] = await Promise.all([
    getMessages(),
    getSentimentStats(),
    getMessageStats(),
    getTopTopics(),
    getEmojiAnalysis(),
    getSentimentTrends(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            HSV Fan Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Echte Einblicke in die HSV-Fan-Community
          </p>
        </header>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Suspense fallback={<LoadingSpinner />}>
            <StatsCards stats={messageStats} />
          </Suspense>
        </div>

        {/* Main Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3">📊</span>
              Stimmung der Fans
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <SentimentChart data={sentimentStats} />
            </Suspense>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="mr-3">😊</span>
              Emoji-Engagement
            </h2>
            <Suspense fallback={<LoadingSpinner />}>
              <EmojiInsights data={emojiAnalysis} />
            </Suspense>
          </div>
        </div>

        {/* Topic Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">🔥</span>
            Was beschäftigt die Fans?
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <TopicAnalysis data={topTopics} />
          </Suspense>
        </div>

        {/* Recent Messages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="mr-3">💬</span>
            Aktuelle Fan-Nachrichten
          </h2>
          <Suspense fallback={<LoadingSpinner />}>
            <MessageTimeline messages={messages.slice(0, 8)} />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 