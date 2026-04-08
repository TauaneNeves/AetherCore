"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Skull, Hexagon, Beaker, ShieldPlus, Radar, TrendingUp, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { CoreVisual, TowerVisual, ShieldVisual, UpgradeButton } from './BaseVisuals';
import { AssetReliquia, AssetFire, AssetWater, AssetEarthElem, AssetAir, AssetFragmentoRunico, AssetPoeiraVital } from './GameAssets';

const ELEMENT_ADVANTAGE: Record<string, string> = { 'Fogo': 'Ar', 'Ar': 'Terra', 'Terra': 'Água', 'Água': 'Fogo' };

const getElementIcon = (element: string) => {
    switch(element) {
        case 'Fogo': return <AssetFire className="w-4 h-4" />;
        case 'Água': return <AssetWater className="w-4 h-4" />;
        case 'Terra': return <AssetEarthElem className="w-4 h-4" />;
        case 'Ar': return <AssetAir className="w-4 h-4" />;
        default: return null;
    }
};

export default function BaseScreen() {
  const { 
      activeDeck, gold, setGold, refinedBars, setRefinedBars, 
      buildings, setBuildings, inventory, setInventory, 
      research, setResearch, wave, setWave, 
      soulShards, ascendCore, offlineReport, setOfflineReport 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'comando' | 'laboratorio'>('comando');
  const [combatState, setCombatState] = useState<any>({ status: 'idle', enemy: null, feedback: '' });
  const [shieldHit, setShieldHit] = useState(false);
  const [coreHit, setCoreHit] = useState(false);
  
  // ESTADOS DAS ULTIMATES
  const [cardCharges, setCardCharges] = useState<number[]>([0, 0, 0]);

  const coreCostGold = buildings.core.level * 1000;
  const coreCostFerro = buildings.core.level * 2;
  const towerCostGold = (buildings.tower.level + 1) * 800;
  const towerCostFerro = (buildings.tower.level + 1) * 1;
  const shieldCostGold = (buildings.shield.level + 1) * 1500;
  const shieldCostOuro = (buildings.shield.level + 1) * 1;

  const radarCost = (research.radarCooldown + 1) * 2;
  const minerCost = (research.minerBonus + 1) * 3;
  const coreBonusCost = (research.coreBonus + 1) * 2;

  // DANO TOTAL: Base + Obelisco + Multiplicador da Ascensão (Cada Estilhaço = +10% Dano)
  const baseDeckAtk = activeDeck.reduce((acc: number, c: any) => acc + c.atk, 0);
  const multiplier = 1 + (soulShards * 0.1);
  const totalAtk = Math.floor((baseDeckAtk + buildings.tower.atk) * multiplier);

  const getRarityColor = (rarity: string) => {
    switch(rarity) {
        case 'Comum': return 'bg-[#0f766e] border-[#042f2e] text-teal-100';
        case 'Rara': return 'bg-[#0ea5e9] border-[#075985] text-sky-100';
        case 'Épica': return 'bg-[#a855f7] border-[#581c87] text-purple-100';
        case 'Lendária': return 'bg-[#f59e0b] border-[#92400e] text-amber-100';
        default: return 'bg-slate-400 border-slate-600 text-slate-900';
    }
  }

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&radius=20`;
  const getEnemyUrl = (seed: string, isBoss: boolean) => `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&backgroundColor=${isBoss ? '831843' : '312e81'}&radius=20`;

  // RECUPERAÇÃO DAS ULTIMATES FORA DE COMBATE
  useEffect(() => {
      if (combatState.status === 'idle') {
          const t = setInterval(() => {
              setCardCharges(prev => prev.map(c => Math.min(100, c + 5)));
          }, 500);
          return () => clearInterval(t);
      }
  }, [combatState.status]);

  const upgradeCore = () => {
    const ferroRefinado = refinedBars.ferro || 0;
    if (gold >= coreCostGold && ferroRefinado >= coreCostFerro) {
      setGold((g: number) => g - coreCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - coreCostFerro }));
      setBuildings((prev: any) => ({ ...prev, core: { level: prev.core.level + 1, maxHp: prev.core.maxHp + 50, hp: prev.core.hp + 50 }}));
    } else alert("Recursos insuficientes!");
  };

  const upgradeTower = () => {
    const ferroRefinado = refinedBars.ferro || 0;
    if (gold >= towerCostGold && ferroRefinado >= towerCostFerro) {
      if (buildings.tower.level >= buildings.core.level) return alert("Fortaleça o Núcleo Vital primeiro!");
      setGold((g: number) => g - towerCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ferro: prev.ferro - towerCostFerro }));
      setBuildings((prev: any) => ({ ...prev, tower: { level: prev.tower.level + 1, atk: prev.tower.atk + 15 }}));
    } else alert("Recursos insuficientes!");
  };

  const upgradeShield = () => {
    const ouroRefinado = refinedBars.ouro || 0;
    if (gold >= shieldCostGold && ouroRefinado >= shieldCostOuro) {
      if (buildings.shield.level >= buildings.core.level) return alert("Fortaleça o Núcleo Vital primeiro!");
      setGold((g: number) => g - shieldCostGold);
      setRefinedBars((prev: any) => ({ ...prev, ouro: prev.ouro - shieldCostOuro }));
      setBuildings((prev: any) => ({ ...prev, shield: { level: prev.shield.level + 1, max: prev.shield.max + 100, current: prev.shield.current + 100 }}));
    } else alert("Recursos insuficientes!");
  };

  const researchTech = (type: 'radar' | 'miner' | 'core') => {
      if (type === 'radar' && inventory.item_antigo >= radarCost) {
          setInventory((prev:any) => ({...prev, item_antigo: prev.item_antigo - radarCost}));
          setResearch((prev:any) => ({...prev, radarCooldown: prev.radarCooldown + 1}));
      } else if (type === 'miner' && inventory.item_antigo >= minerCost) {
          setInventory((prev:any) => ({...prev, item_antigo: prev.item_antigo - minerCost}));
          setResearch((prev:any) => ({...prev, minerBonus: prev.minerBonus + 1}));
      } else if (type === 'core' && inventory.item_antigo >= coreBonusCost) {
          setInventory((prev:any) => ({...prev, item_antigo: prev.item_antigo - coreBonusCost}));
          setResearch((prev:any) => ({...prev, coreBonus: prev.coreBonus + 1}));
          setBuildings((prev: any) => ({
              ...prev,
              core: { ...prev.core, maxHp: prev.core.maxHp + 100, hp: prev.core.hp + 100 }
          }));
      } else { alert("Relíquias insuficientes!"); }
  };

  const simulateInvasion = () => {
    if (combatState.status !== 'idle') return;
    
    const elements = ['Fogo', 'Água', 'Terra', 'Ar'];
    const enemyElement = elements[Math.floor(Math.random() * elements.length)];
    
    const isBoss = wave % 5 === 0;
    const basePower = totalAtk > 0 ? Math.floor(totalAtk * (Math.random() * 1.5)) + (wave * 15) : 25;
    const enemyPower = isBoss ? basePower * 3 : basePower;

    const newEnemy = { 
        hp: enemyPower, maxHp: enemyPower, atk: enemyPower, 
        seed: `Void_${Math.random()}`, element: enemyElement, isBoss 
    };
    
    setCombatState({ status: 'spawning', enemy: newEnemy, feedback: isBoss ? 'ALERTA: LORD DA CORRUPÇÃO!' : '' });

    let effectiveDeckAtk = 0;
    activeDeck.forEach((card: any) => {
        let advMult = 1.0;
        if (ELEMENT_ADVANTAGE[card.element] === enemyElement) advMult = 1.5; 
        else if (ELEMENT_ADVANTAGE[enemyElement] === card.element) advMult = 0.8; 
        effectiveDeckAtk += Math.floor((card.atk * multiplier) * advMult);
    });

    setTimeout(() => {
        setCombatState({ status: 'cards_attack', enemy: newEnemy, feedback: '' });
        const hpAfterCards = Math.max(0, newEnemy.hp - effectiveDeckAtk);
        setTimeout(() => { setCombatState(prev => ({ ...prev, enemy: { ...prev.enemy!, hp: hpAfterCards } })); }, 300); 

        setTimeout(() => {
            if (hpAfterCards <= 0) return finalizeBattle('victory');
            
            setCombatState(prev => ({ ...prev, status: 'tower_attack', feedback: '' }));
            const hpAfterTower = Math.max(0, hpAfterCards - (buildings.tower.atk * multiplier));
            setTimeout(() => { setCombatState(prev => ({ ...prev, enemy: { ...prev.enemy!, hp: hpAfterTower } })); }, 300);

            setTimeout(() => {
                if (hpAfterTower <= 0) finalizeBattle('victory');
                else {
                    setCombatState(prev => ({ ...prev, status: 'enemy_attack' }));
                    setTimeout(() => finalizeBattle('defeat', hpAfterTower), 500);
                }
            }, 1200);
        }, 1500);
    }, 1500);
  };

  // LANÇAR ULTIMATE
  const triggerUltimate = (idx: number) => {
      if (combatState.status === 'idle' || cardCharges[idx] < 100 || !combatState.enemy) return;
      
      const card = activeDeck[idx];
      setCardCharges(prev => { const n = [...prev]; n[idx] = 0; return n; });
      setCombatState(prev => ({ ...prev, feedback: `${card.name} lançou Magia Suprema!` }));
      
      const ultDamage = Math.floor((card.atk * multiplier) * 3); // Ultimate dá 3x de Dano
      const newHp = Math.max(0, combatState.enemy.hp - ultDamage);
      
      setCombatState(prev => ({ ...prev, enemy: { ...prev.enemy, hp: newHp } }));
      if (newHp <= 0) {
          setTimeout(() => finalizeBattle('victory'), 500);
      }
  };

  const finalizeBattle = (result: 'victory' | 'defeat', damageDealtToBase: number = 0) => {
    let isGameOver = false;

    if (result === 'victory') {
        const isBoss = combatState.enemy?.isBoss;
        setCombatState(prev => ({ ...prev, status: 'victory', feedback: isBoss ? 'CHEFÃO DERROTADO! (+Relíquia)' : '' }));
        setGold((g: number) => g + (isBoss ? 1000 : 200));
        setWave(w => w + 1);
        if (isBoss) {
            setInventory((prev:any) => ({...prev, item_antigo: (prev.item_antigo || 0) + 1}));
        }
    } else {
        let newShield = buildings.shield.current;
        let newHp = buildings.core.hp;
        
        if (newShield > 0) {
            setShieldHit(true);
            if (damageDealtToBase >= newShield) {
                const remainder = damageDealtToBase - newShield;
                newShield = 0; newHp -= remainder; setCoreHit(true);
            } else { newShield -= damageDealtToBase; }
        } else { newHp -= damageDealtToBase; setCoreHit(true); }

        const finalHp = Math.max(0, newHp);
        isGameOver = finalHp <= 0;

        setBuildings((prev: any) => ({ ...prev, core: { ...prev.core, hp: finalHp }, shield: { ...prev.shield, current: newShield } }));
        setCombatState(prev => ({ ...prev, status: isGameOver ? 'defeat' : 'damage_taken', feedback: '' }));
    }

    setTimeout(() => { 
        setCombatState({ status: 'idle', enemy: null, feedback: '' }); 
        setShieldHit(false); setCoreHit(false); 

        if (isGameOver) {
            setBuildings((prev: any) => ({ ...prev, core: { ...prev.core, hp: prev.core.maxHp } }));
            alert("SISTEMA CRÍTICO! O seu Núcleo foi destruído. Suas defesas falharam na Onda " + wave + ".");
        }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      
      {/* POPUP DE PROGRESSO OFFLINE */}
      <AnimatePresence>
          {offlineReport && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#042f2e] border-4 border-[#022c22] rounded-[3rem] p-8 max-w-sm w-full flex flex-col items-center shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#2dd4bf 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                      <Clock size={48} className="text-teal-400 mb-4 animate-pulse relative z-10" />
                      <h2 className="text-2xl font-black text-white uppercase text-center relative z-10">Você Retornou</h2>
                      <p className="text-xs font-bold text-teal-600 text-center mb-6 relative z-10">O seu Núcleo pulsou por {formatTime(offlineReport.tempo)} enquanto esteve ausente. Os Golens recolheram:</p>
                      
                      <div className="flex flex-col gap-3 w-full bg-[#022c22] border-2 border-[#064e3b] rounded-2xl p-4 mb-6 relative z-10">
                          <div className="flex items-center justify-between font-black"><span className="flex items-center gap-2 text-teal-400"><AssetPoeiraVital className="w-5 h-5"/> Poeira Etérea</span> <span className="text-white">+{offlineReport.ouro}</span></div>
                          <div className="flex items-center justify-between font-black"><span className="flex items-center gap-2 text-teal-400"><AssetFragmentoRunico className="w-5 h-5"/> Fragmentos</span> <span className="text-white">+{offlineReport.ferro}</span></div>
                          <div className="flex items-center justify-between font-black"><span className="flex items-center gap-2 text-teal-400"><AssetEarthElem className="w-5 h-5"/> Essência Sombria</span> <span className="text-white">+{offlineReport.carvao}</span></div>
                      </div>

                      <button onClick={() => setOfflineReport(null)} className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-sm border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 relative z-10">Coletar Tudo</button>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      <div className="w-full max-w-5xl flex flex-col gap-6">
        <div className="flex gap-4 w-full">
            <button onClick={() => setActiveTab('comando')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${activeTab === 'comando' ? 'bg-purple-800 border-purple-500 text-purple-100 border-b-8 -translate-y-1 shadow-lg' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><Hexagon size={20} strokeWidth={3}/> Santuário</button>
            <button onClick={() => setActiveTab('laboratorio')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${activeTab === 'laboratorio' ? 'bg-teal-800 border-teal-500 text-teal-100 border-b-8 -translate-y-1 shadow-lg' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><Beaker size={20} strokeWidth={3}/> Altar Arcano</button>
        </div>

        <AnimatePresence mode="wait">
            {activeTab === 'comando' && (
                <motion.div key="comando" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 bg-[#042f2e] border-4 border-[#022c22] rounded-[2rem] p-5 shadow-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-900 border-2 border-purple-500 p-3 rounded-2xl text-purple-300 shadow-sm"><Activity size={24} strokeWidth={3}/></div>
                                <div><p className="text-[11px] font-black text-teal-600 uppercase tracking-widest">Poder Místico Base {soulShards > 0 && <span className="text-purple-400 bg-purple-900/50 px-2 rounded ml-1">+{soulShards * 10}%</span>}</p><p className="text-3xl font-black text-teal-100 drop-shadow-sm">{totalAtk} <span className="text-sm text-purple-400">ATK</span></p></div>
                            </div>
                        </div>
                        <div className="flex-1 bg-[#042f2e] border-4 border-[#022c22] rounded-[2rem] p-5 shadow-lg flex flex-col justify-center gap-2 relative overflow-hidden">
                            <div className="flex justify-between items-end relative z-10"><p className="text-[11px] font-black text-teal-600 uppercase tracking-widest">Integridade Vital</p><p className="text-base font-black text-teal-100 drop-shadow-sm">{buildings.core.hp} / {buildings.core.maxHp} HP</p></div>
                            <div className="h-5 bg-[#022c22] border-2 border-[#064e3b] rounded-full overflow-hidden flex relative z-10">
                                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(buildings.core.hp / buildings.core.maxHp) * 100}%` }} />
                                {buildings.shield.max > 0 && <div className="absolute top-0 left-0 h-full bg-cyan-400 border-b-4 border-cyan-500 transition-all duration-300" style={{ width: `${(buildings.shield.current / buildings.shield.max) * 100}%` }} />}
                            </div>
                            {buildings.shield.max > 0 && <p className="text-[10px] text-cyan-300 uppercase font-black text-right relative z-10">Barreira: {buildings.shield.current} pts</p>}
                            {coreHit && <div className="absolute inset-0 bg-red-500/30 animate-pulse z-0 pointer-events-none" />}
                        </div>
                    </div>

                    <div className="relative h-[450px] w-full bg-[#042f2e] border-4 border-[#022c22] border-b-[12px] rounded-[2.5rem] overflow-hidden shadow-xl" style={{ perspective: '1200px' }}>
                        
                        {/* CONTADOR DE ONDAS */}
                        <div className="absolute top-4 left-4 z-50 bg-[#022c22] border-2 border-[#064e3b] px-4 py-2 rounded-2xl flex flex-col items-center shadow-lg">
                            <span className="text-[9px] text-teal-600 font-black uppercase">Onda Atual</span>
                            <span className="text-xl text-white font-black">{wave}</span>
                        </div>
                        
                        {/* ASCENSÃO (Se onda > 5) */}
                        {wave > 5 && combatState.status === 'idle' && (
                            <button onClick={ascendCore} className="absolute top-4 right-4 z-50 bg-fuchsia-600 text-white border-2 border-fuchsia-400 px-4 py-2 rounded-2xl font-black text-[10px] uppercase shadow-[0_0_15px_rgba(192,38,211,0.6)] animate-pulse flex items-center gap-1 hover:scale-105 transition-transform">
                                <Zap size={14} /> Sobrecarga
                            </button>
                        )}

                        {combatState.status === 'victory' && <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-emerald-950 px-8 py-3 rounded-[2rem] border-4 border-emerald-700 border-b-8 font-black flex items-center gap-2 animate-bounce shadow-xl">VITÓRIA! (+Ouro)</div>}
                        {combatState.status === 'damage_taken' && <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-amber-950 px-8 py-3 rounded-[2rem] border-4 border-amber-700 border-b-8 font-black flex items-center gap-2 animate-bounce shadow-xl">NÚCLEO ATINGIDO!</div>}
                        {combatState.status === 'defeat' && <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-8 py-3 rounded-[2rem] border-4 border-rose-800 border-b-8 font-black flex items-center gap-2 animate-bounce shadow-xl">NÚCLEO DESTRUÍDO!</div>}
                        
                        {combatState.feedback && (
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute top-32 left-1/2 -translate-x-1/2 z-50 bg-purple-600 text-white px-4 py-1 rounded-full border-2 border-purple-400 font-black text-xs shadow-[0_0_20px_rgba(168,85,247,0.8)]">
                                {combatState.feedback}
                            </motion.div>
                        )}

                        <AnimatePresence>
                            {combatState.enemy && (
                                <motion.div initial={{ y: -100, opacity: 0, scale: 0.5 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -100, opacity: 0, scale: 0.5 }} className="absolute top-[8%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
                                    {combatState.status === 'enemy_attack' && <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: 400, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="absolute top-12 left-1/2 -translate-x-1/2 w-8 bg-indigo-500 border-x-4 border-indigo-700 z-0 rounded-full origin-top" />}
                                    <div className={`bg-indigo-900 border-4 border-indigo-700 border-b-8 p-1 rounded-[2rem] shadow-xl relative z-10 animate-bounce ${combatState.enemy.isBoss ? 'scale-125 border-rose-600 bg-rose-950 shadow-[0_0_30px_rgba(225,29,72,0.6)]' : ''}`}>
                                        <div className="absolute -top-3 -right-3 bg-[#022c22] border-2 border-[#0f766e] rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md">
                                            {getElementIcon(combatState.enemy.element)}
                                        </div>
                                        <img src={getEnemyUrl(combatState.enemy.seed, combatState.enemy.isBoss)} alt="Invasor" className="w-16 h-16" />
                                    </div>
                                    <div className={`mt-4 w-32 h-4 bg-[#022c22] border-2 border-[#064e3b] rounded-full overflow-hidden ${combatState.enemy.isBoss ? 'mt-8 w-40' : ''}`}>
                                        <motion.div className="h-full bg-rose-500" initial={{ width: '100%' }} animate={{ width: `${(combatState.enemy.hp / combatState.enemy.maxHp) * 100}%` }} transition={{ duration: 0.3 }}/>
                                    </div>
                                    <span className={`text-[10px] font-black text-teal-100 mt-2 uppercase bg-[#022c22] px-3 py-1 rounded-full border-2 border-[#064e3b] ${combatState.enemy.isBoss ? 'text-rose-400 border-rose-900' : ''}`}>
                                        {combatState.enemy.isBoss ? 'Lorde Sombrio: ' : 'Corrupção: '} {combatState.enemy.hp} HP
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="absolute inset-0 z-10 flex items-center justify-center gap-12 md:gap-24 pt-24">
                            <TowerVisual level={buildings.tower.level} isShooting={combatState.status === 'tower_attack'} />
                            <CoreVisual level={buildings.core.level} isHit={coreHit} />
                            <ShieldVisual level={buildings.shield.level} isHit={shieldHit} />
                        </div>

                        {/* CARTAS COM SISTEMA DE ULTIMATE */}
                        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 z-40 flex gap-4">
                            {activeDeck.map((card: any, idx: number) => {
                                const isReady = cardCharges[idx] >= 100;
                                const isCombat = combatState.status !== 'idle' && combatState.status !== 'victory' && combatState.status !== 'defeat';
                                
                                return (
                                <motion.div key={card.id} onClick={() => isCombat && triggerUltimate(idx)} animate={combatState.status === 'cards_attack' ? { y: -20, scale: 1.1 } : { y: 0, scale: 1 }} transition={{ duration: 0.2, delay: idx * 0.1, yoyo: Infinity }} className={`w-20 ${getRarityColor(card.rarity)} border-4 border-b-8 rounded-2xl p-1.5 flex flex-col items-center shadow-lg relative ${isReady && isCombat ? 'cursor-pointer ring-4 ring-yellow-400 animate-pulse scale-110' : ''}`}>
                                    {combatState.status === 'cards_attack' && <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: 250, opacity: 0 }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="absolute bottom-full left-1/2 -translate-x-1/2 w-2 bg-cyan-300 border-x-2 border-cyan-500 rounded-full origin-bottom" />}
                                    
                                    {/* BARRA DE ENERGIA DA ULTIMATE */}
                                    <div className="absolute -left-3 top-0 bottom-0 w-2 bg-black/50 rounded-full overflow-hidden border border-black/20">
                                        <div className="w-full bg-yellow-400 bottom-0 absolute transition-all" style={{ height: `${cardCharges[idx]}%` }} />
                                    </div>

                                    <div className="absolute -top-2 -right-2 bg-[#022c22] border border-[#0f766e] rounded-full w-6 h-6 flex items-center justify-center shadow-sm z-20">
                                        {getElementIcon(card.element)}
                                    </div>
                                    <div className="w-14 h-14 bg-white/20 rounded-xl mb-1 flex items-center justify-center overflow-hidden border-2 border-black/20 shadow-inner">
                                        <img src={getAvatarUrl(card.name)} alt={card.name} className="w-12 h-12 drop-shadow-md opacity-90" />
                                    </div>
                                    <div className="bg-black/40 px-2 py-0.5 rounded-lg text-[10px] font-black w-full text-center text-white">ATK {card.atk}</div>
                                </motion.div>
                            )})}
                        </div>

                        <button onClick={simulateInvasion} disabled={combatState.status !== 'idle' || activeDeck.length === 0} className="absolute bottom-6 right-6 z-50 bg-purple-600 text-white border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 font-black text-xs uppercase px-5 py-4 rounded-[2rem] shadow-[0_0_15px_rgba(168,85,247,0.5)] flex items-center gap-2 transition-all disabled:opacity-50 disabled:grayscale">
                            <Skull size={20} strokeWidth={3}/> {combatState.status !== 'idle' ? 'Lutando...' : activeDeck.length === 0 ? 'Sem Runas' : wave % 5 === 0 ? 'Enfrentar Lorde' : 'Purificar'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <UpgradeButton title="Núcleo Vital" level={buildings.core.level} iconType="core" color="emerald" gold={coreCostGold} resource={coreCostFerro} resourceType="ferro" onClick={upgradeCore} />
                        <UpgradeButton title={buildings.tower.level === 0 ? "Erguer Obelisco" : "Melhorar Obelisco"} level={buildings.tower.level} iconType="tower" color="red" gold={towerCostGold} resource={towerCostFerro} resourceType="ferro" onClick={upgradeTower} />
                        <UpgradeButton title={buildings.shield.level === 0 ? "Invocar Barreira" : "Melhorar Barreira"} level={buildings.shield.level} iconType="shield" color="blue" gold={shieldCostGold} resource={shieldCostOuro} resourceType="ouro" onClick={upgradeShield} />
                    </div>
                </motion.div>
            )}

            {activeTab === 'laboratorio' && (
                <motion.div key="laboratorio" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-6">
                    <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center">
                        <div className="bg-teal-800 border-4 border-teal-600 p-4 rounded-[2rem] shadow-md mb-6"><Beaker size={48} className="text-teal-200" strokeWidth={3} /></div>
                        <h2 className="text-2xl font-black uppercase text-teal-100 mb-2">Altar Arcano</h2>
                        <p className="text-sm text-teal-600 font-bold mb-8 text-center max-w-md">Utilize relíquias ancestrais para invocar bênçãos permanentes sobre o seu domínio.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-5 flex flex-col items-center text-center shadow-lg">
                                <div className="bg-purple-800 text-purple-200 p-3 rounded-2xl border-4 border-purple-600 mb-4"><Radar size={28} strokeWidth={3}/></div>
                                <h3 className="text-sm font-black text-teal-100 mb-1 uppercase">Visão do Além</h3>
                                <p className="text-[11px] text-teal-600 font-black uppercase mb-4 bg-[#042f2e] px-3 py-1 rounded-full border-2 border-[#022c22]">Nível {research.radarCooldown}</p>
                                <p className="text-xs text-purple-300 font-bold mb-6">-5s no recarregamento da exploração da Selva por nível.</p>
                                <button onClick={() => researchTech('radar')} className="mt-auto w-full py-4 bg-teal-600 border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2">
                                    Abençoar <span className="bg-teal-700 px-2 py-1 rounded-xl border-2 border-teal-500 flex items-center gap-1 shadow-sm text-sm"><AssetReliquia className="w-4 h-4" /> {radarCost}</span>
                                </button>
                            </div>
                            <div className="bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-5 flex flex-col items-center text-center shadow-lg">
                                <div className="bg-teal-600 text-teal-100 p-3 rounded-2xl border-4 border-teal-800 mb-4"><TrendingUp size={28} strokeWidth={3}/></div>
                                <h3 className="text-sm font-black text-teal-100 mb-1 uppercase">Raízes Férteis</h3>
                                <p className="text-[11px] text-teal-600 font-black uppercase mb-4 bg-[#042f2e] px-3 py-1 rounded-full border-2 border-[#022c22]">Nível {research.minerBonus}</p>
                                <p className="text-xs text-teal-300 font-bold mb-6">+1 Recurso recolhido por Golem em cada ciclo de colheita.</p>
                                <button onClick={() => researchTech('miner')} className="mt-auto w-full py-4 bg-teal-600 border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2">
                                    Abençoar <span className="bg-teal-700 px-2 py-1 rounded-xl border-2 border-teal-500 flex items-center gap-1 shadow-sm text-sm"><AssetReliquia className="w-4 h-4" /> {minerCost}</span>
                                </button>
                            </div>
                            <div className="bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-5 flex flex-col items-center text-center shadow-lg">
                                <div className="bg-emerald-600 text-emerald-100 p-3 rounded-2xl border-4 border-emerald-800 mb-4"><ShieldPlus size={28} strokeWidth={3}/></div>
                                <h3 className="text-sm font-black text-teal-100 mb-1 uppercase">Casca de Aether</h3>
                                <p className="text-[11px] text-teal-600 font-black uppercase mb-4 bg-[#042f2e] px-3 py-1 rounded-full border-2 border-[#022c22]">Nível {research.coreBonus}</p>
                                <p className="text-xs text-emerald-300 font-bold mb-6">+100 de Integridade Máxima permanente para o seu Núcleo.</p>
                                <button onClick={() => researchTech('core')} className="mt-auto w-full py-4 bg-teal-600 border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2">
                                    Abençoar <span className="bg-teal-700 px-2 py-1 rounded-xl border-2 border-teal-500 flex items-center gap-1 shadow-sm text-sm"><AssetReliquia className="w-4 h-4" /> {coreBonusCost}</span>
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