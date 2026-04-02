"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Zap, PlusCircle, Fuel } from 'lucide-react';

// Ajustado para caminho relativo
import { useGame } from '../../context/GameContext';

export default function Refinaria() {
  const { inventory, setInventory, setRefinedBars } = useGame();
  const [slotOre, setSlotOre] = useState<string | null>(null);
  const [slotFuel, setSlotFuel] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSelector, setShowSelector] = useState<'ore' | 'fuel' | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRefining && slotOre && slotFuel) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            // Lógica de conclusão
            setInventory((prev: any) => ({ ...prev, carvao: prev.carvao - 1, [slotOre]: prev[slotOre] - 5 }));
            setRefinedBars((prev: any) => ({ ...prev, [slotOre]: (prev[slotOre] || 0) + 1 }));
            if (inventory.carvao <= 1 || inventory[slotOre] < 5) setIsRefining(false);
            return 0;
          }
          return p + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRefining, slotOre, slotFuel]);

  return (
    <div className="p-4 flex flex-col items-center justify-center h-full">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-slate-800 rounded-[40px] p-8 text-center relative">
        <h2 className="text-orange-500 font-black text-xl mb-8 uppercase flex justify-center gap-2"><Flame/> Fornalha</h2>
        
        <div className="flex justify-around items-center mb-8">
          <button onClick={() => setShowSelector('ore')} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
            {slotOre ? <span className="text-3xl">{slotOre === 'ferro' ? '⚪' : '🟡'}</span> : <PlusCircle className="text-slate-700"/>}
          </button>
          <Zap className={isRefining ? "text-orange-500 animate-pulse" : "text-slate-800"} />
          <button onClick={() => setShowSelector('fuel')} className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center">
            {slotFuel ? <Fuel className="text-orange-500"/> : <PlusCircle className="text-slate-700"/>}
          </button>
        </div>

        <div className="h-4 bg-slate-950 rounded-full overflow-hidden mb-6"><div className="h-full bg-orange-500" style={{width: `${progress}%`}}/></div>
        
        <button 
          onClick={() => setIsRefining(!isRefining)} 
          disabled={!slotOre || !slotFuel}
          className="w-full py-4 bg-orange-600 rounded-2xl font-black uppercase disabled:opacity-20"
        >
          {isRefining ? "Parar" : "Iniciar"}
        </button>

        {showSelector && (
          <div className="absolute inset-x-6 bottom-4 bg-slate-800 p-4 rounded-xl flex gap-4 justify-center">
            {showSelector === 'ore' ? (
              <>
                <button onClick={() => {setSlotOre('ferro'); setShowSelector(null)}} className="text-2xl">⚪</button>
                <button onClick={() => {setSlotOre('ouro'); setShowSelector(null)}} className="text-2xl">🟡</button>
              </>
            ) : (
              <button onClick={() => {setSlotFuel(true); setShowSelector(null)}}><Fuel className="text-orange-500"/></button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}