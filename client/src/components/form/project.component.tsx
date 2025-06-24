import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Tab {
  name: string;
  count: number;
}

const ProjectTabs = () => {
  const [activeProject, setActiveProject] = useState('');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);

  // Simula il caricamento dei progetti (sostituisci con la chiamata axios)
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        // Per ora uso dati mock - sostituisci con:
        const response = await axios.get('/project/');
        setTabs(response.data);

        const mockTabs = [
          { name: 'Discovery CTEM', count: 5 },
          { name: 'Discovery TPRM', count: 3 },
          { name: 'Neuron', count: 4 },
          { name: 'Neuron Mobile', count: 1 },
          { name: 'On-Demand', count: 2 },
          { name: 'MobileSuite', count: 1 },
          { name: 'Continuous', count: 1 },
        ];

        setTabs(mockTabs);

        // Imposta il primo progetto come attivo
        if (mockTabs.length > 0) {
          setActiveProject(mockTabs[0].name);
        }
      } catch (error) {
        console.error('Errore nel caricamento dei progetti:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim()) {
      try {
        // Sostituisci con la chiamata axios:
        // const response = await axios.post('/api/projects', {
        //   name: newProjectName.trim(),
        //   count: 0
        // });
        // const newProject = response.data;

        // Per ora simulo la creazione
        const newProject = {
          name: newProjectName.trim(),
          count: 0,
        };

        // Aggiungi alla lista e rendilo attivo
        setTabs((prevTabs) => [...prevTabs, newProject]);
        setActiveProject(newProject.name);

        // Reset del form
        setNewProjectName('');
        setIsCreating(false);

        alert('Progetto creato con successo!');
      } catch (error) {
        console.error('Errore nella creazione del progetto:', error);
        alert('Errore nella creazione del progetto');
      }
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

  const handleProjectChange = (projectName: string) => {
    setActiveProject(projectName);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 py-2">
        <div className="text-gray-500">Caricamento progetti...</div>
      </div>
    );
  }

  return (
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
            disabled={!newProjectName.trim()}
            className="bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-white rounded-sm px-2 py-1 text-xs"
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
            onClick={() => handleProjectChange(tab.name)}
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
  );
};

export default ProjectTabs;
