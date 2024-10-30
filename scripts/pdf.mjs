#!/usr/bin/env node

import { chromium } from 'playwright';

const URL = (process.env.NODE_ENV === 'debug')
  ? 'http://127.0.0.1:5500/public/index.html'
  : 'https://resume.trentbe.dev';

(async() => {
  const browser = await chromium.launch();
  const printToPDF = async(url, outName) => {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    
    await page.pdf({
      path: outName,
      pageRanges: '1',
    });
  };

  await Promise.all([
    printToPDF(URL, './Resume_Trent.pdf'),
  ]);

  await browser.close();
})();