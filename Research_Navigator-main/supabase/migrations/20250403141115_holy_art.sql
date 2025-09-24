/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Add INSERT policy for authenticated users to create their own profile
    - Update existing policies to use auth.uid() directly
    - Ensure policies are properly scoped to user's own data

  2. Changes
    - Drop existing policies
    - Create new, more secure policies for all operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
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