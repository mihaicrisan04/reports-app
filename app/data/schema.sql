-- Create users table
CREATE TABLE public.users (
    id bigint primary key generated always as identity,
    auth_user_id uuid references auth.users(id) on delete cascade,
    name text,
    role text,  -- e.g., 'parent', 'educator', 'psychiatrist'
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create children table
CREATE TABLE public.children (
    id bigint primary key generated always as identity,
    name text,
    date_of_birth date,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

-- Create children_users table
CREATE TABLE public.children_users (
    id bigint primary key generated always as identity,
    user_id bigint references public.users(id) on delete cascade,
    child_id bigint references public.children(id) on delete cascade,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.children_users ENABLE ROW LEVEL SECURITY;

-- Create behaviours table
CREATE TABLE public.behaviours (
    id bigint primary key generated always as identity,
    description text,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.behaviours ENABLE ROW LEVEL SECURITY;

-- Create classes table
CREATE TABLE public.classes (
    id bigint primary key generated always as identity,
    class_code text unique,
    owner_id bigint references public.users(id) on delete cascade,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create class_users table
CREATE TABLE public.class_users (
    id bigint primary key generated always as identity,
    class_id bigint references public.classes(id) on delete cascade,
    user_id bigint references public.users(id) on delete cascade,
    role text,  -- e.g., 'owner', 'spectator'
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.class_users ENABLE ROW LEVEL SECURITY;

-- Create class_children table
CREATE TABLE public.class_children (
    id bigint primary key generated always as identity,
    class_id bigint references public.classes(id) on delete cascade,
    child_id bigint references public.children(id) on delete cascade,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.class_children ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.class_behaviours (
    id bigint primary key generated always as identity,
    class_id bigint references public.classes(id) on delete cascade,
    behaviour_id bigint references public.behaviours(id) on delete cascade,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.class_behaviours ENABLE ROW LEVEL SECURITY;

-- Create reports table
CREATE TABLE public.reports (
    id bigint primary key generated always as identity,
    class_id bigint references public.classes(id) on delete cascade,
    child_id bigint references public.children(id) on delete cascade,
    additional_observation text,
    report_date date,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.report_behaviours (
    id bigint primary key generated always as identity,
    report_id bigint references public.reports(id) on delete cascade,
    behaviour_id bigint references public.behaviours(id) on delete cascade,
    created_at timestamp with time zone default now()
) WITH (OIDS=FALSE);
ALTER TABLE public.report_behaviours ENABLE ROW LEVEL SECURITY;