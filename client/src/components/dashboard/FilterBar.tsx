
import { Button } from "@/components/ui/button";

export const FilterBar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 text-sm">
            📄 New 10
          </Button>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
            🛡️ GDPR 12
          </Button>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
            🏛️ PCI DSS 23
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
          🔍 Search and Filters
        </Button>
        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
          🏷️ Tags
        </Button>
        <Button variant="ghost" className="text-green-600 hover:bg-green-50 px-3 py-1 text-sm">
          ➕ Add Target
        </Button>
        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
          📥 Import Targets
        </Button>
        <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 px-3 py-1 text-sm">
          🔗 CI/CD Integrations
        </Button>
      </div>
    </div>
  );
};
