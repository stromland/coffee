import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const inputSvg = path.join(__dirname, 'public', 'coffee-icon.svg');
  const outputDir = path.join(__dirname, 'public');

  // Check if SVG exists
  if (!fs.existsSync(inputSvg)) {
    console.error('SVG file not found:', inputSvg);
    return;
  }

  const sizes = [192, 512];
  const variants = ['any', 'maskable'];

  console.log('Generating PWA icons...');

  for (const size of sizes) {
    for (const variant of variants) {
      const outputFile = path.join(outputDir, `coffee-icon-${size}${variant === 'maskable' ? '-maskable' : ''}.png`);

      let pipeline = sharp(inputSvg)
        .resize(size, size, {
          fit: 'contain',
          background: variant === 'maskable' ? { r: 255, g: 255, b: 255, alpha: 0 } : { r: 255, g: 255, b: 255, alpha: 1 }
        });

      if (variant === 'maskable') {
        // For maskable icons, add padding to ensure the icon works well with different mask shapes
        const padding = Math.floor(size * 0.1); // 10% padding
        const iconSize = size - (padding * 2);

        pipeline = pipeline
          .resize(iconSize, iconSize, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .extend({
            top: padding,
            bottom: padding,
            left: padding,
            right: padding,
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          });
      }

      await pipeline.png().toFile(outputFile);
      console.log(`Generated: ${outputFile}`);
    }
  }

  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);