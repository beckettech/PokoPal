const puppeteer = require('puppeteer');

// Check all 300 Pokemon from the availablepokemon page to get their slugs
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  await page.goto('https://www.serebii.net/pokemonpokopia/availablepokemon.shtml', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/pokemonpokopia/pokedex/"]'));
    return anchors.map(a => ({
      name: a.innerText.trim(),
      href: a.href,
      slug: a.href.split('/pokedex/')[1]?.replace('.shtml', '')
    })).filter(a => a.slug);
  });
  
  console.log(`Found ${links.length} Pokemon links`);
  console.log(JSON.stringify(links.slice(0, 20), null, 2));
  
  await browser.close();
})();
