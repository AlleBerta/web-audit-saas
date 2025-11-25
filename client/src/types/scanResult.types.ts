export interface ScanResult {
  id: number;
  scanId: number;
  vulnerabilityType: string;
  severity: string;
  description: string;
  urlAffected?: string; // Per la Dashboard non serve
}

export interface CVEEntry {
  id: number;
  scanId: number;
  vulnerabilityType: string; // es: "CVE-2023-1234"
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface SummaryResponseProps {
  data: FullReportResponse | null;
  onExportClick?: () => void;
  isPrinting?: boolean;
}
export interface ServerInfoProps {
  data?: FullReportMeta;
}
export interface HeadersTableProps {
  data?: HeadersVA;
}
export interface OpenPortsProps {
  data?: OpenPort[];
}
export interface CveOverviewProps {
  data?: CveList[];
  isPrinting?: boolean;
}
export interface ZapScanSectionProps {
  data?: ZapAlert[];
  isPrinting?: boolean;
}
// Interfacce per le risposte alla chiamata API di ReportView
export interface FullReportResponse {
  meta: FullReportMeta;
  va: FullReportVA;
  pt: FullReportPT;
}

export interface FullReportMeta {
  reportId: number;
  timestamp: string;
  status: string;
  target: {
    id: number;
    domain: string;
    ipv4: string;
    server: string;
    statusCode: string;
    allowedMethods: string;
  };
  project: {
    id: number;
    name: string;
  };
  totVuln: {
    bySeverity: {
      critical: number;
      high: number;
      medium: number;
      low: number;
      info: number;
    };
    byType: {
      va: number;
      pt: number;
    };
  };
}

export interface FullReportVA {
  securityScore: number;

  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };

  headers: HeadersVA;

  ports: {
    open: number;
    criticalOpen: number;
    openPortsList?: OpenPort[];
  };

  cve: {
    total: number;
    critical: number;
    cveList: CveList[];
  };
}

export interface OpenPort {
  port: number;
  protocol: string;
  state: string;
  service: string;
  vendor?: string;
  product?: string;
  version?: string;
  isCritical: boolean;
}
interface VAHeaderMisconfiguredItem {
  name: string;
  value: string;
}
export interface HeadersVA {
  missing: {
    count: number;
    items: string[];
  };
  misconfigured: {
    count: number;
    items: VAHeaderMisconfiguredItem[];
  };
  ok: {
    count: number;
    items: string[];
  };
}
export interface CveList {
  name: string; // Mappiamo qui il cve_id
  base_score_v3: number;
  impact_score: number;
  title: string;
  summary: string;
  exploit_exist: boolean; // Attento: nel JSON è exploit_exists (con la s)
  publish_date: string;
  link?: string; // URL per dettagli esterni
  epss_score?: number; // Score EPSS
  product?: string; // Es: "Apache Http Server"

  flags: {
    overflow: boolean;
    memory_corruption: boolean;
    sql_injection: boolean;
    xss: boolean;
    directory_traversal: boolean;
    file_inclusion: boolean;
    csrf: boolean;
    xxe: boolean;
    ssrf: boolean;
    open_redirect: boolean;
    input_validation: boolean;
    code_execution: boolean;
    bypass: boolean;
    privilege_escalation: boolean;
    dos: boolean;
    information_leak: boolean;
    ransomware: boolean;
  };
}
export interface FullReportPT {
  site: string;
  alerts: ZapAlert[];
}

export interface ZapAlert {
  pluginid: string;
  name: string; // es: "Cross Site Scripting (DOM Based)"
  riskcode: string; // "0"=Info, "1"=Low, "2"=Medium, "3"=High
  confidence: string; // Livello di certezza
  desc: string; // Descrizione (spesso contiene HTML)
  solution: string; // Soluzione (spesso contiene HTML)
  instances: ZapInstance[]; // Lista delle URL colpite da QUESTA vulnerabilità
  cweid?: string;
}

interface ZapInstance {
  uri: string;
  method: string;
  param?: string;
  attack?: string; // il payload utilizzato
  evidence?: string; // la prova trovata
}
