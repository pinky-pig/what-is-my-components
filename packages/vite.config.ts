import { resolve } from 'path'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [
          resolve(__dirname, '..'),
        ],
      },
    },
    plugins: [

      // plugins
      Components({
        dirs: resolve(__dirname, '.vitepress/theme/components'),
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: './.vitepress/components.d.ts',
        transformer: 'vue3',
      }),
      UnoCSS(),
    ],
    resolve: {
      alias: {
        '@vueuse/shared': resolve(__dirname, 'shared/index.ts'),
        '@vueuse/core': resolve(__dirname, 'core/index.ts'),
        '@vueuse/math': resolve(__dirname, 'math/index.ts'),
        '@vueuse/integrations': resolve(__dirname, 'integrations/index.ts'),
        '@vueuse/components': resolve(__dirname, 'components/index.ts'),
        '@vueuse/metadata': resolve(__dirname, 'metadata/index.ts'),
        '@vueuse/docs-utils': resolve(__dirname, '.vitepress/plugins/utils.ts'),
      },
      dedupe: [
        'vue',
      ],
    },
    optimizeDeps: {
      exclude: [
        '@vueuse/shared',
        '@vueuse/core',
        'body-scroll-lock',
      ],
      include: [
        'axios',
        'js-yaml',
        'nprogress',
        'qrcode',
        'tslib',
        'fuse.js',
        'universal-cookie',
      ],
    },
  }
})
