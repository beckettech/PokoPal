#!/bin/bash
# Scrape Serebii Pokemon locations - more targeted

pokemon=(
  "geodude" "pikachu" "eevee" "bulbasaur" "charmander" "squirtle"
  "charizard" "venusaur" "blastoise" "gengar" "dragonite" "lucario"
  "greninja" "gyarados" "arcanine" "ninetales" "tyranitar" "metagross"
)

echo "{"
echo '  "pokemon_locations": {'

first=true
for name in "${pokemon[@]}"; do
  url="https://www.serebii.net/pokemonpokopia/pokedex/${name}.shtml"
  echo "Scraping $name..." >&2
  
  html=$(curl -s "$url" 2>/dev/null)
  
  # Extract ONLY the locations from the "Location:" section
  # This is between "Location:" and the next table cell
  locations=$(echo "$html" | \
    sed -n '/<b>Location<\/b>:/,/<\/td>/p' | \
    grep -oE '>([A-Za-z ]+)</a>' | \
    sed 's/>//;s/<\/a>//' | \
    sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
    grep -v "^$" | \
    tr '\n' ',' | \
    sed 's/,$//')
  
  if [ -z "$locations" ]; then
    locations="Unknown"
  fi
  
  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi
  
  # Format as JSON array
  IFS=',' read -ra LOCArray <<< "$locations"
  json_array="["
  for i in "${!LOCArray[@]}"; do
    if [ $i -gt 0 ]; then
      json_array+=", "
    fi
    json_array+="\"${LOCArray[$i]}\""
  done
  json_array+="]"
  
  echo -n "    \"$name\": $json_array"
done

echo ""
echo "  }"
echo "}"
