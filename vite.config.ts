import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'dragonBonesThree',
      formats: ['es'],
      fileName: 'dragonbones-threejs',
    },
  },
  plugins: [dts()],
});