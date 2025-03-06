\l schema.q
\l utils.q
\l u.q

bybitPort: 9990;
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

.z.ws: {
  delta: handleBybitMessage .j.k x;
  original: exec from SnapshotBasis where sym=delta[`sym], exchange=delta[`exchange];
  r: original ^ delta;
  r[`basisRate]: %[r[`markPrice] - r[`indexPrice]; r[`indexPrice]];
  // $[`~original`exchange;`SnapshotBasis upsert delta; `SnapshotBasis upsert original, delta];
  `SnapshotBasis upsert r;
 };

/ connect to bybit proxy
bybitConn: (`$":ws://localhost:9990")"GET / HTTP/1.1\r\nHost: host:port\r\n\r\n";

\t 250
ttl: 6000000;

.z.ts: {
  delete from `HistoricalBasis where timestamp<.utils.unixTimestampMs[] - ttl;
  `HistoricalBasis insert 0!select from SnapshotBasis;
  .u.pub[`SnapshotBasis; 0! value `SnapshotBasis];
 };

.u.sub