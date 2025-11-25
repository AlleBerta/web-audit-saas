import { ZapScanSession } from '@/components/reportDashboard/ZapScanSession';
import { CveOverview } from '@/components/reportDashboard/CveOverview';
import { HeadersTable } from '@/components/reportDashboard/HeadersTable';
import { OpenPorts } from '@/components/reportDashboard/OpenPorts';
import PageHeader from '@/components/PageHeader';
import { ServerInfo } from '@/components/reportDashboard/ServerInfo';
import { SummarySection } from '@/components/reportDashboard/SummarySection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { ApiResponse } from '@/types/server_response.types';
import { FullReportResponse } from '@/types/scanResult.types';
import api from '@/lib/axios';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { Crosshair, ShieldCheck } from 'lucide-react';
import { ReportFooter } from '@/components/ReportFooter';

function ReportView() {
  const { scanId } = useParams<{ scanId: string }>();
  const numericScanId = Number(scanId);

  const [loading, setLoading] = useState(false);
  const [fullReport, setFullReport] = useState<FullReportResponse | null>(null);

  // Chiamata automatica su mount o sul cambio di scanId
  useEffect(() => {
    console.log('scanId: ', scanId, 'loading: ', loading);
    if (!isNaN(numericScanId)) {
      fetchFullReport(numericScanId);
    }
  }, [scanId]);

  const fetchFullReport = async (scanId: number) => {
    setLoading(true);

    try {
      const res = await api.get<ApiResponse<FullReportResponse>>(`/report/${scanId}/full`);

      console.log('Full report:', res.data.data);
      setFullReport(res.data.data);
    } catch (error: any) {
      console.error(error);

      if (error.response) {
        toast({
          title: 'Error!',
          description: error.response.data.message || 'Something went wrong...',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connection Error',
          description: 'Impossible to reach the server. Please, try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Pulisce il dominio per essere inserito nel titolo
  function cleanDomain(url: string | undefined): string {
    if (!url) return '';
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner /> {/* o un PulseLoader di your choice */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={`Report: ${cleanDomain(fullReport?.meta.target.domain)}`} />
      <SummarySection data={fullReport} />
      <Tabs defaultValue="va" className="mt-4">
        <div className="sticky top-4 z-50 flex justify-center w-full mb-8 pointer-events-none">
          {/* 1. sticky top-4: Si ferma 1rem (16px) dal bordo alto.
              2. z-50: Assicura che stia sopra a grafici e tabelle.
              3. pointer-events-none: Il contenitore non blocca i click ai lati, 
                ma riabilitiamo i click sulla TabsList con pointer-events-auto.
          */}

          <TabsList className="pointer-events-auto h-auto p-1 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg rounded-full">
            <TabsTrigger
              value="va"
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vulnerability Assessment</span>
            </TabsTrigger>

            <TabsTrigger
              value="pt"
              className="rounded-full px-6 py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm transition-all flex items-center gap-2"
            >
              <Crosshair className="w-4 h-4" />
              <span>Penetration Testing</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="va">
          <ServerInfo data={fullReport?.meta} />
          <HeadersTable data={fullReport?.va.headers} />
          <OpenPorts data={fullReport?.va.ports.openPortsList} />
          <CveOverview data={fullReport?.va.cve.cveList} />
        </TabsContent>

        <TabsContent value="pt">
          <ZapScanSession data={fullReport?.pt.alerts} />
        </TabsContent>
      </Tabs>
      <ReportFooter />
    </div>
  );
}

export default ReportView;
