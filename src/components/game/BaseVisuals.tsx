"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { AssetTowerBuilding, AssetCoreBuilding, AssetForcefieldBuilding, AssetPoeiraVital, AssetFragmentoRunico } from './GameAssets';

export const CoreVisual = ({ level, isHit }: { level: number, isHit: boolean }) => (
  <motion.div animate={isHit ? { x: [-10, 10, -10, 0] } : {}} className="relative flex flex-col items-center">
    <AssetCoreBuilding className="w-32 h-32 drop-shadow-[0_0_25px_rgba(168,85,247,0.4)]" />
    <div className="mt-4 bg-[#022c22] px-4 py-1 rounded-full border-2 border-[#064e3b] text-[10px] font-black text-purple-400 uppercase tracking-widest shadow-lg">
        NÚCLEO VITAL NV.{level}
    </div>
  </motion.div>
);

export const TowerVisual = ({ level, isShooting }: { level: number, isShooting: boolean }) => (
  <motion.div 
    animate={isShooting ? { y: [0, 8, 0], scale: [1, 0.98, 1] } : {}} 
    transition={{ duration: 0.1, repeat: isShooting ? Infinity : 0 }} 
    className="relative flex flex-col items-center"
  >
    {level > 0 ? (
      <div className="relative">
         {isShooting && (
             <motion.div 
                initial={{ opacity: 0, scale: 0 }} 
                animate={{ opacity: [0, 1, 0], scale: [0, 2.5, 0] }} 
                className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl pointer-events-none drop-shadow-lg"
             >
                ✨
             </motion.div>
         )}
         <AssetTowerBuilding className="w-32 h-32 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]" />
      </div>
    ) : (
      <div className="w-24 h-24 bg-[#115e59]/20 rounded-3xl border-4 border-dashed border-[#0f766e] flex items-center justify-center text-[#0f766e] font-black uppercase text-[10px]">
        Slot Obelisco
      </div>
    )}
    <div className="mt-4 bg-[#022c22] px-4 py-1 rounded-full border-2 border-[#064e3b] text-[10px] font-black text-teal-400 uppercase tracking-widest shadow-lg">
      {level > 0 ? `Obelisco Nv.${level}` : 'Solo Fértil'}
    </div>
  </motion.div>
);

export const ShieldVisual = ({ level, isHit }: { level: number, isHit: boolean }) => (
  <motion.div animate={isHit ? { scale: [1, 1.1, 1] } : {}} className="relative flex flex-col items-center">
    {level > 0 ? (
      <AssetForcefieldBuilding className="w-28 h-28 drop-shadow-[0_0_20px_rgba(45,212,191,0.5)]" />
    ) : (
      <div className="w-24 h-24 bg-[#115e59]/20 rounded-3xl border-4 border-dashed border-[#0f766e] flex items-center justify-center text-[#0f766e] font-black uppercase text-[10px]">
        Slot Barreira
      </div>
    )}
    <div className="mt-4 bg-[#022c22] px-4 py-1 rounded-full border-2 border-[#064e3b] text-[10px] font-black text-teal-300 uppercase tracking-widest shadow-lg">
      {level > 0 ? `Barreira Nv.${level}` : 'Solo Fértil'}
    </div>
  </motion.div>
);

export const UpgradeButton = ({ title, level, iconType, color, gold, resource, resourceType, onClick }: any) => {
  const colors: any = {
    emerald: 'bg-purple-800 border-purple-950 shadow-[0_6px_0_#3b0764] text-purple-200',
    red: 'bg-teal-800 border-teal-950 shadow-[0_6px_0_#042f2e] text-teal-200',
    blue: 'bg-cyan-800 border-cyan-950 shadow-[0_6px_0_#164e63] text-cyan-200',
  };

  return (
    <button 
      onClick={onClick} 
      className={`${colors[color]} border-4 p-4 rounded-[2rem] active:translate-y-1 active:shadow-none transition-all flex flex-col items-center w-full group`}
    >
      <span className="font-black uppercase text-[11px] mb-3 tracking-tighter drop-shadow-md">{title}</span>
      <div className="bg-black/40 p-3 rounded-2xl text-[10px] font-black flex items-center gap-3 border border-white/10 text-white">
        <span className="flex items-center gap-1"><AssetPoeiraVital className="w-4 h-4"/> {gold}</span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1"><AssetFragmentoRunico className="w-4 h-4"/> {resource}</span>
      </div>
      <Leaf size={14} className="mt-3 opacity-50 group-hover:rotate-12 transition-transform" />
    </button>
  );
};