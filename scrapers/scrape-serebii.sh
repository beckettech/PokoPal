#!/bin/bash
# Scrape Serebii Pokemon locations using curl

pokemon=(
  "geodude" "pikachu" "eevee" "bulbasaur" "charmander" "squirtle"
  "charizard" "venusaur" "blastoise" "gengar" "dragonite" "lucario"
)

echo "{"
echo '  "pokemon_locations": {'

first=true
for name in "${pokemon[@]}"; do
  url="https://www.serebii.net/pokemonpokopia/pokedex/${name}.shtml"
  echo "Scraping $name..." >&2
  
  html=$(curl -s "$url" 2>/dev/null)
  
  # Extract location text from HTML
  locations=$(echo "$html" | grep -oE "(Withered Wastelands|Bleak Beach|Rocky Ridges|Sparkling Skylands|Palette Town|Cloud Island)" | sort -u | tr '\n' ',' | sed 's/,$//')
  
  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi
  
  echo -n "    \"$name\": [\"${locations//,/\", \"}\"]"
done

echo ""
echo "  }"
echo "}"
