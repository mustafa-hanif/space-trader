// deno-lint-ignore-file no-explicit-any

export interface Ship {
  symbol: string;
  nav: Nav;
  crew: Crew;
  fuel: Fuel;
  cooldown: Cooldown;
  frame: Frame;
  reactor: Reactor;
  engine: Engine;
  modules: Module[];
  mounts: Mount[];
  registration: Registration;
  cargo: Cargo;
}

interface Nav {
  systemSymbol: string;
  waypointSymbol: string;
  route: Route;
  status: 'IN_TRANSIT' | 'IN_ORBIT' | 'DOCKED';
  flightMode: string;
}

interface Route {
  departure: Departure;
  origin: Origin;
  destination: Destination;
  arrival: string;
  departureTime: string;
}

interface Departure {
  symbol: string;
  name: string;
  coordinates: Coordinates;
}

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

interface Origin {
  symbol: string;
  name: string;
  coordinates: Coordinates;
}

interface Destination {
  symbol: string;
  name: string;
  coordinates: Coordinates;
}

interface Crew {
  current: number;
  capacity: number;
  required: number;
  rotation: string;
  morale: number;
  wages: number;
}

interface Fuel {
  current: number;
  capacity: number;
  consumed: Consumed;
}

interface Consumed {
  amount: number;
  timestamp: string;
}

interface Cooldown {
  shipSymbol: string;
  totalSeconds: number;
  remainingSeconds: number;
}

interface Frame {
  symbol: string;
  name: string;
  description: string;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  condition: number;
  requirements: Requirements;
}

interface Requirements {
  power: number;
  crew: number;
  slots: number;
}

interface Reactor {
  symbol: string;
  name: string;
  description: string;
  condition: number;
  powerOutput: number;
  requirements: Requirements;
}

interface Engine {
  symbol: string;
  name: string;
  description: string;
  condition: number;
  speed: number;
  requirements: Requirements;
}

interface Module {
  symbol: string;
  name: string;
  description: string;
  capacity: number;
  requirements: Requirements;
}

interface Mount {
  symbol: string;
  name: string;
  description: string;
  strength: number;
  requirements: Requirements;
}

interface Registration {
  name: string;
  factionSymbol: string;
  role: string;
}

interface Cargo {
  capacity: number;
  units: number;
  inventory: any[];
}