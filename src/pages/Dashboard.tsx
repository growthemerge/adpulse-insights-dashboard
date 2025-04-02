
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  BarChart4, 
  CreditCard, 
  DollarSign, 
  ShoppingCart, 
  Users as UsersIcon,
  Clock,
  Percent
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
import { Button } from '@/components/ui/button';
import { FileDown, Filter } from 'lucide-react';

interface DashboardData {
  date: string;
  spend: number;
  revenue: number;
  roas: number | string;
  campaign_name?: string;
  ad_set_name?: string;
  impressions?: number;
  link_clicks?: number;
  results?: number;
  cpc?: number;
  cpm?: number;
  adds_to_cart?: number;
  checkouts_initiated?: number;
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
    console.log("Dashboard - Initializing, calling fetchDashboardData...");
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Dashboard - Starting to fetch dashboard data...");
      setIsLoading(true);
      
      // Get the latest upload from upload_history collection
      const uploadsQuery = query(
        collection(db, 'upload_history'),
        orderBy('uploaded_at', 'desc'),
        limit(1)
      );
      
      console.log("Dashboard - Executing query for latest upload...");
      const querySnapshot = await getDocs(uploadsQuery);
      console.log("Dashboard - Query complete, snapshot size:", querySnapshot.size);
      
      if (!querySnapshot.empty) {
        const uploadDoc = querySnapshot.docs[0].data();
        console.log("Dashboard - Retrieved document:", uploadDoc);
        
        if (uploadDoc && uploadDoc.data && Array.isArray(uploadDoc.data)) {
          console.log("Dashboard - Valid data array found with length:", uploadDoc.data.length);
          
          // Transform the data to match our dashboard model
          const chartData: DashboardData[] = uploadDoc.data.map((item: any) => ({
            date: item.date,
            spend: item.spend || 0,
            revenue: item.revenue || 0, // Using Purchases conversion value
            roas: item.roas || "0", 
            campaign_name: item.campaign_name,
            ad_set_name: item.ad_set_name,
            impressions: item.impressions,
            link_clicks: item.link_clicks,
            results: item.results,
            cpc: item.cpc,
            cpm: item.cpm,
            adds_to_cart: item.adds_to_cart,
            checkouts_initiated: item.checkouts_initiated
          }));
          
          console.log("Dashboard - Transformed chart data:", chartData);
          setPerformanceData(chartData);
          setHasData(true);
          
          // If we have start_date and end_date in the upload, update the date range
          if (uploadDoc.start_date && uploadDoc.end_date) {
            try {
              const startDate = new Date(uploadDoc.start_date);
              const endDate = new Date(uploadDoc.end_date);
              console.log("Dashboard - Setting date range:", { from: startDate, to: endDate });
              setDateRange({ from: startDate, to: endDate });
            } catch (error) {
              console.error("Dashboard - Error parsing dates:", error);
            }
          }
        } else {
          console.error("Dashboard - Data format error:", uploadDoc);
          setHasData(false);
          toast.error("Data format error in the upload. Please try uploading again.");
        }
      } else {
        console.log("Dashboard - No upload history found in the database");
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
      avgCpc: 0,
      sessionDuration: "0m 0s",
      conversionRate: 0
    };
    
    const totalSpend = performanceData.reduce((sum, item) => sum + item.spend, 0);
    const totalRevenue = performanceData.reduce((sum, item) => sum + item.revenue, 0);
    
    // Calculate ROAS as revenue divided by spend
    const averageRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    
    // Get metrics directly from the data where possible
    const orders = performanceData.reduce((sum, item) => sum + (item.results || 0), 0);
    const visitors = performanceData.reduce((sum, item) => sum + (item.link_clicks || 0), 0);
    
    // Calculate average CPC based on the data
    const totalClicks = performanceData.reduce((sum, item) => sum + (item.link_clicks || 0), 0);
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;

    // Calculate conversion rate (orders/visitors)
    const conversionRate = visitors > 0 ? (orders / visitors) * 100 : 0;
    
    // For the session duration, we'll simulate a value since it's not in our data
    const sessionDuration = "4m 32s";
    
    return {
      totalSpend,
      totalRevenue,
      averageRoas,
      orders,
      visitors,
      avgCpc,
      sessionDuration,
      conversionRate
    };
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <DateRangePicker 
            date={dateRange} 
            onDateChange={(newDateRange: DateRange) => setDateRange(newDateRange)} 
          />
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </div>
      ) : hasData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(() => {
            const calculated = calculateMetrics();
            return [
              {
                title: "Total Revenue",
                value: `₹${calculated.totalRevenue.toLocaleString()}`,
                change: "+23.5%",
                isPositive: true,
                icon: DollarSign,
                color: "bg-indigo-100 text-indigo-600",
              },
              {
                title: "Active Users",
                value: calculated.visitors.toLocaleString(),
                change: "+9.8%",
                isPositive: true,
                icon: UsersIcon,
                color: "bg-amber-100 text-amber-600",
              },
              {
                title: "Conversion Rate",
                value: `${calculated.conversionRate.toFixed(1)}%`,
                change: "+11.2%",
                isPositive: true,
                icon: Percent,
                color: "bg-emerald-100 text-emerald-600",
              },
              {
                title: "Avg. Session Duration",
                value: calculated.sessionDuration,
                change: "+12%",
                isPositive: true,
                icon: Clock,
                color: "bg-blue-100 text-blue-600",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : hasData ? (
              performanceData
                .filter(item => item.campaign_name)
                .slice(0, 5)
                .map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        ['bg-indigo-100', 'bg-amber-100', 'bg-emerald-100', 'bg-blue-100', 'bg-purple-100'][index % 5]
                      }`}>
                        <span className={`text-sm font-medium ${
                          ['text-indigo-600', 'text-amber-600', 'text-emerald-600', 'text-blue-600', 'text-purple-600'][index % 5]
                        }`}>
                          {item.campaign_name?.substring(0, 1).toUpperCase() || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{item.campaign_name}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{item.revenue.toLocaleString()}</p>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground">No transaction data available</p>
            )}
          </div>
        </Card>
        
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue</h2>
          <PerformanceChart data={performanceData} isLoading={isLoading} />
        </Card>
      </div>

      <Card className="p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Campaign Performance</h2>
        <CampaignPerformanceChart />
      </Card>
    </div>
  );
};

export default Dashboard;
