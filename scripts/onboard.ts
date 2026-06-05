#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type NetworkName = "mainnet" | "atlantic-testnet";

type Network = {
  name: NetworkName;
  displayName: string;
  rpcUrl: string;
  chainId: number;
  explorerUrl: string;
  nativeToken: string;
};

type Token = {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  category: string;
};

type Ecosystem = {
  official: Record<string, string>;
  networkSummary: Record<string, string>;
  swapVenues: Array<{
    name: string;
    category: string;
    status: string;
    tradeUrl?: string;
    description: string;
    docs: string;
    safeUseChecklist: string[];
  }>;
  zeroProsVenues?: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  pharosSwapVenues?: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  cexVenues?: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  marketReferences?: Array<{
    name: string;
    type: string;
    url: string;
    note: string;
  }>;
  onboardingPaths: Array<{
    id: string;
    title: string;
    goal: string;
    steps: string[];
  }>;
  socialSources: string[];
};

type PortProject = {
  name: string;
  status: "active" | "coming_soon";
  tags: string[];
  url: string;
  description: string;
};

type PortEcosystem = {
  source: {
    page: string;
    fetchedAt: string;
    note: string;
  };
  portalSummary: {
    title: string;
    description: string;
  };
  counts: {
    totalProjects: number;
    activeProjects: number;
    comingSoonProjects: number;
    tags: Record<string, number>;
  };
  projects: PortProject[];
  partners: {
    row1: Array<{ name: string; status: string }>;
    row2: Array<{ name: string; status: string }>;
  };
};

type PortRoute = {
  name: string;
  category: string;
  url: string;
  description: string;
  startTime?: string;
  endTime?: string;
};

type PortRoutes = {
  source: {
    page: string;
    fetchedAt: string;
    note: string;
  };
  summary: {
    title: string;
    description: string;
  };
  officialRoutes: PortRoute[];
};

type WalletReadiness = {
  address: string;
  accountType: "EOA" | "CONTRACT" | "UNKNOWN";
  nativeBalance: string;
  nativeBalanceWei: string;
  transactionCount: number;
  gasStatus: "NO_GAS" | "LOW_GAS" | "HAS_GAS" | "UNKNOWN";
  knownTokenBalances: Array<{
    symbol: string;
    name: string;
    address: string;
    balance: string;
    rawBalance: string;
    category: string;
  }>;
};

type Report = {
  skill: string;
  network: {
    name: string;
    displayName: string;
    chainId: number;
    nativeToken: string;
    explorerUrl: string;
  };
  stage: string;
  answer: string;
  walletReadiness?: WalletReadiness;
  pharosContext: string[];
  swapGuidance: string[];
  portRouteMatches: PortRoute[];
  ecosystemMatches: PortProject[];
  zeroProsLinks: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  pharosSwapLinks: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  cexLinks: Array<{
    name: string;
    type: string;
    pair: string;
    url: string;
    note: string;
  }>;
  recommendedNextActions: string[];
  safetyNotes: string[];
  sources: Record<string, string>;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
}

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const args: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function normalizeNetwork(value: unknown): NetworkName {
  const raw = typeof value === "string" ? value.toLowerCase() : "";
  if (raw.includes("atlantic") || raw.includes("testnet") || raw.includes("phrs")) {
    return "atlantic-testnet";
  }
  return "mainnet";
}

function isAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

async function rpc<T>(network: Network, method: string, params: unknown[]): Promise<T> {
  const response = await fetch(network.rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params
    })
  });

  if (!response.ok) {
    throw new Error(`RPC HTTP ${response.status} from ${network.rpcUrl}`);
  }

  const body = await response.json() as { result?: T; error?: { message?: string } };
  if (body.error) {
    throw new Error(body.error.message ?? `RPC error on ${method}`);
  }
  if (body.result === undefined) {
    throw new Error(`RPC response missing result for ${method}`);
  }
  return body.result;
}

