export const severityColors: Record<string, string> = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-black',
  low: 'bg-green-500 text-white',
  info: 'bg-blue-500 text-white',
};

export const getSeverityColor = (score: number): string => {
  // Gestione sicurezza: se il dato manca, lo trattiamo come Info o gestisci come preferisci
  if (score === undefined || score === null) return severityColors.info;

  if (score >= 9.0) return severityColors.critical;
  if (score >= 7.0) return severityColors.high;
  if (score >= 4.0) return severityColors.medium;
  if (score > 0.0) return severityColors.low; // Copre da 0.1 a 3.9

  return severityColors.info; // Copre 0.0
};

// Funzione per estrarre le flag attive in un array di stringhe leggibili
export const getActiveFlags = (flags: Record<string, boolean>) => {
  return Object.entries(flags)
    .filter(([_, isActive]) => isActive)
    .map(([key]) => key.replace(/_/g, ' ').toUpperCase()); // es: sql_injection -> SQL INJECTION
};
