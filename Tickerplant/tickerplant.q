\l schema.q

bybitPort: 9990;

handleBybitMessage: {
  d: x`data;
  columnFilter: `symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime`basisRate;
  filteredColumns: columnFilter inter key d;
  d: filteredColumns!@[x`data;filteredColumns];
  conversionMapping: (`symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime`basisRate)!("S";"F";"F";"F";"F";"J";"F");
  keyMapping: (`symbol`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime`basisRate)!(`sym`indexPrice`markPrice`openInterest`fundingRate`nextFundingTime`basisRate);
  a: (`timestamp`exchange)!("j"$x`ts),`bybit;
  a,(keyMapping[key d])!conversionMapping[key d]$ value d
  };

.z.ws: {
  delta: handleBybitMessage .j.k x;
  original: exec from basis where sym=delta[`sym], exchange=delta[`exchange];
  $[`~original`exchange;`basis upsert delta; `basis upsert original, delta];
 };

/ connect to bybit proxy
bybitConn: (`$":ws://localhost:9990")"GET / HTTP/1.1\r\nHost: host:port\r\n\r\n"
