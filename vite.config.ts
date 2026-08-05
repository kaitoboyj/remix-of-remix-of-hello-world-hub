import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// Apply Node polyfills to both client and server for Netlify compatibility
// WebSocket polyfill is needed for thirdweb SDK in Node.js environments
const polyfills = {
  ...nodePolyfills({
    include: ["buffer", "crypto", "stream", "util", "events"],
    globals: { Buffer: true, global: true, process: true },
    protocolImports: true,
  }),
};

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: { preset: "netlify" },
  vite: {
    plugins: [polyfills],
    build: {
      rollupOptions: { treeshake: false },
    },
  },
});
