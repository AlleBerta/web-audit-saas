import { HeadersTableProps } from '@/types/scanResult.types';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import React from 'react';

// Lista degli header che vogliamo monitorare prioritariamente
const SECURITY_HEADERS = [
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Permissions-Policy',
  'Referrer-Policy',
  'Cache-Control',
  'Set-Cookie',
  'Access-Control-Allow-Origin',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Resource-Policy',
];

export function HeadersTable({ data }: HeadersTableProps) {
  // 1. Guard Clause per dati mancanti
  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground border rounded-lg border-dashed">
        Header'data not avaible.
      </div>
    );
  }

  // 2. Logica di Normalizzazione (Memoizzata nella render function per semplicità)
  const rows = SECURITY_HEADERS.map((headerName) => {
    // Caso 1: È OK?
    if (data.ok?.items.includes(headerName)) {
      return {
        name: headerName,
        value: 'Correctly Configured', // O lascia '—' se preferisci
        status: 'ok',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        rowClass: 'bg-green-50/50 hover:bg-green-50',
      };
    }

    // Caso 2: È Misconfigured?
    // Cerchiamo nell'array di oggetti
    const misConfig = data.misconfigured?.items.find((item) => item.name === headerName);
    if (misConfig) {
      return {
        name: headerName,
        value: misConfig.value || 'Weak Configuration', // Mostriamo il valore errato
        status: 'warning',
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
        rowClass: 'bg-orange-50/50 hover:bg-orange-50',
      };
    }

    // Caso 3: È Mancante (o Fallback)
    // Se è esplicitamente in missing O se non l'abbiamo trovato negli altri
    return {
      name: headerName,
      value: 'Not Present',
      status: 'missing',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      rowClass: 'hover:bg-gray-50',
    };
  });

  // 3. Render della UI
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
          <tr>
            <th className="px-4 py-3 w-[35%]">Header Name</th>
            <th className="px-4 py-3 w-[45%]">Value / Details</th>
            <th className="px-4 py-3 w-[20%] text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.name} className={`transition-colors ${row.rowClass}`}>
              {/* Nome Header */}
              <td className="px-4 py-3 font-medium text-slate-800">{row.name}</td>

              {/* Valore o Messaggio */}
              <td
                className="px-4 py-3 text-slate-600 font-mono text-xs truncate max-w-[200px]"
                title={row.value}
              >
                {row.value}
              </td>

              {/* Icona di Stato */}
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end items-center">{row.icon}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Opzionale con legenda rapida */}
      <div className="px-4 py-2 bg-slate-50 text-xs text-slate-400 flex gap-4 justify-end border-t">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> Secure
        </span>
        <span className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Weak
        </span>
        <span className="flex items-center gap-1">
          <XCircle className="w-3 h-3" /> Missing
        </span>
      </div>
    </div>
  );
}
