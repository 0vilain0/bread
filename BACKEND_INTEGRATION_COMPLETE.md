# BREAD Backend Integration - Implementation Complete

## ✅ Self-Hosted API Refactor Summary

The BREAD application has been successfully migrated from an external FastAPI backend to a fully self-hosted Next.js backend using App Router Route Handlers.

---

## 🏗️ Architecture Overview

### Frontend Layer
- **Framework**: Next.js 14 (App Router)
- **Components**: AssessmentForm, RoadmapDashboard, DailyQuiz
- **State Management**: BreadContext (React Context)
- **Styling**: Tailwind CSS + Framer Motion

### API Layer (Next.js Route Handlers)
Location: `app/api/`

#### Roadmap & Quiz Generation
- **`GET/POST /api/health`** - Health check endpoint
- **`POST /api/generate-roadmap`** - AI roadmap generation (mocked with fallback data)
- **`POST /api/generate-quiz`** - Quiz generation (mocked with fallback data)

#### Social/Study Features (Prisma-backed)
- **`POST /api/clans/create`** - Create study clan with join code
- **`POST /api/clans/join`** - Join clan with code, auto-init 50 credits
- **`GET/POST /api/posts`** - Study post CRUD (bounty validation included)
- **`GET/POST /api/chat/messages`** - Clan chat messages
- **`GET /api/chat/poll`** - Poll for new messages (long-polling support)
- **`POST /api/matches/complete`** - Atomic escrow credit transfer with row-level locking

### Database Layer
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Connection**: `DATABASE_URL` from `.env`
- **Singleton Pattern**: `lib/prisma.ts` with NODE_ENV check for dev reuse

---

## 📊 Database Schema

```prisma
Profile (User accounts)
  ├─ id, name, email, role (USER/ADMIN)
  └─ relationships: tables, posts, matches, messages

Table (Study clans)
  ├─ id, name, description, joinCode (unique), ownerId
  └─ members: TableMember[], posts, matches, messages

TableMember (Clan membership + credits)
  ├─ id, profileId, tableId, credits (default 50), joinedAt
  └─ composite unique: (profileId, tableId)

StudyPost (Learning bounties)
  ├─ id, tableId, authorId, title, content
  ├─ type: OFFER | REQUEST
  └─ bountyPrice (validated against member credits)

Match (Credit escrow transactions)
  ├─ id, tableId, learnerId, teacherId, bountyPrice
  ├─ status: PENDING | COMPLETED | CANCELLED
  └─ atomic transfer with row-level locks (FOR UPDATE)

Message (Real-time chat)
  ├─ id, tableId, authorId, content, createdAt
  └─ polling-friendly timestamp ordering
```

---

## 🔄 Data Flow

### 1. Assessment → Roadmap Generation
```
AssessmentForm.tsx
  ↓ (calls generateRoadmap)
utils/api.ts
  ↓ (POST /api/generate-roadmap)
app/api/generate-roadmap/route.ts
  ↓ (uses generateMockRoadmap)
utils/mockData.ts
  ↓ (returns structured roadmap)
BreadContext → setRoadmap
  ↓
RoadmapDashboard renders
```

### 2. Roadmap Step → Quiz Generation
```
RoadmapDashboard.tsx
  ↓ (calls generateQuiz on step click)
utils/api.ts
  ↓ (POST /api/generate-quiz)
app/api/generate-quiz/route.ts
  ↓ (uses generateMockQuiz)
utils/mockData.ts
  ↓ (returns quiz questions)
BreadContext → setQuizQuestions
  ↓
DailyQuiz renders
```

### 3. Clan Escrow Transaction
```
Frontend (match completion button)
  ↓ (POST /api/matches/complete)
app/api/matches/complete/route.ts
  ↓ (Prisma transaction starts)
  ├─ SELECT TableMember FOR UPDATE (learner + teacher)
  ├─ Validate credits under lock
  ├─ UPDATE learner credits (subtract)
  ├─ UPDATE teacher credits (add)
  └─ UPDATE match status → COMPLETED
  ↓
Atomic commit or rollback
```

---

## 🚀 Deployment Checklist

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local:
#   DATABASE_URL=postgresql://user:password@localhost:5432/bread
#   SUPER_ADMIN_EMAIL=admin@bread.local

# 3. Apply Prisma schema
npx prisma generate
npx prisma migrate dev --name init

# 4. (Optional) Seed test data
npx prisma db seed

# 5. Start dev server
npm run dev

# 6. Verify
curl http://localhost:3000/api/health
```

### Production (Vercel / Self-Hosted)
```bash
# Build Next.js
npm run build
npm start

# Ensure:
# - DATABASE_URL points to production PostgreSQL
# - SUPER_ADMIN_EMAIL is set for admin operations
# - Prisma migrations are applied: npx prisma migrate deploy
```

---

## ✨ Key Improvements

1. **No External Dependencies**
   - Removed FastAPI backend requirement
   - All APIs now run within Next.js process
   - Simplified deployment (single container/process)

2. **Strong Transaction Safety**
   - Row-level locks (FOR UPDATE) on credit transfers
   - Atomic escrow ensures no race conditions
   - Rollback on any error in transaction

3. **Mock Data Fallback**
   - `generateRoadmap()` and `generateQuiz()` use mocked data
   - Easy to swap in real AI API (Gemini/OpenAI) later
   - No external API call required for demo

4. **Error Handling Improved**
   - Removed hardcoded localhost:8000 references
   - User-friendly error messages
   - Proper HTTP status codes

5. **Database-First Social Features**
   - Clans, posts, matches, messages all Prisma-backed
   - Credit system with bounty validation
   - Real-time polling support via chat endpoints

---

## 📝 Next Steps (Optional)

1. **Real AI Integration**
   - Replace `generateMockRoadmap()` in `app/api/generate-roadmap/route.ts` with actual Gemini/OpenAI calls
   - Add `GEMINI_API_KEY` or `OPENAI_API_KEY` to `.env`

2. **Database Seeding**
   - Create `prisma/seed.ts` for initial data
   - Run `npx prisma db seed` after migration

3. **Authentication**
   - Add NextAuth.js for email-based login
   - Protect routes with middleware

4. **WebSocket Chat** (Optional)
   - Replace polling with Socket.io for real-time messages
   - Update Message route to broadcast via socket

5. **Analytics & Monitoring**
   - Add request logging (Morgan, Pino)
   - Monitor Prisma query performance

---

## 🔗 File References

- **API Routes**: `app/api/**/*.ts`
- **Database Client**: `lib/prisma.ts`
- **Schema**: `prisma/schema.prisma`
- **Mock Data**: `utils/mockData.ts`
- **API Utilities**: `utils/api.ts`
- **Components**: `components/{AssessmentForm,RoadmapDashboard,DailyQuiz}.tsx`
- **Context**: `context/BreadContext.tsx`

---

## ✅ Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend Components | ✅ Complete | Using internal `/api` routes |
| Route Handlers | ✅ Complete | All CRUD endpoints scaffolded |
| Prisma Schema | ✅ Complete | Profiles, Tables, Members, Posts, Matches, Messages |
| Prisma Client | ✅ Complete | Singleton pattern in `lib/prisma.ts` |
| Health Endpoint | ✅ Complete | `/api/health` for readiness checks |
| Escrow Logic | ✅ Complete | Row-level locks + atomic transactions |
| Error Messages | ✅ Updated | Removed localhost:8000 references |
| Mock Data | ✅ Integrated | Roadmap & Quiz generation working |
| Database Migration | ⏳ Manual | Run `npx prisma migrate dev` to apply |

---

**Ready for local testing and deployment!**
