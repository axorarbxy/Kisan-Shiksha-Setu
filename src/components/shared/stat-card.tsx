import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  highlight = false,
}: {
  label: string;
  value: string;
  delta?: string;
  highlight?: boolean;
}) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p
          className={cn(
            "text-3xl font-semibold tracking-tight",
            highlight ? "text-purple-600" : "text-foreground",
          )}
        >
          {value}
        </p>
        {delta && <p className="text-muted-foreground text-sm">{delta}</p>}
      </CardContent>
    </Card>
  );
}
