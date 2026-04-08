"use client";

import React from 'react';
import { Layers, Boxes, Sparkles } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function DeckScreen() {
    const { myCards, setMyCards, activeDeck, setActiveDeck } = useGame();
    const MAX_DECK_SIZE = 3;

    const toggleCard = (card: any) => {
        const isEquipped = activeDeck.find((c: any) => c.id === card.id);
        if (isEquipped) {
            setActiveDeck(activeDeck.filter((c: any) => c.id !== card.id));
        } else {
            if (activeDeck.length < MAX_DECK_SIZE) {
                setActiveDeck([...activeDeck, card]);
            } else {
                alert("Círculo cheio! Remova uma runa primeiro.");
            }
        }
    };

    const autoMergeCards = () => {
        let cards = [...myCards];
        let mergedAnything = false;
        let done = false;

        while (!done) {
            let foundMerge = false;
            for (let i = 0; i < cards.length; i++) {
                for (let j = i + 1; j < cards.length; j++) {
                    const c1 = cards[i];
                    const c2 = cards[j];
                    
                    if (c1.name === c2.name && c1.level === c2.level && 
                        !activeDeck.find((a:any) => a.id === c1.id) && 
                        !activeDeck.find((a:any) => a.id === c2.id)) {
                        
                        const newCard = {
                            ...c1,
                            id: `c_merge_${Date.now()}_${Math.random()}`,
                            level: c1.level + 1,
                            atk: c1.atk * 2,
                            hp: c1.hp * 2
                        };
                        
                        cards.splice(j, 1);
                        cards.splice(i, 1);
                        cards.push(newCard);
                        
                        foundMerge = true;
                        mergedAnything = true;
                        break;
                    }
                }
                if (foundMerge) break; 
            }
            if (!foundMerge) done = true;
        }

        if (mergedAnything) {
            setMyCards(cards);
            alert("✨ SÍNTESE CONCLUÍDA! As suas runas uniram-se e evoluíram!");
        } else {
            alert("Não existem runas duplicadas e do mesmo nível (fora do círculo) para sintetizar.");
        }
    };

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'Comum': return 'bg-[#0f766e] border-[#042f2e] text-teal-100';
            case 'Rara': return 'bg-[#0ea5e9] border-[#075985] text-sky-100';
            case 'Épica': return 'bg-[#a855f7] border-[#581c87] text-purple-100';
            case 'Lendária': return 'bg-[#f59e0b] border-[#92400e] text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
            default: return 'bg-slate-400 border-slate-600 text-slate-900';
        }
    };

    const getAvatarUrl = (seed: string) => {
        return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${seed}&radius=20`;
    };

    return (
        <div className="p-6 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
            <div className="w-full max-w-4xl flex flex-col gap-8">
                
                {/* DECK ATIVO */}
                <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b-4 border-[#022c22]">
                        <h2 className="text-2xl font-black uppercase text-purple-400 flex items-center gap-3 drop-shadow-sm">
                            <Layers size={28} strokeWidth={3} /> Círculo de Invocação
                        </h2>
                        <span className="text-sm font-black bg-purple-900 text-purple-200 px-4 py-2 rounded-2xl border-4 border-purple-700 shadow-sm">
                            {activeDeck.length} / {MAX_DECK_SIZE} Slots
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((slotIndex) => {
                            const card = activeDeck[slotIndex];
                            return card ? (
                                <div key={card.id} onClick={() => toggleCard(card)} className={`border-4 border-b-[8px] ${getRarityColor(card.rarity)} rounded-3xl p-3 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 transition-all text-center shadow-lg relative overflow-hidden group`}>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    
                                    <div className="w-20 h-20 bg-black/20 rounded-2xl mb-2 flex items-center justify-center overflow-hidden border-4 border-black/20 shadow-inner">
                                        <img src={getAvatarUrl(card.name)} alt={card.name} className="w-16 h-16 drop-shadow-md opacity-90" />
                                    </div>

                                    <span className="text-[10px] font-black uppercase mb-1 bg-black/20 px-2 py-0.5 rounded-full w-max text-white/90">{card.rarity}</span>
                                    <div className="flex justify-center text-[10px] mb-2 text-yellow-200 drop-shadow-md tracking-tighter">
                                        {Array(card.level || 1).fill('⭐').join('')}
                                    </div>
                                    <h3 className="text-xs font-black mb-3 leading-tight">{card.name}</h3>
                                    
                                    <div className="flex gap-2 text-[11px] font-black w-full justify-center">
                                        <span className="text-rose-200 bg-rose-950/50 px-2 py-1 rounded-xl shadow-sm border border-rose-900/50">ATK {card.atk}</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={slotIndex} className="border-4 border-dashed border-[#064e3b] bg-[#022c22]/50 rounded-3xl p-8 flex flex-col items-center justify-center text-[#0f766e] shadow-inner">
                                    <Layers size={40} className="mb-3 opacity-50" strokeWidth={2}/>
                                    <span className="text-xs font-black uppercase">Slot Vazio</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* INVENTÁRIO DE CARTAS */}
                <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b-4 border-[#022c22] gap-4">
                        <h2 className="text-xl font-black uppercase text-teal-100 flex items-center gap-3 drop-shadow-sm">
                            <Boxes size={24} strokeWidth={3} /> Grimório de Runas
                        </h2>
                        
                        <button 
                            onClick={autoMergeCards}
                            className="bg-purple-600 hover:bg-purple-500 text-purple-100 border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 px-5 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        >
                            <Sparkles size={20} strokeWidth={3}/> Sintetizar Duplicatas
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {myCards.map((card: any) => {
                            const isEquipped = activeDeck.find((c: any) => c.id === card.id);
                            return (
                                <div key={card.id} onClick={() => toggleCard(card)} className={`border-4 border-b-8 ${getRarityColor(card.rarity)} ${isEquipped ? 'opacity-40 grayscale-[50%]' : 'hover:-translate-y-1'} rounded-3xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all text-center relative group`}>
                                    {isEquipped && <div className="absolute inset-0 bg-[#022c22]/80 flex items-center justify-center rounded-[1.5rem] font-black uppercase text-sm text-teal-300 z-10 backdrop-blur-sm border-4 border-[#064e3b] shadow-inner">Invocado</div>}
                                    
                                    <div className="w-16 h-16 bg-black/20 rounded-2xl mb-2 flex items-center justify-center overflow-hidden border-4 border-black/10 shadow-inner">
                                        <img src={getAvatarUrl(card.name)} alt={card.name} className="w-12 h-12 drop-shadow-md opacity-90" />
                                    </div>

                                    <span className="text-[9px] font-black uppercase mb-1 bg-black/20 px-2 py-0.5 rounded-full text-white/90">{card.rarity}</span>
                                    <div className="flex justify-center text-[8px] mb-1 text-yellow-200 drop-shadow-md tracking-tighter">
                                        {Array(card.level || 1).fill('⭐').join('')}
                                    </div>
                                    <h3 className="text-[11px] font-black mb-2 leading-tight px-1">{card.name}</h3>
                                    
                                    <div className="flex gap-2 text-[10px] font-black w-full justify-center">
                                        <span className="text-rose-200 bg-rose-950/50 px-2 py-1 rounded-xl shadow-sm border border-rose-900/50">ATK {card.atk}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}