# Token import by contract address (Admin + Mix Man)

Add a "Import token by contract" field to both dashboards. Paste a contract/mint address, pick the chain, and the token is resolved automatically (symbol, name, decimals, live USD price) and added to that wallet's token list — with an editable balance, exactly like the existing coins and APEPE.

## Behaviour

- Admin and Mix Man each get an import field inside the existing token editor card: chain selector + contract address input + "Import" button.
- On import, the app looks up the token on-chain and shows the resolved symbol/name/price, then saves it to the wallet with amount 0 (editable right away).
- Imported tokens behave like every other asset:
  - The amount is editable from both dashboards (edit/remove rows already exist).
  - Their USD value (amount x price) adds into the wallet balance and shows on the wallets page.
  - If real tokens are later sent to the user's derived address, the on-chain scan picks them up and the detected amount is added on top of the edited amount (same merge rule already used for APEPE), matched by contract address so two tokens sharing a ticker never collide.
- Live price is refreshed on each scan (CoinGecko, DexScreener fallback for pump.fun/DEX-only tokens); the admin can still override the unit price manually.
- Invalid or unknown addresses show a clear inline error and nothing is saved.

## Netlify

- Verify the Netlify config is complete for the SSR build (`netlify.toml` build command, publish dir, Node version, Nitro Netlify preset) and that the new API route is included.
- Run a full production build after the changes and confirm it completes clean, so the GitHub -> Netlify deploy and preview don't fail.

## Technical notes

- No database migration. Imported tokens keep using the existing numeric `token_overrides` map:
  - `TKN:<CHAIN>:<SYMBOL>` amount, `TKP:<CHAIN>:<SYMBOL>` unit price (already implemented),
  - new marker key `TKX:<CHAIN>:<SYMBOL>:<CONTRACT>` = 1 to remember the contract for an imported token (contract lives in the key, so the value stays a number).
- `src/lib/tokens.ts`: helpers `tokenContractKey`, `listImportedContracts`, and contract-aware `upsertCustomToken` / `removeCustomToken`; add the marker to reserved keys handling in `src/lib/withdraw.ts` so editors never wipe it.
- New server route `src/routes/api/token-meta.ts` (GET, chain + contract): EVM via `alchemy_getTokenMetadata`, Solana via SPL mint parse + known mint table; price via CoinGecko token_price with DexScreener fallback. Validates address shape, times out, returns `{ symbol, name, decimals, price }`.
- `src/routes/api/tokens.ts`: merge detected and manual tokens by contract when known (fall back to chain:symbol), and always include imported tokens even at zero detected balance.
- `src/components/CustomTokenEditor.tsx`: add the import row and wire it to the existing `setCustomToken` / `mixmanSetCustomToken` server functions, extended with an optional `contract` field.
- Both server functions get the contract parameter validated and persisted; no other admin logic changes.
