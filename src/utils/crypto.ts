
const enc = new TextEncoder()
const dec = new TextDecoder()

// Derive a strong AES-GCM key from your SECRET_KEY using PBKDF2
async function deriveKey(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(secret), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: 100_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

function b64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin)
}

function fromB64(b64str: string): Uint8Array {
  const bin = atob(b64str)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// Encrypt any JSON-serializable value with SECRET_KEY
export async function encrypt(value: unknown, SECRET_KEY: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(SECRET_KEY, salt)
  const plaintext = enc.encode(JSON.stringify(value))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)

  // JSON envelope: safe to store anywhere
  return JSON.stringify({
    v: 1,
    alg: 'AES-GCM',
    salt: b64(salt.buffer),
    iv: b64(iv.buffer),
    data: b64(ciphertext)
  })
}

// Decrypt back to original value with the same SECRET_KEY
export async function decrypt<T = unknown>(payload: string, SECRET_KEY: string): Promise<T> {
  const env = JSON.parse(payload)
  const salt = fromB64(env.salt)
  const iv = fromB64(env.iv)
  const data = fromB64(env.data)
  const key = await deriveKey(SECRET_KEY, salt)
  // @ts-ignore - Web Crypto type compatibility issue
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return JSON.parse(dec.decode(plaintext)) as T
}

// Centralized passphrase for localStorage encryption in this demo.
// In production, do NOT hardcode; source from env/secret manager or user input.
export const STORAGE_PASSPHRASE = 'uppass-demo-key'

export async function encryptForStorage(value: unknown): Promise<string> {
  return encrypt(value, STORAGE_PASSPHRASE)
}

export async function decryptFromStorage<T = unknown>(payload: string): Promise<T> {
  return decrypt<T>(payload, STORAGE_PASSPHRASE)
}
