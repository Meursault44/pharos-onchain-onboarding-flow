# Onboarding Policy

## Stage Model

- `NEW`: no native balance and no transaction history.
- `FUNDED`: native balance exists but transaction history is empty.
- `ACTIVE`: transaction history exists.
- `READY_FOR_SWAP`: wallet has native gas and either wrapped-native/stablecoin assets or enough gas to start a swap route.
- `READY_FOR_REALFI`: wallet has active history plus stablecoin/wrapped-native assets or a mature activity profile.
- `NEEDS_ATTENTION`: invalid address, RPC failure, contract wallet edge case, no gas, suspicious request, or unsupported network.

## Swap Guidance

For PROS swap questions:

1. Use Pharos Pacific Mainnet unless the user explicitly asks for Atlantic testnet.
2. Prefer a Pharos ecosystem DEX such as FaroSwap when the pair exists.
3. Treat token addresses as more important than symbols.
4. Warn that unsolicited/dust tokens should not be swapped or approved.
5. Require pre-signing inspection for approvals and swap calldata.

## Agent Safety

The onboarding skill should produce recommendations and preflight checks. It should not execute mainnet writes directly. For any proposed transaction, call the transaction firewall skill if available.

