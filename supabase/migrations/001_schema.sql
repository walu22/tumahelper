-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'worker', 'employer', 'admin')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker profiles
CREATE TABLE worker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  nrc_number VARCHAR(20) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  city VARCHAR(100) NOT NULL DEFAULT 'Lusaka',
  area VARCHAR(100) NOT NULL,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  expected_salary_min INTEGER,
  expected_salary_max INTEGER,
  availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'not_available')),
  employment_types JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  category VARCHAR(50) NOT NULL CHECK (category IN ('nanny', 'house_cleaner')),
  subcategory VARCHAR(100),
  profile_photo_url TEXT,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  trust_score_components JSONB DEFAULT '{}',
  verification_level VARCHAR(20) DEFAULT 'none' CHECK (verification_level IN ('none', 'bronze', 'silver', 'gold', 'platinum')),
  verification_status VARCHAR(20) DEFAULT 'not_submitted' CHECK (verification_status IN ('not_submitted', 'pending', 'approved', 'rejected')),
  total_jobs_completed INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  requires_verification VARCHAR(20) DEFAULT 'bronze',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(10) UNIQUE NOT NULL,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category_id UUID REFERENCES service_categories(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'in_progress', 'completed', 'cancelled', 'disputed')),
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  location_address TEXT NOT NULL,
  location_lat DECIMAL(10,8),
  location_lng DECIMAL(11,8),
  description TEXT,
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  worker_earnings INTEGER NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'confirmed', 'refunded')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('mtn_money', 'airtel_money', 'bank', 'cash')),
  payment_proof_url TEXT,
  customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
  customer_review TEXT,
  worker_rating INTEGER CHECK (worker_rating >= 1 AND worker_rating <= 5),
  worker_review TEXT,
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification documents
CREATE TABLE verification_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('nrc_front', 'nrc_back', 'police_clearance', 'certificate', 'reference_letter', 'address_proof')),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  expiry_date DATE,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Worker references
CREATE TABLE worker_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_name VARCHAR(255) NOT NULL,
  referee_phone VARCHAR(15) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  work_period VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'verified', 'unreachable', 'declined')),
  admin_notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  review_type VARCHAR(20) DEFAULT 'booking' CHECK (review_type IN ('booking', 'employment')),
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  punctuality INTEGER CHECK (punctuality >= 1 AND punctuality <= 5),
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  dispute_status VARCHAR(20) DEFAULT 'none' CHECK (dispute_status IN ('none', 'disputed', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job posts
CREATE TABLE job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('nanny', 'house_cleaner')),
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'live_in', 'contract')),
  working_hours VARCHAR(100),
  required_experience_years INTEGER DEFAULT 0,
  required_verification_level VARCHAR(20) DEFAULT 'bronze',
  required_skills JSONB DEFAULT '[]',
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'filled', 'cancelled')),
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  placement_fee INTEGER NOT NULL,
  placement_fee_paid BOOLEAN DEFAULT FALSE,
  hired_worker_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Job applications
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'interview_scheduled', 'offered', 'hired', 'rejected', 'withdrawn')),
  cover_note TEXT,
  expected_salary INTEGER,
  interview_date TIMESTAMPTZ,
  interview_location VARCHAR(255),
  interview_notes TEXT,
  offer_salary INTEGER,
  hired_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, worker_id)
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_code VARCHAR(20) UNIQUE NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  job_post_id UUID REFERENCES job_posts(id) ON DELETE SET NULL,
  payer_id UUID REFERENCES users(id),
  payee_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  platform_fee INTEGER NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('booking', 'placement_fee', 'subscription', 'refund')),
  payment_method VARCHAR(20) CHECK (payment_method IN ('mtn_money', 'airtel_money', 'bank', 'cash')),
  payment_proof_url TEXT,
  transaction_reference VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'confirmed', 'failed', 'refunded')),
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disputes
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  job_application_id UUID REFERENCES job_applications(id) ON DELETE SET NULL,
  raised_by UUID REFERENCES users(id),
  against_user_id UUID REFERENCES users(id),
  dispute_type VARCHAR(50) NOT NULL CHECK (dispute_type IN ('no_show', 'poor_service', 'payment_issue', 'misconduct', 'fraud', 'document_issue', 'other')),
  description TEXT NOT NULL,
  evidence_urls JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'rejected', 'escalated')),
  resolution TEXT,
  resolution_action VARCHAR(50) CHECK (resolution_action IN ('refund', 'partial_refund', 'worker_suspension', 'account_ban', 'no_action')),
  refund_amount INTEGER,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  channel VARCHAR(20) DEFAULT 'in_app' CHECK (channel IN ('in_app', 'sms', 'whatsapp', 'email')),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);

CREATE INDEX idx_worker_profiles_category ON worker_profiles(category);
CREATE INDEX idx_worker_profiles_city_area ON worker_profiles(city, area);
CREATE INDEX idx_worker_profiles_trust_score ON worker_profiles(trust_score DESC);
CREATE INDEX idx_worker_profiles_verification ON worker_profiles(verification_level);
CREATE INDEX idx_worker_profiles_availability ON worker_profiles(availability_status);
CREATE INDEX idx_worker_profiles_skills ON worker_profiles USING GIN(skills);
CREATE INDEX idx_worker_profiles_languages ON worker_profiles USING GIN(languages);
CREATE INDEX idx_worker_profiles_subcategory ON worker_profiles(subcategory);

CREATE INDEX idx_bookings_customer ON bookings(customer_id, created_at DESC);
CREATE INDEX idx_bookings_worker ON bookings(worker_id, created_at DESC);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_service_date ON bookings(service_date);
CREATE INDEX idx_bookings_category ON bookings(category_id);

CREATE INDEX idx_verification_documents_worker ON verification_documents(worker_id);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);
CREATE INDEX idx_verification_documents_type ON verification_documents(document_type);

CREATE INDEX idx_worker_references_worker ON worker_references(worker_id);
CREATE INDEX idx_worker_references_status ON worker_references(status);

CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id, created_at DESC);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);

CREATE INDEX idx_job_posts_category ON job_posts(category);
CREATE INDEX idx_job_posts_city ON job_posts(city);
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_posts_employer ON job_posts(employer_id);

CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_worker ON job_applications(worker_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_payer ON payments(payer_id);
CREATE INDEX idx_payments_status ON payments(status);

CREATE INDEX idx_disputes_booking ON disputes(booking_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_raised_by ON disputes(raised_by);

CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_admin ON audit_logs(admin_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON worker_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON job_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
