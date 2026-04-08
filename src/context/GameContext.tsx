"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext<any>(null);

const CHARACTER_POOL = [
  { name: 'Gólem de Quartzo', rarity: 'Comum', element: 'Terra', atk: 15, hp: 60, effectName: 'Enraizar', effectDesc: 'Prende o inimigo com raízes, impedindo o próximo ataque dele.', visual: 'quartz' },
  { name: 'Lâmina de Aether', rarity: 'Comum', element: 'Ar', atk: 25, hp: 30, effectName: 'Vendaval', effectDesc: 'Ataque veloz que ignora parte da armadura.', visual: 'aether' },
  { name: 'Piromante Neon', rarity: 'Comum', element: 'Fogo', atk: 30, hp: 20, effectName: 'Queimar', effectDesc: 'Incendeia o inimigo, causando dano extra por 3 segundos.', visual: 'neon' },
  { name: 'Oráculo das Marés', rarity: 'Rara', element: 'Água', atk: 15, hp: 70, effectName: 'Congelar', effectDesc: 'Congela o alvo, paralisando os ataques inimigos por 4 segundos.', visual: 'tide' },
  { name: 'Vanguarda de Ônix', rarity: 'Rara', element: 'Terra', atk: 25, hp: 90, effectName: 'Muralha', effectDesc: 'Absorve os danos massivos direcionados aos aliados.', visual: 'onyx' },
  { name: 'Assassino do Vazio', rarity: 'Épica', element: 'Ar', atk: 55, hp: 45, effectName: 'Suga-Alma', effectDesc: 'Rouba a vida do inimigo para curar a si próprio.', visual: 'void' },
  { name: 'Dragão de Prisma', rarity: 'Lendária', element: 'Fogo', atk: 90, hp: 120, effectName: 'Sopro Solar', effectDesc: 'Ataque devastador em área que derrete as defesas inimigas.', visual: 'prism' },
  { name: 'Sacerdotisa Lótus', rarity: 'Épica', element: 'Água', atk: 20, hp: 100, effectName: 'Bênção', effectDesc: 'Cura todos os aliados do círculo simultaneamente.', visual: 'lotus' }
];

const RUNE_POOL = [
    { id: 'r_life', name: 'Runa da Vitalidade', buff: 'hp', value: 50, desc: '+50 de Vida (HP) para todos no Círculo.' },
    { id: 'r_power', name: 'Runa da Fúria', buff: 'atk', value: 20, desc: '+20 de Dano (ATK) para todos no Círculo.' },
    { id: 'r_shield', name: 'Runa da Égide', buff: 'shield', value: 100, desc: 'Concede 100 de Escudo inicial extra para a base.' }
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const [gold, setGold] = useState(1500); 
  const [inventory, setInventory] = useState({ terra: 50, carvao: 15, ferro: 10, ouro: 5, pecas_robo: 0, pecas_defesa: 0, item_antigo: 5 });
  const [refinedBars, setRefinedBars] = useState<any>({ ferro: 5, ouro: 2 }); 
  
  const [wave, setWave] = useState(1);
  const [soulShards, setSoulShards] = useState(0); 
  const [offlineReport, setOfflineReport] = useState<any>(null);

  const [myCards, setMyCards] = useState<any[]>([
    { id: 'c1', ...CHARACTER_POOL[0], level: 1 },
    { id: 'c2', ...CHARACTER_POOL[1], level: 1 },
    { id: 'c3', ...CHARACTER_POOL[2], level: 1 },
  ]);
  const [activeDeck, setActiveDeck] = useState<any[]>([]); 

  const [myRunes, setMyRunes] = useState<any[]>([ RUNE_POOL[0], RUNE_POOL[1] ]);
  const [activeRunes, setActiveRunes] = useState<any[]>([]);
  
  const [miningRobots, setMiningRobots] = useState<any[]>([ { id: 'r1', name: 'Golem Menor Mk1', rate: 1 } ]);
  const [safeExpedition, setSafeExpedition] = useState<{ active: boolean, endTime: number, loot: any } | null>(null);

  const [buildings, setBuildings] = useState({
    core: { level: 1, hp: 100, maxHp: 100 }, tower: { level: 0, atk: 0 }, shield: { level: 0, current: 0, max: 0 }
  });

  const [research, setResearch] = useState({ radarCooldown: 0, minerBonus: 0, coreBonus: 0 });

  useEffect(() => {
    const savedData = localStorage.getItem('aethercore_save');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.gold !== undefined) setGold(parsed.gold);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.refinedBars) setRefinedBars(parsed.refinedBars);
        if (parsed.myCards) setMyCards(parsed.myCards);
        if (parsed.activeDeck) setActiveDeck(parsed.activeDeck);
        if (parsed.myRunes) setMyRunes(parsed.myRunes);
        if (parsed.activeRunes) setActiveRunes(parsed.activeRunes);
        if (parsed.buildings) setBuildings(parsed.buildings);
        if (parsed.research) setResearch(parsed.research);
        if (parsed.miningRobots) setMiningRobots(parsed.miningRobots);
        if (parsed.wave) setWave(parsed.wave);
        if (parsed.soulShards) setSoulShards(parsed.soulShards);
        if (parsed.safeExpedition) setSafeExpedition(parsed.safeExpedition);
      } catch (e) { console.error("Erro ao carregar save", e); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = {
        gold, inventory, refinedBars, myCards, activeDeck, myRunes, activeRunes,
        buildings, research, miningRobots, wave, soulShards, safeExpedition,
        lastSaveTime: Date.now()
      };
      localStorage.setItem('aethercore_save', JSON.stringify(dataToSave));
    }
  }, [gold, inventory, refinedBars, myCards, activeDeck, myRunes, activeRunes, buildings, research, miningRobots, wave, soulShards, safeExpedition, isLoaded]);

  const ascendCore = () => {
      if (wave < 5) return;
      const shardsGained = Math.floor(wave / 2);
      setSoulShards((prev: number) => prev + shardsGained);
      setWave(1); setGold(0); setRefinedBars({ ferro: 0, ouro: 0 });
      setBuildings({ core: { level: 1, hp: 100, maxHp: 100 }, tower: { level: 0, atk: 0 }, shield: { level: 0, current: 0, max: 0 }});
      alert(`ASCENSÃO REALIZADA! Você absorveu ${shardsGained} Estilhaços de Alma.`);
  };

  if (!isLoaded) return <div className="h-screen w-screen bg-[#022c22] flex flex-col items-center justify-center text-teal-400 font-black">CARREGANDO...</div>;

  return (
    <GameContext.Provider value={{
      gold, setGold, inventory, setInventory, refinedBars, setRefinedBars, 
      myCards, setMyCards, activeDeck, setActiveDeck, myRunes, setMyRunes, activeRunes, setActiveRunes,
      miningRobots, setMiningRobots, buildings, setBuildings, research, setResearch,
      wave, setWave, soulShards, setSoulShards, ascendCore, offlineReport, setOfflineReport, safeExpedition, setSafeExpedition,
      CHARACTER_POOL, RUNE_POOL
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);