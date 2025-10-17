/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORAGE_PASSPHRASE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
