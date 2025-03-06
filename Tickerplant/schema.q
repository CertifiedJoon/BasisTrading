SnapshotBasis:([ 
  exchange: `symbol$();
  sym:`symbol$()
  ]
  timestamp:`long$(); 
  indexPrice: `float$(); 
  markPrice: `float$(); 
  openInterest: `float$();
  fundingRate: `float$();
  nextFundingTime: `long$();
  basisRate: `float$()
  );

HistoricalBasis:([] 
  exchange: `symbol$();
  sym:`symbol$();
  timestamp:`long$(); 
  indexPrice: `float$(); 
  markPrice: `float$(); 
  openInterest: `float$();
  fundingRate: `float$();
  nextFundingTime: `long$();
  basisRate: `float$()
  );

BasisBuffer:([] 
  exchange: `symbol$();
  sym:`symbol$();
  timestamp:`long$(); 
  indexPrice: `float$(); 
  markPrice: `float$(); 
  openInterest: `float$();
  fundingRate: `float$();
  nextFundingTime: `long$();
  basisRate: `float$()
  );