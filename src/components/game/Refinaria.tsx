"use client";
import React, { useState } from 'react';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { AssetEssenciaSombria, AssetFragmentoRunico, AssetPoeiraVital, AssetNucleoGolem, AssetCristalAether } from './GameAssets';

export default function Refinaria() {
  const { inventory, setInventory, refinedBars, setRefinedBars, setMiningRobots } = useGame();
  const [activeTab, setActiveTab] = useState<'transmutacao' | 'animacao'>('transmutacao');
  const [isRefining, setIsRefining] = useState(false);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&radius=20`;

  const processForge = (type: 'ferro' | 'ouro') => {
      const oreCost = 5;
      const fuelCost = type === 'ouro' ? 2 : 1;

      if (inventory[type] >= oreCost && inventory.carvao >= fuelCost) {
          setIsRefining(true);
          setTimeout(() => {
            setInventory((prev: any) => ({ ...prev, carvao: prev.carvao - fuelCost, [type]: prev[type] - oreCost }));
            setRefinedBars((prev: any) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
            setIsRefining(false);
          }, 1000); 
      } else { alert("Recursos brutos insuficientes para a transmutação!"); }
  };

  const craftRobot = (tier: number) => {
      const pecasReq = tier === 1 ? 10 : 25;
      const ferroReq = tier === 1 ? 5 : 15;

      if (inventory.pecas_robo >= pecasReq && (refinedBars.ferro || 0) >= ferroReq) {
          setIsCrafting(true);
          setCraftProgress(0);
          
          let currentProgress = 0;
          const t = setInterval(() => {
              currentProgress += 5;
              setCraftProgress(currentProgress);
              
              if (currentProgress >= 100) {
                  clearInterval(t); 
                  setIsCrafting(false);
                  setInventory((prev: any) => ({ ...prev, pecas_robo: prev.pecas_robo - pecasReq }));
                  setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - ferroReq }));
                  const newRobot = { id: `golem_${Date.now()}_${Math.random()}`, name: `Golem Colhedor Mk${tier}`, rate: tier };
                  setMiningRobots((prev: any) => [...prev, newRobot]);
              }
          }, 100);
      } else { alert("Materiais de invocação insuficientes!"); }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        <div className="flex gap-4 w-full">
            <button onClick={() => setActiveTab('transmutacao')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${activeTab === 'transmutacao' ? 'bg-purple-800 border-purple-500 text-purple-100 border-b-8 -translate-y-1 shadow-lg' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><Flame size={20} strokeWidth={3}/> Transmutação</button>
            <button onClick={() => setActiveTab('animacao')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${activeTab === 'animacao' ? 'bg-teal-800 border-teal-500 text-teal-100 border-b-8 -translate-y-1 shadow-lg' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><Sparkles size={20} strokeWidth={3}/> Animação</button>
        </div>

        <AnimatePresence mode="wait">
            {activeTab === 'transmutacao' && (
                <motion.div key="transmutacao" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-6">
                    <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center relative overflow-hidden">
                        <Flame size={64} className={`mb-6 ${isRefining ? 'text-purple-400 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'text-[#0f766e]'}`} strokeWidth={3} />
                        <h2 className="text-2xl font-black uppercase text-teal-100 mb-2">Forja Etérea</h2>
                        <p className="text-sm text-teal-600 font-bold mb-8 text-center">Utilize essência para purificar recursos brutos em formas concentradas de energia.</p>

                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <div className="flex-1 bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-6 flex flex-col items-center justify-between shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-[#042f2e] p-2 rounded-xl border-2 border-[#0f766e]"><AssetFragmentoRunico className="w-8 h-8" /></div>
                                    <span className="text-teal-100 font-black text-xl">5</span>
                                    <span className="text-teal-700 font-black text-xl">+</span>
                                    <div className="bg-[#042f2e] p-2 rounded-xl border-2 border-[#0f766e]"><AssetEssenciaSombria className="w-8 h-8" /></div>
                                    <span className="text-teal-100 font-black text-xl">1</span>
                                    <ArrowRight className="text-teal-500 mx-2" strokeWidth={3}/>
                                    <div className="bg-teal-900 p-2 rounded-xl shadow-[0_0_15px_rgba(45,212,191,0.4)] border-4 border-teal-600"><AssetFragmentoRunico className="w-10 h-10 drop-shadow-md" /></div>
                                </div>
                                <h3 className="text-base font-black text-teal-200 mb-4 uppercase">Placa Rúnica</h3>
                                <button onClick={() => processForge('ferro')} disabled={isRefining} className="w-full py-4 bg-teal-600 border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-md disabled:opacity-50 disabled:grayscale">Transmutar</button>
                            </div>

                            <div className="flex-1 bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-6 flex flex-col items-center justify-between shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-[#042f2e] p-2 rounded-xl border-2 border-[#0f766e]"><AssetCristalAether className="w-8 h-8" /></div>
                                    <span className="text-teal-100 font-black text-xl">5</span>
                                    <span className="text-teal-700 font-black text-xl">+</span>
                                    <div className="bg-[#042f2e] p-2 rounded-xl border-2 border-[#0f766e]"><AssetEssenciaSombria className="w-8 h-8" /></div>
                                    <span className="text-teal-100 font-black text-xl">2</span>
                                    <ArrowRight className="text-teal-500 mx-2" strokeWidth={3}/>
                                    <div className="bg-purple-900 p-2 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] border-4 border-purple-600"><AssetPoeiraVital className="w-10 h-10 drop-shadow-md" /></div>
                                </div>
                                <h3 className="text-base font-black text-purple-300 mb-4 uppercase drop-shadow-md">Poeira Refinada</h3>
                                <button onClick={() => processForge('ouro')} disabled={isRefining} className="w-full py-4 bg-purple-600 border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-md disabled:opacity-50 disabled:grayscale">Purificar</button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'animacao' && (
                <motion.div key="animacao" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-6">
                    <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center">
                        <Sparkles size={64} className={`mb-6 ${isCrafting ? 'text-teal-300 animate-pulse drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]' : 'text-[#0f766e]'}`} strokeWidth={3}/>
                        <h2 className="text-2xl font-black uppercase text-teal-100 mb-2">Câmara de Animação</h2>
                        <p className="text-sm text-teal-600 font-bold mb-6 text-center">Dê vida à pedra e crie Golens para automatizar as suas colheitas.</p>

                        {isCrafting && (
                            <div className="w-full max-w-md h-4 bg-[#022c22] mb-8 rounded-full overflow-hidden border-4 border-[#064e3b]">
                                <div className="h-full bg-teal-400" style={{width: `${craftProgress}%`}}/>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row w-full gap-4">
                            <div className="flex-1 bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-6 flex flex-col shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                    <div><h3 className="text-base font-black text-teal-100 uppercase">Golem Menor</h3><p className="text-xs text-teal-500 uppercase font-bold mt-1">Taxa: 1 / Ciclo</p></div>
                                    <img src={getAvatarUrl('Golem Mk1')} className="w-16 h-16 bg-black/20 rounded-2xl border-2 border-black/10 opacity-80" alt="Mk1"/>
                                </div>
                                <div className="flex gap-4 text-base font-black mb-6 bg-[#042f2e] p-4 rounded-2xl border-2 border-[#0f766e] justify-center items-center">
                                    <span className="text-teal-100 flex items-center gap-2"><AssetNucleoGolem className="w-5 h-5" /> 10</span>
                                    <span className="text-teal-100 flex items-center gap-2"><AssetFragmentoRunico className="w-5 h-5 opacity-70" /> 5</span>
                                </div>
                                <button onClick={() => craftRobot(1)} disabled={isCrafting} className="mt-auto w-full py-4 bg-teal-600 border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-md disabled:opacity-50 disabled:grayscale">Animar Golem</button>
                            </div>

                            <div className="flex-1 bg-[#022c22] border-4 border-purple-900/50 rounded-[2rem] p-6 flex flex-col shadow-[0_0_20px_rgba(168,85,247,0.1)] relative overflow-hidden">
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div><h3 className="text-base font-black text-purple-300 uppercase">Golem Ancestral</h3><p className="text-xs text-purple-500 uppercase font-bold mt-1">Taxa: 2 / Ciclo</p></div>
                                    <img src={getAvatarUrl('Golem Mk2')} className="w-16 h-16 bg-black/20 rounded-2xl border-2 border-black/10 opacity-80" alt="Mk2"/>
                                </div>
                                <div className="flex gap-4 text-base font-black mb-6 bg-[#042f2e] p-4 rounded-2xl border-2 border-purple-900/50 justify-center items-center relative z-10">
                                    <span className="text-teal-100 flex items-center gap-2"><AssetNucleoGolem className="w-5 h-5" /> 25</span>
                                    <span className="text-teal-100 flex items-center gap-2"><AssetFragmentoRunico className="w-5 h-5 opacity-70" /> 15</span>
                                </div>
                                <button onClick={() => craftRobot(2)} disabled={isCrafting} className="mt-auto w-full py-4 bg-purple-600 border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-md disabled:opacity-50 disabled:grayscale relative z-10">Animar Ancestral</button>
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