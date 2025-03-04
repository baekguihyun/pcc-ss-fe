/// <reference types="vite/client" />
interface ImportMetaEnv {
	readonly VITE_COOKIE_TOKEN: string;
	readonly VITE_API_SERVER_HOST: string;
	readonly VITE_BASE_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}