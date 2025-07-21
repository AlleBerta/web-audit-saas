import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PropsTargets, TargetView } from '@/types/target.types';
import axios from 'axios';
import { BUTTON_TYPES } from '@/constants/button_types';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const TargetsTable = ({
  setSelectedTarget,
  onButtonClick,
  selectedTarget,
  targetViews,
  selectedButton,
}: PropsTargets) => {
  /**
   * | Metodo | Endpoint               | Cosa fa                               |
   * | ------ | ---------------------- | ------------------------------------- |
   * | POST   | `/start-scan`          | Avvia la scansione (richiede URL)     |
   * | GET    | `/scan-status/:idScan` | Controlla lo stato della scansione    |
   * | GET    | `/result/:idScan`      | Recupera il file JSON della scansione |
   */
  async function startScan(url: string): Promise<number | null> {
    try {
      const res = await axios.post('http://192.168.179.3:5000/start-scan', { url });
      return res.data.idScan;
    } catch (err) {
      console.error("Errore durante l'avvio della scansione:", err);
      return null;
    }
  }

  async function checkScanStatus(idScan: number): Promise<'processing' | 'done' | null> {
    try {
      const res = await axios.get(`http://192.168.179.3:5000/scan-status/${idScan}`);
      return res.data.status;
    } catch (err) {
      console.error('Errore nel recupero dello stato:', err);
      return null;
    }
  }

  async function getScanResult(idScan: number): Promise<any> {
    try {
      const res = await axios.get(`http://192.168.179.3:5000/result/${idScan}`);
      return res.data;
    } catch (err) {
      console.error('Errore nel recupero del risultato:', err);
      return null;
    }
  }

  async function startAndPoll(url: string) {
    console.log('url: ', url);
    const idScan = await startScan(url);
    if (!idScan) return;

    const interval = setInterval(async () => {
      const status = await checkScanStatus(idScan);
      if (status === 'done') {
        clearInterval(interval);
        const result = await getScanResult(idScan);
        console.log('✅ Risultato:', result);
        // Puoi salvarlo nello stato o mostrarlo a schermo
      } else if (status === 'processing') {
        console.log('⏳ In attesa della fine della scansione...');
      } else {
        clearInterval(interval);
        console.error('❌ Errore nel polling');
      }
    }, 5000);
  }

  // Handler per cliccare sulla riga
  const handleRowClick = (target: TargetView) => {
    if (selectedTarget !== target) {
      setSelectedTarget(target);
    }
  };

  // Action handlers
  const handleStartScan = (e: React.MouseEvent, buttonType: ButtonType, target: TargetView) => {
    e.stopPropagation();
    onButtonClick(buttonType); // Attivo la tendina che mostra il caricamento
    startAndPoll(`http://${target.domain}`);
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
  };

  const handleDelete = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    if (window.confirm(`Sei sicuro di voler eliminare ${target.domain}?`)) {
      console.log('Delete clicked for:', target.domain);
      // Implementa la logica per eliminare il target
    }
  };

  const handleExternalLink = (e: React.MouseEvent, target: TargetView) => {
    e.stopPropagation();
    window.open(`http://${target.domain}`, '_blank', 'noopener,noreferrer');
  };

  console.log('selectedTarget in TargetsTable: ', selectedTarget);

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
                        <div className="text-sm text-gray-600">🇺🇸 {target.ip_domain}</div>
                        <div className="text-sm text-gray-600">
                          Next scan: {target.nextScan} | Last scan: {target.lastScan}
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
                                onClick={(e) => handleStartScan(e, BUTTON_TYPES.SCAN_NOW, target)}
                              >
                                ▶️
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
                                ⚙️
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
                                👁️
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
                                📊
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
                                🗑️
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
                                ↗️
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
