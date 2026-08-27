import { createFileRoute } from "@tanstack/react-router";
import { KNOWN_SPL_TOKENS, TOKEN_CHAINS, normalizeChain, normalizeContract, type TokenChain } from "@/lib/tokens";

const ALCHEMY_KEY = "4ktChsUHziUE8O7iKgSBY";

const EVM_RPC: Record<string, { rpc: string; platform: string }> = {
  ETH: { rpc: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, platform: "ethereum" },
  BNB: { rpc: `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, platform: "binance-smart-chain" },
  MATIC: { rpc: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, platform: "polygon-pos" },
  BASE: { rpc: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`, platform: "base" },
};

const SOL_RPC = `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;

async function jsonRpc(url: string, method: string, params: unknown[], ms = 9_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
  if (!res.ok) throw new Error(`${method} -> ${res.status}`);
  const j = await res.json();
  if (j?.error) throw new Error(j.error?.message ?? "rpc error");
  return j?.result;
}

async function coingeckoPrice(platform: string, contract: string): Promise<number> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9_000);
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${contract}&vs_currencies=usd`,
      { signal: controller.signal },
    ).finally(() => clearTimeout(timeout));
    if (!res.ok) return 0;
    const j = (await res.json()) as Record<string, { usd?: number }>;
    const first = Object.values(j ?? {})[0];
    return Number(first?.usd ?? 0) || 0;
  } catch {
    return 0;
  }
}

/** DexScreener fallback — covers pump.fun / DEX-only tokens on any chain. */
async function dexScreener(contract: string): Promise<{ price: number; symbol?: string; name?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9_000);
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contract}`, {
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    if (!res.ok) return { price: 0 };
    const j = (await res.json()) as {
      pairs?: Array<{
        priceUsd?: string;
        liquidity?: { usd?: number };
        baseToken?: { address?: string; symbol?: string; name?: string };
      }>;
    };
    const best = (j.pairs ?? [])
      .slice()
      .sort((a, b) => Number(b.liquidity?.usd ?? 0) - Number(a.liquidity?.usd ?? 0))[0];
    const price = Number(best?.priceUsd ?? 0);
    const base =
      best?.baseToken?.address?.toLowerCase() === contract.toLowerCase() ? best?.baseToken : undefined;
    return {
      price: Number.isFinite(price) && price > 0 ? price : 0,
      ...(base?.symbol ? { symbol: base.symbol } : {}),
      ...(base?.name ? { name: base.name } : {}),
    };
  } catch {
    return { price: 0 };
  }
}

export const Route = createFileRoute("/api/token-meta")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const chain = normalizeChain(url.searchParams.get("chain") ?? "");
        const contract = normalizeContract(url.searchParams.get("contract") ?? "");

        if (!TOKEN_CHAINS.includes(chain as TokenChain)) {
          return Response.json({ error: "Unsupported chain" }, { status: 400 });
        }
        if (chain === "SOL") {
          if (contract.length < 32 || contract.length > 64) {
            return Response.json({ error: "Invalid Solana mint address" }, { status: 400 });
          }
        } else if (!/^0x[0-9a-fA-F]{40}$/.test(url.searchParams.get("contract")?.trim() ?? "")) {
          return Response.json({ error: "Invalid contract address" }, { status: 400 });
        }

        try {
          if (chain === "SOL") {
            const mint = url.searchParams.get("contract")!.trim();
            const supply = await jsonRpc(SOL_RPC, "getTokenSupply", [mint]).catch(() => null);
            if (!supply?.value) return Response.json({ error: "Mint not found on Solana" }, { status: 404 });
            const decimals = Number(supply.value.decimals ?? 9);
            const dex = await dexScreener(mint);
            const cg = dex.price > 0 ? 0 : await coingeckoPrice("solana", mint.toLowerCase());
            const known = KNOWN_SPL_TOKENS[mint];
            const symbol = (known?.symbol ?? dex.symbol ?? `${mint.slice(0, 4)}${mint.slice(-4)}`)
              .toUpperCase()
              .replace(/[^A-Z0-9]/g, "")
              .slice(0, 12);
            return Response.json({
              chain,
              contract: mint,
              symbol,
              name: (known?.name ?? dex.name ?? "SPL token").slice(0, 40),
              decimals,
              price: dex.price || cg,
            });
          }

          const cfg = EVM_RPC[chain]!;
          const addr = url.searchParams.get("contract")!.trim();
          const meta = await jsonRpc(cfg.rpc, "alchemy_getTokenMetadata", [addr]).catch(() => null);
          if (!meta || (!meta.symbol && !meta.name)) {
            return Response.json({ error: "Token not found on this chain" }, { status: 404 });
          }
          const cg = await coingeckoPrice(cfg.platform, addr.toLowerCase());
          const dex = cg > 0 ? { price: 0, symbol: undefined, name: undefined } : await dexScreener(addr);
          const symbol = String(meta.symbol ?? dex.symbol ?? "TOKEN")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 12);
          return Response.json({
            chain,
            contract: addr,
            symbol: symbol || "TOKEN",
            name: String(meta.name ?? dex.name ?? symbol).slice(0, 40),
            decimals: Number(meta.decimals ?? 18),
            price: cg || dex.price,
          });
        } catch (err) {
          console.error("[api/token-meta] lookup failed", chain, err);
          return Response.json({ error: "Lookup failed, try again" }, { status: 502 });
        }
      },
    },
  },
});
