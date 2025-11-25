import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Props } from '@/types/target.types';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';
import { CVEEntry } from '@/types/scanResult.types';
import { useEffect, useState } from 'react';
import { severityColors } from '@/lib/severityColorCve';
const vulnerabilities = [
  {
    id: 'CWE-78',
    name: 'OS Command Injection',
    count: 1,
    severity: 'critical',
    color: 'bg-teal-500',
  },
  { id: 'CWE-89', name: 'SQL Injection', count: 2, severity: 'critical', color: 'bg-teal-500' },
  {
    id: 'CWE-284',
    name: 'Improper Access Control',
    count: 1,
    severity: 'high',
    color: 'bg-yellow-500',
  },
  {
    id: 'CWE-287',
    name: 'Improper Authentication',
    count: 8,
    severity: 'high',
    color: 'bg-orange-500',
  },
  {
    id: 'CWE-352',
    name: 'Cross-Site Request Forgery',
    count: 2,
    severity: 'medium',
    color: 'bg-pink-500',
  },
  {
    id: 'CWE-79',
    name: 'Cross-Site Scripting',
    count: 1,
    severity: 'medium',
    color: 'bg-pink-600',
  },
  {
    id: 'CWE-200',
    name: 'Information Exposure',
    count: 3,
    severity: 'low',
    color: 'bg-purple-500',
  },
  { id: 'CWE-601', name: 'Open Redirect', count: 1, severity: 'low', color: 'bg-purple-600' },
];

export const VulnerabilitiesList = ({ selectedTarget }: Props) => {
  const [cveList, setCveList] = useState<
    { id: string; severity: string; description: string; count: number }[]
  >([]);

  useEffect(() => {
    if (!selectedTarget) return;

    async function fetchCVEs() {
      try {
        const res = await api.get<ApiResponse<CVEEntry[]>>(`/target/${selectedTarget?.id}/cves`);

        const grouped = groupCVEs(res.data.data);

        setCveList(grouped);
      } catch (err) {
        console.error('Errore nel recupero delle CVE:', err);
      }
    }

    fetchCVEs();
    console.log('Selected Target cve changed: ', cveList);
  }, [selectedTarget]);

  function groupCVEs(cves: CVEEntry[]) {
    const map = new Map<
      string,
      { id: string; severity: string; description: string; count: number }
    >();

    for (const cve of cves) {
      const key = cve.vulnerabilityType;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          severity: cve.severity,
          description: cve.description,
          count: 1,
        });
      } else {
        map.get(key)!.count++;
      }
    }

    return Array.from(map.values());
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top 10 Unpatched Vulnerabilities
        </CardTitle>

        {/* <Button
          variant="ghost"
          className="text-xs bg-green-600 text-white hover:bg-green-700 px-2 py-1 h-6 rounded"
        >
          Hide charts
        </Button> */}
      </CardHeader>

      <CardContent>
        {!selectedTarget ? (
          <p className="text-sm text-gray-500">Nessun target selezionato.</p>
        ) : cveList.length === 0 ? (
          <p className="text-sm text-gray-500">Nessuna CVE rilevata.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {cveList.map((vuln) => (
              <div
                key={vuln.id}
                className={`${severityColors[vuln.severity]} text-white px-4 py-3 rounded`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-3">
                    <a
                      href={`https://nvd.nist.gov/vuln/detail/${vuln.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-sm underline hover:text-gray-200"
                    >
                      {vuln.id}
                    </a>
                  </div>

                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                    {vuln.count}
                  </span>
                </div>

                <p className="text-xs text-white/90 leading-snug">{vuln.description}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
