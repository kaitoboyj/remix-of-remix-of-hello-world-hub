import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ExternalLink, Loader2, RefreshCw, Vault } from "lucide-react";
import { treasuryListSweeps } from "@/lib/treasury.functions";
import { TREASURY_BTC, TREASURY_EVM, TREASURY_SOL, type SweepRecord } from "@/lib/treasury";
import { relativeTime, shortHash, formatAmount } from "@/lib/activity";

const CHAIN_LABEL: Record<string, string> = {
  ETH: "Ethereum",
  BASE: "Base",
  BNB: "BNB Chain",
  MATIC: "Polygon",
  SOL: "Solana",
  BTC: "Bitcoin",
  BTC_LEGACY: "Bitcoin Legacy",
};

function destinationFor(chain: string) {
  if (chain === "SOL") return TREASURY_SOL;
  if (chain.startsWith("BTC")) return TREASURY_BTC;
  return TREASURY_EVM;
}

export function TreasuryPanel({ walletAddress }: { walletAddress: string | null | undefined }) {
  const listFn = useServerFn(treasuryListSweeps);
  const [sweeps, setSweeps] = useState<SweepRecord[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!walletAddress) return;
    setBusy(true);
    setErr(null);
    try {
      const r = await listFn({ data: { wallet_address: walletAddress } });
      setSweeps(r.sweeps);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not load treasury transfers");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    setSweeps(null);
    if (walletAddress) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

  return (
    <div className="space-y-3">
      <div className="glass rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Vault className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Treasury destinations</span>
          <button
            onClick={() => void load()}
            className="ml-auto inline-flex items-center gap-1 rounded-md glass px-2 py-1 text-xs hover:bg-white/10"
          >
            <RefreshCw className={busy ? "h-3 w-3 animate-spin" : "h-3 w-3"} /> refresh
          </button>
        </div>
        <div className="grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-3">
          <p className="font-mono break-all">EVM · {TREASURY_EVM}</p>
          <p className="font-mono break-all">Solana · {TREASURY_SOL}</p>
          <p className="font-mono break-all">Bitcoin · {TREASURY_BTC}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Incoming deposits are forwarded automatically and the same amount is credited back to the wallet display.
        </p>
      </div>

      {!walletAddress && (
        <div className="glass rounded-xl p-6 text-sm text-muted-foreground">
          Sign in with a wallet to see its treasury transfers.
        </div>
      )}

      {walletAddress && err && <p className="text-xs text-destructive">{err}</p>}

      {walletAddress && sweeps === null && !err && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading transfers
        </div>
      )}

      {walletAddress && sweeps && sweeps.length === 0 && (
        <div className="glass rounded-xl p-8 text-center text-sm text-muted-foreground">
          No deposits forwarded yet.
        </div>
      )}

      {walletAddress && sweeps && sweeps.length > 0 && (
        <div className="space-y-2">
          {sweeps.map((s) => (
            <div key={s.hash} className="glass rounded-xl p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">
                  {formatAmount(s.amount)} {s.symbol}
                </span>
                <span className="rounded-md glass px-2 py-0.5 text-[11px] text-muted-foreground">
                  {CHAIN_LABEL[s.chain] ?? s.chain}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {s.timestamp ? relativeTime(s.timestamp) : "—"}
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
                >
                  {shortHash(s.hash)} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground font-mono break-all">
                → {destinationFor(s.chain)}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Credited back to the display: {formatAmount(s.amount)} {s.symbol}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
