import { base64ToArrayBuffer, getSharedSecret } from "@/lib/cryptoService";

/*
  Decrypts an incoming encrypted message string back to regular plaintext
*/

export async function decryptMessage(
  encryptedBlob: string,
  ivBase64: string,
  senderPublicKeyBase64: string,
): Promise<string> {
  try {
    const sharedKey = await getSharedSecret(senderPublicKeyBase64);
    const iv = new Uint8Array(base64ToArrayBuffer(ivBase64));
    const encryptedData = base64ToArrayBuffer(encryptedBlob);

    const decryptedBuffer: ArrayBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      sharedKey,
      encryptedData,
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Failed to decrypt message payload:", error);
    return "🔒 [Undecryptable Message - Missing or mismatched keys]";
  }
}
