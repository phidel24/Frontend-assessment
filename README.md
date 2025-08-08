# HSV Fan Message Dashboard

Hey there! 👋 This is a dashboard built to analyze messages from HSV fans. It's basically a Next.js app that connects to a MariaDB database and shows some cool insights about what fans are talking about.

## What it does

- **Sentiment stuff**: Shows you how positive or negative the messages are
- **Message stats**: Total messages, average length, emoji usage - the usual metrics
- **Topic breakdown**: Groups messages into topics like "Aufstieg", "Bier/Sponsoring", "Präsidentschaft"
- **User tracking**: See who's posting the most and their patterns
- **Live data**: This connects to MariaDB with some German fan messages seeded

## Tech I used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (love it), Framer Motion for smooth animations
- **Charts**: Recharts for the data viz
- **Database**: MariaDB with sentiment analysis
- **Deployment**: Docker Compose to make setup easy

## Getting it running

### What you need
- Docker and Docker Compose
- Node.js 18+ and npm

### Setup steps

1. **Get the dependencies**
   ```bash
   cd frontend-assessment
   npm install
   ```

2. **Fire up the database and frontend**
   ```bash
   # From the root directory (where docker-compose.yml is)
   docker-compose up --build
   ```
   
   This starts:
   - MariaDB on port 3306 with some sample data
   - Next.js dev server on port 3000

3. **Check it out**
   ```
   http://localhost:3000
   ```

## About the data

The `message` table has fan messages with these fields:

- `text`: The actual message
- `sentiment_score`: How positive/negative (-1 to 1)
- `sentiment_label`: "positive" or "negative"
- `char_count`: Character count
- `word_count`: Word count
- `has_emojis`: Whether it has emojis
- `user_uid`: User ID
- `creationdate`: When it was posted

This is already pre-seeded with German HSV fan messages and added sentiment analysis.

## How it works

### Database 
- `src/lib/db.ts` handles all the database queries
- Uses environment variables from `.env`
- Each query creates a new connection and closes it after use


### Main components

**Stats Cards** (`src/components/StatsCards.tsx`)
- This shows the total messages, unique users, emoji usage
- Nice animated cards with color-coded metrics

**Sentiment Chart** (`src/components/SentimentChart.tsx`)
- There is a Pie chart showing positive vs negative messages
- Displays average sentiment scores

**Topic Analysis** (`src/components/TopicAnalysis.tsx`)
- There is a Bar chart of top discussion topics
- Uses keyword matching to categorize messages

**Message Timeline** (`src/components/MessageTimeline.tsx`)
- Recent messages with sentiment indicators
- Shows character/word counts

### Data flow
1. Server components grab data from MariaDB
2. Data gets processed and formatted for charts
3. Client components render the interactive visualizations
4. Updates in real-time when database changes

## Development

### Running locally
```bash
# Just start the database
docker-compose up db

# In another terminal, start the frontend
cd frontend-assessment
npm run dev
```

### Environment variables
Create a `.env` file in the frontend-assessment directory:
```env
DB_HOST=localhost
DB_PORT=3306
MYSQL_USER
MYSQL_PASSWORD
MYSQL_DATABASE
```

### Testing
```bash
npm run test:db
```
Runs the database connection and query tests.

## Project structure

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

The dashboard gives you practical insights into fan engagement patterns, sentiment trends, and what topics HSV fans are discussing most.