# Personal AI-Powered Education Platform

An intelligent learning platform with AI-driven recommendations, personalized content generation, and adaptive study tracking.

## Features

- **AI-Powered Learning**: OpenAI GPT-4o integration for personalized content, assessments, and recommendations
- **Progress Tracking**: Real-time monitoring of learning streaks, study hours, and subject progress
- **Adaptive Assessments**: AI-generated quizzes that identify strengths and weaknesses
- **Study Sessions**: Time-tracked focused learning with session management
- **Achievement System**: Gamification elements to motivate continuous learning
- **Multi-Subject Support**: Core subjects, programming, aptitude, and languages

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | TanStack Query |
| Backend | Express.js + TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| AI Service | OpenAI GPT-4o |

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or cloud like Neon)
- OpenAI API key

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/saitaruntej/Personal-AI-Powered-Education.git
cd Personal-AI-Powered-Education
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup

Push the database schema:

```bash
npm run db:push
```

## Running the Application

### Development Mode

Run both client and server together (recommended):

```bash
npm run dev
```

The application will be available at:
- **Client**: http://127.0.0.1:5000
- **API**: http://127.0.0.1:5000/api

### Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/
│   ├── index.ts            # Entry point
│   ├── routes.ts           # API routes
│   ├── services/           # AI services (OpenAI)
│   ├── storage.ts          # Database storage
│   └── vite.ts             # Vite integration
├── shared/
│   └── schema.ts           # Database schema
└── package.json
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/:id` | GET | Get user by ID |
| `/api/dashboard/:userId` | GET | Get dashboard stats |
| `/api/subjects` | GET | List all subjects |
| `/api/subjects/:id/courses` | GET | Get courses for subject |
| `/api/users/:id/progress` | GET | Get user progress |
| `/api/ai/generate-content` | POST | Generate AI learning content |
| `/api/ai/generate-assessment` | POST | Generate AI quiz questions |
| `/api/ai/daily-recommendations` | POST | Get AI recommendations |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (client + API) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Customization

### Changing the User

The default user is configured in `server/storage.ts`. To change the user name:

1. Edit `server/storage.ts` - update the default user object
2. Update user references in:
   - `client/src/pages/dashboard.tsx`
   - `client/src/pages/course.tsx`
   - `client/src/pages/assessment.tsx`
   - `client/src/components/ui/sidebar.tsx`
   - `client/src/components/dashboard/ai-recommendations.tsx`
   - `server/services/openai.ts`

### Adding Subjects

Add new subjects in `server/storage.ts` in the `initializeDefaultData()` method.

## Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
OPENAI_API_KEY=your_production_api_key
```

### Build and Deploy

```bash
npm run build
npm start
```

