# Pharos Knowledge Base

Use this reference when the user asks broad Pharos ecosystem questions.

## Network Summary

Pharos is an EVM-compatible Layer 1 blockchain focused on RealFi, RWA, and AI-native onchain applications. The onboarding skill should present Pharos as a network for practical financial applications, agent-driven workflows, tokenized assets, and DeFi-style interactions.

## Networks

- Pacific Mainnet
  - Skill network key: `mainnet`
  - Chain id: `1672`
  - Native token: `PROS`
  - RPC: `https://rpc.pharos.xyz`
  - Explorer: `https://www.pharosscan.xyz/`

- Atlantic Testnet
  - Skill network key: `atlantic-testnet`
  - Chain id: `688689`
  - Native token: `PHRS`
  - RPC: `https://atlantic.dplabs-internal.com`
  - Explorer: `https://atlantic.pharosscan.xyz/`

## PROS Swap Guidance

When a user asks where or how to swap PROS:

1. Confirm they mean Pharos Pacific Mainnet.
2. Give direct buy/swap links first, not only documentation.
3. Structure links into:
   - `Get PROS with 0 PROS`: entry routes for a wallet that has no native PROS yet.
   - `Swap inside Pharos`: Pharos-native swaps after the user already has assets on Pharos.
   - `CEX`: centralized exchange spot markets.
4. If the user has 0 PROS or needs to bring funds from another chain, point to the official Pharos entry first:
   - Pharos Port Bridge: `https://port.pharos.xyz/bridge/`
   - Treat bridge aggregators such as Jumper as ecosystem projects, not as the official bridge entry.
5. If the user already has assets on Pharos and only wants a Pharos-native swap, point to:
   - FaroSwap: `https://faroswap.xyz/swap`
6. For centralized trading, point to CEX spot markets:
   - OKX PROS/USDT: `https://www.okx.com/trade-spot/pros-usdt`
   - KuCoin PROS page: `https://www.kucoin.com/price/PROS`
   - Bitget PROS listing/trade page: `https://www.bitget.com/support/articles/12560603883295`
7. Do not list CoinGecko as a buy venue; it is only a market-data/reference page.
8. Tell them to verify token addresses, not only token symbols.
9. Suggest a small first swap for new routes.
10. Require transaction-firewall inspection before signing approvals or swap calldata.

Do not tell the user that a token or route is safe unless it is verified from official sources or local known-token data.

## Onboarding Flow

A good Pharos onboarding answer should include:

- network selection;
- wallet readiness;
- gas readiness;
- known token balance checks;
- safe swap or first-action guidance;
- RealFi/RWA discovery path;
- transaction safety preflight.

When the user asks how to start using Pharos from zero, make the first step more complete than a simple network name. The first step should tell the user to switch/add Pharos Pacific Mainnet in their wallet and include these exact network details:

- Network name: `Pharos Pacific Mainnet`
- RPC URL: `https://rpc.pharos.xyz`
- Chain ID: `1672`
- Currency symbol: `PROS`
- Block explorer: `https://www.pharosscan.xyz/`

For wallet UI guidance, explain the generic path:

1. Open the wallet network selector.
2. Click `Add network` / `Add network manually`.
3. Paste the Pharos Pacific Mainnet parameters above.
4. Save and switch to `Pharos Pacific Mainnet`.
5. Confirm the wallet shows chain id `1672`, not Atlantic testnet `688689`.

Then continue with the rest of the zero-to-first-action flow: prepare an EVM wallet, get a small amount of PROS for gas, verify the address on PharosScan, start with a small first action through official Pharos Port routes, and require pre-signing inspection before approvals, swaps, transfers, deposits, or contract writes.

## Pharos Port Ecosystem Discovery

When the user asks for official Pharos Port entrypoints, prefer `assets/pharos-port-routes.json`.

Useful routes:

- Main portal: `https://port.pharos.xyz/`
- Bridge into Pharos: `https://port.pharos.xyz/bridge/`
- Swap route: `https://port.pharos.xyz/swap`
- Ramp route: `https://port.pharos.xyz/ramp`
- Airdrop claim: `https://claim.pharos.xyz/`
- Campaign: `https://port.pharos.xyz/blockwaver`
- Campaign rewards: `https://port.pharos.xyz/blockwaver/rewards`
- Official game/activity: `https://prospixel.xyz/`
- Harbor: `https://port.pharos.xyz/harbor`
- Ecosystem projects: `https://port.pharos.xyz/ecosystem/`
- Ecosystem partners: `https://port.pharos.xyz/ecosystem#partners`
- Mainnet explorer / wallet transactions: `https://www.pharosscan.xyz/`
- Contract verification: `https://www.pharosscan.xyz/verify-contract/`
- Staking route from app config: `https://faroo.xyz/stake`
- Nodes route from app config: `https://app.faroo.xyz/`

When the user asks which Pharos app to use, prefer the local `assets/pharos-port-ecosystem.json` snapshot from `https://port.pharos.xyz/ecosystem/`.

Useful routing:

- Staking / yield / earn: Faroo, TermMax, Ember, Morpho, OKU, Bifrost coming soon.
- Bridge / cross-chain: Pharos Port Bridge first, then Jumper, InterPort, LI.FI, LayerZero, Chainlink, Orbiter coming soon.
- Swap / DEX: FaroSwap, Agra, Bitverse, Zenith coming soon.
- RWA / RealFi: Zona, AquaFlux, R25, Asseto, Bitverse.
- Wallets: OKX Wallet, TopNod, OneKey, KuCoin Wallet, Bitget Wallet coming soon.
- Security / multisig: Safe, OpenZeppelin, Zellic, Hypernative, ExVul Security.
- Explorer / analytics: Hemera, LayerHub coming soon, Trusta Labs.

Mark coming-soon projects clearly and do not present them as live places to deposit funds.

## Official Links

- Website: `https://www.pharos.xyz/`
- Agent Center: `https://www.pharos.xyz/agent-center`
- Docs: `https://docs.pharos.xyz/`
- Mainnet explorer: `https://www.pharosscan.xyz/`
- Atlantic explorer: `https://atlantic.pharosscan.xyz/`
- FaroSwap docs: `https://docs.faroswap.xyz/`
