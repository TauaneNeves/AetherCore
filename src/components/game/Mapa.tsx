"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { 
    AssetCristalAether, AssetEssenciaSombria, AssetFragmentoRunico, AssetPoeiraVital, AssetReliquia,
    AssetCompass, AssetArrowRight, AssetSkull, AssetMapIcon, AssetRotateCcw, 
    AssetShieldCheck, AssetClock, AssetSwords, AssetTarget, AssetSparkles,
    AssetCharQuartz, AssetCharAether, AssetCharNeon, AssetCharTide, AssetCharOnyx, AssetCharVoid, AssetCharPrism, AssetCharLotus,
    AssetEnemyCorruption
} from './GameAssets';

export default function Mapa() {
    const { inventory, setInventory, gold, setGold, activeDeck, safeExpedition, setSafeExpedition, soulShards } = useGame();
    const [mapMode, setMapMode] = useState<'selection' | 'active_expedition' | 'combat'>('selection');
    const MAX_DEPTH = 10;
    const [depth, setDepth] = useState(1);
    const [accumulatedLoot, setAccumulatedLoot] = useState<any>({ poeira: 0, fragmento: 0, essencia: 0, reliquia: 0 });
    const [paths, setPaths] = useState<any[]>([]);
    const [party, setParty] = useState<any[]>([]);
    const [enemy, setEnemy] = useState<any>(null);
    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [ultCharges, setUltCharges] = useState<number[]>([0,0,0]);
    const [combatTick, setCombatTick] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const isEventTime = new Date().getHours() === 19;
    const multiplier = 1 + (soulShards * 0.1);

    const renderCharacterVisual = (visualType: string) => {
        switch(visualType) {
            case 'quartz': return <AssetCharQuartz className="w-full h-full drop-shadow-lg" />;
            case 'aether': return <AssetCharAether className="w-full h-full drop-shadow-lg" />;
            case 'neon': return <AssetCharNeon className="w-full h-full drop-shadow-lg" />;
            case 'tide': return <AssetCharTide className="w-full h-full drop-shadow-lg" />;
            case 'onyx': return <AssetCharOnyx className="w-full h-full drop-shadow-lg" />;
            case 'void': return <AssetCharVoid className="w-full h-full drop-shadow-lg" />;
            case 'prism': return <AssetCharPrism className="w-full h-full drop-shadow-lg" />;
            case 'lotus': return <AssetCharLotus className="w-full h-full drop-shadow-lg" />;
            default: return <AssetCharQuartz className="w-full h-full drop-shadow-lg" />;
        }
    };

    useEffect(() => {
        if (safeExpedition?.active) {
            const t = setInterval(() => {
                const diff = Math.floor((safeExpedition.endTime - Date.now()) / 1000);
                setTimeLeft(diff > 0 ? diff : 0);
            }, 1000);
            return () => clearInterval(t);
        }
    }, [safeExpedition]);

    useEffect(() => {
        if (mapMode === 'combat' && enemy && enemy.hp > 0 && party.some(c => c.currentHp > 0)) {
            const timer = setTimeout(() => setCombatTick(t => t + 1), 500); 
            return () => clearTimeout(timer);
        }
    }, [mapMode, enemy, party, combatTick]);

    useEffect(() => {
        if (mapMode !== 'combat' || !enemy || enemy.hp <= 0) return;
        setUltCharges(prev => prev.map(c => Math.min(100, c + 5)));

        if (combatTick > 0 && combatTick % 4 === 0) {
            let totalDmg = 0;
            party.forEach(card => {
                if (card.currentHp > 0) {
                    totalDmg += Math.floor(card.atk * multiplier * (0.8 + Math.random() * 0.4));
                }
            });
            
            if (totalDmg > 0) {
                setEnemy((prev: any) => {
                    const newHp = Math.max(0, prev.hp - totalDmg);
                    if (newHp <= 0) resolveCombatVictory();
                    return { ...prev, hp: newHp };
                });
                setCombatLog(prev => [`Esquadrão atacou: ${totalDmg} Dano!`, ...prev].slice(0, 3));
            }
        }

        if (combatTick > 0 && combatTick % 6 === 0) {
            const aliveMembers = party.map((c, i) => ({...c, index: i})).filter(c => c.currentHp > 0);
            if (aliveMembers.length > 0) {
                const target = aliveMembers[Math.floor(Math.random() * aliveMembers.length)];
                const dmg = Math.floor(enemy.atk * 0.8 + (Math.random() * enemy.atk * 0.4));
                
                setParty(prev => {
                    const next = [...prev];
                    next[target.index].currentHp = Math.max(0, next[target.index].currentHp - dmg);
                    checkDefeat(next);
                    return next;
                });
                setCombatLog(prev => [`Corrupção feriu ${target.name} (-${dmg} HP)!`, ...prev].slice(0, 3));
            }
        }
    }, [combatTick]);

    const checkDefeat = (currentParty: any[]) => {
        if (currentParty.every(c => c.currentHp <= 0)) {
            alert("ALERTA CRÍTICO: ESQUADRÃO ANIQUILADO! Vocês fugiram das profundezas, mas derrubaram metade dos recursos.");
            setGold((g: number) => g + Math.floor(accumulatedLoot.poeira / 2));
            setInventory((p: any) => ({
                ...p,
                ferro: p.ferro + Math.floor(accumulatedLoot.fragmento / 2),
                carvao: p.carvao + Math.floor(accumulatedLoot.essencia / 2),
            }));
            setMapMode('selection');
        }
    };

    const resolveCombatVictory = () => {
        setTimeout(() => {
            const poeiraGained = 150 * depth;
            const isBoss = depth === MAX_DEPTH;
            const reliquiaGained = isBoss || Math.random() > 0.8 ? 1 : 0;
            setAccumulatedLoot((prev: any) => ({ ...prev, poeira: prev.poeira + (isBoss ? poeiraGained * 3 : poeiraGained), reliquia: prev.reliquia + reliquiaGained }));
            if (isBoss) {
                alert(`VITÓRIA GLORIOSA! Você expurgou a Profundidade 10 e resgatou os tesouros com segurança!`);
                retreatExpedition(true); 
            } else {
                setDepth(d => d + 1);
                generateActivePaths();
                setMapMode('active_expedition');
            }
        }, 1000);
    };

    const playerUltimate = (cardIndex: number) => {
        if (mapMode !== 'combat' || ultCharges[cardIndex] < 100 || party[cardIndex].currentHp <= 0 || !enemy) return;
        const card = party[cardIndex];
        const dmg = Math.floor(card.atk * multiplier * 4); 
        setUltCharges(prev => { const n = [...prev]; n[cardIndex] = 0; return n; });
        setEnemy((prev: any) => {
            const newHp = Math.max(0, prev.hp - dmg);
            if (newHp <= 0) resolveCombatVictory();
            return { ...prev, hp: newHp };
        });
        setCombatLog(prev => [`[ MAGIA DE ${card.element.toUpperCase()} ] ${card.name} causou ${dmg} de Dano!`, ...prev].slice(0, 3));
    };

    const generateActivePaths = () => {
        const nextDepth = depth + (mapMode === 'combat' ? 1 : 0); 
        if (nextDepth === MAX_DEPTH) { setPaths([{ id: 1, type: 'boss', title: 'Covil do Lorde', desc: 'Ameaça Máxima', reward: 'Relíquia Garantida' }]); return; }
        const options = [
            { type: 'ferro', title: 'Guardião de Pedra', desc: 'Alta Resistência', reward: 'Dropa Fragmentos', icon: <AssetFragmentoRunico className="w-8 h-8"/> },
            { type: 'ouro', title: 'Espectro Brilhante', desc: 'Dano Elevado', reward: 'Dropa Poeira', icon: <AssetPoeiraVital className="w-8 h-8"/> },
            { type: 'carvao', title: 'Rastejante Sombrio', desc: 'Ataque Rápido', reward: 'Dropa Essência', icon: <AssetEssenciaSombria className="w-8 h-8"/> }
        ];
        const shuffled = options.sort(() => 0.5 - Math.random());
        setPaths([{ id: 1, ...shuffled[0] }, { id: 2, ...shuffled[1] }]);
    };

    const startActiveExpedition = () => {
        if (safeExpedition?.active) return alert("O portal está instável. Aguarde o retorno dos Golens da Extração Segura.");
        if (activeDeck.length === 0) return alert("Erro: Você precisa adicionar Heróis ao Círculo antes de ir para as Profundezas.");
        setDepth(1);
        setAccumulatedLoot({ poeira: 0, fragmento: 0, essencia: 0, reliquia: 0 });
        setParty(activeDeck.map((c: any) => ({ ...c, maxHp: c.hp, currentHp: c.hp })));
        setMapMode('active_expedition');
        generateActivePaths();
    };

    const chooseActivePath = (path: any) => {
        const isBoss = path.type === 'boss';
        const enemyPower = isBoss ? 200 + (depth * 50) : 30 + (depth * 20);
        setEnemy({ hp: enemyPower, maxHp: enemyPower, atk: enemyPower / 2, name: isBoss ? 'Lorde Sombrio' : path.title, isBoss });
        setCombatLog([`Oculto nas sombras: ${isBoss ? 'Lorde Sombrio' : path.title}. Defenda-se!`]);
        setUltCharges([0,0,0]);
        setCombatTick(0);
        setMapMode('combat');
    };

    const retreatExpedition = (isVictory = false) => {
        setGold((g: number) => g + accumulatedLoot.poeira);
        setInventory((p: any) => ({ ...p, ferro: p.ferro + accumulatedLoot.fragmento, carvao: p.carvao + accumulatedLoot.essencia, item_antigo: (p.item_antigo || 0) + accumulatedLoot.reliquia }));
        setMapMode('selection');
    };

    const startSafeExpedition = () => {
        const endTime = Date.now() + (4 * 60 * 60 * 1000);
        setSafeExpedition({ active: true, endTime, loot: { poeira: 1500 + Math.floor(Math.random() * 500), fragmento: 50 + Math.floor(Math.random() * 20), essencia: 30 + Math.floor(Math.random() * 10), reliquia: Math.random() > 0.5 ? 1 : 0 } });
    };

    const claimSafeLoot = () => {
        if (!safeExpedition) return;
        setGold((g: number) => g + safeExpedition.loot.poeira);
        setInventory((p: any) => ({ ...p, ferro: p.ferro + safeExpedition.loot.fragmento, carvao: p.carvao + safeExpedition.loot.essencia, item_antigo: (p.item_antigo || 0) + safeExpedition.loot.reliquia }));
        setSafeExpedition(null);
    };

    const formatTime = (seconds: number) => `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m ${seconds % 60}s`;

    return (
        <div className="relative w-full h-full bg-[#020617] overflow-hidden flex flex-col items-center p-4">
            <AnimatePresence mode="wait">
                {mapMode === 'selection' && (
                    <motion.div key="selection" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }} className="flex flex-col items-center justify-center h-full w-full max-w-4xl gap-6">
                        <div className="w-full bg-[#042f2e] border-4 border-[#022c22] rounded-[3rem] p-8 shadow-2xl flex flex-col md:flex-row gap-8 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2dd4bf 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                            <div className="flex-1 bg-[#022c22] border-4 border-[#064e3b] p-6 rounded-[2rem] flex flex-col items-center text-center relative z-10 shadow-lg">
                                <AssetShieldCheck className="w-12 h-12 text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                                <h3 className="text-xl font-black text-emerald-100 uppercase mb-2">Extração Segura</h3>
                                <p className="text-xs font-bold text-emerald-600 mb-6 h-10">Envie Golens para uma varredura cautelosa. Demora horas, mas os ganhos são garantidos.</p>
                                {safeExpedition?.active ? ( timeLeft > 0 ? ( <div className="mt-auto w-full py-4 bg-emerald-950 border-4 border-emerald-800 text-emerald-300 rounded-2xl font-black text-lg flex items-center justify-center gap-2"><AssetClock className="w-5 h-5 animate-pulse" /> {formatTime(timeLeft)}</div>) : (<button onClick={claimSafeLoot} className="mt-auto w-full py-4 bg-emerald-500 border-4 border-emerald-700 border-b-8 active:border-b-4 active:translate-y-1 text-emerald-950 rounded-2xl font-black uppercase tracking-widest shadow-xl animate-bounce">Resgatar Tesouro</button>) ) : ( <button onClick={startSafeExpedition} className="mt-auto w-full py-4 bg-emerald-600 border-4 border-emerald-800 border-b-8 active:border-b-4 active:translate-y-1 text-white rounded-2xl text-xs font-black uppercase transition-all hover:bg-emerald-500">Iniciar Missão (4h)</button> )}
                            </div>
                            <div className={`flex-1 border-4 p-6 rounded-[2rem] flex flex-col items-center text-center relative z-10 transition-all ${safeExpedition?.active ? 'bg-slate-900 border-slate-800 opacity-80 grayscale' : 'bg-[#022c22] border-rose-900/50 shadow-[0_0_20px_rgba(225,29,72,0.1)]'}`}>
                                <AssetSkull className={`w-12 h-12 mb-4 ${safeExpedition?.active ? 'text-slate-600' : 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
                                <h3 className={`text-xl font-black uppercase mb-2 ${safeExpedition?.active ? 'text-slate-500' : 'text-rose-200'}`}>Profundezas</h3>
                                <p className={`text-xs font-bold mb-6 h-10 ${safeExpedition?.active ? 'text-slate-600' : 'text-rose-700'}`}>{safeExpedition?.active ? 'A fenda encontra-se bloqueada enquanto a Extração Segura estiver a decorrer.' : 'Leve o seu esquadrão ativamente para o perigo. Lute contra monstros e garanta recompensas imediatas.'}</p>
                                <button onClick={startActiveExpedition} disabled={safeExpedition?.active} className={`mt-auto w-full py-4 border-4 rounded-2xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${safeExpedition?.active ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-rose-600 border-rose-800 border-b-8 active:border-b-4 active:translate-y-1 text-white shadow-xl hover:bg-rose-500'}`}><AssetMapIcon className="w-5 h-5" /> {safeExpedition?.active ? 'Portal Fechado' : 'Desbravar'}</button>
                            </div>
                        </div>
                        <div className={`w-full border-4 rounded-[2rem] p-6 flex items-center justify-between shadow-xl transition-all ${isEventTime ? 'bg-indigo-950 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'bg-slate-900 border-slate-800 opacity-60 grayscale'}`}>
                            <div className="flex items-center gap-4"><AssetSparkles className={`w-8 h-8 ${isEventTime ? "text-indigo-400 animate-spin-slow" : "text-slate-600"}`} /><div><h3 className={`text-lg font-black uppercase ${isEventTime ? 'text-indigo-200' : 'text-slate-500'}`}>Anomalia Temporal</h3><p className={`text-xs font-bold ${isEventTime ? 'text-indigo-400' : 'text-slate-600'}`}>A fenda mágica abre apenas entre 19:00 e 19:59.</p></div></div>
                            <button disabled={!isEventTime} className={`px-6 py-3 rounded-2xl font-black uppercase border-4 border-b-8 active:border-b-4 active:translate-y-1 ${isEventTime ? 'bg-indigo-500 border-indigo-700 text-white hover:bg-indigo-400' : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'}`}>{isEventTime ? 'Entrar no Draft' : 'Selado'}</button>
                        </div>
                    </motion.div>
                )}

                {mapMode === 'active_expedition' && (
                    <motion.div key="active_map" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-3xl flex flex-col h-full pt-4 pb-20">
                        <div className="flex justify-between items-center mb-6 bg-[#042f2e] border-2 border-[#064e3b] p-4 rounded-2xl shadow-lg">
                            <div className="flex gap-4"><span className="flex items-center gap-2 text-teal-200 font-black text-sm"><AssetPoeiraVital className="w-5 h-5"/> {accumulatedLoot.poeira}</span><span className="flex items-center gap-2 text-teal-200 font-black text-sm"><AssetFragmentoRunico className="w-5 h-5"/> {accumulatedLoot.fragmento}</span></div>
                            <button onClick={() => retreatExpedition(false)} className="bg-amber-600 border-b-4 border-amber-800 text-white px-6 py-2 rounded-xl font-black uppercase text-xs hover:bg-amber-500 transition-colors flex items-center gap-2"><AssetRotateCcw className="w-4 h-4" /> Evacuar Loot</button>
                        </div>
                        <div className="w-full mb-10 bg-[#022c22] border-2 border-[#064e3b] rounded-2xl p-4 flex items-center justify-between relative">
                            <div className="absolute inset-x-6 top-1/2 h-1 bg-[#042f2e] -translate-y-1/2 z-0" />
                            <div className="absolute inset-x-6 top-1/2 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((depth - 1) / (MAX_DEPTH - 1)) * 100}%` }} />
                            {[...Array(MAX_DEPTH)].map((_, i) => {
                                const level = i + 1; const isCurrent = depth === level; const isPassed = depth > level; const isBoss = level === MAX_DEPTH;
                                return (<div key={level} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-300 ${isCurrent ? 'bg-teal-500 border-teal-300 scale-125 shadow-[0_0_15px_rgba(45,212,191,0.8)]' : isPassed ? 'bg-teal-900 border-teal-700' : 'bg-[#042f2e] border-[#0f766e]'} ${isBoss && !isPassed ? 'border-rose-500 bg-rose-950' : ''}`}>{isBoss ? <AssetSkull className={`w-3.5 h-3.5 ${isCurrent ? 'text-white' : 'text-rose-500'}`} /> : <span className={`text-[10px] font-black ${isCurrent ? 'text-teal-950' : 'text-white/50'}`}>{level}</span>}</div>);
                            })}
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center gap-8">
                            <AssetTarget className="w-16 h-16 text-teal-700 opacity-50 mb-4" />
                            <h3 className="text-center text-teal-100 font-black uppercase tracking-widest text-lg">Qual alvo você deseja atacar?</h3>
                            <div className="flex gap-6 w-full max-w-lg">
                                {paths.map((path) => (
                                    <div key={path.id} onClick={() => chooseActivePath(path)} className="flex-1 border-4 border-b-8 rounded-[2rem] p-6 flex flex-col items-center text-center cursor-pointer transition-all shadow-xl hover:-translate-y-2 bg-rose-950 border-rose-900 hover:border-rose-500 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="mb-4 bg-rose-900/50 p-4 rounded-full border-2 border-rose-800">{path.type === 'boss' ? <AssetSkull className="w-12 h-12 text-rose-500 animate-pulse" /> : path.icon}</div>
                                        <h4 className="text-base font-black uppercase text-rose-200 mb-1">{path.title}</h4><span className="text-[10px] font-black bg-rose-900 text-rose-300 px-3 py-1 rounded-full mb-3">{path.desc}</span><span className="text-[11px] font-black text-amber-400 mt-auto flex items-center gap-1"><AssetArrowRight className="w-3 h-3" /> {path.reward}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {mapMode === 'combat' && enemy && (
                    <motion.div key="active_combat" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl flex flex-col h-full pt-4 pb-8 justify-between relative">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
                        <div className="bg-rose-950 border-4 border-rose-900 rounded-[2rem] p-6 flex flex-col items-center relative shadow-[0_0_30px_rgba(225,29,72,0.2)] z-10">
                            <div className="absolute top-4 left-4 bg-black/40 px-3 py-1 rounded-full text-[10px] font-black text-rose-300 uppercase animate-pulse flex items-center gap-2"><AssetSwords className="w-3 h-3" /> Combate Ativo</div>
                            
                            {/* O INIMIGO AGORA É RENDERIZADO EM SVG! */}
                            <div className="w-24 h-24 bg-black/30 rounded-2xl border-4 border-rose-800 shadow-inner mb-4 overflow-hidden">
                                <AssetEnemyCorruption className="w-full h-full p-2" isBoss={enemy.isBoss} />
                            </div>

                            <h3 className="text-xl font-black text-rose-100 uppercase mb-2">{enemy.name}</h3>
                            <div className="w-full max-w-xs h-6 bg-[#020617] border-2 border-rose-900 rounded-full overflow-hidden relative">
                                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">{Math.floor(enemy.hp)} / {enemy.maxHp} HP</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-4 z-10">
                            {combatLog.map((log, i) => ( <div key={i} className={`text-center font-bold text-sm mb-2 transition-all ${i === 0 ? 'text-white opacity-100 scale-110 drop-shadow-md' : 'text-teal-600 opacity-50 scale-90'}`}>{log}</div> ))}
                        </div>

                        <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl z-10 relative">
                            <h4 className="text-center text-teal-400 font-black uppercase text-xs mb-6 flex items-center justify-center gap-2"><AssetCompass className="w-4 h-4" /> O Seu Esquadrão</h4>
                            <div className="flex justify-center gap-4">
                                {party.map((card, idx) => {
                                    const isAlive = card.currentHp > 0;
                                    const isUltReady = ultCharges[idx] >= 100;
                                    return (
                                        <div key={idx} onClick={() => isUltReady && isAlive && playerUltimate(idx)} className={`w-24 border-4 rounded-[1.5rem] p-2 flex flex-col items-center relative transition-all ${isAlive ? (isUltReady ? 'border-yellow-400 bg-yellow-900/40 cursor-pointer hover:-translate-y-2 animate-pulse shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-[#064e3b] bg-[#022c22]') : 'border-rose-900 bg-black opacity-40 grayscale'}`}>
                                            {isAlive && <div className="absolute -left-2 top-2 bottom-2 w-1.5 bg-black/50 rounded-full overflow-hidden border border-black/20"><div className="w-full bg-yellow-400 bottom-0 absolute transition-all" style={{ height: `${ultCharges[idx]}%` }} /></div>}
                                            <div className="w-16 h-16 bg-black/20 rounded-xl mb-3 flex items-center justify-center overflow-hidden border-2 border-black/10">
                                                {renderCharacterVisual(card.visual)}
                                            </div>
                                            <div className="w-full h-3 bg-[#020617] rounded-full overflow-hidden border border-black/30 mb-1"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(card.currentHp / card.maxHp) * 100}%` }} /></div>
                                            <span className="text-[10px] font-black text-teal-100">{Math.floor(card.currentHp)} HP</span>
                                            {isUltReady && isAlive && <span className="absolute -top-3 bg-yellow-400 text-yellow-950 px-2 py-0.5 rounded-md text-[8px] font-black uppercase">Ultimate!</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}