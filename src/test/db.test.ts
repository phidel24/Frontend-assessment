/**
 * Database Tests for db.ts
 * This file runs end-to-end tests against the database functions.
 */

require('dotenv').config();
const db = require('../lib/db');

/* Assertion Helpers */
function customExpect(actual: any) {
  return {
    toBe: (expected: any) => {
      if (actual !== expected) throw new Error(`Expected "${actual}" to be "${expected}"`);
    },
    toBeGreaterThan: (expected: number) => {
      if (actual <= expected) throw new Error(`Expected "${actual}" to be > ${expected}`);
    },
    toBeGreaterThanOrEqual: (expected: number) => {
      if (actual < expected) throw new Error(`Expected "${actual}" to be ≥ ${expected}`);
    },
    toBeLessThanOrEqual: (expected: number) => {
      if (actual > expected) throw new Error(`Expected "${actual}" to be ≤ ${expected}`);
    },
    toHaveProperty: (property: string) => {
      if (!(property in actual)) throw new Error(`Missing property "${property}"`);
    },
    toContain: (item: any) => {
      if (!Array.isArray(actual) || !actual.includes(item))
        throw new Error(`Expected array to contain "${item}"`);
    },
    toBeCloseTo: (expected: number, precision: number = 2) => {
      const tolerance = Math.pow(10, -precision);
      if (Math.abs(actual - expected) > tolerance)
        throw new Error(`Expected "${actual}" to be close to ${expected} ± ${tolerance}`);
    }
  };
}

/* Testing the Functions  */
async function testGetMessages() {
  console.log('Testing getMessages...');
  const messages = await db.getMessages();
  customExpect(Array.isArray(messages)).toBe(true);
  customExpect(messages.length).toBeGreaterThan(0);

  const first = messages[0];
  customExpect(first).toHaveProperty('id');
  customExpect(first).toHaveProperty('text');
  customExpect(first).toHaveProperty('sentiment_label');

  console.log(`Found ${messages.length} messages`);
}

async function testGetSentimentStats() {
  console.log('Testing getSentimentStats...');
  const stats = await db.getSentimentStats();
  customExpect(Array.isArray(stats)).toBe(true);
  customExpect(stats.length).toBeGreaterThan(0);

  stats.forEach((stat: any) => {
    customExpect(stat).toHaveProperty('sentiment_label');
    customExpect(stat).toHaveProperty('count');
    customExpect(stat).toHaveProperty('avg_score');
    customExpect(['positive', 'negative', 'neutral']).toContain(stat.sentiment_label);
  });

  console.log(`Found ${stats.length} sentiment categories`);
}

async function testGetMessageStats() {
  console.log('Testing getMessageStats...');
  const stats = await db.getMessageStats();

  ['total_messages', 'avg_chars', 'avg_words', 'messages_with_emojis', 'unique_users']
    .forEach(prop => customExpect(stats).toHaveProperty(prop));

  customExpect(stats.total_messages).toBeGreaterThan(0);
  customExpect(stats.unique_users).toBeGreaterThan(0);

  console.log(`Messages: ${stats.total_messages}, Users: ${stats.unique_users}`);
}

async function testGetTopTopics() {
  console.log('Testing getTopTopics...');
  const topics = await db.getTopTopics();
  customExpect(Array.isArray(topics)).toBe(true);
  customExpect(topics.length).toBeGreaterThan(0);
  customExpect(topics.length).toBeLessThanOrEqual(5);

  const validTopics = [
    'Aufstieg',
    'Bier/Sponsoring',
    'Präsidentschaft',
    'Spiele/Aufstellung',
    'Stadion/Atmosphäre',
    'Sonstiges'
  ];

  topics.forEach((t: any) => {
    customExpect(t).toHaveProperty('topic');
    customExpect(t).toHaveProperty('count');
    customExpect(validTopics).toContain(t.topic);
  });

  console.log(`Found ${topics.length} top topics`);
}

async function testGetEmojiAnalysis() {
  console.log('Testing getEmojiAnalysis...');
  const analysis = await db.getEmojiAnalysis();

  ['total_messages', 'messages_with_emojis', 'emoji_percentage']
    .forEach(prop => customExpect(analysis).toHaveProperty(prop));

  customExpect(analysis.total_messages).toBeGreaterThan(0);
  customExpect(analysis.emoji_percentage).toBeGreaterThanOrEqual(0);
  customExpect(analysis.emoji_percentage).toBeLessThanOrEqual(100);

  const calcPct = (analysis.messages_with_emojis / analysis.total_messages) * 100;
  customExpect(analysis.emoji_percentage).toBeCloseTo(calcPct, 1);

  console.log(`Emoji usage: ${analysis.emoji_percentage}%`);
}

async function testGetSentimentTrends() {
  console.log('Testing getSentimentTrends...');
  const trends = await db.getSentimentTrends();
  customExpect(Array.isArray(trends)).toBe(true);
  customExpect(trends.length).toBeGreaterThan(0);

  trends.forEach((t: any) => {
    customExpect(t).toHaveProperty('sentiment_label');
    customExpect(t).toHaveProperty('count');
    customExpect(t).toHaveProperty('avg_words');
    customExpect(t).toHaveProperty('avg_chars');
    customExpect(['positive', 'negative', 'neutral']).toContain(t.sentiment_label);
  });

  console.log(`Found ${trends.length} sentiment trends`);
}

async function testGetMostEngagedUsers() {
  console.log('🙋 Testing getMostEngagedUsers...');
  const users = await db.getMostEngagedUsers();
  customExpect(Array.isArray(users)).toBe(true);
  customExpect(users.length).toBeGreaterThan(0);
  customExpect(users.length).toBeLessThanOrEqual(5);

  users.forEach((u: any) => {
    customExpect(u).toHaveProperty('user_uid');
    customExpect(u).toHaveProperty('message_count');
    customExpect(u.message_count).toBeGreaterThan(0);
  });

  console.log(`Found ${users.length} engaged users`);
}

async function testDataConsistency() {
  console.log('Testing data consistency...');
  const [messages, stats, sentiments] = await Promise.all([
    db.getMessages(),
    db.getMessageStats(),
    db.getSentimentStats()
  ]);

  customExpect(messages.length).toBeLessThanOrEqual(stats.total_messages);

  const totalSentimentMessages = sentiments.reduce((sum: number, s: any) => sum + s.count, 0);
  customExpect(totalSentimentMessages).toBeLessThanOrEqual(stats.total_messages);

  console.log('Data consistency checks passed');
}

/* Test Runner */
async function runDbTests() {
  const tests = [
    testGetMessages,
    testGetSentimentStats,
    testGetMessageStats,
    testGetTopTopics,
    testGetEmojiAnalysis,
    testGetSentimentTrends,
    testGetMostEngagedUsers,
    testDataConsistency
  ];

  let passed = 0;

  for (const test of tests) {
    try {
      await test();
      passed++;
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error! ${test.name} failed:`, err.message);
      } else {
        console.error(`Error! ${test.name} failed:`, err);
      }
    }
  }

  console.log(`\n${passed}/${tests.length} tests passed.`);
  process.exit(passed === tests.length ? 0 : 1);
}

if (require.main === module) {
  runDbTests();
}
