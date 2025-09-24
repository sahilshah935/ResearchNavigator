/*
  # Fix profiles table constraints

  1. Changes
    - Make dob column nullable to allow profile creation without date of birth
    - Update existing policies to ensure proper access control

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity while allowing nullable dob
*/

-- Modify dob column to be nullable
ALTER TABLE profiles ALTER COLUMN dob DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert access to own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access to own profile" ON profiles;

-- Recreate policies with proper permissions
CREATE POLICY "Enable read access to own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access to own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access to own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);