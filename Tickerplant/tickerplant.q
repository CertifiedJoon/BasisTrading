\l schema.q
\l utils.q
\l u.q
\t 1000

.u.init[];

handleBybitMessage: {
  d: x`data;
  columnFilter: `symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime;
  filteredColumns: columnFilter inter key d;
  d: filteredColumns!@[x`data;filteredColumns];
  conversionMapping: (`symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime)!("S";"F";"F";"F";"F";"J");
  keyMapping: (`symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime)!(`sym`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime);
  a: (`timestamp`exchange)!("j"$x`ts),`bybit;
  a,(keyMapping[key d])!conversionMapping[key d]$ value d
  };

handleHyperliquidMessage: {
  d: x`data;
  sym: "S"$raze (d`coin; "USDT");
  d: d`ctx;
  columnFilter: `funding`openInterest`oraclePx`markPx;
  filteredColumns: columnFilter inter key d;
  d: filteredColumns!@[d;filteredColumns];
  conversionMapping: columnFilter!("F";"F";"F";"F");
  keyMapping: columnFilter!(`fundingRate`openInterest`indexPrice`markPrice);
  a: (`timestamp`exchange`sym`nextFundingTime)!((.utils.unixTimestampMs[]);`hyperliquid;sym;{x + 3600000 - x mod 3600 * 1000}.utils.unixTimestampMs[]);
  a,(keyMapping[key d])!conversionMapping[key d]$ value d
 };

.z.ws: {
  jsonMsg: .j.k x;
  delta: $[.z.w~bybitConn;handleBybitMessage jsonMsg;.z.w~hyperliquidConn;handleHyperliquidMessage jsonMsg; ::];
  original: exec from SnapshotBasis where sym=delta[`sym], exchange=delta[`exchange];
  r: original ^ delta;
  r[`basisRate]: %[r[`markPrice] - r[`indexPrice]; r[`indexPrice]];
  `SnapshotBasis upsert r;
 };

/ connect to bybit proxy
bybitConn: @[(`$":ws://localhost:9990")"GET / HTTP/1.1\r\nHost: host:port\r\n\r\n"; 0];
hyperliquidConn: @[(`$":ws://localhost:9991")"GET / HTTP/1.1\r\nHost: host:port\r\n\r\n"; 0];
ttl: 6000000;

calculateArb: {
  {@[flip x; `exchange]!z[b] each b:@[flip x;y]}[0!select from SnapshotBasis; x; y]
 }

.z.ts: {
  delete from `HistoricalBasis where timestamp<.utils.unixTimestampMs[] - ttl;
  `HistoricalBasis insert 0!select from SnapshotBasis;
  `BTCUSDTFundingArb set flip calculateArb[`fundingRate; {y-x}];
  `BTCUSDTPriceArb set flip calculateArb[`markPrice; {%[(y-x);x]}];
  {.u.pub[x; 0! value x]} each tables[];
 };