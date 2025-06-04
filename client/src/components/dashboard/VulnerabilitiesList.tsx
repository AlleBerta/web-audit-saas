
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const vulnerabilities = [
  { id: "CWE-78", name: "OS Command Injection", count: 1, severity: "critical", color: "bg-teal-500" },
  { id: "CWE-89", name: "SQL Injection", count: 2, severity: "critical", color: "bg-teal-500" },
  { id: "CWE-284", name: "Improper Access Control", count: 1, severity: "high", color: "bg-yellow-500" },
  { id: "CWE-287", name: "Improper Authentication", count: 8, severity: "high", color: "bg-orange-500" },
  { id: "CWE-352", name: "Cross-Site Request Forgery", count: 2, severity: "medium", color: "bg-pink-500" },
  { id: "CWE-79", name: "Cross-Site Scripting", count: 1, severity: "medium", color: "bg-pink-600" },
  { id: "CWE-200", name: "Information Exposure", count: 3, severity: "low", color: "bg-purple-500" },
  { id: "CWE-601", name: "Open Redirect", count: 1, severity: "low", color: "bg-purple-600" }
];

export const VulnerabilitiesList = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Top 10 Unpatched Vulnerabilities
        </CardTitle>
        <Button variant="ghost" className="text-xs bg-green-600 text-white hover:bg-green-700 px-2 py-1 h-6 rounded">
          Hide charts
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className={`${vuln.color} text-white px-3 py-2 rounded flex justify-between items-center`}>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-sm">{vuln.id}</span>
                <span className="text-sm">{vuln.name}</span>
              </div>
              <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium">
                {vuln.count}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
