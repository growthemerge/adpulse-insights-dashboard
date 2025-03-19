
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  BarChart4, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  Users as UsersIcon 
} from 'lucide-react';
import { DateRangePicker } from '@/components/DateRangePicker';
import { MetricCard } from '@/components/MetricCard';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { RoasChart } from '@/components/charts/RoasChart';
import { CampaignPerformanceChart } from '@/components/charts/CampaignPerformanceChart';
import { DateRange } from 'react-day-picker';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  const metrics = [
    {
      title: "Total Spend",
      value: "₹12,345",
      change: "+12.3%",
      isPositive: false,
      icon: CreditCard,
      color: "bg-brand-orange/10 text-brand-orange",
    },
    {
      title: "Total Revenue",
      value: "₹98,765",
      change: "+23.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-brand-green/10 text-brand-green",
    },
    {
      title: "Orders",
      value: "423",
      change: "+18.2%",
      isPositive: true,
      icon: ShoppingCart,
      color: "bg-brand-teal/10 text-brand-teal",
    },
    {
      title: "Website Visitors",
      value: "12,567",
      change: "+9.8%",
      isPositive: true,
      icon: UsersIcon,
      color: "bg-brand-skyBlue/10 text-brand-skyBlue",
    },
    {
      title: "ROAS",
      value: "8.0x",
      change: "+11.2%",
      isPositive: true,
      icon: BarChart4,
      color: "bg-brand-gold/10 text-brand-gold",
    },
    {
      title: "Avg. CPC",
      value: "₹3.45",
      change: "-5.2%",
      isPositive: true,
      icon: CreditCard,
      color: "bg-brand-cyan/10 text-brand-cyan",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DateRangePicker 
          date={dateRange} 
          onDateChange={(newDateRange: DateRange) => setDateRange(newDateRange)} 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            icon={metric.icon}
            colorClass={metric.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <h2 className="text-lg font-semibold mb-4">Spend vs. Revenue</h2>
          <PerformanceChart />
        </Card>
        
        <Card className="chart-container">
          <h2 className="text-lg font-semibold mb-4">ROAS Trend</h2>
          <RoasChart />
        </Card>
      </div>

      <Card className="chart-container">
        <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
        <CampaignPerformanceChart />
      </Card>
    </div>
  );
};

export default Dashboard;
