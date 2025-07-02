
-- First, let's check and fix the users table structure
-- Remove any problematic foreign key constraints that might be causing circular references
DO $$
BEGIN
    -- Check if the problematic foreign key exists and drop it
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_id_fkey' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
    END IF;
END $$;

-- Ensure the users table has the correct structure without circular references
-- The users.id should reference auth.users.id, not itself
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.users
ADD CONSTRAINT users_auth_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make sure cafe_id can be null for super admins
ALTER TABLE public.users 
ALTER COLUMN cafe_id DROP NOT NULL;

-- Ensure the cafe_id foreign key exists and is correct
ALTER TABLE public.users
DROP CONSTRAINT IF EXISTS users_cafe_id_fkey;

ALTER TABLE public.users
ADD CONSTRAINT users_cafe_id_fkey 
FOREIGN KEY (cafe_id) REFERENCES public.cafes(id) ON DELETE SET NULL;
