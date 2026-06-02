import { db } from "./db";

export interface LocalKeyRecord {
  id: "me";
  privateKey: CryptoKey;
  publicKeyBase64: string;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

export async function generateAndStoreKeys(): Promise<string> {
  const existingKeys = await db.cryptoKey.get("me");
  if (existingKeys) {
    return (existingKeys as LocalKeyRecord).publicKeyBase64;
  }

  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Key generation is only available in the browser");
  }

  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDH",
      namedCurve: "P-256",
    },
    true,
    ["deriveKey", "deriveBits"],
  );

  const publicKeyBuffer: ArrayBuffer = await window.crypto.subtle.exportKey(
    "spki", // standard public key infraformat
    keyPair.publicKey,
  );
  const keyRecord: LocalKeyRecord = {
    id: "me",
    privateKey: keyPair.privateKey,
    publicKeyBase64: arrayBufferToBase64(publicKeyBuffer),
  };

  await db.cryptoKey.put(keyRecord);

  return keyRecord.publicKeyBase64;
}
