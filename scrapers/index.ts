/**
 * Master scraper runner
 * Runs all scrapers in sequence
 */

import { scrapeHabitats } from './habitats';
import { scrapePokedex } from './pokedex';

async function scrapeAll() {
  console.log('🚀 Starting full scrape...\n');
  
  try {
    // 1. Habitats
    console.log('📍 Scraping habitats...');
    await scrapeHabitats();
    
    // 2. Pokédex
    console.log('\n🎮 Scraping Pokédex...');
    await scrapePokedex();
    
    // 3. TODO: Maps
    console.log('\n🗺️ Maps scraper not implemented yet');
    
    // 4. TODO: Items/Materials
    console.log('\n📦 Items scraper not implemented yet');
    
    console.log('\n✅ All scrapers complete!');
    console.log('📁 Check data/ directory for output');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

scrapeAll();
