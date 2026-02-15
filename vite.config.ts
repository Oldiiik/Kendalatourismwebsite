
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'figma:asset/e395541ff2719ddb07c2e2ab138344d95aa10b41.png': path.resolve(__dirname, './src/assets/e395541ff2719ddb07c2e2ab138344d95aa10b41.png'),
        'figma:asset/cf5748dbae1f2a03dabe15b2ca75ca5db5d7e95c.png': path.resolve(__dirname, './src/assets/cf5748dbae1f2a03dabe15b2ca75ca5db5d7e95c.png'),
        'figma:asset/a9659c7629338bfa7bce2f51da9e89e9456265c2.png': path.resolve(__dirname, './src/assets/a9659c7629338bfa7bce2f51da9e89e9456265c2.png'),
        'figma:asset/80d9e2a6cdf51e612abec873620d5e03d4b62b5f.png': path.resolve(__dirname, './src/assets/80d9e2a6cdf51e612abec873620d5e03d4b62b5f.png'),
        'figma:asset/7f87844e544184dd0fb72fd13610100980ea82e3.png': path.resolve(__dirname, './src/assets/7f87844e544184dd0fb72fd13610100980ea82e3.png'),
        'figma:asset/44c0d112942298f0c828352cf7b2cc2862d69e6b.png': path.resolve(__dirname, './src/assets/44c0d112942298f0c828352cf7b2cc2862d69e6b.png'),
        'figma:asset/2a1a999b8dd927b5e4403bc5a228394d597ffe73.png': path.resolve(__dirname, './src/assets/2a1a999b8dd927b5e4403bc5a228394d597ffe73.png'),
        'figma:asset/1c189c500fb7b696d9890eae2ac31da3e3e23387.png': path.resolve(__dirname, './src/assets/1c189c500fb7b696d9890eae2ac31da3e3e23387.png'),
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });