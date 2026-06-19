"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface NannyCareAnswers {
  allergies: string;
  childSick: string;
  parentHome: string;
  mealsPrepared: string;
  batheChild: string;
  homeworkHelp: string;
  emergencyContact: string;
  houseRules: string;
}

interface NannyCareQuestionsProps {
  value: NannyCareAnswers;
  onChange: (value: NannyCareAnswers) => void;
}

const BOOL_OPTIONS = [
  { value: "", label: "Select" },
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

function BoolSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium mb-2 block">
        {label}
      </label>
      <select
        id={id}
        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {BOOL_OPTIONS.map((option) => (
          <option key={option.value || "blank"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function NannyCareQuestions({ value, onChange }: NannyCareQuestionsProps) {
  function update(patch: Partial<NannyCareAnswers>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">About your children</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Accurate details help us match the right nanny and keep your child safe.
        </p>
      </div>

      <div>
        <label htmlFor="nanny-allergies" className="text-sm font-medium mb-2 block">
          Allergies or special needs
        </label>
        <Textarea
          id="nanny-allergies"
          placeholder="Food allergies, medical conditions, or special support needs..."
          value={value.allergies}
          onChange={(e) => update({ allergies: e.target.value })}
          rows={2}
          className="rounded-xl resize-none"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <BoolSelect
          id="nanny-child-sick"
          label="Is any child sick or recovering?"
          value={value.childSick}
          onChange={(childSick) => update({ childSick })}
        />
        <BoolSelect
          id="nanny-parent-home"
          label="Will a parent or adult be home?"
          value={value.parentHome}
          onChange={(parentHome) => update({ parentHome })}
        />
        <BoolSelect
          id="nanny-meals-prepared"
          label="Are meals already prepared?"
          value={value.mealsPrepared}
          onChange={(mealsPrepared) => update({ mealsPrepared })}
        />
        <BoolSelect
          id="nanny-bathe-child"
          label="Should the nanny bathe the child?"
          value={value.batheChild}
          onChange={(batheChild) => update({ batheChild })}
        />
        <BoolSelect
          id="nanny-homework-help"
          label="Should the nanny help with homework?"
          value={value.homeworkHelp}
          onChange={(homeworkHelp) => update({ homeworkHelp })}
        />
      </div>

      <div>
        <label htmlFor="nanny-emergency-contact" className="text-sm font-medium mb-2 block">
          Emergency contact name and number
        </label>
        <Input
          id="nanny-emergency-contact"
          placeholder="e.g. Jane Mwanza · 0977 123 456"
          value={value.emergencyContact}
          onChange={(e) => update({ emergencyContact: e.target.value })}
          className="h-11 rounded-xl"
        />
      </div>

      <div>
        <label htmlFor="nanny-house-rules" className="text-sm font-medium mb-2 block">
          House rules or child routine instructions
        </label>
        <Textarea
          id="nanny-house-rules"
          placeholder="Nap times, screen rules, bedtime routine, areas off limits..."
          value={value.houseRules}
          onChange={(e) => update({ houseRules: e.target.value })}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>
    </div>
  );
}

export function formatNannyCareAnswers(answers: NannyCareAnswers): string {
  const lines: string[] = [];
  if (answers.allergies.trim()) lines.push(`Allergies/special needs: ${answers.allergies.trim()}`);
  if (answers.childSick) lines.push(`Child sick or recovering: ${answers.childSick}`);
  if (answers.parentHome) lines.push(`Parent/adult home: ${answers.parentHome}`);
  if (answers.mealsPrepared) lines.push(`Meals prepared: ${answers.mealsPrepared}`);
  if (answers.batheChild) lines.push(`Bathe child: ${answers.batheChild}`);
  if (answers.homeworkHelp) lines.push(`Homework help: ${answers.homeworkHelp}`);
  if (answers.emergencyContact.trim()) {
    lines.push(`Emergency contact: ${answers.emergencyContact.trim()}`);
  }
  if (answers.houseRules.trim()) lines.push(`House rules/routine: ${answers.houseRules.trim()}`);
  return lines.join("\n");
}

export const EMPTY_NANNY_CARE_ANSWERS: NannyCareAnswers = {
  allergies: "",
  childSick: "",
  parentHome: "",
  mealsPrepared: "",
  batheChild: "",
  homeworkHelp: "",
  emergencyContact: "",
  houseRules: "",
};
