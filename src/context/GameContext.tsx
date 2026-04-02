"use client";
import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext<any>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gold, setGold] = useState(5000);
  const [inventory, setInventory] = useState({ carvao: 15, ferro: 10, ouro: 5 });
  const [refinedBars, setRefinedBars] = useState<any>({ ferro: 5, ouro: 2 }); 
  
  // Cartas Iniciais mockadas para teste
  const [myCards, setMyCards] = useState<any[]>([
    { id: 'c1', name: 'Drone de Patrulha', rarity: 'Comum', element: 'Ar', atk: 15, hp: 20 },
    { id: 'c2', name: 'Robô Minerador', rarity: 'Comum', element: 'Terra', atk: 10, hp: 50 },
    { id: 'c3', name: 'Canhão de Plasma', rarity: 'Rara', element: 'Fogo', atk: 35, hp: 15 },
    { id: 'c4', name: 'Barreira Hidráulica', rarity: 'Épica', element: 'Água', atk: 5, hp: 100 },
  ]);
  
  const [activeDeck, setActiveDeck] = useState<any[]>([]); // Cartas equipadas na base
  const [discoveredMines, setDiscoveredMines] = useState(0);

  const [buildings, setBuildings] = useState({
    core: { level: 1, hp: 100, maxHp: 100 },
    tower: { level: 0, atk: 0 },
    shield: { level: 0, current: 0, max: 0 }
  });

  return (
    <GameContext.Provider value={{
      gold, setGold, inventory, setInventory, 
      refinedBars, setRefinedBars, myCards, setMyCards,
      activeDeck, setActiveDeck, discoveredMines, setDiscoveredMines,
      buildings, setBuildings
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);