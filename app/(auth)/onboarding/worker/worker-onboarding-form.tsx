"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogoMark } from "@/components/brand/logo";
import { WorkerCategory, EmploymentType } from "@/types";

const skillsByCategory: Record<WorkerCategory, string[]> = {
  nanny: [
    "infant_care",
    "meal_prep",
    "homework_help",
    "first_aid",
    "sleep_training",
    "newborn_care",
    "early_education",
  ],
  house_cleaner: [
    "deep_cleaning",
    "laundry",
    "ironing",
    "window_cleaning",
    "organization",
    "meal_prep",
  ],
};

interface WorkerOnboardingFormProps {
  initialFullName: string;
}

function validateStep1(formData: {
  fullName: string;
  subcategory: string;
}): string | null {
  if (formData.fullName.trim().length < 2) {
    return "Enter your full name (at least 2 characters).";
  }
  if (!formData.subcategory) {
    return "Select a subcategory for your work.";
  }
  return null;
}

function validateStep2(formData: {
  area: string;
  languages: string[];
  skills: string[];
}): string | null {
  if (!formData.area.trim()) {
    return "Enter your area or suburb in Lusaka.";
  }
  if (formData.languages.length === 0) {
    return "Select at least one language.";
  }
  if (formData.skills.length === 0) {
    return "Select at least one skill.";
  }
  return null;
}

export function WorkerOnboardingForm({ initialFullName }: WorkerOnboardingFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: initialFullName,
    category: "nanny" as WorkerCategory,
    subcategory: "",
    bio: "",
    experienceYears: 0,
    city: "Lusaka",
    area: "",
    languages: [] as string[],
    skills: [] as string[],
    employmentTypes: [] as EmploymentType[],
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
  });
  const [loading, setLoading] = useState(false);

  const goToStep = (next: number) => {
    setError(null);
    if (next === 2) {
      const message = validateStep1(formData);
      if (message) {
        setError(message);
        return;
      }
    }
    if (next === 3) {
      const message = validateStep2(formData);
      if (message) {
        setError(message);
        return;
      }
    }
    setStep(next);
  };

  const handleSubmit = async () => {
    const step1Error = validateStep1(formData);
    const step2Error = validateStep2(formData);
    if (step1Error || step2Error) {
      setError(step1Error || step2Error);
      setStep(step1Error ? 1 : 2);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/workers/me/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          category: formData.category,
          subcategory: formData.subcategory,
          bio: formData.bio,
          experienceYears: formData.experienceYears,
          city: formData.city.trim(),
          area: formData.area.trim(),
          languages: formData.languages,
          skills: formData.skills,
          employmentTypes: formData.employmentTypes,
          expectedSalaryMin: formData.expectedSalaryMin || undefined,
          expectedSalaryMax: formData.expectedSalaryMax || undefined,
          availabilityStatus: "available",
        }),
      });

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          body?.error?.message ||
            "Could not save your profile. Check your details and try again."
        );
        return;
      }

      router.push("/worker/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleEmploymentType = (type: EmploymentType) => {
    setFormData((prev) => ({
      ...prev,
      employmentTypes: prev.employmentTypes.includes(type)
        ? prev.employmentTypes.filter((t) => t !== type)
        : [...prev.employmentTypes, type],
    }));
  };

  const selectClassName =
    "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <div className="min-h-screen bg-surface py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoMark size={48} />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">
            Complete your worker profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Step {step} of 3 — families see this after you finish
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select
                  className={selectClassName}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as WorkerCategory,
                      skills: [],
                      subcategory: "",
                    })
                  }
                >
                  <option value="nanny">Nanny / Childcare</option>
                  <option value="house_cleaner">House Cleaning</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Subcategory</label>
                <select
                  className={selectClassName}
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subcategory: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  {formData.category === "nanny" ? (
                    <>
                      <option value="day_nanny">Day Nanny</option>
                      <option value="live_in_nanny">Live-in Nanny</option>
                      <option value="babysitter">Babysitter</option>
                    </>
                  ) : (
                    <>
                      <option value="general_cleaning">General Cleaning</option>
                      <option value="deep_cleaning">Deep Cleaning</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell families about your experience and approach..."
                  maxLength={500}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/500
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Years of experience
                </label>
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={formData.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experienceYears: parseInt(e.target.value, 10) || 0,
                    })
                  }
                />
              </div>
              <Button onClick={() => goToStep(2)} className="w-full rounded-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Area / suburb
                </label>
                <Input
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="e.g., Kabulonga"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Languages <span className="text-muted-foreground">(pick at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {["English", "Bemba", "Nyanja", "Tonga"].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.languages.includes(lang)
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface text-foreground border border-border"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Skills <span className="text-muted-foreground">(pick at least one)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {skillsByCategory[formData.category].map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.skills.includes(skill)
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface text-foreground border border-border"
                      }`}
                    >
                      {skill.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Employment types
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "full_time",
                      "part_time",
                      "live_in",
                      "live_out",
                      "contract",
                    ] as EmploymentType[]
                  ).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleEmploymentType(type)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        formData.employmentTypes.includes(type)
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface text-foreground border border-border"
                      }`}
                    >
                      {type.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => goToStep(1)}
                  className="flex-1 rounded-full"
                >
                  Back
                </Button>
                <Button onClick={() => goToStep(3)} className="flex-1 rounded-full">
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Min salary (ZMW)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.expectedSalaryMin || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedSalaryMin: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Max salary (ZMW)
                  </label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.expectedSalaryMax || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedSalaryMax: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <h3 className="font-semibold mb-2">Profile preview</h3>
                <p className="text-sm">{formData.fullName}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {formData.category.replace(/_/g, " ")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formData.area}, {formData.city}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => goToStep(2)}
                  className="flex-1 rounded-full"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 rounded-full"
                >
                  {loading ? "Saving..." : "Finish & go to dashboard"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
