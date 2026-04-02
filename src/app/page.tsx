"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pickaxe, Coins, Hammer, Wrench, Cpu, Flame, 
  Store, Boxes, Skull, ShieldAlert, Swords, Layers, 
  Home, ShoppingCart, Map, Search, Navigation, 
  ShieldCheck, Loader2, Bot, ArrowRight, Activity,
  Database, Cog, CircuitBoard, Fuel, Shield, Crosshair
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATABASE DE ITENS ---
const ORE_DATA = [
  { id: 'terra', name: "Terra", char: "🟫", value: 2 },
  { id: 'carvao', name: "Carvão", char: "⬛", value: 5 }, // Combustível
  { id: 'ferro', name: "Ferro", char: "⚪", value: 40 },
  { name: "Ouro", char: "🟡", value: 100 },
];

const SHOP_ITEMS = [
  { id: 'scrap', name: "Sucata de Aço", cost: 500, icon: <Cog /> },
  { id: 'chip', name: "Microchip", cost: 1500, icon: <CircuitBoard /> },
  { id: 'trap', name: "Mina Terrestre", cost: 3000, icon: <Shield /> },
];

export default function UltimateMineSystem() {
  const [activeTab, setActiveTab] = useState<'base' | 'mapa' | 'refinaria' | 'loja' | 'deck'>('base');
  const [gold, setGold] = useState(5000);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  // Inventário Geral
  const [inventory, setInventory] = useState<{ [key: string]: number }>({ terra: 10, carvao: 5 });
  const [refinedBars, setRefinedBars] = useState<{ [key: string]: number }>({});
  
  // Peças e Robôs
  const [parts, setParts] = useState({ scrap: 0, chips: 0 });
  const [robotsActive, setRobotsActive] = useState(0);
  
  // Refinaria Interativa
  const [refineSlot, setRefineSlot] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineProgress, setRefineProgress] = useState(0);

  // Exploração e Minas
  const [discoveredMines, setDiscoveredMines] = useState<any[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [exploreProgress, setExploreProgress] = useState(0);

  // Defesa da Base
  const [baseHealth, setBaseHealth] = useState(100);
  const [baseDefenses, setBaseDefenses] = useState({ traps: 0, turrets: 0 });
  const [isUnderAttack, setIsUnderAttack] = useState(false);

  const [logs, setLogs] = useState<string[]>(["Terminal iniciado..."]);

  // --- LOGICA DE BACKEND (TIMERS) ---
  useEffect(() => {
    const timer = setInterval(() => {
      // Robôs produzem ferro se houver mina
      if (robotsActive > 0 && discoveredMines.length > 0) {
        addItem('ferro', robotsActive);
      }
      // Refinaria consome carvão e minério
      if (isRefining && refineSlot) {
        setRefineProgress(p => {
          if (p >= 100) {
            finishRefine();
            return 0;
          }
          return p + 5;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRefining, robotsActive, discoveredMines, refineSlot]);

  const addItem = (id: string, qty: number) => {
    setInventory(prev => ({ ...prev, [id]: (prev[id] || 0) + qty }));
  };

  const addLog = (m: string) => setLogs(p => [m, ...p].slice(0, 5));

  const finishRefine = () => {
    if ((inventory['carvao'] || 0) > 0 && (inventory[refineSlot!] || 0) >= 5) {
      setInventory(prev => ({ ...prev, carvao: prev.carvao - 1, [refineSlot!]: prev[refineSlot!] - 5 }));
      setRefinedBars(prev => ({ ...prev, [refineSlot!]: (prev[refineSlot!] || 0) + 1 }));
      addLog(`🔥 Sucesso: Barra de ${refineSlot} refinada.`);
    } else {
      setIsRefining(false);
      addLog("❌ Falta Carvão ou Minério!");
    }
  };

  // --- COMPONENTES DE TELA ---

  const RenderBase = () => (
    <div className="p-6 grid grid-cols-2 gap-6 h-full">
      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] p-8 flex flex-col items-center justify-center">
        <Home size={60} className="text-indigo-500 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Quartel General</h2>
        <p className="text-slate-500 text-xs mb-6">Integridade: {baseHealth}%</p>
        <div className="flex gap-4">
          <div className="bg-slate-800 p-4 rounded-2xl text-center">
            <Shield className="mx-auto mb-1 text-emerald-500" size={20}/>
            <p className="text-[10px] font-black">{baseDefenses.traps} Minas</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl text-center">
            <Crosshair className="mx-auto mb-1 text-red-500" size={20}/>
            <p className="text-[10px] font-black">{baseDefenses.turrets} Torres</p>
          </div>
        </div>
      </div>
      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] p-6">
        <h3 className="text-xs font-black text-slate-500 mb-4 uppercase">Status de Produção</h3>
        <div className="space-y-3">
          <div className="flex justify-between p-3 bg-black/20 rounded-xl border border-white/5">
             <span className="text-xs font-bold text-slate-400">Robôs Operando</span>
             <span className="text-xs font-black text-cyan-400">{robotsActive} UN</span>
          </div>
          <div className="flex justify-between p-3 bg-black/20 rounded-xl border border-white/5">
             <span className="text-xs font-bold text-slate-400">Jazidas Ativas</span>
             <span className="text-xs font-black text-indigo-400">{discoveredMines.length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const RenderRefinaria = () => (
    <div className="p-6 flex flex-col items-center h-full">
       <div className="w-full max-w-2xl bg-slate-900 p-8 rounded-[50px] border-2 border-orange-500/20 shadow-2xl relative overflow-hidden">
          <div className="flex justify-around mb-10">
             {/* SLOT DE MINERIO */}
             <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black text-slate-500">MINÉRIO (5x)</p>
                <div className="w-20 h-20 bg-black/40 border-2 border-dashed border-slate-700 rounded-2xl flex items-center justify-center">
                   {refineSlot ? <span className="text-2xl">{ORE_DATA.find(o=>o.id===refineSlot)?.char}</span> : <BoxIcon size={24} className="text-slate-800"/>}
                </div>
                <div className="flex gap-1">
                   {['terra', 'ferro'].map(id => (
                     <button key={id} onClick={() => setRefineSlot(id)} className="p-1 bg-slate-800 rounded hover:bg-orange-600 transition-all text-xs">{ORE_DATA.find(o=>o.id===id)?.char}</button>
                   ))}
                </div>
             </div>

             <div className="flex flex-col items-center justify-center"><Flame size={40} className={isRefining ? "text-orange-500 animate-pulse" : "text-slate-800"}/></div>

             {/* SLOT DE COMBUSTIVEL */}
             <div className="flex flex-col items-center gap-2">
                <p className="text-[10px] font-black text-slate-500">COMBUSTÍVEL</p>
                <div className={`w-20 h-20 bg-black/40 border-2 rounded-2xl flex items-center justify-center ${inventory.carvao > 0 ? 'border-orange-500/50' : 'border-red-500/50'}`}>
                   <Fuel className={inventory.carvao > 0 ? "text-orange-500" : "text-slate-800"}/>
                </div>
                <p className="text-[10px] font-bold text-orange-500">{inventory.carvao} Carvão</p>
             </div>
          </div>

          <div className="h-4 bg-slate-950 rounded-full overflow-hidden mb-6 border border-white/5">
             <motion.div className="h-full bg-gradient-to-r from-orange-600 to-yellow-400" animate={{ width: `${refineProgress}%` }} />
          </div>

          <button 
            onClick={() => setIsRefining(!isRefining)}
            disabled={!refineSlot}
            className={`w-full py-5 rounded-3xl font-black text-sm uppercase transition-all ${isRefining ? 'bg-red-600' : 'bg-orange-600 hover:bg-orange-500 shadow-[0_8px_0_#9a3412]'}`}
          >
            {isRefining ? "Interromper Processo" : "Iniciar Fundição"}
          </button>
       </div>
    </div>
  );

  const RenderLoja = () => (
    <div className="p-6 grid grid-cols-2 gap-4 h-full overflow-y-auto no-scrollbar">
       {SHOP_ITEMS.map(item => (
         <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="text-indigo-400 mb-3">{item.icon}</div>
            <h4 className="font-black text-xs uppercase mb-1">{item.name}</h4>
            <p className="text-[10px] text-slate-500 mb-4">{item.cost}G</p>
            <button 
              onClick={() => { if(gold>=item.cost){setGold(g=>g-item.cost); setParts(p=>({...p, [item.id]: (p[item.id as keyof typeof p]||0)+1}))}}}
              className="w-full py-2 bg-indigo-600 rounded-xl text-[10px] font-black uppercase"
            >Comprar</button>
         </div>
       ))}
       <div className="col-span-2 bg-slate-800/30 p-6 rounded-[32px] border-2 border-dashed border-slate-700 text-center">
          <p className="text-[10px] font-black text-slate-500 mb-4">MONTAGEM DE ROBÔ</p>
          <div className="flex justify-center gap-6 mb-4">
             <div className="text-xs font-bold">⚙️ {parts.scrap}/5</div>
             <div className="text-xs font-bold">🧠 {parts.chips}/1</div>
          </div>
          <button 
            onClick={() => {if(parts.scrap>=5 && parts.chips>=1){setRobotsActive(r=>r+1); setParts({scrap: parts.scrap-5, chips: parts.chips-1})}}}
            className="px-10 py-3 bg-cyan-600 rounded-2xl font-black text-xs uppercase disabled:opacity-20"
            disabled={parts.scrap < 5 || parts.chips < 1}
          >Montar Unidade</button>
       </div>
    </div>
  );

  return (
    <main className="h-screen w-screen bg-[#020617] text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* HEADER HUD */}
      <header className="h-20 bg-slate-900 border-b border-slate-800 flex justify-between items-center px-10 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg">{level}</div>
             <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: `${(xp/(level*100))*100}%` }} /></div>
          </div>
          <div className="flex items-center gap-2 text-yellow-500 font-black text-2xl tracking-tighter">
            <Coins size={24}/> {gold.toLocaleString()}
          </div>
        </div>
        <button onClick={() => {setGold(g=>g+1000000); addItem('carvao', 50); addItem('ferro', 50); setParts({scrap: 20, chips: 5})}} className="bg-red-600 px-4 py-1.5 rounded-xl font-black text-[10px] animate-pulse">CHEAT ALL</button>
      </header>

      {/* CONTEÚDO DINÂMICO POR ABAS */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'base' && <motion.div key="base" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full"><RenderBase /></motion.div>}
          {activeTab === 'refinaria' && <motion.div key="ref" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full"><RenderRefinaria /></motion.div>}
          {activeTab === 'loja' && <motion.div key="shop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-full"><RenderLoja /></motion.div>}
          {activeTab === 'mapa' && (
            <div className="p-10 flex flex-col items-center justify-center h-full gap-8">
               <div className="bg-slate-900 p-12 rounded-[60px] border-4 border-slate-800 text-center w-full max-w-2xl shadow-2xl">
                  <Map size={60} className="mx-auto mb-4 text-indigo-400" />
                  <h2 className="text-2xl font-black uppercase mb-6">Mapa da Região</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => { setIsExploring(true); setExploreProgress(0); const t = setInterval(()=>setExploreProgress(p=>{if(p>=100){clearInterval(t); setIsExploring(false); setDiscoveredMines(m=>[...m, 1]); return 100}; return p+2}), 100)}}
                       className="bg-indigo-600 p-6 rounded-3xl font-black uppercase text-xs flex flex-col items-center gap-2"
                     >
                       <Search /> Explorar Nova Mina
                     </button>
                     <div className="bg-slate-950 p-6 rounded-3xl flex flex-col items-center justify-center border border-slate-800">
                        <p className="text-[10px] font-black text-slate-500 mb-1">MINAS ATIVAS</p>
                        <span className="text-3xl font-black text-indigo-400">{discoveredMines.length}</span>
                     </div>
                  </div>
                  {isExploring && (
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-6 overflow-hidden"><motion.div className="h-full bg-indigo-500" style={{ width: `${exploreProgress}%` }} /></div>
                  )}
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER NAVEGAÇÃO E INVENTÁRIO */}
      <div className="h-44 bg-slate-900 border-t border-slate-800 flex flex-col shrink-0">
         {/* INVENTARIO RAPIDO */}
         <div className="h-16 border-b border-white/5 flex items-center px-10 gap-4 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-black text-slate-500 uppercase mr-4 flex items-center gap-2"><Boxes size={14}/> Armazém:</span>
            {Object.entries(inventory).map(([id, qty]) => qty > 0 && (
              <div key={id} className="bg-black/40 px-4 py-1.5 rounded-full border border-white/10 text-[11px] font-black flex items-center gap-2 min-w-fit">
                <span>{ORE_DATA.find(o=>o.id===id)?.char}</span>
                <span className="text-indigo-400">{qty}</span>
              </div>
            ))}
            {Object.entries(refinedBars).map(([id, qty]) => qty > 0 && (
              <div key={id} className="bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/30 text-[11px] font-black flex items-center gap-2 min-w-fit">
                <span className="text-orange-500">🔥 Barra {id}</span>
                <span className="text-orange-400">{qty}</span>
              </div>
            ))}
         </div>

         {/* MENU INFERIOR */}
         <div className="flex-1 flex justify-around items-center px-6">
            <NavBtn id="base" icon={<Home/>} label="Base" active={activeTab==='base'} set={setActiveTab}/>
            <NavBtn id="mapa" icon={<Map/>} label="Mapa" active={activeTab==='mapa'} set={setActiveTab}/>
            <NavBtn id="refinaria" icon={<Flame/>} label="Refinar" active={activeTab==='refinaria'} set={setActiveTab}/>
            <NavBtn id="loja" icon={<Store/>} label="Loja" active={activeTab==='loja'} set={setActiveTab}/>
            <NavBtn id="deck" icon={<Layers/>} label="Deck" active={activeTab==='deck'} set={setActiveTab}/>
         </div>
      </div>
    </main>
  );
}

function NavBtn({id, icon, label, active, set}: any) {
  return (
    <button onClick={()=>set(id)} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-indigo-400 scale-110' : 'text-slate-500 opacity-60'}`}>
       <div className={`p-2 rounded-xl ${active ? 'bg-indigo-400/10 shadow-lg shadow-indigo-500/10' : ''}`}>{React.cloneElement(icon, { size: 24 })}</div>
       <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function BoxIcon({ size = 24, className = "" }) { return <Boxes size={size} className={className}/> }