#!/usr/bin/env node

import { chromium } from 'playwright';

const URL = (process.env.NODE_ENV === 'debug')
  ? 'http://127.0.0.1:5500/public/index.html'
  : 'https://resume.trentbe.dev';

(async() => {
  const browser = await chromium.launch();
  const printToPDF = async(url, outName) => {
    const page = await browser.newPage();
    
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      // 字體請求
      if (url.includes('NotoSans.woff2')) {
        const newUrl = process.env.NODE_ENV === 'debug'
          ? url.replace('/NotoSans.woff2', '/public/NotoSans.woff2')
          : url.replace('/public/NotoSans.woff2', '/NotoSans.woff2');
        await route.continue({ url: newUrl });
      } else {
        await route.continue();
      }
    });

    await page.goto(url, { waitUntil: 'networkidle' });
    
    await page.pdf({
      path: outName,
      pageRanges: '1',
      scale: 0.85,
      displayHeaderFooter: false,
    });
  };

  await Promise.all([
    printToPDF(URL, './Resume_Trent.pdf'),
  ]);

  await browser.close();
})();