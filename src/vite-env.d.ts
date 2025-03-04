/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_COOKIE_TOKEN: string;
	readonly VITE_API_SERVER_HOST: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}