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
    { label: "Overview", href: "/mentor", icon: Home },
    { label: "Placement", href: "/mentor/placement", icon: Handshake },
    { label: "Matched schools", href: "/mentor/schools", icon: Building2 },
    { label: "Experiments", href: "/mentor/experiments", icon: BookOpen },
  ],
  school: [
    { label: "Overview", href: "/school", icon: Home },
    { label: "Mentors", href: "/school/mentors", icon: Users },
    { label: "Experiments", href: "/school/experiments", icon: BookOpen },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: Home },
    { label: "RAWE students", href: "/admin/students", icon: GraduationCap },
    { label: "Schools", href: "/admin/schools", icon: Building2 },
    { label: "Insights", href: "/admin/insights", icon: BarChart3 },
  ],
};

export const settingsNavItem: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

export const publicNavItems: NavItem[] = [
  { label: "How it works", href: "/how-it-works", icon: ClipboardList },
  { label: "Evidence", href: "/evidence", icon: BookOpen },
  { label: "Survey", href: "/survey", icon: ClipboardList },
];
