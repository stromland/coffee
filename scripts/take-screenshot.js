import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function takeScreenshot() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set viewport to match the screenshot size in manifest (540x720)
  await page.setViewport({ width: 540, height: 720 });

  try {
    // Navigate to the app
    await page.goto('http://localhost:5173/coffee', { waitUntil: 'networkidle0' });

    // Wait a bit for any animations to complete
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Take screenshot
    const screenshotPath = path.join(__dirname, 'public', 'screenshot-540x720.png');
    await page.screenshot({
      path: screenshotPath,
      fullPage: false, // Only capture viewport
      type: 'png'
    });

    console.log(`Screenshot saved to: ${screenshotPath}`);
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
    console.log('Make sure the dev server is running on http://localhost:5173');
  } finally {
    await browser.close();
  }
}

takeScreenshot().catch(console.error);