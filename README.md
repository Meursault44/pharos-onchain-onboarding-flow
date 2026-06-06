# Pharos Onchain Onboarding Flow

AI-agent onboarding skill for Pharos users. It helps an agent explain Pharos, guide zero-start onboarding, check wallet readiness, recommend the next safe onchain step, route users to current Pharos Port activities, discover ecosystem projects, and guide PROS swaps without blindly approving unknown transactions.

## What It Does

**Turns a wallet into an onboarding state**

The skill checks whether a wallet is new, funded, active, ready for swaps, or ready for RealFi exploration. It uses read-only Pharos RPC calls for native balance, transaction count, account type, and known-token balances.

**Answers practical Pharos questions**

The agent can answer questions like:

- "What is Pharos?"
- "How do I start using Pharos from zero?"
- "Where can I swap PROS?"
- "What activities are currently available on Pharos?"
- "Which ecosystem projects are live on Pharos?"
- "Where can I register a Pharos domain?"
- "Is this wallet ready for Pharos?"
- "What should I do next onchain?"

For zero-start onboarding, the first step should include the full Pharos Pacific Mainnet wallet setup, not only the network name:

- Network name: `Pharos Pacific Mainnet`
- RPC URL: `https://rpc.pharos.xyz`
- Chain ID: `1672`
- Currency symbol: `PROS`
- Block explorer: `https://www.pharosscan.xyz/`

Tell the user to add the network manually through their wallet network selector, save it, switch to `Pharos Pacific Mainnet`, and confirm chain id `1672` before getting PROS or signing any action.

**Guides PROS buy and swap onboarding**

For swap requests, the skill recommends a cautious flow:

- show direct buy/swap links first;
- use Pharos Pacific Mainnet for PROS;
- if the wallet has 0 PROS, use Pharos Port Bridge or a CEX first;
- use FaroSwap for swaps after assets are already on Pharos;
- list known CEX market pages such as OKX, KuCoin, and Bitget;
- verify token addresses instead of trusting symbols;
- start with a small test swap;
- inspect approval and swap calldata before signing.

**Adds a safety gate before real transactions**

The skill does not sign or send transactions. If a user wants to swap, approve, transfer, deposit, or interact with a contract, it tells the agent to run a pre-signing firewall inspection first.

**Discovers Pharos ecosystem apps**

The skill includes local snapshots from Pharos Port routes and ecosystem data. It can route users to official entrypoints and relevant dApps by intent:

- Pharos Port home;
- bridge, swap, and ramp;
- airdrop, campaign, and rewards;
- Harbor / RWA;
- staking / yield / earn;
- official Pharos games and activities such as PROS Pixel;
- Pharos-native swaps;
- RWA / RealFi;
- Pharos domains and DID routes such as PNS;
- wallets;
- explorers and analytics;
- security, multisig, and audits;
- RPC, oracle, DID, NFT, ramp, and infra tools.

## Why It Matters

Most onboarding tools only show generic docs or a wallet balance. This skill gives AI agents a structured flow:

1. Understand the user’s goal.
2. Check the wallet’s onchain state.
3. Classify readiness.
4. Recommend the next safe step.
5. Require a transaction firewall before signing.

That makes it useful for new users, Pharos community support, RealFi onboarding, and agent-driven dApp flows.

## Quick Demo

```bash
npx skills add https://github.com/Meursault44/pharos-onchain-onboarding-flow.git
```

After installation, ask the agent normal onboarding questions such as:

- "How do I start using Pharos from zero?"
- "Where can I swap PROS?"
- "What activities are currently available on Pharos?"
- "Which ecosystem projects are live on Pharos?"
- "Where can I register a Pharos domain?"
- "Is this wallet ready for Pharos?"

## Example Output

```text
Pharos Onchain Onboarding Flow
Decision stage: GUIDE
Network: Pharos Pacific Mainnet (1672)

For PROS swap onboarding, guide the user to FaroSwap, verify the exact token addresses, confirm Pharos Pacific Mainnet, and run pre-signing checks before approval or swap.

Recommended next actions
- Ask the user for a wallet address to produce a personalized readiness score.
- If the goal is swapping PROS, use Pharos Pacific Mainnet and verify the target token address first.
- Use read-only checks first; require firewall inspection before any approval or swap.
```

## Supported Networks

- Pharos Pacific Mainnet, chain id `1672`, native token `PROS`
- Pharos Atlantic Testnet, chain id `688689`, native token `PHRS`

## Knowledge Sources