function encodeBalanceOf(address: string): string {
  return `0x70a08231000000000000000000000000${address.slice(2).toLowerCase()}`;
}

function weiToDecimal(raw: bigint, decimals: number, precision = 6): string {
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  const fraction = raw % base;
  if (fraction === 0n) return whole.toString();

  const padded = fraction.toString().padStart(decimals, "0");
  const trimmed = padded.slice(0, precision).replace(/0+$/, "");
  return trimmed.length > 0 ? `${whole.toString()}.${trimmed}` : whole.toString();
}

function hexToBigInt(value: string): bigint {
  if (!value || value === "0x") return 0n;
  return BigInt(value);
}

function classifyGas(balanceWei: bigint): WalletReadiness["gasStatus"] {
  const lowGas = 10n ** 15n;
  if (balanceWei === 0n) return "NO_GAS";
  if (balanceWei < lowGas) return "LOW_GAS";
  return "HAS_GAS";
}

async function inspectWallet(network: Network, tokens: Token[], address: string): Promise<WalletReadiness> {
  if (!isAddress(address)) {
    throw new Error("Invalid wallet address. Expected 0x + 40 hex characters.");
  }

  const [balanceHex, txCountHex, code] = await Promise.all([
    rpc<string>(network, "eth_getBalance", [address, "latest"]),
    rpc<string>(network, "eth_getTransactionCount", [address, "latest"]),
    rpc<string>(network, "eth_getCode", [address, "latest"])
  ]);

  const balanceWei = hexToBigInt(balanceHex);
  const knownTokenBalances = await Promise.all(tokens.map(async (token) => {
    try {
      const raw = await rpc<string>(network, "eth_call", [
        {
          to: token.address,
          data: encodeBalanceOf(address)
        },
        "latest"
      ]);
      const rawBalance = hexToBigInt(raw);
      return {
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        balance: weiToDecimal(rawBalance, token.decimals),
        rawBalance: rawBalance.toString(),
        category: token.category
      };
    } catch {
      return {
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        balance: "unreadable",
        rawBalance: "0",
        category: token.category
      };
    }
  }));

  return {
    address,
    accountType: code && code !== "0x" ? "CONTRACT" : "EOA",
    nativeBalance: weiToDecimal(balanceWei, 18),
    nativeBalanceWei: balanceWei.toString(),
    transactionCount: Number(hexToBigInt(txCountHex)),
    gasStatus: classifyGas(balanceWei),
    knownTokenBalances
  };
}

function isSwapAsk(ask: string): boolean {
  const value = ask.toLowerCase();
  return ["swap", "trade", "buy", "purchase", "convert", "bridge", "dex", "faroswap", "jumper", "купить", "свап", "обмен", "бридж", "мост", "перевести", "завести", "другой сети", "другая сеть", "в фарос"].some((term) => value.includes(term));
}

function isPharosAsk(ask: string): boolean {
  const value = ask.toLowerCase();
  return ["pharos", "pros", "phrs", "realfi", "rwa", "mainnet", "testnet"].some((term) => value.includes(term));
}

