import { ServerInfoProps } from '@/types/scanResult.types';
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { getStatusBadge } from '@/lib/statusColor';
import { getMethodBadgeVariant } from '@/lib/methodColor';

export function ServerInfo({ data }: ServerInfoProps) {
  if (!data) return <div>Dati mancanti...</div>;

  {
    /* Logica di Parsing: trasformiamo la stringa in array qui nel frontend */
  }

  const rawMethods = data.target.allowedMethods;

  const isErrorMessage =
    typeof rawMethods === 'string' &&
    (rawMethods.includes('Non specificato') || rawMethods.includes('Errore'));

  // Se non è un errore e è una stringa, splittiamo. Se è già array (sicurezza), lo usiamo.
  const methodsList =
    !isErrorMessage && typeof rawMethods === 'string'
      ? rawMethods.split(',').map((m) => m.trim()) // Divide per virgola e pulisce gli spazi
      : Array.isArray(rawMethods)
      ? rawMethods
      : [];

  return (
    <Card className="border border-muted rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Server Info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dominio */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Domain</span>
          <span className="font-medium">{data.target.domain}</span>
        </div>

        {/* Indirizzo IP */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">IP Address</span>
          <span className="font-medium">{data.target.ipv4}</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Timestamp of scan</span>
          <span className="font-medium">{new Date(data.timestamp).toLocaleString('it-IT')}</span>
        </div>

        {/* Server version */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Server Version</span>
          <span className="font-medium">{data.target.server}</span>
        </div>

        {/* Status Code */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status Code server</span>
          <Badge
            className={`${getStatusBadge(
              data.target.statusCode
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

          <div className="flex flex-wrap gap-2">
            {/* CASO 1: Lista valida trovata */}
            {methodsList.length > 0 ? (
              methodsList.map((method) => (
                <Badge
                  key={method}
                  variant="outline"
                  className={`${getMethodBadgeVariant(
                    method
                  )} px-2 py-0.5 text-[10px] font-bold border`}
                >
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
