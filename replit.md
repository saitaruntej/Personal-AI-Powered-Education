# Learning Platform for Teja

## Overview

This is a personalized learning platform built for Teja, featuring AI-driven recommendations, progress tracking, and adaptive study sessions. The application combines a React frontend with an Express.js backend, utilizing PostgreSQL for data persistence and OpenAI for intelligent content generation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI GPT-4o for content generation and recommendations
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe sharing between frontend and backend
- **Migration Strategy**: Drizzle Kit for schema migrations

## Key Components

### Database Schema
- **Users**: Personal information, learning streaks, and overall progress
- **Subjects**: Core subjects, programming languages, aptitude tests, and languages
- **Courses**: Structured learning content within subjects
- **User Progress**: Individual progress tracking per subject/course
- **Assessments**: AI-generated quizzes and evaluations
- **Study Sessions**: Time-tracked learning sessions
- **Achievements**: Gamification elements
- **AI Recommendations**: Personalized learning suggestions

### AI Services
- **Content Generation**: Personalized explanations and examples
- **Assessment Creation**: Dynamic quiz generation
- **Weakness Analysis**: Performance evaluation and improvement suggestions
- **Daily Recommendations**: Adaptive study planning
- **Programming Exercises**: Code-based learning activities

### UI Components
- **Dashboard**: Central hub with stats, recommendations, and quick actions
- **Subject Navigation**: Category-based learning organization
- **Assessment System**: Interactive quiz interface
- **Progress Analytics**: Visual progress tracking with charts
- **Study Sessions**: Timer-based focused learning periods

## Data Flow

1. **User Authentication**: Session-based authentication with PostgreSQL storage
2. **Content Request**: Frontend queries backend API endpoints
3. **AI Processing**: Backend integrates with OpenAI for dynamic content
4. **Database Operations**: Drizzle ORM handles all database interactions
5. **Real-time Updates**: TanStack Query manages cache invalidation and updates
6. **Progress Tracking**: Continuous monitoring of learning activities

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL for cloud database hosting
- **AI Service**: OpenAI API for content generation
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling
- **Charts**: Chart.js for progress visualization

### Development Tools
- **Build System**: Vite with React plugin
- **Type Checking**: TypeScript with strict configuration
- **Database Management**: Drizzle Kit for migrations
- **Development Environment**: Replit integration

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon PostgreSQL with connection pooling
- **Environment Variables**: DATABASE_URL and OPENAI_API_KEY configuration

### Production Build
- **Frontend**: Vite build to `dist/public` directory
- **Backend**: esbuild compilation to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Process Management**: Node.js process with environment-based configuration

### Database Management
- **Schema Evolution**: Drizzle migrations in `migrations/` directory
- **Connection Handling**: Neon serverless driver with connection pooling
- **Session Storage**: connect-pg-simple for PostgreSQL session store

## Changelog

Changelog:
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.