function selectEcosystemProjects(ask: string, port: PortEcosystem): PortProject[] {
  const value = ask.toLowerCase();
  const tagMap: Array<{ terms: string[]; tags: string[]; names?: string[] }> = [
    { terms: ["stake", "staking", "застейк", "стейк", "доход", "yield", "earn"], tags: ["LST", "Yield Farming", "Vault", "Lending"], names: ["Faroo", "Bifrost", "TermMax", "Ember"] },
    { terms: ["bridge", "мост", "бридж", "cross-chain", "cross chain", "0 pros", "перевести", "завести", "другой сети", "другая сеть", "в фарос"], tags: ["Bridge"], names: ["Jumper", "InterPort", "LI.FI", "LayerZero"] },
    { terms: ["swap", "dex", "свап", "обмен"], tags: ["DEX"], names: ["Faroswap", "Agra", "Bitverse"] },
    { terms: ["rwa", "realfi", "real-world", "real world"], tags: ["RWA"], names: ["Zona", "AquaFlux", "R25", "Asseto", "Bitverse"] },
    { terms: ["wallet", "кошелек", "wallets"], tags: ["Wallet"], names: ["OKX Wallet", "TopNod", "OneKey"] },
    { terms: ["explorer", "scan", "block explorer", "эксплорер"], tags: ["Block Explorer"], names: ["LayerHub", "Hemera"] },
    { terms: ["security", "audit", "аудит", "safe", "multisig"], tags: ["Security", "Multisig"], names: ["Safe", "Openzepplin", "Zellic", "Hypernative", "ExVul Security"] },
    { terms: ["oracle", "оракул"], tags: ["Oracle"], names: ["Chainlink", "Supra"] },
    { terms: ["ramp", "fiat", "купить картой", "onramp", "offramp"], tags: ["On/Off Ramp"], names: ["Alchemy Pay"] },
    { terms: ["domain", "name", "did", "identity"], tags: ["DID"], names: ["PNS", "ZNS Connect"] }
  ];

  const matched = tagMap.filter((entry) => entry.terms.some((term) => value.includes(term)));
  const selected = matched.length > 0
    ? port.projects.filter((project) => matched.some((entry) =>
      project.tags.some((tag) => entry.tags.includes(tag)) || entry.names?.includes(project.name)
    ))
    : value.includes("ecosystem") || value.includes("экосистем")
      ? port.projects.filter((project) => project.status === "active").slice(0, 12)
      : [];

  return selected
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === "active" ? -1 : 1;
      return a.name.localeCompare(b.name);
    })
    .slice(0, 10);
}

function selectPortRoutes(ask: string, routes: PortRoutes): PortRoute[] {
  const value = ask.toLowerCase();
  const categoryMap: Array<{ terms: string[]; categories: string[]; names?: string[] }> = [
    { terms: ["game", "games", "play", "activity", "activities", "prospixel", "pros pixel", "pixel", "\u0438\u0433\u0440\u0430", "\u0438\u0433\u0440\u044b", "\u0438\u0433\u0440\u0430\u0442\u044c", "\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u0438", "\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c"], categories: ["game"] },
    { terms: ["port", "порт", "main", "home", "главная"], categories: ["portal"] },
    { terms: ["airdrop", "claim", "rewards", "reward", "награ", "аирдроп", "клейм"], categories: ["rewards"] },
    { terms: ["campaign", "камп", "blockwaver"], categories: ["rewards"] },
    { terms: ["bridge", "бридж", "мост", "перевести", "завести", "другой сети"], categories: ["bridge"] },
    { terms: ["swap", "свап", "обмен"], categories: ["swap"] },
    { terms: ["ramp", "fiat", "карта", "картой", "onramp"], categories: ["ramp"] },
    { terms: ["harbor", "rwa", "realfi", "real-world"], categories: ["rwa", "harbor"] },
    { terms: ["ecosystem", "экосистем", "projects", "partners"], categories: ["ecosystem"] },
    { terms: ["verify contract", "contract verification", "verify source", "source code verification", "verified contract", "\u0432\u0435\u0440\u0438\u0444\u0438\u0446\u0438\u0440\u043e\u0432\u0430\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442", "\u0432\u0435\u0440\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442\u0430", "\u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u043a\u043e\u043d\u0442\u0440\u0430\u043a\u0442"], categories: ["contract-verification"] },
    { terms: ["explorer", "scan", "pharosscan", "transaction", "transactions", "tx", "history", "address", "wallet activity", "\u0442\u0440\u0430\u043d\u0437\u0430\u043a\u0446", "\u0438\u0441\u0442\u043e\u0440\u0438", "\u044d\u043a\u0441\u043f\u043b\u043e\u0440\u0435\u0440", "\u0441\u043a\u0430\u043d", "\u0430\u0434\u0440\u0435\u0441", "\u043a\u043e\u0448\u0435\u043b\u0435\u043a"], categories: ["explorer"] },
    { terms: ["stake", "staking", "стейк", "застейк"], categories: ["staking"] },
    { terms: ["node", "nodes", "нода", "ноды"], categories: ["infra"] },
    { terms: ["docs", "documentation", "доки", "документац", "blog", "news", "research", "foundation"], categories: ["resources"] }
  ];
  const matched = categoryMap.filter((entry) => entry.terms.some((term) => value.includes(term)));
  if (matched.length === 0) return [];
  const allRoutes = routes.officialRoutes;
  return allRoutes
    .filter((route) => matched.some((entry) =>
      entry.categories.includes(route.category) || entry.names?.includes(route.name)
    ))
    .slice(0, 8);
}

