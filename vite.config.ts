import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      resolve: {
        alias: {
          "@dragonbones-threejs": path.resolve(__dirname, "./src"),
        },
      },
      define: {
        THREE: '{}',
      },
    };
  }

  if (mode === 'demo') {

    return {
      base: '',
      resolve: {
        alias: {
          "@dragonbones-threejs": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        outDir: path.resolve(__dirname, 'docs'),
        assetsInlineLimit: 0,
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, "demo/ChibiSample/index.html"),
          },
        }
      },
    }
  };

  return {
    publicDir: false,
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'dragonBonesThree',
        // formats: ['es'],
        fileName: 'dragonbones-threejs',
      },
      rollupOptions: {
        external: "three",
      }
    },
    plugins: [dts({ rollupTypes: true })],
  };
});