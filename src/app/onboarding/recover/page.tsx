"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import {
  decryptPrivateKeyWithPassphrase,
  getPublicKeyFromPrivateKey,
  KeyDerivationParams,
} from "@/lib/cryptoService";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { DoodleTag, JustchatLockup } from "@/components/brand";

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

      const recoveredPublicKey = await getPublicKeyFromPrivateKey(privateKey);
      if (recoveredPublicKey !== me.publicKey) {
        throw new Error("Recovery key does not match this account");
      }

      await db.cryptoKey.put({
        id: "me",
        privateKey,
        publicKeyBase64: recoveredPublicKey,
      });

      router.push("/conversations");
    } catch (err) {
      console.error(err);
      setError(
        "This seed phrase does not match the current encryption identity for this account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-xl rotate-[0.4deg] border-[3px] border-border bg-white p-6 shadow-[8px_8px_0px_0px_#2d2d2d] sm:p-8" style={{ borderRadius: "20px 255px 18px 225px / 255px 18px 225px 18px" }}>
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[4deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#2d5da1]/15" />
        <JustchatLockup size={34} showTagline />
        <div className="mt-4">
          <DoodleTag color="blue">🔓 welcome back!</DoodleTag>
          <h1 className="mt-2 font-[family-name:var(--font-kalam)] text-4xl font-bold leading-none">
            recover your keys
          </h1>
          <p className="mt-2 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/65">
            type your 12-word seed doodle to unlock justchat on this device.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <Textarea
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="pencil comet teacup giraffe louder blanket rocket marble noodle lantern pickle sunset…"
            aria-label="seed phrase"
            className="min-h-[110px] bg-[#fdfbf7]"
          />

          {error && (
            <p className="border-2 border-[#ff4d4d] bg-[#ff4d4d]/10 px-3 py-2 font-[family-name:var(--font-patrick-hand)] text-lg text-[#ff4d4d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              ✎ {error}
            </p>
          )}

          <Button
            onClick={handleRecover}
            disabled={isSubmitting || !normalizedSeed || !keyBundle}
            className="w-full"
          >
            {isSubmitting ? "unlocking…" : "recover & keep chatting 🔓"}
          </Button>

          <div className="border-t-2 border-dashed border-border/40 pt-4">
            <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/60">
              lost your doodle? old chats can&apos;t come back — but you can
              start fresh with a brand-new identity.
            </p>
            <Button variant="destructive" asChild className="mt-2">
              <Link href="/onboarding/reset">i lost it — start over</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
