-- Add full_name to users table (needed for customers/employers)
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Additional customers
INSERT INTO users (id, phone, full_name, role, status, phone_verified, created_at) VALUES
('f0000000-0000-0000-0000-000000000004', '+260970000004', 'Alice Mwila', 'customer', 'active', TRUE, NOW()),
('f0000000-0000-0000-0000-000000000005', '+260970000005', 'Brian Phiri', 'customer', 'active', TRUE, NOW());

-- Set names on existing customers
UPDATE users SET full_name = 'Margaret Tembo' WHERE id = 'f0000000-0000-0000-0000-000000000001';
UPDATE users SET full_name = 'Joseph Musonda' WHERE id = 'f0000000-0000-0000-0000-000000000002';
UPDATE users SET full_name = 'Dorothy Banda' WHERE id = 'f0000000-0000-0000-0000-000000000003';

-- Additional workers (users)
INSERT INTO users (id, phone, role, full_name, status, phone_verified, created_at) VALUES
('a0000000-0000-0000-0000-000000000006', '+260966666666', 'worker', 'Agnes Banda', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000007', '+260967777777', 'worker', 'Peter Zimba', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000008', '+260968888888', 'worker', 'Joyce Mwansa', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000009', '+260969999999', 'worker', 'Ruth Mwila', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000010', '+260960000000', 'worker', 'David Chanda', 'active', TRUE, NOW());

-- Additional worker profiles
INSERT INTO worker_profiles (
  id, user_id, full_name, date_of_birth, gender, city, area, bio,
  experience_years, expected_salary_min, expected_salary_max, availability_status,
  employment_types, languages, skills, category, subcategory, profile_photo_url,
  trust_score, verification_level, verification_status, total_jobs_completed,
  total_reviews, average_rating, is_featured, created_at
) VALUES
(
  'b0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000006',
  'Agnes Banda', '1993-05-18', 'female', 'Lusaka', 'Matero',
  'Caring nanny with 4 years of experience. I love arts and crafts, outdoor play, and helping with homework. Comfortable with pets.',
  4, 200000, 350000, 'available',
  '["full_time", "part_time", "live_out"]',
  '["English", "Bemba", "Nyanja"]',
  '["infant_care", "homework_help", "pet_care", "meal_prep"]',
  'nanny', 'day_nanny', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop',
  78, 'silver', 'approved', 6, 4, 4.6, FALSE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000007',
  'Peter Zimba', '1990-08-25', 'male', 'Lusaka', 'Chelstone',
  'I do thorough home cleaning and maintenance. Based in Chelstone, I specialize in carpet cleaning, kitchen deep cleans, and general organization. I always make sure the work is done right.',
  6, 150000, 300000, 'available',
  '["full_time", "part_time", "contract"]',
  '["English", "Bemba", "Nyanja", "Lozi"]',
  '["deep_cleaning", "carpet_cleaning", "laundry", "ironing", "organization"]',
  'house_cleaner', 'deep_cleaning', '/helpers/peter_zimba.png',
  82, 'gold', 'approved', 15, 10, 4.7, TRUE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000008',
  'Joyce Mwansa', '1995-12-03', 'female', 'Lusaka', 'Chilanga',
  'Friendly house cleaner offering weekly and bi-weekly cleaning. Specialise in kitchen and bathroom deep cleaning, laundry, and organisation.',
  2, 120000, 220000, 'available',
  '["part_time", "full_time"]',
  '["English", "Nyanja"]',
  '["general_cleaning", "kitchen_deep_clean", "bathroom_cleaning", "laundry"]',
  'house_cleaner', 'general_cleaning', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop',
  62, 'bronze', 'approved', 3, 2, 4.3, FALSE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000009',
  'Ruth Mwila', '1987-02-14', 'female', 'Lusaka', 'Ibex Hill',
  'I''ve been a professional live-in and full-time nanny for 8 years. I''m experienced in baby care, sleep schedules, and preparing nutritious meals. I''m very reliable and focus on child development.',
  8, 350000, 500000, 'available',
  '["live_in", "full_time"]',
  '["English", "Bemba", "Tonga"]',
  '["newborn_care", "sleep_training", "baby_weaning", "milestone_tracking", "cpr_certified"]',
  'nanny', 'live_in_nanny', '/helpers/ruth.png',
  92, 'platinum', 'approved', 22, 18, 4.9, TRUE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000010',
  'David Chanda', '1991-11-20', 'male', 'Lusaka', 'Kalingalinga',
  'Hardworking cleaner with 3 years of experience. I specialise in post-renovation cleaning, move-in/move-out cleaning, and regular maintenance.',
  3, 180000, 320000, 'available',
  '["full_time", "part_time", "contract"]',
  '["English", "Bemba", "Nyanja"]',
  '["post_renovation", "move_cleaning", "window_cleaning", "general_cleaning", "floor_care"]',
  'house_cleaner', 'general_cleaning', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop',
  70, 'silver', 'approved', 8, 6, 4.5, FALSE, NOW()
);

