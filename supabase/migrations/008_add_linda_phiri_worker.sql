-- Featured house cleaner for landing page (Airbnb / short-stay turnover)
INSERT INTO users (id, phone, role, full_name, status, phone_verified, created_at) VALUES
('a0000000-0000-0000-0000-000000000011', '+260961111112', 'worker', 'Linda Phiri', 'active', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO worker_profiles (
  id, user_id, full_name, date_of_birth, gender, city, area, bio,
  experience_years, expected_salary_min, expected_salary_max, availability_status,
  employment_types, languages, skills, category, subcategory, profile_photo_url,
  trust_score, verification_level, verification_status, total_jobs_completed,
  total_reviews, average_rating, is_featured, created_at
) VALUES
(
  'b0000000-0000-0000-0000-000000000011',
  'a0000000-0000-0000-0000-000000000011',
  'Linda Phiri', '1994-04-08', 'female', 'Lusaka', 'Longacres',
  'I specialise in between-guest cleans for Airbnb and short-stay homes across Lusaka. Linen changes, restocking essentials, and photo-ready handovers before the next guest arrives.',
  5, 180000, 320000, 'available',
  '["part_time", "full_time", "contract"]',
  '["English", "Nyanja", "Bemba"]',
  '["airbnb_turnover", "linen_change", "deep_cleaning", "restocking", "laundry"]',
  'house_cleaner', 'airbnb_cleaning',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
  86, 'gold', 'approved', 14, 9, 4.8, TRUE, NOW()
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO reviews (id, booking_id, reviewer_id, reviewee_id, review_type, overall_rating, punctuality, quality, professionalism, communication, comment, is_visible, created_at) VALUES
('e0000000-0000-0000-0000-000000000013', NULL, 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000011', 'booking', 5, 5, 5, 5, 5, 'Linda turned our Airbnb around perfectly between guests. Spotless, on time, and great communication.', TRUE, NOW() - INTERVAL '12 days')
ON CONFLICT (id) DO NOTHING;
