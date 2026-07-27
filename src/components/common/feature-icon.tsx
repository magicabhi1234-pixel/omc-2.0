import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import {
  Award, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, CircleDollarSign,
  Clock3, Globe2, GraduationCap, HeartPulse, Laptop, Monitor, Settings2,
  Target, TrendingUp, Truck, UsersRound, WalletCards, Zap,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  award: Award, book: BookOpen, briefcase: BriefcaseBusiness, chart: ChartNoAxesCombined,
  clock: Clock3, globe: Globe2, graduation: GraduationCap, heart: HeartPulse,
  laptop: Laptop, monitor: Monitor, settings: Settings2, target: Target,
  "trending-up": TrendingUp, truck: Truck, users: UsersRound, wallet: WalletCards,
  zap: Zap, finance: CircleDollarSign, marketing: TrendingUp, operations: Settings2,
  analytics: ChartNoAxesCombined, technology: Laptop, international: Globe2,
  "it management": Laptop, "supply chain": Truck, "human resource": UsersRound,
};

const iconForTitle = (title = "") => {
  const normalizedTitle = title.toLowerCase();
  return Object.entries(icons).find(([key]) => normalizedTitle.includes(key))?.[1];
};

export default function FeatureIcon({
  icon,
  title,
  className = "h-6 w-6",
}: {
  icon?: string;
  title?: string;
  className?: string;
}) {
  const Icon = (icon ? icons[icon.toLowerCase()] : undefined) ?? iconForTitle(title) ?? GraduationCap;
  return createElement(Icon, { "aria-hidden": true, className, strokeWidth: 2 });
}
