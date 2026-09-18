# Fix "Invalid API key" on the Netlify preview

## Root cause (confirmed)

When you import or create a wallet, the site calls server functions that talk to your Supabase project. Those calls use `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL`, which are read **inside Netlify's server environment** (`src/integrations/supabase/client.server.ts`). The "Invalid API key" message is Supabase's own error — Netlify is sending it a wrong or placeholder key. The code itself is fine; the browser-side `VITE_*` keys are baked in at build time and appear correct.

Most likely cause: Netlify's `SUPABASE_SERVICE_ROLE_KEY` is missing or still set to the placeholder `your_supabase_service_role_key_here` from `.env.example`.

## What to do (user action, no code changes needed)

1. **Get the real keys from Supabase:**
   - Go to supabase.com → your project (`oryxjnvbglscrdjtjnbd`) → **Project Settings → API keys**.
   - Copy the **publishable key** (`sb_publishable_...`) and the **secret / service_role key** (`sb_secret_...` or the legacy JWT).

2. **Set them in Netlify** (Site settings → Environment variables):
   - `SUPABASE_URL` = `https://oryxjnvbglscrdjtjnbd.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = your publishable key
   - `SUPABASE_SERVICE_ROLE_KEY` = your secret key ← this is the one that fixes wallet import
   - Also confirm the `VITE_` ones are set: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, plus `ADMIN_PASSWORD`, `THIRDWEB_CLIENT_ID`, `TELEGRAM_BOT_TOKEN`.

3. **Redeploy:** Netlify → Deploys → "Clear cache and deploy site". Environment changes only take effect on a fresh deploy.

4. Test wallet import again on the live site.

## Technical details

- Error source: `src/integrations/supabase/client.server.ts` builds the admin client from `process.env.SUPABASE_SERVICE_ROLE_KEY` at request time; Supabase returns "Invalid API key" (401) when the key is wrong.
- `.env.example` values are never read by Netlify — it is a documentation file only. Values must be pasted into Netlify's UI.
- Wallet import path: `src/routes/wallet.tsx` → `registerWalletProfileFn` (`src/lib/wallet-profile.functions.ts`) → `supabaseAdmin`.
- No source-code changes are required for this fix.

## Optional hardening (can be done on approval)

- Make the wallet page show a friendlier message ("Server not configured — contact the site owner") instead of the raw "Invalid API key" text, so end users aren't confused by configuration problems.
