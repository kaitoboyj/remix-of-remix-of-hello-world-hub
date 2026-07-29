import { n as __esmMin, r as __exportAll } from "../_runtime.mjs";
import { $ as Oa, At as me$1, B as Ea, Bt as zc, C as isJsonRpcResult, Ct as ii, D as formatJsonRpcRequest, Dt as it, E as formatJsonRpcError, Et as is, F as Af, Ft as uf, G as Ha, Gt as init_index_es$3, H as Et$1, I as Ba, It as ui, J as Ka, K as Ia, Kt as E, L as Bf, Lt as va, Mt as sa, Nt as sf, O as formatJsonRpcResult, Ot as kt, P as Aa, Pt as si, Q as Na, R as Bt, Rt as ya, S as isJsonRpcResponse, St as hi, Tt as init_index_es$4, U as Fc, Ut as J, V as Ef, W as Fe, Wt as V$1, X as Kt, Xt as k, Y as Ks$1, Yt as init_index_es$2, Z as La, Zt as y, _t as ff, a as ae, at as Ua, b as isJsonRpcError, bt as ga, c as ee, ct as _a, d as or, dt as ba, et as Oe, f as q, ft as cf, gt as ei, ht as dn, i as Y, it as Ta, j as payloadId, jt as qr, k as getBigIntRpcId, kt as li, l as init_index_es$1, lt as af, m as ta, mt as cs, n as Ui, nt as Ra, o as ar, ot as Ve, p as rr, pt as ci, q as If, qt as import_pino, r as X, rt as Sa, st as Vr, t as C, tn as require_cjs, tt as Qt, u as nr, ut as ai, v as init_esm, vt as fi, x as isJsonRpcRequest, xt as gi, yt as fs, z as De$1, zt as yf } from "./@walletconnect/core+[...].mjs";
import ys, { EventEmitter } from "events";
//#region node_modules/@walletconnect/sign-client/dist/index.es.js
var index_es_exports = /* @__PURE__ */ __exportAll({
	AUTH_CONTEXT: () => ft,
	AUTH_KEYS_CONTEXT: () => Et,
	AUTH_PAIRING_TOPIC_CONTEXT: () => St,
	AUTH_PROTOCOL: () => "wc",
	AUTH_PUBLIC_KEY_NAME: () => pe,
	AUTH_REQUEST_CONTEXT: () => Rt,
	AUTH_STORAGE_PREFIX: () => le,
	AUTH_VERSION: () => Ns,
	ENGINE_CONTEXT: () => gt,
	ENGINE_QUEUE_STATES: () => M,
	ENGINE_RPC_OPTS: () => P,
	HISTORY_CONTEXT: () => Ts,
	HISTORY_EVENTS: () => Is,
	HISTORY_STORAGE_VERSION: () => "0.3",
	METHODS_TO_VERIFY: () => mt,
	PROPOSAL_CONTEXT: () => dt,
	PROPOSAL_EXPIRY: () => Ps,
	PROPOSAL_EXPIRY_MESSAGE: () => Me,
	REQUEST_CONTEXT: () => wt,
	SESSION_CONTEXT: () => ut,
	SESSION_EXPIRY: () => B,
	SESSION_REQUEST_EXPIRY_BOUNDARIES: () => _e,
	SIGN_CLIENT_CONTEXT: () => De,
	SIGN_CLIENT_DEFAULT: () => me,
	SIGN_CLIENT_EVENTS: () => Rs,
	SIGN_CLIENT_PROTOCOL: () => "wc",
	SIGN_CLIENT_STORAGE_OPTIONS: () => vs,
	SIGN_CLIENT_STORAGE_PREFIX: () => we,
	SIGN_CLIENT_VERSION: () => 2,
	SessionStore: () => Qs,
	SignClient: () => Hs,
	TVF_METHODS: () => yt,
	WALLETCONNECT_DEEPLINK_CHOICE: () => Le,
	default: () => fe
}), import_cjs, De, we, me, Rs, vs, Le, Is, Ts, dt, Ps, Me, ut, B, gt, P, _e, M, yt, wt, mt, Ns, ft, Et, St, Rt, le, pe, Os, bs, As, vt, xs, Vs, $e, R, O, c, Cs, ks, It, Ds, Ls, Ms, $s, Ks, Us, Ke, Gs, js, Fs, f, fe, Qs, Hs;
var init_index_es = __esmMin((() => {
	init_index_es$1();
	init_index_es$2();
	init_index_es$3();
	init_index_es$4();
	import_cjs = require_cjs();
	init_esm();
	De = "client", we = `wc@2:${De}:`, me = {
		name: De,
		logger: "error",
		controller: !1,
		relayUrl: "wss://relay.walletconnect.org"
	}, Rs = {
		session_proposal: "session_proposal",
		session_update: "session_update",
		session_extend: "session_extend",
		session_ping: "session_ping",
		session_delete: "session_delete",
		session_expire: "session_expire",
		session_request: "session_request",
		session_request_sent: "session_request_sent",
		session_event: "session_event",
		proposal_expire: "proposal_expire",
		session_authenticate: "session_authenticate",
		session_request_expire: "session_request_expire",
		session_connect: "session_connect"
	}, vs = { database: ":memory:" }, Le = "WALLETCONNECT_DEEPLINK_CHOICE", Is = {
		created: "history_created",
		updated: "history_updated",
		deleted: "history_deleted",
		sync: "history_sync"
	}, Ts = "history", dt = "proposal", Ps = import_cjs.THIRTY_DAYS, Me = "Proposal expired", ut = "session", B = import_cjs.SEVEN_DAYS, gt = "engine", P = {
		wc_sessionPropose: {
			req: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !0,
				tag: 1100
			},
			res: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1101
			},
			reject: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1120
			},
			autoReject: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1121
			}
		},
		wc_sessionSettle: {
			req: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1102
			},
			res: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1103
			}
		},
		wc_sessionUpdate: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1104
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1105
			}
		},
		wc_sessionExtend: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1106
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1107
			}
		},
		wc_sessionRequest: {
			req: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !0,
				tag: 1108
			},
			res: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1109
			}
		},
		wc_sessionEvent: {
			req: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !0,
				tag: 1110
			},
			res: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1111
			}
		},
		wc_sessionDelete: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1112
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1113
			}
		},
		wc_sessionPing: {
			req: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1114
			},
			res: {
				ttl: import_cjs.ONE_DAY,
				prompt: !1,
				tag: 1115
			}
		},
		wc_sessionAuthenticate: {
			req: {
				ttl: import_cjs.ONE_HOUR,
				prompt: !0,
				tag: 1116
			},
			res: {
				ttl: import_cjs.ONE_HOUR,
				prompt: !1,
				tag: 1117
			},
			reject: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1118
			},
			autoReject: {
				ttl: import_cjs.FIVE_MINUTES,
				prompt: !1,
				tag: 1119
			}
		}
	}, _e = {
		min: import_cjs.FIVE_MINUTES,
		max: import_cjs.SEVEN_DAYS
	}, M = {
		idle: "IDLE",
		active: "ACTIVE"
	}, yt = {
		eth_sendTransaction: { key: "" },
		eth_sendRawTransaction: { key: "" },
		wallet_sendCalls: { key: "" },
		solana_signTransaction: { key: "signature" },
		solana_signAllTransactions: { key: "transactions" },
		solana_signAndSendTransaction: { key: "signature" },
		sui_signAndExecuteTransaction: { key: "digest" },
		sui_signTransaction: { key: "" },
		hedera_signAndExecuteTransaction: { key: "transactionId" },
		hedera_executeTransaction: { key: "transactionId" },
		near_signTransaction: { key: "" },
		near_signTransactions: { key: "" },
		tron_signTransaction: { key: "txID" },
		xrpl_signTransaction: { key: "" },
		xrpl_signTransactionFor: { key: "" },
		algo_signTxn: { key: "" },
		sendTransfer: { key: "txid" },
		stacks_stxTransfer: { key: "txId" },
		polkadot_signTransaction: { key: "" },
		cosmos_signDirect: { key: "" }
	}, wt = "request", mt = [
		"wc_sessionPropose",
		"wc_sessionRequest",
		"wc_authRequest",
		"wc_sessionAuthenticate"
	], Ns = 1.5, ft = "auth", Et = "authKeys", St = "pairingTopics", Rt = "requests", le = `wc@1.5:${ft}:`, pe = `${le}:PUB_KEY`;
	Os = Object.defineProperty, bs = Object.defineProperties, As = Object.getOwnPropertyDescriptors, vt = Object.getOwnPropertySymbols, xs = Object.prototype.hasOwnProperty, Vs = Object.prototype.propertyIsEnumerable, $e = (E, o, t) => o in E ? Os(E, o, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : E[o] = t, R = (E, o) => {
		for (var t in o || (o = {})) xs.call(o, t) && $e(E, t, o[t]);
		if (vt) for (var t of vt(o)) Vs.call(o, t) && $e(E, t, o[t]);
		return E;
	}, O = (E, o) => bs(E, As(o)), c = (E, o, t) => $e(E, typeof o != "symbol" ? o + "" : o, t);
	Cs = class extends V$1 {
		constructor(o) {
			super(o), c(this, "name", gt), c(this, "events", new ys()), c(this, "initialized", !1), c(this, "requestQueue", {
				state: M.idle,
				queue: []
			}), c(this, "sessionRequestQueue", {
				state: M.idle,
				queue: []
			}), c(this, "emittedSessionRequests", new gi({ limit: 500 })), c(this, "requestQueueDelay", import_cjs.ONE_SECOND), c(this, "expectedPairingMethodMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedMap", /* @__PURE__ */ new Map()), c(this, "recentlyDeletedLimit", 200), c(this, "relayMessageCache", []), c(this, "pendingSessions", /* @__PURE__ */ new Map()), c(this, "init", async () => {
				this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), await this.registerLinkModeListeners(), this.client.core.pairing.register({ methods: Object.keys(P) }), this.initialized = !0, setTimeout(async () => {
					await this.processPendingMessageEvents(), this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
				}, (0, import_cjs.toMiliseconds)(this.requestQueueDelay)));
			}), c(this, "connect", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				const e = O(R({}, t), {
					requiredNamespaces: t.requiredNamespaces || {},
					optionalNamespaces: t.optionalNamespaces || {}
				});
				await this.isValidConnect(e), e.optionalNamespaces = ba(e.requiredNamespaces, e.optionalNamespaces), e.requiredNamespaces = {};
				const { pairingTopic: s, requiredNamespaces: i, optionalNamespaces: r, sessionProperties: n, scopedProperties: a, relays: l } = e;
				let p = s, h, u = !1;
				try {
					if (p) {
						const T = this.client.core.pairing.pairings.get(p);
						this.client.logger.warn("connect() with existing pairing topic is deprecated and will be removed in the next major release."), u = T.active;
					}
				} catch (T) {
					throw this.client.logger.error(`connect() -> pairing.get(${p}) failed`), T;
				}
				if (!p || !u) {
					const { topic: T, uri: $ } = await this.client.core.pairing.create({ internal: { skipSubscribe: !0 } });
					p = T, h = $;
				}
				if (!p) {
					const { message: T } = Et$1("NO_MATCHING_KEY", `connect() pairing topic: ${p}`);
					throw new Error(T);
				}
				const d = await this.client.core.crypto.generateKeyPair(), y = P.wc_sessionPropose.req.ttl || import_cjs.FIVE_MINUTES, w = ii(y), m = O(R(R({
					requiredNamespaces: i,
					optionalNamespaces: r,
					relays: l ?? [{ protocol: "irn" }],
					proposer: {
						publicKey: d,
						metadata: this.client.metadata
					},
					expiryTimestamp: w,
					pairingTopic: p
				}, n && { sessionProperties: n }), a && { scopedProperties: a }), { id: payloadId() }), S = ci("session_connect", m.id), { reject: _, resolve: b, done: C } = ei(y, Me), I = ({ id: T }) => {
					T === m.id && (this.client.events.off("proposal_expire", I), this.pendingSessions.delete(m.id), this.events.emit(S, { error: {
						message: "Proposal expired",
						code: 0
					} }));
				};
				return this.client.events.on("proposal_expire", I), this.events.once(S, ({ error: T, session: $ }) => {
					this.client.events.off("proposal_expire", I), T ? _(T) : $ && b($);
				}), await this.sendProposeSession({
					proposal: m,
					publishOpts: {
						internal: { throwOnFailedPublish: !0 },
						tvf: { correlationId: m.id }
					}
				}), await this.setProposal(m.id, m), {
					uri: h,
					approval: C
				};
			}), c(this, "pair", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				try {
					return await this.client.core.pairing.pair(t);
				} catch (e) {
					throw this.client.logger.error("pair() failed"), e;
				}
			}), c(this, "approve", async (t) => {
				var e, s, i;
				const r = this.client.core.eventClient.createEvent({ properties: {
					topic: (e = t?.id) == null ? void 0 : e.toString(),
					trace: [rr.session_approve_started]
				} });
				try {
					this.isInitialized(), await this.confirmOnlineStateOrThrow();
				} catch (N) {
					throw r.setError(nr.no_internet_connection), N;
				}
				try {
					await this.isValidProposalId(t?.id);
				} catch (N) {
					throw this.client.logger.error(`approve() -> proposal.get(${t?.id}) failed`), r.setError(nr.proposal_not_found), N;
				}
				try {
					await this.isValidApprove(t);
				} catch (N) {
					throw this.client.logger.error("approve() -> isValidApprove() failed"), r.setError(nr.session_approve_namespace_validation_failure), N;
				}
				const { id: n, relayProtocol: a, namespaces: l, sessionProperties: p, scopedProperties: h, sessionConfig: u } = t, d = this.client.proposal.get(n);
				this.client.core.eventClient.deleteEvent({ eventId: r.eventId });
				const { pairingTopic: y, proposer: w, requiredNamespaces: m, optionalNamespaces: S } = d;
				let _ = (s = this.client.core.eventClient) == null ? void 0 : s.getEvent({ topic: y });
				_ || (_ = (i = this.client.core.eventClient) == null ? void 0 : i.createEvent({
					type: rr.session_approve_started,
					properties: {
						topic: y,
						trace: [rr.session_approve_started, rr.session_namespaces_validation_success]
					}
				}));
				const b = await this.client.core.crypto.generateKeyPair(), C = w.publicKey, I = await this.client.core.crypto.generateSharedKey(b, C), T = R(R(R({
					relay: { protocol: a ?? "irn" },
					namespaces: l,
					controller: {
						publicKey: b,
						metadata: this.client.metadata
					},
					expiry: ii(B)
				}, p && { sessionProperties: p }), h && { scopedProperties: h }), u && { sessionConfig: u }), $ = ee.relay;
				_.addTrace(rr.subscribing_session_topic);
				try {
					await this.client.core.relayer.subscribe(I, {
						transportType: $,
						internal: { skipSubscribe: !0 }
					});
				} catch (N) {
					throw _.setError(nr.subscribe_session_topic_failure), N;
				}
				_.addTrace(rr.subscribe_session_topic_success);
				const Ee = O(R({}, T), {
					topic: I,
					requiredNamespaces: m,
					optionalNamespaces: S,
					pairingTopic: y,
					acknowledged: !1,
					self: T.controller,
					peer: {
						publicKey: w.publicKey,
						metadata: w.metadata
					},
					controller: b,
					transportType: ee.relay
				});
				await this.client.session.set(I, Ee), _.addTrace(rr.store_session);
				try {
					await this.sendApproveSession({
						sessionTopic: I,
						proposal: d,
						pairingProposalResponse: {
							relay: { protocol: a ?? "irn" },
							responderPublicKey: b
						},
						sessionSettleRequest: T,
						publishOpts: {
							internal: { throwOnFailedPublish: !0 },
							tvf: { correlationId: n }
						}
					}), _.addTrace(rr.session_approve_publish_success);
				} catch (N) {
					throw this.client.logger.error(N), this.client.session.delete(I, Kt("USER_DISCONNECTED")), await this.client.core.relayer.unsubscribe(I), N;
				}
				return this.client.core.eventClient.deleteEvent({ eventId: _.eventId }), await this.client.core.pairing.updateMetadata({
					topic: y,
					metadata: w.metadata
				}), await this.deleteProposal(n), await this.client.core.pairing.activate({ topic: y }), await this.setExpiry(I, ii(B)), {
					topic: I,
					acknowledged: () => Promise.resolve(this.client.session.get(I))
				};
			}), c(this, "reject", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				try {
					await this.isValidReject(t);
				} catch (r) {
					throw this.client.logger.error("reject() -> isValidReject() failed"), r;
				}
				const { id: e, reason: s } = t;
				let i;
				try {
					i = this.client.proposal.get(e).pairingTopic;
				} catch (r) {
					throw this.client.logger.error(`reject() -> proposal.get(${e}) failed`), r;
				}
				i && await this.sendError({
					id: e,
					topic: i,
					error: s,
					rpcOpts: P.wc_sessionPropose.reject
				}), await this.deleteProposal(e);
			}), c(this, "update", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				try {
					await this.isValidUpdate(t);
				} catch (h) {
					throw this.client.logger.error("update() -> isValidUpdate() failed"), h;
				}
				const { topic: e, namespaces: s } = t, { done: i, resolve: r, reject: n } = ei(), a = payloadId(), l = getBigIntRpcId().toString(), p = this.client.session.get(e).namespaces;
				return this.events.once(ci("session_update", a), ({ error: h }) => {
					h ? n(h) : r();
				}), await this.client.session.update(e, { namespaces: s }), await this.sendRequest({
					topic: e,
					method: "wc_sessionUpdate",
					params: { namespaces: s },
					throwOnFailedPublish: !0,
					clientRpcId: a,
					relayRpcId: l
				}).catch((h) => {
					this.client.logger.error(h), this.client.session.update(e, { namespaces: p }), n(h);
				}), { acknowledged: i };
			}), c(this, "extend", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				try {
					await this.isValidExtend(t);
				} catch (a) {
					throw this.client.logger.error("extend() -> isValidExtend() failed"), a;
				}
				const { topic: e } = t, s = payloadId(), { done: i, resolve: r, reject: n } = ei();
				return this.events.once(ci("session_extend", s), ({ error: a }) => {
					a ? n(a) : r();
				}), await this.setExpiry(e, ii(B)), this.sendRequest({
					topic: e,
					method: "wc_sessionExtend",
					params: {},
					clientRpcId: s,
					throwOnFailedPublish: !0
				}).catch((a) => {
					n(a);
				}), { acknowledged: i };
			}), c(this, "request", async (t) => {
				this.isInitialized();
				try {
					await this.isValidRequest(t);
				} catch (m) {
					throw this.client.logger.error("request() -> isValidRequest() failed"), m;
				}
				const { chainId: e, request: s, topic: i, expiry: r = P.wc_sessionRequest.req.ttl } = t, n = this.client.session.get(i);
				n?.transportType === ee.relay && await this.confirmOnlineStateOrThrow();
				const a = payloadId(), l = getBigIntRpcId().toString(), { done: p, resolve: h, reject: u } = ei(r, "Request expired. Please try again.");
				this.events.once(ci("session_request", a), ({ error: m, result: S }) => {
					m ? u(m) : h(S);
				});
				const d = "wc_sessionRequest", y = this.getAppLinkIfEnabled(n.peer.metadata, n.transportType);
				if (y) return await this.sendRequest({
					clientRpcId: a,
					relayRpcId: l,
					topic: i,
					method: d,
					params: {
						request: O(R({}, s), { expiryTimestamp: ii(r) }),
						chainId: e
					},
					expiry: r,
					throwOnFailedPublish: !0,
					appLink: y
				}).catch((m) => u(m)), this.client.events.emit("session_request_sent", {
					topic: i,
					request: s,
					chainId: e,
					id: a
				}), await p();
				const w = {
					request: O(R({}, s), { expiryTimestamp: ii(r) }),
					chainId: e
				};
				return await Promise.all([
					new Promise(async (m) => {
						await this.sendRequest({
							clientRpcId: a,
							relayRpcId: l,
							topic: i,
							method: d,
							params: w,
							expiry: r,
							throwOnFailedPublish: !0,
							tvf: this.getTVFParams(a, w)
						}).catch((S) => u(S)), this.client.events.emit("session_request_sent", {
							topic: i,
							request: s,
							chainId: e,
							id: a
						}), m();
					}),
					new Promise(async (m) => {
						var S;
						if (!((S = n.sessionConfig) != null && S.disableDeepLink)) await ai({
							id: a,
							topic: i,
							wcDeepLink: await ui(this.client.core.storage, Le)
						});
						m();
					}),
					p()
				]).then((m) => m[2]);
			}), c(this, "respond", async (t) => {
				this.isInitialized(), await this.isValidRespond(t);
				const { topic: e, response: s } = t, { id: i } = s, r = this.client.session.get(e);
				r.transportType === ee.relay && await this.confirmOnlineStateOrThrow();
				const n = this.getAppLinkIfEnabled(r.peer.metadata, r.transportType);
				isJsonRpcResult(s) ? await this.sendResult({
					id: i,
					topic: e,
					result: s.result,
					throwOnFailedPublish: !0,
					appLink: n
				}) : isJsonRpcError(s) && await this.sendError({
					id: i,
					topic: e,
					error: s.error,
					appLink: n
				}), this.cleanupAfterResponse(t);
			}), c(this, "ping", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow();
				try {
					await this.isValidPing(t);
				} catch (s) {
					throw this.client.logger.error("ping() -> isValidPing() failed"), s;
				}
				const { topic: e } = t;
				if (this.client.session.keys.includes(e)) {
					const s = payloadId(), i = getBigIntRpcId().toString(), { done: r, resolve: n, reject: a } = ei();
					this.events.once(ci("session_ping", s), ({ error: l }) => {
						l ? a(l) : n();
					}), await Promise.all([this.sendRequest({
						topic: e,
						method: "wc_sessionPing",
						params: {},
						throwOnFailedPublish: !0,
						clientRpcId: s,
						relayRpcId: i
					}), r()]);
				} else this.client.core.pairing.pairings.keys.includes(e) && (this.client.logger.warn("ping() on pairing topic is deprecated and will be removed in the next major release."), await this.client.core.pairing.ping({ topic: e }));
			}), c(this, "emit", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidEmit(t);
				const { topic: e, event: s, chainId: i } = t, r = getBigIntRpcId().toString(), n = payloadId();
				await this.sendRequest({
					topic: e,
					method: "wc_sessionEvent",
					params: {
						event: s,
						chainId: i
					},
					throwOnFailedPublish: !0,
					relayRpcId: r,
					clientRpcId: n
				});
			}), c(this, "disconnect", async (t) => {
				this.isInitialized(), await this.confirmOnlineStateOrThrow(), await this.isValidDisconnect(t);
				const { topic: e } = t;
				if (this.client.session.keys.includes(e)) await this.sendRequest({
					topic: e,
					method: "wc_sessionDelete",
					params: Kt("USER_DISCONNECTED"),
					throwOnFailedPublish: !0
				}), await this.deleteSession({
					topic: e,
					emitEvent: !1
				});
				else if (this.client.core.pairing.pairings.keys.includes(e)) await this.client.core.pairing.disconnect({ topic: e });
				else {
					const { message: s } = Et$1("MISMATCHED_TOPIC", `Session or pairing topic not found: ${e}`);
					throw new Error(s);
				}
			}), c(this, "find", (t) => (this.isInitialized(), this.client.session.getAll().filter((e) => ya(e, t)))), c(this, "getPendingSessionRequests", () => this.client.pendingRequest.getAll()), c(this, "authenticate", async (t, e) => {
				var s;
				this.isInitialized(), this.isValidAuthenticate(t);
				const i = e && this.client.core.linkModeSupportedApps.includes(e) && ((s = this.client.metadata.redirect) == null ? void 0 : s.linkMode), r = i ? ee.link_mode : ee.relay;
				r === ee.relay && await this.confirmOnlineStateOrThrow();
				const { chains: n, statement: a = "", uri: l, domain: p, nonce: h, type: u, exp: d, nbf: y, methods: w = [], expiry: m } = t, S = [...t.resources || []], { topic: _, uri: b } = await this.client.core.pairing.create({
					methods: ["wc_sessionAuthenticate"],
					transportType: r
				});
				this.client.logger.info({
					message: "Generated new pairing",
					pairing: {
						topic: _,
						uri: b
					}
				});
				const C = await this.client.core.crypto.generateKeyPair(), I = Fc(C);
				if (await Promise.all([this.client.auth.authKeys.set(pe, {
					responseTopic: I,
					publicKey: C
				}), this.client.auth.pairingTopics.set(I, {
					topic: I,
					pairingTopic: _
				})]), await this.client.core.relayer.subscribe(I, { transportType: r }), this.client.logger.info(`sending request to new pairing topic: ${_}`), w.length > 0) {
					const { namespace: A } = Fe(n[0]);
					let k = Ef(A, "request", w);
					Oe(S) && (k = Bf(k, S.pop())), S.push(k);
				}
				const T = m && m > P.wc_sessionAuthenticate.req.ttl ? m : P.wc_sessionAuthenticate.req.ttl, $ = {
					authPayload: {
						type: u ?? "caip122",
						chains: n,
						statement: a,
						aud: l,
						domain: p,
						version: "1",
						nonce: h,
						iat: (/* @__PURE__ */ new Date()).toISOString(),
						exp: d,
						nbf: y,
						resources: S
					},
					requester: {
						publicKey: C,
						metadata: this.client.metadata
					},
					expiryTimestamp: ii(T)
				}, N = {
					requiredNamespaces: {},
					optionalNamespaces: { eip155: {
						chains: n,
						methods: [...new Set(["personal_sign", ...w])],
						events: ["chainChanged", "accountsChanged"]
					} },
					relays: [{ protocol: "irn" }],
					pairingTopic: _,
					proposer: {
						publicKey: C,
						metadata: this.client.metadata
					},
					expiryTimestamp: ii(P.wc_sessionPropose.req.ttl),
					id: payloadId()
				}, { done: Tt, resolve: Ue, reject: Se } = ei(T, "Request expired"), se = payloadId(), he = ci("session_connect", N.id), Re = ci("session_request", se), de = async ({ error: A, session: k }) => {
					this.events.off(Re, ve), A ? Se(A) : k && Ue({ session: k });
				}, ve = async (A) => {
					var k, Ge, je;
					if (await this.deletePendingAuthRequest(se, {
						message: "fulfilled",
						code: 0
					}), A.error) {
						const re = Kt("WC_METHOD_UNSUPPORTED", "wc_sessionAuthenticate");
						return A.error.code === re.code ? void 0 : (this.events.off(he, de), Se(A.error.message));
					}
					await this.deleteProposal(N.id), this.events.off(he, de);
					const { cacaos: Fe, responder: H } = A.result, Te = [], Qe = [];
					for (const re of Fe) {
						await yf({
							cacao: re,
							projectId: this.client.core.projectId
						}) || (this.client.logger.error(re, "Signature verification failed"), Se(Kt("SESSION_SETTLEMENT_FAILED", "Signature verification failed")));
						const { p: qe } = re, Pe = Oe(qe.resources), He = [Vr(qe.iss)], qt = dn(qe.iss);
						if (Pe) {
							const Ne = If(Pe), Pt = Af(Pe);
							Te.push(...Ne), He.push(...Pt);
						}
						for (const Ne of He) Qe.push(`${Ne}:${qt}`);
					}
					const ie = await this.client.core.crypto.generateSharedKey(C, H.publicKey);
					let ue;
					Te.length > 0 && (ue = {
						topic: ie,
						acknowledged: !0,
						self: {
							publicKey: C,
							metadata: this.client.metadata
						},
						peer: H,
						controller: H.publicKey,
						expiry: ii(B),
						requiredNamespaces: {},
						optionalNamespaces: {},
						relay: { protocol: "irn" },
						pairingTopic: _,
						namespaces: ga([...new Set(Te)], [...new Set(Qe)]),
						transportType: r
					}, await this.client.core.relayer.subscribe(ie, { transportType: r }), await this.client.session.set(ie, ue), _ && await this.client.core.pairing.updateMetadata({
						topic: _,
						metadata: H.metadata
					}), ue = this.client.session.get(ie)), (k = this.client.metadata.redirect) != null && k.linkMode && (Ge = H.metadata.redirect) != null && Ge.linkMode && (je = H.metadata.redirect) != null && je.universal && e && (this.client.core.addLinkModeSupportedApp(H.metadata.redirect.universal), this.client.session.update(ie, { transportType: ee.link_mode })), Ue({
						auths: Fe,
						session: ue
					});
				};
				this.events.once(he, de), this.events.once(Re, ve);
				let Ie;
				try {
					if (i) {
						const A = formatJsonRpcRequest("wc_sessionAuthenticate", $, se);
						this.client.core.history.set(_, A);
						Ie = sa(e, _, await this.client.core.crypto.encode("", A, {
							type: 2,
							encoding: De$1
						}));
					} else await Promise.all([this.sendRequest({
						topic: _,
						method: "wc_sessionAuthenticate",
						params: $,
						expiry: t.expiry,
						throwOnFailedPublish: !0,
						clientRpcId: se
					}), this.sendRequest({
						topic: _,
						method: "wc_sessionPropose",
						params: N,
						expiry: P.wc_sessionPropose.req.ttl,
						throwOnFailedPublish: !0,
						clientRpcId: N.id
					})]);
				} catch (A) {
					throw this.events.off(he, de), this.events.off(Re, ve), A;
				}
				return await this.setProposal(N.id, N), await this.setAuthRequest(se, {
					request: O(R({}, $), { verifyContext: {} }),
					pairingTopic: _,
					transportType: r
				}), {
					uri: Ie ?? b,
					response: Tt
				};
			}), c(this, "approveSessionAuthenticate", async (t) => {
				const { id: e, auths: s } = t, i = this.client.core.eventClient.createEvent({ properties: {
					topic: e.toString(),
					trace: [or.authenticated_session_approve_started]
				} });
				try {
					this.isInitialized();
				} catch (m) {
					throw i.setError(ar.no_internet_connection), m;
				}
				const r = this.getPendingAuthRequest(e);
				if (!r) throw i.setError(ar.authenticated_session_pending_request_not_found), /* @__PURE__ */ new Error(`Could not find pending auth request with id ${e}`);
				const n = r.transportType || ee.relay;
				n === ee.relay && await this.confirmOnlineStateOrThrow();
				const a = r.requester.publicKey, l = await this.client.core.crypto.generateKeyPair(), p = Fc(a), h = {
					type: 1,
					receiverPublicKey: a,
					senderPublicKey: l
				}, u = [], d = [];
				for (const m of s) {
					if (!await yf({
						cacao: m,
						projectId: this.client.core.projectId
					})) {
						i.setError(ar.invalid_cacao);
						const I = Kt("SESSION_SETTLEMENT_FAILED", "Signature verification failed");
						throw await this.sendError({
							id: e,
							topic: p,
							error: I,
							encodeOpts: h
						}), new Error(I.message);
					}
					i.addTrace(or.cacaos_verified);
					const { p: S } = m, _ = Oe(S.resources), b = [Vr(S.iss)], C = dn(S.iss);
					if (_) {
						const I = If(_), T = Af(_);
						u.push(...I), b.push(...T);
					}
					for (const I of b) d.push(`${I}:${C}`);
				}
				const y = await this.client.core.crypto.generateSharedKey(l, a);
				i.addTrace(or.create_authenticated_session_topic);
				let w;
				if (u?.length > 0) {
					w = {
						topic: y,
						acknowledged: !0,
						self: {
							publicKey: l,
							metadata: this.client.metadata
						},
						peer: {
							publicKey: a,
							metadata: r.requester.metadata
						},
						controller: a,
						expiry: ii(B),
						authentication: s,
						requiredNamespaces: {},
						optionalNamespaces: {},
						relay: { protocol: "irn" },
						pairingTopic: r.pairingTopic,
						namespaces: ga([...new Set(u)], [...new Set(d)]),
						transportType: n
					}, i.addTrace(or.subscribing_authenticated_session_topic);
					try {
						await this.client.core.relayer.subscribe(y, { transportType: n });
					} catch (m) {
						throw i.setError(ar.subscribe_authenticated_session_topic_failure), m;
					}
					i.addTrace(or.subscribe_authenticated_session_topic_success), await this.client.session.set(y, w), i.addTrace(or.store_authenticated_session), await this.client.core.pairing.updateMetadata({
						topic: r.pairingTopic,
						metadata: r.requester.metadata
					});
				}
				i.addTrace(or.publishing_authenticated_session_approve);
				try {
					await this.sendResult({
						topic: p,
						id: e,
						result: {
							cacaos: s,
							responder: {
								publicKey: l,
								metadata: this.client.metadata
							}
						},
						encodeOpts: h,
						throwOnFailedPublish: !0,
						appLink: this.getAppLinkIfEnabled(r.requester.metadata, n)
					});
				} catch (m) {
					throw i.setError(ar.authenticated_session_approve_publish_failure), m;
				}
				return await this.client.auth.requests.delete(e, {
					message: "fulfilled",
					code: 0
				}), await this.client.core.pairing.activate({ topic: r.pairingTopic }), this.client.core.eventClient.deleteEvent({ eventId: i.eventId }), { session: w };
			}), c(this, "rejectSessionAuthenticate", async (t) => {
				this.isInitialized();
				const { id: e, reason: s } = t, i = this.getPendingAuthRequest(e);
				if (!i) throw new Error(`Could not find pending auth request with id ${e}`);
				i.transportType === ee.relay && await this.confirmOnlineStateOrThrow();
				const r = i.requester.publicKey, n = await this.client.core.crypto.generateKeyPair(), a = Fc(r), l = {
					type: 1,
					receiverPublicKey: r,
					senderPublicKey: n
				};
				await this.sendError({
					id: e,
					topic: a,
					error: s,
					encodeOpts: l,
					rpcOpts: P.wc_sessionAuthenticate.reject,
					appLink: this.getAppLinkIfEnabled(i.requester.metadata, i.transportType)
				}), await this.client.auth.requests.delete(e, {
					message: "rejected",
					code: 0
				}), await this.deleteProposal(e);
			}), c(this, "formatAuthMessage", (t) => {
				this.isInitialized();
				const { request: e, iss: s } = t;
				return qr(e, s);
			}), c(this, "processRelayMessageCache", () => {
				setTimeout(async () => {
					if (this.relayMessageCache.length !== 0) for (; this.relayMessageCache.length > 0;) try {
						const t = this.relayMessageCache.shift();
						t && await this.onRelayMessage(t);
					} catch (t) {
						this.client.logger.error(t);
					}
				}, 50);
			}), c(this, "cleanupDuplicatePairings", async (t) => {
				if (t.pairingTopic) try {
					const e = this.client.core.pairing.pairings.get(t.pairingTopic), s = this.client.core.pairing.pairings.getAll().filter((i) => {
						var r, n;
						return ((r = i.peerMetadata) == null ? void 0 : r.url) && ((n = i.peerMetadata) == null ? void 0 : n.url) === t.peer.metadata.url && i.topic && i.topic !== e.topic;
					});
					if (s.length === 0) return;
					this.client.logger.info(`Cleaning up ${s.length} duplicate pairing(s)`), await Promise.all(s.map((i) => this.client.core.pairing.disconnect({ topic: i.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
				} catch (e) {
					this.client.logger.error(e);
				}
			}), c(this, "deleteSession", async (t) => {
				var e;
				const { topic: s, expirerHasDeleted: i = !1, emitEvent: r = !0, id: n = 0 } = t, { self: a } = this.client.session.get(s);
				await this.client.core.relayer.unsubscribe(s), await this.client.session.delete(s, Kt("USER_DISCONNECTED")), this.addToRecentlyDeleted(s, "session"), this.client.core.crypto.keychain.has(a.publicKey) && await this.client.core.crypto.deleteKeyPair(a.publicKey), this.client.core.crypto.keychain.has(s) && await this.client.core.crypto.deleteSymKey(s), i || this.client.core.expirer.del(s), this.client.core.storage.removeItem(Le).catch((l) => this.client.logger.warn(l)), this.getPendingSessionRequests().forEach((l) => {
					l.topic === s && this.deletePendingSessionRequest(l.id, Kt("USER_DISCONNECTED"));
				}), s === ((e = this.sessionRequestQueue.queue[0]) == null ? void 0 : e.topic) && (this.sessionRequestQueue.state = M.idle), r && this.client.events.emit("session_delete", {
					id: n,
					topic: s
				});
			}), c(this, "deleteProposal", async (t, e) => {
				if (e) try {
					const s = this.client.proposal.get(t);
					this.client.core.eventClient.getEvent({ topic: s.pairingTopic })?.setError(nr.proposal_expired);
				} catch {}
				await Promise.all([this.client.proposal.delete(t, Kt("USER_DISCONNECTED")), e ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "proposal");
			}), c(this, "deletePendingSessionRequest", async (t, e, s = !1) => {
				await Promise.all([this.client.pendingRequest.delete(t, e), s ? Promise.resolve() : this.client.core.expirer.del(t)]), this.addToRecentlyDeleted(t, "request"), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i) => i.id !== t), s && (this.sessionRequestQueue.state = M.idle, this.client.events.emit("session_request_expire", { id: t }));
			}), c(this, "deletePendingAuthRequest", async (t, e, s = !1) => {
				await Promise.all([this.client.auth.requests.delete(t, e), s ? Promise.resolve() : this.client.core.expirer.del(t)]);
			}), c(this, "setExpiry", async (t, e) => {
				this.client.session.keys.includes(t) && (this.client.core.expirer.set(t, e), await this.client.session.update(t, { expiry: e }));
			}), c(this, "setProposal", async (t, e) => {
				this.client.core.expirer.set(t, ii(P.wc_sessionPropose.req.ttl)), await this.client.proposal.set(t, e);
			}), c(this, "setAuthRequest", async (t, e) => {
				const { request: s, pairingTopic: i, transportType: r = ee.relay } = e;
				this.client.core.expirer.set(t, s.expiryTimestamp), await this.client.auth.requests.set(t, {
					authPayload: s.authPayload,
					requester: s.requester,
					expiryTimestamp: s.expiryTimestamp,
					id: t,
					pairingTopic: i,
					verifyContext: s.verifyContext,
					transportType: r
				});
			}), c(this, "setPendingSessionRequest", async (t) => {
				const { id: e, topic: s, params: i, verifyContext: r } = t, n = i.request.expiryTimestamp || ii(P.wc_sessionRequest.req.ttl);
				this.client.core.expirer.set(e, n), await this.client.pendingRequest.set(e, {
					id: e,
					topic: s,
					params: i,
					verifyContext: r
				});
			}), c(this, "sendRequest", async (t) => {
				const { topic: e, method: s, params: i, expiry: r, relayRpcId: n, clientRpcId: a, throwOnFailedPublish: l, appLink: p, tvf: h, publishOpts: u = {} } = t, d = formatJsonRpcRequest(s, i, a);
				let y;
				const w = !!p;
				try {
					const _ = w ? De$1 : Qt;
					y = await this.client.core.crypto.encode(e, d, { encoding: _ });
				} catch (_) {
					throw await this.cleanup(), this.client.logger.error(`sendRequest() -> core.crypto.encode() for topic ${e} failed`), _;
				}
				let m;
				if (mt.includes(s)) {
					const _ = zc(JSON.stringify(d)), b = zc(y);
					m = await this.client.core.verify.register({
						id: b,
						decryptedId: _
					});
				}
				const S = R(R({}, P[s].req), u);
				if (S.attestation = m, r && (S.ttl = r), n && (S.id = n), this.client.core.history.set(e, d), w) {
					const _ = sa(p, e, y);
					await global.Linking.openURL(_, this.client.name);
				} else S.tvf = O(R({}, h), { correlationId: d.id }), l ? (S.internal = O(R({}, S.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(e, y, S)) : this.client.core.relayer.publish(e, y, S).catch((_) => this.client.logger.error(_));
				return d.id;
			}), c(this, "sendProposeSession", async (t) => {
				const { proposal: e, publishOpts: s } = t, i = formatJsonRpcRequest("wc_sessionPropose", e, e.id);
				this.client.core.history.set(e.pairingTopic, i);
				const r = await this.client.core.crypto.encode(e.pairingTopic, i, { encoding: Qt }), n = zc(JSON.stringify(i)), a = zc(r), l = await this.client.core.verify.register({
					id: a,
					decryptedId: n
				});
				await this.client.core.relayer.publishCustom({
					payload: {
						pairingTopic: e.pairingTopic,
						sessionProposal: r
					},
					opts: O(R({}, s), {
						publishMethod: "wc_proposeSession",
						attestation: l
					})
				});
			}), c(this, "sendApproveSession", async (t) => {
				const { sessionTopic: e, pairingProposalResponse: s, proposal: i, sessionSettleRequest: r, publishOpts: n } = t, a = formatJsonRpcResult(i.id, s), l = await this.client.core.crypto.encode(i.pairingTopic, a, { encoding: Qt }), p = formatJsonRpcRequest("wc_sessionSettle", r, n?.id), h = await this.client.core.crypto.encode(e, p, { encoding: Qt });
				this.client.core.history.set(e, p), await this.client.core.relayer.publishCustom({
					payload: {
						sessionTopic: e,
						pairingTopic: i.pairingTopic,
						sessionProposalResponse: l,
						sessionSettlementRequest: h
					},
					opts: O(R({}, n), { publishMethod: "wc_approveSession" })
				});
			}), c(this, "sendResult", async (t) => {
				const { id: e, topic: s, result: i, throwOnFailedPublish: r, encodeOpts: n, appLink: a } = t, l = formatJsonRpcResult(e, i);
				let p;
				const h = a && typeof (global == null ? void 0 : global.Linking) < "u";
				try {
					const y = h ? De$1 : Qt;
					p = await this.client.core.crypto.encode(s, l, O(R({}, n || {}), { encoding: y }));
				} catch (y) {
					throw await this.cleanup(), this.client.logger.error(`sendResult() -> core.crypto.encode() for topic ${s} failed`), y;
				}
				let u, d;
				try {
					u = await this.client.core.history.get(s, e);
					const y = u.request;
					try {
						d = this.getTVFParams(e, y.params, i);
					} catch (w) {
						this.client.logger.warn(`sendResult() -> getTVFParams() failed: ${w?.message}`);
					}
				} catch (y) {
					throw this.client.logger.error(`sendResult() -> history.get(${s}, ${e}) failed`), y;
				}
				if (h) {
					const y = sa(a, s, p);
					await global.Linking.openURL(y, this.client.name);
				} else {
					const w = P[u.request.method].res;
					w.tvf = O(R({}, d), { correlationId: e }), r ? (w.internal = O(R({}, w.internal), { throwOnFailedPublish: !0 }), await this.client.core.relayer.publish(s, p, w)) : this.client.core.relayer.publish(s, p, w).catch((m) => this.client.logger.error(m));
				}
				await this.client.core.history.resolve(l);
			}), c(this, "sendError", async (t) => {
				const { id: e, topic: s, error: i, encodeOpts: r, rpcOpts: n, appLink: a } = t, l = formatJsonRpcError(e, i);
				let p;
				const h = a && typeof (global == null ? void 0 : global.Linking) < "u";
				try {
					const d = h ? De$1 : Qt;
					p = await this.client.core.crypto.encode(s, l, O(R({}, r || {}), { encoding: d }));
				} catch (d) {
					throw await this.cleanup(), this.client.logger.error(`sendError() -> core.crypto.encode() for topic ${s} failed`), d;
				}
				let u;
				try {
					u = await this.client.core.history.get(s, e);
				} catch (d) {
					throw this.client.logger.error(`sendError() -> history.get(${s}, ${e}) failed`), d;
				}
				if (h) {
					const d = sa(a, s, p);
					await global.Linking.openURL(d, this.client.name);
				} else {
					const d = u.request.method, y = n || P[d].res;
					this.client.core.relayer.publish(s, p, y);
				}
				await this.client.core.history.resolve(l);
			}), c(this, "cleanup", async () => {
				const t = [], e = [];
				this.client.session.getAll().forEach((s) => {
					let i = !1;
					fi(s.expiry) && (i = !0), this.client.core.crypto.keychain.has(s.topic) || (i = !0), i && t.push(s.topic);
				}), this.client.proposal.getAll().forEach((s) => {
					fi(s.expiryTimestamp) && e.push(s.id);
				}), await Promise.all([...t.map((s) => this.deleteSession({ topic: s })), ...e.map((s) => this.deleteProposal(s))]);
			}), c(this, "onProviderMessageEvent", async (t) => {
				!this.initialized || this.relayMessageCache.length > 0 ? this.relayMessageCache.push(t) : await this.onRelayMessage(t);
			}), c(this, "onRelayEventRequest", async (t) => {
				this.requestQueue.queue.push(t), await this.processRequestsQueue();
			}), c(this, "processRequestsQueue", async () => {
				if (this.requestQueue.state === M.active) {
					this.client.logger.info("Request queue already active, skipping...");
					return;
				}
				for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0;) {
					this.requestQueue.state = M.active;
					const t = this.requestQueue.queue.shift();
					if (t) try {
						await this.processRequest(t);
					} catch (e) {
						this.client.logger.warn(e);
					}
				}
				this.requestQueue.state = M.idle;
			}), c(this, "processRequest", async (t) => {
				const { topic: e, payload: s, attestation: i, transportType: r, encryptedId: n } = t, a = s.method;
				if (!this.shouldIgnorePairingRequest({
					topic: e,
					requestMethod: a
				})) switch (a) {
					case "wc_sessionPropose": return await this.onSessionProposeRequest({
						topic: e,
						payload: s,
						attestation: i,
						encryptedId: n
					});
					case "wc_sessionSettle": return await this.onSessionSettleRequest(e, s);
					case "wc_sessionUpdate": return await this.onSessionUpdateRequest(e, s);
					case "wc_sessionExtend": return await this.onSessionExtendRequest(e, s);
					case "wc_sessionPing": return await this.onSessionPingRequest(e, s);
					case "wc_sessionDelete": return await this.onSessionDeleteRequest(e, s);
					case "wc_sessionRequest": return await this.onSessionRequest({
						topic: e,
						payload: s,
						attestation: i,
						encryptedId: n,
						transportType: r
					});
					case "wc_sessionEvent": return await this.onSessionEventRequest(e, s);
					case "wc_sessionAuthenticate": return await this.onSessionAuthenticateRequest({
						topic: e,
						payload: s,
						attestation: i,
						encryptedId: n,
						transportType: r
					});
					default: return this.client.logger.info(`Unsupported request method ${a}`);
				}
			}), c(this, "onRelayEventResponse", async (t) => {
				const { topic: e, payload: s, transportType: i } = t, r = (await this.client.core.history.get(e, s.id)).request.method;
				switch (r) {
					case "wc_sessionPropose": return this.onSessionProposeResponse(e, s, i);
					case "wc_sessionSettle": return this.onSessionSettleResponse(e, s);
					case "wc_sessionUpdate": return this.onSessionUpdateResponse(e, s);
					case "wc_sessionExtend": return this.onSessionExtendResponse(e, s);
					case "wc_sessionPing": return this.onSessionPingResponse(e, s);
					case "wc_sessionRequest": return this.onSessionRequestResponse(e, s);
					case "wc_sessionAuthenticate": return this.onSessionAuthenticateResponse(e, s);
					default: return this.client.logger.info(`Unsupported response method ${r}`);
				}
			}), c(this, "onRelayEventUnknownPayload", (t) => {
				const { topic: e } = t, { message: s } = Et$1("MISSING_OR_INVALID", `Decoded payload on topic ${e} is not identifiable as a JSON-RPC request or a response.`);
				throw new Error(s);
			}), c(this, "shouldIgnorePairingRequest", (t) => {
				const { topic: e, requestMethod: s } = t, i = this.expectedPairingMethodMap.get(e);
				return !i || i.includes(s) ? !1 : !!(i.includes("wc_sessionAuthenticate") && this.client.events.listenerCount("session_authenticate") > 0);
			}), c(this, "onSessionProposeRequest", async (t) => {
				const { topic: e, payload: s, attestation: i, encryptedId: r } = t, { params: n, id: a } = s;
				try {
					const l = this.client.core.eventClient.getEvent({ topic: e });
					this.client.events.listenerCount("session_proposal") === 0 && (console.warn("No listener for session_proposal event"), l?.setError(X.proposal_listener_not_found)), this.isValidConnect(R({}, s.params));
					const h = R({
						id: a,
						pairingTopic: e,
						expiryTimestamp: n.expiryTimestamp || ii(P.wc_sessionPropose.req.ttl),
						attestation: i,
						encryptedId: r
					}, n);
					await this.setProposal(a, h);
					const u = await this.getVerifyContext({
						attestationId: i,
						hash: zc(JSON.stringify(s)),
						encryptedId: r,
						metadata: h.proposer.metadata
					});
					l?.addTrace(Y.emit_session_proposal), this.client.events.emit("session_proposal", {
						id: a,
						params: h,
						verifyContext: u
					});
				} catch (l) {
					await this.sendError({
						id: a,
						topic: e,
						error: l,
						rpcOpts: P.wc_sessionPropose.autoReject
					}), this.client.logger.error(l);
				}
			}), c(this, "onSessionProposeResponse", async (t, e, s) => {
				const { id: i } = e;
				if (isJsonRpcResult(e)) {
					const { result: r } = e;
					this.client.logger.trace({
						type: "method",
						method: "onSessionProposeResponse",
						result: r
					});
					const n = this.client.proposal.get(i);
					this.client.logger.trace({
						type: "method",
						method: "onSessionProposeResponse",
						proposal: n
					});
					const a = n.proposer.publicKey;
					this.client.logger.trace({
						type: "method",
						method: "onSessionProposeResponse",
						selfPublicKey: a
					});
					const l = r.responderPublicKey;
					this.client.logger.trace({
						type: "method",
						method: "onSessionProposeResponse",
						peerPublicKey: l
					});
					const p = await this.client.core.crypto.generateSharedKey(a, l);
					this.pendingSessions.set(i, {
						sessionTopic: p,
						pairingTopic: t,
						proposalId: i,
						publicKey: a
					});
					const h = await this.client.core.relayer.subscribe(p, { transportType: s });
					this.client.logger.trace({
						type: "method",
						method: "onSessionProposeResponse",
						subscriptionId: h
					}), await this.client.core.pairing.activate({ topic: t });
				} else if (isJsonRpcError(e)) {
					await this.deleteProposal(i);
					const r = ci("session_connect", i);
					if (this.events.listenerCount(r) === 0) throw new Error(`emitting ${r} without any listeners, 954`);
					this.events.emit(r, { error: e.error });
				}
			}), c(this, "onSessionSettleRequest", async (t, e) => {
				const { id: s, params: i } = e;
				try {
					this.isValidSessionSettleRequest(i);
					const { relay: r, controller: n, expiry: a, namespaces: l, sessionProperties: p, scopedProperties: h, sessionConfig: u } = e.params, d = [...this.pendingSessions.values()].find((m) => m.sessionTopic === t);
					if (!d) return this.client.logger.error(`Pending session not found for topic ${t}`);
					const y = this.client.proposal.get(d.proposalId), w = O(R(R(R({
						topic: t,
						relay: r,
						expiry: a,
						namespaces: l,
						acknowledged: !0,
						pairingTopic: d.pairingTopic,
						requiredNamespaces: y.requiredNamespaces,
						optionalNamespaces: y.optionalNamespaces,
						controller: n.publicKey,
						self: {
							publicKey: d.publicKey,
							metadata: this.client.metadata
						},
						peer: {
							publicKey: n.publicKey,
							metadata: n.metadata
						}
					}, p && { sessionProperties: p }), h && { scopedProperties: h }), u && { sessionConfig: u }), { transportType: ee.relay });
					await this.client.session.set(w.topic, w), await this.setExpiry(w.topic, w.expiry), await this.client.core.pairing.updateMetadata({
						topic: d.pairingTopic,
						metadata: w.peer.metadata
					}), this.client.events.emit("session_connect", { session: w }), this.events.emit(ci("session_connect", d.proposalId), { session: w }), this.pendingSessions.delete(d.proposalId), this.deleteProposal(d.proposalId, !1), this.cleanupDuplicatePairings(w), await this.sendResult({
						id: e.id,
						topic: t,
						result: !0
					});
				} catch (r) {
					await this.sendError({
						id: s,
						topic: t,
						error: r
					}), this.client.logger.error(r);
				}
			}), c(this, "onSessionSettleResponse", async (t, e) => {
				const { id: s } = e;
				isJsonRpcResult(e) ? (await this.client.session.update(t, { acknowledged: !0 }), this.events.emit(ci("session_approve", s), {})) : isJsonRpcError(e) && (await this.client.session.delete(t, Kt("USER_DISCONNECTED")), this.events.emit(ci("session_approve", s), { error: e.error }));
			}), c(this, "onSessionUpdateRequest", async (t, e) => {
				const { params: s, id: i } = e;
				try {
					const r = `${t}_session_update`, n = Ha.get(r);
					if (n && this.isRequestOutOfSync(n, i)) {
						this.client.logger.warn(`Discarding out of sync request - ${i}`), this.sendError({
							id: i,
							topic: t,
							error: Kt("INVALID_UPDATE_REQUEST")
						});
						return;
					}
					this.isValidUpdate(R({ topic: t }, s));
					try {
						Ha.set(r, i), await this.client.session.update(t, { namespaces: s.namespaces }), await this.sendResult({
							id: i,
							topic: t,
							result: !0
						});
					} catch (a) {
						throw Ha.delete(r), a;
					}
					this.client.events.emit("session_update", {
						id: i,
						topic: t,
						params: s
					});
				} catch (r) {
					await this.sendError({
						id: i,
						topic: t,
						error: r
					}), this.client.logger.error(r);
				}
			}), c(this, "isRequestOutOfSync", (t, e) => e.toString().slice(0, -3) < t.toString().slice(0, -3)), c(this, "onSessionUpdateResponse", (t, e) => {
				const { id: s } = e, i = ci("session_update", s);
				if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
				isJsonRpcResult(e) ? this.events.emit(ci("session_update", s), {}) : isJsonRpcError(e) && this.events.emit(ci("session_update", s), { error: e.error });
			}), c(this, "onSessionExtendRequest", async (t, e) => {
				const { id: s } = e;
				try {
					this.isValidExtend({ topic: t }), await this.setExpiry(t, ii(B)), await this.sendResult({
						id: s,
						topic: t,
						result: !0
					}), this.client.events.emit("session_extend", {
						id: s,
						topic: t
					});
				} catch (i) {
					await this.sendError({
						id: s,
						topic: t,
						error: i
					}), this.client.logger.error(i);
				}
			}), c(this, "onSessionExtendResponse", (t, e) => {
				const { id: s } = e, i = ci("session_extend", s);
				if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
				isJsonRpcResult(e) ? this.events.emit(ci("session_extend", s), {}) : isJsonRpcError(e) && this.events.emit(ci("session_extend", s), { error: e.error });
			}), c(this, "onSessionPingRequest", async (t, e) => {
				const { id: s } = e;
				try {
					this.isValidPing({ topic: t }), await this.sendResult({
						id: s,
						topic: t,
						result: !0,
						throwOnFailedPublish: !0
					}), this.client.events.emit("session_ping", {
						id: s,
						topic: t
					});
				} catch (i) {
					await this.sendError({
						id: s,
						topic: t,
						error: i
					}), this.client.logger.error(i);
				}
			}), c(this, "onSessionPingResponse", (t, e) => {
				const { id: s } = e, i = ci("session_ping", s);
				setTimeout(() => {
					if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners 2176`);
					isJsonRpcResult(e) ? this.events.emit(ci("session_ping", s), {}) : isJsonRpcError(e) && this.events.emit(ci("session_ping", s), { error: e.error });
				}, 500);
			}), c(this, "onSessionDeleteRequest", async (t, e) => {
				const { id: s } = e;
				try {
					this.isValidDisconnect({
						topic: t,
						reason: e.params
					}), await Promise.all([
						new Promise((i) => {
							this.client.core.relayer.once(C.publish, async () => {
								i(await this.deleteSession({
									topic: t,
									id: s
								}));
							});
						}),
						this.sendResult({
							id: s,
							topic: t,
							result: !0
						}),
						this.cleanupPendingSentRequestsForTopic({
							topic: t,
							error: Kt("USER_DISCONNECTED")
						})
					]).catch((i) => this.client.logger.error(i));
				} catch (i) {
					this.client.logger.error(i);
				}
			}), c(this, "onSessionRequest", async (t) => {
				var e, s, i;
				const { topic: r, payload: n, attestation: a, encryptedId: l, transportType: p } = t, { id: h, params: u } = n;
				try {
					await this.isValidRequest(R({ topic: r }, u));
					const d = this.client.session.get(r), w = {
						id: h,
						topic: r,
						params: u,
						verifyContext: await this.getVerifyContext({
							attestationId: a,
							hash: zc(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", u, h))),
							encryptedId: l,
							metadata: d.peer.metadata,
							transportType: p
						})
					};
					await this.setPendingSessionRequest(w), p === ee.link_mode && (e = d.peer.metadata.redirect) != null && e.universal && this.client.core.addLinkModeSupportedApp((s = d.peer.metadata.redirect) == null ? void 0 : s.universal), (i = this.client.signConfig) != null && i.disableRequestQueue ? this.emitSessionRequest(w) : (this.addSessionRequestToSessionRequestQueue(w), this.processSessionRequestQueue());
				} catch (d) {
					await this.sendError({
						id: h,
						topic: r,
						error: d
					}), this.client.logger.error(d);
				}
			}), c(this, "onSessionRequestResponse", (t, e) => {
				const { id: s } = e, i = ci("session_request", s);
				if (this.events.listenerCount(i) === 0) throw new Error(`emitting ${i} without any listeners`);
				isJsonRpcResult(e) ? this.events.emit(ci("session_request", s), { result: e.result }) : isJsonRpcError(e) && this.events.emit(ci("session_request", s), { error: e.error });
			}), c(this, "onSessionEventRequest", async (t, e) => {
				const { id: s, params: i } = e;
				try {
					const r = `${t}_session_event_${i.event.name}`, n = Ha.get(r);
					if (n && this.isRequestOutOfSync(n, s)) {
						this.client.logger.info(`Discarding out of sync request - ${s}`);
						return;
					}
					this.isValidEmit(R({ topic: t }, i)), this.client.events.emit("session_event", {
						id: s,
						topic: t,
						params: i
					}), Ha.set(r, s);
				} catch (r) {
					await this.sendError({
						id: s,
						topic: t,
						error: r
					}), this.client.logger.error(r);
				}
			}), c(this, "onSessionAuthenticateResponse", (t, e) => {
				const { id: s } = e;
				this.client.logger.trace({
					type: "method",
					method: "onSessionAuthenticateResponse",
					topic: t,
					payload: e
				}), isJsonRpcResult(e) ? this.events.emit(ci("session_request", s), { result: e.result }) : isJsonRpcError(e) && this.events.emit(ci("session_request", s), { error: e.error });
			}), c(this, "onSessionAuthenticateRequest", async (t) => {
				var e;
				const { topic: s, payload: i, attestation: r, encryptedId: n, transportType: a } = t;
				try {
					const { requester: l, authPayload: p, expiryTimestamp: h } = i.params, u = await this.getVerifyContext({
						attestationId: r,
						hash: zc(JSON.stringify(i)),
						encryptedId: n,
						metadata: l.metadata,
						transportType: a
					}), d = {
						requester: l,
						pairingTopic: s,
						id: i.id,
						authPayload: p,
						verifyContext: u,
						expiryTimestamp: h
					};
					await this.setAuthRequest(i.id, {
						request: d,
						pairingTopic: s,
						transportType: a
					}), a === ee.link_mode && (e = l.metadata.redirect) != null && e.universal && this.client.core.addLinkModeSupportedApp(l.metadata.redirect.universal), this.client.events.emit("session_authenticate", {
						topic: s,
						params: i.params,
						id: i.id,
						verifyContext: u
					});
				} catch (l) {
					this.client.logger.error(l);
					const p = i.params.requester.publicKey, h = await this.client.core.crypto.generateKeyPair(), u = this.getAppLinkIfEnabled(i.params.requester.metadata, a), d = {
						type: 1,
						receiverPublicKey: p,
						senderPublicKey: h
					};
					await this.sendError({
						id: i.id,
						topic: s,
						error: l,
						encodeOpts: d,
						rpcOpts: P.wc_sessionAuthenticate.autoReject,
						appLink: u
					});
				}
			}), c(this, "addSessionRequestToSessionRequestQueue", (t) => {
				this.sessionRequestQueue.queue.push(t);
			}), c(this, "cleanupAfterResponse", (t) => {
				this.deletePendingSessionRequest(t.response.id, {
					message: "fulfilled",
					code: 0
				}), setTimeout(() => {
					this.sessionRequestQueue.state = M.idle, this.processSessionRequestQueue();
				}, (0, import_cjs.toMiliseconds)(this.requestQueueDelay));
			}), c(this, "cleanupPendingSentRequestsForTopic", ({ topic: t, error: e }) => {
				const s = this.client.core.history.pending;
				s.length > 0 && s.filter((i) => i.topic === t && i.request.method === "wc_sessionRequest").forEach((i) => {
					const r = i.request.id, n = ci("session_request", r);
					if (this.events.listenerCount(n) === 0) throw new Error(`emitting ${n} without any listeners`);
					this.events.emit(ci("session_request", i.request.id), { error: e });
				});
			}), c(this, "processSessionRequestQueue", () => {
				if (this.sessionRequestQueue.state === M.active) {
					this.client.logger.info("session request queue is already active.");
					return;
				}
				const t = this.sessionRequestQueue.queue[0];
				if (!t) {
					this.client.logger.info("session request queue is empty.");
					return;
				}
				try {
					this.emitSessionRequest(t);
				} catch (e) {
					this.client.logger.error(e);
				}
			}), c(this, "emitSessionRequest", (t) => {
				if (this.emittedSessionRequests.has(t.id)) {
					this.client.logger.warn({ id: t.id }, `Skipping emitting \`session_request\` event for duplicate request. id: ${t.id}`);
					return;
				}
				this.sessionRequestQueue.state = M.active, this.emittedSessionRequests.add(t.id), this.client.events.emit("session_request", t);
			}), c(this, "onPairingCreated", (t) => {
				if (t.methods && this.expectedPairingMethodMap.set(t.topic, t.methods), t.active) return;
				const e = this.client.proposal.getAll().find((s) => s.pairingTopic === t.topic);
				e && this.onSessionProposeRequest({
					topic: t.topic,
					payload: formatJsonRpcRequest("wc_sessionPropose", O(R({}, e), {
						requiredNamespaces: e.requiredNamespaces,
						optionalNamespaces: e.optionalNamespaces,
						relays: e.relays,
						proposer: e.proposer,
						sessionProperties: e.sessionProperties,
						scopedProperties: e.scopedProperties
					}), e.id),
					attestation: e.attestation,
					encryptedId: e.encryptedId
				});
			}), c(this, "isValidConnect", async (t) => {
				if (!Aa(t)) {
					const { message: l } = Et$1("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(t)}`);
					throw new Error(l);
				}
				const { pairingTopic: e, requiredNamespaces: s, optionalNamespaces: i, sessionProperties: r, scopedProperties: n, relays: a } = t;
				if (kt(e) || await this.isValidPairingTopic(e), !Ba(a, !0)) {
					const { message: l } = Et$1("MISSING_OR_INVALID", `connect() relays: ${a}`);
					throw new Error(l);
				}
				if (!kt(s) && Ve(s) !== 0) {
					const l = "requiredNamespaces are deprecated and are automatically assigned to optionalNamespaces";
					[
						"fatal",
						"error",
						"silent"
					].includes(this.client.logger.level) ? console.warn(l) : this.client.logger.warn(l), this.validateNamespaces(s, "requiredNamespaces");
				}
				if (!kt(i) && Ve(i) !== 0 && this.validateNamespaces(i, "optionalNamespaces"), kt(r) || this.validateSessionProps(r, "sessionProperties"), !kt(n)) {
					this.validateSessionProps(n, "scopedProperties");
					const l = Object.keys(s || {}).concat(Object.keys(i || {}));
					if (!Object.keys(n).every((p) => l.includes(p.split(":")[0]))) throw new Error(`Scoped properties must be a subset of required/optional namespaces, received: ${JSON.stringify(n)}, required/optional namespaces: ${JSON.stringify(l)}`);
				}
			}), c(this, "validateNamespaces", (t, e) => {
				const s = Ea(t, "connect()", e);
				if (s) throw new Error(s.message);
			}), c(this, "isValidApprove", async (t) => {
				if (!Aa(t)) throw new Error(Et$1("MISSING_OR_INVALID", `approve() params: ${t}`).message);
				const { id: e, namespaces: s, relayProtocol: i, sessionProperties: r, scopedProperties: n } = t;
				this.checkRecentlyDeleted(e), await this.isValidProposalId(e);
				const a = this.client.proposal.get(e), l = is(s, "approve()");
				if (l) throw new Error(l.message);
				const p = cs(a.requiredNamespaces, s, "approve()");
				if (p) throw new Error(p.message);
				if (!it(i, !0)) {
					const { message: h } = Et$1("MISSING_OR_INVALID", `approve() relayProtocol: ${i}`);
					throw new Error(h);
				}
				if (kt(r) || this.validateSessionProps(r, "sessionProperties"), !kt(n)) {
					this.validateSessionProps(n, "scopedProperties");
					const h = new Set(Object.keys(s));
					if (!Object.keys(n).every((u) => h.has(u.split(":")[0]))) throw new Error(`Scoped properties must be a subset of approved namespaces, received: ${JSON.stringify(n)}, approved namespaces: ${Array.from(h).join(", ")}`);
				}
			}), c(this, "isValidReject", async (t) => {
				if (!Aa(t)) {
					const { message: i } = Et$1("MISSING_OR_INVALID", `reject() params: ${t}`);
					throw new Error(i);
				}
				const { id: e, reason: s } = t;
				if (this.checkRecentlyDeleted(e), await this.isValidProposalId(e), !Sa(s)) {
					const { message: i } = Et$1("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(s)}`);
					throw new Error(i);
				}
			}), c(this, "isValidSessionSettleRequest", (t) => {
				if (!Aa(t)) {
					const { message: l } = Et$1("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${t}`);
					throw new Error(l);
				}
				const { relay: e, controller: s, namespaces: i, expiry: r } = t;
				if (!fs(e)) {
					const { message: l } = Et$1("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
					throw new Error(l);
				}
				const n = va(s, "onSessionSettleRequest()");
				if (n) throw new Error(n.message);
				const a = is(i, "onSessionSettleRequest()");
				if (a) throw new Error(a.message);
				if (fi(r)) {
					const { message: l } = Et$1("EXPIRED", "onSessionSettleRequest()");
					throw new Error(l);
				}
			}), c(this, "isValidUpdate", async (t) => {
				if (!Aa(t)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `update() params: ${t}`);
					throw new Error(a);
				}
				const { topic: e, namespaces: s } = t;
				this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
				const i = this.client.session.get(e), r = is(s, "update()");
				if (r) throw new Error(r.message);
				const n = cs(i.requiredNamespaces, s, "update()");
				if (n) throw new Error(n.message);
			}), c(this, "isValidExtend", async (t) => {
				if (!Aa(t)) {
					const { message: s } = Et$1("MISSING_OR_INVALID", `extend() params: ${t}`);
					throw new Error(s);
				}
				const { topic: e } = t;
				this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
			}), c(this, "isValidRequest", async (t) => {
				if (!Aa(t)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `request() params: ${t}`);
					throw new Error(a);
				}
				const { topic: e, request: s, chainId: i, expiry: r } = t;
				this.checkRecentlyDeleted(e), await this.isValidSessionTopic(e);
				const { namespaces: n } = this.client.session.get(e);
				if (!_a(n, i)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `request() chainId: ${i}`);
					throw new Error(a);
				}
				if (!Na(s)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `request() ${JSON.stringify(s)}`);
					throw new Error(a);
				}
				if (!Ta(n, i, s.method)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `request() method: ${s.method}`);
					throw new Error(a);
				}
				if (r && !La(r, _e)) {
					const { message: a } = Et$1("MISSING_OR_INVALID", `request() expiry: ${r}. Expiry must be a number (in seconds) between ${_e.min} and ${_e.max}`);
					throw new Error(a);
				}
			}), c(this, "isValidRespond", async (t) => {
				var e;
				if (!Aa(t)) {
					const { message: r } = Et$1("MISSING_OR_INVALID", `respond() params: ${t}`);
					throw new Error(r);
				}
				const { topic: s, response: i } = t;
				try {
					await this.isValidSessionTopic(s);
				} catch (r) {
					throw (e = t?.response) != null && e.id && this.cleanupAfterResponse(t), r;
				}
				if (!Oa(i)) {
					const { message: r } = Et$1("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(i)}`);
					throw new Error(r);
				}
			}), c(this, "isValidPing", async (t) => {
				if (!Aa(t)) {
					const { message: s } = Et$1("MISSING_OR_INVALID", `ping() params: ${t}`);
					throw new Error(s);
				}
				const { topic: e } = t;
				await this.isValidSessionOrPairingTopic(e);
			}), c(this, "isValidEmit", async (t) => {
				if (!Aa(t)) {
					const { message: n } = Et$1("MISSING_OR_INVALID", `emit() params: ${t}`);
					throw new Error(n);
				}
				const { topic: e, event: s, chainId: i } = t;
				await this.isValidSessionTopic(e);
				const { namespaces: r } = this.client.session.get(e);
				if (!_a(r, i)) {
					const { message: n } = Et$1("MISSING_OR_INVALID", `emit() chainId: ${i}`);
					throw new Error(n);
				}
				if (!Ua(s)) {
					const { message: n } = Et$1("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
					throw new Error(n);
				}
				if (!Ra(r, i, s.name)) {
					const { message: n } = Et$1("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(s)}`);
					throw new Error(n);
				}
			}), c(this, "isValidDisconnect", async (t) => {
				if (!Aa(t)) {
					const { message: s } = Et$1("MISSING_OR_INVALID", `disconnect() params: ${t}`);
					throw new Error(s);
				}
				const { topic: e } = t;
				await this.isValidSessionOrPairingTopic(e);
			}), c(this, "isValidAuthenticate", (t) => {
				const { chains: e, uri: s, domain: i, nonce: r } = t;
				if (!Array.isArray(e) || e.length === 0) throw new Error("chains is required and must be a non-empty array");
				if (!it(s, !1)) throw new Error("uri is required parameter");
				if (!it(i, !1)) throw new Error("domain is required parameter");
				if (!it(r, !1)) throw new Error("nonce is required parameter");
				if ([...new Set(e.map((a) => Fe(a).namespace))].length > 1) throw new Error("Multi-namespace requests are not supported. Please request single namespace only.");
				const { namespace: n } = Fe(e[0]);
				if (n !== "eip155") throw new Error("Only eip155 namespace is supported for authenticated sessions. Please use .connect() for non-eip155 chains.");
			}), c(this, "getVerifyContext", async (t) => {
				const { attestationId: e, hash: s, encryptedId: i, metadata: r, transportType: n } = t, a = { verified: {
					verifyUrl: r.verifyUrl || "https://verify.walletconnect.org",
					validation: "UNKNOWN",
					origin: r.url || ""
				} };
				try {
					if (n === ee.link_mode) {
						const p = this.getAppLinkIfEnabled(r, n);
						return a.verified.validation = p && new URL(p).origin === new URL(r.url).origin ? "VALID" : "INVALID", a;
					}
					const l = await this.client.core.verify.resolve({
						attestationId: e,
						hash: s,
						encryptedId: i,
						verifyUrl: r.verifyUrl
					});
					l && (a.verified.origin = l.origin, a.verified.isScam = l.isScam, a.verified.validation = l.origin === new URL(r.url).origin ? "VALID" : "INVALID");
				} catch (l) {
					this.client.logger.warn(l);
				}
				return this.client.logger.debug(`Verify context: ${JSON.stringify(a)}`), a;
			}), c(this, "validateSessionProps", (t, e) => {
				Object.values(t).forEach((s, i) => {
					if (s == null) {
						const { message: r } = Et$1("MISSING_OR_INVALID", `${e} must contain an existing value for each key. Received: ${s} for key ${Object.keys(t)[i]}`);
						throw new Error(r);
					}
				});
			}), c(this, "getPendingAuthRequest", (t) => {
				const e = this.client.auth.requests.get(t);
				return typeof e == "object" ? e : void 0;
			}), c(this, "addToRecentlyDeleted", (t, e) => {
				if (this.recentlyDeletedMap.set(t, e), this.recentlyDeletedMap.size >= this.recentlyDeletedLimit) {
					let s = 0;
					const i = this.recentlyDeletedLimit / 2;
					for (const r of this.recentlyDeletedMap.keys()) {
						if (s++ >= i) break;
						this.recentlyDeletedMap.delete(r);
					}
				}
			}), c(this, "checkRecentlyDeleted", (t) => {
				const e = this.recentlyDeletedMap.get(t);
				if (e) {
					const { message: s } = Et$1("MISSING_OR_INVALID", `Record was recently deleted - ${e}: ${t}`);
					throw new Error(s);
				}
			}), c(this, "isLinkModeEnabled", (t, e) => {
				var s, i, r, n, a, l, p, h, u;
				return !t || e !== ee.link_mode ? !1 : ((i = (s = this.client.metadata) == null ? void 0 : s.redirect) == null ? void 0 : i.linkMode) === !0 && ((n = (r = this.client.metadata) == null ? void 0 : r.redirect) == null ? void 0 : n.universal) !== void 0 && ((l = (a = this.client.metadata) == null ? void 0 : a.redirect) == null ? void 0 : l.universal) !== "" && ((p = t?.redirect) == null ? void 0 : p.universal) !== void 0 && ((h = t?.redirect) == null ? void 0 : h.universal) !== "" && ((u = t?.redirect) == null ? void 0 : u.linkMode) === !0 && this.client.core.linkModeSupportedApps.includes(t.redirect.universal) && typeof (global == null ? void 0 : global.Linking) < "u";
			}), c(this, "getAppLinkIfEnabled", (t, e) => {
				var s;
				return this.isLinkModeEnabled(t, e) ? (s = t?.redirect) == null ? void 0 : s.universal : void 0;
			}), c(this, "handleLinkModeMessage", ({ url: t }) => {
				if (!t || !t.includes("wc_ev") || !t.includes("topic")) return;
				const e = li(t, "topic") || "", s = decodeURIComponent(li(t, "wc_ev") || ""), i = this.client.session.keys.includes(e);
				i && this.client.session.update(e, { transportType: ee.link_mode }), this.client.core.dispatchEnvelope({
					topic: e,
					message: s,
					sessionExists: i
				});
			}), c(this, "registerLinkModeListeners", async () => {
				var t;
				if (hi() || Bt() && (t = this.client.metadata.redirect) != null && t.linkMode) {
					const e = global == null ? void 0 : global.Linking;
					if (typeof e < "u") {
						e.addEventListener("url", this.handleLinkModeMessage, this.client.name);
						const s = await e.getInitialURL();
						s && setTimeout(() => {
							this.handleLinkModeMessage({ url: s });
						}, 50);
					}
				}
			}), c(this, "getTVFParams", (t, e, s) => {
				var i, r, n;
				if (!((i = e.request) != null && i.method)) return {};
				const a = {
					correlationId: t,
					rpcMethods: [e.request.method],
					chainId: e.chainId
				};
				try {
					a.txHashes = this.extractTxHashesFromResult(e.request, s), a.contractAddresses = this.isValidContractData(e.request.params) ? [(n = (r = e.request.params) == null ? void 0 : r[0]) == null ? void 0 : n.to] : [];
				} catch (l) {
					this.client.logger.warn("Error getting TVF params", l);
				}
				return a;
			}), c(this, "isValidContractData", (t) => {
				var e;
				if (!t) return !1;
				try {
					const s = t?.data || ((e = t?.[0]) == null ? void 0 : e.data);
					if (!s.startsWith("0x")) return !1;
					const i = s.slice(2);
					return /^[0-9a-fA-F]*$/.test(i) ? i.length % 2 === 0 : !1;
				} catch {}
				return !1;
			}), c(this, "extractTxHashesFromResult", (t, e) => {
				var s;
				try {
					if (!e) return [];
					const i = t.method, r = yt[i];
					if (i === "sui_signTransaction") return [ff(e.transactionBytes)];
					if (i === "near_signTransaction") return [cf(e)];
					if (i === "near_signTransactions") return e.map((a) => cf(a));
					if (i === "xrpl_signTransactionFor" || i === "xrpl_signTransaction") return [(s = e.tx_json) == null ? void 0 : s.hash];
					if (i === "polkadot_signTransaction") return [Ka({
						transaction: t.params.transactionPayload,
						signature: e.signature
					})];
					if (i === "algo_signTxn") return me$1(e) ? e.map((a) => af(a)) : [af(e)];
					if (i === "cosmos_signDirect") return [uf(e)];
					if (typeof e == "string") return [e];
					const n = e[r.key];
					if (me$1(n)) return i === "solana_signAllTransactions" ? n.map((a) => sf(a)) : n;
					if (typeof n == "string") return [n];
				} catch (i) {
					this.client.logger.warn("Error extracting tx hashes from result", i);
				}
				return [];
			});
		}
		async processPendingMessageEvents() {
			try {
				const o = this.client.session.keys, t = this.client.core.relayer.messages.getWithoutAck(o);
				for (const [e, s] of Object.entries(t)) for (const i of s) try {
					await this.onProviderMessageEvent({
						topic: e,
						message: i,
						publishedAt: Date.now()
					});
				} catch {
					this.client.logger.warn(`Error processing pending message event for topic: ${e}, message: ${i}`);
				}
			} catch (o) {
				this.client.logger.warn("processPendingMessageEvents failed", o);
			}
		}
		isInitialized() {
			if (!this.initialized) {
				const { message: o } = Et$1("NOT_INITIALIZED", this.name);
				throw new Error(o);
			}
		}
		async confirmOnlineStateOrThrow() {
			await this.client.core.relayer.confirmOnlineStateOrThrow();
		}
		registerRelayerEvents() {
			this.client.core.relayer.on(C.message, (o) => {
				this.onProviderMessageEvent(o);
			});
		}
		async onRelayMessage(o) {
			const { topic: t, message: e, attestation: s, transportType: i } = o, { publicKey: r } = this.client.auth.authKeys.keys.includes(pe) ? this.client.auth.authKeys.get(pe) : {
				responseTopic: void 0,
				publicKey: void 0
			};
			try {
				const n = await this.client.core.crypto.decode(t, e, {
					receiverPublicKey: r,
					encoding: i === ee.link_mode ? De$1 : Qt
				});
				isJsonRpcRequest(n) ? (this.client.core.history.set(t, n), await this.onRelayEventRequest({
					topic: t,
					payload: n,
					attestation: s,
					transportType: i,
					encryptedId: zc(e)
				})) : isJsonRpcResponse(n) ? (await this.client.core.history.resolve(n), await this.onRelayEventResponse({
					topic: t,
					payload: n,
					transportType: i
				}), this.client.core.history.delete(t, n.id)) : await this.onRelayEventUnknownPayload({
					topic: t,
					payload: n,
					transportType: i
				}), await this.client.core.relayer.messages.ack(t, e);
			} catch (n) {
				this.client.logger.error(n);
			}
		}
		registerExpirerEvents() {
			this.client.core.expirer.on(q.expired, async (o) => {
				const { topic: t, id: e } = si(o.target);
				if (e && this.client.pendingRequest.keys.includes(e)) return await this.deletePendingSessionRequest(e, Et$1("EXPIRED"), !0);
				if (e && this.client.auth.requests.keys.includes(e)) return await this.deletePendingAuthRequest(e, Et$1("EXPIRED"), !0);
				t ? this.client.session.keys.includes(t) && (await this.deleteSession({
					topic: t,
					expirerHasDeleted: !0
				}), this.client.events.emit("session_expire", { topic: t })) : e && (await this.deleteProposal(e, !0), this.client.events.emit("proposal_expire", { id: e }));
			});
		}
		registerPairingEvents() {
			this.client.core.pairing.events.on(ae.create, (o) => this.onPairingCreated(o)), this.client.core.pairing.events.on(ae.delete, (o) => {
				this.addToRecentlyDeleted(o.topic, "pairing");
			});
		}
		isValidPairingTopic(o) {
			if (!it(o, !1)) {
				const { message: t } = Et$1("MISSING_OR_INVALID", `pairing topic should be a string: ${o}`);
				throw new Error(t);
			}
			if (!this.client.core.pairing.pairings.keys.includes(o)) {
				const { message: t } = Et$1("NO_MATCHING_KEY", `pairing topic doesn't exist: ${o}`);
				throw new Error(t);
			}
			if (fi(this.client.core.pairing.pairings.get(o).expiry)) {
				const { message: t } = Et$1("EXPIRED", `pairing topic: ${o}`);
				throw new Error(t);
			}
		}
		async isValidSessionTopic(o) {
			if (!it(o, !1)) {
				const { message: t } = Et$1("MISSING_OR_INVALID", `session topic should be a string: ${o}`);
				throw new Error(t);
			}
			if (this.checkRecentlyDeleted(o), !this.client.session.keys.includes(o)) {
				const { message: t } = Et$1("NO_MATCHING_KEY", `session topic doesn't exist: ${o}`);
				throw new Error(t);
			}
			if (fi(this.client.session.get(o).expiry)) {
				await this.deleteSession({ topic: o });
				const { message: t } = Et$1("EXPIRED", `session topic: ${o}`);
				throw new Error(t);
			}
			if (!this.client.core.crypto.keychain.has(o)) {
				const { message: t } = Et$1("MISSING_OR_INVALID", `session topic does not exist in keychain: ${o}`);
				throw await this.deleteSession({ topic: o }), new Error(t);
			}
		}
		async isValidSessionOrPairingTopic(o) {
			if (this.checkRecentlyDeleted(o), this.client.session.keys.includes(o)) await this.isValidSessionTopic(o);
			else if (this.client.core.pairing.pairings.keys.includes(o)) this.isValidPairingTopic(o);
			else if (it(o, !1)) {
				const { message: t } = Et$1("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${o}`);
				throw new Error(t);
			} else {
				const { message: t } = Et$1("MISSING_OR_INVALID", `session or pairing topic should be a string: ${o}`);
				throw new Error(t);
			}
		}
		async isValidProposalId(o) {
			if (!Ia(o)) {
				const { message: t } = Et$1("MISSING_OR_INVALID", `proposal id should be a number: ${o}`);
				throw new Error(t);
			}
			if (!this.client.proposal.keys.includes(o)) {
				const { message: t } = Et$1("NO_MATCHING_KEY", `proposal id doesn't exist: ${o}`);
				throw new Error(t);
			}
			if (fi(this.client.proposal.get(o).expiryTimestamp)) {
				await this.deleteProposal(o);
				const { message: t } = Et$1("EXPIRED", `proposal id: ${o}`);
				throw new Error(t);
			}
		}
	};
	ks = class extends Ui {
		constructor(o, t) {
			super(o, t, dt, we), this.core = o, this.logger = t;
		}
	};
	It = class extends Ui {
		constructor(o, t) {
			super(o, t, ut, we), this.core = o, this.logger = t;
		}
	};
	Ds = class extends Ui {
		constructor(o, t) {
			super(o, t, wt, we, (e) => e.id), this.core = o, this.logger = t;
		}
	};
	Ls = class extends Ui {
		constructor(o, t) {
			super(o, t, Et, le, () => pe), this.core = o, this.logger = t;
		}
	};
	Ms = class extends Ui {
		constructor(o, t) {
			super(o, t, St, le), this.core = o, this.logger = t;
		}
	};
	$s = class extends Ui {
		constructor(o, t) {
			super(o, t, Rt, le, (e) => e.id), this.core = o, this.logger = t;
		}
	};
	Ks = Object.defineProperty, Us = (E, o, t) => o in E ? Ks(E, o, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : E[o] = t, Ke = (E, o, t) => Us(E, typeof o != "symbol" ? o + "" : o, t);
	Gs = class {
		constructor(o, t) {
			this.core = o, this.logger = t, Ke(this, "authKeys"), Ke(this, "pairingTopics"), Ke(this, "requests"), this.authKeys = new Ls(this.core, this.logger), this.pairingTopics = new Ms(this.core, this.logger), this.requests = new $s(this.core, this.logger);
		}
		async init() {
			await this.authKeys.init(), await this.pairingTopics.init(), await this.requests.init();
		}
	};
	js = Object.defineProperty, Fs = (E, o, t) => o in E ? js(E, o, {
		enumerable: !0,
		configurable: !0,
		writable: !0,
		value: t
	}) : E[o] = t, f = (E, o, t) => Fs(E, typeof o != "symbol" ? o + "" : o, t);
	fe = class fe extends J {
		constructor(o) {
			super(o), f(this, "protocol", "wc"), f(this, "version", 2), f(this, "name", me.name), f(this, "metadata"), f(this, "core"), f(this, "logger"), f(this, "events", new EventEmitter()), f(this, "engine"), f(this, "session"), f(this, "proposal"), f(this, "pendingRequest"), f(this, "auth"), f(this, "signConfig"), f(this, "on", (e, s) => this.events.on(e, s)), f(this, "once", (e, s) => this.events.once(e, s)), f(this, "off", (e, s) => this.events.off(e, s)), f(this, "removeListener", (e, s) => this.events.removeListener(e, s)), f(this, "removeAllListeners", (e) => this.events.removeAllListeners(e)), f(this, "connect", async (e) => {
				try {
					return await this.engine.connect(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "pair", async (e) => {
				try {
					return await this.engine.pair(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "approve", async (e) => {
				try {
					return await this.engine.approve(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "reject", async (e) => {
				try {
					return await this.engine.reject(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "update", async (e) => {
				try {
					return await this.engine.update(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "extend", async (e) => {
				try {
					return await this.engine.extend(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "request", async (e) => {
				try {
					return await this.engine.request(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "respond", async (e) => {
				try {
					return await this.engine.respond(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "ping", async (e) => {
				try {
					return await this.engine.ping(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "emit", async (e) => {
				try {
					return await this.engine.emit(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "disconnect", async (e) => {
				try {
					return await this.engine.disconnect(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "find", (e) => {
				try {
					return this.engine.find(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "getPendingSessionRequests", () => {
				try {
					return this.engine.getPendingSessionRequests();
				} catch (e) {
					throw this.logger.error(e.message), e;
				}
			}), f(this, "authenticate", async (e, s) => {
				try {
					return await this.engine.authenticate(e, s);
				} catch (i) {
					throw this.logger.error(i.message), i;
				}
			}), f(this, "formatAuthMessage", (e) => {
				try {
					return this.engine.formatAuthMessage(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "approveSessionAuthenticate", async (e) => {
				try {
					return await this.engine.approveSessionAuthenticate(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), f(this, "rejectSessionAuthenticate", async (e) => {
				try {
					return await this.engine.rejectSessionAuthenticate(e);
				} catch (s) {
					throw this.logger.error(s.message), s;
				}
			}), this.name = o?.name || me.name, this.metadata = Ks$1(o?.metadata), this.signConfig = o?.signConfig;
			const t = typeof o?.logger < "u" && typeof o?.logger != "string" ? o.logger : (0, import_pino.default)(k({ level: o?.logger || me.logger }));
			this.core = o?.core || new ta(o), this.logger = E(t, this.name), this.session = new It(this.core, this.logger), this.proposal = new ks(this.core, this.logger), this.pendingRequest = new Ds(this.core, this.logger), this.engine = new Cs(this), this.auth = new Gs(this.core, this.logger);
		}
		static async init(o) {
			const t = new fe(o);
			return await t.initialize(), t;
		}
		get context() {
			return y(this.logger);
		}
		get pairing() {
			return this.core.pairing.pairings;
		}
		async initialize() {
			this.logger.trace("Initialized");
			try {
				await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.auth.init(), await this.engine.init(), this.logger.info("SignClient Initialization Success");
			} catch (o) {
				throw this.logger.info("SignClient Initialization Failure"), this.logger.error(o.message), o;
			}
		}
	};
	Qs = It, Hs = fe;
}));
//#endregion
export { index_es_exports as n, init_index_es as r, Hs as t };
