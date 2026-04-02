"use client";
import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Search, Loader2, Pickaxe, Shield, Box, ChevronDown, ChevronUp, Swords, Zap, Bot, Ghost, AlertTriangle, Hexagon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

// --- COMPONENTES VISUAIS DA MINA ---

const RobotVisual = ({ isMining }: { isMining: boolean }) => (
    <motion.div animate={isMining ? { y: [0, -4, 0] } : {}} transition={{ duration: 1, repeat: Infinity }} className="relative flex flex-col items-center z-20">
        <div className="bg-slate-800 border-2 border-indigo-500 p-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Bot size={24} className="text-indigo-400" />
        </div>
        {isMining && (
            <motion.div animate={{ opacity: [0.3, 1, 0.3], height: [20, 25, 20] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-1 bg-indigo-400 absolute top-full origin-top" />
        )}
    </motion.div>
);

const NodeVisual = ({ type }: { type: string }) => {
    const getColors = () => {
        if (type === 'ouro') return 'text-yellow-500 border-yellow-500 bg-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.3)]';
        if (type === 'ferro') return 'text-slate-300 border-slate-400 bg-slate-400/20 shadow-[0_0_20px_rgba(148,163,184,0.3)]';
        return 'text-orange-800 border-orange-900 bg-orange-900/40 shadow-[0_0_20px_rgba(120,53,15,0.3)]';
    };
    return (
        <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center relative z-10 ${getColors()}`}>
            <Hexagon size={24} />
        </div>
    );
};

const CardEscortVisual = ({ card, isShooting }: { card: any, isShooting: boolean }) => (
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="relative flex flex-col items-center z-30">
        <div className="w-12 h-16 bg-slate-900 border-2 border-emerald-500 rounded-lg p-1 flex flex-col items-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Shield size={14} className="text-emerald-400 mb-1" />
            <div className="text-[8px] font-black uppercase text-slate-300 w-full truncate text-center">{card.name}</div>
            <div className="mt-auto text-[8px] bg-slate-950 px-1 rounded text-red-400 border border-slate-800">⚔️{card.atk}</div>
        </div>
        {isShooting && (
            <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: 120, opacity: 0 }} transition={{ duration: 0.4 }} className="absolute bottom-full right-1/2 w-1 bg-emerald-400 shadow-[0_0_10px_#34d399] rounded-full origin-bottom" style={{ transform: 'rotate(-45deg)' }} />
        )}
    </motion.div>
);

const getMineIcon = (type: string) => {
    if (type === 'ouro') return '🟡';
    if (type === 'ferro') return '⚪';
    return '⬛';
};

// --- COMPONENTE INDIVIDUAL DE CADA MINA (TELA DE FASE) ---
const MineCard = ({ 
    mina, miningRobots, myCards, inventory, setInventory, setDiscoveredMines, 
    setSelectingFor
}: any) => {
    
    const assignedRobot = miningRobots.find((r: any) => r.id === mina.robotId);
    const assignedCard = myCards.find((c: any) => c.id === mina.cardId);

    const [combat, setCombat] = useState<any>({ status: 'idle', enemyHp: 0, maxEnemyHp: 0 });
    const [drops, setDrops] = useState<any[]>([]); 
    const [isManualMining, setIsManualMining] = useState(false);
    const [manualProgress, setManualProgress] = useState(0);

    const getMineColor = (type: string) => {
        if (type === 'ouro') return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
        if (type === 'ferro') return 'text-slate-300 border-slate-400 bg-slate-400/10';
        return 'text-orange-950 border-orange-900 bg-orange-900/20'; 
    };

    const triggerFloatingDrop = (icon: string) => {
        setDrops(prev => [...prev, { id: Date.now() + Math.random(), icon, x: (Math.random() - 0.5) * 60 }]);
    };

    const [prevAcc, setPrevAcc] = useState(mina.accumulated);
    useEffect(() => {
        if (mina.accumulated > prevAcc) {
            triggerFloatingDrop(getMineIcon(mina.type));
            setPrevAcc(mina.accumulated);
        }
    }, [mina.accumulated, mina.type, prevAcc]);

    const rollLoot = () => {
        const roll = Math.random() * 100;
        let dropType = '';
        let dropIcon = '';

        if (roll < 40) { dropType = 'terra'; dropIcon = '🪨'; }
        else if (roll < 70) { dropType = mina.type; dropIcon = getMineIcon(mina.type); }
        else if (roll < 85) { dropType = 'pecas_robo'; dropIcon = '⚙️'; }
        else if (roll < 95) { dropType = 'pecas_defesa'; dropIcon = '🛡️'; }
        else { dropType = 'item_antigo'; dropIcon = '🏺'; }

        setInventory((prev: any) => ({ ...prev, [dropType]: (prev[dropType] || 0) + 1 }));
        triggerFloatingDrop(dropIcon);
    };

    const startManualMining = () => {
        if (isManualMining || combat.status !== 'idle') return;
        setIsManualMining(true);
        setManualProgress(0);
        
        const t = setInterval(() => {
            setManualProgress(p => {
                if (p >= 100) {
                    clearInterval(t);
                    setIsManualMining(false);
                    rollLoot();
                    return 0;
                }
                return p + 2; 
            });
        }, 100);
    };

    const collectResources = () => {
        if (mina.accumulated === 0) return;
        setInventory((prev: any) => ({ ...prev, [mina.type]: prev[mina.type] + mina.accumulated }));
        setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === mina.id ? { ...m, accumulated: 0 } : m));
    };

    const unassignRobot = () => setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === mina.id ? { ...m, robotId: null } : m));
    const unassignCard = () => setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === mina.id ? { ...m, cardId: null } : m));

    const simulatePirateRaid = () => {
        if (combat.status !== 'idle') return;
        const enemyPower = Math.floor(Math.random() * 15) + 10; 
        setCombat({ status: 'spawning', enemyHp: enemyPower, maxEnemyHp: enemyPower });

        setTimeout(() => {
            setCombat(prev => ({ ...prev, status: 'defending' }));
            const cardAtk = assignedCard ? assignedCard.atk : 0;
            const remainingHp = Math.max(0, enemyPower - cardAtk);
            
            setTimeout(() => {
                setCombat(prev => ({ ...prev, enemyHp: remainingHp }));
                setTimeout(() => {
                    if (remainingHp <= 0) {
                        setCombat(prev => ({ ...prev, status: 'victory' }));
                        setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === mina.id ? { ...m, accumulated: m.accumulated + 5 } : m));
                        setTimeout(() => setCombat(prev => ({ ...prev, status: 'idle' })), 3000);
                    } else {
                        setCombat(prev => ({ ...prev, status: 'enemy_attack' }));
                        setTimeout(() => {
                            setCombat(prev => ({ ...prev, status: 'defeat' }));
                            setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === mina.id ? { ...m, robotId: null, accumulated: 0 } : m));
                            setTimeout(() => setCombat(prev => ({ ...prev, status: 'idle' })), 3000);
                        }, 800);
                    }
                }, 1000);
            }, 400); 
        }, 1500); 
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border-2 border-indigo-500/50 rounded-[40px] p-6 shadow-[0_0_40px_rgba(99,102,241,0.1)] flex flex-col relative overflow-hidden w-full max-w-2xl mx-auto"
        >
            {combat.status === 'defeat' && <div className="absolute inset-0 bg-red-500/20 animate-pulse z-40 pointer-events-none" />}
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800 relative z-50">
                <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl ${getMineColor(mina.type)}`}>
                        {getMineIcon(mina.type)}
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase text-white flex items-center gap-2">Mina de {mina.type}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                            Status: <span className={assignedRobot ? "text-emerald-400" : "text-amber-500"}>{assignedRobot ? "Robô Extraindo" : "Parada"}</span>
                        </p>
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <div className="text-3xl font-black tabular-nums text-white flex items-center gap-2">
                        {mina.accumulated} <Box size={20} className="text-slate-500"/>
                    </div>
                    <button onClick={collectResources} disabled={mina.accumulated === 0} className="text-[10px] font-black uppercase bg-emerald-600/20 text-emerald-400 px-4 py-1.5 rounded-full mt-2 hover:bg-emerald-600/40 disabled:opacity-30 disabled:grayscale transition-colors">
                        Coletar Estoque
                    </button>
                </div>
            </div>

            {/* PALCO 3D */}
            <div className="relative h-64 w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 mb-6" style={{ perspective: '1000px' }}>
                
                {/* DROPS FLUTUANTES */}
                <div className="absolute top-[40%] left-1/2 z-50 pointer-events-none">
                    <AnimatePresence>
                        {drops.map(drop => (
                            <motion.div
                                key={drop.id}
                                initial={{ opacity: 1, y: 0, x: drop.x, scale: 0.5 }}
                                animate={{ opacity: 0, y: -90, x: drop.x + (Math.random()*40 - 20), scale: 2 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                onAnimationComplete={() => setDrops(prev => prev.filter(d => d.id !== drop.id))}
                                className="absolute text-5xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]"
                            >
                                {drop.icon}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {combat.status === 'victory' && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 text-emerald-300 px-6 py-2 rounded-full border border-emerald-500 text-xs font-black animate-bounce whitespace-nowrap shadow-lg">Ataque Repelido! Bônus +5</div>}
                {combat.status === 'defeat' && <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 text-red-300 px-6 py-2 rounded-full border border-red-500 text-xs font-black animate-bounce whitespace-nowrap shadow-lg">Robô Destruído! Minério Roubado!</div>}

                <AnimatePresence>
                    {combat.status !== 'idle' && combat.status !== 'victory' && combat.status !== 'defeat' && (
                        <motion.div initial={{ opacity: 0, scale: 0.5, y: -20, x: -30 }} animate={{ opacity: 1, scale: 1, y: 10, x: -30 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute top-4 left-[20%] z-40 flex flex-col items-center">
                            <div className="bg-slate-900 border-2 border-red-600 p-3 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"><Ghost size={28} className="text-red-400" /></div>
                            <div className="w-16 h-2 bg-slate-900 mt-2 rounded-full overflow-hidden border border-slate-700">
                                <motion.div className="h-full bg-red-500" animate={{ width: `${(combat.enemyHp / combat.maxEnemyHp) * 100}%` }} transition={{ duration: 0.3 }}/>
                            </div>
                            {combat.status === 'enemy_attack' && (
                                <motion.div initial={{ height: 0, opacity: 1 }} animate={{ height: 180, opacity: 0 }} transition={{ duration: 0.4 }} className="absolute top-full left-1/2 w-1.5 bg-red-500 shadow-[0_0_15px_#ef4444] rounded-full origin-top" style={{ transform: 'rotate(20deg)' }} />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="absolute inset-x-[-100px] top-[40%] h-[300px] origin-top opacity-30" style={{ transform: 'rotateX(50deg)', backgroundImage: 'linear-gradient(#334155 2px, transparent 2px), linear-gradient(90deg, #334155 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <div className="relative flex flex-col items-center">
                        {assignedRobot && <RobotVisual isMining={combat.status === 'idle'} />}
                        <div className={`${assignedRobot ? 'mt-2' : 'mt-16'}`}>
                            <NodeVisual type={mina.type} />
                        </div>
                    </div>
                </div>

                {assignedCard && (
                    <div className="absolute bottom-6 right-6 z-40">
                        <CardEscortVisual card={assignedCard} isShooting={combat.status === 'defending'} />
                    </div>
                )}
            </div>

            <button 
                onClick={startManualMining}
                disabled={isManualMining || combat.status !== 'idle'}
                className="mb-6 w-full bg-slate-950 hover:bg-slate-900 border-2 border-indigo-900/50 rounded-2xl py-5 flex flex-col items-center justify-center relative overflow-hidden transition-colors disabled:opacity-50"
            >
                {isManualMining && (
                    <div className="absolute left-0 top-0 h-full bg-indigo-600/30 transition-all duration-100 ease-linear" style={{ width: `${manualProgress}%` }} />
                )}
                <span className="relative z-10 text-sm font-black uppercase text-indigo-400 flex items-center gap-2">
                    <Pickaxe size={18}/> 
                    {isManualMining ? `Extraindo... ${manualProgress}%` : 'Mineração Manual por Click'}
                </span>
            </button>

            <div className="grid grid-cols-2 gap-4 mb-4 relative z-50">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 mb-3"><Pickaxe size={14}/> Robô Extrator</span>
                    {assignedRobot ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-950 text-indigo-400 p-2 rounded-xl border border-indigo-900/50"><Bot size={18}/></div>
                                <span className="text-xs font-bold text-slate-300 truncate w-20">{assignedRobot.name}</span>
                            </div>
                            <button onClick={unassignRobot} className="text-slate-600 hover:text-red-400 p-2"><ChevronUp size={20}/></button>
                        </div>
                    ) : (
                        <button onClick={() => setSelectingFor({mineId: mina.id, type: 'robot'})} className="flex flex-col items-center justify-center py-3 text-slate-600 hover:text-indigo-400 transition-colors">
                            <ChevronDown size={24}/>
                            <span className="text-xs font-bold uppercase mt-1">Alocar Robô</span>
                        </button>
                    )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1 mb-3"><Shield size={14}/> Escolta Armada</span>
                    {assignedCard ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-800 text-slate-400 p-2 rounded-xl border border-slate-700"><Swords size={18}/></div>
                                <div className="flex flex-col w-20">
                                    <span className="text-[10px] font-bold text-slate-300 truncate">{assignedCard.name}</span>
                                    <span className="text-[9px] font-black text-red-400 mt-0.5">⚔️ {assignedCard.atk}</span>
                                </div>
                            </div>
                            <button onClick={unassignCard} className="text-slate-600 hover:text-red-400 p-2"><ChevronUp size={20}/></button>
                        </div>
                    ) : (
                        <button onClick={() => setSelectingFor({mineId: mina.id, type: 'card'})} className="flex flex-col items-center justify-center py-3 text-slate-600 hover:text-emerald-400 transition-colors">
                            <ChevronDown size={24}/>
                            <span className="text-xs font-bold uppercase mt-1">Designar Escolta</span>
                        </button>
                    )}
                </div>
            </div>

            <button 
                onClick={simulatePirateRaid}
                disabled={combat.status !== 'idle' || !assignedRobot}
                className="w-full bg-slate-950 border border-red-900/30 hover:bg-red-950 text-red-400 font-black text-xs uppercase py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:grayscale z-50 relative"
            >
                <AlertTriangle size={16}/> {combat.status !== 'idle' ? 'Mina sob ataque!' : 'Simular Ataque Pirata'}
            </button>
        </motion.div>
    );
};


// --- COMPONENTE PRINCIPAL DO MAPA ---
export default function Mapa() {
  const { 
    discoveredMines, setDiscoveredMines, 
    miningRobots, myCards, activeDeck,
    inventory, setInventory,
    activeMineId, setActiveMineId,
    exploreCooldown, setExploreCooldown
  } = useGame();
  
  const [isExploring, setIsExploring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectingFor, setSelectingFor] = useState<{mineId: string, type: 'robot' | 'card'} | null>(null);

  const startExplore = () => {
    if (exploreCooldown > 0) return;
    setIsExploring(true);
    setProgress(0);
    
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setIsExploring(false);
          const types = ['carvao', 'carvao', 'ferro', 'ferro', 'ouro'];
          const randomType = types[Math.floor(Math.random() * types.length)];
          const newMine = {
            id: `mine_${Date.now()}`,
            type: randomType,
            robotId: null,
            cardId: null,
            accumulated: 0
          };
          
          setDiscoveredMines((prev: any) => [...prev, newMine]);
          setActiveMineId(newMine.id); // Entra na mina automaticamente
          setExploreCooldown(30); // Aplica 30s de cooldown no radar
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const assignRobot = (robotId: string) => {
    if (!selectingFor) return;
    setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === selectingFor.mineId ? { ...m, robotId } : m));
    setSelectingFor(null);
  };

  const assignCard = (cardId: string) => {
    if (!selectingFor) return;
    setDiscoveredMines((prev: any) => prev.map((m: any) => m.id === selectingFor.mineId ? { ...m, cardId } : m));
    setSelectingFor(null);
  };

  const availableRobots = miningRobots.filter((r: any) => !discoveredMines.find((m: any) => m.robotId === r.id));
  const availableCards = myCards.filter((c: any) => 
    !activeDeck.find((ac: any) => ac.id === c.id) && 
    !discoveredMines.find((m: any) => m.cardId === c.id) 
  );

  // --- SE ESTIVER DENTRO DE UMA MINA, MOSTRA APENAS ELA ---
  if (activeMineId) {
      const minaAtual = discoveredMines.find((m: any) => m.id === activeMineId);
      if (minaAtual) {
          return (
            <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
                <div className="w-full max-w-2xl mb-4">
                    <button 
                        onClick={() => setActiveMineId(null)}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft size={16}/> Sair da Mina
                    </button>
                </div>
                <MineCard 
                    mina={minaAtual} 
                    miningRobots={miningRobots} 
                    myCards={myCards} 
                    inventory={inventory}
                    setInventory={setInventory}
                    setDiscoveredMines={setDiscoveredMines}
                    setSelectingFor={setSelectingFor}
                />
                
                {/* MODAL DE SELEÇÃO COPIADO AQUI PARA A TELA INTERNA TAMBÉM */}
                <AnimatePresence>
                    {selectingFor && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-slate-900 border-2 border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                                        {selectingFor.type === 'robot' ? <><Zap className="text-indigo-400"/> Selecionar Robô</> : <><Shield className="text-emerald-400"/> Designar Escolta</>}
                                    </h3>
                                    <button onClick={() => setSelectingFor(null)} className="text-slate-500 hover:text-white font-black p-2 bg-slate-800 rounded-full">X</button>
                                </div>
                                <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                                    {selectingFor.type === 'robot' && availableRobots.map((r: any) => (
                                        <button key={r.id} onClick={() => assignRobot(r.id)} className="bg-slate-950 border border-slate-800 hover:border-indigo-500 p-4 rounded-2xl flex justify-between items-center text-left transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-800 p-2 rounded-xl group-hover:text-indigo-400 transition-colors"><Bot size={20}/></div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white">{r.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">Taxa: {r.rate} / ciclo</p>
                                                </div>
                                            </div>
                                            <div className="bg-indigo-900/30 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase group-hover:bg-indigo-600 group-hover:text-white transition-colors">Despachar</div>
                                        </button>
                                    ))}
                                    {selectingFor.type === 'card' && availableCards.map((c: any) => (
                                        <button key={c.id} onClick={() => assignCard(c.id)} className="bg-slate-950 border border-slate-800 hover:border-emerald-500 p-4 rounded-2xl flex justify-between items-center text-left transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-800 p-2 rounded-xl group-hover:text-emerald-400 transition-colors"><Swords size={20}/></div>
                                                <div>
                                                    <h4 className="text-sm font-black text-white">{c.name}</h4>
                                                    <div className="flex gap-3 text-[10px] font-bold mt-0.5">
                                                        <span className="text-red-400">⚔️ {c.atk}</span>
                                                        <span className="text-emerald-400">❤️ {c.hp}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-900/30 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-black uppercase group-hover:bg-emerald-600 group-hover:text-white transition-colors">Designar</div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          );
      }
  }

  // --- TELA DE EXPLORAÇÃO (RADAR) ---
  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        
        {/* SETOR DO RADAR */}
        <div className="bg-slate-900 border-2 border-slate-800 p-8 rounded-3xl text-center w-full shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', size: '20px 20px' }}></div>
          <div className="relative z-10 flex flex-col items-center">
            <motion.div animate={isExploring ? { rotate: 360 } : {}} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <MapIcon size={48} className={exploreCooldown > 0 ? "text-slate-600 mb-4" : "text-indigo-500 mb-4"} />
            </motion.div>
            <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6">Radar de Exploração</h2>
            <button 
                onClick={startExplore} 
                disabled={isExploring || exploreCooldown > 0}
                className="w-full max-w-md bg-indigo-600 hover:bg-indigo-500 py-4 rounded-2xl font-black uppercase flex items-center justify-center gap-2 transition-colors disabled:opacity-30 disabled:grayscale shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
                {isExploring ? <Loader2 className="animate-spin" /> : <Search size={20}/>}
                {isExploring ? 'Escaneando...' : exploreCooldown > 0 ? `Radar Resfriando (${exploreCooldown}s)` : 'Procurar Novas Jazidas'}
            </button>
            {isExploring && (
                <div className="w-full max-w-md h-2 bg-slate-950 mt-6 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" style={{width: `${progress}%`}}/>
                </div>
            )}
          </div>
        </div>

        {/* LISTA DE SETORES SALVOS (Para o jogador poder voltar para eles sem escanear) */}
        {discoveredMines.length > 0 && (
            <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <Pickaxe size={16}/> Setores Conhecidos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {discoveredMines.map((mina: any) => (
                        <div key={mina.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                            <div className={`text-2xl mb-2 ${mina.type === 'ouro' ? 'text-yellow-500' : mina.type === 'ferro' ? 'text-slate-300' : 'text-orange-950'}`}>
                                {getMineIcon(mina.type)}
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 mb-3">Mina de {mina.type}</span>
                            <button onClick={() => setActiveMineId(mina.id)} className="w-full bg-slate-800 hover:bg-indigo-900 hover:text-indigo-400 text-slate-300 font-bold text-[10px] uppercase py-2 rounded-xl transition-colors">
                                Entrar na Mina
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}