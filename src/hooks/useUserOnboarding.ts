import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { generateAndStoreUserKeys } from "@/lib/cryptoService";

export function useUserOnboarding(isAuthenticated: boolean) {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const syncPublicKeyToCloud = useMutation(api.user.updatePublicKey);

  useEffect(() => {
    const runOnboardingSetup = async () => {
      if (!isAuthenticated || isOnboarded) return;

      try {
        console.log("🔒 Initializing device cryptography keys...");

        // 1) Generate keys locally (or load existing ones from Dexie)
        const publicKeyBase64 = await generateAndStoreUserKeys();

        // 2) Publish public key string to Convex cloud database
        await syncPublicKeyToCloud({ publicKey: publicKeyBase64 });

        console.log("🚀 Device identity initialized and shared successfully.");
        setIsOnboarded(true);
      } catch (error) {
        console.error("❌ Onboarding Cryptography Setup Failed:", error);
      }
    };

    runOnboardingSetup();
  }, [isAuthenticated, isOnboarded, syncPublicKeyToCloud]);

  return isOnboarded;
}
