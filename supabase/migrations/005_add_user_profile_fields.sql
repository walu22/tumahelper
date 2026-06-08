-- Add profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS area VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_city_area ON users(city, area);
