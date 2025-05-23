# 🌐 Web Security Audit SaaS

Un framework in modalità SaaS per l’analisi automatizzata di **misconfigurazioni** e **vulnerabilità** in server e applicazioni web, progettato principalmente per sistemi **Linux**, i più utilizzati nell’ambito dell’hosting moderno.

## 🚀 Panoramica del Progetto

L’obiettivo è sviluppare una piattaforma web scalabile per **audit di sicurezza automatizzati**, rivolta a **piccole aziende** e **sviluppatori**, per effettuare un’analisi preliminare del proprio sito.  
Si vuole offrire un **primo livello di controllo** prima di rivolgersi a servizi professionali di penetration testing.

Il progetto è ispirato a piattaforme come [ImmuniWeb](https://www.immuniweb.com/), con un approccio pratico, educativo e accessibile.

## 🧩 Caso d'Uso

- Le piccole imprese spesso affidano la realizzazione dei loro siti a freelance o agenzie, ma non sempre ricevono un prodotto sicuro dal punto di vista informatico.
- I servizi professionali per test di sicurezza sono **costosi** e spesso non accessibili.
- Questa piattaforma colma il divario offrendo **scansioni automatizzate** per evidenziare vulnerabilità comuni.
- L’utente si registra, inserisce un **dominio pubblico** e riceve un **report dettagliato** al termine della scansione asincrona.

## 🧱 Architettura

| Componente                  | Tecnologia                                 | Descrizione                                                     |
| --------------------------- | ------------------------------------------ | --------------------------------------------------------------- |
| **Frontend**                | React + TypeScript                         | Interfaccia: login, dashboard, gestione progetti e report       |
| **Backend API**             | Node.js + Express + TypeScript             | Logica applicativa, autenticazione, orchestrazione dei job      |
| **Database**                | MySQL o PostgreSQL                         | Gestione utenti, progetti, risultati e log delle attività       |
| **Coda di job**             | Redis + BullMQ                             | Gestione asincrona e scalabile delle scansioni                  |
| **Worker di scansione**     | Node.js + TS in container Linux            | Esecuzione dei tool, parsing dell’output, salvataggio risultati |
| **Strumenti di scansione**  | OWASP ZAP, w3af, Nikto, Nuclei             | Tool open-source per l'analisi delle vulnerabilità              |
| **Validazione dominio**     | DNS lookup + email (opzionale) + ToS       | Verifica del consenso/possesso prima della scansione            |
| **Modulo legale/etico**     | Termini di Servizio + logging + rate limit | Rispetto delle normative e uso responsabile                     |
| **Notifiche** _(opzionale)_ | Nodemailer / WebSocket / polling           | Notifica dell’utente al termine della scansione                 |

## 🔧 Stack Tecnologico

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL o PostgreSQL
- **Sistema Operativo**: Linux (necessario per eseguire i tool di scansione)
- **Strumenti di analisi**:
  - [OWASP ZAP](https://www.zaproxy.org/)
  - [w3af](https://github.com/andresriancho/w3af)
  - [Nikto](https://github.com/sullo/nikto)
  - [Nuclei](https://github.com/projectdiscovery/nuclei)

## 📦 Installazione (WIP)

> Le istruzioni di installazione verranno aggiunte durante lo sviluppo.

## 📜 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Vedi il file [LICENSE](./LICENSE) per i dettagli.

## 📬 Contatti

Progetto realizzato da **Alessandro Bertani** come parte di un tirocinio universitario.  
Per domande, apri una issue o contattami direttamente.

---
