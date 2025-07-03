import { useState } from 'react';
import { SoftwareCompositionChart } from './SoftwareCompositionChart';
import { VulnerabilitiesList } from './VulnerabilitiesList';
import { TargetsTable } from './TargetsTable';
import { FilterBar } from './FilterBar';
import { Target } from '@/types/target.types';

export const DashboardContent = () => {
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Top Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoftwareCompositionChart selectedTarget={selectedTarget} />
        <VulnerabilitiesList selectedTarget={selectedTarget} />
      </div>

      {/* Filters and Actions */}
      <FilterBar />

      {/* Targets Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Targets</h2>
        <p className="text-gray-500 mb-4">Select a target to view details and vulnerabilities.</p>

        <TargetsTable setSelectedTarget={setSelectedTarget} selectedTarget={selectedTarget} />
      </div>
    </div>
  );
};
