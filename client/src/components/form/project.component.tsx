import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import validationSchema from '@/schemas/project.schema';
import { useToast } from '@/hooks/use-toast';
import { ProjectFormData, ProjectResponse } from '@/types/project.types';
import { Tab, ProjectComponentProps } from '@/types/tab.types';
import { useFormik } from 'formik';
import { ApiResponse } from '@/types/server_response.types';
import api from '@/lib/axios';

const initialValues: ProjectFormData = {
  name: '',
  domain: '',
};

const ProjectComponent = ({
  tabs,
  setTabs,
  activeProject,
  setActiveProject,
  reloadProjects,
  loading,
}: ProjectComponentProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: ProjectFormData) => {
    try {
      // Chiamata API per creare il progetto
      const response = await api.post<ApiResponse<ProjectResponse>>('/project', values);
      console.log('Progetto creato:', response.data);
      const newProject = {
        id: response.data.data.id,
        name: values.name.trim(),
        count: 0, // Inizialmente il conteggio è 0
      };

      // Aggiungi alla lista e rendilo attivo
      setTabs((prevTabs) => [...prevTabs, newProject]);
      setActiveProject(newProject.name);

      // Reset del form
      formik.resetForm();
      setIsCreating(false);

      toast({
        title: 'Progetto creato',
        description: `Il progetto "${newProject.name}" è stato creato con successo.`,
      });
    } catch (error) {
      console.error('Errore nella creazione del progetto:', error);
      toast({
        title: 'Errore',
        description: 'Errore durante la creazione del progetto. Riprova.',
        variant: 'destructive',
      });
    }
  };

  const formik = useFormik<ProjectFormData>({
    validationSchema,
    initialValues,
    onSubmit,
  });

  const handleCreateClick = () => {
    setIsCreating(true);
  };

  const handleCancel = () => {
    formik.resetForm();
    setIsCreating(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleProjectChange = (projectName: string) => {
    setActiveProject(projectName);

    // Ricavo i dati del progetto selezionato
    const selectedProject = tabs.find((tab) => tab.name === projectName);
    if (selectedProject) {
      console.log('Progetto selezionato:', selectedProject);
      // Qui puoi fare qualcosa con il progetto selezionato, come caricare i dati specifici
    }
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
        <form onSubmit={formik.handleSubmit} className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              onKeyDown={handleKeyPress}
              placeholder="Nome del progetto..."
              className="w-48 h-8 text-sm"
              autoFocus
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs">{formik.errors.name}</div>
            )}
            <Button
              type="submit"
              disabled={!formik.values.name.trim() || formik.isSubmitting}
              className="bg-green-400 hover:bg-green-500 disabled:bg-gray-400 text-white rounded-sm px-2 py-1 text-xs"
            >
              {formik.isSubmitting ? '...' : '✓'}
            </Button>
            <Button
              onClick={handleCancel}
              className="bg-red-400 hover:bg-red-500 text-white rounded-sm px-2 py-1 text-xs"
            >
              ✕
            </Button>
          </div>
        </form>
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

export default ProjectComponent;
