"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext<any>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gold, setGold] = useState(5000);
  
  // Inventário Expandido
  const [inventory, setInventory] = useState({ 
    terra: 0,
    carvao: 15, 
    ferro: 10, 
    ouro: 5,
    pecas_robo: 0,
    pecas_defesa: 0,
    item_antigo: 0
  });
  const [refinedBars, setRefinedBars] = useState<any>({ ferro: 5, ouro: 2 }); 
  
  const [myCards, setMyCards] = useState<any[]>([
    { id: 'c1', name: 'Drone de Patrulha', rarity: 'Comum', element: 'Ar', atk: 15, hp: 20 },
    { id: 'c2', name: 'Robô Minerador', rarity: 'Comum', element: 'Terra', atk: 10, hp: 50 },
    { id: 'c3', name: 'Canhão de Plasma', rarity: 'Rara', element: 'Fogo', atk: 35, hp: 15 },
    { id: 'c4', name: 'Barreira Hidráulica', rarity: 'Épica', element: 'Água', atk: 5, hp: 100 },
    { id: 'c5', name: 'Mercenário Espacial', rarity: 'Rara', element: 'Fogo', atk: 25, hp: 30 },
  ]);
  
  const [activeDeck, setActiveDeck] = useState<any[]>([]); 
  
  // Estados de Mineração
  const [discoveredMines, setDiscoveredMines] = useState<any[]>([]);
  const [activeMineId, setActiveMineId] = useState<string | null>(null); // Mina que o jogador está vendo agora
  const [exploreCooldown, setExploreCooldown] = useState<number>(0); // Tempo de recarga do radar em segundos

  const [miningRobots, setMiningRobots] = useState<any[]>([
    { id: 'r1', name: 'Extrator Mk1', rate: 1 },
    { id: 'r2', name: 'Extrator Mk1', rate: 1 }
  ]);

  const [buildings, setBuildings] = useState({
    core: { level: 1, hp: 100, maxHp: 100 },
    tower: { level: 0, atk: 0 },
    shield: { level: 0, current: 0, max: 0 }
  });

  // Loop do Cooldown do Radar
  useEffect(() => {
    let timer: any;
    if (exploreCooldown > 0) {
      timer = setInterval(() => {
        setExploreCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [exploreCooldown]);

  // Loop Global de Mineração (Robôs) - Focado na Mina Ativa
  useEffect(() => {
    const timer = setInterval(() => {
      setDiscoveredMines((prevMines: any[]) => 
        prevMines.map(mina => {
          if (mina.id === activeMineId && mina.robotId) {
            return { ...mina, accumulated: mina.accumulated + 1 };
          }
          return mina;
        })
      );
    }, 3000); 
    return () => clearInterval(timer);
  }, [activeMineId]);

  return (
    <GameContext.Provider value={{
      gold, setGold, inventory, setInventory, 
      refinedBars, setRefinedBars, myCards, setMyCards,
      activeDeck, setActiveDeck, 
      discoveredMines, setDiscoveredMines, miningRobots, setMiningRobots,
      activeMineId, setActiveMineId,
      exploreCooldown, setExploreCooldown,
      buildings, setBuildings
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);