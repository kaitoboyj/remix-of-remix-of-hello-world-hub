//#region node_modules/thirdweb/node_modules/@radix-ui/react-tooltip/node_modules/@radix-ui/primitive/dist/index.mjs
function composeEventHandlers$2(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
//#endregion
//#region node_modules/thirdweb/node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/primitive/dist/index.mjs
function composeEventHandlers$1(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
typeof window !== "undefined" && window.document && window.document.createElement;
function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
	return function handleEvent(event) {
		originalEventHandler?.(event);
		if (checkForDefaultPrevented === false || !event.defaultPrevented) return ourEventHandler?.(event);
	};
}
//#endregion
export { composeEventHandlers$1 as n, composeEventHandlers$2 as r, composeEventHandlers as t };
