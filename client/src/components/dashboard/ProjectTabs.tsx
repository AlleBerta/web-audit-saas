import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface ProjectTabsProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
  onCreateProject?: (projectName: string) => void; // Nuova prop per gestire la creazione
}

export const ProjectTabs = ({
  activeProject,
  onProjectChange,
  onCreateProject,
}: ProjectTabsProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const tabs = [
    { name: 'Discovery CTEM', count: 5 },
    { name: 'Discovery TPRM', count: 3 },
    { name: 'Neuron', count: 4 },
    { name: 'Neuron Mobile', count: 1 },
    { name: 'On-Demand', count: 2 },
    { name: 'MobileSuite', count: 1 },
    { name: 'Continuous', count: 1 },
  ];

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCreateProject = () => {
    alert('Bella');
    if (newProjectName.trim()) {
      onCreateProject?.(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setNewProjectName('');
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex items-center space-x-2 py-2">
        {!isCreating ? (
          <Button
            onClick={handleCreateClick}
            className="bg-green-600 hover:bg-green-700 text-white rounded-sm px-3 py-1 text-sm"
          >
            + CREATE NEW PROJECT
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nome del progetto..."
              className="w-48 h-8 text-sm"
              autoFocus
            />
            <Button
              onClick={handleCreateProject}
              className="bg-green-600 hover:bg-green-700 text-white rounded-sm px-2 py-1 text-xs"
            >
              ✓
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-red-400 hover:bg-red-500 text-white rounded-sm px-2 py-1 text-xs"
            >
              ✕
            </Button>
          </div>
        )}

        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.name}
              onClick={() => onProjectChange(tab.name)}
              variant={activeProject === tab.name ? 'default' : 'ghost'}
              size="sm"
              className={`${
                activeProject === tab.name ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              } hover:opacity-80 transition-opacity`}
            >
              {tab.name} {tab.count}
            </Button>
          ))}
        </div>
      </div>

      <div className="py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Neuron: <span className="font-medium">Project #3138898</span>
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
