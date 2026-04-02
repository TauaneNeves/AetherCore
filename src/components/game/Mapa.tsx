"use client";
import React, { useState } from 'react';
import { Map as MapIcon, Search, Loader2 } from 'lucide-react';

// Ajustado para caminho relativo
import { useGame } from '../../context/GameContext';

export default function Mapa() {
  const { discoveredMines, setDiscoveredMines } = useGame();
  const [isExploring, setIsExploring] = useState(false);
  const [progress, setProgress] = useState(0);

  const startExplore = () => {
    setIsExploring(true);
    setProgress(0);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setIsExploring(false);
          setDiscoveredMines((m: number) => m + 1);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center h-full">
      <div className="bg-slate-900 border-2 border-slate-800 p-10 rounded-[40px] text-center w-full max-w-md shadow-2xl">
        <MapIcon size={64} className="mx-auto mb-6 text-indigo-500" />
        <h2 className="text-2xl font-black uppercase mb-8">Radar de Jazidas</h2>
        <button 
          onClick={startExplore} 
          disabled={isExploring}
          className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2"
        >
          {isExploring ? <Loader2 className="animate-spin" /> : <Search size={20}/>}
          Explorar Setor
        </button>
        {isExploring && (
          <div className="h-2 bg-slate-800 mt-6 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400" style={{width: `${progress}%`}}/>
          </div>
        )}
        <p className="mt-6 text-xs font-black text-slate-500 uppercase tracking-widest">
          Minas Localizadas: {discoveredMines}
        </p>
      </div>
    </div>
  );
}