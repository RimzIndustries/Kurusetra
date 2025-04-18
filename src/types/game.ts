export interface Resources {
  gold: number;
  wood: number;
  stone: number;
  food: number;
  goldProduction: number;
  woodProduction: number;
  stoneProduction: number;
  foodProduction: number;
}

export interface Building {
  id: string;
  name: string;
  level: number;
  cost: {
    gold: number;
    wood: number;
    stone: number;
  };
  production: {
    gold?: number;
    wood?: number;
    stone?: number;
    food?: number;
  };
}

export interface MilitaryUnit {
  id: string;
  name: string;
  level: number;
  count: number;
  cost: {
    gold: number;
    food: number;
    time: number;
  };
  stats: {
    attack: number;
    defense: number;
    health: number;
  };
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  cost: {
    gold: number;
    influence: number;
  };
  effects: {
    happiness: number;
    production: number;
    military: number;
  };
}

export type ZodiacSign = 
  | 'aries'    // Domba Api
  | 'taurus'   // Banteng
  | 'gemini'   // Kembar
  | 'cancer'   // Kepiting
  | 'leo'      // Singa
  | 'virgo'    // Perawan
  | 'libra'    // Timbangan
  | 'scorpio'  // Kalajengking
  | 'sagittarius' // Pemanah
  | 'capricorn'   // Kambing Laut
  | 'aquarius'    // Pembawa Air
  | 'pisces';     // Ikan

export interface Player {
  id: string;
  name: string;
  level: number;
  exp: number;
  resources: Resources;
  buildings: Building[];
  militaryUnits: MilitaryUnit[];
  policies: Policy[];
  influence: number;
  happiness: number;
  productionBonus: number;
  militaryBonus: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  race: 'ksatriya' | 'wanamarta' | 'wirabumi' | 'jatayu' | 'kurawa' | 'tibrasara' | 'raksasa' | 'dedemit';
  zodiac: ZodiacSign;
  raceBonuses: {
    ksatriya?: {
      researchSpeed: number;
      economyEfficiency: number;
    };
    wanamarta?: {
      magicPower: number;
      hasDarkRituals: boolean;
    };
    wirabumi?: {
      constructionSpeed: number;
      miningBonus: number;
    };
    jatayu?: {
      hasFlyingUnits: boolean;
      attackSpeed: number;
    };
    kurawa?: {
      canStealResources: boolean;
      canSabotage: boolean;
    };
    tibrasara?: {
      defenseBonus: number;
      hasEliteArchers: boolean;
    };
    raksasa?: {
      physicalAttack: number;
      armyCapacity: number;
    };
    dedemit?: {
      noFoodRequired: boolean;
      hasImmortalUnits: boolean;
    };
  };
  zodiacBonuses: {
    aries?: {
      firstStrikeSpeed: number;
      initialMorale: number;
      canConquerFast: boolean;
    };
    taurus?: {
      resourceProduction: number;
      defenseBonus: number;
      economicStrength: number;
    };
    gemini?: {
      canBuildTwoStructures: boolean;
      canTrainTwoUnits: boolean;
      diplomacyFlexibility: number;
    };
    cancer?: {
      homeDefense: number;
      troopRegeneration: number;
      psychologicalWarfare: boolean;
    };
    leo?: {
      leadershipBonus: number;
      allianceMorale: number;
      spectacularAttacks: boolean;
    };
    virgo?: {
      researchSpeed: number;
      resourceEfficiency: number;
      highPrecisionUnits: boolean;
    };
    libra?: {
      canStealBalanced: boolean;
      diplomacyBonus: number;
      warBalancer: boolean;
    };
    scorpio?: {
      covertOpsEfficiency: number;
      deadlyCounterattacks: boolean;
      asymmetricWarfare: boolean;
    };
    sagittarius?: {
      rangedAccuracy: number;
      mapExploration: number;
      scoutingBonus: boolean;
    };
    capricorn?: {
      mountainConstruction: number;
      roughTerrainStrength: number;
      geographicExpansion: boolean;
    };
    aquarius?: {
      innovativeResearch: boolean;
      weatherAdaptation: boolean;
      uniqueWeapons: boolean;
    };
    pisces?: {
      resourceRegeneration: boolean;
      magicalIllusions: boolean;
      sustainableEconomy: boolean;
    };
  };
}

export interface GameState {
  player: Player;
  lastUpdated: Date;
  isOnline: boolean;
  isInBattle: boolean;
  currentLocation: string;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
} 