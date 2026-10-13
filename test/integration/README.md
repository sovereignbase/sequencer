# Integration

[All suites](../README.md)

These tests exercise browser delivery, transports, and native runtime lifetime. The semantic expectations are shared with [convergence](../convergence/README.md); runtime-wide public-API checks live in [compatibility](../compatibility/README.md).

| Scenario                                             | Transport and expectation                                                                           | Test                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Browser fanout](fanout_browser/README.md)           | Opposite delivery orders within the browser yield the same surviving insertions.                    | [test.ts](fanout_browser/test.ts)      |
| [Peer-to-peer fanout](fanout_peer_to_peer/README.md) | BroadcastChannel peers resolve missing dependencies and converge during independent realtime edits. | [test.ts](fanout_peer_to_peer/test.ts) |
| [WebSocket fanout](fanout_websocket/README.md)       | A stateless relay forwards JSON Gossip between independently editing peers.                         | [test.ts](fanout_websocket/test.ts)    |
| [Runtime lifetime](runtime_lifetime/README.md)       | Native initialization failures and collector cleanup preserve independent Projection ownership.     | [test.ts](runtime_lifetime/test.ts)    |

Run `npm run test:integration`, or select a scenario with `npx vitest run test/integration/fanout_websocket --coverage.enabled=false`.

[Runtime memory](runtime_memory/README.md) verifies shared Footage accounting,
binding release and WASM memory growth.
