// Dashboard.tsx
import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { ProjectResponse } from '@/types/project.types';
import { Tab } from '@/types/tab.types';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';

const Dashboard = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeProject, setActiveProject] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      console.log('Caricamento progetti...');
      setLoading(true);
      const response = await api.get<ApiResponse<ProjectResponse[]>>('/project');
      const projects = response.data.data;
      console.table(projects);
      if (projects.length > 0) {
        setActiveProject(projects[0].name);
      }
      const projectsTabs = projects.map((project) => ({
        id: project.id,
        name: project.name,
        count: project.scans ? project.scans.length : 0, // Assuming scans is an array
      }));
      setTabs(projectsTabs);
    } catch (err) {
      console.error('Errore nel caricamento dei progetti:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const reloadProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get<ApiResponse<ProjectResponse[]>>('/project');
      const projects = res.data.data;
      console.table(projects);
      if (projects.length > 0) {
        setActiveProject(projects[0].name); // Imposta il primo attivo
      }
      const projectsTabs = projects.map((project) => ({
        id: project.id,
        name: project.name,
        count: project.scans ? project.scans.length : 0, // Assuming scans is an array
      }));
      setTabs(projectsTabs);
    } catch (error) {
      console.error('Errore nel ricaricare i progetti:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <ProjectTabs
        tabs={tabs}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        setTabs={setTabs}
        reloadProjects={fetchProjects}
        loading={loading}
      />
      {/* <DashboardContent activeProject={activeProject} tabs={tabs} /> */}
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
