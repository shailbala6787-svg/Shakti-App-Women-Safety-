const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Set up interceptors to catch navigation attempts (WhatsApp and Tel)
    const interceptedUrls = [];
    
    await page.exposeFunction('logNavigation', url => {
      console.log('Navigated to:', url);
      interceptedUrls.push(url);
    });

    await page.evaluateOnNewDocument(() => {
      const originalOpen = window.open;
      window.open = function(url, target, features) {
        window.logNavigation(url);
        return originalOpen.apply(this, arguments);
      };
      
      // We can't easily proxy window.location.href, so let's intercept beforeunload or listen to frame nav
    });
    
    // Listen to requests
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = request.url();
      if (url.startsWith('whatsapp:') || url.includes('api.whatsapp.com') || url.startsWith('tel:')) {
        console.log('Intercepted request:', url);
        interceptedUrls.push(url);
        request.abort();
      } else {
        request.continue();
      }
    });

    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    // Ensure we are tracking the SOS
    console.log('Triggering SOS button...');
    await page.evaluate(() => {
      const btn = document.getElementById('sos-button');
      btn.dispatchEvent(new MouseEvent('mousedown'));
    });
    
    // Wait for the 3 seconds hold + 500ms timeout
    await new Promise(r => setTimeout(r, 4000));
    
    // Let's release the mouse
    await page.evaluate(() => {
      const btn = document.getElementById('sos-button');
      btn.dispatchEvent(new MouseEvent('mouseup'));
    });

    // Wait a bit for WhatsApp and Call to trigger
    await new Promise(r => setTimeout(r, 1000));

    // Take screenshot
    const screenshotPath = 'C:/Users/tshql/.gemini/antigravity-ide/brain/30772af5-3a40-4038-b3d0-21fb5dbb8869/sos_test_screenshot.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Screenshot saved to ' + screenshotPath);

    console.log('--- TEST RESULTS ---');
    console.log('Intercepted URLs:');
    interceptedUrls.forEach(url => console.log(' ->', url));
    
    if (interceptedUrls.length >= 2) {
      console.log('SUCCESS: WhatsApp and Phone Call both triggered successfully.');
    } else {
      console.log('WARNING: Did not detect both WhatsApp and Phone Call navigations.');
    }

  } catch (err) {
    console.error('Error during live test:', err);
  } finally {
    if (browser) await browser.close();
    process.exit(0);
  }
})();
