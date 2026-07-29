import { Buffer as PolyfillBuffer } from "buffer";
//#region node_modules/.nitro/vite/services/ssr/assets/buffer-polyfill-CJ0fLWNj.js
globalThis.Buffer = PolyfillBuffer;
if (typeof window !== "undefined") window.Buffer = PolyfillBuffer;
if (typeof self !== "undefined") self.Buffer = PolyfillBuffer;
//#endregion
export {};
