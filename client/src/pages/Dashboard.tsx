import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  const [activeProject, setActiveProject] = useState('Neuron');

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <ProjectTabs activeProject={activeProject} onProjectChange={setActiveProject} />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
