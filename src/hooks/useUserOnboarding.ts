import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { db } from "@/lib/db";

export type CryptoStatus =
  | "loading"
  | "ready"
  | "needs_setup"
  | "needs_recovery";

export function useUserOnboarding(isAuthenticated: boolean): CryptoStatus {
  const [cryptoStatus, setCryptoStatus] = useState<CryptoStatus>("loading");
  const me = useQuery(api.user.getMe);

  useEffect(() => {
    const checkCryptoState = async () => {
      if (!isAuthenticated || !me) {
        setCryptoStatus("loading");
        return;
      }

      try {
        const localKeyRecord = await db.cryptoKey.get("me");
        const hasLocalKeys = !!localKeyRecord;
        const hasCloudKey = !!me.publicKey;

        if (!hasCloudKey && !hasLocalKeys) {
          setCryptoStatus("needs_setup");
        } else if (hasCloudKey && !hasLocalKeys) {
          setCryptoStatus("needs_recovery");
        } else if (hasCloudKey && hasLocalKeys) {
          setCryptoStatus("ready");
        } else {
          console.warn(
            "Cryptographic desync detected. Purging local orphans...",
          );
          await db.cryptoKey.delete("me");
          setCryptoStatus("needs_setup");
        }
      } catch (error) {
        console.error(
          "Failed to evaluate cryptographic storage health:",
          error,
        );
      }
    };

    checkCryptoState();
  }, [isAuthenticated, me]);

  return cryptoStatus;
}
