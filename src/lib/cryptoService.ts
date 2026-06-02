import { generateAndStoreKeys } from "./generateKeys";
import { db } from "./db";

export type KeyDerivationParams = {
  salt: string;
  iv: string;
  iterations: number;
  kdf: "pbkdf2";
  hash: "SHA-256";
};

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

// Imports a raw Base64 public key string into a usable WebCrypto CryptoKey object
// used to import the other user's public key from the server
export async function importPublicKey(base64Key: string): Promise<CryptoKey> {
  const arrayBuffer = base64ToArrayBuffer(base64Key);
  return await window.crypto.subtle.importKey(
    "spki",
    arrayBuffer,
    { name: "ECDH", namedCurve: "P-256" },
    true,
    [], // Public keys don't need explicit usage flags for derivation parameters
  );
}

// derive a key from passphrase using pbkdf2
export async function deriveKeyFromPassphrase(
  passphrase: string,
  saltBase64: string,
  iterations: number,
  hash: "SHA-256",
): Promise<CryptoKey> {
  const enc = new TextEncoder();

  // 1) Import passphrase as key material
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  // 2) Derive an AES-GCM key from the key material
  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: base64ToArrayBuffer(saltBase64),
      iterations,
      hash,
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export function createKeyDerivationParams(
  iterations = 310000,
): KeyDerivationParams {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  return {
    salt: arrayBufferToBase64(salt.buffer),
    iv: arrayBufferToBase64(iv.buffer),
    iterations,
    kdf: "pbkdf2",
    hash: "SHA-256",
  };
}

export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  return arrayBufferToBase64(pkcs8);
}

export async function importPrivateKey(
  pkcs8Base64: string,
): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(pkcs8Base64),
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveKey", "deriveBits"],
  );
}

export async function encryptPrivateKeyWithPassphrase(
  privateKey: CryptoKey,
  passphrase: string,
  params: KeyDerivationParams,
): Promise<string> {
  const derivedKey = await deriveKeyFromPassphrase(
    passphrase,
    params.salt,
    params.iterations,
    params.hash,
  );

  const iv = new Uint8Array(base64ToArrayBuffer(params.iv));
  const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", privateKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    pkcs8,
  );

  return arrayBufferToBase64(encrypted);
}

export async function decryptPrivateKeyWithPassphrase(
  encryptedPrivateKeyBase64: string,
  passphrase: string,
  params: KeyDerivationParams,
): Promise<CryptoKey> {
  const derivedKey = await deriveKeyFromPassphrase(
    passphrase,
    params.salt,
    params.iterations,
    params.hash,
  );

  const iv = new Uint8Array(base64ToArrayBuffer(params.iv));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    base64ToArrayBuffer(encryptedPrivateKeyBase64),
  );

  return importPrivateKey(arrayBufferToBase64(decrypted));
}

// derives the shared AES-GCM key using your local private key and the recipient's public key

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
