import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ProjectTabs } from '@/components/dashboard/ProjectTabs';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <ProjectTabs />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
