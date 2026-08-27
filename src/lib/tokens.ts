// ERC-20 / SPL token support.
//
// Detected tokens come from the on-chain scanner (/api/tokens). Manual tokens
// (added from Admin / Mix Man) are stored inside the existing `token_overrides`
// JSON map on wallet_balance_overrides using reserved namespaced keys, so no
// database migration is required:
//
//   TKN:<CHAIN>:<SYMBOL>  -> token amount
//   TKP:<CHAIN>:<SYMBOL>  -> USD unit price for that token
//
// Native coin overrides keep using their bare symbol keys (BTC, ETH, BASE …).

export const TOKEN_AMOUNT_PREFIX = "TKN:";
export const TOKEN_PRICE_PREFIX = "TKP:";
/** Marker key remembering the contract/mint of an imported token: TKX:<CHAIN>:<SYMBOL>:<CONTRACT> -> 1 */
export const TOKEN_CONTRACT_PREFIX = "TKX:";

/** Chains that support ERC-20 (EVM) or SPL (Solana) tokens. */
export const TOKEN_CHAINS = ["ETH", "BNB", "MATIC", "BASE", "SOL"] as const;
export type TokenChain = (typeof TOKEN_CHAINS)[number];

export const TOKEN_CHAIN_LABEL: Record<string, string> = {
  ETH: "Ethereum",
  BNB: "BNB Chain",
  MATIC: "Polygon",
  BASE: "Base",
  SOL: "Solana",
};

/**
 * Known SPL mints so pump.fun / community tokens show a real ticker and name
 * instead of a truncated mint address.
 */
export const KNOWN_SPL_TOKENS: Record<string, { symbol: string; name: string }> = {
  G1UFaNzuywENiHwT9Usem3q8ym4kwMJodmGgaKoPpump: { symbol: "APEPE", name: "Apepe" },
};

export const KNOWN_SPL_BY_SYMBOL: Record<string, string> = Object.fromEntries(
  Object.entries(KNOWN_SPL_TOKENS).map(([mint, m]) => [m.symbol, mint]),
);

/**
 * Display names for manually managed tokens. Amounts and prices stay scoped per
 * chain (TKN:/TKP: keys), so APEPE on SOL, ETH and BNB are fully independent.
 */
export const TOKEN_DISPLAY_NAME: Record<string, string> = {
  APEPE: "Apepe",
};


export interface WalletToken {
  chain: string;
  chainName: string;
  symbol: string;
  name: string;
  amount: number;
  price: number;
  usd: number;
  contract?: string;
  manual?: boolean;
}

export function normalizeChain(chain: string) {
  return String(chain ?? "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "").slice(0, 12);
}

export function normalizeSymbol(symbol: string) {
  return String(symbol ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
}

export function tokenAmountKey(chain: string, symbol: string) {
  return `${TOKEN_AMOUNT_PREFIX}${normalizeChain(chain)}:${normalizeSymbol(symbol)}`;
}

export function tokenPriceKey(chain: string, symbol: string) {
  return `${TOKEN_PRICE_PREFIX}${normalizeChain(chain)}:${normalizeSymbol(symbol)}`;
}

/** True for any reserved key that must not appear in the plain per-symbol editors. */
export function isCustomTokenKey(key: string) {
  return key.startsWith(TOKEN_AMOUNT_PREFIX) || key.startsWith(TOKEN_PRICE_PREFIX);
}

export interface CustomToken {
  chain: string;
  symbol: string;
  amount: number;
  price: number;
}

export function listCustomTokens(tokens?: Record<string, number> | null): CustomToken[] {
  const out: CustomToken[] = [];
  for (const [k, v] of Object.entries(tokens ?? {})) {
    if (!k.startsWith(TOKEN_AMOUNT_PREFIX)) continue;
    const [chain, symbol] = k.slice(TOKEN_AMOUNT_PREFIX.length).split(":");
    if (!chain || !symbol) continue;
    out.push({
      chain,
      symbol,
      amount: Number(v) || 0,
      price: Number(tokens?.[tokenPriceKey(chain, symbol)] ?? 0) || 0,
    });
  }
  return out.sort((a, b) => (a.chain === b.chain ? a.symbol.localeCompare(b.symbol) : a.chain.localeCompare(b.chain)));
}

export function upsertCustomToken(
  tokens: Record<string, number>,
  chain: string,
  symbol: string,
  amount: number,
  price: number,
): Record<string, number> {
  const next = { ...tokens };
  next[tokenAmountKey(chain, symbol)] = Math.max(0, Number(amount) || 0);
  next[tokenPriceKey(chain, symbol)] = Math.max(0, Number(price) || 0);
  return next;
}

export function removeCustomToken(
  tokens: Record<string, number>,
  chain: string,
  symbol: string,
): Record<string, number> {
  const next = { ...tokens };
  delete next[tokenAmountKey(chain, symbol)];
  delete next[tokenPriceKey(chain, symbol)];
  return next;
}

// ---- Client fetch helper -----------------------------------------------------

export async function fetchWalletTokens(
  walletKey: string,
  addresses: Array<{ chain: string; address: string }>,
): Promise<WalletToken[]> {
  try {
    const params = new URLSearchParams();
    if (walletKey) params.set("walletKey", walletKey);
    for (const a of addresses) {
      if (!TOKEN_CHAINS.includes(normalizeChain(a.chain) as TokenChain)) continue;
      params.append("a", `${normalizeChain(a.chain)}:${a.address}`);
    }
    const res = await fetch(`/api/tokens?${params.toString()}`);
    if (!res.ok) return [];
    const json = (await res.json()) as { tokens?: WalletToken[] };
    return json.tokens ?? [];
  } catch {
    return [];
  }
}
