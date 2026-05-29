const puppeteer = require('puppeteer');

(async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    const errors = [];
    
    page.on('pageerror', err => {
      errors.push(err.stack || err.message);
    });
    page.on('response', response => {
      if (!response.ok()) {
        errors.push(`Failed to load resource: ${response.status()} ${response.url()}`);
      }
    });

    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    console.log('Checking title...');
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Click SOS button
    console.log('Testing SOS Button...');
    const sosBtn = await page.$('#sos-btn');
    if (sosBtn) {
      await page.evaluate(() => {
        const btn = document.getElementById('sos-btn');
        btn.dispatchEvent(new MouseEvent('mousedown'));
      });
      await new Promise(r => setTimeout(r, 3100)); // wait for hold
      await page.evaluate(() => {
        const btn = document.getElementById('sos-btn');
        btn.dispatchEvent(new MouseEvent('mouseup'));
      });
    } else {
      console.log('SOS button not found!');
    }

    // Wait for the UI to update
    await new Promise(r => setTimeout(r, 1000));

    // Try deactivation with wrong PIN
    console.log('Testing Deactivation (Wrong PIN)...');
    const deactivateBtn = await page.$('#deactivate-btn');
    if (deactivateBtn) {
      await deactivateBtn.click();
      await new Promise(r => setTimeout(r, 500));
      // Type wrong pin
      await page.type('#pin-input', '5555');
      await new Promise(r => setTimeout(r, 500)); // allow shake animation
    } else {
      console.log('Deactivate button not found!');
    }

    // Try deactivation with correct PIN
    console.log('Testing Deactivation (Correct PIN)...');
    if (deactivateBtn) {
      await deactivateBtn.click();
      await new Promise(r => setTimeout(r, 500));
      // Try to clear the input before typing just in case
      await page.evaluate(() => {
        const pinInput = document.getElementById('pin-input');
        if (pinInput) pinInput.value = '';
      });
      await page.type('#pin-input', '1234');
      await new Promise(r => setTimeout(r, 500));
    }

    if (errors.length > 0) {
      console.error('Errors found during test:', errors);
      process.exit(1);
    } else {
      console.log('All tests passed without console errors!');
      process.exit(0);
    }

  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
})();
