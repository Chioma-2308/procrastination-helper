# Procrastination Helper 🚀

Beat procrastination with bite-sized tasks and gamification!

## Features
- ✅ User authentication (email/password)
- ✅ 30+ pre-built micro-tasks across 5 categories
- ✅ Custom task creation
- ✅ Gamification: Points, levels, streaks, achievements
- ✅ Real-time countdown timers
- ✅ Dark mode
- ✅ Cloud sync across devices
- ✅ Sound effects and celebrations

## Tech Stack
- **Frontend:** React, Next.js 13+, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Authentication, Real-time)
- **Icons:** Lucide React

## Live Demo
🔗 [procrastination-helper.vercel.app/](https://procrastination-helper.vercel.app/)

## Local Setup
```bash
npm install
npm run dev
```

## Database Schema
- **user_progress:** Tracks points, streak, level
- **user_achievements:** Unlocked badges
- **task_history:** Completed tasks log
- **custom_tasks:** User-created tasks

## Security
- Row Level Security (RLS) enabled
- JWT authentication
- Users can only access their own data

## Future Enhancements
- [ ] Google OAuth
- [ ] Leaderboards
- [ ] Daily goals
- [ ] Progress analytics