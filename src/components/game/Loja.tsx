"use client";
import React, { useState } from 'react';
import { Store, Coins, Package, Box, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function Loja() {
  const { gold, setGold, inventory, setInventory, CARD_POOL, setMyCards } = useGame();
  
  const [openingChest, setOpeningChest] = useState<any>(null);
  const [chestStage, setChestStage] = useState<'shaking' | 'revealed'>('shaking');

  // MERCADO NEGRO - Venda de Recursos
  const sellItem = (itemKey: string, amount: number, price: number) => {
    if (inventory[itemKey] >= amount) {
      setInventory((prev: any) => ({ ...prev, [itemKey]: prev[itemKey] - amount }));
      setGold((g: number) => g + price);
    } else {
      alert("Recursos insuficientes para venda!");
    }
  };

  const buyItem = (itemKey: string, amount: number, price: number) => {
    if (gold >= price) {
      setGold((g: number) => g - price);
      setInventory((prev: any) => ({ ...prev, [itemKey]: (prev[itemKey] || 0) + amount }));
    } else {
      alert("Ouro insuficiente!");
    }
  };

  // GACHA - Abertura de Baús
  const openChest = (type: 'comum' | 'epico') => {
    const cost = type === 'comum' ? 500 : 2500;
    if (gold < cost) return alert("Ouro insuficiente para adquirir este baú!");
    
    setGold((g: number) => g - cost);
    setOpeningChest({ type });
    setChestStage('shaking');

    // Lógica de Sorteio (RNG)
    const roll = Math.random() * 100;
    let rarity = 'Comum';
    
    if (type === 'comum') {
        if (roll > 75 && roll <= 95) rarity = 'Rara';
        if (roll > 95) rarity = 'Épica';
    } else {
        rarity = 'Rara'; // Baú épico garante pelo menos Rara
        if (roll > 50 && roll <= 90) rarity = 'Épica';
        if (roll > 90) rarity = 'Lendária';
    }

    const possibleCards = CARD_POOL.filter((c: any) => c.rarity === rarity);
    const selectedCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];

    setTimeout(() => {
        setChestStage('revealed');
        setOpeningChest({ type, card: selectedCard });
        setMyCards((prev: any) => [...prev, { ...selectedCard, id: `c_${Date.now()}` }]);
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
      switch(rarity) {
          case 'Comum': return 'border-slate-400 text-slate-300 bg-slate-800';
          case 'Rara': return 'border-blue-400 text-blue-300 bg-blue-900/50';
          case 'Épica': return 'border-purple-400 text-purple-300 bg-purple-900/50';
          case 'Lendária': return 'border-yellow-400 text-yellow-300 bg-yellow-900/50';
          default: return 'border-slate-500 text-slate-500';
      }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        {/* HEADER DA LOJA */}
        <div className="bg-slate-900 border-2 border-slate-800 p-6 rounded-3xl text-center w-full shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#eab308 1px, transparent 1px)', size: '20px 20px' }}></div>
            <div className="relative z-10 flex flex-col items-center">
                <Store size={48} className="text-yellow-500 mb-4" />
                <h2 className="text-xl font-black uppercase tracking-widest text-white">Mercado Espacial</h2>
                <p className="text-xs text-slate-400 uppercase mt-2 font-bold">Compre Baús ou Venda o seu excedente</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* PAINEL DE GACHA (BAÚS) */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <Package size={16}/> Comprar Guardiões
                </h3>

                <div className="flex flex-col gap-4">
                    {/* Baú Comum */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl">📦</div>
                            <div>
                                <h4 className="text-sm font-black text-white">Caixa de Suprimentos</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Sorteia: Comum a Épico</p>
                            </div>
                        </div>
                        <button onClick={() => openChest('comum')} className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-500 hover:text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-colors">
                            500 <Coins size={14}/>
                        </button>
                    </div>

                    {/* Baú Épico */}
                    <div className="bg-slate-950 border border-purple-900/50 rounded-2xl p-4 flex items-center justify-between group hover:border-purple-600 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <div className="flex items-center gap-4">
                            <div className="text-4xl drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">🧰</div>
                            <div>
                                <h4 className="text-sm font-black text-purple-300">Baú Militar Avançado</h4>
                                <p className="text-[10px] text-purple-500/70 font-bold uppercase mt-1">Garante: Rara ou Superior</p>
                            </div>
                        </div>
                        <button onClick={() => openChest('epico')} className="bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-colors">
                            2.500 <Coins size={14}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* PAINEL DE COMÉRCIO (TROCAS) */}
            <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <ArrowRight size={16}/> Comércio Rápido
                </h3>

                <div className="flex flex-col gap-3">
                    <TradeRow 
                        label="Vender Terra" icon="🪨" costText="10 Terra" rewardText="+5 Ouro" 
                        canAfford={inventory.terra >= 10} 
                        action={() => sellItem('terra', 10, 5)} 
                    />
                    <TradeRow 
                        label="Vender Carvão" icon="⬛" costText="10 Carvão" rewardText="+15 Ouro" 
                        canAfford={inventory.carvao >= 10} 
                        action={() => sellItem('carvao', 10, 15)} 
                    />
                    <div className="h-px bg-slate-800 my-2"></div>
                    <TradeRow 
                        label="Comprar Peça Robô" icon="⚙️" costText="150 Ouro" rewardText="+1 Peça" 
                        canAfford={gold >= 150} 
                        action={() => buyItem('pecas_robo', 1, 150)} 
                        isBuy
                    />
                </div>
            </div>

        </div>
      </div>

      {/* MODAL DE ABERTURA DE BAÚ */}
      <AnimatePresence>
        {openingChest && (
            <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                {chestStage === 'shaking' ? (
                    <motion.div 
                        animate={{ x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                        className="text-8xl drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                    >
                        {openingChest.type === 'comum' ? '📦' : '🧰'}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <Sparkles size={48} className="text-yellow-400 mb-6 animate-pulse" />
                        <div className={`w-48 h-64 border-4 ${getRarityColor(openingChest.card.rarity)} rounded-2xl p-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] relative bg-slate-900`}>
                            <div className="absolute top-2 right-2 bg-slate-950 p-2 rounded-full"><Shield size={16}/></div>
                            <span className="text-[10px] font-black uppercase mb-4 tracking-widest">{openingChest.card.rarity}</span>
                            <h3 className="text-lg font-black mb-6 text-white text-center leading-tight">{openingChest.card.name}</h3>
                            <div className="flex gap-4 text-sm font-bold bg-slate-950 p-2 rounded-xl border border-slate-800">
                                <span className="text-red-400">⚔️ {openingChest.card.atk}</span>
                                <span className="text-emerald-400">❤️ {openingChest.card.hp}</span>
                            </div>
                        </div>
                        <button onClick={() => setOpeningChest(null)} className="mt-8 bg-white text-slate-900 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-transform">
                            Coletar Carta
                        </button>
                    </motion.div>
                )}
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TradeRow = ({ label, icon, costText, rewardText, canAfford, action, isBuy = false }: any) => (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="text-xl">{icon}</div>
            <div className="flex flex-col">
                <span className="text-xs font-black text-white">{label}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{costText} ➔ {rewardText}</span>
            </div>
        </div>
        <button 
            onClick={action} disabled={!canAfford}
            className={`${isBuy ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600' : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600'} hover:text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-colors disabled:opacity-30 disabled:grayscale`}
        >
            {isBuy ? 'Comprar' : 'Vender'}
        </button>
    </div>
);