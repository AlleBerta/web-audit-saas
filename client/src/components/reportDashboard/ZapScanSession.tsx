import { getZapRiskColor, getZapRiskLabel } from '@/lib/zapRisk';
import { ZapAlert, ZapScanSectionProps } from '@/types/scanResult.types';
import { Badge, Bug, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

// Helper per pulire l'HTML di ZAP (rimuove i tag <p>, <b> ecc per la visualizzazione preview)
const stripHtml = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
};

export function ZapScanSession({ data }: ZapScanSectionProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg border-dashed text-muted-foreground bg-slate-50">
        <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-green-500/50" />
        <p>No vulnerability detected or missing data.</p>
      </div>
    );
  }
  // Ordiniamo per rischio (High prima)
  const sortedAlerts = [...data].sort((a, b) => Number(b.riskcode) - Number(a.riskcode));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bug className="w-8 h-8 text-indigo-600" />
        <div>
          <h2 className="text-2xl font-bold">OWASP ZAP Report</h2>
          <p className="text-slate-500">Results of the automatic penetration test</p>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedAlerts.map((alert, index) => (
          <ZapAlertItem key={`${alert.pluginid}-${index}`} alert={alert} />
        ))}
      </div>
    </div>
  );
}
// Sottocomponente per la singola Card Espandibile
function ZapAlertItem({ alert }: { alert: ZapAlert }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border rounded-lg bg-white transition-all duration-200 ${
        isOpen ? 'shadow-md ring-1 ring-indigo-100' : 'shadow-sm'
      }`}
    >
      {/* --- HEADER (Sempre visibile) --- */}
      <div
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer gap-4 hover:bg-slate-50 rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start gap-4">
          {/* Badge Rischio */}
          <Badge
            className={`${getZapRiskColor(
              alert.riskcode
            )} px-3 py-1 text-sm font-bold min-w-[80px] justify-center`}
          >
            {getZapRiskLabel(alert.riskcode)}
          </Badge>

          <div>
            <h3 className="font-bold text-slate-800 text-lg">{alert.name}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Hit <span className="font-bold text-indigo-600">{alert.instances.length}</span>{' '}
              {alert.instances.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>
        </div>

        <button className="text-slate-400">{isOpen ? <ChevronUp /> : <ChevronDown />}</button>
      </div>

      {/* --- BODY (Visibile solo se aperto) --- */}
      {isOpen && (
        <div className="p-6 border-t bg-slate-50/50 space-y-6">
          {/* Descrizione & Soluzione */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Description</h4>
              <div
                className="text-sm text-slate-600 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: alert.desc }} // ZAP manda HTML sicuro di solito
              />
            </div>
            <div>
              <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">
                Recommended Solution
              </h4>
              <div
                className="text-sm text-slate-600 prose prose-sm max-w-none p-3 bg-green-50 border border-green-100 rounded-md"
                dangerouslySetInnerHTML={{ __html: alert.solution }}
              />
            </div>
          </div>

          {/* Tabella Istanze */}
          <div>
            <h4 className="font-bold text-slate-700 mb-3 text-sm uppercase flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Affected Resources ({alert.instances.length})
            </h4>

            <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="px-4 py-2 w-20">Method</th>
                    <th className="px-4 py-2">URL</th>
                    <th className="px-4 py-2 w-32">Param</th>
                    <th className="px-4 py-2">Attack Payload (Snippet)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alert.instances.map((inst, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono font-bold text-xs">{inst.method}</td>
                      <td className="px-4 py-2 font-mono text-xs break-all text-blue-600">
                        {inst.uri}
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-orange-600">
                        {inst.param || '-'}
                      </td>
                      <td
                        className="px-4 py-2 font-mono text-[10px] text-slate-500 truncate max-w-[200px]"
                        title={inst.attack}
                      >
                        {inst.attack}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
