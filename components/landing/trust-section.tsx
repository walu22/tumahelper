import { PhoneCall, ScrollText, Shield, Star } from "lucide-react";
import { SectionHeader } from "./section-header";

const trustPoints = [
  {
    icon: Star,
    title: "Ratings and reviews",
    description: "See feedback from other families before you book.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: PhoneCall,
    title: "Reference checks",
    description: "We verify work history with previous employers.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: ScrollText,
    title: "ID verification",
    description: "National Registration Cards reviewed by our team.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Shield,
    title: "Trust scores",
    description: "Data-driven scores based on performance and reliability.",
    color: "bg-purple-100 text-purple-700",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          eyebrow="Safety first"
          title="Safety and security is our top priority."
          description="We connect you with hardworking, trusted individuals who are experienced, vetted, rated, and dependable."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-gray-100 bg-gray-50/60 p-6 text-center"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${point.color}`}
              >
                <point.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
