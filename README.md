# Basis Trading

Building Trading Analysis tool for basis trading + funding rate arb

idk maybe ill make it fdc3.0 compliant if i'm feeling cute. Lol.

### Architecture

Exchange WS API -> TS websocket proxy -> KDB ws tickerplant -> TS server (maybe skip) -> Angular or C# desktop app.

if i want multiple frontends... i would need the TS server for server side session management.

### Phase 1

simply chart out basis and funding rate of fixed set of tickers.

### Phase 2

simply chart out basis and funding rate for tickers user request from the frontend.

### Phase 3

some more features on charting (probably some trend analysis, open interest, bid-ask spread, volume)

### Phase 4

FDC 3.0 compliance.

### Phase 4

Track my trades from exchange APIs!
