create table public.notes (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone,
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS
alter table public.notes enable row level security;

-- Create policies
create policy "Users can create their own notes"
on public.notes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own notes"
on public.notes for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can update their own notes"
on public.notes for update
to authenticated
using (auth.uid() = user_id);