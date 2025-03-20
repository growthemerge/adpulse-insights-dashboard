import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
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
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  date: string;
  spend: number;
  revenue: number;
  roas: number | string;
}

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [performanceData, setPerformanceData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Dashboard - Starting to fetch dashboard data...");
      setIsLoading(true);
      
      const dashboardQuery = query(
        collection(db, 'dashboardData'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      console.log("Dashboard - Executing query...");
      const querySnapshot = await getDocs(dashboardQuery);
      console.log("Dashboard - Query complete, snapshot size:", querySnapshot.size);
      
      if (!querySnapshot.empty) {
        const dashboardDoc = querySnapshot.docs[0].data();
        console.log("Dashboard - Retrieved document:", dashboardDoc);
        
        if (dashboardDoc && dashboardDoc.data && Array.isArray(dashboardDoc.data)) {
          console.log("Dashboard - Valid data array found with length:", dashboardDoc.data.length);
          const chartData = dashboardDoc.data as DashboardData[];
          setPerformanceData(chartData);
          setHasData(true);
        } else {
          console.error("Dashboard - Data format error:", dashboardDoc);
          setHasData(false);
          toast.error("Data format error. Please try uploading again.");
        }
      } else {
        console.log("Dashboard - No dashboard data found in the database");
        setHasData(false);
      }
    } catch (error) {
      console.error('Dashboard - Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate summary metrics from data
  const calculateMetrics = () => {
    if (!performanceData.length) return {
      totalSpend: 0,
      totalRevenue: 0,
      averageRoas: 0,
      orders: 0,
      visitors: 0,
      avgCpc: 0
    };
    
    const totalSpend = performanceData.reduce((sum, item) => sum + item.spend, 0);
    const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
    
    const averageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    // Estimate other metrics based on real data
    const orders = Math.floor(totalRevenue / 250); // Average order value of ₹250
    const visitors = Math.floor(totalSpend * 5); // Estimate 5 visitors per rupee spent
    const avgCpc = totalSpend > 0 && visitors > 0 ? totalSpend / (visitors * 0.2) : 0; // Assume 20% click rate
    
    return {
      totalSpend,
      totalRevenue,
      averageRoas,
      orders,
      visitors,
      avgCpc
    };
  };

  const metrics = hasData ? (() => {
    const calculated = calculateMetrics();
    return [
      {
        title: "Total Spend",
        value: `₹${calculated.totalSpend.toLocaleString()}`,
        change: "+12.3%",
        isPositive: false,
        icon: CreditCard,
        color: "bg-brand-orange/10 text-brand-orange",
      },
      {
        title: "Total Revenue",
        value: `₹${calculated.totalRevenue.toLocaleString()}`,
        change: "+23.5%",
        isPositive: true,
        icon: DollarSign,
        color: "bg-brand-green/10 text-brand-green",
      },
      {
        title: "Orders",
        value: calculated.orders.toLocaleString(),
        change: "+18.2%",
        isPositive: true,
        icon: ShoppingCart,
        color: "bg-brand-teal/10 text-brand-teal",
      },
      {
        title: "Website Visitors",
        value: calculated.visitors.toLocaleString(),
        change: "+9.8%",
        isPositive: true,
        icon: UsersIcon,
        color: "bg-brand-skyBlue/10 text-brand-skyBlue",
      },
      {
        title: "ROAS",
        value: `${calculated.averageRoas.toFixed(1)}x`,
        change: "+11.2%",
        isPositive: true,
        icon: BarChart4,
        color: "bg-brand-gold/10 text-brand-gold",
      },
      {
        title: "Avg. CPC",
        value: `₹${calculated.avgCpc.toFixed(2)}`,
        change: "-5.2%",
        isPositive: true,
        icon: CreditCard,
        color: "bg-brand-cyan/10 text-brand-cyan",
      },
    ];
  })() : [];

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <DateRangePicker 
          date={dateRange} 
          onDateChange={(newDateRange: DateRange) => setDateRange(newDateRange)} 
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
      ) : hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
            const calculated = calculateMetrics();
            return [
              {
                title: "Total Spend",
                value: `₹${calculated.totalSpend.toLocaleString()}`,
                change: "+12.3%",
                isPositive: false,
                icon: CreditCard,
                color: "bg-brand-orange/10 text-brand-orange",
              },
              {
                title: "Total Revenue",
                value: `₹${calculated.totalRevenue.toLocaleString()}`,
                change: "+23.5%",
                isPositive: true,
                icon: DollarSign,
                color: "bg-brand-green/10 text-brand-green",
              },
              {
                title: "Orders",
                value: calculated.orders.toLocaleString(),
                change: "+18.2%",
                isPositive: true,
                icon: ShoppingCart,
                color: "bg-brand-teal/10 text-brand-teal",
              },
              {
                title: "Website Visitors",
                value: calculated.visitors.toLocaleString(),
                change: "+9.8%",
                isPositive: true,
                icon: UsersIcon,
                color: "bg-brand-skyBlue/10 text-brand-skyBlue",
              },
              {
                title: "ROAS",
                value: `${calculated.averageRoas.toFixed(1)}x`,
                change: "+11.2%",
                isPositive: true,
                icon: BarChart4,
                color: "bg-brand-gold/10 text-brand-gold",
              },
              {
                title: "Avg. CPC",
                value: `₹${calculated.avgCpc.toFixed(2)}`,
                change: "-5.2%",
                isPositive: true,
                icon: CreditCard,
                color: "bg-brand-cyan/10 text-brand-cyan",
              },
            ].map((metric, index) => (
              <MetricCard
                key={index}
                title={metric.title}
                value={metric.value}
                change={metric.change}
                isPositive={metric.isPositive}
                icon={metric.icon}
                colorClass={metric.color}
              />
            ));
          })()}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            No data available. Please upload a CSV file in the Data Upload section.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="chart-container">
          <h2 className="text-lg font-semibold mb-4">Spend vs. Revenue</h2>
          <PerformanceChart data={performanceData} isLoading={isLoading} />
        </Card>
        
        <Card className="chart-container">
          <h2 className="text-lg font-semibold mb-4">ROAS Trend</h2>
          <RoasChart data={performanceData} isLoading={isLoading} />
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
