interface item {
  symbol: string;
  name: string;
  description: string;
}

interface transaction {
  waypointSymbol: string;
  shipSymbol: string;
  tradeSymbol: string;
  type: string;
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  timestamp: string;
}

interface tradegood {
  symbol: string;
  tradeVolume: number;
  type: string;
  supply: string;
  purchasePrice: number;
  sellPrice: number;
}

export interface Market {
  symbol: string;
  imports: item[];
  exports: item[];
  exchange: item[];
  transactions: transaction[];
  tradeGoods: tradegood[];
}