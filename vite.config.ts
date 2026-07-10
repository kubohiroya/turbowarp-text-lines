import {defineConfig} from 'vite';
import {turboWarpExtension} from '@kubohiroya/vite-plugin-turbowarp-extension';

export default defineConfig({
  plugins: [
    turboWarpExtension({
      id: 'kubohiroyatextlines',
      name: 'Text Lines',
      description: 'Count, read, and split text by lines in TurboWarp.',
      author: 'Hiroya Kubo',
      license: 'MPL-2.0',
      fileName: 'text-lines.js'
    })
  ]
});
