"use client";
import React, { useState, useEffect } from 'react';
import { Flame, Zap, PlusCircle, Fuel, Box, Bot, Wrench, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function Refinaria() {
  const { inventory, setInventory, refinedBars, setRefinedBars, miningRobots, setMiningRobots } = useGame();
  
  const [activeTab, setActiveTab] = useState<'forja' | 'fabrica'>('forja');
  
  // Estados da Forja
  const [isRefining, setIsRefining] = useState(false);
  const [refineType, setRefineType] = useState<'ferro' | 'ouro' | null>(null);

  // Estados da Fábrica
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);

  // Lógica da Forja (Instantânea por agora para não frustrar o jogador, mas consome recursos)
  const processForge = (type: 'ferro' | 'ouro') => {
      const oreCost = 5;
      const fuelCost = type === 'ouro' ? 2 : 1;

      if (inventory[type] >= oreCost && inventory.carvao >= fuelCost) {
          setIsRefining(true);
          setRefineType(type);
          
          setTimeout(() => {
            setInventory((prev: any) => ({ ...prev, carvao: prev.carvao - fuelCost, [type]: prev[type] - oreCost }));
            setRefinedBars((prev: any) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
            setIsRefining(false);
            setRefineType(null);
          }, 1000); // 1 segundo de animação
      } else {
          alert("Recursos brutos insuficientes!");
      }
  };

  // Lógica da Fábrica de Robôs
  const craftRobot = (tier: number) => {
      const pecasReq = tier === 1 ? 10 : 25;
      const ferroReq = tier === 1 ? 5 : 15;

      if (inventory.pecas_robo >= pecasReq && (refinedBars.ferro || 0) >= ferroReq) {
          setIsCrafting(true);
          setCraftProgress(0);
          
          const t = setInterval(() => {
              setCraftProgress(p => {
                  if (p >= 100) {
                      clearInterval(t);
                      setIsCrafting(false);
                      
                      // Deduzir recursos
                      setInventory((prev: any) => ({ ...prev, pecas_robo: prev.pecas_robo - pecasReq }));
                      setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - ferroReq }));
                      
                      // Adicionar novo Robô
                      const newRobot = {
                          id: `r_${Date.now()}`,
                          name: `Extrator Mk${tier}`,
                          rate: tier
                      };
                      setMiningRobots((prev: any) => [...prev, newRobot]);
                      
                      return 0;
                  }
                  return p + 5;
              });
          }, 100);
      } else {
          alert("Materiais de fabricação insuficientes!");
      }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* TABS (Forja / Fábrica) */}
        <div className="flex bg-slate-900 border-2 border-slate-800 rounded-2xl p-1 shadow-lg">
            <button 
                onClick={() => setActiveTab('forja')}
                className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'forja' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <div className="flex items-center justify-center gap-2"><Flame size={16}/> Forja de Minérios</div>
            </button>
            <button 
                onClick={() => setActiveTab('fabrica')}
                className={`flex-1 py-3 text-xs font-black uppercase rounded-xl transition-all ${activeTab === 'fabrica' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <div className="flex items-center justify-center gap-2"><Wrench size={16}/> Fábrica de Robôs</div>
            </button>
        </div>

        <AnimatePresence mode="wait">
            
            {/* ABA 1: FORJA */}
            {activeTab === 'forja' && (
                <motion.div key="forja" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-6">
                    
                    <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ea580c 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                        
                        <Flame size={48} className={`mb-6 ${isRefining ? 'text-orange-500 animate-pulse' : 'text-slate-700'}`} />
                        <h2 className="text-xl font-black uppercase text-white mb-2 relative z-10">Fornalha Industrial</h2>
                        <p className="text-xs text-slate-400 uppercase font-bold relative z-10 mb-8">Transforme minério bruto em barras valiosas.</p>

                        <div className="flex flex-col md:flex-row w-full gap-4 relative z-10">
                            {/* Receita Ferro */}
                            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-slate-800 p-2 rounded-lg text-slate-300">⚪ 5</div>
                                    <span className="text-slate-600 font-black">+</span>
                                    <div className="bg-slate-800 p-2 rounded-lg text-orange-400">⬛ 1</div>
                                    <ArrowRight className="text-slate-600 mx-2"/>
                                    <div className="bg-orange-900/50 p-2 rounded-lg text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]">🔥 1</div>
                                </div>
                                <h3 className="text-sm font-black text-white mb-4">Barra de Ferro</h3>
                                <button 
                                    onClick={() => processForge('ferro')} disabled={isRefining}
                                    className="w-full py-3 bg-orange-600/20 text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl text-xs font-black uppercase transition-colors disabled:opacity-30 disabled:grayscale"
                                >
                                    Fundir Ferro
                                </button>
                            </div>

                            {/* Receita Ouro */}
                            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-between group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-yellow-900/30 p-2 rounded-lg text-yellow-500">🟡 5</div>
                                    <span className="text-slate-600 font-black">+</span>
                                    <div className="bg-slate-800 p-2 rounded-lg text-orange-400">⬛ 2</div>
                                    <ArrowRight className="text-slate-600 mx-2"/>
                                    <div className="bg-yellow-600/50 p-2 rounded-lg text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]">🔥 1</div>
                                </div>
                                <h3 className="text-sm font-black text-yellow-500 mb-4 drop-shadow-md">Barra de Ouro</h3>
                                <button 
                                    onClick={() => processForge('ouro')} disabled={isRefining}
                                    className="w-full py-3 bg-yellow-600/20 text-yellow-500 hover:bg-yellow-600 hover:text-white rounded-xl text-xs font-black uppercase transition-colors disabled:opacity-30 disabled:grayscale"
                                >
                                    Fundir Ouro
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ABA 2: FÁBRICA */}
            {activeTab === 'fabrica' && (
                <motion.div key="fabrica" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-6">
                    <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        
                        <Bot size={48} className={`mb-6 ${isCrafting ? 'text-indigo-400 animate-bounce' : 'text-slate-700'}`} />
                        <h2 className="text-xl font-black uppercase text-white mb-2 relative z-10">Linha de Montagem</h2>
                        <p className="text-xs text-slate-400 uppercase font-bold relative z-10 mb-6">Utilize peças e ferro refinado para construir novos Extratores.</p>

                        {isCrafting && (
                            <div className="w-full max-w-md h-3 bg-slate-950 mb-8 rounded-full overflow-hidden border border-slate-800 relative z-10">
                                <div className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" style={{width: `${craftProgress}%`}}/>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row w-full gap-4 relative z-10">
                            {/* Extrator Mk1 */}
                            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-black text-white">Extrator Mk1</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Taxa: 1 Minério/Ciclo</p>
                                    </div>
                                    <Bot className="text-indigo-500"/>
                                </div>
                                <div className="flex gap-4 text-xs font-bold mb-6 bg-slate-900 p-3 rounded-xl border border-slate-800">
                                    <span className="text-blue-300">⚙️ 10 Peças</span>
                                    <span className="text-orange-500">🔥 5 Ferro</span>
                                </div>
                                <button 
                                    onClick={() => craftRobot(1)} disabled={isCrafting}
                                    className="mt-auto w-full py-3 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-black uppercase transition-colors disabled:opacity-30 disabled:grayscale"
                                >
                                    Construir Mk1
                                </button>
                            </div>

                            {/* Extrator Mk2 */}
                            <div className="flex-1 bg-slate-950 border border-indigo-900/50 rounded-2xl p-5 flex flex-col shadow-[0_0_15px_rgba(79,70,229,0.1)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-black text-indigo-300">Extrator Mk2</h3>
                                        <p className="text-[10px] text-indigo-500/70 uppercase font-bold mt-1">Taxa: 2 Minérios/Ciclo</p>
                                    </div>
                                    <div className="relative">
                                        <Bot className="text-indigo-400"/>
                                        <Zap size={12} className="absolute -top-1 -right-1 text-yellow-400"/>
                                    </div>
                                </div>
                                <div className="flex gap-4 text-xs font-bold mb-6 bg-slate-900 p-3 rounded-xl border border-slate-800">
                                    <span className="text-blue-300">⚙️ 25 Peças</span>
                                    <span className="text-orange-500">🔥 15 Ferro</span>
                                </div>
                                <button 
                                    onClick={() => craftRobot(2)} disabled={isCrafting}
                                    className="mt-auto w-full py-3 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-black uppercase transition-colors disabled:opacity-30 disabled:grayscale"
                                >
                                    Construir Mk2
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </div>
  );
}