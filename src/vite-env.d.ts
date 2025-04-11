
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // adicione outras variáveis que precisar aqui, todas devem começar com VITE_
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
