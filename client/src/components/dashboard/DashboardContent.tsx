import React, { useState, useEffect, useMemo } from 'react';
import { SoftwareCompositionChart } from './SoftwareCompositionChart';
import { VulnerabilitiesList } from './VulnerabilitiesList';
import { TargetsTable } from './TargetsTable';
import { FilterBar } from './FilterBar';
import { TargetView } from '@/types/target.types';
import { ProjectDashboardProps } from '@/types/tab.types';
import { TargetResponse } from '@/types/target.types';
import { BUTTON_TYPES } from '@/constants/button_types';
import { Card, CardContent } from '../ui/card';
import { TargetsButton } from '../ui/targetButton';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { mapDbStateToTargetStatus } from '@/lib/mapDbStateToTargetStatus';
import { late } from 'zod';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const DashboardContent = ({
  activeProjectData,
  setActiveProjectData,
  loading,
}: ProjectDashboardProps) => {
  const [selectedTarget, setSelectedTarget] = useState<TargetView | null>(null);
  const [selectedButton, setSelectedButton] = useState<ButtonType>(BUTTON_TYPES.UNSELECTED); // Assegnato al valore nullo
  const [isLoading, setIsLoading] = useState<Record<ButtonType, boolean>>({
    new: false,
    gdpr: false,
    pci_dss: false,
    scan_now: false,
    search: false,
    tags: false,
    add_target: false,
    import_targets: false,
    ci_cd: false,
    unselected: false,
  });
  const [newTargetUrl, setNewTargetUrl] = useState('');

  // Carico i dati in modo corretto
  const targetViews: TargetView[] = useMemo(() => {
    if (!activeProjectData?.targets) return [];

    // Reset selezione
    setSelectedTarget(null);

    return activeProjectData.targets.map((target) => {
      const scans = target.scans ?? [];

      const latestScan =
        scans.length > 0
          ? [...scans].sort(
              (a, b) => new Date(b.end_time ?? 0).getTime() - new Date(a.start_time ?? 0).getTime()
            )[0]
          : null;

      console.log('scans: ', scans);
      console.log('latestScan: ', latestScan);
      // Calcolo vulnerabilità aggregate da TUTTE le scansioni del target
      const allResults = scans.flatMap((s) => s.scanResults ?? []);
      const vulnerabilities = {
        critical: allResults.filter((r) => r.severity.toLowerCase() === 'critical').length,
        high: allResults.filter((r) => r.severity.toLowerCase() === 'high').length,
        medium: allResults.filter((r) => r.severity.toLowerCase() === 'medium').length,
        low: allResults.filter((r) => r.severity.toLowerCase() === 'low').length,
      };

      // Status: running > failed > finished
      const hasRunning = scans.some((s) => s.state === 'running' || s.state === 'pending');
      const hasError = scans.some((s) => s.state === 'failed');
      console.log(
        'end time: ',
        latestScan?.end_time,
        ' oppure ',
        latestScan?.end_time ? new Date(latestScan.end_time).toISOString() : undefined
      );
      return {
        id: target.id,
        lastScanId: latestScan?.id,
        domain: target.domain,
        ip_domain: target.ip_domain,
        status: mapDbStateToTargetStatus(latestScan?.state ?? 'none'),
        newEvents: 0, // default
        nextScanStarts: '', // opzionale
        lastScanEnded: latestScan?.end_time
          ? new Date(latestScan.end_time).toISOString()
          : undefined,
        vulnerabilities,
        hasError,
      };
    });
  }, [activeProjectData]);

  // Funzione per gestire lo stato di loading per bottoni specifici
  const setButtonLoading = (buttonType: ButtonType, loading: boolean) => {
    setIsLoading((prev) => ({
      ...prev,
      [buttonType]: loading,
    }));
  };

  // Funzione callback che viene passata a FilterBar
  const handleButtonClick = async (buttonType: ButtonType, additionalData = null) => {
    console.log('Button clicked:', buttonType, additionalData);
    // Imposta loading per il bottone cliccato
    setButtonLoading(buttonType, true);
    setSelectedButton(buttonType);

    try {
      // Qui puoi aggiungere logica aggiuntiva per ogni bottone
      switch (buttonType) {
        case BUTTON_TYPES.SCAN_NOW:
          console.log('Starting scan for:', additionalData);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          break;
        case BUTTON_TYPES.IMPORT_TARGETS:
          console.log('Importing targets...');
          await new Promise((resolve) => setTimeout(resolve, 1500));
          break;
        default:
          // Operazione generica
          await new Promise((resolve) => setTimeout(resolve, 1000));
          break;
      }
    } catch (error) {
      console.error('Error executing button action:', error);
    } finally {
      // Rimuovi loading
      setButtonLoading(buttonType, false);
    }
  };

  /**
   * Rimuove http:// o https:// e slash finali, restituisce solo dominio/host
   */
  function normalizeTargetUrl(input: string): string {
    try {
      // se manca lo schema, lo aggiungo fittiziamente per farlo parsare da URL
      const url =
        input.startsWith('http://') || input.startsWith('https://')
          ? new URL(input)
          : new URL('http://' + input);

      // ritorno solo l'hostname (senza schema, senza slash)
      return url.hostname;
    } catch {
      // se input non è un URL valido → restituisco stringa originale "ripulita"
      return input.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    }
  }

  // Funzione per gestire l'aggiunta di un nuovo target
  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault(); // impedisce il refresh della pagina
    if (!newTargetUrl.trim()) return; // semplice validazione

    const normalizedUrl = normalizeTargetUrl(newTargetUrl);
    if (!normalizedUrl) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL or IP address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setButtonLoading(BUTTON_TYPES.ADD_TARGET, true);

      // chiamata API al server
      const res = await api.post<ApiResponse<TargetResponse>>(
        '/target',
        { domain: normalizedUrl, projectId: activeProjectData?.id },
        { withCredentials: true }
      );

      const newTarget = res.data.data;

      setNewTargetUrl(''); // reset input
      setSelectedButton(BUTTON_TYPES.UNSELECTED); //chiudi la card AddTarget

      // aggiorno manualmente activeProjectData
      setActiveProjectData((prev) =>
        prev
          ? {
              ...prev,
              targets: [...(prev.targets ?? []), newTarget], // ✅ aggiungo il nuovo target/scan all’array
            }
          : prev
      );

      // seleziona direttamente il nuovo target come TargetView
      setSelectedTarget({
        id: newTarget.id,
        domain: newTarget.domain,
        ip_domain: newTarget.ip_domain,
        status: 'In Progress',
        newEvents: 0,
        lastScanEnded: '',
        nextScanStarts: '',
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        },
        hasError: false,
      });

      console.log('Muori piazzi: ', selectedTarget);
      toast({
        title: 'Target added successfully',
        description: `Target ${newTarget.domain} has been added.`,
      });
      // eventuale refresh lista target
      //await fetchTargets();
    } catch (error) {
      toast({
        title: 'Error adding target',
        description: 'There was an error while adding the target. Please try again.',
        variant: 'destructive',
      });
      console.error("Errore nell'aggiunta del target:", error);
    } finally {
      setButtonLoading(BUTTON_TYPES.ADD_TARGET, false);
    }
  };

  // Funzione per gestire l'eliminazione di un target
  const handleDeleteTarget = (targetId: number) => {
    setActiveProjectData((prev) =>
      prev
        ? {
            ...prev,
            targets: prev.targets?.filter((target) => target.id !== targetId) ?? [],
          }
        : prev
    );
  };

  // Carica i filtri presenti in FilterBar
  const renderContent = () => {
    switch (selectedButton) {
      case BUTTON_TYPES.NEW:
        return (
          <Card>
            <CardContent>
              {/* Mostra i risultati dei target che hanno finito */}
              <h3 className="text-lg font-semibold mb-4 text-blue-600">📄 New Targets (10)</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="font-medium">Target 1: example.com</p>
                  <p className="text-sm text-gray-600">Status: Pending scan</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="font-medium">Target 2: api.example.com</p>
                  <p className="text-sm text-gray-600">Status: Ready for analysis</p>
                </div>
                <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <p className="font-medium">Target 3: app.example.com</p>
                  <p className="text-sm text-gray-600">Status: Configuration needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.GDPR:
        return (
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">🛡️ GDPR Compliance (12)</h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-500">
                  <p className="font-medium">Data Processing Agreement Required</p>
                  <p className="text-sm text-gray-600">3 targets need DPA updates</p>
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <p className="font-medium">Cookie Policy Compliant</p>
                  <p className="text-sm text-gray-600">9 targets fully compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.PCI_DSS:
        return (
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold mb-4 text-blue-600">
                🏛️ PCI DSS Compliance (23)
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                  <p className="font-medium">SSL Certificate Issues</p>
                  <p className="text-sm text-gray-600">5 targets need SSL updates</p>
                </div>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <p className="font-medium">Encryption Standards Met</p>
                  <p className="text-sm text-gray-600">18 targets compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.SCAN_NOW:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-600">Scan in Progress</h3>
                <button
                  onClick={() => setSelectedButton(BUTTON_TYPES.UNSELECTED)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded">
                  {!selectedTarget ? (
                    <p className="text-gray-500">Select a target to view scan progress.</p>
                  ) : (
                    <>
                      <p className="text-gray-600">
                        Scanning {selectedTarget.domain} ({selectedTarget.ip_domain ?? 'IP not set'}
                        )
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        {/* progress bar, w-3/4 indica la dimensione della barra */}
                        <div className="bg-blue-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Progress: 75% - Analyzing vulnerabilities...
                      </p>
                      <p className="text-sm text-gray-600">Estimated time remaining: 5 minutes</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.SEARCH:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">🔍 Search and Filters</h3>
                <button
                  onClick={() => setSelectedButton(BUTTON_TYPES.UNSELECTED)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search targets..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Active
                  </span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Completed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.TAGS:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">🏷️ Tags Management</h3>
                <button
                  onClick={() => setSelectedButton(BUTTON_TYPES.UNSELECTED)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Production
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Staging
                  </span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                    Development
                  </span>
                  <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
                    Critical
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.ADD_TARGET:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-green-600">➕ Add New Target</h3>
                <button
                  onClick={() => {
                    setNewTargetUrl('');
                    setSelectedButton(BUTTON_TYPES.UNSELECTED);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddTarget} className="space-y-4">
                <input
                  type="text"
                  value={newTargetUrl}
                  onChange={(e) => setNewTargetUrl(e.target.value)}
                  placeholder="Target URL or IP..."
                  className="w-full p-2 border border-gray-300 rounded"
                />

                <TargetsButton
                  type="submit"
                  className="bg-green-600 text-white hover:bg-green-700"
                  loading={loading}
                >
                  Add Target
                </TargetsButton>
              </form>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.IMPORT_TARGETS:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">📥 Import Targets</h3>
                <button
                  onClick={() => setSelectedButton(BUTTON_TYPES.UNSELECTED)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Drop your CSV file here or click to browse</p>
                </div>
                <p className="text-sm text-gray-600">Supported formats: CSV, JSON, XML</p>
              </div>
            </CardContent>
          </Card>
        );

      case BUTTON_TYPES.CI_CD:
        return (
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">🔗 CI/CD Integrations</h3>
                <button
                  onClick={() => setSelectedButton(BUTTON_TYPES.UNSELECTED)}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white"
                  title="Close scan"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                  <span>GitHub Actions</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Active
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                  <span>Jenkins</span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    Pending
                  </span>
                </div>
                <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                  <span>GitLab CI</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                    Not configured
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="text-center text-gray-500">
              Select a target to view software composition analysis.
            </CardContent>
          </Card>
        );
    }
  };

  console.log('selectedTarget in DashboardContent: ', selectedTarget);

  return (
    <div className="p-6 space-y-6">
      {/* Top Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoftwareCompositionChart targetViews={targetViews} selectedTarget={selectedTarget} />
        <VulnerabilitiesList targetViews={targetViews} selectedTarget={selectedTarget} />
      </div>

      {/* Filters and Actions */}
      <FilterBar
        onButtonClick={handleButtonClick}
        selectedButton={selectedButton}
        isLoading={isLoading}
      />

      {/* Targets Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">{renderContent()}</div>

        <TargetsTable
          setSelectedTarget={setSelectedTarget}
          onButtonClick={handleButtonClick}
          handleDeleteTarget={handleDeleteTarget}
          selectedTarget={selectedTarget}
          targetViews={targetViews}
          selectedButton={selectedButton}
        />
      </div>
    </div>
  );
};
