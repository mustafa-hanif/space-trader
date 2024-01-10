/* {"data":{"data":{"symbol":"X1-QD35-H45","shipTypes":[{"type":"SHIP_SURVEYOR"},{"type":"SHIP_MINING_DRONE"}],"transactions":[{"shipSymbol":"SHIP_MINING_DRONE","shipType":"SHIP_MINING_DRONE","waypointSymbol":"X1-QD35-H45","agentSymbol":"SCOUT_COS_2","price":40317,"timestamp":"2024-01-01T12:14:31.094Z"},{"shipSymbol":"SHIP_MINING_DRONE","shipType":"SHIP_MINING_DRONE","waypointSymbol":"X1-QD35-H45","agentSymbol":"MESSY","price":40281,"timestamp":"2023-12-30T22:34:06.598Z"},{"shipSymbol":"SHIP_MINING_DRONE","shipType":"SHIP_MINING_DRONE","waypointSymbol":"X1-QD35-H45","agentSymbol":"865RVE4CVDRTBF","price":40246,"timestamp":"2023-12-30T17:42:30.653Z"}],"ships":[{"type":"SHIP_SURVEYOR","name":"Surveyor Craft","description":"A specialized spacecraft equipped with surveying mounts, designed for detailed surveying of celestial bodies, resource identification, and scientific research.","supply":"HIGH","purchasePrice":29268,"frame":{"symbol":"FRAME_DRONE","name":"Drone","description":"A small, unmanned spacecraft used for various tasks, such as surveillance, transportation, or combat.","moduleSlots":3,"mountingPoints":2,"fuelCapacity":80,"requirements":{"power":1,"crew":-4}},"reactor":{"symbol":"REACTOR_CHEMICAL_I","name":"Chemical Reactor I","description":"A basic chemical power reactor, used to generate electricity from chemical reactions.","powerOutput":15,"requirements":{"crew":3}},"engine":{"symbol":"ENGINE_IMPULSE_DRIVE_I","name":"Impulse Drive I","description":"A basic low-energy propulsion system that generates thrust for interplanetary travel.","speed":3,"requirements":{"power":1,"crew":0}},"modules":[],"mounts":[{"symbol":"MOUNT_SURVEYOR_I","name":"Surveyor I","description":"A basic survey probe that can be used to gather information about a mineral deposit.","strength":1,"deposits":["QUARTZ_SAND","SILICON_CRYSTALS","PRECIOUS_STONES","ICE_WATER","AMMONIA_ICE","IRON_ORE","COPPER_ORE","SILVER_ORE","ALUMINUM_ORE","GOLD_ORE","PLATINUM_ORE"],"requirements":{"crew":1,"power":1}}],"crew":{"required":0,"capacity":0}},{"type":"SHIP_MINING_DRONE","name":"Mining Drone","description":"A small, unmanned spacecraft that can be used for mining operations, such as extracting valuable minerals from asteroids.","supply":"HIGH","purchasePrice":40281,"frame":{"symbol":"FRAME_DRONE","name":"Drone","description":"A small, unmanned spacecraft used for various tasks, such as surveillance, transportation, or combat.","moduleSlots":3,"mountingPoints":2,"fuelCapacity":80,"requirements":{"power":1,"crew":-4}},"reactor":{"symbol":"REACTOR_CHEMICAL_I","name":"Chemical Reactor I","description":"A basic chemical power reactor, used to generate electricity from chemical reactions.","powerOutput":15,"requirements":{"crew":3}},"engine":{"symbol":"ENGINE_IMPULSE_DRIVE_I","name":"Impulse Drive I","description":"A basic low-energy propulsion system that generates thrust for interplanetary travel.","speed":3,"requirements":{"power":1,"crew":0}},"modules":[{"symbol":"MODULE_CARGO_HOLD_I","name":"Cargo Hold","description":"A module that increases a ship's cargo capacity.","capacity":15,"requirements":{"crew":0,"power":1,"slots":1}},{"symbol":"MODULE_MINERAL_PROCESSOR_I","name":"Mineral Processor","description":"Crushes and processes extracted minerals and ores into their component parts, filters out impurities, and containerizes them into raw storage units.","requirements":{"crew":0,"power":1,"slots":2}}],"mounts":[{"symbol":"MOUNT_MINING_LASER_I","name":"Mining Laser I","description":"A basic mining laser that can be used to extract valuable minerals from asteroids and other space objects.","strength":3,"requirements":{"crew":1,"power":1}}],"crew":{"required":0,"capacity":0}}],"modificationsFee":100}}} */

export interface ShipyardData {
  symbol: string;
  shipTypes: ShipType[];
  transactions: Transaction[];
  ships: Ship[];
  modificationsFee: number;
}

interface ShipType {
  type: string;
}

interface Transaction {
  shipSymbol: string;
  shipType: string;
  waypointSymbol: string;
  agentSymbol: string;
  price: number;
  timestamp: string;
}

interface Ship {
  type: string;
  name: string;
  description: string;
  supply: string;
  purchasePrice: number;
  frame: Frame;
  reactor: Reactor;
  engine: Engine;
  modules: Module[];
  mounts: Mount[];
  crew: Crew;
}

interface Frame {
  symbol: string;
  name: string;
  description: string;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  requirements: Requirements;
}

interface Requirements {
  power: number;
  crew: number;
}

interface Reactor {
  symbol: string;
  name: string;
  description: string;
  powerOutput: number;
  requirements: Requirements;
}

interface Engine {
  symbol: string;
  name: string;
  description: string;
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
  deposits: string[];
  requirements: Requirements;
}

interface Crew {
  required: number;
  capacity: number;
}