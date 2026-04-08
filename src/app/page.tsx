"use client";

import React, { useState } from 'react';
import { Home, Map as MapIcon, Leaf, Store, Layers, Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { GameProvider, useGame } from '../context/GameContext';
import Mapa from '../components/game/Mapa';
import Refinaria from '../components/game/Refinaria';
import BaseScreen from '../components/game/BaseScreen';
import DeckScreen from '../components/game/DeckScreen';
import Loja from '../components/game/Loja';

// Os nossos novos SVGs (Sem Emojis!)
import { AssetMusgo, AssetEssenciaSombria, AssetFragmentoRunico, AssetPoeiraVital, AssetNucleoGolem, AssetSeloDefesa, AssetReliquia } from '../components/game/GameAssets';

function GameShell() {
  const [activeTab, setActiveTab] = useState<'base' | 'mapa' | 'refinaria' | 'loja' | 'deck'>('base');
  const { gold, inventory, refinedBars, setGold, setInventory, setRefinedBars } = useGame();

  return (
    <main className="h-screen w-screen bg-[#022c22] text-teal-100 flex flex-col overflow-hidden font-sans">
      
      {/* CABEÇALHO */}
      <header className="h-16 bg-[#042f2e] border-b border-teal-900 flex justify-between items-center px-8 shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3 text-purple-400 font-black text-xl tabular-nums drop-shadow-md">
          <Sparkles size={24} className="animate-pulse text-purple-300" /> 
          {gold.toLocaleString()} 
          <span className="text-[9px] text-teal-500 uppercase tracking-widest ml-1 bg-teal-950/50 px-2 py-1 rounded-lg border border-teal-800/50">
            Poeira Vital
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { 
              setGold((g: number) => g + 5000); 
              setInventory((i: any) => ({ ...i, carvao: 50, ferro: 50, ouro: 20, pecas_robo: 50, terra: 100 })); 
              setRefinedBars((r: any) => ({ ...r, ferro: (r.ferro || 0) + 10, ouro: (r.ouro || 0) + 5 }));
            }} 
            className="bg-purple-700 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-tighter hover:bg-purple-600 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white border border-purple-400/30"
          >
            Dev Cheat
          </button>
        </div>
      </header>

      {/* ÁREA CENTRAL DO JOGO */}
      <div className="flex-1 overflow-hidden z-0 relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2dd4bf 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'base' && <motion.div key="base" className="h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><BaseScreen /></motion.div>}
          {activeTab === 'mapa' && <motion.div key="mapa" className="h-full relative z-10" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}><Mapa /></motion.div>}
          {activeTab === 'refinaria' && <motion.div key="ref" className="h-full relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Refinaria /></motion.div>}
          {activeTab === 'deck' && <motion.div key="deck" className="h-full relative z-10" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><DeckScreen /></motion.div>}
          {activeTab === 'loja' && <motion.div key="loja" className="h-full relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Loja /></motion.div>}
        </AnimatePresence>
      </div>

      {/* RODAPÉ DE NAVEGAÇÃO E INVENTÁRIO */}
      <nav className="h-32 bg-[#042f2e] border-t border-teal-900 flex flex-col shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] z-20">
        
        {/* Barra de Inventário 100% SVG */}
        <div className="h-10 border-b border-teal-900/50 flex items-center px-4 gap-4 overflow-x-auto no-scrollbar bg-teal-950/30">
          <span className="text-[9px] font-black text-teal-600 uppercase flex items-center gap-1 shrink-0 bg-teal-950 px-2 py-1 rounded-md border border-teal-900"><Box size={12}/> Bolsa Mística:</span>
          <div className="flex gap-4 text-[11px] font-bold tabular-nums shrink-0 drop-shadow-sm">
            <span className="text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetMusgo className="w-4 h-4"/> {inventory.terra || 0}</span>
            <span className="text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetEssenciaSombria className="w-4 h-4"/> {inventory.carvao}</span>
            <span className="text-teal-400 bg-slate-800/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetFragmentoRunico className="w-4 h-4"/> {inventory.ferro}</span>
            <span className="text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetPoeiraVital className="w-4 h-4"/> {inventory.ouro}</span>
            <span className="text-teal-300 bg-teal-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetNucleoGolem className="w-4 h-4"/> {inventory.pecas_robo || 0}</span>
            <span className="text-cyan-300 bg-cyan-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetSeloDefesa className="w-4 h-4"/> {inventory.pecas_defesa || 0}</span>
            <span className="text-fuchsia-400 bg-fuchsia-950/30 px-2 py-0.5 rounded flex items-center gap-1"><AssetReliquia className="w-4 h-4"/> {inventory.item_antigo || 0}</span>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className="flex-1 flex justify-around items-center px-4">
          <NavBtn id="base" icon={<Home />} label="Santuário" active={activeTab === 'base'} onClick={setActiveTab} />
          <NavBtn id="mapa" icon={<MapIcon />} label="Selva" active={activeTab === 'mapa'} onClick={setActiveTab} />
          <NavBtn id="refinaria" icon={<Leaf />} label="Síntese" active={activeTab === 'refinaria'} onClick={setActiveTab} />
          <NavBtn id="loja" icon={<Store />} label="Bazar" active={activeTab === 'loja'} onClick={setActiveTab} />
          <NavBtn id="deck" icon={<Layers />} label="Runas" active={activeTab === 'deck'} onClick={setActiveTab} />
        </div>
      </nav>
    </main>
  );
}

function NavBtn({ id, icon, label, active, onClick }: any) {
  return (
    <button onClick={() => onClick(id)} 
      className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-purple-400 scale-110 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'text-teal-700 hover:text-teal-500'}`}
    >
      <div className={`p-2.5 rounded-2xl ${active ? 'bg-purple-900/40 border border-purple-500/40 shadow-lg' : ''}`}>
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