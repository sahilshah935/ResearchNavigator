/*
  # Remove foreign key constraints

  1. Changes
    - Remove foreign key constraint from folders table
    - Remove foreign key constraint from user_papers table
    - Keep the user_id column but without the constraint

  2. Security
    - Maintain RLS policies
    - Keep the basic structure intact
*/

-- Remove foreign key constraints
ALTER TABLE folders DROP CONSTRAINT IF EXISTS folders_user_id_fkey;
ALTER TABLE user_papers DROP CONSTRAINT IF EXISTS user_papers_user_id_fkey;
ALTER TABLE user_papers DROP CONSTRAINT IF EXISTS user_papers_folder_id_fkey;