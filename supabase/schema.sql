-- Supabase database schema for Curiosity Hour rooms
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  code TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (room codes are public anyway)
CREATE POLICY "Allow public read access to rooms"
  ON rooms FOR SELECT
  USING (true);

-- Create policy for public insert access
CREATE POLICY "Allow public insert access to rooms"
  ON rooms FOR INSERT
  WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Allow public update access to rooms"
  ON rooms FOR UPDATE
  USING (true);

-- Create policy for public delete access
CREATE POLICY "Allow public delete access to rooms"
  ON rooms FOR DELETE
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rooms_created_at ON rooms(created_at);

-- Create index for TTL cleanup queries
CREATE INDEX IF NOT EXISTS idx_rooms_updated_at ON rooms(updated_at);