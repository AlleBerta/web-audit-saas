import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">ImmuniWeb® Neuron</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Cybersecurity Platform</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive vulnerability assessment and security monitoring for your digital assets.
            Protect your organization with cutting-edge threat detection and analysis.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Vulnerability Scanning</CardTitle>
              <CardDescription>
                Comprehensive security assessment with real-time threat detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Advanced scanning capabilities to identify and classify security vulnerabilities
                across your entire digital infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Real-time Monitoring</CardTitle>
              <CardDescription>Continuous security monitoring and alerting system</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                24/7 monitoring with instant notifications for critical security events and emerging
                threats.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-blue-600">Compliance Management</CardTitle>
              <CardDescription>Automated compliance reporting and management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Streamlined compliance workflows with automated reporting for industry standards and
                regulations.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
