
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { generateSitemap, getSitemapUrls } from '../src/utils/sitemapGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = () => {
  try {
    console.log('Generating sitemap.xml...');
    
    // Generate the XML string using the single source of truth
    const sitemapXml = generateSitemap();
    const urlsCount = getSitemapUrls().length;

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap.xml
    const outputPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemapXml);

    console.log(`✅ Successfully generated sitemap.xml with ${urlsCount} URLs at ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
};

// Execute generation
run();
