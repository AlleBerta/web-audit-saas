import { SITE_NAME } from '@/config/conts';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { BookOpen, ChevronRight, Key } from 'lucide-react';

function PageHeader({ title }: { title: string }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* BREADCRUMB NAVIGATION */}
        <nav className="flex items-center text-xl text-gray-500">
          <Link
            to="/"
            className="font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline"
          >
            {SITE_NAME}
          </Link>

          {/* Icona separatore piccola e grigia */}
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />

          {/* Pagina corrente: testo scuro e non cliccabile */}
          <span className="font-bold text-gray-900 truncate">{title}</span>
        </nav>
        {/* ACTION BUTTONS */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300"
          >
            <BookOpen className="w-4 h-4 mr-2" color="#0f52ba" />
            User Manual
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300"
          >
            <Key className="w-4 h-4 mr-2" color="#0f52ba" />
            API Access
          </Button>
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
