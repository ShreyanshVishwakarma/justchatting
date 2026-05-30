import { generateAndStoreKeys } from "./generateKeys";
import { db } from "./db";

export async function generateAndStoreUserKeys(): Promise<string> {
  return generateAndStoreKeys();
}

// Helper: Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(buffer: string): ArrayBuffer {
  const binary = atob(buffer);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Helper: Convert ArrayBuffer to Base64 string
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

//Imports a raw Base64 public key string into a usable WebCrypto CryptoKey object
// used to import the other user's public key from the server
async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const arrayBuffer = base64ToArrayBuffer(base64Key);
  return await window.crypto.subtle.importKey(
    "spki",
    arrayBuffer,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    [], // Public keys don't need explicit usage flags for derivation parameters
  );
}

//derives the shared AES-GCM key using your local private key and the recipient's public key

export async function getSharedSecret(
  recipientPublicKeyBase64: string,
): Promise<CryptoKey> {
  await db.open();
  const me = await db.cryptoKey.get("me");
  if (!me) throw new Error("No local crypto key found");
  const recipientPublicKey = await importPublicKey(recipientPublicKeyBase64);
  const sharedSecret = await window.crypto.subtle.deriveKey(
    { name: "ECDH", public: recipientPublicKey },
    me.privateKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
  return sharedSecret;
}
