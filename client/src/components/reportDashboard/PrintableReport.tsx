import React from 'react';
import { SummarySection } from './SummarySection'; // I tuoi componenti
import { ServerInfo } from './ServerInfo';
import { HeadersTable } from './HeadersTable';
import { OpenPorts } from './OpenPorts';
import { CveOverview } from './CveOverview';
import { ZapScanSection } from './ZapScanSection';
import { ReportFooter } from '../ReportFooter';
import { ShieldCheck, Crosshair } from 'lucide-react';

interface PrintableReportProps {
  data: any; // O la tua interfaccia FullReportResponse
}

// Usiamo React.forwardRef per permettere alla libreria di stampa di "agganciare" questo componente
export const PrintableReport = React.forwardRef<HTMLDivElement, PrintableReportProps>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="p-2 bg-white text-slate-900 print-container">
        {/* --- FRONTESPIZIO / HEADER PDF con descrizione --- */}
        <div className="mb-10 border-b pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Security Audit Report</h1>
              <div className="text-slate-500">
                <p className="font-medium text-lg">
                  Target:{' '}
                  <span className="text-slate-900">{data?.meta?.target?.domain || 'Unknown'}</span>
                </p>
                <p className="text-sm">
                  Scan Date:{' '}
                  {data?.meta?.timestamp
                    ? new Date(data.meta.timestamp).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
            {/* Opzionale: Qui potresti mettere il tuo Logo */}
          </div>

          {/* DESCRIZIONE AGGIUNTA */}
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600 leading-relaxed text-justify">
            <p>
              This document presents the findings of a comprehensive security assessment conducted
              on the target infrastructure. The analysis includes a{' '}
              <strong>Vulnerability Assessment (VA)</strong> phase, identifying known CVEs, open
              ports, and misconfigurations, followed by an automated{' '}
              <strong>Penetration Testing (PT)</strong> phase performing active attacks (e.g., XSS,
              SQLi) to validate security posture. The goal is to highlight critical risks and
              provide actionable remediation strategies.
            </p>
          </div>
        </div>

        {/* --- 1. SUMMARY --- */}
        <section className="mb-12 break-inside-avoid">
          <SummarySection data={data} isPrinting={true} />
        </section>

        {/* --- 2. VULNERABILITY ASSESSMENT (VA) --- */}
        <div className="mb-6 flex items-center gap-2 border-b-2 border-indigo-600 pb-2 break-after-avoid">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-indigo-900">Vulnerability Assessment</h2>
        </div>

        <div className="space-y-8 mb-12">
          <section className="break-inside-avoid">
            <h3 className="font-bold text-lg mb-4">Server & Info</h3>
            <ServerInfo data={data?.meta} />
          </section>

          <section className="break-inside-avoid">
            <h3 className="font-bold text-lg mb-4">Security Headers</h3>
            <HeadersTable data={data?.va?.headers} />
          </section>

          <section className="break-inside-avoid">
            <h3 className="font-bold text-lg mb-4">Open Ports</h3>
            <OpenPorts data={data?.va?.ports?.openPortsList} />
          </section>

          <section className="break-before-auto">
            <h3 className="font-bold text-lg mb-4">CVE Overview</h3>
            {/* Attenzione: se la lista CVE è lunghissima, si spaccherà su più pagine. È normale. */}
            <CveOverview data={data?.va?.cve?.cveList ?? []} isPrinting={true} />
          </section>
        </div>

        {/* --- 3. PENETRATION TEST (PT) --- */}
        <div className="mb-6 flex items-center gap-2 border-b-2 border-red-600 pb-2 break-before-page">
          <Crosshair className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-bold text-red-900">Penetration Testing (ZAP)</h2>
        </div>

        <div className="space-y-8">
          <ZapScanSection data={data?.pt?.alerts ?? []} isPrinting={true} />
        </div>

        {/* --- FOOTER --- */}
        <ReportFooter />
      </div>
    );
  }
);

PrintableReport.displayName = 'PrintableReport';
