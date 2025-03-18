
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PerformanceChart } from '@/components/charts/PerformanceChart';
import { RoasChart } from '@/components/charts/RoasChart';
import { CampaignPerformanceChart } from '@/components/charts/CampaignPerformanceChart';

const Analytics = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [adSetFilter, setAdSetFilter] = useState('all');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Analyze your ad performance metrics and identify optimization opportunities
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <DateRangePicker 
          date={dateRange} 
          onDateChange={setDateRange} 
          className="w-full lg:w-auto"
        />
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Select
            value={campaignFilter}
            onValueChange={setCampaignFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-card hover:bg-card/80">
              <SelectValue placeholder="Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              <SelectItem value="summer">Summer Sale</SelectItem>
              <SelectItem value="winter">Winter Promo</SelectItem>
              <SelectItem value="spring">Spring Deals</SelectItem>
              <SelectItem value="black-friday">Black Friday</SelectItem>
              <SelectItem value="holiday">Holiday Gifts</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={adSetFilter}
            onValueChange={setAdSetFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-card hover:bg-card/80">
              <SelectValue placeholder="Ad Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ad Sets</SelectItem>
              <SelectItem value="retargeting">Retargeting</SelectItem>
              <SelectItem value="lookalike">Lookalike</SelectItem>
              <SelectItem value="interest">Interest-based</SelectItem>
              <SelectItem value="broad">Broad Audience</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="adsets">Ad Sets</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6 pt-4">
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
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-6 pt-4">
          <Card className="chart-container">
            <h2 className="text-lg font-semibold mb-4">Campaign Metrics</h2>
            <p className="text-muted-foreground text-sm mb-8">
              Compare performance across campaigns to identify winners and underperformers
            </p>
            
            <div className="h-[400px]">
              <CampaignPerformanceChart />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="adsets" className="space-y-6 pt-4">
          <Card className="chart-container">
            <h2 className="text-lg font-semibold mb-4">Ad Set Performance</h2>
            <p className="text-muted-foreground text-sm">
              Ad set level metrics will appear here when campaign data is uploaded
            </p>
          </Card>
        </TabsContent>
        
        <TabsContent value="funnel" className="space-y-6 pt-4">
          <Card className="chart-container">
            <h2 className="text-lg font-semibold mb-4">Conversion Funnel</h2>
            <p className="text-muted-foreground text-sm">
              Funnel visualization will appear here when campaign data is uploaded
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
