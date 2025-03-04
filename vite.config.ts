import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({command, isPreview}) => {
  let base = '/';

  if (command === 'build' || isPreview) {  
    base = 'pcc-ss-fe'

    console.log('Build base:', base);
  }
  else if (command === 'serve') {
    console.log('Dev base:', base);
  }

  return {
    plugins: [react(), TanStackRouterVite()],
    base: base,
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
      // },
    },
    preview: {
      port: 7000,
      host: true,
      allowedHosts: true
    }
  }
})
