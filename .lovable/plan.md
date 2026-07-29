## Why Netlify is failing

The build log shows the client bundle finishes emitting chunks (last visible line: `dist/assets/hex-D5Ve3DK3.js`) and then `npm run build` exits 1. That means the crash happens in the very next phase — the SSR bundle / Nitro prerender step — with the actual error truncated out.

Given the stack (Vite 8 + Rolldown, TanStack Start + Nitro netlify preset, a huge dep graph via `thirdweb` + `ethers` + `bitcoinjs-lib`), there are three known root causes that match this exact symptom, and they compound. The plan fixes all three so the next Netlify deploy succeeds regardless of which one is biting today.

## Root causes to fix

1. **Node version mismatch.**  
   - `package.json` → `"engines": { "node": ">=20 <21" }`  
   - `.nvmrc` → `22`  
   - `netlify.toml` → `NODE_VERSION = "22"`  
   Netlify installs Node 22, then npm hits an engine mismatch or a native dep (e.g. `@bitcoinerlab/secp256k1`) misbehaves. Local dev "works" because you're probably on 20.

2. **Vite 8 / Rolldown SSR build crash on heavy re-export graphs.**  
   `thirdweb` (500+ wallet chunks visible in the log) is a known trigger for Rolldown dropping declarations or OOM'ing on the SSR pass — the crash lands right after the client emit phase, matching your log.

3. **Prerender needs env vars that aren't set on Netlify.**  
   `netlify.toml` declares `ADMIN_PASSWORD` and `SUPABASE_PROJECT_ID` under `build.environment` but doesn't assign them. Any route loader/head that reads them at prerender time throws, which Nitro reports as a generic exit 1 with the message truncated.

## Plan

### 1. Align Node to a single version (Node 20 LTS)

- `package.json` → keep `"engines": { "node": ">=20 <23" }` so both 20 and 22 are accepted.  
- `.nvmrc` → `20`.  
- `netlify.toml` → `NODE_VERSION = "20"`.  

Node 20 LTS is what `@lovable.dev/vite-tanstack-config` and the current thirdweb release are tested against; it also avoids Node 22 issues around native crypto addons.

### 2. Neutralize the Vite 8 / Rolldown SSR crash

In `vite.config.ts`, add:

```ts
vite: {
  plugins: [polyfills],
  build: {
    rollupOptions: { treeshake: false },
  },
},
```

This is the documented workaround for Rolldown's dropped-declaration / SSR-bundle crash on heavy re-export packages (thirdweb here). It costs a bit of bundle size but unblocks the build. If Netlify's log after the change shows an OOM instead, bump `NODE_OPTIONS` in `netlify.toml` from `--max-old-space-size=4096` to `--max-old-space-size=6144`.

### 3. Make prerender resilient to missing env vars

- Audit any code that reads `process.env.ADMIN_PASSWORD`, `process.env.SUPABASE_SERVICE_ROLE_KEY`, `process.env.THIRDWEB_CLIENT_ID`, `process.env.TELEGRAM_BOT_TOKEN` at module scope. Move each read **inside** the `.handler()` of the server function or the `/api/*` handler so absence at build time doesn't crash prerender. (Anything already inside a handler is fine.)  
- For any route `head()` / `loader()` that touches these, guard with a fallback (`process.env.X ?? ""`) so prerender emits a page instead of throwing.

### 4. Document the Netlify env vars the user must set

Update `NETLIFY_SETUP.md` / `DEPLOYMENT.md` to make explicit that these must be set in Netlify → Site settings → Environment variables *before* the deploy, and that `VITE_*` vars require a fresh build:

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
SUPABASE_URL
SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
ADMIN_PASSWORD
THIRDWEB_CLIENT_ID
TELEGRAM_BOT_TOKEN
```

### 5. Verify

- Run `npm run build` in the sandbox with Node 20 to confirm it exits 0 and produces `dist/` + `.netlify/functions-internal/server/`.  
- If it still fails, capture the full stderr (which Netlify truncated) and iterate on step 2 (treeshake / memory) or step 3 (env guard) with the real message.

## Files touched

- `package.json` (engines)
- `.nvmrc`
- `netlify.toml`
- `vite.config.ts`
- Any server-fn / API file that reads secrets at module scope (guarded moves only, no behavior change)
- `NETLIFY_SETUP.md` (docs)

No route logic, UI, or DB schema changes.
