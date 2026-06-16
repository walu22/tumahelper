-- Service categories
INSERT INTO service_categories (id, name, slug, description, icon, sort_order, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Nanny Services', 'nanny-services', 'Professional childcare for your family. Background-checked, reference-verified nannies for full-time, part-time, or occasional care.', 'baby', 1, NOW()),
('22222222-2222-2222-2222-222222222222', 'House Cleaning', 'house-cleaning', 'Reliable home cleaning services. Verified cleaners for regular maintenance, deep cleaning, laundry, and more.', 'home', 2, NOW());

-- Admin user
INSERT INTO users (id, phone, role, status, phone_verified, created_at) VALUES
('00000000-0000-0000-0000-000000000001', '+260970000001', 'admin', 'active', TRUE, NOW());

-- Sample customers (needed for reviews)
INSERT INTO users (id, phone, role, status, phone_verified, created_at) VALUES
('f0000000-0000-0000-0000-000000000001', '+260976666666', 'customer', 'active', TRUE, NOW()),
('f0000000-0000-0000-0000-000000000002', '+260977777777', 'customer', 'active', TRUE, NOW()),
('f0000000-0000-0000-0000-000000000003', '+260978888888', 'customer', 'active', TRUE, NOW());

-- Sample workers (users)
INSERT INTO users (id, phone, role, status, phone_verified, created_at) VALUES
('a0000000-0000-0000-0000-000000000001', '+260961111111', 'worker', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000002', '+260962222222', 'worker', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000003', '+260963333333', 'worker', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000004', '+260964444444', 'worker', 'active', TRUE, NOW()),
('a0000000-0000-0000-0000-000000000005', '+260965555555', 'worker', 'active', TRUE, NOW());

-- Sample worker profiles
INSERT INTO worker_profiles (
  id, user_id, full_name, nrc_number, date_of_birth, gender, city, area, bio,
  experience_years, expected_salary_min, expected_salary_max, availability_status,
  employment_types, languages, skills, category, subcategory, profile_photo_url,
  trust_score, verification_level, verification_status, total_jobs_completed,
  total_reviews, average_rating, is_featured, created_at
) VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Sarah Mulenga', '123456/78/1', '1990-03-15', 'female', 'Lusaka', 'Kabulonga',
  'I''ve been working as a nanny in Kabulonga for 5 years now. I''m first aid certified and love planning creative learning games and reading to children. I want to build a safe, happy environment for your kids.',
  5, 250000, 350000, 'available',
  '["full_time", "part_time", "live_out"]', '["English", "Bemba", "Nyanja"]',
  '["infant_care", "meal_prep", "homework_help", "first_aid"]',
  'nanny', 'day_nanny', '/helpers/sarah.png',
  87, 'gold', 'approved', 12, 8, 4.8, TRUE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'Grace Banda', '234567/89/2', '1985-07-22', 'female', 'Lusaka', 'Woodlands',
  'I do deep cleaning and general housekeeping around Woodlands. I''m very detail-oriented and bring my own eco-friendly supplies. I take pride in leaving bathrooms and kitchens sparkling.',
  3, 150000, 250000, 'available',
  '["part_time", "full_time"]', '["English", "Nyanja"]',
  '["deep_cleaning", "laundry", "ironing", "window_cleaning"]',
  'house_cleaner', 'general_cleaning', '/helpers/grace_banda.png',
   72, 'silver', 'approved', 8, 5, 4.5, TRUE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'Esther Zulu', '345678/90/3', '1988-11-05', 'female', 'Lusaka', 'Roma',
  'I specialize in newborn and infant care, and I have 7 years of experience in Roma and nearby areas. I''m knowledgeable in sleep training, baby-led weaning, and early childhood milestones.',
  7, 200000, 300000, 'available',
  '["live_in", "full_time"]', '["English", "Bemba"]',
  '["newborn_care", "sleep_training", "meal_prep", "early_education"]',
  'nanny', 'live_in_nanny', '/helpers/esther.png',
  91, 'gold', 'approved', 18, 12, 4.9, TRUE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000004',
  'Mary Chileshe', '456789/01/4', '1992-01-30', 'female', 'Lusaka', 'Mandevu',
  'Hardworking house cleaner. I take pride in leaving every home spotless. Available for weekly or bi-weekly cleaning.',
  2, 100000, 200000, 'available',
  '["part_time", "full_time"]', '["English", "Bemba", "Nyanja"]',
  '["general_cleaning", "laundry", "organization"]',
  'house_cleaner', 'general_cleaning', 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop',
  65, 'bronze', 'approved', 4, 3, 4.2, FALSE, NOW()
),
(
  'b0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000005',
  'Catherine Mwale', '567890/12/5', '1980-09-12', 'female', 'Lusaka', 'Olympia',
  'I''m a dedicated caregiver and nanny with 10 years of experience. I support eldercare (medication reminders, mobility) and infant care in Olympia. I''m patient, warm, and CPR certified.',
  10, 300000, 450000, 'available',
  '["full_time", "live_in", "part_time"]', '["English", "Nyanja", "Tonga"]',
  '["eldercare", "medication_reminders", "meal_prep", "mobility_assistance", "infant_care"]',
  'nanny', 'day_nanny', '/helpers/catherine.png',
  94, 'platinum', 'approved', 25, 20, 4.9, TRUE, NOW()
);

-- Sample verification documents
INSERT INTO verification_documents (id, worker_id, document_type, file_url, file_name, status, reviewed_by, reviewed_at, created_at) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'nrc_front', 'https://placeholder.com/sarah-nrc-front.jpg', 'sarah-nrc-front.jpg', 'approved', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'nrc_back', 'https://placeholder.com/sarah-nrc-back.jpg', 'sarah-nrc-back.jpg', 'approved', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'nrc_front', 'https://placeholder.com/esther-nrc-front.jpg', 'esther-nrc-front.jpg', 'approved', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'police_clearance', 'https://placeholder.com/catherine-police.pdf', 'catherine-police.pdf', 'approved', '00000000-0000-0000-0000-000000000001', NOW(), NOW());

-- Sample references
INSERT INTO worker_references (id, worker_id, referee_name, referee_phone, relationship, work_period, status, verified_by, verified_at, created_at) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mrs. Patricia Lungu', '+260971111111', 'Former Employer', 'Jan 2022 - Dec 2023', 'verified', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Mr. James Banda', '+260972222222', 'Former Employer', 'Mar 2020 - Dec 2021', 'verified', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'Mrs. Angela Musonda', '+260973333333', 'Current Employer', 'Jun 2023 - Present', 'verified', '00000000-0000-0000-0000-000000000001', NOW(), NOW());

-- Sample reviews
INSERT INTO reviews (id, booking_id, reviewer_id, reviewee_id, overall_rating, punctuality, quality, professionalism, communication, comment, is_visible, created_at) VALUES
('e0000000-0000-0000-0000-000000000001', NULL, 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 5, 5, 5, 5, 5, 'Sarah is exceptional with our twins. Punctual, caring, and trustworthy. Highly recommended!', TRUE, NOW() - INTERVAL '2 days'),
('e0000000-0000-0000-0000-000000000002', NULL, 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 5, 4, 5, 5, 5, 'Great nanny. Our children love her. Always on time except once due to rain.', TRUE, NOW() - INTERVAL '15 days'),
('e0000000-0000-0000-0000-000000000003', NULL, 'f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 4, 4, 4, 5, 4, 'Grace does a thorough job. Very satisfied with her cleaning.', TRUE, NOW() - INTERVAL '5 days');
