const puppeteer = require('puppeteer');

const trackingCodes = [
  '104450403000102591658114',
  '104450403000102591658115',
  '104450403000102591658116'
];

async function trackPackage(code) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true });
  const page = await browser.newPage();
  
  await page.goto(`https://tracking.post.ir/?id=${code}`, { waitUntil: 'networkidle2' });
  
  await page.click('.search-icon');
  await page.waitForTimeout(3000);

  const result = await page.evaluate(() => {
    const statusElement = document.querySelector('.status-title');
    const dateElement = document.querySelector('.event-date');
    const locationElement = document.querySelector('.event-location');
    
    return {
      status: statusElement ? statusElement.innerText.trim() : 'وضعیت نامشخص',
      date: dateElement ? dateElement.innerText.trim() : 'تاریخ نامشخص',
      location: locationElement ? locationElement.innerText.trim() : 'مکان نامشخص'
    };
  });

  console.log(`کد: ${code} → وضعیت: ${result.status} | تاریخ: ${result.date} | مکان: ${result.location}`);

  await browser.close();
}

async function run() {
  for (let code of trackingCodes) {
    await trackPackage(code);
  }
}

run();
