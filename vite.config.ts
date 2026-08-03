import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

function versionServiceWorker(): Plugin {
  let resolvedConfig: ResolvedConfig

  return {
    name: 'version-service-worker',
    apply: 'build',
    configResolved(config) {
      resolvedConfig = config
    },
    async closeBundle() {
      const serviceWorkerPath = resolve(
        resolvedConfig.root,
        resolvedConfig.build.outDir,
        'sw.js',
      )
      const serviceWorker = await readFile(serviceWorkerPath, 'utf8')
      const versionedServiceWorker = serviceWorker.replace(
        '__BUILD_ID__',
        Date.now().toString(36),
      )

      await writeFile(serviceWorkerPath, versionedServiceWorker)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionServiceWorker()],
})
