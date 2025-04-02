
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
  colorClass: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
  colorClass,
}: MetricCardProps) {
  return (
    <Card className="p-4 shadow-sm transition-all duration-300 hover:shadow-md border-0">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-full", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center mt-3">
        <div
          className={cn(
            "flex items-center text-xs font-medium",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          <span>{change}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-2">vs last period</span>
      </div>
    </Card>
  );
}
