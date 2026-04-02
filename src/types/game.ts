// src/types/game.ts

export type Rarity = 'Comum' | 'Rara' | 'Épica' | 'Lendária';

export type Element = 'Fogo' | 'Água' | 'Terra' | 'Ar';

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  element: Element;
  attack: number;
  hp: number;
  image: string; // Aqui usaremos as imagens geradas por IA
}

export interface Player {
  id: string;
  name: string;
  level: number;
  minerals: number;
  inventory: Card[];
  equippedCardId?: string;
}