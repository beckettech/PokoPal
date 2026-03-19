#!/bin/bash

# Output file
OUTPUT="/home/z/my-project/pokemon-locations.json"

# Initialize
echo '{"Withered Wastelands": [], "Bleak Beach": [], "Rocky Ridges": [], "Sparkling Skylands": [], "Palette Town": [], "Cloud Island": []}' > "$OUTPUT"

# Get list of Pokemon URLs
POKEMON_URLS=$(curl -sL "https://www.serebii.net/pokemonpokopia/availablepokemon.shtml" 2>/dev/null | iconv -f ISO-8859-1 -t UTF-8 2>/dev/null | grep -oE 'pokedex/[a-z0-9\-]+\.shtml' | grep -v specialty | sort -u)

echo "Found Pokemon URLs, processing..."

# Counter
COUNT=0

# Process each Pokemon
for url in $POKEMON_URLS; do
    COUNT=$((COUNT + 1))
    POKEMON_NAME=$(echo "$url" | sed 's/pokedex\///;s/\.shtml//;s/-/ /g' | sed 's/\b\(.\)/\u\1/g')
    
    # Fetch page and extract locations
    PAGE=$(curl -sL "https://www.serebii.net/$url" 2>/dev/null | iconv -f ISO-8859-1 -t UTF-8 2>/dev/null)
    
    # Check for each location
    LOCATIONS=""
    if echo "$PAGE" | grep -q "witheredwastelands"; then
        LOCATIONS="$LOCATIONS Withered Wastelands"
    fi
    if echo "$PAGE" | grep -q "bleakbeach"; then
        LOCATIONS="$LOCATIONS Bleak Beach"
    fi
    if echo "$PAGE" | grep -q "rockyridges"; then
        LOCATIONS="$LOCATIONS Rocky Ridges"
    fi
    if echo "$PAGE" | grep -q "sparklingskylands"; then
        LOCATIONS="$LOCATIONS Sparkling Skylands"
    fi
    if echo "$PAGE" | grep -q "palettetown"; then
        LOCATIONS="$LOCATIONS Palette Town"
    fi
    if echo "$PAGE" | grep -q "cloudisland"; then
        LOCATIONS="$LOCATIONS Cloud Island"
    fi
    
    echo "[$COUNT] $POKEMON_NAME:$LOCATIONS"
done

echo "Done processing $COUNT Pokemon"
