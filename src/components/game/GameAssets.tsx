"use client";
import React from 'react';

// --- RECURSOS DO INVENTÁRIO (CRYSTAL-PUNK) ---

export const AssetPoeiraVital = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="40" fill="url(#glowPoeira)" opacity="0.6"/>
    <path d="M50 15 L56 44 L85 50 L56 56 L50 85 L44 56 L15 50 L44 44 Z" fill="#d8b4fe" />
    <path d="M50 28 L53 47 L72 50 L53 53 L50 72 L47 53 L28 50 L47 47 Z" fill="#ffffff" />
    <circle cx="25" cy="25" r="4" fill="#e9d5ff" className="animate-ping" style={{ animationDuration: '2s' }}/>
    <circle cx="75" cy="80" r="3" fill="#e9d5ff" className="animate-pulse" />
    <circle cx="80" cy="30" r="5" fill="#e9d5ff" className="animate-pulse" style={{ animationDelay: '0.5s' }}/>
    <defs>
      <radialGradient id="glowPoeira">
        <stop offset="0%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
  </svg>
);

export const AssetEssenciaSombria = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="45" fill="#0f172a" />
    <path d="M50 10 C 70 10 90 30 90 50 C 90 60 80 65 75 55 C 70 45 60 30 50 30 C 40 30 30 45 25 55 C 20 65 10 60 10 50 C 10 30 30 10 50 10 Z" fill="#1e1b4b" className="animate-pulse" />
    <path d="M50 90 C 30 90 10 70 10 50 C 10 40 20 35 25 45 C 30 55 40 70 50 70 C 60 70 70 55 75 45 C 80 35 90 40 90 50 C 90 70 70 90 50 90 Z" fill="#312e81" className="animate-pulse" style={{ animationDelay: '0.3s' }}/>
    <circle cx="50" cy="50" r="15" fill="#020617" stroke="#4c1d95" strokeWidth="2"/>
  </svg>
);

export const AssetCristalAether = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="35" fill="url(#glowCristal)" opacity="0.4"/>
    <polygon points="50,10 75,40 50,90 25,40" fill="#2dd4bf" stroke="#042f2e" strokeWidth="3"/>
    <polygon points="50,10 50,90 25,40" fill="#14b8a6" opacity="0.7"/>
    <polygon points="50,10 75,40 50,50" fill="#5eead4" opacity="0.8"/>
    <polygon points="45,25 50,15 50,45 45,45" fill="#ccfbf1" opacity="0.9"/>
    <defs>
      <radialGradient id="glowCristal">
        <stop offset="0%" stopColor="#2dd4bf" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>
  </svg>
);

export const AssetFragmentoRunico = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="20,30 50,10 80,30 85,70 50,90 15,70" fill="#334155" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round"/>
    <polygon points="20,30 50,10 50,90 15,70" fill="#1e293b" opacity="0.6"/>
    <path d="M40 35 L60 35 L45 65 L65 65" fill="none" stroke="#2dd4bf" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"/>
    <circle cx="50" cy="50" r="3" fill="#ccfbf1" className="animate-ping" style={{ animationDuration: '3s' }}/>
  </svg>
);

export const AssetMusgo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M15 60 Q 50 40 85 60 Q 90 85 50 90 Q 10 85 15 60 Z" fill="#064e3b" stroke="#022c22" strokeWidth="4"/>
    <path d="M10 55 Q 30 30 50 45 T 90 55 Q 70 70 50 60 T 10 55 Z" fill="#059669" stroke="#065f46" strokeWidth="3"/>
    <path d="M20 50 Q 30 40 40 55" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round"/>
    <path d="M60 50 Q 70 40 80 55" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="30" cy="48" r="2" fill="#a7f3d0" className="animate-pulse"/>
    <circle cx="70" cy="48" r="2" fill="#a7f3d0" className="animate-pulse" style={{ animationDelay: '1s' }}/>
  </svg>
);

export const AssetNucleoGolem = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="40" fill="#022c22" stroke="#0f766e" strokeWidth="4"/>
    <path d="M50 20 L60 40 L80 50 L60 60 L50 80 L40 60 L20 50 L40 40 Z" fill="#14b8a6"/>
    <circle cx="50" cy="50" r="8" fill="#a855f7" className="animate-pulse"/>
  </svg>
);

