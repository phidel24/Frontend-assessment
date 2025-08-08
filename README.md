# HSV Message Analytics Dashboard

A Next.js dashboard that analyzes sentiment and engagement patterns from HSV fan messages stored in MariaDB.

## Features

- **Sentiment Analysis**: Shows positive vs negative message distribution with average scores
- **Message Statistics**: Total messages, average characters/words, emoji usage percentage
- **Topic Analysis**: Categorizes messages into topics like "Aufstieg", "Bier/Sponsoring", "Präsidentschaft"
- **User Engagement**: Tracks most active users and their message patterns
- **Real-time Data**: Live connection to MariaDB with seeded German fan messages

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Charts**: Recharts for data visualization
- **Database**: MariaDB with sentiment analysis fields
- **Deployment**: Docker Compose for easy setup

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm

### Setup

1. **Clone and install dependencies**
   ```bash
   cd frontend-assessment
   npm install
   ```

2. **Start the database and frontend**
   ```bash
   # From the root directory (where docker-compose.yml is)
   docker-compose up --build
   ```
   
   Docker takes care of the database setup, it starts:
   - MariaDB on port 3306 with seeded data
   - Next.js dev server on port 3000

3. **Access the dashboard**
   ```
   http://localhost:3000
   ```

## Data Structure

The `message` table contains fan messages with these key fields:

- `text`: The actual message content
- `sentiment_score`: Numeric sentiment value (-1 to 1)
- `sentiment_label`: "positive" or "negative"
- `char_count`: Character count per message
- `word_count`: Word count per message
- `has_emojis`: Boolean flag for emoji usage
- `user_uid`: Unique user identifier
- `creationdate`: Timestamp

The database comes pre-seeded with German HSV fan messages that have been enriched with sentiment analysis.

## How It Works

### Database Connection
- `src/lib/db.ts` handles all database queries
- Uses environment variables from `.env` file
- Connection pooling for efficient queries

### Key Components

**Stats Cards** (`src/components/StatsCards.tsx`)
- Shows total messages, unique users, emoji usage
- Animated cards with color-coded metrics

**Sentiment Chart** (`src/components/SentimentChart.tsx`)
- Pie chart of positive vs negative messages
- Displays average sentiment scores

**Topic Analysis** (`src/components/TopicAnalysis.tsx`)
- Bar chart of top discussion topics
- Uses keyword matching to categorize messages

**Message Timeline** (`src/components/MessageTimeline.tsx`)
- Recent messages with sentiment indicators
- Shows character/word counts

### Data Flow
1. Server components fetch data from MariaDB
2. Data is processed and formatted for charts
3. Client components render interactive visualizations
4. Real-time updates when database changes

## Development

### Running Locally
```bash
# Start database only
docker-compose up db

# In another terminal, start frontend
cd frontend-assessment
npm run dev
```

### Environment Variables
Create a `.env` file in the frontend-assessment directory:
```env
DB_HOST=localhost
DB_PORT=3306
MYSQL_USER=candidate
MYSQL_PASSWORD=!Assessment123
MYSQL_DATABASE=u482046758_oneconnect
```

### Testing
```bash
npm run test:db
```
Runs database connection and query tests.

## Project Structure

```
frontend-assessment/
├── src/
│   ├── app/                # Next.js app router
│   ├── components/         # React components
│   ├── lib/
│   |    ├── db.ts          # Database queries
|   |
│   └── test/
|        ├── db.test.ts     # Database tests
|
├── db/                     # SQL initialization scripts
└── docker-compose.yml      # Docker setup
```

The dashboard focuses on practical insights for understanding fan engagement patterns, sentiment trends, and discussion topics around HSV.
