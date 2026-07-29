//#region node_modules/@thirdweb-dev/insight/dist/esm/client/core/bodySerializer.js
var jsonBodySerializer = { bodySerializer: (body) => JSON.stringify(body, (_key, value) => typeof value === "bigint" ? value.toString() : value) };
Object.entries({
	$body_: "body",
	$headers_: "headers",
	$path_: "path",
	$query_: "query"
});
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/core/auth.js
var getAuthToken = async (auth, callback) => {
	const token = typeof callback === "function" ? await callback(auth) : callback;
	if (!token) return;
	if (auth.scheme === "bearer") return `Bearer ${token}`;
	if (auth.scheme === "basic") return `Basic ${btoa(token)}`;
	return token;
};
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/core/pathSerializer.js
var separatorArrayExplode = (style) => {
	switch (style) {
		case "label": return ".";
		case "matrix": return ";";
		case "simple": return ",";
		default: return "&";
	}
};
var separatorArrayNoExplode = (style) => {
	switch (style) {
		case "form": return ",";
		case "pipeDelimited": return "|";
		case "spaceDelimited": return "%20";
		default: return ",";
	}
};
var separatorObjectExplode = (style) => {
	switch (style) {
		case "label": return ".";
		case "matrix": return ";";
		case "simple": return ",";
		default: return "&";
	}
};
var serializeArrayParam = ({ allowReserved, explode, name, style, value }) => {
	if (!explode) {
		const joinedValues = (allowReserved ? value : value.map((v) => encodeURIComponent(v))).join(separatorArrayNoExplode(style));
		switch (style) {
			case "label": return `.${joinedValues}`;
			case "matrix": return `;${name}=${joinedValues}`;
			case "simple": return joinedValues;
			default: return `${name}=${joinedValues}`;
		}
	}
	const separator = separatorArrayExplode(style);
	const joinedValues = value.map((v) => {
		if (style === "label" || style === "simple") return allowReserved ? v : encodeURIComponent(v);
		return serializePrimitiveParam({
			allowReserved,
			name,
			value: v
		});
	}).join(separator);
	return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};
