export interface Basis {
  exchange: string;
  sym: string;
  timestamp: number;
  indexPrice: number;
  markPrice: number;
  openInterest: number;
  fundingRate: number;
  nextFundingTime: number;
  basisRate: number;
}
