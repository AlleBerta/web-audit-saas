import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Props } from '@/types/target.types';

const data = [
  { name: 'Vulnerable', value: 30, color: '#ef4444' },
  { name: 'Outdated', value: 45, color: '#f97316' },
  { name: 'Up2date', value: 25, color: '#22c55e' },
];

export const SoftwareCompositionChart = ({ targetViews, selectedTarget }: Props) => {
  if (!selectedTarget) {
    return (
      <Card>
        <CardContent className="text-center text-gray-500">
          Select a target to view software composition analysis.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Software Composition Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: '14px' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
