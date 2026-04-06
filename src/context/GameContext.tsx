"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext<any>(null);

// Base de Dados de todas as cartas possíveis no Gacha (Loja)
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
  const [gold, setGold] = useState(1500); // Começa com menos Ouro para incentivar o mercado
  
  const [inventory, setInventory] = useState({ 
    terra: 50, // Um pouco de terra inicial para vender na loja
    carvao: 15, 
    ferro: 10, 
    ouro: 5,
    pecas_robo: 0,
    pecas_defesa: 0,
    item_antigo: 0
  });
  const [refinedBars, setRefinedBars] = useState<any>({ ferro: 5, ouro: 2 }); 
  
  // O jogador começa apenas com duas cartas básicas
  const [myCards, setMyCards] = useState<any[]>([
    { id: 'c1', name: 'Drone de Patrulha', rarity: 'Comum', element: 'Ar', atk: 15, hp: 20 },
    { id: 'c2', name: 'Robô Minerador', rarity: 'Comum', element: 'Terra', atk: 10, hp: 50 },
  ]);
  
  const [activeDeck, setActiveDeck] = useState<any[]>([]); 
  
  const [discoveredMines, setDiscoveredMines] = useState<any[]>([]);
  const [activeMineId, setActiveMineId] = useState<string | null>(null);
  const [exploreCooldown, setExploreCooldown] = useState<number>(0);

  const [miningRobots, setMiningRobots] = useState<any[]>([
    { id: 'r1', name: 'Extrator Mk1', rate: 1 },
    { id: 'r2', name: 'Extrator Mk1', rate: 1 }
  ]);

  const [buildings, setBuildings] = useState({
    core: { level: 1, hp: 100, maxHp: 100 },
    tower: { level: 0, atk: 0 },
    shield: { level: 0, current: 0, max: 0 }
  });

  useEffect(() => {
    let timer: any;
    if (exploreCooldown > 0) {
      timer = setInterval(() => {
        setExploreCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [exploreCooldown]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveredMines((prevMines: any[]) => 
        prevMines.map(mina => {
          if (mina.id === activeMineId && mina.robotId) {
            const robot = miningRobots.find(r => r.id === mina.robotId);
            const rate = robot ? robot.rate : 1;
            return { ...mina, accumulated: mina.accumulated + rate };
          }
          return mina;
        })
      );
    }, 3000); 
    return () => clearInterval(timer);
  }, [activeMineId, miningRobots]);

  return (
    <GameContext.Provider value={{
      gold, setGold, inventory, setInventory, 
      refinedBars, setRefinedBars, myCards, setMyCards,
      activeDeck, setActiveDeck, 
      discoveredMines, setDiscoveredMines, miningRobots, setMiningRobots,
      activeMineId, setActiveMineId,
      exploreCooldown, setExploreCooldown,
      buildings, setBuildings,
      CARD_POOL // Exportamos o pool para a loja aceder
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);