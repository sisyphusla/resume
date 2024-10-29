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
    
    // 設定頁面比例以調整內容大小
    await page.pdf({
      path: outName,
      pageRanges: '1',
      format: 'A4',           
      scale: 1,            
      margin: {              
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      },
      preferCSSPageSize: true 
    });
  };

  await Promise.all([
    printToPDF(URL, './Resume_Trent.pdf'),
  ]);

  await browser.close();
})();