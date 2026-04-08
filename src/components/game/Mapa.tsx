"use client";
import React, { useState } from 'react';
import { Search, ArrowLeft, Pickaxe, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { AssetCristalAether, AssetEssenciaSombria, AssetFragmentoRunico, AssetPoeiraVital, AssetReliquia } from './GameAssets';

const getOreIcon = (type: string) => { 
    if (type === 'ouro') return <AssetPoeiraVital className="w-8 h-8" />; 
    if (type === 'ferro') return <AssetFragmentoRunico className="w-8 h-8" />; 
    return <AssetEssenciaSombria className="w-8 h-8" />; 
};

export default function Mapa() {
    const { 
        inventory, setInventory, 
        exploreCooldown, setExploreCooldown, gold, setGold 
    } = useGame();

    const [mineLevel, setMineLevel] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [isAtMine, setIsAtMine] = useState(false);
    const [drops, setDrops] = useState<any[]>([]);
    const [manualMining, setManualMining] = useState({ active: false, progress: 0 });

    const triggerDrop = (icon: React.ReactNode) => setDrops(p => [...p, { id: Date.now(), icon, x: (Math.random() - 0.5) * 100 }]);

    const startScan = () => {
        if (exploreCooldown > 0) return;
        setIsScanning(true); setScanProgress(0);
        let curr = 0;
        const t = setInterval(() => {
            curr += 5; setScanProgress(curr);
            if (curr >= 100) {
                clearInterval(t); setIsScanning(false); setIsAtMine(true);
                setExploreCooldown(15);
            }
        }, 100);
    };

    const doManualMine = () => {
        if (manualMining.active) return;
        setManualMining({ active: true, progress: 0 });
        let curr = 0;
        const t = setInterval(() => {
            curr += 10; setManualMining(p => ({ ...p, progress: curr }));
            if (curr >= 100) {
                clearInterval(t); setManualMining({ active: false, progress: 0 });
                rollLoot();
            }
        }, 50);
    };

    const rollLoot = () => {
        const roll = Math.random() * 100;
        if (roll < (10 + mineLevel * 5)) {
            setInventory((p:any) => ({...p, ouro: (p.ouro || 0) + 1}));
            triggerDrop(getOreIcon('ouro'));
        } else if (roll < (40 + mineLevel * 5)) {
            setInventory((p:any) => ({...p, ferro: (p.ferro || 0) + 1}));
            triggerDrop(getOreIcon('ferro'));
        } else {
            setInventory((p:any) => ({...p, carvao: (p.carvao || 0) + 1}));
            triggerDrop(getOreIcon('carvao'));
        }
        if (mineLevel >= 3 && Math.random() > 0.9) {
            setInventory((p:any) => ({...p, item_antigo: (p.item_antigo || 0) + 1}));
            triggerDrop(<AssetReliquia className="w-8 h-8" />);
        }
    };

    const upgradeMine = () => {
        const cost = mineLevel * 1000;
        if (gold >= cost) {
            setGold((g:number) => g - cost);
            setMineLevel(prev => prev + 1);
        } else alert("Poeira Vital insuficiente para expandir a Fenda!");
    };

    return (
        <div className="relative w-full h-full bg-[#020617] overflow-hidden flex flex-col items-center p-4">
            <AnimatePresence mode="wait">
                {!isAtMine ? (
                    <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full w-full max-w-lg">
                        <div className="relative w-64 h-64 mb-12">
                            <div className="absolute inset-0 rounded-full border-4 border-teal-500/30 animate-ping" />
                            <div className="absolute inset-0 rounded-full border-2 border-teal-400/20 flex items-center justify-center">
                                <Search size={80} className={`text-purple-400 ${isScanning ? 'animate-pulse' : ''}`} />
                            </div>
                            {isScanning && (
                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                    <circle cx="128" cy="128" r="120" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeDasharray="754" strokeDashoffset={754 - (754 * scanProgress) / 100} strokeLinecap="round" className="transition-all duration-100" />
                                </svg>
                            )}
                        </div>

                        <button onClick={startScan} disabled={isScanning || exploreCooldown > 0} className="w-full bg-teal-600 border-b-[10px] border-teal-800 py-6 rounded-[2.5rem] font-black uppercase text-xl text-white active:translate-y-2 active:border-b-0 transition-all disabled:opacity-50">
                            {isScanning ? 'Sondando o Véu...' : exploreCooldown > 0 ? `Visão turva: ${exploreCooldown}s` : 'Explorar Selva'}
                        </button>
                    </motion.div>
                ) : (
                    <motion.div key="jazida" initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-2xl flex flex-col gap-6 pt-10">
                        <button onClick={() => setIsAtMine(false)} className="self-start bg-[#042f2e] border-4 border-[#022c22] text-teal-100 px-6 py-2 rounded-xl font-black uppercase text-xs flex items-center gap-2 mb-4 hover:bg-teal-900 transition-colors"><ArrowLeft size={16}/> Retornar</button>

                        <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[3rem] p-8 shadow-2xl border-b-[12px] relative overflow-hidden">
                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-teal-100 uppercase leading-none">Fenda de Cristal</h2>
                                    <p className="text-purple-400 font-bold text-xs mt-1 uppercase">Profundidade: Nv.{mineLevel}</p>
                                </div>
                                <button onClick={upgradeMine} className="bg-purple-600 border-b-4 border-purple-800 px-4 py-2 rounded-xl text-white font-black text-xs uppercase flex items-center gap-2 hover:bg-purple-500">
                                    <TrendingUp size={16}/> Expandir ({mineLevel * 1000} ✨)
                                </button>
                            </div>

                            <div className="h-64 bg-[#020617] rounded-[2rem] border-4 border-black/40 relative flex items-center justify-center overflow-hidden mb-8 shadow-inner">
                                <AssetCristalAether className={`w-40 h-40 drop-shadow-[0_0_20px_rgba(45,212,191,0.2)] ${manualMining.active ? 'scale-95' : 'scale-100'} transition-transform`} />
                                
                                <AnimatePresence>
                                    {drops.map(d => (
                                        <motion.div key={d.id} initial={{ y: 0, opacity: 1 }} animate={{ y: -150, opacity: 0 }} className="absolute z-20" style={{ left: `calc(50% + ${d.x}px)` }} onAnimationComplete={() => setDrops(p => p.filter(x => x.id !== d.id))}>{d.icon}</motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <button onClick={doManualMine} disabled={manualMining.active} className="w-full bg-teal-600 border-b-[10px] border-teal-800 py-6 rounded-3xl font-black uppercase text-white text-xl active:translate-y-2 active:border-b-0 transition-all relative overflow-hidden">
                                {manualMining.active && <div className="absolute inset-0 bg-teal-400/40" style={{ width: `${manualMining.progress}%` }} />}
                                <span className="relative z-10 flex items-center justify-center gap-3"><Pickaxe size={28}/> Colher Fragmentos</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}