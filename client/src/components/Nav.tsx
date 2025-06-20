import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SITE_NAME } from '../config/conts';

function Nav() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img src="/favicon-32x32.png" alt="Logo" className="mx-auto w-18 h-18" />
            <h1 className="text-xl font-bold text-blue-600">{SITE_NAME}</h1>
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
  );
}

export { Nav };