export const AssetSeloDefesa = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M20 20 L80 20 L80 50 C80 80 50 95 50 95 C50 95 20 80 20 50 Z" fill="#0f766e" stroke="#042f2e" strokeWidth="5" strokeLinejoin="round"/>
    <path d="M30 30 L70 30 L50 80 Z" fill="#14b8a6"/>
    <circle cx="50" cy="45" r="10" fill="#ccfbf1" className="animate-pulse"/>
  </svg>
);

export const AssetReliquia = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <polygon points="50,10 80,30 80,70 50,90 20,70 20,30" fill="#1e1b4b" stroke="#7e22ce" strokeWidth="4"/>
    <path d="M35 50 A 15 15 0 0 1 65 50" fill="none" stroke="#d8b4fe" strokeWidth="3"/>
    <circle cx="50" cy="40" r="5" fill="#a855f7" className="animate-ping" style={{ animationDuration: '2.5s' }}/>
    <polygon points="45,65 55,65 50,75" fill="#c084fc"/>
  </svg>
);

// --- ELEMENTOS DO COMBATE ---

export const AssetFire = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 100 100" className={className}><path d="M50 10 C 80 40 80 70 50 90 C 20 70 20 40 50 10 Z" fill="#f97316"/></svg>
);
export const AssetWater = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 100 100" className={className}><path d="M50 10 Q 80 50 80 75 A 30 30 0 1 1 20 75 Q 20 50 50 10 Z" fill="#0ea5e9"/></svg>
);
export const AssetEarthElem = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 100 100" className={className}><polygon points="50,10 85,35 85,75 50,95 15,75 15,35" fill="#2dd4bf"/></svg>
);
export const AssetAir = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 100 100" className={className}><circle cx="50" cy="50" r="30" fill="none" stroke="#c084fc" strokeWidth="12" strokeDasharray="15 10" className="animate-spin-slow"/></svg>
);

// --- CONSTRUÇÕES (CRYSTAL-PUNK) ---

export const AssetTowerBuilding = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M30 90 L40 60 H60 L70 90 Z" fill="#115e59" stroke="#042f2e" strokeWidth="4"/>
    <polygon points="50,10 35,60 65,60" fill="#0d9488" stroke="#042f2e" strokeWidth="3"/>
    <path d="M48 25 L45 35 L52 35 L49 45" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse"/>
    <circle cx="50" cy="55" r="4" fill="#a855f7" className="animate-pulse" />
    <polygon points="50,0 47,5 50,10 53,5" fill="#c084fc">
        <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" repeatCount="indefinite" />
        <animate attributeName="cy" values="0;-10;0" dur="0.8s" repeatCount="indefinite" />
    </polygon>
  </svg>
);

export const AssetCoreBuilding = ({ className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M10 85 Q 30 60 50 85 T 90 85 Q 70 95 50 95 T 10 85 Z" fill="#064e3b" stroke="#022c22" strokeWidth="3"/>
    <path d="M30 85 Q 40 40 50 85 Q 60 40 70 85" fill="none" stroke="#064e3b" strokeWidth="5" strokeLinecap="round"/>
    <polygon points="50,15 30,55 50,75 70,55" fill="#a855f7" stroke="#d8b4fe" strokeWidth="2" className="animate-pulse"/>
    <polygon points="50,15 50,75 70,55" fill="#7e22ce" opacity="0.5"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="#d8b4fe" strokeWidth="1" strokeDasharray="6 6" className="animate-spin-slow" opacity="0.6"/>
  </svg>
);

export const AssetForcefieldBuilding = ({ className = "w-20 h-20" }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M35 90 Q 50 70 65 90 Z" fill="#115e59" stroke="#042f2e" strokeWidth="3"/>
    <path d="M50 10 Q 90 30 85 70 Q 50 80 15 70 Q 10 30 50 10 Z" fill="#2dd4bf" opacity="0.2" stroke="#5eead4" strokeWidth="2" strokeDasharray="4 4"/>
    <path d="M50 20 Q 75 35 70 65 Q 50 75 30 65 Q 25 35 50 20 Z" fill="#2dd4bf" opacity="0.3"/>
    <circle cx="50" cy="50" r="8" fill="#5eead4" className="animate-pulse" />
  </svg>
);