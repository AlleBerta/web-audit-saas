import { CveOverview } from '@/components/reportDashboard/CveOverview';
import { HeadersTable } from '@/components/reportDashboard/HeadersTable';
import { OpenPorts } from '@/components/reportDashboard/OpenPorts';
import PageHeader from '@/components/PageHeader';
import { ServerInfo } from '@/components/reportDashboard/ServerInfo';
import { SummarySection } from '@/components/reportDashboard/SummarySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ApiResponse } from '@/types/server_response.types';
import { FullReportResponse } from '@/types/scanResult.types';
import api from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Crosshair, ShieldCheck, FileX, Download } from 'lucide-react';
import { ReportFooter } from '@/components/ReportFooter';
import { ZapScanSection } from '@/components/reportDashboard/ZapScanSection';
import { PrintableReport } from '@/components/reportDashboard/PrintableReport';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function ReportView() {
  const { scanId } = useParams<{ scanId: string }>();
  const numericScanId = scanId ? Number(scanId) : NaN;

  const [loading, setLoading] = useState(true); // Partiamo true per evitare flash
  const [fullReport, setFullReport] = useState<FullReportResponse | null>(null);

  // ----- Logica di stampa QUI nel genitore -----
  // 1. Calcoliamo il nome del file dinamicamente
  // Usiamo useMemo o lo calcoliamo direttamente nel render (è leggero)
  const reportFileName = (() => {
    if (!fullReport) return 'Security_Report';

    // Puliamo il dominio (via https:// e via caratteri strani)
    const rawDomain = fullReport.meta.target.domain || 'target';
    const cleanDomain = rawDomain
      .replace(/^https?:\/\//, '') // Rimuove protocollo
      .replace(/[^a-zA-Z0-9.-]/g, '_'); // Sostituisce caratteri non sicuri con _

    // Formattiamo la data (YYYY-MM-DD) prendendola dal timestamp del report
    const dateStr = fullReport.meta.timestamp
      ? new Date(fullReport.meta.timestamp).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    return `Security_Report_${cleanDomain}_${dateStr}`;
  })();
  const printRef = useRef<HTMLDivElement>(null);
  // 2. Passiamo il nome calcolato a documentTitle
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: reportFileName,
    // CSS INIETTATO SOLO AL MOMENTO DELLA STAMPA
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm; /* 1.5cm di margine bianco attorno al foglio */
      }

      @media print {
        /* FORZA LA STAMPA DEI COLORI DI SFONDO E TESTO */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }

        /* Gestione interruzioni pagina intelligenti */
        tr, td, div {
          break-inside: avoid; /* Cerca di non spezzare le righe a metà */
        }

        /* Rimuove eventuali scrollbar o sfondi strani del body */
        body {
          background-color: #ffffff !important;
          margin: 0 !important;
        }
      }
    `,
  });

  // Fetch Data con protezione "isMounted"
  useEffect(() => {
    let isMounted = true;

    if (isNaN(numericScanId)) {
      setLoading(false);
      return;
    }

    const fetchFullReport = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<FullReportResponse>>(`/report/${numericScanId}/full`);

        if (isMounted && res.data?.data) {
          setFullReport(res.data.data);
          console.log('Full Report Data:', res.data.data); // Debug log
        }
      } catch (error: any) {
        if (isMounted) {
          console.error(error);
          toast({
            title: 'Error loading report',
            description: error.response?.data?.message || 'Could not fetch report data.',
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFullReport();

    return () => {
      isMounted = false;
    };
  }, [numericScanId]);

  // Helper pulizia dominio
  function cleanDomain(url: string | undefined): string {
    if (!url) return 'Unknown Target';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <Spinner size={40} />
        <p className="text-muted-foreground animate-pulse">Loading security report...</p>
      </div>
    );
  }

  // Stato di errore: caricamento finito ma niente dati
  if (!fullReport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-slate-200">
          <FileX className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800">Report Not Found</h2>
          <p className="text-slate-500 mt-2">Unable to load data for Scan ID: {scanId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageHeader title={`Report: ${cleanDomain(fullReport?.meta?.target?.domain)}`} />

      <SummarySection
        data={fullReport}
        onExportClick={handlePrint} // <--- Passaggio della funzione
      />

      <Tabs defaultValue="va" className="mt-8">
        {/* Sticky Header */}
        <div className="sticky top-4 z-40 flex justify-center w-full mb-8 pointer-events-none">
          <TabsList className="pointer-events-auto h-auto p-1 bg-slate-100/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-full">
            <TabsTrigger
              value="va"
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vulnerability Assessment</span>
            </TabsTrigger>

            <TabsTrigger
              value="pt"
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all flex items-center gap-2"
            >
              <Crosshair className="w-4 h-4" />
              <span>Penetration Testing</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* VA Content */}
        <TabsContent value="va" className="space-y-8 animate-in fade-in duration-500">
          <ServerInfo data={fullReport?.meta} />
          <HeadersTable data={fullReport?.va?.headers} />
          <OpenPorts data={fullReport?.va?.ports?.openPortsList} />
          <CveOverview data={fullReport?.va?.cve?.cveList ?? []} />
        </TabsContent>

        {/* PT Content */}
        <TabsContent value="pt" className="space-y-8 animate-in fade-in duration-500">
          <ZapScanSection data={fullReport?.pt?.alerts ?? []} />
        </TabsContent>
      </Tabs>

      <ReportFooter />

      {/* 3. Il componente nascosto vive QUI nel genitore, vicino ai dati completi */}
      <div style={{ display: 'none' }}>
        {fullReport && <PrintableReport data={fullReport} ref={printRef} />}
      </div>

      {/* MODIFICA TEMPORANEA PER DEBUG */}
      {/* Togli style={{ display: 'none' }} e metti una classe visibile */}
      <div className="border-4 border-red-500 mt-10">
        <h2 className="text-red-500 font-bold p-2 text-center">--- ZONA DEBUG STAMPA ---</h2>
        {fullReport && <PrintableReport ref={printRef} data={fullReport} />}
      </div>
    </div>
  );
}

export default ReportView;
