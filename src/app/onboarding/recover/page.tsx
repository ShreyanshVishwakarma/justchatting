"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import {
  decryptPrivateKeyWithPassphrase,
  KeyDerivationParams,
} from "@/lib/cryptoService";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

const normalizePhrase = (phrase: string) =>
  phrase.trim().toLowerCase().split(/\s+/).join(" ");

export default function OnboardingRecoverPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const me = useQuery(api.user.getMe);
  const keyBundle = useQuery(api.keys.getUserKeys);
  const cryptoStatus = useUserOnboarding(Boolean(isSignedIn));

  const [seedPhrase, setSeedPhrase] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isSignedIn) return;
    if (cryptoStatus === "needs_setup") {
      router.push("/onboarding/setup");
    }
    if (cryptoStatus === "ready") {
      router.push("/conversations");
    }
  }, [cryptoStatus, isSignedIn, router]);

  const normalizedSeed = useMemo(
    () => normalizePhrase(seedPhrase),
    [seedPhrase],
  );

  const handleRecover = async () => {
    if (!me?.publicKey) {
      setError("Public key not available yet.");
      return;
    }
    if (!keyBundle) {
      setError("Encrypted keys not found for this account.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const keyDerivation = keyBundle.keyDerivation as KeyDerivationParams;
      const privateKey = await decryptPrivateKeyWithPassphrase(
        keyBundle.encryptedPrivateKey,
        normalizedSeed,
        keyDerivation,
      );

      await db.cryptoKey.put({
        id: "me",
        privateKey,
        publicKeyBase64: me.publicKey,
      });

      router.push("/conversations");
    } catch (err) {
      console.error(err);
      setError("Invalid seed phrase. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card
        className="w-full max-w-xl border-[3px] border-border shadow-[6px_6px_0px_0px_#2d2d2d]"
        style={{ borderRadius: "var(--radius-wobbly)" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-[family-name:var(--font-kalam)]">
            Recover your keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-[family-name:var(--font-patrick-hand)] text-lg">
            Enter your seed phrase to unlock your identity on this device.
          </p>

          <Textarea
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Enter your seed phrase"
            className="min-h-[120px] text-base font-[family-name:var(--font-patrick-hand)]"
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            onClick={handleRecover}
            disabled={isSubmitting || !normalizedSeed || !keyBundle}
            className="w-full"
          >
            {isSubmitting ? "Recovering..." : "Recover & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
