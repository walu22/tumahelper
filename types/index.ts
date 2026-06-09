import type { ServiceDetails } from "@/lib/services/catalog";

export type { ServiceDetails };
export type UserRole = "customer" | "worker" | "employer" | "admin";
export type UserStatus = "pending" | "active" | "suspended" | "rejected";

export type VerificationLevel = "none" | "bronze" | "silver" | "gold" | "platinum";
export type VerificationStatus = "not_submitted" | "pending" | "approved" | "rejected";

export type WorkerCategory = "nanny" | "house_cleaner";
export type WorkerSubcategory = 
  | "day_nanny" | "night_nanny" | "live_in_nanny" | "babysitter"
  | "general_cleaning" | "deep_cleaning" | "laundry";

export type AvailabilityStatus = "available" | "busy" | "not_available";

export type EmploymentType = "full_time" | "part_time" | "live_in" | "live_out" | "contract";

export type BookingStatus = 
  | "pending" | "accepted" | "declined" | "in_progress" 
  | "completed" | "cancelled" | "disputed" | "no_show";

export type PaymentStatus = "pending" | "paid" | "confirmed" | "refunded";
export type PaymentMethod = "mtn_money" | "airtel_money" | "bank" | "cash";

export type JobStatus = "draft" | "open" | "closed" | "filled" | "cancelled";
export type JobEmploymentType = "full_time" | "part_time" | "live_in" | "contract";

export type ApplicationStatus = 
  | "applied" | "shortlisted" | "interview_scheduled" 
  | "offered" | "hired" | "rejected" | "withdrawn";

export type DocumentType = 
  | "nrc_front" | "nrc_back" | "police_clearance" 
  | "certificate" | "reference_letter" | "address_proof";

export type DisputeType = 
  | "no_show" | "poor_service" | "payment_issue" 
  | "misconduct" | "fraud" | "document_issue" | "other";

export type DisputeStatus = "open" | "under_review" | "resolved" | "rejected" | "escalated";

export type NotificationType = 
  | "booking_accepted" | "booking_declined" | "booking_completed"
  | "verification_approved" | "verification_rejected"
  | "job_application" | "interview_scheduled" | "offer_received"
  | "payment_confirmed" | "dispute_opened" | "dispute_resolved";

export interface User {
  id: string;
  phone: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  phone_verified: boolean;
  email_verified: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  full_name: string;
  nrc_number: string | null;
  date_of_birth: string | null;
  gender: string | null;
  city: string;
  area: string;
  bio: string | null;
  experience_years: number;
  expected_salary_min: number | null;
  expected_salary_max: number | null;
  availability_status: AvailabilityStatus;
  employment_types: EmploymentType[];
  languages: string[];
  skills: string[];
  category: WorkerCategory;
  subcategory: string | null;
  profile_photo_url: string | null;
  trust_score: number;
  trust_score_components: Record<string, number>;
  verification_level: VerificationLevel;
  verification_status: VerificationStatus;
  total_jobs_completed: number;
  total_reviews: number;
  average_rating: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicWorkerProfile {
  id: string;
  user_id: string;
  full_name: string;
  city: string;
  area: string;
  bio: string | null;
  experience_years: number;
  category: WorkerCategory;
  subcategory: string | null;
  profile_photo_url: string | null;
  trust_score: number;
  trust_score_label: string;
  trust_score_color: string;
  is_provisional: boolean;
  verification_level: VerificationLevel;
  average_rating: number;
  total_jobs_completed: number;
  total_reviews: number;
  languages: string[];
  skills: string[];
  employment_types: EmploymentType[];
  availability_status: AvailabilityStatus;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  requires_verification: VerificationLevel;
}

export interface Booking {
  id: string;
  booking_code: string;
  customer_id: string;
  worker_id: string;
  category_id: string;
  status: BookingStatus;
  service_date: string;
  service_time: string;
  location_address: string;
  location_lat: number | null;
  location_lng: number | null;
  description: string | null;
  service_details: ServiceDetails | null;
  amount: number;
  platform_fee: number;
  worker_earnings: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  payment_proof_url: string | null;
  customer_rating: number | null;
  customer_review: string | null;
  worker_rating: number | null;
  worker_review: string | null;
  cancellation_reason: string | null;
  cancelled_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string | null;
  reviewer_id: string;
  reviewee_id: string;
  review_type: "booking" | "employment";
  overall_rating: number;
  punctuality: number | null;
  quality: number | null;
  professionalism: number | null;
  communication: number | null;
  comment: string | null;
  is_visible: boolean;
  dispute_status: string;
  created_at: string;
}

export interface VerificationDocument {
  id: string;
  worker_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  expiry_date: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface WorkerReference {
  id: string;
  worker_id: string;
  referee_name: string;
  referee_phone: string;
  relationship: string;
  work_period: string | null;
  status: string;
  admin_notes: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface JobPost {
  id: string;
  employer_id: string;
  title: string;
  category: WorkerCategory;
  location: string;
  city: string;
  salary_min: number | null;
  salary_max: number | null;
  employment_type: JobEmploymentType;
  working_hours: string | null;
  required_experience_years: number;
  required_verification_level: VerificationLevel;
  required_skills: string[];
  description: string;
  requirements: string | null;
  benefits: string | null;
  status: JobStatus;
  views_count: number;
  applications_count: number;
  placement_fee: number;
  placement_fee_paid: boolean;
  hired_worker_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  worker_id: string;
  status: ApplicationStatus;
  cover_note: string | null;
  expected_salary: number | null;
  interview_date: string | null;
  interview_location: string | null;
  interview_notes: string | null;
  offer_salary: number | null;
  hired_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  payment_code: string;
  booking_id: string | null;
  job_post_id: string | null;
  payer_id: string;
  payee_id: string | null;
  amount: number;
  platform_fee: number;
  payment_type: string;
  payment_method: PaymentMethod | null;
  payment_proof_url: string | null;
  transaction_reference: string | null;
  status: PaymentStatus;
  confirmed_by: string | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface Dispute {
  id: string;
  booking_id: string | null;
  job_application_id: string | null;
  raised_by: string;
  against_user_id: string;
  dispute_type: DisputeType;
  description: string;
  evidence_urls: string[];
  status: DisputeStatus;
  resolution: string | null;
  resolution_action: string | null;
  refund_amount: number | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  channel: string;
  sent_at: string | null;
  created_at: string;
}

export interface TrustScoreResult {
  score: number;
  components: {
    identityVerification: number;
    jobCompletion: number;
    customerRating: number;
    punctuality: number;
    reliability: number;
    complaintHistory: number;
    profileCompleteness: number;
  };
  isProvisional: boolean;
  label: string;
  color: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
