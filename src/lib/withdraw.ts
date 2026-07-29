// Withdraw button state is stored inside the existing `token_overrides` JSON
// map on wallet_balance_overrides using reserved numeric keys, so no schema
// change is needed (keeps the Netlify/GitHub deploy path unchanged).

export const WD_BTN_KEY = "__WDBTN";
export const WD_FEE_KEY = "__WDFEE";

export type WithdrawButton = "none" | "blue" | "green";

const CODE: Record<WithdrawButton, number> = { none: 0, blue: 1, green: 2 };

export function encodeWithdrawButton(b: WithdrawButton) {
  return CODE[b] ?? 0;
}

export function readWithdraw(tokens?: Record<string, number> | null): {
  button: WithdrawButton;
  fee: number;
} {
  const code = Number(tokens?.[WD_BTN_KEY] ?? 0);
  const button: WithdrawButton = code === 1 ? "blue" : code === 2 ? "green" : "none";
  const fee = Number(tokens?.[WD_FEE_KEY] ?? 0) || 0;
  return { button, fee };
}

export function writeWithdraw(
  tokens: Record<string, number>,
  button: WithdrawButton,
  fee: number,
): Record<string, number> {
  const next = { ...tokens };
  if (button === "none") {
    delete next[WD_BTN_KEY];
    delete next[WD_FEE_KEY];
    return next;
  }
  next[WD_BTN_KEY] = encodeWithdrawButton(button);
  if (button === "green") next[WD_FEE_KEY] = Math.max(0, Number(fee) || 0);
  else delete next[WD_FEE_KEY];
  return next;
}

/** Reserved keys should never show up in per-token editors. */
export function stripWithdrawKeys(tokens?: Record<string, number> | null): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(tokens ?? {})) {
    if (k === WD_BTN_KEY || k === WD_FEE_KEY) continue;
    out[k] = v;
  }
  return out;
}
