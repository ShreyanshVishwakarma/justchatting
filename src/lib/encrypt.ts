import { arrayBufferToBase64, getSharedSecret } from "@/lib/cryptoService";

/**
 * Encrypts a plaintext string into a ciphertext string + initialization vector (IV)
 */
export async function encryptMessage(
  message: string,
  recipientPublicKeyBase64: string,
): Promise<{ encryptedBlob: string; iv: string }> {
  const sharedSecret = await getSharedSecret(recipientPublicKeyBase64);

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // generate random IV

  const encoder = new TextEncoder(); // utf encoder Uint8Array(10)
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    sharedSecret,
    encoder.encode(message),
  );
  // ciphertext is an ArrayBuffer, but iv is a Uint8Array; convert to its underlying ArrayBuffer
  return {
    encryptedBlob: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
  };
}
