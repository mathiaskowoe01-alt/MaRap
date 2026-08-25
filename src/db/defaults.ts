import type { Category } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-work',
    user_id: 'user-default',
    name: 'Travail',
    color: '#2563EB', // Accent blue
    icon: 'Briefcase'
  },
  {
    id: 'cat-personal',
    user_id: 'user-default',
    name: 'Perso',
    color: '#EA580C', // Terrestrial orange
    icon: 'User'
  },
  {
    id: 'cat-health',
    user_id: 'user-default',
    name: 'Santé',
    color: '#059669', // Emerald success green
    icon: 'Heart'
  },
  {
    id: 'cat-shopping',
    user_id: 'user-default',
    name: 'Courses',
    color: '#7C3AED', // Purple
    icon: 'ShoppingCart'
  },
  {
    id: 'cat-finance',
    user_id: 'user-default',
    name: 'Finance',
    color: '#D97706', // Gold warning
    icon: 'DollarSign'
  }
];
