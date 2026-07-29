import { s as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useYieldDisplay-CiBDnOTQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var MIN_DELAY_MS = 4e3;
var MAX_DELAY_MS = 10 * 6e4;
var MAX_MOVE_PCT = 7;
function randomMovePct() {
	return (Math.random() < .5 ? -1 : 1) * Math.random() * MAX_MOVE_PCT;
}
function randomDelay() {
	return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}
function useYieldDisplay(baseValue) {
	const [pct, setPct] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setPct(0);
		if (!Number.isFinite(baseValue) || baseValue <= 0) return;
		let timer;
		const tick = () => {
			setPct(randomMovePct());
			timer = window.setTimeout(tick, randomDelay());
		};
		timer = window.setTimeout(tick, randomDelay());
		return () => {
			if (timer) window.clearTimeout(timer);
		};
	}, [baseValue]);
	return {
		value: Math.max(0, baseValue * (1 + pct / 100)),
		pct
	};
}
//#endregion
export { useYieldDisplay as t };
