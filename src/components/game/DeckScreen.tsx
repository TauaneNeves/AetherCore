"use client";

import React from 'react';
import { Layers, Swords, Boxes } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function DeckScreen() {
    const { myCards, activeDeck, setActiveDeck } = useGame();
    const MAX_DECK_SIZE = 3;

    const toggleCard = (card: any) => {
        const isEquipped = activeDeck.find((c: any) => c.id === card.id);
        if (isEquipped) {
            setActiveDeck(activeDeck.filter((c: any) => c.id !== card.id));
        } else {
            if (activeDeck.length < MAX_DECK_SIZE) {
                setActiveDeck([...activeDeck, card]);
            } else {
                alert("Deck cheio! Desequipe uma carta primeiro.");
            }
        }
    };

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'Comum': return 'border-slate-400 text-slate-400 bg-slate-400/10';
            case 'Rara': return 'border-blue-400 text-blue-400 bg-blue-400/10';
            case 'Épica': return 'border-purple-400 text-purple-400 bg-purple-400/10';
            default: return 'border-slate-500 text-slate-500';
        }
    }

    return (
        <div className="p-6 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
            <div className="w-full max-w-3xl flex flex-col gap-8">
                
                <div className="bg-slate-900 border-2 border-indigo-900/50 rounded-3xl p-6 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                            <Layers size={24} /> Defesa Ativa
                        </h2>
                        <span className="text-xs font-bold bg-indigo-950 text-indigo-300 px-3 py-1 rounded-full border border-indigo-800">
                            {activeDeck.length} / {MAX_DECK_SIZE} Slots
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((slotIndex) => {
                            const card = activeDeck[slotIndex];
                            return card ? (
                                <div key={card.id} onClick={() => toggleCard(card)} className={`border-2 ${getRarityColor(card.rarity)} rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform text-center shadow-lg relative overflow-hidden`}>
                                    <div className="absolute top-2 right-2 bg-slate-900 p-1 rounded-full"><Swords size={12}/></div>
                                    <span className="text-[10px] font-black uppercase mb-2">{card.rarity}</span>
                                    <h3 className="text-sm font-black mb-3 text-white">{card.name}</h3>
                                    <div className="flex gap-3 text-xs font-bold">
                                        <span className="text-red-400">⚔️ {card.atk}</span>
                                        <span className="text-emerald-400">❤️ {card.hp}</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={slotIndex} className="border-2 border-dashed border-slate-800 bg-slate-900/50 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-600">
                                    <Layers size={32} className="mb-2 opacity-50"/>
                                    <span className="text-[10px] font-black uppercase">Slot Vazio</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 shadow-xl">
                    <h2 className="text-lg font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Boxes size={20} /> Seu Inventário
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {myCards.map((card: any) => {
                            const isEquipped = activeDeck.find((c: any) => c.id === card.id);
                            return (
                                <div key={card.id} onClick={() => toggleCard(card)} className={`border-2 ${getRarityColor(card.rarity)} ${isEquipped ? 'opacity-30' : 'hover:scale-105'} rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all text-center relative`}>
                                    {isEquipped && <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl font-black uppercase text-xs text-white z-10 backdrop-blur-sm">Equipado</div>}
                                    <span className="text-[10px] font-black uppercase mb-1">{card.rarity}</span>
                                    <h3 className="text-xs font-black mb-3 text-white">{card.name}</h3>
                                    <div className="flex gap-2 text-[10px] font-bold bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                                        <span className="text-red-400">⚔️ {card.atk}</span>
                                        <span className="text-emerald-400">❤️ {card.hp}</span>
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