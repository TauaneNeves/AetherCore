"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CircleDot, Hexagon, Shield, Boxes, Wrench } from 'lucide-react';

export const CoreVisual = ({ level, isHit }: { level: number, isHit: boolean }) => (
  <motion.div
    animate={{ y: [0, -5, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    className="relative flex flex-col items-center group"
  >
    <motion.div 
      animate={isHit ? { x: [-10, 10, -10, 10, 0], backgroundColor: '#7f1d1d', scale: 0.9 } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`w-24 h-24 ${isHit ? 'bg-red-900 border-red-500' : 'bg-slate-800 border-emerald-800'} border-4 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] relative z-10 transition-colors`}
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-2 border-2 border-dashed border-emerald-500/50 rounded-full" />
      <Zap size={48} className={`${isHit ? 'text-red-400' : 'text-emerald-400'} relative z-10 transition-colors`} />
    </motion.div>
    
    <div className="mt-4 bg-slate-950/90 px-4 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md z-10 shadow-lg">
      <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Core Lv.{level}</span>
    </div>
  </motion.div>
);

export const TowerVisual = ({ level, isShooting }: { level: number, isShooting: boolean }) => {
  const isBuilt = level > 0;
  return (
    <motion.div
      initial={false}
      animate={isBuilt ? { scale: 1, opacity: 1, y: [0, -2, 0] } : { scale: 0.8, opacity: 0.4 }}
      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      className="relative flex flex-col items-center group"
    >
      <div className={`w-14 h-28 ${isBuilt ? 'bg-slate-800' : 'bg-slate-800/50'} border-4 ${isBuilt ? 'border-red-900' : 'border-slate-700'} rounded-t-2xl rounded-b-lg flex flex-col items-center pt-4 shadow-[0_0_25px_rgba(239,68,68,0.3)] relative z-10`}>
        <div className={`w-8 h-8 rounded-full ${isBuilt ? 'bg-slate-950' : 'bg-slate-800'} border-2 ${isBuilt ? 'border-red-600' : 'border-slate-600'} flex items-center justify-center relative overflow-hidden`}>
            {isBuilt && (
              <>
                <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-red-500/20" />
                <CircleDot size={16} className={`${isShooting ? 'text-white' : 'text-red-500'} relative z-10 transition-colors`}/>
              </>
            )}
        </div>
        
        {isShooting && isBuilt && (
            <motion.div 
                initial={{ height: 0, opacity: 1 }}
                animate={{ height: 300, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute top-8 left-1/2 -translate-x-1/2 w-4 bg-red-500 shadow-[0_0_30px_#ef4444] z-0 rounded-full origin-top"
                style={{ transform: 'translate(-50%, 0) rotate(25deg)' }}
            />
        )}
      </div>

      <div className="mt-4 bg-slate-950/90 px-4 py-1.5 rounded-full border border-red-500/30 backdrop-blur-md z-10 shadow-lg">
        <span className="text-[10px] font-black text-red-300 uppercase tracking-widest">
            {isBuilt ? `Torre Lv.${level}` : 'Vazio'}
        </span>
      </div>
    </motion.div>
  );
};

export const ShieldVisual = ({ level, isHit }: { level: number, isHit: boolean }) => {
  const isBuilt = level > 0;
  return (
    <motion.div
      initial={false}
      animate={isBuilt ? { scale: 1, opacity: 1, y: [0, -3, 0] } : { scale: 0.8, opacity: 0.4 }}
      transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      className="relative flex flex-col items-center group"
    >
      <motion.div 
        animate={isHit ? { scale: 1.3, borderColor: '#ef4444', rotate: -45 } : { rotate: -45 }}
        transition={{ duration: 0.2 }}
        className={`w-16 h-16 ${isBuilt ? 'bg-slate-800' : 'bg-slate-800/50'} border-4 ${isBuilt ? (isHit ? 'border-red-500' : 'border-blue-900') : 'border-slate-700'} rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] relative z-10 mt-6 transition-colors`}
      >
        <div className="rotate-45">
            {isBuilt ? <Hexagon size={24} className={isHit ? 'text-red-400' : 'text-blue-400'} /> : <Shield size={20} className="text-slate-600" />}
        </div>
      </motion.div>
      
      {isBuilt && (
        <motion.div 
            animate={isHit ? { scale: [1, 2.5], opacity: [1, 0], borderColor: '#ef4444' } : { scale: [1, 1.8], opacity: [0.8, 0], borderColor: '#60a5fa' }}
            transition={{ duration: isHit ? 0.3 : 2, repeat: isHit ? 0 : Infinity }}
            className="absolute w-20 h-20 border-2 rounded-full top-10 left-1/2 -translate-x-1/2 z-0"
        />
      )}

      <div className="mt-8 bg-slate-950/90 px-4 py-1.5 rounded-full border border-blue-500/30 backdrop-blur-md z-10 shadow-lg">
        <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">
            {isBuilt ? `Escudo Lv.${level}` : 'Vazio'}
        </span>
      </div>
    </motion.div>
  );
};

export const UpgradeButton = ({ title, level, icon, color, gold, resource, resourceType, onClick }: any) => {
    const colorClasses: any = {
        emerald: 'hover:border-emerald-800 text-emerald-400 bg-emerald-950 border-emerald-800 group-hover:text-emerald-400',
        red: 'hover:border-red-800 text-red-400 bg-red-950 border-red-800 group-hover:text-red-400',
        blue: 'hover:border-blue-800 text-blue-400 bg-blue-950 border-blue-800 group-hover:text-blue-400',
    };

    return (
        <button onClick={onClick} className={`bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between transition-all group hover:scale-[1.02] ${colorClasses[color].split(' ')[0]}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 ${colorClasses[color].split(' ').slice(1,4).join(' ')}`}>
                    {icon}
                </div>
                <div className="text-left">
                    <h3 className="text-xs font-black uppercase text-white">{title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{level === 0 ? 'Não Construído' : `Nível Atual: ${level}`}</p>
                </div>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
                <div className="flex gap-3 text-[10px] font-bold tabular-nums">
                    <span className="text-yellow-500 flex items-center gap-1">💰 {gold.toLocaleString()}</span>
                    <span className="text-slate-300 flex items-center gap-1">
                        <Boxes size={10}/> {resource} <span className={resourceType === 'ouro' ? 'text-yellow-500' : 'text-slate-400'}>{resourceType === 'ouro' ? '🟡' : '⚪'}</span>
                    </span>
                </div>
                <Wrench size={14} className={`text-slate-600 transition-colors ${colorClasses[color].split(' ').pop()}`}/>
            </div>
        </button>
    )
}