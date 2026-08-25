-- MaRap Database Schema
-- Run this in your Supabase SQL Editor to enable full cloud synchronization.

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- 2. Create tasks table (with foreign key reference to categories)
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  due_date TEXT NOT NULL,
  due_time TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  is_all_day BOOLEAN NOT NULL,
  recurrence_rule TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

-- 3. Create reminders table (with cascade delete when parent task is deleted)
CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  recurrence_rule TEXT,
  notification_id_local TEXT NOT NULL,
  status TEXT NOT NULL
);

-- 4. Create push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  subscription JSONB NOT NULL,
  device_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
