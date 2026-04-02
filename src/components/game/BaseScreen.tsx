"use client";

import React, { useState } from 'react';
import { Activity, Skull, Swords, AlertTriangle, Ghost, Zap, Crosshair, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useGame } from '../../context/GameContext';
import { CoreVisual, TowerVisual, ShieldVisual, UpgradeButton } from './BaseVisuals';

export default function BaseScreen() {
  const { activeDeck, gold, setGold, refinedBars, setRefinedBars, buildings, setBuildings } = useGame();
  
  const [combatState, setCombatState] = useState<{
    status: 'idle' | 'spawning' | 'cards_attack' | 'tower_attack' | 'enemy_attack' | 'victory' | 'defeat';
    enemy: { hp: number, maxHp: number, atk: number } | null;
  }>({ status: 'idle', enemy: null });

  const [shieldHit, setShieldHit] = useState(false);
  const [coreHit, setCoreHit] = useState(false);

  const coreCostGold = buildings.core.level * 1000;
  const coreCostFerro = buildings.core.level * 2;
  const towerCostGold = (buildings.tower.level + 1) * 800;
  const towerCostFerro = (buildings.tower.level + 1) * 1;
  const shieldCostGold = (buildings.shield.level + 1) * 1500;
  const shieldCostOuro = (buildings.shield.level + 1) * 1;

  const deckAtk = activeDeck.reduce((acc: number, c: any) => acc + c.atk, 0);
  const totalAtk = deckAtk + buildings.tower.atk;

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
        case 'Comum': return 'border-slate-400 text-slate-400 bg-slate-400/20';
        case 'Rara': return 'border-blue-400 text-blue-400 bg-blue-400/20';
        case 'Épica': return 'border-purple-400 text-purple-400 bg-purple-400/20';
        default: return 'border-slate-500 text-slate-500';
    }
  }

  const upgradeCore = () => {
    const ferroRefinado = refinedBars.ferro || 0;
    if (gold >= coreCostGold && ferroRefinado >= coreCostFerro) {
      setGold((g: number) => g - coreCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - coreCostFerro }));
      setBuildings((prev: any) => ({ ...prev, core: { level: prev.core.level + 1, maxHp: prev.core.maxHp + 50, hp: prev.core.maxHp + 50 }}));
    } else alert("Recursos insuficientes!");
  };

  const upgradeTower = () => {
    const ferroRefinado = refinedBars.ferro || 0;
    if (gold >= towerCostGold && ferroRefinado >= towerCostFerro) {
      if (buildings.tower.level >= buildings.core.level) return alert("Melhore o Centro de Comando primeiro!");
      setGold((g: number) => g - towerCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - towerCostFerro }));
      setBuildings((prev: any) => ({ ...prev, tower: { level: prev.tower.level + 1, atk: prev.tower.atk + 15 }}));
    } else alert("Recursos insuficientes!");
  };

  const upgradeShield = () => {
    const ouroRefinado = refinedBars.ouro || 0;
    if (gold >= shieldCostGold && ouroRefinado >= shieldCostOuro) {
      if (buildings.shield.level >= buildings.core.level) return alert("Melhore o Centro de Comando primeiro!");
      setGold((g: number) => g - shieldCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ouro: prev.ouro - shieldCostOuro }));
      setBuildings((prev: any) => ({ ...prev, shield: { level: prev.shield.level + 1, max: prev.shield.max + 100, current: prev.shield.max + 100 }}));
    } else alert("Recursos insuficientes (Requer Ouro Refinado)!");
  };

  const simulateInvasion = () => {
    if (combatState.status !== 'idle') return;
    
    const enemyPower = totalAtk > 0 ? Math.floor(totalAtk * (Math.random() * 1.5)) + 15 : 25;
    const newEnemy = { hp: enemyPower, maxHp: enemyPower, atk: enemyPower };
    
    setCombatState({ status: 'spawning', enemy: newEnemy });

    setTimeout(() => {
        setCombatState({ status: 'cards_attack', enemy: newEnemy });
        const hpAfterCards = Math.max(0, newEnemy.hp - deckAtk);
        
        setTimeout(() => {
            setCombatState(prev => ({ ...prev, enemy: { ...prev.enemy!, hp: hpAfterCards } }));
        }, 300); 

        setTimeout(() => {
            if (hpAfterCards <= 0) return finalizeBattle('victory');

            setCombatState(prev => ({ ...prev, status: 'tower_attack' }));
            const hpAfterTower = Math.max(0, hpAfterCards - buildings.tower.atk);
            
            setTimeout(() => {
                setCombatState(prev => ({ ...prev, enemy: { ...prev.enemy!, hp: hpAfterTower } }));
            }, 300);

            setTimeout(() => {
                if (hpAfterTower <= 0) {
                    finalizeBattle('victory');
                } else {
                    setCombatState(prev => ({ ...prev, status: 'enemy_attack' }));
                    setTimeout(() => finalizeBattle('defeat', hpAfterTower), 500);
                }
            }, 1200);

        }, 1500);
    }, 1500);
  };

  const finalizeBattle = (result: 'victory' | 'defeat', damageDealtToBase: number = 0) => {
    setCombatState(prev => ({ ...prev, status: result }));
    
    if (result === 'victory') {
        setGold((g: number) => g + 200);
    } else {
        setBuildings((prev: any) => {
            let newShield = prev.shield.current;
            let newHp = prev.core.hp;

            if (newShield > 0) {
                setShieldHit(true);
                if (damageDealtToBase >= newShield) {
                    const remainder = damageDealtToBase - newShield;
                    newShield = 0;
                    newHp -= remainder;
                    setCoreHit(true);
                } else {
                    newShield -= damageDealtToBase;
                }
            } else {
                newHp -= damageDealtToBase;
                setCoreHit(true);
            }

            return {
                ...prev,
                core: { ...prev.core, hp: Math.max(0, newHp) },
                shield: { ...prev.shield, current: newShield }
            };
        });
    }

    setTimeout(() => {
        setCombatState({ status: 'idle', enemy: null });
        setShieldHit(false);
        setCoreHit(false);
    }, 3000);
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* PAINEL SUPERIOR */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-indigo-950 p-3 rounded-2xl text-indigo-400"><Activity size={24}/></div>
                    <div>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Poder Ofensivo</p>
                        <p className="text-2xl font-black text-white">{totalAtk} <span className="text-sm text-red-500">ATK</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Deck: {deckAtk} | Torre: {buildings.tower.atk}</p>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-center gap-2 relative overflow-hidden">
                <div className="flex justify-between items-end relative z-10">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Integridade da Base</p>
                    <p className="text-sm font-black text-white">{buildings.core.hp} / {buildings.core.maxHp} HP</p>
                </div>
                <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex relative z-10 border border-slate-800">
                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(buildings.core.hp / buildings.core.maxHp) * 100}%` }} />
                    {buildings.shield.max > 0 && (
                        <div className="absolute top-0 left-0 h-full bg-blue-500/80 border-b-2 border-blue-400 transition-all duration-300" style={{ width: `${(buildings.shield.current / buildings.shield.max) * 100}%` }} />
                    )}
                </div>
                {buildings.shield.max > 0 && (
                     <p className="text-[10px] text-blue-400 uppercase font-bold text-right relative z-10 transition-all">Escudo: {buildings.shield.current} pts</p>
                )}
                {coreHit && <div className="absolute inset-0 bg-red-500/20 animate-pulse z-0 pointer-events-none" />}
            </div>
        </div>

        {/* MAPA DA BASE 3D ISOMÉTRICO */}
        <div className="relative h-[450px] w-full bg-slate-950 rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl" style={{ perspective: '1200px' }}>
            
            {combatState.status === 'victory' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 text-emerald-300 px-8 py-3 rounded-full border border-emerald-500 font-black flex items-center gap-2 animate-bounce shadow-[0_0_30px_#10b981]">
                    <Swords size={24}/> INVASÃO REPELIDA! (+200 Ouro)
                </div>
            )}
            {combatState.status === 'defeat' && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-red-300 px-8 py-3 rounded-full border border-red-500 font-black flex items-center gap-2 animate-bounce shadow-[0_0_30px_#ef4444]">
                    <AlertTriangle size={24}/> DEFESA FALHOU! DANO NA BASE!
                </div>
            )}

            <AnimatePresence>
                {combatState.enemy && (
                    <motion.div 
                        initial={{ y: -100, opacity: 0, scale: 0.5 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -100, opacity: 0, scale: 0.5 }}
                        className="absolute top-[8%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
                    >
                        {combatState.status === 'enemy_attack' && (
                             <motion.div 
                                initial={{ height: 0, opacity: 1 }}
                                animate={{ height: 400, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="absolute top-12 left-1/2 -translate-x-1/2 w-8 bg-purple-500 shadow-[0_0_50px_#a855f7] z-0 rounded-full origin-top"
                             />
                        )}

                        <div className="bg-slate-900 border-4 border-purple-600 p-4 rounded-full shadow-[0_0_40px_rgba(168,85,247,0.5)] relative z-10 animate-pulse">
                            <Ghost size={40} className="text-purple-400" />
                        </div>
                        
                        <div className="mt-3 w-32 h-3 bg-slate-900 border border-slate-700 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-purple-500"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(combatState.enemy.hp / combatState.enemy.maxHp) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-purple-300 mt-1 uppercase bg-slate-950/80 px-2 rounded-full">
                            Invasor: {combatState.enemy.hp} HP
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute inset-x-[-200px] top-[20%] h-[800px] origin-top opacity-40"
                 style={{ transform: 'rotateX(45deg)', backgroundImage: 'linear-gradient(#334155 2px, transparent 2px), linear-gradient(90deg, #334155 2px, transparent 2px)', backgroundSize: '60px 60px' }}
            >
                <motion.div animate={{ top: ['-20%', '120%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="absolute w-full h-32 bg-gradient-to-b from-transparent via-indigo-500/20 to-indigo-400/50 border-b-2 border-indigo-400" />
            </div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-12 md:gap-24 pt-24">
                <TowerVisual level={buildings.tower.level} isShooting={combatState.status === 'tower_attack'} />
                <CoreVisual level={buildings.core.level} isHit={coreHit} />
                <ShieldVisual level={buildings.shield.level} isHit={shieldHit} />
            </div>

            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 z-40 flex gap-6">
                {activeDeck.map((card: any, idx: number) => (
                    <motion.div 
                        key={card.id}
                        animate={combatState.status === 'cards_attack' ? { y: -20, scale: 1.1 } : { y: 0, scale: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.1, yoyo: Infinity }}
                        className={`w-20 bg-slate-900 border-2 ${getRarityColor(card.rarity)} rounded-xl p-2 flex flex-col items-center shadow-lg relative`}
                    >
                        {combatState.status === 'cards_attack' && (
                            <motion.div 
                                initial={{ height: 0, opacity: 1 }}
                                animate={{ height: 250, opacity: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 w-1 bg-indigo-400 shadow-[0_0_15px_#818cf8] rounded-full origin-bottom"
                            />
                        )}
                        <span className="text-[8px] font-black uppercase text-center w-full truncate text-slate-300">{card.name}</span>
                        <div className="mt-1 bg-slate-950 px-2 py-0.5 rounded text-[10px] font-bold text-red-400 border border-slate-800">⚔️ {card.atk}</div>
                    </motion.div>
                ))}
            </div>

            <button 
                onClick={simulateInvasion}
                disabled={combatState.status !== 'idle'}
                className="absolute bottom-6 right-6 z-50 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.5)] flex items-center gap-2 transition-colors disabled:opacity-50 disabled:grayscale"
            >
                <Skull size={16}/> {combatState.status !== 'idle' ? 'Em Combate...' : 'Simular Invasão'}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UpgradeButton title="Centro de Comando" level={buildings.core.level} icon={<Zap size={20} />} color="emerald" gold={coreCostGold} resource={coreCostFerro} resourceType="ferro" onClick={upgradeCore} />
          <UpgradeButton title={buildings.tower.level === 0 ? "Construir Torre" : "Melhorar Torre"} level={buildings.tower.level} icon={<Crosshair size={20} />} color="red" gold={towerCostGold} resource={towerCostFerro} resourceType="ferro" onClick={upgradeTower} />
          <UpgradeButton title={buildings.shield.level === 0 ? "Gerador de Escudo" : "Melhorar Escudo"} level={buildings.shield.level} icon={<Hexagon size={20} />} color="blue" gold={shieldCostGold} resource={shieldCostOuro} resourceType="ouro" onClick={upgradeShield} />
        </div>
      </div>
    </div>
  );
}