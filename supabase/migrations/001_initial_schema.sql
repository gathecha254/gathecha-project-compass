-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text check (category in ('tech', 'academic', 'research', 'business', 'personal')) not null,
  status text check (status in ('active', 'completed', 'paused')) default 'active',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  start_date date not null,
  end_date date,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  status text check (status in ('todo', 'in-progress', 'review', 'done')) default 'todo',
  project_id uuid references public.projects(id) on delete cascade not null,
  due_date date,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  tags text[] default '{}',
  estimated_hours integer,
  actual_hours integer,
  completed boolean default false,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new fields to projects table
alter table public.projects add column if not exists priority text check (priority in ('low', 'medium', 'high')) default 'medium';
alter table public.projects add column if not exists color_label text;
alter table public.projects add column if not exists tags text[] default '{}';
-- Update status enum for projects
alter table public.projects alter column status type text using status::text;
-- For new installs, update the check constraint:
alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects add constraint projects_status_check check (status in ('todo', 'in-progress', 'review', 'done'));

-- Add new fields to tasks table
alter table public.tasks add column if not exists is_review_task boolean default false;
alter table public.tasks add column if not exists started_at timestamp with time zone;
alter table public.tasks add column if not exists completed_at timestamp with time zone;

-- Create indexes for better performance
create index projects_user_id_idx on public.projects(user_id);
create index projects_status_idx on public.projects(status);
create index tasks_project_id_idx on public.tasks(project_id);
create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_status_idx on public.tasks(status);
create index tasks_due_date_idx on public.tasks(due_date);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger projects_updated_at_trigger
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger tasks_updated_at_trigger
  before update on public.tasks
  for each row execute function public.handle_updated_at();