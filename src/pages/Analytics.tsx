
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  date: string;
  spend: number;
  revenue: number;
  roas: number | string;
}

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  const [performanceData, setPerformanceData] = useState<DashboardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const dashboardQuery = query(
        collection(db, 'dashboardData'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(dashboardQuery);
      
      if (!querySnapshot.empty) {
        const dashboardDoc = querySnapshot.docs[0].data();
        const chartData = dashboardDoc.data as DashboardData[];
        setPerformanceData(chartData);
        setHasData(true);
      } else {
        setHasData(false);
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
      setHasData(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <DateRangePicker 
          date={dateRange} 
          onDateChange={(newDateRange: DateRange) => setDateRange(newDateRange)}
        />
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="demographics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Demographics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-4 pt-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full max-w-md" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : hasData ? (
              <div>
                <p className="text-sm text-muted-foreground mb-6">
                  Data from your most recent file upload is displayed below. Use the date range picker to filter the view.
                </p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Spend</span>
                      <span className="text-2xl font-bold">
                        ₹{performanceData.reduce((sum, item) => sum + item.spend, 0).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Total Revenue</span>
                      <span className="text-2xl font-bold text-brand-green">
                        ₹{performanceData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                      </span>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Average ROAS</span>
                      <span className="text-2xl font-bold text-brand-gold">
                        {(performanceData.reduce((sum, item) => {
                          const roas = typeof item.roas === 'string' ? parseFloat(item.roas) : item.roas;
                          return sum + roas;
                        }, 0) / performanceData.length).toFixed(2)}x
                      </span>
                    </div>
                  </Card>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="py-2 px-4 text-left">Date</th>
                        <th className="py-2 px-4 text-right">Spend</th>
                        <th className="py-2 px-4 text-right">Revenue</th>
                        <th className="py-2 px-4 text-right">ROAS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.slice(0, 10).map((row, index) => (
                        <tr key={index} className="border-b border-border/50">
                          <td className="py-2 px-4">{row.date}</td>
                          <td className="py-2 px-4 text-right">₹{row.spend.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right">₹{row.revenue.toLocaleString()}</td>
                          <td className="py-2 px-4 text-right">{typeof row.roas === 'string' ? row.roas : row.roas.toFixed(1)}x</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No data available. Please upload a CSV file first.
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4 pt-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Campaign Analytics</h2>
            <p className="text-muted-foreground">
              Campaign-specific analytics will be displayed here.
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics" className="space-y-4 pt-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Demographic Analytics</h2>
            <p className="text-muted-foreground">
              Demographic analytics will be displayed here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
