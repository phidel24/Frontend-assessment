require('dotenv').config();

const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

if (!process.env.MYSQL_USER || !process.env.MYSQL_PASSWORD || !process.env.MYSQL_DATABASE) {
  throw new Error('Missing required database environment variables. Please check your .env file.');
}

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

interface Message {
  id: number;
  chat_id: number;
  user_uid: string;
  text: string;
  creationdate: string;
  image_id: number | null;
  sentiment_score: number | null;
  sentiment_label: string | null;
  char_count: number | null;
  word_count: number | null;
  has_emojis: boolean | null;
}

interface SentimentStats {
  sentiment_label: string;
  count: number;
  avg_score: number;
}

interface MessageStats {
  total_messages: number;
  avg_chars: number;
  avg_words: number;
  messages_with_emojis: number;
  unique_users: number;
}

interface TopicAnalysis {
  topic: string;
  count: number;
}

interface EmojiAnalysis {
  total_messages: number;
  messages_with_emojis: number;
  emoji_percentage: number;
}

interface SentimentTrends {
  sentiment_label: string;
  count: number;
  avg_words: number;
  avg_chars: number;
}

interface UserEngagement {
  user_uid: string;
  message_count: number;
  avg_chars: number;
  emoji_count: number;
}

async function getMessages(): Promise<Message[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM message ORDER BY creationdate DESC LIMIT 100'
    );
    return rows as Message[];
  } finally {
    await connection.end();
  }
}

async function getSentimentStats(): Promise<SentimentStats[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        sentiment_label,
        COUNT(*) as count,
        AVG(sentiment_score) as avg_score
      FROM message 
      WHERE sentiment_label IS NOT NULL
      GROUP BY sentiment_label
    `);
    return rows as SentimentStats[];
  } finally {
    await connection.end();
  }
}

async function getMessageStats(): Promise<MessageStats> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(*) as total_messages,
        AVG(char_count) as avg_chars,
        AVG(word_count) as avg_words,
        SUM(CASE WHEN has_emojis = 1 THEN 1 ELSE 0 END) as messages_with_emojis,
        COUNT(DISTINCT user_uid) as unique_users
      FROM message
    `);
    return (rows as MessageStats[])[0];
  } finally {
    await connection.end();
  }
}

// Improved topic matching with cleaner text analysis
const TOPIC_KEYWORDS = {
  'Aufstieg': ['aufstieg', 'aufsteigen', 'promotion', 'bundesliga'],
  'Bier/Sponsoring': ['bier', 'holsten', 'könig', 'pilsener', 'sponsor', 'sponsoring'],
  'Präsidentschaft': ['präsident', 'jansen', 'ludwig', 'vorstand', 'führung'],
  'Spiele/Aufstellung': ['spiel', 'nürnberg', 'ulm', 'aufstellung', 'kader', 'trainingslager'],
  'Stadion/Atmosphäre': ['stadion', 'volkspark', 'block', 'fans', 'atmosphere', 'stimmung']
} as const;

function categorizeTopic(text: string): string {
  const lowerText = text.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return topic;
    }
  }
  
  return 'Sonstiges';
}

async function getTopTopics(): Promise<TopicAnalysis[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT text FROM message
    `);
    
    const messages = rows as { text: string }[];
    const topicCounts = new Map<string, number>();
    
    messages.forEach(message => {
      const topic = categorizeTopic(message.text);
      topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
    });
    
    return Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  } finally {
    await connection.end();
  }
}

async function getEmojiAnalysis(): Promise<EmojiAnalysis> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN has_emojis = 1 THEN 1 ELSE 0 END) as messages_with_emojis,
        ROUND((SUM(CASE WHEN has_emojis = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 1) as emoji_percentage
      FROM message
    `);
    const result = (rows as any[])[0];
    return {
      total_messages: result.total_messages,
      messages_with_emojis: result.messages_with_emojis,
      emoji_percentage: parseFloat(result.emoji_percentage)
    };
  } finally {
    await connection.end();
  }
}

async function getSentimentTrends(): Promise<SentimentTrends[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        sentiment_label,
        COUNT(*) as count,
        AVG(word_count) as avg_words,
        AVG(char_count) as avg_chars
      FROM message 
      WHERE sentiment_label IS NOT NULL
      GROUP BY sentiment_label
    `);
    return rows as SentimentTrends[];
  } finally {
    await connection.end();
  }
}

async function getMostEngagedUsers(): Promise<UserEngagement[]> {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(`
      SELECT 
        user_uid,
        COUNT(*) as message_count,
        AVG(char_count) as avg_chars,
        SUM(CASE WHEN has_emojis = 1 THEN 1 ELSE 0 END) as emoji_count
      FROM message 
      GROUP BY user_uid
      ORDER BY message_count DESC
      LIMIT 5
    `);
    return rows as UserEngagement[];
  } finally {
    await connection.end();
  }
} 

module.exports = {
  getConnection,
  getMessages,
  getSentimentStats,
  getMessageStats,
  getTopTopics,
  getEmojiAnalysis,
  getSentimentTrends,
  getMostEngagedUsers
}; 