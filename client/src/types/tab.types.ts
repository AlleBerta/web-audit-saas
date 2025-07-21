import { ProjectResponse } from './project.types';

export interface Tab {
  id: number;
  name: string;
  count: number;
}

export interface ProjectTabsProps {
  tabs: Tab[];
  activeProject: Tab | undefined;
  onChangeProject: React.Dispatch<React.SetStateAction<Tab | undefined>>;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  reloadProjects: () => Promise<void>;
  loading: boolean;
}

export interface ProjectComponentProps {
  tabs: Tab[];
  activeProject: Tab | undefined;
  setTabs: React.Dispatch<React.SetStateAction<Tab[]>>;
  onChangeProject: React.Dispatch<React.SetStateAction<Tab | undefined>>;
  reloadProjects: () => Promise<void>;
  loading: boolean;
}

export interface ProjectDashboardProps {
  activeProjectData: ProjectResponse | undefined;
  loading: boolean;
}
