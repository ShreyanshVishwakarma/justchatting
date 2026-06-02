"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import {
  createKeyDerivationParams,
  encryptPrivateKeyWithPassphrase,
  generateAndStoreUserKeys,
} from "@/lib/cryptoService";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";

const normalizePhrase = (phrase: string) =>
  phrase.trim().toLowerCase().split(/\s+/).join(" ");

export default function OnboardingSetupPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const me = useQuery(api.user.getMe);
  const updateEncryptedKeys = useMutation(api.keys.updateEncryptedKeys);
  const cryptoStatus = useUserOnboarding(Boolean(isSignedIn));

  const [seedPhrase, setSeedPhrase] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!seedPhrase) {
      setSeedPhrase(generateMnemonic(wordlist));
    }
  }, [seedPhrase]);

  useEffect(() => {
    if (!isSignedIn) return;
    if (cryptoStatus === "needs_recovery") {
      router.push("/onboarding/recover");
    }
    if (cryptoStatus === "ready") {
      router.push("/conversations");
    }
  }, [cryptoStatus, isSignedIn, router]);

  const normalizedSeed = useMemo(
    () => normalizePhrase(seedPhrase),
    [seedPhrase],
  );

  const handleRegenerate = () => {
    setSeedPhrase(generateMnemonic(wordlist));
    setConfirmPhrase("");
    setError("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(normalizedSeed);
  };

  const handleSetup = async () => {
    if (!me?._id) {
      setError("User not available yet. Please try again.");
      return;
    }

    const normalizedConfirm = normalizePhrase(confirmPhrase);
    if (!normalizedSeed || normalizedConfirm !== normalizedSeed) {
      setError("Seed phrase confirmation does not match.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const publicKey = await generateAndStoreUserKeys();
      const localKeyRecord = await db.cryptoKey.get("me");
      if (!localKeyRecord) {
        throw new Error("Local key generation failed");
      }

      const keyDerivation = createKeyDerivationParams();
      const encryptedPrivateKey = await encryptPrivateKeyWithPassphrase(
        localKeyRecord.privateKey,
        normalizedSeed,
        keyDerivation,
      );

      await updateEncryptedKeys({
        userId: me._id,
        encryptedKeys: encryptedPrivateKey,
        publicKey,
        keyDerivation,
      });

      router.push("/conversations");
    } catch (err) {
      console.error(err);
      setError("Setup failed. Please try again.");
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
        className="w-full max-w-2xl border-[3px] border-border shadow-[6px_6px_0px_0px_#2d2d2d]"
        style={{ borderRadius: "var(--radius-wobbly)" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-[family-name:var(--font-kalam)]">
            Save your seed phrase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-[family-name:var(--font-patrick-hand)] text-lg">
            This phrase unlocks your identity on new devices. If you lose it, we
            can’t recover your messages.
          </p>

          <Textarea
            value={normalizedSeed}
            readOnly
            className="min-h-[120px] text-base font-[family-name:var(--font-patrick-hand)]"
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCopy}>
              Copy phrase
            </Button>
            <Button type="button" variant="ghost" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Re-enter your seed phrase to confirm:
            </p>
            <Input
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="Type the phrase exactly"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            onClick={handleSetup}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Setting up..." : "Confirm & Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
