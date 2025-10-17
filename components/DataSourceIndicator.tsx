import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface DataSourceIndicatorProps {
  isLive: boolean;
  className?: string;
}

export const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ 
  isLive, 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {isLive ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-600 font-medium">Live Data</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-amber-500" />
          <span className="text-amber-600 font-medium">Demo Data</span>
        </>
      )}
    </div>
  );
};
