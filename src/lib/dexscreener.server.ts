// DexScreener API helpers (server-only).
//
// DexScreener's public endpoints need NO API key — they are rate limited per IP
// (~300 req/min for the token endpoints, 60 req/min for token-profiles).
// Docs: https://docs.dexscreener.com/api/reference
//
//   /latest/dex/tokens/{addresses}   up to 30 comma separated addresses
//   /latest/dex/search?q=            free text search (symbol / name / pair)
//   /token-profiles/latest/v1        recently listed token profiles
//
// Used by /api/tokens (price + symbol/name enrichment for detected holdings)
// and /api/token-meta (contract import, and symbol lookup).

/** DexScreener chainId -> our chain code. */
export const DEX_CHAIN: Record<string, string> = {
  ethereum: "ETH",
  bsc: "BNB",
  polygon: "MATIC",
  base: "BASE",
  solana: "SOL",
};

/** Our chain code -> DexScreener chainId. */
export const CHAIN_TO_DEX: Record<string, string> = Object.fromEntries(
  Object.entries(DEX_CHAIN).map(([dex, chain]) => [chain, dex]),
);

const TIMEOUT = 9_000;

async function getJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export interface DexToken {
  chain: string;
  contract: string;
  symbol: string;
  name: string;
  price: number;
  liquidity: number;
  /** 24h price change in percent, when DexScreener reports it. */
  change24h: number;
  imageUrl?: string;
}

function pairToToken(pair: any): DexToken | null {
  const contract = String(pair?.baseToken?.address ?? "");
  if (!contract) return null;
  const price = Number(pair?.priceUsd ?? 0);
  const img = pair?.info?.imageUrl ? String(pair.info.imageUrl) : undefined;
  return {
    chain: DEX_CHAIN[String(pair?.chainId ?? "")] ?? "",
    contract,
    symbol: String(pair?.baseToken?.symbol ?? ""),
    name: String(pair?.baseToken?.name ?? ""),
    price: Number.isFinite(price) && price > 0 ? price : 0,
    liquidity: Number(pair?.liquidity?.usd ?? 0) || 0,
    change24h: Number(pair?.priceChange?.h24 ?? 0) || 0,
    ...(img ? { imageUrl: img } : {}),
  };
}

/** Deepest-liquidity pair per base token address, optionally scoped to a chain. */
function bestByToken(pairs: any[], wantChain?: string): Map<string, DexToken> {
  const out = new Map<string, DexToken>();
  for (const p of pairs) {
    const t = pairToToken(p);
    if (!t) continue;
    if (wantChain && t.chain !== wantChain) continue;
    const key = t.contract.toLowerCase();
    const prev = out.get(key);
    if (!prev || t.liquidity > prev.liquidity) out.set(key, t);
  }
  return out;
}

/**
 * Look up one token by contract / mint address. Falls back to any chain when
 * the requested chain has no pool for it.
 */
export async function dexTokenByAddress(contract: string, wantChain?: string): Promise<DexToken | null> {
  const j = await getJson(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(contract)}`);
  const pairs: any[] = Array.isArray(j?.pairs) ? j.pairs : [];
  const scoped = bestByToken(pairs, wantChain).get(contract.toLowerCase());
  if (scoped) return scoped;
  return bestByToken(pairs).get(contract.toLowerCase()) ?? null;
}

/**
 * Batch lookup — DexScreener accepts up to 30 addresses per call. Returns a map
 * keyed by lowercase address.
 */
export async function dexTokensByAddresses(
  addresses: string[],
  wantChain?: string,
): Promise<Record<string, DexToken>> {
  const out: Record<string, DexToken> = {};
  const list = addresses.filter(Boolean).slice(0, 60);
  if (list.length === 0) return out;
  for (let i = 0; i < list.length; i += 30) {
    const batch = list.slice(i, i + 30);
    const j = await getJson(
      `https://api.dexscreener.com/latest/dex/tokens/${batch.map(encodeURIComponent).join(",")}`,
    );
    const pairs: any[] = Array.isArray(j?.pairs) ? j.pairs : [];
    const best = bestByToken(pairs, wantChain);
    // if the chain filter hid everything, retry unscoped for this batch
    const source = best.size > 0 ? best : bestByToken(pairs);
    for (const [addr, token] of source) out[addr] = token;
  }
  return out;
}

/** Free-text search (symbol, name or pair) — used to import a token by ticker. */
export async function dexSearch(query: string, wantChain?: string): Promise<DexToken[]> {
  const j = await getJson(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`);
  const pairs: any[] = Array.isArray(j?.pairs) ? j.pairs : [];
  const best = bestByToken(pairs, wantChain);
  const list = Array.from((best.size > 0 ? best : bestByToken(pairs)).values());
  return list.sort((a, b) => b.liquidity - a.liquidity).slice(0, 20);
}

/** Prices only, keyed by lowercase address. */
export async function dexPrices(addresses: string[], wantChain?: string): Promise<Record<string, number>> {
  const tokens = await dexTokensByAddresses(addresses, wantChain);
  const out: Record<string, number> = {};
  for (const [addr, t] of Object.entries(tokens)) if (t.price > 0) out[addr] = t.price;
  return out;
}
