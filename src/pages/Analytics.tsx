
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/DateRangePicker';
import { DateRange } from 'react-day-picker';

const Analytics = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <DateRangePicker 
          date={dateRange} 
          onDateChange={(newDateRange: DateRange) => setDateRange(newDateRange)}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Performance Analytics</h2>
        <p className="text-muted-foreground">
          Detailed analytics will be displayed here. Select a date range to see data.
        </p>
      </Card>
    </div>
  );
};

export default Analytics;
