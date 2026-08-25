-- Schéma de base de données Supabase pour MaRap

-- 1. Table des Catégories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'user-default',
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    icon TEXT NOT NULL
);

-- RLS (Row Level Security) - Optionnel: activer selon les besoins de sécurité.
-- Ici, on permet les opérations anonymes publiques par simplicité pour le MVP.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accès public complet pour categories" ON public.categories 
    FOR ALL USING (true) WITH CHECK (true);

-- 2. Table des Tâches
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'user-default',
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('a_faire', 'en_cours', 'termine')),
    priority TEXT NOT NULL CHECK (priority IN ('basse', 'normale', 'haute')),
    due_date TEXT NOT NULL, -- Format YYYY-MM-DD
    due_time TEXT DEFAULT '', -- Format HH:MM
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    is_all_day BOOLEAN DEFAULT true,
    recurrence_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accès public complet pour tasks" ON public.tasks 
    FOR ALL USING (true) WITH CHECK (true);

-- 3. Table des Rappels (Reminders)
CREATE TABLE IF NOT EXISTS public.reminders (
    id TEXT PRIMARY KEY,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    remind_at TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT CHECK (type IN ('unique', 'recurrent')),
    recurrence_rule TEXT,
    notification_id_local TEXT,
    status TEXT CHECK (status IN ('programme', 'envoye', 'annule', 'complete'))
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Accès public complet pour reminders" ON public.reminders 
    FOR ALL USING (true) WITH CHECK (true);

-- Insérer les catégories système par défaut pour initialiser la DB Cloud
INSERT INTO public.categories (id, user_id, name, color, icon) VALUES
('cat-work', 'user-default', 'Travail', '#2563EB', 'Briefcase'),
('cat-personal', 'user-default', 'Perso', '#EA580C', 'User'),
('cat-health', 'user-default', 'Santé', '#059669', 'Heart'),
('cat-shopping', 'user-default', 'Courses', '#7C3AED', 'ShoppingCart'),
('cat-finance', 'user-default', 'Finance', '#D97706', 'DollarSign')
ON CONFLICT (id) DO NOTHING;
