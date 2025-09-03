import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { exportToJSON, exportToCSV, exportToExcel, ExportData } from '../utils/exportUtils';

interface ExportButtonProps {
  data: ExportData;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  variant = 'secondary',
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleExport = (format: 'json' | 'csv' | 'excel') => {
    switch (format) {
      case 'json':
        exportToJSON(data);
        break;
      case 'csv':
        exportToCSV(data.transactions);
        break;
      case 'excel':
        exportToExcel(data);
        break;
    }
    setShowOptions(false);
  };

  const buttonClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary'
  };

  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowOptions(!showOptions)}
        className={`${buttonClasses[variant]} ${sizeClasses[size]} flex items-center gap-2`}
      >
        <Download className="h-5 w-5" />
        {showLabel && 'Exportar'}
        <ChevronDown className="h-4 w-4" />
      </button>
      
      {/* Dropdown de opções de exportação */}
      {showOptions && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="py-2">
            <button
              onClick={() => handleExport('json')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar JSON
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Exportar CSV
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Exportar Excel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;

