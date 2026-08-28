-- Re-run this in Supabase SQL Editor after every `npm run db:push`.
-- drizzle-kit push resets Row Level Security on any table it touches,
-- even when only adding/altering columns (no table recreation).
ALTER TABLE public.coffee_spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasting_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atelier_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ateliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atelier_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atelier_quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_sessions ENABLE ROW LEVEL SECURITY;
