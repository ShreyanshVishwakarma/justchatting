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
        const localKeyMatchesCloud =
          !!localKeyRecord && localKeyRecord.publicKeyBase64 === me.publicKey;

        if (!hasCloudKey && !hasLocalKeys) {
          setCryptoStatus("needs_setup");
        } else if (hasCloudKey && !hasLocalKeys) {
          setCryptoStatus("needs_recovery");
        } else if (hasCloudKey && hasLocalKeys && localKeyMatchesCloud) {
          setCryptoStatus("ready");
        } else if (hasCloudKey && hasLocalKeys) {
          // IndexedDB is shared by browser profiles, so a key from another
          // account/device must never be used for this account's ciphertext.
          await db.transaction("rw", db.cryptoKey, db.messages, async () => {
            await db.cryptoKey.clear();
            await db.messages.clear();
          });
          setCryptoStatus("needs_recovery");
        } else {
          console.warn(
            "Cryptographic desync detected. Purging local orphans...",
          );
          await db.transaction("rw", db.cryptoKey, db.messages, async () => {
            await db.cryptoKey.clear();
            await db.messages.clear();
          });
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
