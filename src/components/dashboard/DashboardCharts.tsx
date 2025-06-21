import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const monthlyData = [
  { month: 'Jan', revenue: 98000, claims: 156 },
  { month: 'Feb', revenue: 105000, claims: 168 },
  { month: 'Mar', revenue: 112000, claims: 179 },
  { month: 'Apr', revenue: 108000, claims: 172 },
  { month: 'May', revenue: 125000, claims: 195 },
  { month: 'Jun', revenue: 118000, claims: 184 }
];

const claimsStatusData = [
  { name: 'Paid', value: 45, color: '#10B981' },
  { name: 'Submitted', value: 30, color: '#3B82F6' },
  { name: 'Rejected', value: 15, color: '#EF4444' },
  { name: 'Draft', value: 10, color: '#F59E0B' }
];

export const DashboardCharts = () => {
  return (
    <div className="space-y-6">
      {/* Monthly Revenue Chart */}
      <Card className='bg-background'>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}K`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#fff', color: '#111' }}
              />
              <Bar dataKey="revenue" fill="#212121" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Claims Status Chart */}
      <Card className='bg-background'>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Claims by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center">
            <ResponsiveContainer width="100%" height={250} className="lg:w-1/2">
              <PieChart>
                <Pie
                  data={claimsStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {claimsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="lg:w-1/2 mt-4 lg:mt-0 lg:ml-6">
              <div className="space-y-3">
                {claimsStatusData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};