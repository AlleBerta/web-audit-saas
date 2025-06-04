
import { SoftwareCompositionChart } from "./SoftwareCompositionChart";
import { VulnerabilitiesList } from "./VulnerabilitiesList";
import { TargetsTable } from "./TargetsTable";
import { FilterBar } from "./FilterBar";

export const DashboardContent = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Top Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SoftwareCompositionChart />
        <VulnerabilitiesList />
      </div>

      {/* Filters and Actions */}
      <FilterBar />

      {/* Targets Table */}
      <TargetsTable />
    </div>
  );
};
