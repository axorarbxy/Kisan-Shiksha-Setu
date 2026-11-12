import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  GraduationCap,
  Handshake,
  Home,
  Settings,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { appStrings } from "@/content/strings";

export type Role = "mentor" | "school" | "admin";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const roleHome: Record<Role, string> = {
  mentor: "/mentor",
  school: "/school",
  admin: "/admin",
};

export const navByRole: Record<Role, NavItem[]> = {
  mentor: [
    { label: appStrings.common.overview, href: "/mentor", icon: Home },
    { label: appStrings.mentor.placement, href: "/mentor/placement", icon: Handshake },
    { label: appStrings.mentor.schools, href: "/mentor/schools", icon: Building2 },
    { label: appStrings.mentor.experiments, href: "/mentor/experiments", icon: BookOpen },
  ],
  school: [
    { label: appStrings.common.overview, href: "/school", icon: Home },
    { label: appStrings.school.mentors, href: "/school/mentors", icon: Users },
    { label: appStrings.school.experiments, href: "/school/experiments", icon: BookOpen },
  ],
  admin: [
    { label: appStrings.common.overview, href: "/admin", icon: Home },
    { label: appStrings.admin.students, href: "/admin/students", icon: GraduationCap },
    { label: appStrings.admin.schools, href: "/admin/schools", icon: Building2 },
    { label: appStrings.admin.insights, href: "/admin/insights", icon: BarChart3 },
  ],
};

export const settingsNavItem: NavItem = {
  label: appStrings.common.settings,
  href: "/settings",
  icon: Settings,
};

export const publicNavItems: NavItem[] = [
  { label: appStrings.common.howItWorks, href: "/how-it-works", icon: ClipboardList },
  { label: appStrings.common.evidence, href: "/evidence", icon: BookOpen },
  { label: appStrings.common.survey, href: "/survey", icon: ClipboardList },
];
