import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SITE_NAME } from '../config/conts';
import { SignupComponent } from '@/components/form';

const Signup = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          <img src="/android-chrome-192x192.png" alt="Logo" className="mx-auto w-24 h-24" />
        </Link>
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            {SITE_NAME}
          </Link>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
            <CardDescription className="text-center">
              Join our cybersecurity platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupComponent />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <Link to="/" className="text-blue-600 hover:underline">
                  ← Back to home
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