-- Sample bookings (in various statuses)
INSERT INTO bookings (id, booking_code, customer_id, worker_id, category_id, status, service_date, service_time, location_address, description, amount, platform_fee, worker_earnings, payment_status, customer_rating, customer_review, created_at, updated_at) VALUES
('00000001-0000-0000-0000-000000000001', 'TH-BK001', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'completed', CURRENT_DATE - INTERVAL '7 days', '08:00', '15 Mulungushi Road, Kabulonga, Lusaka', 'Looking for full-day care for my 2-year-old twin boys. Need someone experienced with toddlers.', 45000, 4500, 40500, 'confirmed', 5, 'Sarah was amazing with our twins. Punctual, professional, and the kids loved her. Will definitely book again!', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('00000001-0000-0000-0000-000000000002', 'TH-BK002', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'completed', CURRENT_DATE - INTERVAL '14 days', '09:00', '7A Great East Road, Woodlands, Lusaka', 'Weekly house cleaning. 3-bedroom house, focus on kitchen and bathrooms.', 25000, 2500, 22500, 'confirmed', 4, 'Grace does a thorough job. The house is always spotless after her visit.', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
('00000001-0000-0000-0000-000000000003', 'TH-BK003', 'f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'in_progress', CURRENT_DATE + INTERVAL '3 days', '07:00', '42 Leopards Hill Road, Roma, Lusaka', 'Full-time live-out nanny needed for 6-month-old baby. Must be available 7am-5pm weekdays.', 55000, 5500, 49500, 'pending', NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('00000001-0000-0000-0000-000000000004', 'TH-BK004', 'f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'accepted', CURRENT_DATE + INTERVAL '10 days', '06:00', '23 Brentwood Drive, Olympia, Lusaka', 'Need elder care for my 78-year-old mother. Assistance with medication, meals, and companionship. 8am-4pm daily.', 65000, 6500, 58500, 'pending', NULL, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('00000001-0000-0000-0000-000000000005', 'TH-BK005', 'f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'pending', CURRENT_DATE + INTERVAL '14 days', '08:00', '15 Mutende Road, Matero, Lusaka', 'Part-time nanny for school pickup and homework help. 2 children aged 6 and 8. 2pm-6pm weekdays.', 35000, 3500, 31500, 'pending', NULL, NULL, NOW(), NOW()),
('00000001-0000-0000-0000-000000000006', 'TH-BK006', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'cancelled', CURRENT_DATE - INTERVAL '5 days', '10:00', '15 Mulungushi Road, Kabulonga, Lusaka', 'Deep cleaning for 4-bedroom house. Need carpets cleaned and windows done.', 30000, 3000, 27000, 'pending', NULL, NULL, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('00000001-0000-0000-0000-000000000007', 'TH-BK007', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'completed', CURRENT_DATE - INTERVAL '21 days', '09:30', '7A Great East Road, Woodlands, Lusaka', 'Bi-weekly cleaning for 2-bedroom apartment.', 18000, 1800, 16200, 'confirmed', 4, 'Mary does a good job. The apartment is always fresh and clean.', NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
('00000001-0000-0000-0000-000000000008', 'TH-BK008', 'f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000008', '22222222-2222-2222-2222-222222222222', 'in_progress', CURRENT_DATE + INTERVAL '1 day', '08:00', '23 Brentwood Drive, Olympia, Lusaka', 'Weekly general cleaning. 3-bedroom house with open-plan kitchen and living room.', 20000, 2000, 18000, 'pending', NULL, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('00000001-0000-0000-0000-000000000009', 'TH-BK009', 'f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000009', '11111111-1111-1111-1111-111111111111', 'accepted', CURRENT_DATE + INTERVAL '7 days', '07:00', '42 Leopards Hill Road, Roma, Lusaka', 'Live-in nanny for newborn twins. Must have experience with premature babies. 6 days a week.', 75000, 7500, 67500, 'pending', NULL, NULL, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('00000001-0000-0000-0000-000000000010', 'TH-BK010', 'f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'pending', CURRENT_DATE + INTERVAL '5 days', '09:00', '15 Mutende Road, Matero, Lusaka', 'Post-renovation cleaning. 3-bedroom house needs thorough cleaning after renovations. Dust, paint splatters, and general cleanup.', 40000, 4000, 36000, 'pending', NULL, NULL, NOW(), NOW());

-- Add cancellation reason for cancelled booking
UPDATE bookings SET cancellation_reason = 'Change of plans, no longer need cleaning service', cancelled_by = 'f0000000-0000-0000-0000-000000000001' WHERE id = '00000001-0000-0000-0000-000000000006';

-- Additional reviews (for completed bookings that have reviews on the bookings row)
INSERT INTO reviews (id, booking_id, reviewer_id, reviewee_id, review_type, overall_rating, punctuality, quality, professionalism, communication, comment, is_visible, created_at) VALUES
('e0000000-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'booking', 5, 5, 5, 5, 5, 'Sarah was amazing with our twins. Punctual, professional, and the kids loved her. Will definitely book again!', TRUE, NOW() - INTERVAL '7 days'),
('e0000000-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'booking', 4, 4, 4, 5, 4, 'Grace does a thorough job. The house is always spotless after her visit.', TRUE, NOW() - INTERVAL '14 days'),
('e0000000-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000007', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004', 'booking', 4, 4, 3, 4, 4, 'Mary does a good job. The apartment is always fresh and clean.', TRUE, NOW() - INTERVAL '21 days'),

-- Additional reviews for Catherine Mwale (highest rated worker needs more reviews)
('e0000000-0000-0000-0000-000000000007', NULL, 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 'booking', 5, 5, 5, 5, 5, 'Catherine is exceptional. She cared for my mother with such dignity and patience. Highly recommend.', TRUE, NOW() - INTERVAL '30 days'),
('e0000000-0000-0000-0000-000000000008', NULL, 'f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000005', 'booking', 5, 5, 4, 5, 5, 'Wonderful caregiver. Very knowledgeable about medication management. Mom feels safe with her.', TRUE, NOW() - INTERVAL '25 days'),

-- Reviews for Peter Zimba
('e0000000-0000-0000-0000-000000000009', NULL, 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000007', 'booking', 5, 5, 5, 4, 5, 'Peters deep cleaning was outstanding. Carpets look brand new!', TRUE, NOW() - INTERVAL '45 days'),
('e0000000-0000-0000-0000-000000000010', NULL, 'f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000007', 'booking', 4, 4, 4, 5, 5, 'Very professional and thorough. Will hire again for regular cleaning.', TRUE, NOW() - INTERVAL '20 days'),

-- Review for David Chanda
('e0000000-0000-0000-0000-000000000011', NULL, 'f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000010', 'booking', 4, 4, 5, 4, 4, 'Davids post-renovation cleaning was thorough. Got rid of all the construction dust.', TRUE, NOW() - INTERVAL '15 days'),

-- Review for Ruth Mwila
('e0000000-0000-0000-0000-000000000012', NULL, 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000009', 'booking', 5, 5, 5, 5, 5, 'Ruth is a miracle worker with babies. Our daughter has been sleeping through the night since Ruth started.', TRUE, NOW() - INTERVAL '60 days');

-- Update worker stats based on reviews
UPDATE worker_profiles
SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000001'),
    average_rating = COALESCE((SELECT ROUND(AVG(overall_rating)::numeric, 1) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000001'), 0)
WHERE user_id = 'a0000000-0000-0000-0000-000000000001';

UPDATE worker_profiles
SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000005'),
    average_rating = COALESCE((SELECT ROUND(AVG(overall_rating)::numeric, 1) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000005'), 0)
WHERE user_id = 'a0000000-0000-0000-0000-000000000005';

UPDATE worker_profiles
SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000007'),
    average_rating = COALESCE((SELECT ROUND(AVG(overall_rating)::numeric, 1) FROM reviews WHERE reviewee_id = 'a0000000-0000-0000-0000-000000000007'), 0)
WHERE user_id = 'a0000000-0000-0000-0000-000000000007';

-- Sample notifications
INSERT INTO notifications (id, user_id, type, title, message, data, created_at) VALUES
('00000002-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'booking_accepted', 'Booking Accepted', 'You accepted a booking from Dorothy Banda on 42 Leopards Hill Road. Get ready!', '{"bookingId": "00000001-0000-0000-0000-000000000003"}', NOW() - INTERVAL '2 days'),
('00000002-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000005', 'booking_request', 'New Booking Request', 'You have a new booking request from Alice Mwila for elder care services.', '{"bookingId": "00000001-0000-0000-0000-000000000004"}', NOW() - INTERVAL '1 day'),
('00000002-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000009', 'booking_accepted', 'Booking Accepted', 'You accepted a booking from Dorothy Banda for live-in nanny position.', '{"bookingId": "00000001-0000-0000-0000-000000000009"}', NOW() - INTERVAL '2 days');
