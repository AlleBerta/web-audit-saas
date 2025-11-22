import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PropsTargets, TargetStatus, TargetView } from '@/types/target.types';
import axios from 'axios';
import { BUTTON_TYPES } from '@/constants/button_types';
import { API_BASE_URL } from '@/config/conts';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/server_response.types';
import { LastScan, ScanResponse } from '@/types/scan.types';
import api from '@/lib/axios';
import { useEffect } from 'react';
import {
  ExternalLinkIcon,
  Eye,
  EyeIcon,
  FileChartColumn,
  FileChartColumnIcon,
  PlayIcon,
  SettingsIcon,
  TrashIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const TargetsTable = ({
  setSelectedTarget,
  onButtonClick,
  handleDeleteTarget,
  selectedTarget,
  targetViews,
  selectedButton,
}: PropsTargets) => {
  const activePollings = new Set<number>(); // per tenere traccia di tutti i polling attivi
  const navigate = useNavigate();

  /**
   * | Metodo | Endpoint               | Cosa fa                               |
   * | ------ | ---------------------- | ------------------------------------- |
   * | POST   | `/start-scan`          | Avvia la scansione (richiede URL)     |
   * | GET    | `/scan-status/:idScan` | Controlla lo stato della scansione    |
   * | GET    | `/result/:idScan`      | Recupera il file JSON della scansione |
   */
  async function startScan(targetId: number, url: string) {
    try {
      const res = await api.post<ApiResponse<ScanResponse>>('/scan/start', {
        targetId,
        url,
      });
      toast({
        title: res.data.message,
        description: `Scan for "${url}" is started, it will take a while.`,
      });
      const idScan = res.data.data.idScan;

      // Avvio il polling per questo scan
      startPolling(idScan, targetId);
    } catch (err: any) {
      console.error("Errore durante l'avvio della scansione:", err);
      toast({
        title: err?.config?.message ?? 'Errore durante lo scanning',
        description: err.response.data.message ?? 'Please, Retry',
        variant: 'destructive',
      });
    }
  }

  async function checkScanStatus(
    idScan: number
  ): Promise<'pending' | 'processing' | 'running' | 'done' | 'error'> {
    try {
      const res = await api.get<ApiResponse<ScanResponse>>(`scan/${idScan}/status`);
      return res.data.data.status;
    } catch (err) {
      console.error('Errore nel recupero dello stato:', err);
      return 'error';
    }
  }

  async function getScanResult(idScan: number): Promise<any> {
    try {
      const res = await api.get<ApiResponse<LastScan>>(`scan/${idScan}/completed`);
      const getDomain = await api.get<ApiResponse<any>>(`/target/${res.data.data.targetId}/domain`);
      console.log('------RESSSS: ' + res);
      toast({
        title: `Scan Completed for ${getDomain.data.data.domain ?? 'N/A'}`,
        description: 'Reload the page to see updated results.',
      });
      return res.data.data;
    } catch (err: any) {
      console.error('Errore nel recupero del risultato:', err);
      toast({
        title: err.response.statusText ?? 'Internal Server Error',
        description: 'Please, try again',
        variant: 'destructive',
      });
      return null;
    }
  }

  async function startPolling(idScan: number, targetId: number) {
    // se esiste già il polling, non faccio nulla
    if (activePollings.has(idScan)) return;
    // Altrimenti la aggiungo e inizio il polling
    activePollings.add(idScan);
    try {
      const interval = setInterval(async () => {
        const status = await checkScanStatus(idScan);

        if (status === 'done') {
          clearInterval(interval);
          activePollings.delete(idScan);
          onButtonClick('unselected'); // tolgo la tendina

          const result = await getScanResult(idScan);

          console.log('✅ Risultato:', result);

          // Aggiorno UI
          // updateScanResult(targetId, result);
          // nel mentre aggiorno la pagina

          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else if (status === 'processing' || status === 'running') {
          console.log('⏳ In attesa della fine della scansione...');
        } else {
          clearInterval(interval);
          activePollings.delete(idScan);
          console.error('❌ Errore nel polling, stato:', status);
        }
      }, 5000);
    } catch (err) {
      activePollings.delete(idScan);
      console.error('❌ Errore nello startPolling:', err);
    }
  }

  // const updateScanResult = (targetId: number, scanResult: LastScan) => {
  //   setSelectedTarget(prev => {
  //     // nulla è selezionato → non fai nulla
  //     if (!prev) return prev;

  //     // un altro target è selezionato → non fai nulla
  //     if (prev.id !== targetId) return prev;

  //     // aggiorniamo SOLO il target selezionato attualmente
  //     return {
  //       ...prev,
  //       status: 'Finished',
  //       lastScanId: scanResult.id,
  //       lastScanEnded: scanResult.end_time,
  //       vulnerabilities: {
  //         critical: scanResult.vulns.critical,
  //         high: scanResult.vulns.high,
  //         medium: scanResult.vulns.medium,
  //         low: scanResult.vulns.low,
  //       },
  //       newEvents: scanResult.newEvents ?? prev.newEvents,
  //       hasError: false,
  //     };
  //   });
  // };

  useEffect(() => {
    targetViews?.forEach((t) => {
      if (t.status === 'Running' && t.id) {
        startPolling(t.id, t.lastScanId ?? 0);
      }
    });
  });

  // Funzione per formattare le date in modo più leggibile
  const formatDateTime = (dateString: string): string => {
    console.log(' Formatting date: ', dateString);
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMilliseconds = now.getTime() - date.getTime();
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
      const diffInDays = Math.floor(diffInHours / 24);

      // Se la data è nel futuro (per nextScan)
      if (diffInMilliseconds < 0) {
        const futureDiffInHours = Math.abs(diffInHours);
        const futureDiffInDays = Math.floor(futureDiffInHours / 24);

        if (futureDiffInHours < 1) {
          const minutes = Math.floor(Math.abs(diffInMilliseconds) / (1000 * 60));
          return `tra ${minutes}min`;
        } else if (futureDiffInHours < 24) {
          return `tra ${Math.floor(futureDiffInHours)}h`;
        } else if (futureDiffInDays < 7) {
          return `tra ${futureDiffInDays} giorni`;
        }
      }

      // Per date passate (lastScan) o future lontane
      if (diffInHours < 1 && diffInMilliseconds > 0) {
        const minutes = Math.floor(diffInMilliseconds / (1000 * 60));
        return `${minutes}min fa`;
      } else if (diffInHours < 24 && diffInMilliseconds > 0) {
        return `${Math.floor(diffInHours)}h fa`;
      } else if (diffInDays < 7 && diffInMilliseconds > 0) {
        return `${diffInDays} giorni fa`;
      }

      // Per date più lontane, mostra la data formattata
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Data non valida';
    }
  };

  // Handler per cliccare sulla riga
  const handleRowClick = (target: TargetView) => {
    if (selectedTarget !== target) {
      setSelectedTarget(target);
    }
  };

  // Action handlers
  const handleStartScan = (e: React.MouseEvent, buttonType: ButtonType, target: TargetView) => {
    e.stopPropagation();
    setSelectedTarget(target);
    onButtonClick(buttonType); // Attivo la tendina che mostra il caricamento
    startScan(target.id, `https://${target.domain}`);
  };

  const handleSettings = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    console.log('Settings clicked for:', target.domain);
    // Implementa la logica per le impostazioni
  };

  const handleView = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    console.log('View clicked for:', target.domain);
    // Implementa la logica per visualizzare i dettagli
  };

  const handleReports = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    console.log('Reports clicked for:', target.domain);
    // Implementa la logica per i report
    navigate(`/dashboard/report/${target.lastScanId}`);
  };

  const handleDelete = async (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    setSelectedTarget(target);
    if (window.confirm(`Sei sicuro di voler eliminare ${target.domain}?`)) {
      console.log('Delete clicked for:', target.domain);
      // Implementa la logica per eliminare il target
      try {
        const res = await api.delete<ApiResponse<number>>(`/target/${target.id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          toast({
            title: res.data.message,
            description: `Eliminated Target ${target.domain}`,
          });

          setSelectedTarget(null); // non ho più un target selezionato
          handleDeleteTarget(target.id); // Elimino anche il target lato grafico e aggiorno il padre
        }
      } catch (err: any) {
        console.log('Error handleDelete: ', err);
        toast({
          title: 'Error',
          description: 'Error, please retry',
          variant: 'destructive',
        });
      }
    }
  };

  const handleExternalLink = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    window.open(`http://${target.domain}`, '_blank', 'noopener,noreferrer');
  };

  console.log('selectedTarget in TargetsTable: ', selectedTarget);
  console.log('targetViews: ', targetViews);
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Target</th>
                <th className="text-left p-4 font-medium text-gray-700">Scan Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Vulnerabilities</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!targetViews ? (
                <tr>
                  <td colSpan={4}>
                    <Card>
                      <CardContent className="text-center text-gray-500">
                        Select a target to view software composition analysis.
                      </CardContent>
                    </Card>
                  </td>
                </tr>
              ) : (
                targetViews.map((target, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                      selectedTarget?.domain === target.domain ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => handleRowClick(target)}
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-blue-600 hover:underline">
                            {target.domain}
                          </span>
                          <div className="flex space-x-1">
                            <span className="w-4 h-4 bg-gray-300 rounded-sm"></span>
                            <span className="w-4 h-4 bg-blue-500 rounded-sm"></span>
                            <span className="w-4 h-4 bg-orange-500 rounded-sm"></span>
                            <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
                            <span className="w-4 h-4 bg-yellow-500 rounded-sm"></span>
                            <span className="w-4 h-4 bg-green-500 rounded-sm"></span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">IPv4: {target.ip_domain}</div>
                        <div className="text-sm text-gray-600">
                          Next scan: {formatDateTime(target.nextScanStarts ?? '')} | Last scan:{' '}
                          {formatDateTime(target.lastScanEnded ?? '')}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div
                          className={`text-sm font-medium ${
                            target.status === 'Finished'
                              ? 'text-green-600'
                              : target.status === 'Error'
                              ? 'text-red-600'
                              : 'text-blue-600'
                          }`}
                        >
                          Status: {target.status}
                        </div>
                        <div className="text-sm text-gray-600">New Events: {target.newEvents}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {target.vulnerabilities.critical}
                        </span>
                        <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {target.vulnerabilities.high}
                        </span>
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {target.vulnerabilities.medium}
                        </span>
                        <span className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {target.vulnerabilities.low}
                        </span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {target.vulnerabilities.info}
                        </span>
                        {target.hasError && <span className="text-red-500 ml-2">⚠️</span>}
                      </div>
                    </td>
                    <td className="p-4">
                      <TooltipProvider>
                        <div className="flex items-center space-x-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-150 ease-in-out"
                                disabled={
                                  target.status === 'In Progress' ||
                                  (Boolean(target.id) && activePollings.has(target.id))
                                }
                                onClick={(e) => handleStartScan(e, BUTTON_TYPES.SCAN_NOW, target)}
                              >
                                <PlayIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Avvia una nuova scansione</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-150"
                                onClick={(e) => handleSettings(e, target)}
                              >
                                <SettingsIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Configurazioni target</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-all duration-150"
                                onClick={(e) => handleView(e, target)}
                              >
                                <EyeIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizza dettagli scan</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-150"
                                onClick={(e) => handleReports(e, target)}
                              >
                                <FileChartColumn className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Visualizza report e statistiche</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-150"
                                onClick={(e) => handleDelete(e, target)}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Elimina target</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size={'default'}
                                className="text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-150"
                                onClick={(e) => handleExternalLink(e, target)}
                              >
                                <ExternalLinkIcon className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Apri sito in nuova scheda</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
