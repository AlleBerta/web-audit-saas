import { OpenPortsProps } from '@/types/scanResult.types';
import { Globe, HelpCircle, Network, Server, ShieldCheck } from 'lucide-react';
import React from 'react';
import { Badge } from '../ui/badge';

// Helper per scegliere un'icona in base al servizio (Opzionale, ma carino)
const getServiceIcon = (service: string) => {
  const s = service.toLowerCase();
  if (s.includes('http')) return <Globe className="w-4 h-4 text-blue-500" />;
  if (s.includes('dns') || s.includes('domain'))
    return <Network className="w-4 h-4 text-purple-500" />;
  if (s.includes('ssh') || s.includes('ftp')) return <Server className="w-4 h-4 text-slate-500" />;
  return <HelpCircle className="w-4 h-4 text-gray-400" />;
};

export function OpenPorts({ data }: OpenPortsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center border rounded-lg border-dashed text-muted-foreground bg-slate-50">
        <ShieldCheck className="w-10 h-10 mx-auto mb-2 text-green-500/50" />
        <p>No open doors detected or missing data.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
          <tr>
            <th className="px-4 py-3 w-[20%]">Port / Proto</th>
            <th className="px-4 py-3 w-[25%]">Service</th>
            <th className="px-4 py-3 w-[40%]">Software Detected</th>
            <th className="px-4 py-3 w-[15%] text-right">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item, index) => {
            // Logica per costruire la stringa del software
            // Unisce product e version, oppure mette un placeholder
            const softwareInfo = [item.product, item.version]
              .filter(Boolean) // Rimuove stringhe vuote o null
              .join(' '); // Unisce con uno spazio

            return (
              <tr
                key={`${item.port}-${index}`}
                className={`transition-colors border-b ${
                  item.isCritical
                    ? 'bg-red-50/60 hover:bg-red-50 border-red-100' // Sfondo rossiccio se critica
                    : 'hover:bg-slate-50 border-slate-100'
                }`}
              >
                {/* Colonna Porta */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-700">
                      {item.port}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {item.protocol}
                    </span>
                  </div>
                </td>

                {/* Colonna Servizio */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    {getServiceIcon(item.service)}
                    <span className="capitalize">{item.service}</span>
                  </div>
                </td>

                {/* Colonna Software (Gestione dati mancanti) */}
                <td className="px-4 py-3">
                  {softwareInfo ? (
                    <span className="font-mono text-xs text-slate-600 bg-slate-100/50 px-2 py-1 rounded">
                      {softwareInfo}
                    </span>
                  ) : (
                    <span className="text-slate-300 italic text-xs">— Unknown —</span>
                  )}
                </td>

                {/* Colonna Stato */}
                <td className="px-4 py-3 text-right">
                  <Badge
                    variant="outline"
                    className={
                      item.state === 'open'
                        ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-600'
                    }
                  >
                    {item.state.toUpperCase()}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
