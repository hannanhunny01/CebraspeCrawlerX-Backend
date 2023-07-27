const puppeteer = require('puppeteer')

async function run() {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto('https://www.example.com').th;
    // Perform actions with the page
    await browser.close();
  }
  
  run();