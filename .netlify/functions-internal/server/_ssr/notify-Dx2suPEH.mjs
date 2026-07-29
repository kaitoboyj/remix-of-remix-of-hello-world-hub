import { i as loadSession } from "./wallet-auth-CXTatSjk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notify-Dx2suPEH.js
function notify(evt) {
	if (typeof window === "undefined") return;
	try {
		const session = loadSession();
		const payload = {
			...evt,
			path: evt.path ?? window.location.pathname,
			username: evt.username ?? session?.username,
			address: evt.address ?? session?.address
		};
		fetch("/api/public/notify", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
			keepalive: true
		}).catch(() => {});
	} catch {}
}
//#endregion
export { notify as t };
