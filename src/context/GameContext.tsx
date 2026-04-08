"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext<any>(null);

const CARD_POOL = [
  { name: 'Drone de Patrulha', rarity: 'Comum', element: 'Ar', atk: 15, hp: 20 },
  { name: 'Robô Minerador', rarity: 'Comum', element: 'Terra', atk: 10, hp: 50 },
  { name: 'Sentinela de Sucata', rarity: 'Comum', element: 'Fogo', atk: 20, hp: 15 },
  { name: 'Canhão de Plasma', rarity: 'Rara', element: 'Fogo', atk: 35, hp: 15 },
  { name: 'Mercenário Espacial', rarity: 'Rara', element: 'Ar', atk: 25, hp: 30 },
  { name: 'Torreta Gélida', rarity: 'Rara', element: 'Água', atk: 20, hp: 40 },
  { name: 'Barreira Hidráulica', rarity: 'Épica', element: 'Água', atk: 5, hp: 100 },
  { name: 'Mecha Colossal', rarity: 'Épica', element: 'Terra', atk: 60, hp: 150 },
  { name: 'Cruzador de Batalha', rarity: 'Lendária', element: 'Fogo', atk: 120, hp: 80 },
  { name: 'Guardião Aether', rarity: 'Lendária', element: 'Ar', atk: 100, hp: 200 },
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // RECURSOS BÁSICOS
  const [gold, setGold] = useState(1500); 
  const [inventory, setInventory] = useState({ 
    terra: 50, carvao: 15, ferro: 10, ouro: 5, pecas_robo: 0, pecas_defesa: 0, item_antigo: 5
  });
  const [refinedBars, setRefinedBars] = useState<any>({ ferro: 5, ouro: 2 }); 
  
  // SISTEMA DE PROGRESSÃO E PRESTÍGIO
  const [wave, setWave] = useState(1);
  const [soulShards, setSoulShards] = useState(0); 
  const [offlineReport, setOfflineReport] = useState<any>(null);

  // CARTAS E EXÉRCITO
  const [myCards, setMyCards] = useState<any[]>([
    { id: 'c1', name: 'Drone de Patrulha', rarity: 'Comum', element: 'Ar', atk: 15, hp: 20, level: 1 },
    { id: 'c2', name: 'Robô Minerador', rarity: 'Comum', element: 'Terra', atk: 10, hp: 50, level: 1 },
    { id: 'c3', name: 'Sentinela de Sucata', rarity: 'Comum', element: 'Fogo', atk: 20, hp: 15, level: 1 },
  ]);
  const [activeDeck, setActiveDeck] = useState<any[]>([]); 
  
  // MAPA E MINERAÇÃO
  const [discoveredMines, setDiscoveredMines] = useState<any[]>([]);
  const [activeMineId, setActiveMineId] = useState<string | null>(null);
  const [exploreCooldown, setExploreCooldown] = useState<number>(0);
  const [miningRobots, setMiningRobots] = useState<any[]>([
    { id: 'r1', name: 'Golem Menor Mk1', rate: 1 },
    { id: 'r2', name: 'Golem Menor Mk1', rate: 1 }
  ]);

  // BASE
  const [buildings, setBuildings] = useState({
    core: { level: 1, hp: 100, maxHp: 100 },
    tower: { level: 0, atk: 0 },
    shield: { level: 0, current: 0, max: 0 }
  });

  const [research, setResearch] = useState({
    radarCooldown: 0, minerBonus: 0, coreBonus: 0      
  });

  // CARREGAR DADOS E CALCULAR PROGRESSO OFFLINE
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
        if (parsed.buildings) setBuildings(parsed.buildings);
        if (parsed.research) setResearch(parsed.research);
        if (parsed.miningRobots) setMiningRobots(parsed.miningRobots);
        if (parsed.wave) setWave(parsed.wave);
        if (parsed.soulShards) setSoulShards(parsed.soulShards);

        // CÁLCULO DE OFFLINE GAINS (Se ficou fora mais de 60 segundos)
        if (parsed.lastSaveTime && parsed.miningRobots && parsed.miningRobots.length > 0) {
            const now = Date.now();
            const diffSeconds = Math.floor((now - parsed.lastSaveTime) / 1000);
            
            if (diffSeconds > 60) {
                // Cada robô minera a cada 3 segundos.
                const totalCycles = Math.floor(diffSeconds / 3);
                const baseRatePerCycle = parsed.miningRobots.reduce((acc: number, r: any) => acc + r.rate, 0);
                const totalMined = totalCycles * (baseRatePerCycle + (parsed.research?.minerBonus || 0));
                
                if (totalMined > 0) {
                    // Distribui o total minerado
                    const ouroGained = Math.floor(totalMined * 0.15);
                    const ferroGained = Math.floor(totalMined * 0.35);
                    const carvaoGained = Math.floor(totalMined * 0.50);

                    setInventory((prev: any) => ({
                        ...prev,
                        ouro: (prev.ouro || 0) + ouroGained,
                        ferro: (prev.ferro || 0) + ferroGained,
                        carvao: (prev.carvao || 0) + carvaoGained
                    }));

                    setOfflineReport({ tempo: diffSeconds, ouro: ouroGained, ferro: ferroGained, carvao: carvaoGained });
                }
            }
        }
      } catch (e) { console.error("Erro ao carregar save", e); }
    }
    setIsLoaded(true);
  }, []);

  // SALVAR DADOS AUTOMATICAMENTE
  useEffect(() => {
    if (isLoaded) {
      const dataToSave = {
        gold, inventory, refinedBars, myCards, activeDeck,
        buildings, research, miningRobots, wave, soulShards,
        lastSaveTime: Date.now()
      };
      localStorage.setItem('aethercore_save', JSON.stringify(dataToSave));
    }
  }, [gold, inventory, refinedBars, myCards, activeDeck, buildings, research, miningRobots, wave, soulShards, isLoaded]);

  // COOLDOWN DE EXPLORAÇÃO
  useEffect(() => {
    let timer: any;
    if (exploreCooldown > 0) {
      timer = setInterval(() => { setExploreCooldown((prev) => prev - 1); }, 1000);
    }
    return () => clearInterval(timer);
  }, [exploreCooldown]);

  // MINERAÇÃO IDLE
  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveredMines((prevMines: any[]) => 
        prevMines.map(mina => {
          if (mina.id === activeMineId && mina.robotId) {
            const robot = miningRobots.find(r => r.id === mina.robotId);
            const rate = (robot ? robot.rate : 1) + research.minerBonus;
            return { ...mina, accumulated: mina.accumulated + rate };
          }
          return mina;
        })
      );
    }, 3000); 
    return () => clearInterval(timer);
  }, [activeMineId, miningRobots, research.minerBonus]);

  // FUNÇÃO DE ASCENSÃO (PRESTÍGIO)
  const ascendCore = () => {
      if (wave < 5) return;
      
      const shardsGained = Math.floor(wave / 2);
      setSoulShards(prev => prev + shardsGained);
      
      // Reseta a Base
      setWave(1);
      setGold(0);
      setRefinedBars({ ferro: 0, ouro: 0 });
      setBuildings({
          core: { level: 1, hp: 100, maxHp: 100 },
          tower: { level: 0, atk: 0 },
          shield: { level: 0, current: 0, max: 0 }
      });
      alert(`ASCENSÃO REALIZADA! O núcleo explodiu e você absorveu ${shardsGained} Estilhaços de Alma. Todo o seu dano base será amplificado!`);
  };

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen bg-[#022c22] flex flex-col items-center justify-center text-teal-400 font-black">
        <div className="animate-spin text-4xl mb-4">✨</div>
        DESPERTANDO O NÚCLEO...
      </div>
    );
  }

  return (
    <GameContext.Provider value={{
      gold, setGold, inventory, setInventory, 
      refinedBars, setRefinedBars, myCards, setMyCards,
      activeDeck, setActiveDeck, 
      discoveredMines, setDiscoveredMines, miningRobots, setMiningRobots,
      activeMineId, setActiveMineId,
      exploreCooldown, setExploreCooldown,
      buildings, setBuildings,
      research, setResearch,
      wave, setWave,
      soulShards, setSoulShards, ascendCore,
      offlineReport, setOfflineReport,
      CARD_POOL
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);