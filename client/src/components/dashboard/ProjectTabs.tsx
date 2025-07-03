import { ProjectComponent } from '@/components/form';
import { Tab, ProjectTabsProps } from '@/types/tab.types';

export const ProjectTabs = ({
  tabs,
  activeProject,
  setActiveProject,
  setTabs,
  reloadProjects,
  loading,
}: ProjectTabsProps) => {
  // Get id active project from tabs
  const activeTab = tabs.find((tab) => tab.name === activeProject);
  if (!activeTab) {
    console.error('Active project not found in tabs');
    return null; // or handle the error as needed
  }
  const activeProjectId = activeTab.id;

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <ProjectComponent
        tabs={tabs}
        setTabs={setTabs}
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        reloadProjects={reloadProjects}
        loading={loading}
      />

      <div className="py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Neuron: <span className="font-medium">Project #{activeProjectId}</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>
              Subscription Valid Until:{' '}
              <span className="text-green-600 font-medium">July 1, 2026</span>
            </span>
            <span>
              Targets Left: <span className="font-medium">93</span>
            </span>
            <button className="text-blue-600 hover:underline">[View History]</button>
          </div>
        </div>
      </div>
    </div>
  );
};
