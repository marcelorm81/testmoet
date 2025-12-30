import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For GitHub Pages: use repo name as base path, or "/" for user/organization sites
    const getBasePath = () => {
      if (process.env.GITHUB_REPOSITORY) {
        const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
        // If repo name ends with .github.io, it's a user/organization site
        return repoName.endsWith('.github.io') ? '/' : `/${repoName}/`;
      }
      return '/';
    };
    
    return {
      base: getBasePath(),
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
