/*
  # Fix Folders RLS and Profiles Schema

  1. Changes
    - Remove email column from profiles table as it's already in auth.users
    - Update RLS policies for folders table to use auth.uid()

  2. Security
    - Enable RLS on folders table
    - Add policies for CRUD operations based on user_id matching auth.uid()
*/

-- Remove email column from profiles if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles DROP COLUMN email;
  END IF;
END $$;

-- Enable RLS on folders table
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own folders" ON folders;

-- Create new RLS policy for folders
CREATE POLICY "Users can manage their own folders"
ON folders
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);