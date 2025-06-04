
import { Button } from "@/components/ui/button";

interface ProjectTabsProps {
  activeProject: string;
  onProjectChange: (project: string) => void;
}

export const ProjectTabs = ({ activeProject, onProjectChange }: ProjectTabsProps) => {
  const tabs = [
    { name: "Discovery CTEM", count: 5, color: "bg-blue-100 text-blue-700" },
    { name: "Discovery TPRM", count: 3, color: "bg-blue-100 text-blue-700" },
    { name: "Neuron", count: 4, color: "bg-blue-600 text-white" },
    { name: "Neuron Mobile", count: 1, color: "bg-blue-100 text-blue-700" },
    { name: "On-Demand", count: 2, color: "bg-blue-100 text-blue-700" },
    { name: "MobileSuite", count: 1, color: "bg-blue-100 text-blue-700" },
    { name: "Continuous", count: 1, color: "bg-blue-100 text-blue-700" }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <div className="flex items-center space-x-2 py-2">
        <Button className="bg-green-600 hover:bg-green-700 text-white rounded-sm px-3 py-1 text-sm">
          + CREATE NEW PROJECT
        </Button>
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onProjectChange(tab.name)}
              className={`px-3 py-1 rounded-sm text-sm font-medium ${tab.color} hover:opacity-80 transition-opacity`}
            >
              {tab.name} {tab.count}
            </button>
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
            <span>Subscription Valid Until: <span className="text-green-600 font-medium">July 1, 2026</span></span>
            <span>Targets Left: <span className="font-medium">93</span></span>
            <button className="text-blue-600 hover:underline">[View History]</button>
          </div>
        </div>
      </div>
    </div>
  );
};
