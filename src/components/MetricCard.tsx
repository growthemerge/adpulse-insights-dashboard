
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
    <Card className="dashboard-card animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-full", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center mt-2">
        <div
          className={cn(
            "flex items-center text-sm",
            isPositive ? "text-brand-green" : "text-brand-red"
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span>{change}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-2">vs last period</span>
      </div>
    </Card>
  );
}
