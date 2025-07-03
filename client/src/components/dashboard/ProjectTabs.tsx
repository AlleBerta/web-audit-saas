import { ProjectComponent } from '@/components/form';

export const ProjectTabs = () => {
  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <ProjectComponent />

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
