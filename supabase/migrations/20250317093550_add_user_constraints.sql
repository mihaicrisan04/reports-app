-- Add email column
ALTER TABLE public.users
ADD COLUMN email text NOT NULL;

-- Add role constraint
ALTER TABLE public.users
ADD CONSTRAINT valid_role CHECK (role IN ('parent', 'educator', 'observer'));

-- Add unique constraint on email
ALTER TABLE public.users
ADD CONSTRAINT unique_email UNIQUE (email);

-- Update existing rows with email from auth.users (if needed)
UPDATE public.users
SET email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = public.users.auth_user_id
);