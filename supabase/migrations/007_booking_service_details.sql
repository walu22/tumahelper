-- Structured service scope (type, rooms, add-ons) for SweepSouth-style bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_details JSONB;
