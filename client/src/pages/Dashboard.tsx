import { useState, useEffect } from 'react';
// import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import PageHeader from '@/components/PageHeader';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ProjectResponse } from '@/types/project.types';
import { Tab } from '@/types/tab.types';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeProject, setActiveProject] = useState<Tab>();
  const [activeProjectData, setActiveProjectData] = useState<ProjectResponse>();
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [loadingProject, setLoadingProject] = useState(true);

  const fetchProjects = async () => {
    try {
      console.log('Caricamento progetti...');
      setLoadingTabs(true);

      // Ricavo id - nome - count(Scan) per ogni progetto dello user
      const response = await api.get<ApiResponse<Tab[]>>('/project/tab');
      const projects = response.data.data;
      console.log('Projects fetched by DASHBOARD:');
      console.table(projects);

      if (projects.length > 0) {
        setActiveProject(projects[0]); // Imposta il primo attivo
      }

      setTabs(projects);
    } catch (error: any) {
      console.error('Errore nel caricamento dei progetti:', error);
      console.log(error);
      if (error.response) {
        toast({
          title: 'Errore!',
          description: error.response.data.message || 'Qualcosa è andato storto',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Errore di connessione',
          description: 'Impossibile contattare il server. Riprova più tardi.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoadingTabs(false);
    }
  };

  const fetchActiveProjectData = async () => {
    if (!activeProject) return;

    setLoadingProject(true);
    try {
      const res = await api.get<ApiResponse<ProjectResponse>>(`/project/${activeProject.id}`);
      console.log('res: ', res.data.data);
      setActiveProjectData(res.data.data);
    } catch (error: any) {
      console.log(error);
      if (error.response) {
        toast({
          title: 'Error!',
          description: error.response.data.message || 'Something went wrong...',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Connection Error',
          description: 'Impossible to reach the server. Please, try again later.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoadingProject(false);
    }
  };

  // Si esegue al mount E ogni volta che `activeProject` cambia
  useEffect(() => {
    console.log('entro nello useEffect di DASHBOARD');

    fetchActiveProjectData();
  }, [activeProject]); // Si riattiva quando l'utente clicca un'altra tab

  // Si esegue solo una volta al mount del componente
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Your Projects" />
      <ProjectTabs
        tabs={tabs}
        activeProject={activeProject}
        onChangeProject={setActiveProject}
        setTabs={setTabs}
        reloadProjects={fetchProjects}
        loading={loadingTabs}
      />
      <DashboardContent
        activeProjectData={activeProjectData}
        setActiveProjectData={setActiveProjectData}
        loading={loadingProject}
      />
    </div>
  );
};

export default Dashboard;
