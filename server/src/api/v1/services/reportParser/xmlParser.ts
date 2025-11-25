import { ZapAlert, ZapInstance, ZapReportParsed } from '@api/v1/types/reportTypes';
import { ApiError, constants } from '@api/v1/utils';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';

/**
 * Parsea l'XML di ZAP e produce un oggetto JSON uniformato e pronto per il frontend.
 */
export async function parseZapXml(filePath: string): Promise<ZapReportParsed> {
  try {
    const xmlContent = await fs.readFile(filePath, 'utf-8');

    // 1. Estraggo solo il contenuto XML valido
    const xmlStart = xmlContent.indexOf('<?xml');
    if (xmlStart === -1) {
      throw new Error('Tag XML non trovato nel file ZAP');
    }

    const cleanedXml = xmlContent.slice(xmlStart);

    // 2. Parser Config
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      textNodeName: 'text',
      // Importante: parseTagValue decodifica le entità HTML (&lt; -> <)
      parseTagValue: true,
    });

    const parsed = parser.parse(cleanedXml);
    // console.log('DEBUG ZAP STRUCTURE:', JSON.stringify(parsed, null, 2)); // <--- FONDAMENTALE

    // 3. Controllo struttura ZAP
    if (!parsed?.OWASPZAPReport?.site) {
      console.log(parsed); // DEGUB
      throw new Error('Formato XML ZAP non valido o site mancante');
    }

    // 1. Gestione SITE: ZAP può riportare più siti o uno solo.
    // Il parser potrebbe restituire un Oggetto o un Array di Oggetti.
    const rawSite = parsed.OWASPZAPReport.site;
    // Prendiamo sempre il primo sito se è un array, altrimenti l'oggetto stesso
    const site = Array.isArray(rawSite) ? rawSite[0] : rawSite;

    console.log('Site Name trovato:', site.name); // Debug: ora dovrebbe stampare l'URL

    // 2. Gestione ALERTS
    // Scendiamo dentro 'alerts' e poi 'alertitem'
    // Attenzione: se non ci sono alert, site.alerts potrebbe essere undefined o stringa vuota
    const alertsContainer = site.alerts;
    const rawAlerts = alertsContainer?.alertitem;

    // Se rawAlerts è undefined, torniamo array vuoto. Se è singolo oggetto, arrayizziamo.
    const alertArray = rawAlerts ? (Array.isArray(rawAlerts) ? rawAlerts : [rawAlerts]) : [];

    const normalizedAlerts: ZapAlert[] = alertArray.map((alert: any) => {
      // 3. Gestione INSTANCES
      const rawInstances = alert.instances?.instance;
      const instanceArray = rawInstances
        ? Array.isArray(rawInstances)
          ? rawInstances
          : [rawInstances]
        : [];

      const normalizedInstances: ZapInstance[] = instanceArray.map((inst: any) => ({
        uri: inst.uri || '',
        method: inst.method || '',
        param: inst.param || '',
        attack: inst.attack || '',
        evidence: inst.evidence || '',
      }));

      return {
        pluginid: String(alert.pluginid),
        name: alert.alert || alert.name, // Fallback nome
        riskcode: String(alert.riskcode ?? '0'),
        confidence: String(alert.confidence ?? '1'),
        desc: alert.desc || '',
        solution: alert.solution || '',
        cweid: alert.cweid || undefined,
        instances: normalizedInstances,
      };
    });

    return {
      site: site.name || 'Unknown Site', // Ora site.name dovrebbe funzionare
      alerts: normalizedAlerts,
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
