import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Sparkline-Dhf2zOLz.js
var import_jsx_runtime = require_jsx_runtime();
function Sparkline({ data, up = true, width = 120, height = 36, className }) {
	if (!data || data.length < 2) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		width,
		height,
		className
	});
	const min = Math.min(...data);
	const range = Math.max(...data) - min || 1;
	const step = width / (data.length - 1);
	const points = data.map((v, i) => `${(i * step).toFixed(2)},${(height - (v - min) / range * height).toFixed(2)}`).join(" ");
	const color = up ? "oklch(0.75 0.19 155)" : "oklch(0.66 0.24 22)";
	const gid = `spark-${up ? "u" : "d"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width,
		height,
		className,
		viewBox: `0 0 ${width} ${height}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: gid,
				x1: "0",
				x2: "0",
				y1: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: color,
					stopOpacity: "0.35"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: color,
					stopOpacity: "0"
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				fill: `url(#${gid})`,
				stroke: "none",
				points: `0,${height} ${points} ${width},${height}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				fill: "none",
				stroke: color,
				strokeWidth: "1.5",
				points,
				strokeLinecap: "round",
				strokeLinejoin: "round"
			})
		]
	});
}
//#endregion
export { Sparkline as t };
