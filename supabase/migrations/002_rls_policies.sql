-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users read own or admin reads all" ON users
  FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users update own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Worker profiles policies
CREATE POLICY "Worker profiles public read" ON worker_profiles
  FOR SELECT USING (true);

CREATE POLICY "Worker manages own profile" ON worker_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admin manages all profiles" ON worker_profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Bookings policies
CREATE POLICY "Booking participants only" ON bookings
  FOR ALL USING (
    auth.uid() = customer_id OR 
    auth.uid() = worker_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Verification documents policies
CREATE POLICY "Worker owns documents, admin reviews" ON verification_documents
  FOR ALL USING (
    auth.uid() = worker_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Worker references policies
CREATE POLICY "Worker owns references, admin verifies" ON worker_references
  FOR ALL USING (
    auth.uid() = worker_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Reviews policies
CREATE POLICY "Reviews public read if visible" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Reviewer manages own review" ON reviews
  FOR ALL USING (auth.uid() = reviewer_id);

CREATE POLICY "Admin manages all reviews" ON reviews
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Job posts policies
CREATE POLICY "Job posts public read if open" ON job_posts
  FOR SELECT USING (status = 'open');

CREATE POLICY "Employer manages own jobs" ON job_posts
  FOR ALL USING (auth.uid() = employer_id);

CREATE POLICY "Admin manages all jobs" ON job_posts
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Job applications policies
CREATE POLICY "Worker sees own applications" ON job_applications
  FOR ALL USING (auth.uid() = worker_id);

CREATE POLICY "Employer sees applications for their jobs" ON job_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM job_posts WHERE id = job_id AND employer_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Payments policies
CREATE POLICY "Payment participants only" ON payments
  FOR ALL USING (
    auth.uid() = payer_id OR 
    auth.uid() = payee_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Disputes policies
CREATE POLICY "Dispute participants and admin" ON disputes
  FOR ALL USING (
    auth.uid() = raised_by OR 
    auth.uid() = against_user_id OR 
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Audit logs policies
CREATE POLICY "Admin only audit logs" ON audit_logs
  FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Notifications policies
CREATE POLICY "User owns notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);
