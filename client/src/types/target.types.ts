import { LastScan } from './scan.types';
import { BUTTON_TYPES } from '@/constants/button_types';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

// Risposta dell'API per le scansioni (nel server si parla di Scan, nel client di Target)
export interface TargetResponse {
  id: number;
  projectId: number;
  domain: string;
  ip_domain: string;
  scans?: LastScan[];
}

export type TargetStatus = 'In Progress' | 'Running' | 'Finished' | 'Error';

export interface TargetView {
  id: number; // id del target
  lastScanId?: number; // id dell'ultimo scan
  domain: string;
  ip_domain?: string;
  status: TargetStatus; // Rappresenta lo stato del Target, non quello di ogni singolo scan
  newEvents: number; // Mostra gli eventi nuovi che l'utente non ha ancora visto
  nextScanStarts?: string; // ISO date o formattata
  lastScanEnded?: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  hasError: boolean;
}

export interface Props {
  targetViews?: TargetView[];
  selectedTarget: TargetView | null;
}

export interface PropsTargets {
  setSelectedTarget: (target: TargetView | null) => void;
  onButtonClick: (type: ButtonType) => void;
  handleDeleteTarget: (id: number) => void;
  targetViews?: TargetView[];
  selectedTarget: TargetView | null;
  selectedButton: ButtonType;
}

export interface PropsFilterBar {
  onButtonClick: (type: ButtonType) => void;
  selectedButton: ButtonType;
  isLoading: Record<ButtonType, boolean>;
}
