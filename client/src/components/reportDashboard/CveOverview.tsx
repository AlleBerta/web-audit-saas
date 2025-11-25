import { CveList, CveOverviewProps } from '@/types/scanResult.types';
import { Layers, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { getSeverityColor } from '@/lib/severityColorCve';
import { CveDetailModal } from './CveDetailModal';

export function CveOverview({ data }: CveOverviewProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg border-dashed text-muted-foreground bg-slate-50">
        <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-green-500/50" />
        <p>No open doors detected or missing data.</p>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCve, setSelectedCve] = useState<CveList | null>(null);

  // Logica di Filtro
  const filteredCves = data
    .filter((cve) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        cve.name.toLowerCase().includes(searchLower) || // Cerca per ID (CVE-202X...)
        cve.product?.toLowerCase().includes(searchLower) || // Cerca per Prodotto
        cve.title.toLowerCase().includes(searchLower) // Cerca nel titolo
      );
    })
    .sort((a, b) => b.base_score_v3 - a.base_score_v3); // Ordina per gravità (decrescente)

  return (
    <div className="space-y-4">
      {/* --- HEADER & FILTRI --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600" />
            Vulnerabilità Rilevate
            <span className="ml-2 text-sm bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
              {filteredCves.length}
            </span>
          </h2>
          <p className="text-sm text-slate-500">
            Lista delle CVE note identificate analizzando le versioni software.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca CVE, prodotto..."
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABELLA DATI --- */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b">
              <tr>
                <th className="px-4 py-3">CVE ID</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3 hidden md:table-cell">EPSS Score</th>
                <th className="px-4 py-3 hidden lg:table-cell">Published</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCves.map((cve) => (
                <tr
                  key={cve.name}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedCve(cve)}
                >
                  {/* ID & Flags Summary */}
                  <td className="px-4 py-3 font-medium text-blue-600 group-hover:underline">
                    {cve.name}
                    {cve.exploit_exist && (
                      <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded border border-red-200 font-bold">
                        EXPLOIT
                      </span>
                    )}
                  </td>

                  {/* Score Badge */}
                  <td className="px-4 py-3">
                    <Badge className={`${getSeverityColor(cve.base_score_v3)} border-none`}>
                      {cve.base_score_v3.toFixed(1)}
                    </Badge>
                  </td>

                  {/* Product */}
                  <td className="px-4 py-3 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-slate-400" />
                      {cve.product || 'N/A'}
                    </div>
                  </td>

                  {/* EPSS (Probabilità) */}
                  <td className="px-4 py-3 hidden md:table-cell">
                    {cve.epss_score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500"
                            style={{ width: `${Math.min(cve.epss_score * 100 * 5, 100)}%` }} // *5 per scala visiva
                          />
                        </div>
                        <span className="text-xs text-slate-500">
                          {(cve.epss_score * 100).toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-500">
                    {new Date(cve.publish_date).toLocaleDateString()}
                  </td>

                  {/* Action Button */}
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-slate-500 hover:text-slate-800 border px-2 py-1 rounded bg-white">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {filteredCves.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                    Nessuna vulnerabilità trovata con questo filtro.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALE DETTAGLI --- */}
      {selectedCve && <CveDetailModal cve={selectedCve} onClose={() => setSelectedCve(null)} />}
    </div>
  );
}
