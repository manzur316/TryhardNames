import { getSitemapUrls } from '../utils/sitemapGenerator.js';

// Never snapshot the owner workspace, authentication, or user-created profiles.
export const getPrerenderPaths = () => getSitemapUrls()
  .map(({ path }) => path)
  .filter(path => path !== '/gaming-passport');

export const prerenderDestination = path => path === '/' ? '/index.html' : path + '.html';
