"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { 
    AssetLayers, AssetBoxes, AssetSparkles, AssetRuneStone,
    AssetCharQuartz, AssetCharAether, AssetCharNeon, AssetCharTide, AssetCharOnyx, AssetCharVoid, AssetCharPrism, AssetCharLotus,
    AssetFire, AssetWater, AssetEarthElem, AssetAir,
    AssetIconATK, AssetIconHP, AssetIconEffect
} from './GameAssets';

export default function DeckScreen() {
    const { myCards, activeDeck, setActiveDeck, myRunes, activeRunes, setActiveRunes } = useGame();
    const [tab, setTab] = useState<'chars' | 'runes'>('chars');
    const MAX_DECK_SIZE = 3;
    const MAX_RUNE_SIZE = 3;

    // RENDERIZADOR DE SVG DOS PERSONAGENS! Sem links externos!
    const renderCharacterVisual = (visualType: string) => {
        switch(visualType) {
            case 'quartz': return <AssetCharQuartz className="w-16 h-16 drop-shadow-lg" />;
            case 'aether': return <AssetCharAether className="w-16 h-16 drop-shadow-lg" />;
            case 'neon': return <AssetCharNeon className="w-16 h-16 drop-shadow-lg" />;
            case 'tide': return <AssetCharTide className="w-16 h-16 drop-shadow-lg" />;
            case 'onyx': return <AssetCharOnyx className="w-16 h-16 drop-shadow-lg" />;
            case 'void': return <AssetCharVoid className="w-16 h-16 drop-shadow-lg" />;
            case 'prism': return <AssetCharPrism className="w-16 h-16 drop-shadow-lg" />;
            case 'lotus': return <AssetCharLotus className="w-16 h-16 drop-shadow-lg" />;
            default: return <AssetCharQuartz className="w-16 h-16 drop-shadow-lg" />;
        }
    };

    const getElementIcon = (element: string) => {
        switch(element) {
            case 'Fogo': return <AssetFire className="w-3 h-3" />;
            case 'Água': return <AssetWater className="w-3 h-3" />;
            case 'Terra': return <AssetEarthElem className="w-3 h-3" />;
            case 'Ar': return <AssetAir className="w-3 h-3" />;
            default: return null;
        }
    };

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'Comum': return 'bg-[#0f766e] border-[#042f2e] text-teal-100';
            case 'Rara': return 'bg-[#0ea5e9] border-[#075985] text-sky-100';
            case 'Épica': return 'bg-[#a855f7] border-[#581c87] text-purple-100';
            case 'Lendária': return 'bg-[#f59e0b] border-[#92400e] text-amber-100';
            default: return 'bg-slate-400 border-slate-600 text-slate-900';
        }
    };

    const toggleCard = (card: any) => {
        if (activeDeck.find((c: any) => c.id === card.id)) {
            setActiveDeck(activeDeck.filter((c: any) => c.id !== card.id));
        } else if (activeDeck.length < MAX_DECK_SIZE) {
            setActiveDeck([...activeDeck, card]);
        } else {
            alert("Círculo cheio! Remova um personagem primeiro.");
        }
    };

    const toggleRune = (rune: any) => {
        if (activeRunes.find((r: any) => r.id === rune.id)) {
            setActiveRunes(activeRunes.filter((r: any) => r.id !== rune.id));
        } else if (activeRunes.length < MAX_RUNE_SIZE) {
            setActiveRunes([...activeRunes, rune]);
        } else {
            alert("Slots de Runa cheios!");
        }
    };

    // A CARTA 3D!
    const FlipCard = ({ card, isEquipped, onClick }: any) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div 
                className="relative w-full h-44 cursor-pointer" 
                style={{ perspective: 1000 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                <motion.div
                    animate={{ rotateY: isHovered ? 180 : 0 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRENTE */}
                    <div className={`absolute inset-0 border-4 border-b-[6px] ${getRarityColor(card.rarity)} rounded-[1.5rem] p-2 flex flex-col items-center shadow-lg ${isEquipped ? 'ring-4 ring-teal-400 ring-offset-2 ring-offset-[#020617]' : ''}`} style={{ backfaceVisibility: 'hidden' }}>
                        <div className="absolute -top-2 -right-2 bg-[#022c22] border-2 border-[#0f766e] rounded-full w-6 h-6 flex items-center justify-center shadow-sm z-20">
                            {getElementIcon(card.element)}
                        </div>
                        <div className="w-full h-20 bg-black/20 rounded-xl mb-2 flex items-center justify-center overflow-hidden border-2 border-black/10 shadow-inner mt-1">
                            {renderCharacterVisual(card.visual)}
                        </div>
                        <div className="flex justify-center text-[10px] mb-1 text-yellow-200 drop-shadow-md tracking-tighter">{Array(card.level || 1).fill('⭐').join('')}</div>
                        <h3 className="text-[11px] font-black leading-tight text-center px-1 mb-auto text-white drop-shadow-md">{card.name}</h3>
                        <div className="flex w-full gap-1 mt-1">
                            <span className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-rose-200 bg-rose-950/60 rounded border border-rose-900/50 py-0.5"><AssetIconATK className="w-3 h-3"/> {card.atk}</span>
                            <span className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-emerald-200 bg-emerald-950/60 rounded border border-emerald-900/50 py-0.5"><AssetIconHP className="w-3 h-3"/> {card.hp}</span>
                        </div>
                    </div>

                    {/* COSTAS (EFEITOS MÁGICOS) */}
                    <div className="absolute inset-0 border-4 bg-[#020617] border-teal-600 rounded-[1.5rem] p-3 flex flex-col shadow-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <h4 className="text-[10px] font-black text-teal-400 uppercase text-center mb-2 border-b border-teal-800 pb-1">Habilidade</h4>
                        <div className="flex items-center gap-2 mb-2 text-purple-300 font-black text-[11px]">
                            <AssetIconEffect className="w-4 h-4 text-purple-500" />
                            {card.effectName}
                        </div>
                        <p className="text-[9px] text-slate-300 font-bold leading-relaxed overflow-hidden">{card.effectDesc}</p>
                        <div className="mt-auto text-center text-[8px] uppercase tracking-widest text-teal-600 font-black">{isEquipped ? 'Remover do Círculo' : 'Adicionar ao Círculo'}</div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32 bg-[#020617]">
            <div className="w-full max-w-5xl flex flex-col gap-6">
                <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2dd4bf 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                        <div className="flex-[2]">
                            <h2 className="text-sm font-black uppercase text-teal-400 flex items-center gap-2 mb-4 tracking-widest border-b-2 border-[#064e3b] pb-2"><AssetLayers className="w-5 h-5" /> Esquadrão Ativo ({activeDeck.length}/3)</h2>
                            <div className="grid grid-cols-3 gap-3">
                                {[0, 1, 2].map((slotIndex) => {
                                    const card = activeDeck[slotIndex];
                                    return card ? (<FlipCard key={card.id} card={card} isEquipped={true} onClick={() => toggleCard(card)} />) : (<div key={slotIndex} className="h-44 border-4 border-dashed border-[#064e3b] bg-[#022c22]/50 rounded-[1.5rem] flex flex-col items-center justify-center text-[#0f766e] shadow-inner"><AssetLayers className="w-8 h-8 mb-2 opacity-50" /><span className="text-[10px] font-black uppercase">Vazio</span></div>);
                                })}
                            </div>
                        </div>
                        <div className="flex-1 border-l-0 md:border-l-4 border-[#022c22] md:pl-8">
                            <h2 className="text-sm font-black uppercase text-purple-400 flex items-center gap-2 mb-4 tracking-widest border-b-2 border-[#064e3b] pb-2"><AssetSparkles className="w-5 h-5" /> Runas ({activeRunes.length}/3)</h2>
                            <div className="flex flex-col gap-3">
                                {[0, 1, 2].map((slotIndex) => {
                                    const rune = activeRunes[slotIndex];
                                    return rune ? (
                                        <div key={rune.id} onClick={() => toggleRune(rune)} className="bg-purple-950/50 border-2 border-purple-700 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-purple-900/80 transition-colors shadow-md">
                                            <div className="bg-[#020617] p-2 rounded-lg border border-purple-500/50 shadow-inner"><AssetRuneStone className="w-5 h-5" /></div>
                                            <div className="flex flex-col"><span className="text-[10px] font-black text-purple-200 uppercase">{rune.name}</span><span className="text-[9px] font-bold text-purple-400">{rune.desc}</span></div>
                                        </div>
                                    ) : (<div key={slotIndex} className="h-14 border-2 border-dashed border-[#064e3b] bg-[#022c22]/30 rounded-xl flex items-center justify-center text-[#0f766e]"><span className="text-[10px] font-black uppercase tracking-widest">Slot Runa</span></div>);
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <button onClick={() => setTab('chars')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${tab === 'chars' ? 'bg-teal-800 border-teal-500 text-teal-100 border-b-8 -translate-y-1 shadow-[0_0_15px_rgba(20,184,166,0.4)]' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><AssetBoxes className="w-5 h-5"/> Personagens</button>
                    <button onClick={() => setTab('runes')} className={`flex-1 py-4 text-sm font-black uppercase rounded-[2rem] border-4 transition-all flex items-center justify-center gap-2 ${tab === 'runes' ? 'bg-purple-800 border-purple-500 text-purple-100 border-b-8 -translate-y-1 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-[#042f2e] border-[#022c22] border-b-8 text-teal-600 hover:-translate-y-1 hover:border-b-8'}`}><AssetSparkles className="w-5 h-5"/> Runas de Suporte</button>
                </div>

                <AnimatePresence mode="wait">
                    {tab === 'chars' && (
                        <motion.div key="chars" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {myCards.map((card: any) => {
                                    const isEquipped = activeDeck.find((c: any) => c.id === card.id);
                                    return (<div key={card.id} className={isEquipped ? 'opacity-40 grayscale-[50%]' : ''}><FlipCard card={card} isEquipped={isEquipped} onClick={() => toggleCard(card)} /></div>);
                                })}
                            </div>
                        </motion.div>
                    )}

                    {tab === 'runes' && (
                        <motion.div key="runes" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {myRunes.map((rune: any) => {
                                    const isEquipped = activeRunes.find((r: any) => r.id === rune.id);
                                    return (
                                        <div key={rune.id} onClick={() => toggleRune(rune)} className={`bg-[#022c22] border-4 ${isEquipped ? 'border-teal-500 opacity-60' : 'border-[#064e3b] hover:-translate-y-1 hover:border-purple-500'} rounded-2xl p-4 flex flex-col cursor-pointer transition-all shadow-lg`}>
                                            <div className="flex items-center gap-3 mb-3"><div className="bg-[#042f2e] p-3 rounded-xl border-2 border-[#0f766e]"><AssetRuneStone className="w-8 h-8 drop-shadow-md" /></div><div><h3 className="text-sm font-black text-purple-300 uppercase">{rune.name}</h3><span className="text-[10px] font-black bg-purple-900/50 text-purple-200 px-2 py-0.5 rounded-md">Poder de Suporte</span></div></div>
                                            <p className="text-xs text-teal-100 font-bold leading-relaxed mb-3 flex-1">{rune.desc}</p>
                                            <div className="text-center text-[10px] font-black uppercase bg-[#042f2e] py-2 rounded-xl text-teal-500">{isEquipped ? 'Em uso no Círculo' : 'Clique para Equipar'}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}