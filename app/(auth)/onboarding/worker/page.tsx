"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorkerCategory, EmploymentType } from "@/types";

const skillsByCategory: Record<WorkerCategory, string[]> = {
  nanny: ["infant_care", "meal_prep", "homework_help", "first_aid", "sleep_training", "newborn_care", "early_education"],
  house_cleaner: ["deep_cleaning", "laundry", "ironing", "window_cleaning", "organization", "meal_prep"],
};

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
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

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/workers/me/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: formData.fullName,
        category: formData.category,
        subcategory: formData.subcategory,
        bio: formData.bio,
        experienceYears: formData.experienceYears,
        city: formData.city,
        area: formData.area,
        languages: formData.languages,
        skills: formData.skills,
        employmentTypes: formData.employmentTypes,
        expectedSalaryMin: formData.expectedSalaryMin,
        expectedSalaryMax: formData.expectedSalaryMax,
      }),
    });
    setLoading(false);
    if (res.ok) router.push("/worker/dashboard");
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold">Create Your Profile</h1>
          <p className="text-gray-500">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as WorkerCategory, skills: [] })}
              >
                <option value="nanny">Nanny / Childcare</option>
                <option value="house_cleaner">House Cleaning</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
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
              <label className="block text-sm font-medium mb-1">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell families about yourself..."
                maxLength={500}
              />
              <p className="text-xs text-gray-500">{formData.bio.length}/500</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <Input
                type="number"
                min={0}
                max={50}
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) })}
              />
            </div>
            <Button onClick={() => setStep(2)} className="w-full bg-primary">Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area/Suburb</label>
              <Input
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g., Kabulonga"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Languages</label>
              <div className="flex flex-wrap gap-2">
                {["English", "Bemba", "Nyanja", "Tonga"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => toggleLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.languages.includes(lang)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillsByCategory[formData.category].map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.skills.includes(skill)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {skill.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employment Types</label>
              <div className="flex flex-wrap gap-2">
                {(["full_time", "part_time", "live_in", "live_out", "contract"] as EmploymentType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleEmploymentType(type)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.employmentTypes.includes(type)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {type.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1 bg-primary">Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Salary (ZMW)</label>
                <Input
                  type="number"
                  value={formData.expectedSalaryMin}
                  onChange={(e) => setFormData({ ...formData, expectedSalaryMin: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Salary (ZMW)</label>
                <Input
                  type="number"
                  value={formData.expectedSalaryMax}
                  onChange={(e) => setFormData({ ...formData, expectedSalaryMax: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Profile Preview</h3>
              <p className="text-sm text-gray-600">{formData.fullName}</p>
              <p className="text-sm text-gray-600 capitalize">{formData.category.replace("_", " ")}</p>
              <p className="text-sm text-gray-600">{formData.area}, {formData.city}</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary"
              >
                {loading ? "Creating..." : "Create Profile"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
