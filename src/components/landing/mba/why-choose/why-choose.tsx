import React from "react";
import Container from "@/components/landing/common/container";
import SectionHeading from "@/components/landing/common/section-heading";
import { WhyChooseSection as WhyChooseSectionType } from "@/types/landing";
import {
  Truck,
  Clock,
  Briefcase,
  Award,
  Globe,
  Users,
  Monitor,
  Wallet,
  TrendingUp,
  Book,
  Zap,
  Heart,
  Settings,
  Target,
  GraduationCap,
  Coins,
  BookOpen,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Lucide string keys
  "truck": Truck,
  "clock": Clock,
  "briefcase": Briefcase,
  "award": Award,
  "globe": Globe,
  "users": Users,
  "monitor": Monitor,
  "wallet": Wallet,
  "trending-up": TrendingUp,
  "book": Book,
  "zap": Zap,
  "heart": Heart,
  "settings": Settings,
  "target": Target,

  // HTML Entity keys
  "&#127891;": GraduationCap, // 🎓
  "&#9200;": Clock,          // ⏰
  "&#128176;": Coins,        // 💰
  "&#128200;": TrendingUp,   // 📈
  "&#128188;": Briefcase,    // 💼
  "&#128218;": BookOpen,     // 📚
};

function WhyChooseIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  const IconComponent = iconMap[icon.toLowerCase().trim()];

  if (IconComponent) {
    return <IconComponent className="h-12 w-12 text-[#F47C45]" />;
  }

  // Fallback if it's not in our map (e.g. if it's already a direct Unicode emoji)
  return <div className="text-5xl">{icon}</div>;
}

export default function WhyChooseSection({
  heading,
  description,
  items,
}: WhyChooseSectionType) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          badge="Why Choose Us"
          title={heading}
          description={description}
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
            >
              <div className="mb-5">
                <WhyChooseIcon icon={item.icon} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
