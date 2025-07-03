import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PropsTargets } from '@/types/target.types';
import { Target } from '@/types/target.types';

const targets = [
  {
    url: 'home.example.com',
    ip: '93.184.216.34',
    auth: 'None',
    status: 'Finished',
    newEvents: 2,
    nextScan: 'Unscheduled',
    lastScan: 'Jul 4 2024, 15:35 CEST',
    vulnerabilities: { critical: 1, high: 0, medium: 3, low: 0 },
    hasError: false,
  },
  {
    url: 'marketing24.example.com',
    ip: '93.184.216.39',
    auth: 'None',
    status: 'Unscheduled',
    newEvents: 0,
    nextScan: 'Unscheduled',
    lastScan: 'Never',
    vulnerabilities: { critical: 0, high: 4, medium: 0, low: 0 },
    hasError: false,
  },
  {
    url: 'promotional.example.com',
    ip: '93.184.216.99',
    auth: 'None',
    status: 'Error',
    newEvents: 2,
    nextScan: 'Unscheduled',
    lastScan: 'Mar 14 2024, 19:39 CEST',
    vulnerabilities: { critical: 2, high: 3, medium: 0, low: 3 },
    hasError: true,
  },
];

export const TargetsTable = ({ setSelectedTarget, selectedTarget }: PropsTargets) => {
  // DA IMPLEMENTARE: gestione dello stato per la selezione del target
  const handleSelect = (target: Target) => {
    // toggle: deseleziona se già selezionato
    setSelectedTarget(selectedTarget?.id === target.id ? null : target);
  };
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Target</th>
                <th className="text-left p-4 font-medium text-gray-700">Scan Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Vulnerabilities</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                          {target.url}
                        </span>
                        <div className="flex space-x-1">
                          <span className="w-4 h-4 bg-gray-300 rounded-sm"></span>
                          <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
                          <span className="w-4 h-4 bg-orange-500 rounded-sm"></span>
                          <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
                          <span className="w-4 h-4 bg-yellow-500 rounded-sm"></span>
                          <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        🇺🇸 {target.ip} | Authentication: {target.auth}
                      </div>
                      <div className="text-sm text-gray-600">
                        Next scan: {target.nextScan} | Last scan: {target.lastScan}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div
                        className={`text-sm font-medium ${
                          target.status === 'Finished'
                            ? 'text-green-600'
                            : target.status === 'Error'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }`}
                      >
                        Status: {target.status}
                      </div>
                      <div className="text-sm text-gray-600">New Events: {target.newEvents}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {target.vulnerabilities.critical}
                      </span>
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {target.vulnerabilities.high}
                      </span>
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {target.vulnerabilities.medium}
                      </span>
                      <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {target.vulnerabilities.low}
                      </span>
                      {target.hasError && <span className="text-red-500 ml-2">⚠️</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-green-50">
                        ▶️
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-blue-50">
                        ⚙️
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-blue-50">
                        👁️
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-blue-50">
                        📊
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        🗑️
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
                        ↗️
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
