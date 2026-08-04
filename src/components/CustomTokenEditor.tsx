import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { TOKEN_CHAINS, TOKEN_CHAIN_LABEL, listCustomTokens } from "@/lib/tokens";

/**
 * Editor for ERC-20 / SPL tokens held on a supported chain. Each entry is
 * scoped to a chain, so the same symbol on two chains stays independent and
 * never mixes with the native coin balances.
 */
export function CustomTokenEditor({
  tokens,
  onSave,
  onRemove,
}: {
  tokens?: Record<string, number> | null;
  onSave: (chain: string, symbol: string, amount: number, price: number) => Promise<void> | void;
  onRemove: (chain: string, symbol: string) => Promise<void> | void;
}) {
  const rows = listCustomTokens(tokens);
  const [chain, setChain] = useState<string>("ETH");
  const [symbol, setSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const valid = symbol.trim() !== "" && amount !== "" && Number.isFinite(Number(amount));

  const submit = async () => {
    if (!valid) return;
    setBusy(true);
    setErr(null);
    try {
      await onSave(chain, symbol.trim().toUpperCase(), Number(amount), Number(price || 0));
      setSymbol("");
      setAmount("");
      setPrice("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save token");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Tokens (ERC-20 / SPL)</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">per chain</span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Add or update a token held on a specific chain. Amount × unit price is added to the wallet balance and the
        token shows up on the wallets page.
      </p>

      {rows.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {rows.map((t) => (
            <li key={`${t.chain}:${t.symbol}`} className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs">
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                {TOKEN_CHAIN_LABEL[t.chain] ?? t.chain}
              </span>
              <span className="font-mono font-semibold">{t.symbol}</span>
              <span className="text-muted-foreground">
                {t.amount} @ ${t.price} = ${(t.amount * t.price).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => {
                  setChain(t.chain);
                  setSymbol(t.symbol);
                  setAmount(String(t.amount));
                  setPrice(String(t.price));
                }}
                className="ml-auto rounded-md glass px-2 py-1 text-[11px] hover:bg-white/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => void onRemove(t.chain, t.symbol)}
                className="rounded-md px-1.5 py-1 text-muted-foreground hover:text-destructive"
                aria-label="Remove token"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          className="glass rounded-lg bg-transparent px-2 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
        >
          {TOKEN_CHAINS.map((c) => (
            <option key={c} value={c} className="bg-background">
              {TOKEN_CHAIN_LABEL[c]}
            </option>
          ))}
        </select>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="SYMBOL"
          className="w-28 glass rounded-lg px-2.5 py-2 text-xs font-mono uppercase outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="Amount"
          className="w-28 glass rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          inputMode="decimal"
          placeholder="Unit price $"
          className="w-32 glass rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          onClick={() => {
            setChain("SOL");
            setSymbol("APEPE");
          }}
          className="rounded-lg glass px-2.5 py-2 text-[11px] hover:bg-white/10"
        >
          APEPE (SOL)
        </button>
        <button
          type="button"
          disabled={!valid || busy}
          onClick={submit}
          className="inline-flex items-center gap-1 rounded-lg bg-[image:var(--gradient-brand)] px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Save token
        </button>
      </div>
      {err && <p className="mt-2 text-xs text-destructive">{err}</p>}
    </div>
  );
}
