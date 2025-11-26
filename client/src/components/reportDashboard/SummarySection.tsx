import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { SummaryResponseProps } from '@/types/scanResult.types';
import { Button } from '../ui/button';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { PrintableReport } from './PrintableReport';
import { Download, FileQuestion } from 'lucide-react';

export function SummarySection({ data, onExportClick, isPrinting = false }: SummaryResponseProps) {
  if (!data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
        {/* Icona Grigia (Slate), non verde */}
        <FileQuestion className="w-12 h-12 mb-3 text-slate-400" />
        <h3 className="text-lg font-semibold text-slate-700">Missing Data Report</h3>
        <p className="text-sm">Impossible visualize the summary. Data might be not loaded.</p>
      </div>
    );
  }

  // per Pie-chart in Severity Distribution
  const severityChart = [
    { name: 'Critical', value: data.meta.totVuln.bySeverity.critical, color: '#ef4444' },
    { name: 'High', value: data.meta.totVuln.bySeverity.high, color: '#f97316' },
    { name: 'Medium', value: data.meta.totVuln.bySeverity.medium, color: '#eab308' },
    { name: 'Low', value: data.meta.totVuln.bySeverity.low, color: '#6b7280' },
    { name: 'Info', value: data.meta.totVuln.bySeverity.info, color: '#3b82f6' },
  ];

  // Per Severity Score
  interface SeverityCounts {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  }

  const calculateSecurityScore = (counts: SeverityCounts): number => {
    // 1. Calcoliamo il "Risk Weight" (Peso del Rischio)
    // Più alto è questo numero, peggiore è la situazione.
    // Assegniamo pesi molto diversi per dare priorità alle critiche.
    const totalRisk =
      counts.critical * 50 + // Una critica pesa tantissimo
      counts.high * 15 + // Una high pesa moderatamente
      counts.medium * 5 +
      counts.low * 1;
    // Info solitamente vale 0 rischio

    if (totalRisk === 0) return 100;

    // 2. Calibrazione (Sensitivity)
    // Questo numero definisce "quanto è severo" il sistema.
    // Un valore di 300 significa che con 300 punti di rischio (es. 6 Critiche)
    // il punteggio scende al 50%.
    // Aumenta questo numero se vuoi essere più "buono", diminuiscilo se vuoi essere più severo.
    const sensitivity = 400;

    // 3. Formula Logaritmica Inversa
    // Score = 100 / (1 + (Risk / Sensitivity))
    // Risultato: Parte da 100 e tende a 0, ma non tocca mai numeri negativi.
    const rawScore = 100 / (1 + totalRisk / sensitivity);

    return Math.round(rawScore);
  };

  // Funzione helper per il colore del testo/cerchio in base allo score
  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e'; // Green-500 (Ottimo)
    if (score >= 75) return '#eab308'; // Yellow-500 (Attenzione)
    if (score >= 50) return '#f97316'; // Orange-500 (Rischio)
    return '#ef4444'; // Red-500 (Grave)
  };

  const score = calculateSecurityScore(data.meta.totVuln.bySeverity); // Usa i dati reali

  const scoreColor = getScoreColor(score);

  // Dati per il grafico: Parte piena (score) vs Parte vuota (rimanente)
  const gaugeData = [
    { name: 'Score', value: score, color: scoreColor },
    { name: 'Remaining', value: 100 - score, color: '#e2e8f0' }, // Grigio chiaro
  ];

  // ---------- Per pdf ----------
  // 1. Creiamo un riferimento per il componente da stampare
  const componentRef = useRef<HTMLDivElement>(null);

  // 2. Configuriamo l'hook di stampa
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Passiamo il ref creato
    documentTitle: `Security_Report_${data?.meta?.target?.domain || 'scan'}`,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Severity Donut */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                data={severityChart}
                cx="50%" // Centra orizzontalmente
                cy="40%" // <--- SPOSTA IL GRAFICO IN ALTO (40% dall'alto invece che 50%)
                innerRadius={35} // <--- RIDOTTO (era 40)
                outerRadius={60} // <--- RIDOTTO (era 70) per dare aria
                paddingAngle={3}
                label={({ value }) => `${value}`}
                labelLine={false} // Opzionale: rimuove le linee se i numeri sono dentro/vicini
                // Se stiamo stampando, spegni l'animazione (false).
                // Se siamo a video, lasciala accesa (true).
                isAnimationActive={!isPrinting}
              >
                {severityChart.map((_entry, index) => (
                  <Cell key={index} fill={_entry.color} />
                ))}
              </Pie>

              <Legend
                verticalAlign="bottom"
                height={36} // <--- DARE ALTEZZA FISSA alla legenda così il grafico non la copre
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '10px' }} // Spazio tra grafico e legenda
                formatter={(value, entry: any) => (
                  <span className="ml-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle>Security Score</CardTitle>
        </CardHeader>
        <CardContent className="h-56 relative flex flex-col items-center justify-center">
          {/* Grafico a Semicerchio */}
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="70%" // Spostato in basso per fare l'effetto tachimetro
                startAngle={180} // Inizia a sinistra
                endAngle={0} // Finisce a destra
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none" // Rimuove bordi bianchi
                // Se stiamo stampando, spegni l'animazione (false).
                // Se siamo a video, lasciala accesa (true).
                isAnimationActive={!isPrinting}
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Testo centrale sovrapposto */}
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div
              className="text-5xl font-bold transition-colors duration-300"
              style={{ color: scoreColor }}
            >
              {score}%
            </div>
            <p className="text-sm text-gray-500 mt-1">Overall Assessment</p>
          </div>
        </CardContent>
      </Card>

      {/* Ports Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Open Ports</CardTitle>
        </CardHeader>
        <CardContent className="h-56 flex flex-col justify-center">
          <p className="text-xl">Totali: {data.va.ports.open}</p>
          <p className="text-lg text-red-500">Critiche: {data.va.ports.criticalOpen}</p>
        </CardContent>
      </Card>

      {/* CVE Summary */}
      <Card>
        <CardHeader>
          <CardTitle>CVE Summary</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <p>Totali: {data.va.cve.total}</p>
          <p className="text-red-500">Critiche: {data.va.cve.critical}</p>
        </CardContent>
      </Card>

      {/* Headers Summary */}
      <Card>
        <CardHeader>
          <CardTitle>HTTP Headers</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <p className="text-red-500">Missing: {data.va.headers.missing.count}</p>
          <p className="text-yellow-500">Misconfigured: {data.va.headers.misconfigured.count}</p>
          <p className="text-green-500">OK: {data.va.headers.ok.count}</p>
        </CardContent>
      </Card>

      {/* Download Report */}
      {/* MOSTRA LA CARD SOLO SE NON STIAMO STAMPANDO */}
      {!isPrinting && (
        <Card>
          <CardHeader>
            <CardTitle>Export Report</CardTitle>
          </CardHeader>
          <CardContent className="h-56 flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground mb-4 max-w-md">
              Generate a comprehensive PDF including both VA analysis and PT results in a
              singleprofessional document.
            </p>
            <Button
              onClick={onExportClick} // Chiamo la funzione del padre. La gestisce poi ReportView
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              Download Report PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
