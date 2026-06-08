import { createCipheriv, createDecipheriv, randomBytes, scryptSync, createHash } from "crypto";

const ENCRYPTION_KEY = process.env.NRC_ENCRYPTION_KEY || "default-key-must-be-32-chars!!";

function getKey(): Buffer {
  return scryptSync(ENCRYPTION_KEY, "salt", 32);
}

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = parts[1];
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export function hashNRC(nrc: string): string {
  return createHash("sha256").update(nrc.toLowerCase().replace(/\s/g, "")).digest("hex");
}