- Pharos website: https://www.pharos.xyz/
- Pharos Agent Center: https://www.pharos.xyz/agent-center
- Pharos docs: https://docs.pharos.xyz/
- Pharos mainnet explorer: https://www.pharosscan.xyz/
- FaroSwap docs: https://docs.faroswap.xyz/

## PROS Buy / Swap Links

### Get PROS with 0 PROS

- Pharos Port Bridge: https://port.pharos.xyz/bridge/
- Jumper direct route: https://jumper.xyz/?toChain=1672&toToken=0x0000000000000000000000000000000000000000

Use Pharos Port Bridge as the primary official entry when the wallet has no PROS yet and needs a cross-chain route into Pharos. Jumper can be used as a direct bridge aggregator route when Pharos routes are available. Always verify Pharos as the destination chain, token address, recipient, fees, and route before signing.

### Swap Inside Pharos

- FaroSwap: https://faroswap.xyz/swap

Use this after the wallet already has assets on Pharos. FaroSwap is for Pharos-native swaps; it is not the same as bridging funds from another chain by itself.

### CEX

- OKX PROS/USDT: https://www.okx.com/trade-spot/pros-usdt
- KuCoin PROS page: https://www.kucoin.com/price/PROS
- Bitget PROS listing/trade page: https://www.bitget.com/support/articles/12560603883295

CoinGecko is intentionally not listed as a buy venue. It can be used only as a market reference page.

## Pharos Port Ecosystem

The skill includes `assets/pharos-port-routes.json` and `assets/pharos-port-ecosystem.json`, generated from:

- Pharos Port: https://port.pharos.xyz/
- Pharos Port ecosystem page: https://port.pharos.xyz/ecosystem/
- Ecosystem API: `https://api.pharosnetwork.xyz/omni_port/ecosystem`
- Partners API: `https://api.pharosnetwork.xyz/omni_port/partners`

Official Pharos Port routes now covered:

- Home: https://port.pharos.xyz/
- Bridge: https://port.pharos.xyz/bridge/
- Swap: https://port.pharos.xyz/swap
- Ramp: https://port.pharos.xyz/ramp
- Airdrop claim: https://claim.pharos.xyz/
- Campaign: https://port.pharos.xyz/blockwaver
- Campaign rewards: https://port.pharos.xyz/blockwaver/rewards
- PROS Pixel game/activity: https://prospixel.xyz/
- Harbor: https://port.pharos.xyz/harbor
- Ecosystem projects: https://port.pharos.xyz/ecosystem/
- Partners: https://port.pharos.xyz/ecosystem#partners
- PharosScan wallet transactions: https://www.pharosscan.xyz/
- PharosScan contract verification: https://www.pharosscan.xyz/verify-contract/

The snapshot currently includes 53 projects across 29 tags, including Wallet, DEX, Bridge, RWA, Lending, Yield Farming, Vault, LST, Security, Oracle, RPC, Block Explorer, DID, NFT, Payment, and On/Off Ramp.

Live campaign names are intentionally not hardcoded. For current campaigns, the skill should direct users to:

- https://port.pharos.xyz/blockwaver
- https://port.pharos.xyz/blockwaver/rewards

Example questions:

- "How do I start using Pharos from zero?"
- "What activities are currently available on Pharos?"
- "Where can I see Pharos campaigns?"
- "Where is the official Pharos bridge?"
- "Where can I stake PROS on Pharos?"
- "Which bridge can I use for Pharos?"
- "Where can I register a Pharos domain?"
- "Show me RWA apps on Pharos."

## Agent Usage

In a real Pharos agent, this skill should run when the user asks onboarding-style questions:

```text
Help me start using Pharos mainnet.
Where can I swap PROS?
Check if my wallet is ready for Pharos.
What should I do next onchain?
```

The agent should use the onboarding report to decide whether the user needs gas, a network switch, token verification, swap guidance, or a pre-signing transaction firewall check.

## Optional X / Social Intelligence

The base skill works without X/Twitter parsing. If you provide official Pharos developer or ecosystem profile links, they can be added to `assets/pharos-ecosystem.json` under `socialSources`.

Social posts should be treated as non-authoritative signals. The agent should use them for ecosystem context only when they do not conflict with official docs, official websites, or onchain data.

## Extra Notes

- TypeScript implementation
- Read-only by default
- No private keys
- No wallet connection required
- No transaction signing
- No transaction broadcasting
- Uses Pharos RPC for wallet readiness checks
- Designed to pair with a transaction-firewall skill before real swaps or approvals
