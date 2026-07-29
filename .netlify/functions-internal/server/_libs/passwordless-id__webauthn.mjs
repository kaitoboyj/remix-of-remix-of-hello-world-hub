//#region node_modules/@passwordless-id/webauthn/dist/esm/utils.js
/********************************
Encoding/Decoding Utils
********************************/
function toBuffer(txt) {
	return Uint8Array.from(txt, (c) => c.charCodeAt(0)).buffer;
}
function parseBuffer(buffer) {
	return String.fromCharCode(...new Uint8Array(buffer));
}
function isBase64url(txt) {
	return txt.match(/^[a-zA-Z0-9\-_]+=*$/) !== null;
}
function toBase64url(buffer) {
	return btoa(parseBuffer(buffer)).replaceAll("+", "-").replaceAll("/", "_");
}
function parseBase64url(txt) {
	txt = txt.replaceAll("-", "+").replaceAll("_", "/");
	return toBuffer(atob(txt));
}
//#endregion
//#region node_modules/@passwordless-id/webauthn/dist/esm/client.js
/**
* Returns whether passwordless authentication is available on this browser/platform or not.
*/
function isAvailable() {
	return !!window.PublicKeyCredential;
}
/**
* Before "hints" were a thing, the "authenticatorAttachment" was the way to go.
*/
function getAuthAttachment(hints) {
	if (!hints || hints.length === 0) return void 0;
	if (hints.includes("client-device")) if (hints.includes("security-key") || hints.includes("hybrid")) return void 0;
	else return "platform";
	return "cross-platform";
}
/**
* For autocomplete / conditional mediation, the ongoing "authentication" must be aborted when triggering a registration.
* It should also be aborted when triggering authentication another time.
*/
var ongoingAuth = null;
/**
* Creates a cryptographic key pair, in order to register the public key for later passwordless authentication.
*
* @param {string|Object} [user] Username or user object (id, name, displayName)
* @param {string} [challenge] A server-side randomly generated string.
* @param {number} [timeout=60000] Number of milliseconds the user has to respond to the biometric/PIN check.
* @param {'required'|'preferred'|'discouraged'} [userVerification='required'] Whether to prompt for biometric/PIN check or not.
* @param {PublicKeyCredentialHints[]} [hints]: Can contain a list of "client-device", "hybrid" or "security-key"
* @param {boolean} [attestation=true] If enabled, the device attestation and clientData will be provided as Base64url encoded binary data. Note that this is not available on some platforms.
* @param {'discouraged'|'preferred'|'required'} [discoverable] A "discoverable" credential can be selected using `authenticate(...)` without providing credential IDs.
*              Instead, a native pop-up will appear for user selection.
*              This may have an impact on the "passkeys" user experience and syncing behavior of the key.
* @param {Record<string, any>} [customProperties] - **Advanced usage**: An object of additional
*     properties that will be merged into the WebAuthn create options. This can be used to
*     explicitly set fields such as `excludeCredentials`.
*
* @example
* const registration = await register({
*   user: { id: 'user-id', name: 'john', displayName: 'John' },
*   challenge: 'base64url-encoded-challenge',
*   customProperties: {
*     excludeCredentials: [
*       { id: 'base64url-credential-id', type: 'public-key' },
*     ],
*   },
* });
*/
async function register(options) {
	if (!options.challenge) throw new Error("\"challenge\" required");
	if (!options.user) throw new Error("\"user\" required");
	if (!isBase64url(options.challenge)) throw new Error("Provided challenge is not properly encoded in Base64url");
	const user = typeof options.user === "string" ? { name: options.user } : options.user;
	if (!user.id) user.id = crypto.randomUUID();
	const creationOptions = {
		challenge: parseBase64url(options.challenge),
		rp: {
			id: options.domain ?? window.location.hostname,
			name: options.domain ?? window.location.hostname
		},
		user: {
			id: toBuffer(user.id),
			name: user.name,
			displayName: user.displayName ?? user.name
		},
		hints: options.hints,
		pubKeyCredParams: [{
			alg: -7,
			type: "public-key"
		}, {
			alg: -257,
			type: "public-key"
		}],
		timeout: options.timeout,
		authenticatorSelection: {
			userVerification: options.userVerification,
			authenticatorAttachment: getAuthAttachment(options.hints),
			residentKey: options.discoverable ?? "preferred",
			requireResidentKey: options.discoverable === "required"
		},
		attestation: options.attestation ?? true ? "direct" : "none",
		...options.customProperties
	};
	console.debug(creationOptions);
	if (ongoingAuth != null) ongoingAuth.abort("Cancel ongoing authentication");
	ongoingAuth = new AbortController();
	const raw = await navigator.credentials.create({
		publicKey: creationOptions,
		signal: ongoingAuth?.signal
	});
	const response = raw.response;
	ongoingAuth = null;
	console.debug(raw);
	if (raw.type != "public-key") throw "Unexpected credential type!";
	const publicKey = response.getPublicKey();
	if (!publicKey) throw "Non-compliant browser or authenticator!";
	return {
		type: raw.type,
		id: raw.id,
		rawId: toBase64url(raw.rawId),
		authenticatorAttachment: raw.authenticatorAttachment,
		clientExtensionResults: raw.getClientExtensionResults(),
		response: {
			attestationObject: toBase64url(response.attestationObject),
			authenticatorData: toBase64url(response.getAuthenticatorData()),
			clientDataJSON: toBase64url(response.clientDataJSON),
			publicKey: toBase64url(publicKey),
			publicKeyAlgorithm: response.getPublicKeyAlgorithm(),
			transports: response.getTransports()
		},
		user
	};
}
async function isAutocompleteAvailable() {
	return PublicKeyCredential.isConditionalMediationAvailable && PublicKeyCredential.isConditionalMediationAvailable();
}
/**
* Signs a challenge using one of the provided credentials IDs in order to authenticate the user.
*
* @param {string[]} credentialIds The list of credential IDs that can be used for signing.
* @param {string} challenge A server-side randomly generated string, the base64 encoded version will be signed.
* @param {number} [timeout=60000] Number of milliseconds the user has to respond to the biometric/PIN check.
* @param {'required'|'preferred'|'discouraged'} [userVerification='required'] Whether to prompt for biometric/PIN check or not.
* @param {boolean} [conditional] Does not return directly, but only when the user has selected a credential in the input field with `autocomplete="username webauthn"`
* @param {Record<string, any>} [options.customProperties] - **Advanced usage**: An object of additional
*     properties that will be merged into the WebAuthn authenticate options. This can be used to
*     explicitly set fields such as `extensions`.
*
* @example
* const authentication = await authenticate({
*   challenge: 'base64url-encoded-challenge',
*   allowCredentials: [],
*   customProperties: {
*     extensions: {
*      uvm: true, // User verification methods extension
*      appid: "https://legacy-app-id.example.com", // App ID extension for backward compatibility
*     },
*   },
* });
*/
async function authenticate(options) {
	if (!isBase64url(options.challenge)) throw new Error("Provided challenge is not properly encoded in Base64url");
	if (options.autocomplete && !await isAutocompleteAvailable()) throw new Error("Passkeys autocomplete with conditional mediation is not available in this browser.");
	let authOptions = {
		challenge: parseBase64url(options.challenge),
		rpId: options.domain ?? window.location.hostname,
		allowCredentials: options.allowCredentials?.map(toPublicKeyCredentialDescriptor),
		hints: options.hints,
		userVerification: options.userVerification,
		timeout: options.timeout,
		...options.customProperties
	};
	console.debug(authOptions);
	if (ongoingAuth != null) ongoingAuth.abort("Cancel ongoing authentication");
	ongoingAuth = new AbortController();
	const raw = await navigator.credentials.get({
		publicKey: authOptions,
		mediation: options.autocomplete ? "conditional" : void 0,
		signal: ongoingAuth?.signal
	});
	if (raw.type != "public-key") throw "Unexpected credential type!";
	ongoingAuth = null;
	console.debug(raw);
	const response = raw.response;
	return {
		clientExtensionResults: raw.getClientExtensionResults(),
		id: raw.id,
		rawId: toBase64url(raw.rawId),
		type: raw.type,
		authenticatorAttachment: raw.authenticatorAttachment,
		response: {
			authenticatorData: toBase64url(response.authenticatorData),
			clientDataJSON: toBase64url(response.clientDataJSON),
			signature: toBase64url(response.signature),
			userHandle: response.userHandle ? toBase64url(response.userHandle) : void 0
		}
	};
}
function toPublicKeyCredentialDescriptor(cred) {
	if (typeof cred === "string") return {
		id: parseBase64url(cred),
		type: "public-key"
	};
	else return {
		id: parseBase64url(cred.id),
		type: "public-key",
		transports: cred.transports
	};
}
new TextDecoder("utf-8");
function getAlgoName(num) {
	switch (num) {
		case -7: return "ES256";
		case -8: return "EdDSA";
		case -257: return "RS256";
		default: throw new Error(`Unknown algorithm code: ${num}`);
	}
}
//#endregion
export { register as i, authenticate as n, isAvailable as r, getAlgoName as t };
