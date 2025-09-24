/*
  # Research Navigator Database Schema

  1. New Tables
    - `papers`: Stores research paper information
      - `id` (uuid, primary key)
      - `title` (text)
      - `authors` (text[])
      - `publication_year` (integer)
      - `publication_type` (text)
      - `field` (text)
      - `keywords` (text[])
      - `doi` (text, unique)
      - `abstract` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_papers`: Links users to papers they've interacted with
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `paper_id` (uuid, references papers)
      - `folder_id` (uuid, references folders)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `folders`: User-created folders for organizing papers
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `search_history`: Tracks user search history
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `query` (text)
      - `filters` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Papers table
CREATE TABLE papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text[] NOT NULL,
  publication_year integer NOT NULL,
  publication_type text NOT NULL,
  field text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  doi text UNIQUE,
  abstract text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Folders table
CREATE TABLE folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Papers table
CREATE TABLE user_papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  paper_id uuid REFERENCES papers(id) NOT NULL,
  folder_id uuid REFERENCES folders(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Search History table
CREATE TABLE search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  query text NOT NULL,
  filters jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Papers are viewable by all authenticated users"
  ON papers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their folders"
  ON folders FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = folders.user_id));

CREATE POLICY "Users can create folders"
  ON folders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can update their folders"
  ON folders FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can delete their folders"
  ON folders FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can view their paper interactions"
  ON user_papers FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_papers.user_id));

CREATE POLICY "Users can create paper interactions"
  ON user_papers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can update their paper interactions"
  ON user_papers FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can delete their paper interactions"
  ON user_papers FOR DELETE
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can view their search history"
  ON search_history FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM profiles WHERE id = search_history.user_id));

CREATE POLICY "Users can create search history"
  ON search_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (SELECT user_id FROM profiles WHERE id = user_id));

-- Triggers for updated_at
CREATE TRIGGER set_papers_updated_at
  BEFORE UPDATE ON papers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_user_papers_updated_at
  BEFORE UPDATE ON user_papers
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();