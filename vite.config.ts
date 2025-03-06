import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({command, isPreview}) => {
  let base = '/'
  let allowedHosts : boolean | string[] = true

  if (command === 'build' || isPreview) {  
    base = '/pcc-ss-fe/'

    console.log('Build base:', base)

    allowedHosts = ['baekguihyun.duckdns.org']
  }
  else if (command === 'serve') {
    console.log('Dev base:', base);
  }
  
  console.log(`Allowed Hosts: ${allowedHosts}`)

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
      allowedHosts: allowedHosts
    },
    preview: {
      port: 7000,
      host: true,
      allowedHosts: allowedHosts
    }
  }
})
