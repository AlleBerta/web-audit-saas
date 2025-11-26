import { ServerInfoProps } from '@/types/scanResult.types';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { getStatusBadge } from '@/lib/statusColor';
import { getMethodBadgeVariant } from '@/lib/methodColor';
import { Server } from 'lucide-react';

export function ServerInfo({ data }: ServerInfoProps) {
  // AGGIUNGI QUESTO LOG
  console.log('SERVER INFO DATA RICEVUTI:', data);

  if (!data) {
    console.log('Server INFO: data is null or undefined');
    return (
      <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
        {/* Icona Grigia (Slate), non verde */}
        <Server className="w-12 h-12 mb-3 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-700">Missing Data Report</h3>
        <p className="text-sm">Impossible visualize the summary. Data might be not loaded.</p>
      </div>
    );
  }

  // Se manca data, O manca target, O target è vuoto... mostra fallback
  if (!data?.target) {
    console.log('ServerInfo: ', data);
    return (
      <div className="p-4 border border-dashed rounded-lg bg-slate-50 text-slate-400 text-sm flex items-center gap-2">
        <Server className="w-4 h-4" />
        <span>Info server/target not avaible.</span>
      </div>
    );
  }

  // 2. Accesso Sicuro (Optional Chaining)
  // Usiamo ?. per sicurezza, anche se la guard clause sopra ci protegge già
  const rawMethods = data.target?.allowedMethods;

  // 3. LOGICA DI PARSING SICURA
  const isErrorMessage =
    typeof rawMethods === 'string' &&
    (rawMethods.includes('Non specificato') || rawMethods.includes('Errore'));

  const methodsList =
    !isErrorMessage && typeof rawMethods === 'string'
      ? rawMethods.split(',').map((m: string) => m.trim())
      : Array.isArray(rawMethods)
      ? rawMethods
      : [];

  // Helper per dati sicuri
  const domain = data.target?.domain || 'Unknown Domain';
  const ip = data.target?.ipv4 || 'N/A';
  const server = data.target?.server || 'N/A'; // A volte è fuori da target, dipende dal tuo JSON
  const statusCode = data.target?.statusCode || 'N/A';

  return (
    <Card className="border border-muted rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Server Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dominio */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Domain</span>
          <span className="font-medium">{domain}</span>
        </div>

        {/* Indirizzo IP */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">IP Address</span>
          <span className="font-medium">{ip}</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Timestamp of scan</span>
          <span className="font-medium">{new Date(data.timestamp).toLocaleString('it-IT')}</span>
        </div>

        {/* Server version */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Server Version</span>
          <span className="font-medium">{server}</span>
        </div>

        {/* Status Code */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status Code server</span>
          <Badge
            className={`${getStatusBadge(
              statusCode
            )} px-2 py-0.5 text-sm font-semibold rounded-md shadow-sm`}
          >
            {data.target.statusCode}
          </Badge>
        </div>

        {/* Allowed HTTP Methods */}
        <div className="flex flex-col gap-1.5 mt-4">
          <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
            Allowed Methods
          </span>

          <div className="flex flex-wrap gap-2 mt-4">
            {/* CASO 1: Lista valida trovata */}
            {methodsList.length > 0 ? (
              methodsList.map((method: string) => (
                <Badge key={method} variant="outline" className={getMethodBadgeVariant(method)}>
                  {method}
                </Badge>
              ))
            ) : (
              /* CASO 2: Messaggio di errore o dato mancante */
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-500 border-slate-200 font-normal italic"
              >
                {isErrorMessage
                  ? 'Not Available (OPTIONS not supported)' // Traduciamo l'errore italiano
                  : 'N/A'}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
