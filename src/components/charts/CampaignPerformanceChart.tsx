
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";

const data = [
  { name: "Summer Sale", roas: 4.5, spend: 5000, revenue: 22500 },
  { name: "Winter Promo", roas: 3.8, spend: 4500, revenue: 17100 },
  { name: "Spring Deals", roas: 3.2, spend: 3800, revenue: 12160 },
  { name: "Black Friday", roas: 5.2, spend: 8000, revenue: 41600 },
  { name: "Holiday Gifts", roas: 2.8, spend: 4200, revenue: 11760 },
  { name: "New Year", roas: 1.9, spend: 3000, revenue: 5700 },
  { name: "Valentine's", roas: 2.4, spend: 2500, revenue: 6000 },
];

export function CampaignPerformanceChart() {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#37474f" />
          <XAxis 
            dataKey="name" 
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
            formatter={(value: number, name: string) => {
              if (name === 'roas') return [`${value.toFixed(1)}x`, 'ROAS'];
              if (name === 'spend') return [`₹${value}`, 'Spend'];
              if (name === 'revenue') return [`₹${value}`, 'Revenue'];
              return [value, name];
            }}
          />
          <Bar dataKey="roas" fill="#6fe394">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.roas >= 3 ? '#6fe394' : (entry.roas >= 2 ? '#ffcc00' : '#ff5252')} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
