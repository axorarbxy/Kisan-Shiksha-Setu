import { Badge } from "@/components/ui/badge";
import { appStrings } from "@/content/strings";

const roleDetails = {
  mentor: { label: appStrings.common.roleLabel("mentor"), variant: "success" },
  school: { label: appStrings.common.roleLabel("school"), variant: "neutral" },
  admin: { label: appStrings.admin.collegeAdmin, variant: "info" },
  "college-admin": { label: appStrings.admin.collegeAdmin, variant: "info" },
} as const;

export function RoleBadge({ role }: { role: keyof typeof roleDetails }) {
  const { label, variant } = roleDetails[role];

  return <Badge variant={variant}>{label}</Badge>;
}
