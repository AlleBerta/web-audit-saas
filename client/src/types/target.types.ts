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

export interface Props {
  selectedTarget: Target | null;
}

export interface PropsTargets {
  setSelectedTarget: (target: Target | null) => void;
  selectedTarget: Target | null;
}
