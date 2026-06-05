---
name: pharos-onchain-onboarding-flow
description: Personalized onboarding flow for Pharos AI agents. Use when a user asks how to start using Pharos, how to swap PROS, what Pharos is, which network or dApp to use, whether a wallet is ready for Pharos mainnet/testnet, or what safe next onchain action an agent should recommend.
---

# Pharos Onchain Onboarding Flow

Use this skill to guide users through their first safe Pharos actions. The skill combines Pharos ecosystem knowledge, wallet readiness checks, Pharos Port routes, official game/activity routing, Pharos Port project discovery, swap guidance, and agent-safe next-step recommendations.

This skill is read-only by default. It does not ask for private keys, sign transactions, or broadcast transactions.

## Core Rule

When the user asks how to start on Pharos, how to swap PROS, what dApp to use, or what to do next with a wallet, run the onboarding flow before suggesting a write transaction.

Use Pharos mainnet when the user says `mainnet`, `Pacific`, or `PROS`. Use Atlantic testnet when the user says `testnet`, `Atlantic`, or `PHRS`.

If a write transaction may be needed, tell the user the intended network and action. If the `pharos-agent-transaction-firewall` skill is available, run it before signing or broadcasting.

## Fast Path

Install once:

```bash
npm install
```

Answer a Pharos question:

```bash
npm run onboard -- --ask "where can I swap PROS?"
```

Check wallet readiness:

```bash
npm run onboard -- --network mainnet --wallet 0xYourWallet
```

Generate a swap onboarding plan:

```bash
npm run onboard -- --network mainnet --wallet 0xYourWallet --ask "swap PROS to USDC"
```

For broad questions like "what is Pharos?", "what is PROS?", or "how does Pharos onboarding work?", read `references/pharos-knowledge.md` before answering.

## What To Return

Return a concise user-facing report with:

- `stage`: `NEW`, `FUNDED`, `ACTIVE`, `READY_FOR_SWAP`, `READY_FOR_REALFI`, or `NEEDS_ATTENTION`.
- `walletReadiness`: native balance, transaction count, known token balances, account type, and gas status.
- `pharosContext`: network, chain id, native token, explorer, and relevant official links.
- `recommendedNextActions`: 1-5 safe next steps.
- `swapGuidance`: where/how to swap PROS when relevant.
- `safetyNotes`: approvals, dust-token warnings, unknown dApps, mainnet confirmation, and firewall requirement.

## Workflow

1. Load network, token, and ecosystem data from `assets/networks.json`, `assets/tokens.json`, `assets/pharos-ecosystem.json`, `assets/pharos-port-routes.json`, and `assets/pharos-port-ecosystem.json`.
2. If `--wallet` is provided, call Pharos RPC read-only methods:
   - `eth_getBalance`
   - `eth_getTransactionCount`
   - `eth_getCode`
   - ERC20 `balanceOf` for known local tokens
3. Classify the wallet stage:
   - no balance and no activity: `NEW`
   - has gas but no activity: `FUNDED`
   - has tx history: `ACTIVE`
   - has gas and known swap assets: `READY_FOR_SWAP`
   - has stablecoin/RWA-related assets or active history: `READY_FOR_REALFI`
4. If the user asks about swapping PROS, explain the safest flow:
   - use a Pharos-supported DEX such as FaroSwap when available;
   - confirm network is Pharos Pacific Mainnet;
   - start with a small swap;
   - verify token address from local known-token data or official source;
   - inspect approvals and swap calldata before signing.
5. If the user asks about Pharos Port, rewards, airdrop, campaign, games, activities, PROS Pixel, bridge, swap, ramp, Harbor, wallet transaction history, PharosScan, contract verification, nodes, docs, news, research, or foundation links, match the request against `assets/pharos-port-routes.json` and return official route links.
6. If the user asks about staking, yield, bridge, RWA, wallets, explorers, security, or ecosystem dApps, match the request against `assets/pharos-port-ecosystem.json` and return relevant active/coming-soon projects with links.
7. If the user asks a broad Pharos question, answer from the local ecosystem knowledge and clearly separate facts from recommendations.
8. If the user wants to execute an action, produce the preflight checklist and require transaction firewall inspection before signing.

## Pharos Port Data

`assets/pharos-port-routes.json` is a local snapshot of official Pharos Port routes from `https://port.pharos.xyz/`, including Home, Bridge, Swap, Ramp, Airdrop Claim, Campaign, Campaign Rewards, PROS Pixel, Harbor, Ecosystem, PharosScan, PharosScan Verify Contract, Staking, Nodes, Docs, Blog & News, Research, and Foundation.

`assets/pharos-port-ecosystem.json` is a local snapshot from `https://port.pharos.xyz/ecosystem/`. It includes active and coming-soon projects across categories such as Wallet, DEX, Bridge, RWA, Lending, Yield Farming, Vault, LST, Security, Oracle, RPC, Explorer, DID, and On/Off Ramp.

Use it for discovery and routing answers, not as a safety guarantee. Always tell the user to verify live app support before signing transactions.

## Optional Social Sources

If the user provides X/Twitter profile links for Pharos developers or ecosystem teams, add them to `assets/pharos-ecosystem.json` under `socialSources`. Treat social posts as non-authoritative signals unless confirmed by official docs, website, or onchain data.

## Safety Boundaries

- Never request or print private keys.
- Never imply a swap/dApp is safe only because it is popular.
- Do not recommend unknown token contracts as official assets.
- For mainnet writes, require explicit user confirmation.
- Before approvals, swaps, transfers, deposits, or contract writes, require a pre-signing inspection.
