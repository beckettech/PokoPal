const data = require('./pokemon-data.ts');
const entries = data.pokemonList;

console.log('=== POKEMON DATA ===');
console.log('Total:', entries.length);

// Find Skwovet specifically
const skwovet = entries.find(p => p.name.toLowerCase() === 'skwovet');
if (skwovet) {
  console.log('✅ Skwovet found:', JSON.stringify({
    id: skwovet.id,
    name: skwovet.name,
    time: skwovet.time,
    weather: skwovet.weather,
    conditions: skwovet.conditions,
    pokopiaId: skwovet.pokopiaId
  }));
}

// Check Timburr
const timburr = entries.find(p => p.name.toLowerCase() === 'timburr');
if (timburr) {
  console.log('✅ Timburr found:', JSON.stringify({
    id: timburr.id,
    name: timburr.name,
    time: timburr.time,
    weather: timburr.weather,
    conditions: timburr.conditions,
    pokopiaId: timburr.pokopiaId
  }));
}

// Check what Pokemon have no preview image
const noPreview = entries.filter(p => !p.image && p.image.startsWith('https://'));
console.log('Pokemon with no image:', noPreview.length);
noPreview.slice(0, 10).forEach(p => console.log('-', p.name));

// Check Pokemon with time/weather set (should be from Serebii update)
const withTimeWeather = entries.filter(p => p.time || p.weather);
console.log('Pokemon with time/weather:', withTimeWeather.length);
withTimeWeather.slice(0, 5).forEach(p => console.log('-', p.name, 'time:', p.time, 'weather:', p.weather));
