import React from "react";
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

type Props = Partial<WhyChooseSectionType>;

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

const defaultFeatures = [
  {
    icon: "&#127891;",
    title: "UGC Approved Universities",
    description: "Choose from India's top recognized and accredited universities.",
  },
  {
    icon: "&#9200;",
    title: "Flexible Learning",
    description: "Study anytime, anywhere without affecting your job or business.",
  },
  {
    icon: "&#128176;",
    title: "Affordable Fees",
    description: "Low-cost MBA programs with EMI and scholarship options.",
  },
  {
    icon: "&#128200;",
    title: "Career Growth",
    description: "Boost promotions, salary hikes and leadership opportunities.",
  },
  {
    icon: "&#128188;",
    title: "Placement Support",
    description: "Career assistance, resume building and interview preparation.",
  },
  {
    icon: "&#128218;",
    title: "Industry Curriculum",
    description: "Updated syllabus aligned with modern business requirements.",
  },
];

export default function WhyChoose({ heading, description, items }: Props) {
  const features = items && items.length > 0 ? items : defaultFeatures;
  const title = heading || "Why Choose Distance MBA";
  const desc =
    description ||
    "Build your career with flexible learning, industry-relevant curriculum and globally recognized MBA programs.";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-14 text-center">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-[#F47C45]">
            Why Choose Us
          </span>
          <h2 className="mt-5 text-4xl font-bold text-slate-900 md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
            {desc}
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#F47C45] hover:shadow-2xl"
            >
              <div className="mb-5">
                <WhyChooseIcon icon={item.icon} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="mt-4 leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
