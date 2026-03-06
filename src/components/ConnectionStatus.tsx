import React, { useState, useEffect } from 'react';
import { checkConnection } from '../services/geminiService';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      const status = await checkConnection();
      setIsConnected(status);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce">
      <div className="bg-rose-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm font-bold">
        <WifiOff className="w-4 h-4" />
        Sin conexión
      </div>
    </div>
  );
};

export default ConnectionStatus;
