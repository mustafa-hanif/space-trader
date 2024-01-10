export interface Orbital {
  symbol: string;
}

export interface Trait {
  symbol: string;
  name: string;
  description: string;
}

export interface Waypoint {
  systemSymbol: string;
  symbol: string;
  type: string;
  x: number;
  y: number;
  orbitals: Orbital[];
  traits: Trait[];
  chart: {
    submittedBy: string;
    submittedOn: string;
  };
  faction: {
    symbol: string;
  };
  isUnderConstruction: boolean;
}