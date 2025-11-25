import { CVEItem, CveList, PortItem } from '@api/v1/types/reportTypes';
import { ApiError, constants } from '@api/v1/utils';
import { isHeaderSecure } from '@api/v1/utils/isHeaderSecure';
import fs from 'fs/promises';

export async function parseVAJson(filePath: string) {
  // Definizione delle porte critiche
  const CRITICAL_PORTS = [21, 22, 23, 25, 445, 3389, 5900, 8080];

  try {
    // 1. Lettura e Parsing
    const raw = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);

    // 2. Estrazione dati grezzi con fallback sicuri
    const rawHeaders = data.scanResults?.security_headers ?? {};
    const serverInfo = data.scanResults?.info ?? {}; // Previeni crash se info manca

    const serverVersion = serverInfo.server ?? 'N/A';
    const status_code = serverInfo.status_code ?? 'N/A';
    const allowed_methods = serverInfo.allowed_methods ?? 'N/A';

    // 3. Elaborazione Headers
    const headersStats = Object.entries(rawHeaders).reduce(
      (acc, [key, value]) => {
        const valString = String(value);

        // Caso 1: Header MANCANTE
        if (valString === 'Mancante') {
          acc.missing.items.push(key);
          acc.missing.count++;
        }
        // Caso 2: Header PRESENTE e VALIDO (OK)
        else if (
          valString.toLowerCase() === 'ok' ||
          valString === 'correct' ||
          // Assicurati che isHeaderSecure sia accessibile qui!
          isHeaderSecure(key, valString)
        ) {
          acc.ok.items.push(key);
          acc.ok.count++;
        }
        // Caso 3: Header PRESENTE ma NON SICURO
        else {
          acc.misconfigured.items.push({ name: key, value: valString });
          acc.misconfigured.count++;
        }

        return acc;
      },
      {
        missing: { count: 0, items: [] as string[] },
        misconfigured: { count: 0, items: [] as { name: string; value: string }[] },
        ok: { count: 0, items: [] as string[] },
      }
    );

    // 4. Elaborazione Porte
    const openPorts: PortItem[] = data.scanResults?.network_scan?.open_ports ?? [];

    // Mappatura sicura per il frontend (gestione undefined)
    const ListOpenPorts = openPorts
      .map((p) => ({
        port: p.port,
        protocol: p.protocol || 'tcp', // Default tcp se manca
        state: p.state,
        service: p.service || 'unknown',
        product: p.product || '', // Importante: evita undefined
        version: p.version || '', // Importante: evita undefined
        vendor: p.vendor || '', // Importante: evita undefined
        isCritical: CRITICAL_PORTS.includes(p.port),
      }))
      .sort((a, b) => a.port - b.port);

    // Debug log utile
    console.log(`[Parser] Found ${ListOpenPorts.length} open ports for ${filePath}`);

    // 5. Elaborazione CVE
    const cveList: CVEItem[] = data.scanResults?.network_scan?.cve_search ?? [];

    const mostCritical: CVEItem | null =
      cveList.length > 0
        ? cveList.reduce<CVEItem>((max, curr) => {
            const currScore = curr.cvss?.base_score_v3 ?? 0;
            const maxScore = max.cvss?.base_score_v3 ?? 0;
            return currScore > maxScore ? curr : max;
          }, cveList[0])
        : null;

    const rawCveList = data.scanResults?.network_scan?.cve_search ?? [];

    // MAPPATURA PULITA PER IL FRONTEND
    const mappedCveList: CveList[] = rawCveList.map((item: any) => ({
      name: item.cve_id, // Mappiamo cve_id su 'name'
      title: item.title ?? 'No title available',
      summary: item.summary ?? '',

      // Gestione sicura dei punteggi
      base_score_v3: item.cvss?.base_score_v3 ?? 0,
      impact_score: item.cvss?.impact_score ?? 0,

      // Attenzione alla 's' finale e alla gestione booleani
      exploit_exist: !!item.exploit_exists,

      publish_date: item.publish_date,

      // Nuovi campi utili
      link: item.url,
      epss_score: item.epss?.score ?? 0,
      product: item.product?.name
        ? `${item.product.name} ${item.product.version_title ?? ''}`
        : 'Unknown Product',

      // Flags (Le passiamo dirette se la struttura coincide, o mettiamo default false)
      flags: item.flags ?? {
        overflow: false,
        memory_corruption: false,
        sql_injection: false,
        xss: false,
        directory_traversal: false,
        file_inclusion: false,
        csrf: false,
        xxe: false,
        ssrf: false,
        open_redirect: false,
        input_validation: false,
        code_execution: false,
        bypass: false,
        privilege_escalation: false,
        dos: false,
        information_leak: false,
        ransomware: false,
      },
    }));

    // 6. Return finale
    return {
      info: {
        server: serverVersion,
        statusCode: status_code,
        allowed_methods: allowed_methods,
      },

      vulnerabilities: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0,
      },

      securityScore: 0,

      ports: {
        open: openPorts.length,
        criticalOpen: openPorts.filter((p) => CRITICAL_PORTS.includes(p.port)).length,
        openPortsList: ListOpenPorts,
      },

      cve: {
        total: cveList.length,
        critical: cveList.filter((c: CVEItem) => (c.cvss?.base_score_v3 ?? 0) >= 9).length,
        ...(mostCritical && {
          mostCriticalCve: {
            id: mostCritical.cve_id,
            nistUrl: `https://nvd.nist.gov/vuln/detail/${mostCritical.cve_id}`,
          },
        }),
        cveList: mappedCveList,
      },

      headers: headersStats,
    };
  } catch (error) {
    console.error(`ERRORE nel parsing del file: ${filePath}`);
    console.error(error);
    // Rilanciamo l'errore o ritorniamo null a seconda di come gestisci gli errori nel controller
    throw new ApiError(
      constants.CONFLICT,
      `Failed to parse report file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// export async function parseVAJson(filePath: string) {
//   // Definizione delle porte critiche
//   const CRITICAL_PORTS = [21, 22, 23, 25, 445, 3389, 5900, 8080];

//   const raw = await fs.readFile(filePath, 'utf-8');
//   const data = JSON.parse(raw);
//   const rawHeaders = data.scanResults.security_headers ?? {};
//   const serverVersion = data.scanResults.info.server ?? 'N/A';
//   const status_code = data.scanResults.info.status_code ?? 'N/A';
//   const allowed_methods = data.scanResults.info.allowed_methods ?? 'N/A';

//   // Inizializziamo l'accumulatore
//   const headersStats = Object.entries(rawHeaders).reduce(
//     (acc, [key, value]) => {
//       const valString = String(value);

//       // 1. Caso Header MANCANTE
//       if (valString === 'Mancante') {
//         acc.missing.items.push(key);
//         acc.missing.count++;
//       }
//       // 2. Caso Header PRESENTE e VALIDO (OK)
//       // Controlliamo se il valore specifico è considerato sicuro
//       else if (
//         valString.toLowerCase() === 'ok' ||
//         valString === 'Correct' ||
//         isHeaderSecure(key, valString)
//       ) {
//         acc.ok.items.push(key);
//         acc.ok.count++;
//       }
//       // 3. Caso Header PRESENTE ma NON SICURO (Misconfigured)
//       else {
//         acc.misconfigured.items.push({ name: key, value: valString });
//         acc.misconfigured.count++;
//       }

//       return acc;
//     },
//     {
//       missing: { count: 0, items: [] as string[] },
//       misconfigured: { count: 0, items: [] as { name: string; value: string }[] },
//       ok: { count: 0, items: [] as string[] },
//     }
//   );

//   // Porte aperte
//   const openPorts: PortItem[] = data.scanResults.network_scan?.open_ports ?? [];

//   // CVE trovate
//   const cveList: CVEItem[] = data.scanResults.network_scan?.cve_search ?? [];

//   // CVE più critica (base_score_v3 massimo)
//   const mostCritical: CVEItem | null =
//     cveList.length > 0
//       ? cveList.reduce<CVEItem>((max, curr) => {
//           const currScore = curr.cvss?.base_score_v3 ?? 0;
//           const maxScore = max.cvss?.base_score_v3 ?? 0;
//           return currScore > maxScore ? curr : max;
//         }, cveList[0])
//       : null;

//   console.log('openPorts: ', openPorts);
//   const ListOpenPorts = openPorts
//     .map((p) => ({
//       port: p.port,
//       protocol: p.protocol,
//       state: p.state,
//       service: p.service,
//       product: p.product,
//       version: p.version,
//       vendor: p.vendor,
//       isCritical: CRITICAL_PORTS.includes(p.port),
//     }))
//     .sort((a, b) => a.port - b.port);

//   console.log('listOpenPorts: ', ListOpenPorts);
//   return {
//     info: {
//       server: serverVersion,
//       statusCode: status_code,
//       allowed_methods: allowed_methods,
//     },

//     vulnerabilities: {
//       critical: 0, // JSON attuale non ha la categoria
//       high: 0,
//       medium: 0,
//       low: 0,
//       info: 0,
//     },

//     securityScore: 0, // da definire (si può calcolare in futuro)

//     ports: {
//       open: openPorts.length,
//       criticalOpen: openPorts.filter((p) => CRITICAL_PORTS.includes(p.port)).length,

//       openPortsList: ListOpenPorts,
//     },

//     cve: {
//       total: cveList.length,
//       critical: cveList.filter((c: CVEItem) => (c.cvss?.base_score_v3 ?? 0) >= 9).length,

//       ...(mostCritical && {
//         mostCriticalCve: {
//           id: mostCritical.cve_id,
//           nistUrl: `https://nvd.nist.gov/vuln/detail/${mostCritical.cve_id}`,
//         },
//       }),
//     },

//     headers: headersStats,
//   };
// }