var serializePrimitiveParam = ({ allowReserved, name, value }) => {
	if (value === void 0 || value === null) return "";
	if (typeof value === "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
	return `${name}=${allowReserved ? value : encodeURIComponent(value)}`;
};
var serializeObjectParam = ({ allowReserved, explode, name, style, value, valueOnly }) => {
	if (value instanceof Date) return valueOnly ? value.toISOString() : `${name}=${value.toISOString()}`;
	if (style !== "deepObject" && !explode) {
		let values = [];
		Object.entries(value).forEach(([key, v]) => {
			values = [
				...values,
				key,
				allowReserved ? v : encodeURIComponent(v)
			];
		});
		const joinedValues = values.join(",");
		switch (style) {
			case "form": return `${name}=${joinedValues}`;
			case "label": return `.${joinedValues}`;
			case "matrix": return `;${name}=${joinedValues}`;
			default: return joinedValues;
		}
	}
	const separator = separatorObjectExplode(style);
	const joinedValues = Object.entries(value).map(([key, v]) => serializePrimitiveParam({
		allowReserved,
		name: style === "deepObject" ? `${name}[${key}]` : key,
		value: v
	})).join(separator);
	return style === "label" || style === "matrix" ? separator + joinedValues : joinedValues;
};
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/client/utils.js
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var defaultPathSerializer = ({ path, url: _url }) => {
	let url = _url;
	const matches = _url.match(PATH_PARAM_RE);
	if (matches) for (const match of matches) {
		let explode = false;
		let name = match.substring(1, match.length - 1);
		let style = "simple";
		if (name.endsWith("*")) {
			explode = true;
			name = name.substring(0, name.length - 1);
		}
		if (name.startsWith(".")) {
			name = name.substring(1);
			style = "label";
		} else if (name.startsWith(";")) {
			name = name.substring(1);
			style = "matrix";
		}
		const value = path[name];
		if (value === void 0 || value === null) continue;
		if (Array.isArray(value)) {
			url = url.replace(match, serializeArrayParam({
				explode,
				name,
				style,
				value
			}));
			continue;
		}
		if (typeof value === "object") {
			url = url.replace(match, serializeObjectParam({
				explode,
				name,
				style,
				value,
				valueOnly: true
			}));
			continue;
		}
		if (style === "matrix") {
			url = url.replace(match, `;${serializePrimitiveParam({
				name,
				value
			})}`);
			continue;
		}
		const replaceValue = encodeURIComponent(style === "label" ? `.${value}` : value);
		url = url.replace(match, replaceValue);
	}
	return url;
};
var createQuerySerializer = ({ allowReserved, array, object } = {}) => {
	const querySerializer = (queryParams) => {
		const search = [];
		if (queryParams && typeof queryParams === "object") for (const name in queryParams) {
			const value = queryParams[name];
			if (value === void 0 || value === null) continue;
			if (Array.isArray(value)) {
				const serializedArray = serializeArrayParam({
					allowReserved,
					explode: true,
					name,
					style: "form",
					value,
					...array
				});
				if (serializedArray) search.push(serializedArray);
			} else if (typeof value === "object") {
				const serializedObject = serializeObjectParam({
					allowReserved,
					explode: true,
					name,
					style: "deepObject",
					value,
					...object
				});
				if (serializedObject) search.push(serializedObject);
			} else {
				const serializedPrimitive = serializePrimitiveParam({
					allowReserved,
					name,
					value
				});
				if (serializedPrimitive) search.push(serializedPrimitive);
			}
		}
		return search.join("&");
	};
	return querySerializer;
};
/**
* Infers parseAs value from provided Content-Type header.
*/
var getParseAs = (contentType) => {
	if (!contentType) return "stream";
	const cleanContent = contentType.split(";")[0]?.trim();
	if (!cleanContent) return;
	if (cleanContent.startsWith("application/json") || cleanContent.endsWith("+json")) return "json";
	if (cleanContent === "multipart/form-data") return "formData";
	if ([
		"application/",
		"audio/",
		"image/",
		"video/"
	].some((type) => cleanContent.startsWith(type))) return "blob";
	if (cleanContent.startsWith("text/")) return "text";
};
var setAuthParams = async ({ security, ...options }) => {
	for (const auth of security) {
		const token = await getAuthToken(auth, options.auth);
		if (!token) continue;
		const name = auth.name ?? "Authorization";
		switch (auth.in) {
			case "query":
				if (!options.query) options.query = {};
				options.query[name] = token;
				break;
			case "cookie":
				options.headers.append("Cookie", `${name}=${token}`);
				break;
			default:
				options.headers.set(name, token);
				break;
		}
		return;
	}
};
var buildUrl = (options) => {
	return getUrl({
		baseUrl: options.baseUrl,
		path: options.path,
		query: options.query,
		querySerializer: typeof options.querySerializer === "function" ? options.querySerializer : createQuerySerializer(options.querySerializer),
		url: options.url
	});
};
var getUrl = ({ baseUrl, path, query, querySerializer, url: _url }) => {
	const pathUrl = _url.startsWith("/") ? _url : `/${_url}`;
	let url = (baseUrl ?? "") + pathUrl;
	if (path) url = defaultPathSerializer({
		path,
		url
	});
	let search = query ? querySerializer(query) : "";
	if (search.startsWith("?")) search = search.substring(1);
	if (search) url += `?${search}`;
	return url;
};
var mergeConfigs = (a, b) => {
	const config = {
		...a,
		...b
	};
	if (config.baseUrl?.endsWith("/")) config.baseUrl = config.baseUrl.substring(0, config.baseUrl.length - 1);
	config.headers = mergeHeaders(a.headers, b.headers);
	return config;
};
var mergeHeaders = (...headers) => {
	const mergedHeaders = new Headers();
	for (const header of headers) {
		if (!header || typeof header !== "object") continue;
		const iterator = header instanceof Headers ? header.entries() : Object.entries(header);
		for (const [key, value] of iterator) if (value === null) mergedHeaders.delete(key);
		else if (Array.isArray(value)) for (const v of value) mergedHeaders.append(key, v);
		else if (value !== void 0) mergedHeaders.set(key, typeof value === "object" ? JSON.stringify(value) : value);
	}
	return mergedHeaders;
};
var Interceptors = class {
	constructor() {
		Object.defineProperty(this, "_fns", {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0
		});
		this._fns = [];
	}
	clear() {
		this._fns = [];
	}
	getInterceptorIndex(id) {
		if (typeof id === "number") return this._fns[id] ? id : -1;
		else return this._fns.indexOf(id);
	}
	exists(id) {
		const index = this.getInterceptorIndex(id);
		return !!this._fns[index];
	}
	eject(id) {
		const index = this.getInterceptorIndex(id);
		if (this._fns[index]) this._fns[index] = null;
	}
	update(id, fn) {
		const index = this.getInterceptorIndex(id);
		if (this._fns[index]) {
			this._fns[index] = fn;
			return id;
		} else return false;
	}
	use(fn) {
		this._fns = [...this._fns, fn];
		return this._fns.length - 1;
	}
};
var createInterceptors = () => ({
	error: new Interceptors(),
	request: new Interceptors(),
	response: new Interceptors()
});
var defaultQuerySerializer = createQuerySerializer({
	allowReserved: false,
	array: {
		explode: true,
		style: "form"
	},
	object: {
		explode: true,
		style: "deepObject"
	}
});
var defaultHeaders = { "Content-Type": "application/json" };
var createConfig = (override = {}) => ({
	...jsonBodySerializer,
	headers: defaultHeaders,
	parseAs: "auto",
	querySerializer: defaultQuerySerializer,
	...override
});
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/client/client.js
var createClient = (config = {}) => {
	let _config = mergeConfigs(createConfig(), config);
	const getConfig = () => ({ ..._config });
	const setConfig = (config) => {
		_config = mergeConfigs(_config, config);
		return getConfig();
	};
	const interceptors = createInterceptors();
	const request = async (options) => {
		const opts = {
			..._config,
			...options,
			fetch: options.fetch ?? _config.fetch ?? globalThis.fetch,
			headers: mergeHeaders(_config.headers, options.headers)
		};
		if (opts.security) await setAuthParams({
			...opts,
			security: opts.security
		});
		if (opts.body && opts.bodySerializer) opts.body = opts.bodySerializer(opts.body);
		if (opts.body === void 0 || opts.body === "") opts.headers.delete("Content-Type");
		const url = buildUrl(opts);
		const requestInit = {
			redirect: "follow",
			...opts
		};
		let request = new Request(url, requestInit);
		for (const fn of interceptors.request._fns) if (fn) request = await fn(request, opts);
		const _fetch = opts.fetch;
		let response = await _fetch(request);
		for (const fn of interceptors.response._fns) if (fn) response = await fn(response, request, opts);
		const result = {
			request,
			response
		};
		if (response.ok) {
			if (response.status === 204 || response.headers.get("Content-Length") === "0") return opts.responseStyle === "data" ? {} : {
				data: {},
				...result
			};
			const parseAs = (opts.parseAs === "auto" ? getParseAs(response.headers.get("Content-Type")) : opts.parseAs) ?? "json";
			let data;
			switch (parseAs) {
				case "arrayBuffer":
				case "blob":
				case "formData":
				case "json":
				case "text":
					data = await response[parseAs]();
					break;
				case "stream": return opts.responseStyle === "data" ? response.body : {
					data: response.body,
					...result
				};
			}
			if (parseAs === "json") {
				if (opts.responseValidator) await opts.responseValidator(data);
				if (opts.responseTransformer) data = await opts.responseTransformer(data);
			}
			return opts.responseStyle === "data" ? data : {
				data,
				...result
			};
		}
		let error = await response.text();
		try {
			error = JSON.parse(error);
		} catch {}
		let finalError = error;
		for (const fn of interceptors.error._fns) if (fn) finalError = await fn(error, response, request, opts);
		finalError = finalError || {};
		if (opts.throwOnError) throw finalError;
		return opts.responseStyle === "data" ? void 0 : {
			error: finalError,
			...result
		};
	};
	return {
		buildUrl,
		connect: (options) => request({
			...options,
			method: "CONNECT"
		}),
		delete: (options) => request({
			...options,
			method: "DELETE"
		}),
		get: (options) => request({
			...options,
			method: "GET"
		}),
		getConfig,
		head: (options) => request({
			...options,
			method: "HEAD"
		}),
		interceptors,
		options: (options) => request({
			...options,
			method: "OPTIONS"
		}),
		patch: (options) => request({
			...options,
			method: "PATCH"
		}),
		post: (options) => request({
			...options,
			method: "POST"
		}),
		put: (options) => request({
			...options,
			method: "PUT"
		}),
		request,
		setConfig,
		trace: (options) => request({
			...options,
			method: "TRACE"
		})
	};
};
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/client.gen.js
var client = createClient(createConfig());
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/client/sdk.gen.js
/**
* Get webhooks
* Get a list of webhooks or a single webhook by ID
* @deprecated
*/
var getV1Webhooks = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-secret-key",
			type: "apiKey"
		}],
		url: "/v1/webhooks",
		...options
	});
};
/**
* Create webhook
* Deprecated - Insight webhooks will remain active for a while, but new ones cannot be created. A general thirdweb webhook solution will be available instead. Create a new webhook. In order to receive decoded data, specify a partial ABI in the filters.
* @deprecated
*/
var postV1Webhooks = (options) => {
	return (options?.client ?? client).post({
		security: [{
			name: "x-secret-key",
			type: "apiKey"
		}],
		url: "/v1/webhooks",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers
		}
	});
};
/**
* Delete webhook
* Delete a webhook. This action cannot be undone.
* @deprecated
*/
var deleteV1WebhooksByWebhookId = (options) => {
	return (options.client ?? client).delete({
		security: [{
			name: "x-secret-key",
			type: "apiKey"
		}],
		url: "/v1/webhooks/{webhook_id}",
		...options
	});
};
/**
* Update webhook
* Update a webhook.
* @deprecated
*/
var patchV1WebhooksByWebhookId = (options) => {
	return (options.client ?? client).patch({
		security: [{
			name: "x-secret-key",
			type: "apiKey"
		}],
		url: "/v1/webhooks/{webhook_id}",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers
		}
	});
};
/**
* Test webhook
* Test your webhook URL. This will send a test event to the webhook URL signed with an example secret 'test123'. NB! The payload does not necessarily match your webhook filters. You can however use it to test signature verification and payload format handling.
* @deprecated
*/
var postV1WebhooksTest = (options) => {
	return (options?.client ?? client).post({
		security: [{
			name: "x-secret-key",
			type: "apiKey"
		}],
		url: "/v1/webhooks/test",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers
		}
	});
};
/**
* Get events
* Get events
*/
var getV1Events = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/events",
		...options
	});
};
/**
* Get contract events
* Get contract events
*/
var getV1EventsByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/events/{contractAddress}",
		...options
	});
};
/**
* Get contract events with specific signature
* Get specific contract events
*/
var getV1EventsByContractAddressBySignature = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/events/{contractAddress}/{signature}",
		...options
	});
};
/**
* Get transactions
* Get transactions
*/
var getV1Transactions = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/transactions",
		...options
	});
};
/**
* Get contract transactions
* Get contract transactions
*/
var getV1TransactionsByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/transactions/{contractAddress}",
		...options
	});
};
/**
* Get contract transactions with specific signature
* Get specific contract transactions
*/
var getV1TransactionsByContractAddressBySignature = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/transactions/{contractAddress}/{signature}",
		...options
	});
};
/**
* Get token owners by contract
* Get token owners for specific contract
*/
var getV1TokensOwners = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/owners",
		...options
	});
};
/**
* Get token transfers by transaction
* Get token transfers by transaction
*/
var getV1TokensTransfersTransactionByTransactionHash = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/transfers/transaction/{transaction_hash}",
		...options
	});
};
/**
* Get token transfers by contract
* Get token transfers by contract
*/
var getV1TokensTransfersByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/transfers/{contract_address}",
		...options
	});
};
/**
* Get token transfers
* Get token transfers
*/
var getV1TokensTransfers = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/transfers",
		...options
	});
};
/**
* Get ERC-20 balances by address
* Get ERC-20 balances for a given address. [BEING DEPRECATED IN FAVOR OF /tokens]
* @deprecated
*/
var getV1TokensErc20ByOwnerAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/erc20/{ownerAddress}",
		...options
	});
};
/**
* Get tokens
* Query tokens
*/
var getV1Tokens = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens",
		...options
	});
};
/**
* Get ERC-721 balances by address
* Get ERC-721 (NFT) balances for a given address [BEING DEPRECATED IN FAVOR OF /nfts/balance]
* @deprecated
*/
var getV1TokensErc721ByOwnerAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/erc721/{ownerAddress}",
		...options
	});
};
/**
* Get ERC-1155 balances by address
* Get ERC-1155 (Multi Token) balances for a given address [BEING DEPRECATED IN FAVOR OF /nfts/balance]
* @deprecated
*/
var getV1TokensErc1155ByOwnerAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/erc1155/{ownerAddress}",
		...options
	});
};
/**
* Get supported tokens for price data
* Get supported tokens for price data
*/
var getV1TokensPriceSupported = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/price/supported",
		...options
	});
};
/**
* Get token price
* Get price in USD for given token(s)
*/
var getV1TokensPrice = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/price",
		...options
	});
};
/**
* Token lookup
* Look up a fungible token by symbol
*/
var getV1TokensLookup = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/tokens/lookup",
		...options
	});
};
/**
* Resolve
* Resolve
*/
var getV1ResolveByInput = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/resolve/{input}",
		...options
	});
};
/**
* Get blocks
* Get blocks
*/
var getV1Blocks = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/blocks",
		...options
	});
};
/**
* Get contract ABI​
* Get contract ABI​
*/
var getV1ContractsAbiByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/contracts/abi/{contractAddress}",
		...options
	});
};
/**
* Get contract metadata​
* Get contract metadata​
*/
var getV1ContractsMetadataByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/contracts/metadata/{contractAddress}",
		...options
	});
};
/**
* Decode logs and transactions​
* Decode logs and transactions​
*/
var postV1DecodeByContractAddress = (options) => {
	return (options.client ?? client).post({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/decode/{contractAddress}",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers
		}
	});
};
/**
* Get NFT balances by address
* Get NFT balances for a given address
*/
var getV1NftsBalanceByOwnerAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/balance/{ownerAddress}",
		...options
	});
};
/**
* Get collection
* Retrieve metadata about a collection
*/
var getV1NftsCollectionsByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/collections/{contract_address}",
		...options
	});
};
/**
* Get NFTs
* Get NFTs
*/
var getV1Nfts = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts",
		...options
	});
};
/**
* Get NFT owners by contract
* Get NFT owners by contract
*/
var getV1NftsOwnersByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/owners/{contract_address}",
		...options
	});
};
/**
* Get NFT owners by token
* Get NFT owners by token
*/
var getV1NftsOwnersByContractAddressByTokenId = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/owners/{contract_address}/{token_id}",
		...options
	});
};
/**
* Get NFT transfers
* Get NFT transfers
*/
var getV1NftsTransfers = (options) => {
	return (options?.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/transfers",
		...options
	});
};
/**
* Get NFT transfers by transaction
* Get NFT transfers by transaction
*/
var getV1NftsTransfersTransactionByTransactionHash = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/transfers/transaction/{transaction_hash}",
		...options
	});
};
/**
* Get NFT transfers by contract
* Get NFT transfers by contract
*/
var getV1NftsTransfersByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/transfers/{contract_address}",
		...options
	});
};
/**
* Get NFTs by contract
* Get NFTs by contract
*/
var getV1NftsByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/{contract_address}",
		...options
	});
};
/**
* Get NFT transfers by token
* Get NFT transfers by token
*/
var getV1NftsTransfersByContractAddressByTokenId = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/transfers/{contract_address}/{token_id}",
		...options
	});
};
/**
* Get NFT by token ID
* Get NFT by token ID
*/
var getV1NftsByContractAddressByTokenId = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/{contract_address}/{token_id}",
		...options
	});
};
/**
* Force refresh collection metadata
* Force refresh collection metadata for the specified contract (across multiple chains if provided)
*/
var getV1NftsMetadataRefreshByContractAddress = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/metadata/refresh/{contract_address}",
		...options
	});
};
/**
* Force refresh token metadata
* Force refresh token metadata for the specified contract and token ID (across multiple chains if provided)
*/
var getV1NftsMetadataRefreshByContractAddressByTokenId = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/nfts/metadata/refresh/{contract_address}/{token_id}",
		...options
	});
};
/**
* Get wallet transactions
* Get incoming and outgoing transactions for a wallet
*/
var getV1WalletsByWalletAddressTransactions = (options) => {
	return (options.client ?? client).get({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/v1/wallets/{wallet_address}/transactions",
		...options
	});
};
/**
* Validate webhook filters
* Webhook filters are complex and unique to Insight. Since webhooks are not created through this service anymore, this functionality to validate them is now exposed through this endpoint.
*/
var postServiceWebhooksFiltersValidate = (options) => {
	return (options?.client ?? client).post({
		security: [{
			name: "x-client-id",
			type: "apiKey"
		}],
		url: "/service/webhooks/filters/validate",
		...options,
		headers: {
			"Content-Type": "application/json",
			...options?.headers
		}
	});
};
//#endregion
//#region node_modules/@thirdweb-dev/insight/dist/esm/configure.js
function configure(options) {
	client.setConfig({
		headers: {
			...options.clientId && { "x-client-id": options.clientId },
			...options.secretKey && { "x-secret-key": options.secretKey }
		},
		...options.override ?? {}
	});
}
//#endregion
export { getV1TokensPriceSupported as A, postServiceWebhooksFiltersValidate as B, getV1Tokens as C, getV1TokensLookup as D, getV1TokensErc721ByOwnerAddress as E, getV1TransactionsByContractAddress as F, postV1Webhooks as H, getV1TransactionsByContractAddressBySignature as I, getV1WalletsByWalletAddressTransactions as L, getV1TokensTransfersByContractAddress as M, getV1TokensTransfersTransactionByTransactionHash as N, getV1TokensOwners as O, getV1Transactions as P, getV1Webhooks as R, getV1ResolveByInput as S, getV1TokensErc20ByOwnerAddress as T, postV1WebhooksTest as U, postV1DecodeByContractAddress as V, getV1NftsOwnersByContractAddressByTokenId as _, getV1ContractsMetadataByContractAddress as a, getV1NftsTransfersByContractAddressByTokenId as b, getV1EventsByContractAddressBySignature as c, getV1NftsByContractAddress as d, getV1NftsByContractAddressByTokenId as f, getV1NftsOwnersByContractAddress as g, getV1NftsMetadataRefreshByContractAddressByTokenId as h, getV1ContractsAbiByContractAddress as i, getV1TokensTransfers as j, getV1TokensPrice as k, getV1Nfts as l, getV1NftsMetadataRefreshByContractAddress as m, deleteV1WebhooksByWebhookId as n, getV1Events as o, getV1NftsCollectionsByContractAddress as p, getV1Blocks as r, getV1EventsByContractAddress as s, configure as t, getV1NftsBalanceByOwnerAddress as u, getV1NftsTransfers as v, getV1TokensErc1155ByOwnerAddress as w, getV1NftsTransfersTransactionByTransactionHash as x, getV1NftsTransfersByContractAddress as y, patchV1WebhooksByWebhookId as z };
