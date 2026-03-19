import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeSerebiiLocations() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const pokemon = [
    'geodude', 'pikachu', 'eevee', 'bulbasaur', 'charmander', 'squirtle',
    // Add more Pokemon as needed
  ];
  
  const locationData: Record<string, string[]> = {};
  
  for (const name of pokemon) {
    const url = `https://www.serebii.net/pokemonpokopia/pokedex/${name}.shtml`;
    console.log(`Scraping ${name}...`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      // Find location info on the page
      const locations = await page.evaluate(() => {
        const locElements = document.querySelectorAll('table.dextable td');
        const locs: string[] = [];
        
        locElements.forEach(el => {
          const text = el.textContent?.trim() || '';
          if (text.includes('Withered Wastelands') ||
              text.includes('Bleak Beach') ||
              text.includes('Rocky Ridges') ||
              text.includes('Sparkling Skylands') ||
              text.includes('Palette Town') ||
              text.includes('Cloud Island')) {
            locs.push(text);
          }
        });
        
        return locs;
      });
      
      locationData[name] = locations;
      console.log(`  Found: ${locations.join(', ')}`);
      
    } catch (err) {
      console.error(`  Error scraping ${name}:`, err);
      locationData[name] = [];
    }
  }
  
  await browser.close();
  
  // Save to file
  fs.writeFileSync('serebii-locations.json', JSON.stringify(locationData, null, 2));
  console.log('\nSaved to serebii-locations.json');
  
  return locationData;
}

scrapeSerebiiLocations().catch(console.error);
