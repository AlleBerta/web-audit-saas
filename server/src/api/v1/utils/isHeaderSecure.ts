/**
 * @description Funzione helper per validare se il valore di un header è sicuro
 */
export const isHeaderSecure = (name: string, value: string): boolean => {
  const val = value.toLowerCase().trim();

  switch (name.toLowerCase()) {
    // --- I CLASSICI ---
    case 'x-frame-options':
      return val === 'deny' || val === 'sameorigin';

    case 'x-content-type-options':
      return val === 'nosniff';

    case 'strict-transport-security':
      return val.includes('max-age');

    case 'content-security-policy':
      // Basta che ci sia e non sia vuoto
      return val.length > 0;

    case 'referrer-policy':
      return (
        val.includes('no-referrer') || val.includes('same-origin') || val.includes('strict-origin')
      );

    case 'permissions-policy':
      return val.length > 0;

    // --- I NUOVI (MODERNI & CRITICI) ---

    case 'cache-control':
      // Per essere sicuro, non deve permettere il caching pubblico indiscriminato.
      // 'no-store', 'no-cache' sono i migliori. 'private' è ok per dati utente.
      // Se è solo 'public' o manca di direttive restrittive, lo consideriamo debole.
      return val.includes('no-store') || val.includes('no-cache') || val.includes('private');

    case 'set-cookie':
      // Un cookie sicuro deve avere SEMPRE i flag Secure e HttpOnly.
      // SameSite è ottimo, ma Secure+HttpOnly è il minimo sindacale.
      return val.includes('secure') && val.includes('httponly');

    case 'access-control-allow-origin':
      // Il wildcard '*' è insicuro se si gestiscono credenziali.
      // È sicuro solo se l'API è totalmente pubblica.
      // In un audit di sicurezza, '*' viene solitamente segnalato come warning/misconfig.
      return val !== '*';

    case 'cross-origin-opener-policy':
      // (COOP) Protegge da attacchi cross-window.
      // Valori sicuri: 'same-origin' o 'same-origin-allow-popups'
      return val.includes('same-origin');

    case 'cross-origin-embedder-policy':
      // (COEP) Necessario per abilitare funzionalità potenti come SharedArrayBuffer.
      return val.includes('require-corp') || val.includes('credentialless');

    case 'cross-origin-resource-policy':
      // (CORP) Limita chi può caricare le tue risorse.
      return val.includes('same-origin') || val.includes('same-site');

    default:
      // Se l'header non è nella lista dei "sorvegliati speciali",
      // ma è presente (quindi non è "Mancante"), lo diamo per buono.
      return true;
  }
};
