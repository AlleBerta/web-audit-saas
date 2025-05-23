# 🌐 Web Security Audit SaaS

A SaaS framework for automated scanning of misconfigurations and vulnerabilities in web servers and applications — designed primarily for Linux-based systems, which dominate modern web hosting environments.

## 🚀 Project Overview

This project aims to build a scalable, automated web security audit platform, allowing users (especially small businesses and developers) to perform a **first-level analysis** of their websites. The goal is to increase awareness of security risks before turning to expensive professional services.

Inspired by platforms like [ImmuniWeb](https://www.immuniweb.com/), this project offers a practical and educational introduction to web vulnerability assessment.

## 🧩 Use Case

- Small companies often outsource their website development but lack budget or expertise for proper security testing.
- This platform fills that gap by offering **automated preliminary scans** for common web security issues.
- Users can register, submit a public domain, and receive a **vulnerability report** after an asynchronous scan.

## 🧱 Architecture

| Component                      | Technology                                 | Description                                                |
| ------------------------------ | ------------------------------------------ | ---------------------------------------------------------- |
| **Frontend**                   | React + TypeScript                         | Web interface: login, dashboard, project/report management |
| **Backend API**                | Node.js + Express + TypeScript             | Business logic, user auth, job orchestration               |
| **Database**                   | MySQL or PostgreSQL                        | User, project, scan result and logging storage             |
| **Job Queue**                  | Redis + BullMQ                             | Async and scalable job management                          |
| **Scan Worker**                | Node.js + TS in Linux container            | Executes tools, parses output, stores results              |
| **Scan Tools**                 | OWASP ZAP, w3af, Nikto, Nuclei             | Open-source tools for web vulnerability scanning           |
| **Domain Validation**          | DNS lookup + optional email + ToS          | Ensures user ownership/consent before scanning             |
| **Legal & Ethical**            | Terms of Service + logging + rate limiting | Compliance and responsible usage enforcement               |
| **Notifications** _(optional)_ | Nodemailer / WebSocket / polling           | Notifies user upon scan completion                         |

## 🔧 Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL or PostgreSQL
- **OS**: Linux (required to run scanning tools)
- **Scan Tools**:
  - [OWASP ZAP](https://www.zaproxy.org/)
  - [w3af](https://github.com/andresriancho/w3af)
  - [Nikto](https://github.com/sullo/nikto)
  - [Nuclei](https://github.com/projectdiscovery/nuclei)

## 📦 Installation (WIP)

> Setup instructions will be added during development.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for details.

## 📬 Contact

Made by [Alessandro Bertani](https://github.com/tuo-username) as part of a university internship.  
For questions, feel free to open an issue or contact me.

---
