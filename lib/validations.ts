import { z } from "zod";

export const phoneSchema = z
  .string()
  .regex(
    /^\+260(9[5-7]\d{7}|9[0-4]\d{7})$/,
    "Invalid Zambian phone number. Format: +26097XXXXXXX"
  );

export const otpCodeSchema = z
  .string()
  .regex(/^\d{6}$/, "OTP must be 6 digits");

export const registerSchema = z.object({
  phone: phoneSchema,
  role: z.enum(["customer", "worker", "employer"]),
  fullName: z.string().min(2).max(255),
});

export const workerProfileSchema = z.object({
  fullName: z.string().min(2).max(255),
  city: z.string().min(1).max(100),
  area: z.string().min(1).max(100),
  category: z.enum(["nanny", "house_cleaner"]),
  subcategory: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  experienceYears: z.number().min(0).max(50).default(0),
  expectedSalaryMin: z.number().min(0).optional(),
  expectedSalaryMax: z.number().min(0).optional(),
  employmentTypes: z.array(
    z.enum(["full_time", "part_time", "live_in", "live_out", "contract"])
  ),
  languages: z.array(z.string()).min(1),
  skills: z.array(z.string()).min(1),
  availabilityStatus: z
    .enum(["available", "busy", "not_available"])
    .default("available"),
});

export const bookingSchema = z.object({
  workerId: z.string().uuid(),
  categoryId: z.string().uuid(),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  serviceTime: z.string().regex(/^\d{2}:\d{2}$/),
  locationAddress: z.string().min(5).max(500),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  description: z.string().max(1000).optional(),
  amount: z.number().min(50).max(1000000),
});

export const bookingStatusSchema = z.object({
  status: z.enum([
    "pending",
    "accepted",
    "declined",
    "in_progress",
    "completed",
    "cancelled",
  ]),
  reason: z.string().max(500).optional(),
});

export const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5),
  punctuality: z.number().min(1).max(5).optional(),
  quality: z.number().min(1).max(5).optional(),
  professionalism: z.number().min(1).max(5).optional(),
  communication: z.number().min(1).max(5).optional(),
  comment: z.string().max(1000).optional(),
});

export const jobPostSchema = z.object({
  title: z.string().min(5).max(255),
  category: z.enum(["nanny", "house_cleaner"]),
  location: z.string().min(5).max(255),
  city: z.string().min(1).max(100),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  employmentType: z.enum(["full_time", "part_time", "live_in", "contract"]),
  workingHours: z.string().max(100).optional(),
  requiredExperienceYears: z.number().min(0).default(0),
  requiredVerificationLevel: z
    .enum(["none", "bronze", "silver", "gold", "platinum"])
    .default("bronze"),
  requiredSkills: z.array(z.string()).default([]),
  description: z.string().min(20).max(5000),
  requirements: z.string().max(2000).optional(),
  benefits: z.string().max(2000).optional(),
});

export const jobApplicationSchema = z.object({
  coverNote: z.string().max(1000).optional(),
  expectedSalary: z.number().min(0).optional(),
});

export const referenceSchema = z.object({
  refereeName: z.string().min(2).max(255),
  refereePhone: z.string().regex(/^\+260\d{9}$/),
  relationship: z.string().min(2).max(100),
  workPeriod: z.string().max(100).optional(),
});

export const documentUploadSchema = z.object({
  documentType: z.enum([
    "nrc_front",
    "nrc_back",
    "police_clearance",
    "certificate",
    "reference_letter",
    "address_proof",
  ]),
});

export const profileUpdateSchema = z.object({
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
  city: z.string().min(1).max(100).optional(),
  area: z.string().min(1).max(100).optional(),
  companyName: z.string().max(255).optional(),
});

export const disputeSchema = z.object({
  disputeType: z.enum([
    "no_show",
    "poor_service",
    "payment_issue",
    "misconduct",
    "fraud",
    "document_issue",
    "other",
  ]),
  description: z.string().min(10).max(2000),
  evidenceUrls: z.array(z.string().url()).default([]),
});

export const approveWorkerSchema = z.object({
  verificationLevel: z.enum(["bronze", "silver", "gold", "platinum"]),
});

export const rejectDocumentSchema = z.object({
  reason: z.string().min(5).max(500),
});

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(10).max(1000),
  resolutionAction: z.enum([
    "refund",
    "partial_refund",
    "worker_suspension",
    "account_ban",
    "no_action",
  ]),
  refundAmount: z.number().min(0).optional(),
});

export const confirmPaymentSchema = z.object({
  notes: z.string().max(500).optional(),
});
