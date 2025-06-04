
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Your ImmuniWeb® Neuron Projects
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-orange-600 border border-orange-600 hover:bg-orange-50">
            📖 User Manual
          </Button>
          <Button variant="ghost" className="text-orange-600 border border-orange-600 hover:bg-orange-50">
            ⚙️ API & User Access
          </Button>
        </div>
      </div>
    </header>
  );
};
