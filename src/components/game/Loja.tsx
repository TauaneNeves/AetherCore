"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { 
    AssetPoeiraVital, AssetMusgo, AssetEssenciaSombria, AssetNucleoGolem, AssetReliquia, 
    AssetArrowRight, AssetSparkles, AssetRuneStone,
    AssetCharQuartz, AssetCharAether, AssetCharNeon, AssetCharTide, AssetCharOnyx, AssetCharVoid, AssetCharPrism, AssetCharLotus,
    AssetIconATK, AssetIconHP
} from './GameAssets';

const CustomStoreIcon = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10 40 L90 40 L80 90 L20 90 Z" fill="currentColor" opacity="0.2"/>
      <path d="M10 40 L20 10 L80 10 L90 40" />
      <path d="M30 40 V90 M50 40 V90 M70 40 V90" strokeWidth="4"/>
    </svg>
);

export default function Loja() {
  const { gold, setGold, inventory, setInventory, CHARACTER_POOL, RUNE_POOL, setMyCards, setMyRunes } = useGame();
  
  const [openingChest, setOpeningChest] = useState<any>(null);
  const [chestStage, setChestStage] = useState<'shaking' | 'revealed'>('shaking');

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

  const sellItem = (itemKey: string, amount: number, price: number) => {
    if (inventory[itemKey] >= amount) {
      setInventory((prev: any) => ({ ...prev, [itemKey]: prev[itemKey] - amount }));
      setGold((g: number) => g + price);
    } else { alert("Recursos insuficientes para transacionar!"); }
  };

  const buyItem = (itemKey: string, amount: number, price: number) => {
    if (gold >= price) {
      setGold((g: number) => g - price);
      setInventory((prev: any) => ({ ...prev, [itemKey]: (prev[itemKey] || 0) + amount }));
    } else { alert("Poeira Vital insuficiente!"); }
  };

  const openChest = (type: 'runa' | 'personagem') => {
    const cost = type === 'runa' ? 500 : 2500;
    if (gold < cost) return alert("Poeira Vital insuficiente para adquirir este relicário!");
    
    setGold((g: number) => g - cost);
    setOpeningChest({ type });
    setChestStage('shaking');

    setTimeout(() => {
        setChestStage('revealed');
        if (type === 'runa') {
            const selected = RUNE_POOL[Math.floor(Math.random() * RUNE_POOL.length)];
            setOpeningChest({ type, item: selected, isRune: true });
            setMyRunes((prev: any) => [...prev, { ...selected, id: `r_${Date.now()}` }]);
        } else {
            const roll = Math.random() * 100;
            let rarity = 'Rara'; 
            if (roll > 50 && roll <= 90) rarity = 'Épica';
            if (roll > 90) rarity = 'Lendária';

            const possible = CHARACTER_POOL.filter((c: any) => c.rarity === rarity);
            const selected = possible.length > 0 ? possible[Math.floor(Math.random() * possible.length)] : CHARACTER_POOL[0];
            
            setOpeningChest({ type, item: selected, isRune: false });
            setMyCards((prev: any) => [...prev, { ...selected, id: `c_${Date.now()}`, level: 1 }]);
        }
    }, 2000);
  };

  const getRarityColor = (rarity: string) => {
      switch(rarity) {
        case 'Comum': return 'bg-[#0f766e] border-[#042f2e] text-teal-100';
        case 'Rara': return 'bg-[#0ea5e9] border-[#075985] text-sky-100';
        case 'Épica': return 'bg-[#a855f7] border-[#581c87] text-purple-100';
        case 'Lendária': return 'bg-[#f59e0b] border-[#92400e] text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.4)]';
        default: return 'bg-purple-900 border-purple-700 text-purple-200'; 
      }
  };

  return (
    <div className="p-4 flex flex-col items-center h-full overflow-y-auto no-scrollbar pb-32">
      <div className="w-full max-w-5xl flex flex-col gap-6">
        
        <div className="bg-[#042f2e] border-4 border-[#022c22] p-8 rounded-[2.5rem] text-center w-full shadow-xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#2dd4bf 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            <div className="bg-teal-800 p-4 rounded-[2rem] border-4 border-teal-600 shadow-md mb-4 relative z-10"><CustomStoreIcon className="w-12 h-12 text-teal-200" /></div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-teal-100 relative z-10">Bazar Ancestral</h2>
            <p className="text-sm text-teal-600 font-bold mt-2 relative z-10">Adquira selos perdidos ou troque os seus materiais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl flex flex-col">
                <h3 className="text-base font-black uppercase tracking-widest text-teal-500 mb-6 flex items-center gap-2"><AssetRuneStone className="w-5 h-5"/> Relicários</h3>
                <div className="flex flex-col gap-4">
                    <div className="bg-[#022c22] border-4 border-[#064e3b] rounded-[2rem] p-5 flex items-center justify-between group shadow-lg">
                        <div className="flex items-center gap-4"><AssetRuneStone className="w-12 h-12 text-teal-500 drop-shadow-md" /><div><h4 className="text-sm font-black text-teal-100 uppercase">Baú Rúnico</h4><p className="text-[10px] text-teal-600 font-bold uppercase mt-1 bg-[#042f2e] px-2 py-0.5 rounded-full border-2 border-[#022c22] w-max">Garante: Runa de Suporte</p></div></div>
                        <button onClick={() => openChest('runa')} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border-4 border-teal-800 border-b-8 active:border-b-4 active:translate-y-1 shadow-sm">500 <AssetPoeiraVital className="w-4 h-4" /></button>
                    </div>

                    <div className="bg-[#022c22] border-4 border-purple-900/50 rounded-[2rem] p-5 flex items-center justify-between group shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                        <div className="flex items-center gap-4"><AssetReliquia className="w-12 h-12 text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" /><div><h4 className="text-sm font-black text-purple-300 uppercase">Relicário Arcano</h4><p className="text-[10px] text-purple-400 font-bold uppercase mt-1 bg-[#042f2e] px-2 py-0.5 rounded-full border-2 border-[#022c22] w-max">Garante: Personagem Mágico</p></div></div>
                        <button onClick={() => openChest('personagem')} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 shadow-sm">2.500 <AssetPoeiraVital className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>

            <div className="bg-[#042f2e] border-4 border-[#022c22] rounded-[2.5rem] p-6 shadow-xl flex flex-col">
                <h3 className="text-base font-black uppercase tracking-widest text-teal-500 mb-6 flex items-center gap-2"><AssetArrowRight className="w-5 h-5"/> Comércio de Recursos</h3>
                <div className="flex flex-col gap-3">
                    <TradeRow label="Ceder Musgo" icon={<AssetMusgo className="w-8 h-8" />} costText="10 Musgos" rewardText="+5 Poeira" canAfford={inventory.terra >= 10} action={() => sellItem('terra', 10, 5)} />
                    <TradeRow label="Ceder Essência" icon={<AssetEssenciaSombria className="w-8 h-8" />} costText="10 Essências" rewardText="+15 Poeira" canAfford={inventory.carvao >= 10} action={() => sellItem('carvao', 10, 15)} />
                    <div className="h-2 bg-[#022c22] rounded-full my-2 border-2 border-[#064e3b]"></div>
                    <TradeRow label="Comprar Núcleo" icon={<AssetNucleoGolem className="w-8 h-8" />} costText="150 Poeira" rewardText="+1 Núcleo" canAfford={gold >= 150} action={() => buyItem('pecas_robo', 1, 150)} isBuy />
                </div>
            </div>
        </div>
      </div>

      <AnimatePresence>
        {openingChest && (
            <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
                {chestStage === 'shaking' ? (
                    <motion.div animate={{ x: [-10, 10, -10, 10, 0], y: [-5, 5, -5, 5, 0], scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: 3 }} className="text-[8rem] drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                        {openingChest.type === 'runa' ? <AssetRuneStone className="w-32 h-32" /> : <AssetReliquia className="w-32 h-32" />}
                    </motion.div>
                ) : (
                    <motion.div initial={{ scale: 0.5, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="flex flex-col items-center">
                        <AssetSparkles className="w-16 h-16 text-yellow-400 mb-6 animate-pulse" />
                        <div className={`w-56 h-72 border-4 border-b-[12px] ${getRarityColor(openingChest.item.rarity || 'Comum')} rounded-[2rem] p-4 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)] relative`}>
                            <div className="absolute top-3 right-3 bg-black/20 p-2 rounded-xl shadow-inner"><AssetReliquia className="w-4 h-4 opacity-80"/></div>
                            <div className="w-24 h-24 bg-black/20 rounded-2xl mb-4 flex items-center justify-center overflow-hidden border-4 border-black/20 shadow-inner mt-1">
                                {openingChest.isRune ? <AssetRuneStone className="w-16 h-16 drop-shadow-md" /> : renderCharacterVisual(openingChest.item.visual)}
                            </div>
                            <span className="text-[10px] font-black uppercase mb-2 bg-black/20 text-white/90 px-3 py-1 rounded-full">{openingChest.item.rarity || 'Runa'}</span>
                            <h3 className="text-[14px] font-black mb-2 text-center leading-tight px-1 text-white">{openingChest.item.name}</h3>
                            {openingChest.isRune ? (
                                <p className="text-[10px] text-center text-teal-100 font-bold px-2">{openingChest.item.desc}</p>
                            ) : (
                                <div className="flex gap-2 text-[11px] font-black w-full justify-center">
                                    <span className="text-rose-200 bg-rose-950/50 px-2 py-1 rounded shadow-sm border border-rose-900/50 flex items-center gap-1"><AssetIconATK className="w-3 h-3"/> {openingChest.item.atk}</span>
                                    <span className="text-emerald-200 bg-emerald-950/50 px-2 py-1 rounded shadow-sm border border-emerald-900/50 flex items-center gap-1"><AssetIconHP className="w-3 h-3"/> {openingChest.item.hp}</span>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setOpeningChest(null)} className="mt-8 bg-purple-600 text-white border-4 border-purple-800 border-b-8 active:border-b-4 active:translate-y-1 px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-xl">
                            Coletar Recompensa
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
    <div className="bg-[#022c22] border-4 border-[#064e3b] rounded-2xl p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4"><div className="flex items-center justify-center bg-[#042f2e] p-2 rounded-xl border-2 border-[#0f766e] shadow-sm">{icon}</div><div className="flex flex-col"><span className="text-sm font-black text-teal-100 uppercase">{label}</span><span className="text-[10px] font-black text-teal-600 uppercase mt-1">{costText} ➔ {rewardText}</span></div></div>
        <button onClick={action} disabled={!canAfford} className={`${isBuy ? 'bg-purple-600 border-purple-800 text-white' : 'bg-teal-600 border-teal-800 text-white'} border-4 border-b-8 active:border-b-4 active:translate-y-1 px-4 py-3 rounded-2xl text-xs font-black uppercase transition-all disabled:opacity-30 disabled:grayscale shadow-sm`}>{isBuy ? 'Comprar' : 'Vender'}</button>
    </div>
);