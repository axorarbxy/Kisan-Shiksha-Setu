import { Badge } from "@/components/ui/badge";

const roleDetails = {
  mentor: { label: "Mentor", variant: "success" },
  school: { label: "School", variant: "neutral" },
  "college-admin": { label: "College admin", variant: "info" },
} as const;

export function RoleBadge({ role }: { role: keyof typeof roleDetails }) {
  const { label, variant } = roleDetails[role];

  return <Badge variant={variant}>{label}</Badge>;
}
