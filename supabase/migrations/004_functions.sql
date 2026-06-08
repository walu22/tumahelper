-- Function to increment job applications count
CREATE OR REPLACE FUNCTION increment_job_applications(job_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE job_posts SET applications_count = applications_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;
