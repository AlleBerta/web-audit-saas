import { BUTTON_TYPES } from '@/constants/button_types';
type ButtonType = (typeof BUTTON_TYPES)[keyof typeof BUTTON_TYPES];

// Utilizzata solo in TargetsTable, ma la dovrò modificare
export interface Target {
  id: number;
  url: string;
  ip: string;
  auth: string;
  status: 'Finished' | 'Error' | 'In Progress';
  newEvents: number;
  nextScan: string;
  lastScan: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  hasError: boolean;
}

type TargetStatus = 'In Progress' | 'Finished' | 'Error';

export interface TargetView {
  id: number; // id scanResult
  domain: string;
  ip_domain?: string;
  status: TargetStatus; // Rappresenta lo stato del Target, non quello di ogni singolo scan
  newEvents: number; // Mostra gli eventi nuovi che l'utente non ha ancora visto
  nextScan?: string; // ISO date o formattata
  lastScan?: string;
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
  targetViews?: TargetView[];
  selectedTarget: TargetView | null;
  selectedButton: ButtonType;
}

export interface PropsFilterBar {
  onButtonClick: (type: ButtonType) => void;
  selectedButton: ButtonType;
  isLoading: Record<ButtonType, boolean>;
}