function classifyStage(wallet?: WalletReadiness): string {
  if (!wallet) return "GUIDE";
  const nativeWei = BigInt(wallet.nativeBalanceWei);
  const hasKnownAsset = wallet.knownTokenBalances.some((token) => {
    try {
      return BigInt(token.rawBalance) > 0n;
    } catch {
      return false;
    }
  });
  const hasStableOrWrapped = wallet.knownTokenBalances.some((token) => {
    try {
      return BigInt(token.rawBalance) > 0n && ["stablecoin", "wrapped-native"].includes(token.category);
    } catch {
      return false;
    }
  });

  if (wallet.accountType === "CONTRACT") return "NEEDS_ATTENTION";
  if (nativeWei === 0n && wallet.transactionCount === 0) return "NEW";
  if (nativeWei > 0n && wallet.transactionCount === 0) return "FUNDED";
  if (nativeWei > 0n && hasStableOrWrapped) return "READY_FOR_REALFI";
  if (nativeWei > 0n && (wallet.transactionCount > 0 || hasKnownAsset)) return "READY_FOR_SWAP";
  if (wallet.transactionCount > 0) return "ACTIVE";
  return "NEEDS_ATTENTION";
}

function buildReport(network: Network, tokens: Token[], ecosystem: Ecosystem, port: PortEcosystem, routes: PortRoutes, ask: string, wallet?: WalletReadiness): Report {
  const stage = classifyStage(wallet);
  const wantsSwap = isSwapAsk(ask);
  const wantsPharos = isPharosAsk(ask);

  const pharosContext = [
    `${network.displayName} uses chain id ${network.chainId} and native token ${network.nativeToken}.`,
    ecosystem.networkSummary.positioning,
    `Explorer: ${network.explorerUrl}`,
    `Known local tokens: ${tokens.map((token) => `${token.symbol} (${token.address})`).join(", ")}`
  ];

  const swapVenue = ecosystem.swapVenues[0];
  const zeroProsLinks = ecosystem.zeroProsVenues ?? [];
  const pharosSwapLinks = ecosystem.pharosSwapVenues ?? [];
  const cexLinks = ecosystem.cexVenues ?? [];
  const portRouteMatches = selectPortRoutes(ask, routes);
  const ecosystemMatches = selectEcosystemProjects(ask, port);
  const swapGuidance = wantsSwap ? [
    "If the wallet has 0 PROS or needs to bring funds from another chain, start with the official Pharos Port Bridge.",
    "Use Jumper as a direct bridge aggregator route when Pharos routes are available, or buy PROS on a CEX first.",
    `If the wallet already has assets on Pharos, use ${swapVenue.name}: ${swapVenue.tradeUrl ?? swapVenue.docs}`,
    `For native PROS swaps, confirm the wallet is on ${network.displayName}; wrapped PROS is listed locally as WPROS on mainnet.`,
    "Verify token addresses, not only symbols, before approving or swapping.",
    "Start with a small test swap for new routes or new tokens.",
    "Run a pre-signing transaction firewall check on approval and swap calldata before the agent signs."
  ] : [];

  const recommendedNextActions: string[] = [];
  if (!wallet) {
    if (ecosystemMatches.length > 0 && !wantsSwap) {
      recommendedNextActions.push(
        "Review the matched Pharos Port projects and open only the official project URLs.",
        "Ask the user for a wallet address if they want readiness checks before interacting.",
        "Before any deposit, staking, lending, vault, or approval transaction, run pre-signing inspection."
      );
    } else {
      recommendedNextActions.push(
        "Ask the user for a wallet address to produce a personalized readiness score.",
        `If the goal is swapping PROS, use ${network.displayName} and verify the target token address first.`,
        "Use read-only checks first; require firewall inspection before any approval or swap."
      );
    }
  } else if (stage === "NEW") {
    recommendedNextActions.push(
      `Fund the wallet with a small amount of ${network.nativeToken} for gas.`,
      "Confirm the address in PharosScan before attempting a write transaction.",
      "Avoid approving or swapping unsolicited dust tokens."
    );
  } else if (stage === "FUNDED") {
    recommendedNextActions.push(
      "The wallet has gas. Start with a low-risk first action or a small test swap.",
      "If swapping, verify the token pair and inspect approval calldata.",
      "Use the explorer link to confirm the first transaction."
    );
  } else if (stage === "READY_FOR_SWAP") {
    recommendedNextActions.push(
      "Wallet looks ready for a cautious swap flow.",
      "Prepare the route, then inspect approval and swap calldata before signing.",
      "Avoid unlimited approvals to unknown spenders."
    );
  } else if (stage === "READY_FOR_REALFI") {
    recommendedNextActions.push(
      "Wallet has signs of readiness for RealFi exploration.",
      "Start with read-only protocol/vault checks before deposits.",
      "Inspect any deposit, approval, or vault interaction transaction before signing."
    );
  } else {
    recommendedNextActions.push(
      "Review wallet/account state before recommending a write transaction.",
      "Use read-only checks and require explicit confirmation for mainnet actions."
    );
  }

  const safetyNotes = [
    "Never ask for private keys or seed phrases.",
    "Mainnet write actions require explicit user confirmation.",
    "Unknown token symbols, dust tokens, and unsolicited wallet airdrops are not safe swap targets by default.",
    "Approvals, swaps, transfers, deposits, and admin calls should pass transaction-firewall inspection before signing."
  ];

  const answer = wantsSwap
    ? `For PROS onboarding, use Pharos Port Bridge or a CEX when the wallet has 0 PROS; use ${swapVenue.name} only after assets are already on Pharos. Always confirm ${network.displayName}, verify token addresses, and run pre-signing checks before approval or swap.`
    : portRouteMatches.length > 0 || ecosystemMatches.length > 0
      ? "I found relevant Pharos Port routes and ecosystem entries for this request. Treat them as official discovery links first, then verify live app support and inspect any transaction before signing."
    : wantsPharos
      ? "Pharos onboarding should start with network readiness, wallet gas, known-token checks, and a safe next action matched to the user's goal."
      : "This skill can answer Pharos onboarding questions, inspect wallet readiness, and produce safe next onchain steps.";

  return {
    skill: "pharos-onchain-onboarding-flow",
    network: {
      name: network.name,
      displayName: network.displayName,
      chainId: network.chainId,
      nativeToken: network.nativeToken,
      explorerUrl: network.explorerUrl
    },
    stage,
    answer,
    walletReadiness: wallet,
    pharosContext,
    swapGuidance,
    portRouteMatches,
    ecosystemMatches,
    zeroProsLinks,
    pharosSwapLinks,
    cexLinks,
    recommendedNextActions,
    safetyNotes,
    sources: ecosystem.official
  };
}

