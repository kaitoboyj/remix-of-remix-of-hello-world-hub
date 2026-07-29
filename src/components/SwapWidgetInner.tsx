import { useEffect, useMemo } from "react";
import { createThirdwebClient } from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { BridgeWidget, ThirdwebProvider, useConnect } from "thirdweb/react";
import { privateKeyToAccount, createWalletAdapter } from "thirdweb/wallets";

// Polyfill WebSocket for Node.js environments (Netlify)
if (typeof WebSocket === "undefined") {
  global.WebSocket = require("ws") as any;
}

interface InnerProps {
  clientId: string;
  privateKey: string;
  address: string;
  onSuccess?: (data: unknown) => void;
  onError?: (message: string) => void;
}

export function SwapWidgetInner(props: InnerProps) {
  return (
    <ThirdwebProvider>
      <Bridge {...props} />
    </ThirdwebProvider>
  );
}

function Bridge({ clientId, privateKey, onSuccess, onError }: InnerProps) {
  const client = useMemo(() => {
    // Configure thirdweb client with custom transport for Node.js environments
    const clientConfig: any = { clientId };
    
    // Add custom transport for Node.js environments
    if (typeof window === "undefined" && typeof WebSocket !== "undefined") {
      clientConfig.transport = require("ws");
    }
    
    return createThirdwebClient(clientConfig);
  }, [clientId]);
  const { connect } = useConnect();

  useEffect(() => {
    let cancelled = false;
    void connect(async () => {
      const account = privateKeyToAccount({ client, privateKey });
      const wallet = createWalletAdapter({
        client,
        adaptedAccount: account,
        chain: ethereum,
        onDisconnect: () => {},
        switchChain: async () => {},
      });
      if (cancelled) throw new Error("cancelled");
      return wallet;
    }).catch((e) => onError?.(e instanceof Error ? e.message : String(e)));
    return () => {
      cancelled = true;
    };
  }, [client, privateKey, connect, onError]);

  return (
    <div className="flex justify-center">
      <BridgeWidget
        client={client}
        theme="dark"
        swap={{
          onSuccess: (data) => onSuccess?.({ kind: "swap", quote: data.quote?.originAmount?.toString?.() }),
          onError: (e) => onError?.(e.message),
        }}
      />
    </div>
  );
}
