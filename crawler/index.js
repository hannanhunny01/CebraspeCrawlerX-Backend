const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://example.com');
    // Perform scraping or other actions with Puppeteer here

    await browser.close();

    res.send('Scraping done!');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('An error occurred');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
