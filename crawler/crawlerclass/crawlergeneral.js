const puppeteer = require('puppeteer');

class PuppeteerCrawler {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch({headless:false});
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async getLiNames(url, divXPath) {
    const page = await this.browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const liNames = await page.evaluate((divXPath) => {
      const divElement = document.evaluate(divXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!divElement) {
        return null; 
      }

      const ulElement = divElement.querySelector('ul');
      if (!ulElement) {
        return null; 
      }

      const liElements = ulElement.querySelectorAll('li');
      const names = Array.from(liElements).map(li => li.textContent.trim());
      return names;
    }, divXPath);

    await page.close();
    return liNames;
  }
}

(async () => {
  const crawler = new PuppeteerCrawler();
  await crawler.initialize();

  const url = 'https://www.cebraspe.org.br/concursos/'; // Replace with the URL you want to crawl
  const divXPath = '/html/body/div[1]/div/div[2]/div/div/div/div/div/div[2]/div[2]/div/div/div/div/div/div/div[4]';
  const liNames = await crawler.getLiNames(url, divXPath);

  if (liNames === null) {
    console.log('The specified div or ul element was not found.');
  } else {
    console.log('The li names found in the specified ul are:');
    console.log(liNames);
  }

  await crawler.close();
})();
