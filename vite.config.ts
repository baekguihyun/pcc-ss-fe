import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({command}) => {
  // command: "serve" (개발 모드) 또는 "build" (빌드 모드)
  const isBuild = command === "build";

  return {
    plugins: [react(), TanStackRouterVite()],
    base: isBuild ? "/pcc-ss-fe/" : "/", // 빌드 시에만 "/my-app/" 적용
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),

        // fix loading all icon chunks in dev mode
        // https://github.com/tabler/tabler-icons/issues/1233
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
    server: {
      port:7000,
      host: true,
      allowedHosts: true,
      // https: {
      //   // cert: fs.
      // }
    }
  }
})
