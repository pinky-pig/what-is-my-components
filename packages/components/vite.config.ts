import path from 'path'
import dts from 'vite-plugin-dts'

import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  base: '/project/',
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    // https://github.com/antfu/unplugin-auto-import
    // AutoImport({
    //   imports: [
    //     'vue',
    //     '@vueuse/core',
    //   ],
    //   dts: 'typings/auto-imports.d.ts',
    //   dirs: [
    //   ],
    //   vueTemplate: true,
    // }),

    // Components({
    //   // allow auto load markdown components under `./src/components/`
    //   extensions: ['vue', 'md'],
    //   // allow auto import and register components used in markdown
    //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    //   dts: 'src/components.d.ts',
    // }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),
    dts({
      outputDir: 'lib',
      tsConfigFilePath: '../../tsconfig.json',
    }),
  ],
  build: {
    target: 'modules',
    // 打包文件目录
    outDir: 'es',
    // 压缩
    minify: false,
    // css分离
    // cssCodeSplit: true,
    rollupOptions: {
      // 忽略打包vue文件
      external: ['vue'],
      input: ['src/index.ts'],
      output: [
        {
          format: 'es',
          // 不用打包成.es.js,这里我们想把它打包成.js
          entryFileNames: '[name].js',
          // 让打包目录和我们目录对应
          preserveModules: true,
          // 配置打包根目录
          dir: 'es',
          preserveModulesRoot: 'src',
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          // 让打包目录和我们目录对应
          preserveModules: true,
          // 配置打包根目录
          dir: 'lib',
          preserveModulesRoot: 'src',
        },
      ],
    },
    lib: {
      entry: './index.ts',
      formats: ['es', 'cjs'],
    },
  },

  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3200/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''), // 重写路径把路径变成空字符
      },
    },
  },
})
