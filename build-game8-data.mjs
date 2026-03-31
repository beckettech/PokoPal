import fs from 'fs';
import path from 'path';

// Materials parsed from the game8 materials page (583145)
const materials = [
  {name:"Honey",howToGet:"Can be obtained by inspecting sparkling flower beds. Dropped by Combee in its habitat."},
  {name:"Sturdy stick",howToGet:"Can be picked up while exploring. Can also be obtained by using Cut on wooden objects. Dropped by Cacturne in its habitat."},
  {name:"Stone",howToGet:"Can be picked up while exploring. Has a chance to drop when destroying natural blocks with Rock Smash. Dropped by Rock-type with Litter specialty in their habitat."},
  {name:"Leaf",howToGet:"Can be picked up while exploring. Can also be obtained by using Cut on tall grass and vines. Dropped by Venusaur in its habitat."},
  {name:"Small log",howToGet:"Can be obtained by cutting down worn lumber or trees. Dropped by Haxorus in its habitat."},
  {name:"Vine rope",howToGet:"Mainly obtained by using Cut on vines. Dropped by Bellsprout and Weepinbell in their habitat."},
  {name:"Glowing mushrooms",howToGet:"Can be found inside caves."},
  {name:"Twine",howToGet:"Can be obtained by breaking down textile garbage. Dropped by Bug-type with Litter specialty in their habitats. Also obtained by cutting cobwebs."},
  {name:"Sea glass fragments",howToGet:"Can be picked up while exploring Bleak Beach, usually found on muk-covered tiles."},
  {name:"Seashell",howToGet:"Can be picked up while exploring the shoreline of Bleak Beach."},
  {name:"Nonburnable garbage",howToGet:"Can be picked up while exploring the Bleak Beach."},
  {name:"Squishy clay",howToGet:"Can be obtained by breaking down clay blocks, which can easily be found inside Onix's cavern and on Bleak Beach. Dropped by Ground-type with Litter specialty in their habitats."},
  {name:"Fluff",howToGet:"Dropped by Mareep and Flaffy in their habitat."},
  {name:"Wastepaper",howToGet:"Can be picked up while exploring the Sparkling Skylands."},
  {name:"Copper ore",howToGet:"Can be obtained by breaking down Copper ore blocks in the Rocky Ridge mines."},
  {name:"Iron ore",howToGet:"Can be obtained by breaking down Iron ore blocks in the Rocky Ridge mines. Can be obtained by giving Nonburnable garbage to Pokemon with the Recycle specialty."},
  {name:"Gold ore",howToGet:"Can be obtained by breaking down Gold ore blocks in the Rocky Ridge mines."},
  {name:"Pokemetal fragment",howToGet:"Can be obtained by breaking down Pokemetal ore blocks in the Withered Wasteland mines and Sparkling Skylands."},
  {name:"Rare Pokemetal fragment",howToGet:"Has a low chance of dropping from Pokemetal blocks."},
  {name:"Crystal fragment",howToGet:"Can be obtained by breaking down large crystals in the Rocky Ridge mines."},
  {name:"Lumber",howToGet:"Can be obtained by having Scyther, or any Pokemon with the Chop specialty, process Small lumber."},
  {name:"Brick",howToGet:"Can be obtained by having any Pokemon with the Burn specialty process Squishy clay."},
  {name:"Copper ingot",howToGet:"Can be obtained by melting Copper ore in the smelting furnace."},
  {name:"Iron ingot",howToGet:"Can be obtained by melting Iron ore in the smelting furnace."},
  {name:"Gold ingot",howToGet:"Can be obtained by melting Gold ore in the smelting furnace."},
  {name:"Pokemetal",howToGet:"Can be obtained by melting Pokemetal fragment in the smelting furnace."},
  {name:"Rare Pokemetal",howToGet:"Can be obtained by melting Rare Pokemetal fragment in the smelting furnace."},
  {name:"Glass",howToGet:"Melt volcanic ash, sand, or sandstone in a smelting furnace with Pokemon with the Burn specialty. Can also be obtained by breaking broken windows."},
  {name:"Concrete",howToGet:"Can be obtained by processing Limestone, found on Rocky Ridges, in a Concrete Mixer, which is unlocked in Sparkling Skylands."},
  {name:"Paper",howToGet:"Can be obtained by giving Wastepaper to Pokemon with the Recycle specialty."},
  {name:"Tinkagear",howToGet:"Can be obtained by giving Iron Ingots to Tinkaton for processing."},
  {name:"Strange strings",howToGet:"Has a low chance of dropping from glowing blocks."},
  {name:"Armor fragment",howToGet:"Has a low chance of dropping from glowing blocks."},
  {name:"Stardust",howToGet:"Can be picked up while exploring Dream Islands."},
  {name:"Red paint",howToGet:"Can be obtained by giving a Leppa Berry to a Pokemon with the Crush specialty."},
  {name:"Blue paint",howToGet:"Can be obtained by giving a Chesto Berry to a Pokemon with the Crush specialty."},
  {name:"Green paint",howToGet:"Can be obtained by giving a Lum Berry to a Pokemon with the Crush specialty."},
  {name:"Yellow paint",howToGet:"Can be obtained by giving an Aspear Berry to a Pokemon with the Crush specialty."},
  {name:"Pink paint",howToGet:"Can be obtained by giving a Pecha Berry to a Pokemon with the Crush specialty."},
  {name:"Cyan paint",howToGet:"Can be obtained by giving a Rawst Berry to a Pokemon with the Crush specialty."},
  {name:"White paint",howToGet:"Has a low chance of obtaining after giving a Leppa Berry to a Pokemon with the Crush specialty."},
  {name:"Black paint",howToGet:"Has a low chance of obtaining after giving an Aspear Berry to a Pokemon with the Crush specialty."},
  {name:"Cotton spores",howToGet:"Found on Dream Islands during the Hoppip event."},
];

const results = materials.map(m => ({
  name: m.name,
  slug: m.name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
  howToGet: m.howToGet,
  source: 'game8'
}));

fs.writeFileSync(
  path.join(process.cwd(), 'public', 'game8-item-details.json'),
  JSON.stringify(results, null, 2)
);
console.log(`Saved ${results.length} items to game8-item-details.json`);
