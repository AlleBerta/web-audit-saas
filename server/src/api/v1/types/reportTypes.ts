// meta
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ScanStats {
  bySeverity: Record<SeverityLevel, number>;
  byType: {
    va: number; // Totale VA (CVE)
    pt: number; // Totale PT (Non-CVE)
  };
}

// VA
export interface CVEItem {
  cve_id: string;
  cvss?: {
    base_score_v3?: number;
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

  // --- NUOVI CAMPI CONSIGLIATI ---
  link?: string; // URL per dettagli esterni
  epss_score?: number; // Score EPSS
  product?: string; // Es: "Apache Http Server"
  // ------------------------------

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

export interface PortItem {
  port: number;
  protocol: string;
  state: string;
  service: string;
  vendor?: string;
  product?: string;
  version?: string;
}

export interface JsonReport {
  scanResults: {
    security_headers?: Record<string, string>;
    network_scan?: {
      open_ports?: PortItem[];
      cve_search?: CVEItem[];
    };
  };
}

// PT
export interface ZapAlert {
  pluginid: string;
  name: string;
  riskcode: string; // Stringa (0, 1, 2, 3)
  confidence: string;
  desc: string; // HTML String
  solution: string; // HTML String
  instances: ZapInstance[];
  cweid?: string;
}

export interface ZapInstance {
  uri: string;
  method: string;
  param: string;
  attack: string;
  evidence: string;
}

export interface ZapReportParsed {
  site: string;
  alerts: ZapAlert[];
}
