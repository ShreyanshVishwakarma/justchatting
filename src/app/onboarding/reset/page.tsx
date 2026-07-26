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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/db";
import {
  clearLocalEncryptionData,
  createKeyDerivationParams,
  downloadRecoveryKit,
  encryptPrivateKeyWithPassphrase,
  generateAndStoreUserKeys,
} from "@/lib/cryptoService";

const normalizePhrase = (phrase: string) =>
  phrase.trim().toLowerCase().split(/\s+/).join(" ");

export default function ResetEncryptionPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const me = useQuery(api.user.getMe);
  const resetEncryptionIdentity = useMutation(api.keys.resetEncryptionIdentity);

  const [seedPhrase, setSeedPhrase] = useState("");
  const [confirmPhrase, setConfirmPhrase] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [downloadKit, setDownloadKit] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!seedPhrase) {
      setSeedPhrase(generateMnemonic(wordlist));
    }
  }, [seedPhrase]);

  const normalizedSeed = useMemo(
    () => normalizePhrase(seedPhrase),
    [seedPhrase],
  );

  const handleRegenerate = () => {
    setSeedPhrase(generateMnemonic(wordlist));
    setConfirmPhrase("");
    setError("");
  };

  const handleReset = async () => {
    if (!me?._id) {
      setError("User not available yet. Please try again.");
      return;
    }
    if (normalizePhrase(confirmPhrase) !== normalizedSeed) {
      setError("Seed phrase confirmation does not match.");
      return;
    }
    if (confirmation !== "RESET") {
      setError('Type "RESET" to confirm this irreversible action.');
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // A fresh local key is required; this also removes cached plaintext from
      // conversations encrypted with the lost identity.
      await clearLocalEncryptionData();
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

      await resetEncryptionIdentity({
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

      router.replace("/conversations");
    } catch (err) {
      console.error(err);
      setError(
        "Reset could not be completed. Your old messages remain inaccessible; try again to finish creating your new identity.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card
        className="w-full max-w-2xl border-[3px] border-destructive shadow-[6px_6px_0px_0px_#ff4d4d]"
        style={{ borderRadius: "var(--radius-wobbly)" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl font-[family-name:var(--font-kalam)] text-destructive">
            Start over with a new encryption identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-[family-name:var(--font-patrick-hand)] text-lg">
            This cannot restore chats encrypted with your lost seed phrase. It
            removes this account from existing chats and friendships, deletes
            this device&apos;s cached chat history, and creates a new identity.
          </p>

          <Textarea
            value={normalizedSeed}
            readOnly
            className="min-h-[120px] text-base font-[family-name:var(--font-patrick-hand)]"
          />

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleRegenerate}>
              Generate another phrase
            </Button>
          </div>

          <label className="flex items-start gap-3 rounded border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={downloadKit}
              onChange={(event) => setDownloadKit(event.target.checked)}
              className="mt-1"
            />
            <span>
              Download a recovery kit after reset. It contains the new seed
              phrase and encrypted private-key backup, so store it offline and
              never share it.
            </span>
          </label>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Re-enter the new seed phrase:
            </p>
            <Input
              value={confirmPhrase}
              onChange={(event) => setConfirmPhrase(event.target.value)}
              placeholder="Type the phrase exactly"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Type <strong>RESET</strong> to permanently start over:
            </p>
            <Input
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              placeholder="RESET"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating new identity..." : "Erase old access & start over"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
