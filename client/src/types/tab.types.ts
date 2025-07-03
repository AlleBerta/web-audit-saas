export interface Tab {
  id: number;
  name: string;
  count: number;
}

export interface ProjectTabsProps {
  tabs: Tab[];
  activeProject: string;
  setActiveProject: (name: string) => void;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  reloadProjects: () => Promise<void>;
  loading: boolean;
}

export interface ProjectComponentProps {
  tabs: Tab[];
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  activeProject: string;
  setActiveProject: (name: string) => void;
  reloadProjects: () => Promise<void>;
  loading: boolean;
}
