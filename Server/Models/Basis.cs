namespace BasisTrading.Models;

public record Basis(
  string Exchange, 
  string Sym, 
  long Timetstamp,
  decimal IndexPrice,
  decimal MarkPrice,
  decimal OpenInterest,
  decimal FundingRate,
  long NextFundingTime,
  decimal BasisRate
);