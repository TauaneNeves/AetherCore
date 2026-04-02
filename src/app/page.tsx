"use client";

import React, { useState } from 'react';
import { Home, Map as MapIcon, Flame, Store, Layers, Coins, Boxes } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GameProvider, useGame } from '../context/GameContext';
import Mapa from '../components/game/Mapa';
import Refinaria from '../components/game/Refinaria';
import BaseScreen from '../components/game/BaseScreen';
import DeckScreen from '../components/game/DeckScreen';

function GameShell() {
  const [activeTab, setActiveTab] = useState<'base' | 'mapa' | 'refinaria' | 'loja' | 'deck'>('base');
  const { gold, inventory, refinedBars, setGold, setInventory, setRefinedBars } = useGame();

  return (
    <main className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden font-sans">
      
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-8 shrink-0 z-20">
        <div className="flex items-center gap-4 text-yellow-500 font-black text-xl tabular-nums">
          <Coins size={22} /> {gold.toLocaleString()}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { 
              setGold((g: number) => g + 5000); 
              setInventory((i: any) => ({ ...i, carvao: 50, ferro: 50, ouro: 20 })); 
              setRefinedBars((r: any) => ({ ...r, ferro: (r.ferro || 0) + 10, ouro: (r.ouro || 0) + 5 }));
            }} 
            className="bg-emerald-600 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-tighter hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          >
            Dev Cheat
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden z-0">
        <AnimatePresence mode="wait">
          {activeTab === 'base' && <motion.div key="base" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BaseScreen /></motion.div>}
          {activeTab === 'mapa' && <motion.div key="mapa" className="h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}><Mapa /></motion.div>}
          {activeTab === 'refinaria' && <motion.div key="ref" className="h-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Refinaria /></motion.div>}
          {activeTab === 'deck' && <motion.div key="deck" className="h-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><DeckScreen /></motion.div>}
          
          {activeTab === 'loja' && <div className="h-full flex items-center justify-center font-black uppercase text-slate-700">Loja em breve</div>}
        </AnimatePresence>
      </div>

      <nav className="h-32 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="h-10 border-b border-white/5 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar">
          <span className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-1 shrink-0"><Boxes size={12}/> Inventário:</span>
          <div className="flex gap-4 text-[10px] font-bold tabular-nums shrink-0">
            <span className="text-stone-400">🪨 {inventory.terra || 0}</span>
            <span className="text-orange-400">⬛ {inventory.carvao}</span>
            <span className="text-slate-300">⚪ {inventory.ferro}</span>
            <span className="text-yellow-500">🟡 {inventory.ouro}</span>
            <span className="text-blue-300">⚙️ {inventory.pecas_robo || 0}</span>
            <span className="text-emerald-300">🛡️ {inventory.pecas_defesa || 0}</span>
            <span className="text-purple-400">🏺 {inventory.item_antigo || 0}</span>
          </div>
        </div>

        <div className="flex-1 flex justify-around items-center px-4">
          <NavBtn id="base" icon={<Home />} label="Base" active={activeTab === 'base'} onClick={setActiveTab} />
          <NavBtn id="mapa" icon={<MapIcon />} label="Mapa" active={activeTab === 'mapa'} onClick={setActiveTab} />
          <NavBtn id="refinaria" icon={<Flame />} label="Refinar" active={activeTab === 'refinaria'} onClick={setActiveTab} />
          <NavBtn id="loja" icon={<Store />} label="Loja" active={activeTab === 'loja'} onClick={setActiveTab} />
          <NavBtn id="deck" icon={<Layers />} label="Cards" active={activeTab === 'deck'} onClick={setActiveTab} />
        </div>
      </nav>
    </main>
  );
}

function NavBtn({ id, icon, label, active, onClick }: any) {
  return (
    <button onClick={() => onClick(id)} 
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-400 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
    >
      <div className={`p-2.5 rounded-2xl ${active ? 'bg-indigo-400/10 shadow-lg' : ''}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}