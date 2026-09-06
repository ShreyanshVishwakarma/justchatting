"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/db";
import {
  createKeyDerivationParams,
  downloadRecoveryKit,
  encryptPrivateKeyWithPassphrase,
  generateAndStoreUserKeys,
} from "@/lib/cryptoService";
import { useUserOnboarding } from "@/hooks/useUserOnboarding";
import { Copy, Dices, KeyRound } from "lucide-react";
import { DoodleTag, JustchatLockup } from "@/components/brand";

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
  const [downloadKit, setDownloadKit] = useState(false);

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

      if (downloadKit) {
        downloadRecoveryKit({
          version: 1,
          createdAt: new Date().toISOString(),
          seedPhrase: normalizedSeed,
          publicKey,
          encryptedPrivateKey,
          keyDerivation,
        });
      }

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
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl -rotate-[0.4deg] border-[3px] border-border bg-white p-6 shadow-[8px_8px_0px_0px_#2d2d2d] sm:p-8" style={{ borderRadius: "255px 18px 225px 18px / 18px 225px 18px 255px" }}>
        <span aria-hidden="true" className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[-5deg] border-x-2 border-dashed border-[#2d2d2d]/20 bg-[#2d2d2d]/10" />
        <JustchatLockup size={34} showTagline />
        <div className="mt-4">
          <DoodleTag>🔑 step 1 of 1 — your keys</DoodleTag>
          <h1 className="mt-2 font-[family-name:var(--font-kalam)] text-4xl font-bold leading-none">
            save your seed doodle
          </h1>
          <p className="mt-2 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/65">
            this 12-word phrase unlocks your justchat identity on new devices.
            lose it and we can&apos;t recover your chats — that&apos;s the deal.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <Textarea
            value={normalizedSeed}
            readOnly
            aria-label="seed phrase"
            className="min-h-[110px] bg-[#fdf8c1]/60 font-mono !text-base"
          />

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="size-4" /> copy phrase
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleRegenerate}>
              <Dices className="size-4" /> doodle another
            </Button>
          </div>

          <label className="flex cursor-pointer items-start gap-3 border-2 border-dashed border-border/50 bg-[#fdfbf7] p-3 font-[family-name:var(--font-patrick-hand)] text-lg" style={{ borderRadius: "20px 255px 15px 225px / 255px 15px 225px 15px" }}>
            <input
              type="checkbox"
              checked={downloadKit}
              onChange={(event) => setDownloadKit(event.target.checked)}
              className="mt-1.5 size-4 accent-[#ff4d4d]"
            />
            <span>
              download a recovery kit after setup — seed + encrypted backup for
              offline safekeeping. never share it.
            </span>
          </label>

          <div className="space-y-2">
            <p className="flex items-center gap-1.5 font-[family-name:var(--font-patrick-hand)] text-lg text-foreground/70">
              <KeyRound className="size-4" /> re-type the phrase to prove you saved it:
            </p>
            <Input
              value={confirmPhrase}
              onChange={(e) => setConfirmPhrase(e.target.value)}
              placeholder="type the 12 words exactly…"
              className="h-12 bg-[#fdfbf7]"
            />
          </div>

          {error && (
            <p className="border-2 border-[#ff4d4d] bg-[#ff4d4d]/10 px-3 py-2 font-[family-name:var(--font-patrick-hand)] text-lg text-[#ff4d4d]" style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}>
              ✎ {error}
            </p>
          )}

          <Button onClick={handleSetup} disabled={isSubmitting} className="w-full !bg-[#ff4d4d] !text-white hover:!bg-[#2d2d2d]">
            {isSubmitting ? "drawing your keys…" : "confirm & start chatting 🎉"}
          </Button>
        </div>
      </div>
    </div>
  );
}
