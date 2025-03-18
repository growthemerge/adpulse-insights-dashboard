
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ComposedChart, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const data = [
  { date: "Jan 1", spend: 1200, revenue: 1800 },
  { date: "Jan 8", spend: 1400, revenue: 2000 },
  { date: "Jan 15", spend: 1300, revenue: 2200 },
  { date: "Jan 22", spend: 1800, revenue: 2400 },
  { date: "Jan 29", spend: 2000, revenue: 2600 },
  { date: "Feb 5", spend: 1800, revenue: 3000 },
  { date: "Feb 12", spend: 2200, revenue: 3400 },
  { date: "Feb 19", spend: 2400, revenue: 3800 },
  { date: "Feb 26", spend: 2100, revenue: 4200 },
  { date: "Mar 5", spend: 2500, revenue: 4600 },
  { date: "Mar 12", spend: 2300, revenue: 4200 },
  { date: "Mar 19", spend: 2600, revenue: 5000 },
];

export function PerformanceChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6fe394" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6fe394" stopOpacity={0} />
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
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e2a38',
              borderColor: '#37474f',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [`₹${value}`, undefined]}
          />
          <Legend 
            iconType="circle" 
            wrapperStyle={{ fontSize: 12, color: '#e0f2f1' }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            fill="url(#colorSpend)"
            stroke="#ff9800"
            dot={false}
            activeDot={{ r: 6 }}
            name="Ad Spend"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            fill="url(#colorRevenue)"
            stroke="#6fe394"
            dot={false}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
