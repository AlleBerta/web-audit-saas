import { TargetsButton } from '@/components/ui/targetButton';
import { Props, PropsFilterBar } from '@/types/target.types';
import axios from 'axios';
import { BUTTON_TYPES } from '@/constants/button_types';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

export const FilterBar = ({ onButtonClick, selectedButton, isLoading }: PropsFilterBar) => {
  // const testPy = async () => {
  //   try {
  //     // Sostituisci con l'indirizzo IP della tua VM Apache
  //     const apacheUrl = 'http://192.168.179.3/cgi-bin/hello.py';

  //     console.log(`Tentativo di chiamata Axios a: ${apacheUrl}`);

  //     // Esegui la richiesta GET con Axios
  //     axios
  //       .post('http://192.168.179.3:5000/start-scan', {
  //         url: 'http://example.com',
  //       })
  //       .then((res) => {
  //         console.log(res.data);
  //         alert(
  //           'Risposta da Apache (controlla la console per i dettagli): ' +
  //             String(res.data).substring(0, 100) +
  //             '...'
  //         ); // Mostra un estratto
  //       });
  //   } catch (error) {
  //     // Axios cattura gli errori HTTP (es. 4xx, 5xx) direttamente qui
  //     if (axios.isAxiosError(error)) {
  //       // Errore specifico di Axios (es. risposta dal server con status non 2xx)
  //       console.error('Errore Axios durante la chiamata ad Apache:', error.message);
  //       if (error.response) {
  //         // Il server ha risposto con uno status code fuori dal range 2xx
  //         console.error('Dettagli errore risposta:', error.response.data);
  //         console.error('Status:', error.response.status);
  //         console.error('Headers:', error.response.headers);
  //       } else if (error.request) {
  //         // La richiesta è stata fatta ma non c'è stata risposta (es. server offline, CORS bloccato)
  //         console.error('Nessuna risposta ricevuta:', error.request);
  //       } else {
  //         // Qualcosa è andato storto nella configurazione della richiesta
  //         console.error('Errore configurazione richiesta:', error.message);
  //       }
  //       alert('Errore durante la chiamata ad Apache! Controlla la console per i dettagli Axios.');
  //     } else {
  //       // Altri tipi di errori (es. errori di rete generici)
  //       console.error('Errore generico durante la chiamata ad Apache:', error);
  //       alert('Errore generico durante la chiamata ad Apache! Controlla la console.');
  //     }
  //   }
  // };
  // Riepilogo API
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

  const handleButtonClick = (buttonType: ButtonType) => {
    onButtonClick(buttonType);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      {/* Container principale responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Gruppo bottoni di sinistra */}
        <div className="flex flex-wrap items-center gap-2">
          {/* <TargetsButton
            variant={activeButton === BUTTON_TYPES.NEW ? 'default' : 'default'}
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.NEW
                ? 'bg-blue-800 text-white hover:bg-blue-900'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            leftIcon="📄"
            loading={isLoading[BUTTON_TYPES.NEW]}
            onClick={() => handleButtonClick(BUTTON_TYPES.NEW)}
          >
            📄 New 10
          </TargetsButton>
          <TargetsButton
            variant="outline"
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.GDPR
                ? 'border-blue-800 text-blue-800 bg-blue-50' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            leftIcon="🛡️"
            loading={isLoading[BUTTON_TYPES.GDPR]}
            onClick={() => handleButtonClick(BUTTON_TYPES.GDPR)}
          >
            GDPR 12
          </TargetsButton>
          <TargetsButton
            variant="outline"
            size="sm"
            className={`whitespace-nowrap ${
              activeButton === BUTTON_TYPES.PCI_DSS
                ? 'border-blue-800 text-blue-800 bg-blue-50' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
            leftIcon="🏛️"
            loading={isLoading[BUTTON_TYPES.PCI_DSS]}
            onClick={() => handleButtonClick(BUTTON_TYPES.PCI_DSS)}
          >
            PCI DSS 23
          </TargetsButton> */}
        </div>

        {/* Gruppo bottoni di destra con scroll orizzontale su mobile */}
        <div className="flex-1 lg:flex-initial">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
            <div className="flex items-center gap-2 min-w-max">
              {/* <TargetsButton
                variant="success"
                className={`whitespace-nowrap ${
                  activeButton === BUTTON_TYPES.TEST_PY
                    ? 'bg-green-700 hover:bg-green-800' 
                    : ''
                }`}
                leftIcon="🧪"
                loading={isLoading[BUTTON_TYPES.TEST_PY]}
                onClick={() => handleButtonClick(BUTTON_TYPES.TEST_PY)}
              >
                Test py
              </TargetsButton> */}

              <TargetsButton
                variant="success"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.SCAN_NOW ? 'bg-green-700 hover:bg-green-800' : ''
                }`}
                leftIcon="🔍"
                loading={isLoading[BUTTON_TYPES.SCAN_NOW]}
                onClick={() => handleButtonClick(BUTTON_TYPES.SCAN_NOW)}
                // onClick={() => handleButtonClick(BUTTON_TYPES.SCAN_NOW, 'http://example.com')}
              >
                Scan Now
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.SEARCH
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🔍"
                loading={isLoading[BUTTON_TYPES.SEARCH]}
                onClick={() => handleButtonClick(BUTTON_TYPES.SEARCH)}
              >
                Search and Filters
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.TAGS
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🏷️"
                loading={isLoading[BUTTON_TYPES.TAGS]}
                onClick={() => handleButtonClick(BUTTON_TYPES.TAGS)}
              >
                Tags
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.ADD_TARGET
                    ? 'text-green-800 bg-green-100'
                    : 'text-green-600 hover:bg-green-50'
                }`}
                leftIcon="➕"
                loading={isLoading[BUTTON_TYPES.ADD_TARGET]}
                onClick={() => handleButtonClick(BUTTON_TYPES.ADD_TARGET)}
              >
                Add Target
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.IMPORT_TARGETS
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="📥"
                loading={isLoading[BUTTON_TYPES.IMPORT_TARGETS]}
                onClick={() => handleButtonClick(BUTTON_TYPES.IMPORT_TARGETS)}
              >
                Import Targets
              </TargetsButton>

              <TargetsButton
                variant="ghost"
                size="sm"
                className={`whitespace-nowrap ${
                  selectedButton === BUTTON_TYPES.CI_CD
                    ? 'text-blue-800 bg-blue-100'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                leftIcon="🔗"
                loading={isLoading[BUTTON_TYPES.CI_CD]}
                onClick={() => handleButtonClick(BUTTON_TYPES.CI_CD)}
              >
                CI/CD Integrations
              </TargetsButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
