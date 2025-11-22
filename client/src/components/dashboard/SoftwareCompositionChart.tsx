import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Props } from '@/types/target.types';
import { useEffect, useState } from 'react';

export const SoftwareCompositionChart = ({ targetViews, selectedTarget }: Props) => {
  const [chartData, setChartData] = useState([
    { name: 'Critical', value: 0, color: '#ef4444' },
    { name: 'High', value: 0, color: '#f97316' },
    { name: 'Medium', value: 0, color: '#eab308' },
    { name: 'Low', value: 0, color: '#6b7280' },
    { name: 'Info', value: 0, color: '#3b82f6' },
  ]);

  useEffect(() => {
    const vulns = selectedTarget?.vulnerabilities || {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    setChartData([
      { name: 'Critical', value: vulns.critical, color: '#ef4444' },
      { name: 'High', value: vulns.high, color: '#f97316' },
      { name: 'Medium', value: vulns.medium, color: '#eab308' },
      { name: 'Low', value: vulns.low, color: '#6b7280' },
      { name: 'Info', value: vulns.info, color: '#3b82f6' },
    ]);
  }, [selectedTarget]);

  if (!selectedTarget) {
    return (
      <Card>
        <CardContent className="text-center text-gray-500">
          Select a target to view software composition analysis.
        </CardContent>
      </Card>
    );
  }

  if (selectedTarget?.status === 'Error') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Software Composition Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-600 font-semibold">
            Last scan for {selectedTarget.domain} is failed.
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalVulns =
    selectedTarget.vulnerabilities.critical +
    selectedTarget.vulnerabilities.high +
    selectedTarget.vulnerabilities.medium +
    selectedTarget.vulnerabilities.low +
    selectedTarget.vulnerabilities.info;

  if (totalVulns === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Software Composition Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-green-600 font-semibold">
            No vulnerability detected for {selectedTarget.domain}.
          </div>
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
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => `${value}`} // Mostra solo il numero
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Legend
                verticalAlign="bottom"
                height={0}
                iconType="circle"
                formatter={(value, entry: any) => (
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
