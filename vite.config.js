import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function resolveBase() {
  const explicitBase = process.env.VITE_BASE_PATH;
  if (explicitBase) return explicitBase;

  const runningOnGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  if (!runningOnGitHubActions) return '/';

  const repository = process.env.GITHUB_REPOSITORY;
  const repositoryName = repository ? repository.split('/')[1] : '';
  if (!repositoryName || repositoryName.endsWith('.github.io')) return '/';

  return `/${repositoryName}/`;
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react()]
});
