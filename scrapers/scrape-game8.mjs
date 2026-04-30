import fs from 'fs';
import path from 'path';

// Parse materials from the fetched markdown
const materialsMarkdown = fs.readFileSync('/tmp/materials-page.md', 'utf-8');
const itemsIndexMarkdown = fs.readFileSync('/tmp/items-index.md', 'utf-8');

const results = [];

// Parse materials page - format: [Name](url) followed by bullet points
const materialBlocks = materialsMarkdown.split(/\n\n(?=\[)/);
for (const block of materialBlocks) {
  const nameMatch = block.match(/\[([^\]]+)\]\(https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+)\)/);
  if (!nameMatch) continue;
  const name = nameMatch[1].trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const bullets = block.match(/・(.+)/g);
  const howToGet = bullets ? bullets.map(b => b.replace(/^・/, '').trim()).join(' ') : '';
  if (howToGet && howToGet !== 'TBD') {
    results.push({ name, slug, howToGet, source: 'game8' });
  }
}

// Parse items index to get URLs for food, nature, and materials
const itemLinks = [];
const linkRegex = /\[([^\]]+)\]\(https:\/\/game8\.co\/games\/Pokemon-Pokopia\/archives\/(\d+)\)/g;
let match;
while ((match = linkRegex.exec(itemsIndexMarkdown)) !== null) {
  itemLinks.push({ name: match[1], id: match[2], url: `https://game8.co/games/Pokemon-Pokopia/archives/${match[2]}` });
}

// Save intermediate results
fs.writeFileSync(path.join(process.cwd(), 'public', 'game8-item-details.json'), JSON.stringify(results, null, 2));
console.log(`Saved ${results.length} materials`);
console.log(`Found ${itemLinks.length} item links from index`);

// Also save the item links for the next scraping phase
fs.writeFileSync('/tmp/game8-item-links.json', JSON.stringify(itemLinks, null, 2));
