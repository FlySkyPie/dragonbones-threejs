import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
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