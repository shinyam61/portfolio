import { defineConfig } from 'astro/config';
import glsl from 'vite-plugin-glsl'

const isDev = process.env.NODE_ENV !== "production";

// https://astro.build/config
export default defineConfig({
  site: 'https://shinyam61.github.io',
  base: '/portfolio',
  vite: {
    plugins: [glsl()],
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      outDir: './dist',
      rollupOptions: {
        output: {
          entryFileNames: (chunkInfo) => {
            const {name} = chunkInfo
            console.log({chunkInfo})
            if (name == 'hoisted') {
              return `assets/scripts/app.js`
            }
            return `assets/scripts/[name].js`
          },
          assetFileNames: (assetInfo) => {
            const {name} = assetInfo
            if (/\.(jpe?g|png|gif|svg)$/.test(name ?? '')) {
              return 'assets/images/[name][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/styles/app[extname]';
            }
            return 'assets/[name][extname]';
          }
        }
      },
      minify: true
    },
    esbuild: {
      drop: isDev ? [] : ["console", "debugger"],
    },
    plugins: [
      ((obj) => {
        console.log("no-attribute")
        return {
          name: "no-attribute",
          transform(code, id){
            if (/\.(html|astro|css)$/.test(id)) {
              return code.replace(/data-astro-cid-/g, 'org-')
            }
          }
        }
      })()
    ]
  },
});
