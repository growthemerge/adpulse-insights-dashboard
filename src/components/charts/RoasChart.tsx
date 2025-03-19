
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Default fallback data if none is provided
const defaultData = [
  { date: "Jan 1", roas: 1.5 },
  { date: "Jan 8", roas: 1.6 },
  { date: "Jan 15", roas: 2.0 },
  { date: "Jan 22", roas: 1.8 },
  { date: "Jan 29", roas: 2.2 },
  { date: "Feb 5", roas: 2.4 },
  { date: "Feb 12", roas: 2.6 },
  { date: "Feb 19", roas: 3.0 },
  { date: "Feb 26", roas: 3.4 },
  { date: "Mar 5", roas: 3.2 },
  { date: "Mar 12", roas: 3.8 },
  { date: "Mar 19", roas: 4.2 },
];

interface ChartProps {
  data?: Array<{
    date: string;
    roas: number | string;
  }>;
  isLoading?: boolean;
}

export function RoasChart({ data = defaultData, isLoading = false }: ChartProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  // Process the data to ensure ROAS is a number
  const processedData = (data.length > 0 ? data : defaultData).map(item => ({
    date: item.date,
    roas: typeof item.roas === 'string' ? parseFloat(item.roas) : item.roas
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffcc00" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ffcc00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#37474f" />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#e0f2f1', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#e0f2f1', fontSize: 12 }}
            tickFormatter={(value) => `${value}x`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e2a38',
              borderColor: '#37474f',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`${value.toFixed(1)}x`, 'ROAS']}
          />
          <Area
            type="monotone"
            dataKey="roas"
            fill="url(#colorRoas)"
            stroke="#ffcc00"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