function printHuman(report: Report): void {
  console.log(`Pharos Onchain Onboarding Flow`);
  console.log(`Decision stage: ${report.stage}`);
  console.log(`Network: ${report.network.displayName} (${report.network.chainId})`);
  console.log("");
  console.log(report.answer);
  console.log("");

  if (report.walletReadiness) {
    const wallet = report.walletReadiness;
    console.log("Wallet readiness");
    console.log(`- Address: ${wallet.address}`);
    console.log(`- Account type: ${wallet.accountType}`);
    console.log(`- Native balance: ${wallet.nativeBalance} ${report.network.nativeToken}`);
    console.log(`- Transaction count: ${wallet.transactionCount}`);
    console.log(`- Gas status: ${wallet.gasStatus}`);
    console.log("- Known token balances:");
    for (const token of wallet.knownTokenBalances) {
      console.log(`  - ${token.symbol}: ${token.balance}`);
    }
    console.log("");
  }

  console.log("Recommended next actions");
  for (const action of report.recommendedNextActions) {
    console.log(`- ${action}`);
  }
  console.log("");

  if (report.swapGuidance.length > 0) {
    console.log("Swap guidance");
    for (const item of report.swapGuidance) {
      console.log(`- ${item}`);
    }
    console.log("");
  }

  if (report.portRouteMatches.length > 0) {
    console.log("Pharos Port routes");
    for (const route of report.portRouteMatches) {
      const time = route.endTime ? ` (until ${route.endTime})` : "";
      console.log(`- ${route.name} (${route.category})${time}: ${route.url}`);
      console.log(`  ${route.description}`);
    }
    console.log("");
  }

  if (report.ecosystemMatches.length > 0) {
    console.log("Pharos Port ecosystem matches");
    for (const project of report.ecosystemMatches) {
      console.log(`- ${project.name} (${project.status}, ${project.tags.join(", ")}): ${project.url}`);
      console.log(`  ${project.description}`);
    }
    console.log("");
  }

  if (report.swapGuidance.length > 0 && report.zeroProsLinks.length > 0) {
    console.log("Get PROS with 0 PROS");
    for (const venue of report.zeroProsLinks) {
      console.log(`- ${venue.name} (${venue.type}, ${venue.pair}): ${venue.url}`);
    }
    console.log("");
  }

  if (report.swapGuidance.length > 0 && report.pharosSwapLinks.length > 0) {
    console.log("Swap inside Pharos");
    for (const venue of report.pharosSwapLinks) {
      console.log(`- ${venue.name} (${venue.pair}): ${venue.url}`);
    }
    console.log("");
  }

  if (report.swapGuidance.length > 0 && report.cexLinks.length > 0) {
    console.log("CEX");
    for (const venue of report.cexLinks) {
      console.log(`- ${venue.name} (${venue.type}, ${venue.pair}): ${venue.url}`);
    }
    console.log("");
  }

  console.log("Safety notes");
  for (const note of report.safetyNotes) {
    console.log(`- ${note}`);
  }
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const networkName = normalizeNetwork(args.network);
  const networksData = loadJson<{ networks: Network[] }>("assets/networks.json");
  const tokensData = loadJson<Record<NetworkName, Token[]>>("assets/tokens.json");
  const ecosystem = loadJson<Ecosystem>("assets/pharos-ecosystem.json");
  const port = loadJson<PortEcosystem>("assets/pharos-port-ecosystem.json");
  const routes = loadJson<PortRoutes>("assets/pharos-port-routes.json");
  const network = networksData.networks.find((item) => item.name === networkName);
  if (!network) throw new Error(`Unsupported network: ${networkName}`);

  const ask = typeof args.ask === "string" ? args.ask : "How do I start using Pharos safely?";
  const walletArg = typeof args.wallet === "string" ? args.wallet : undefined;
  const tokens = tokensData[networkName] ?? [];
  const wallet = walletArg ? await inspectWallet(network, tokens, walletArg) : undefined;
  const report = buildReport(network, tokens, ecosystem, port, routes, ask, wallet);

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHuman(report);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Onboarding flow failed: ${message}`);
  process.exitCode = 1;
});
