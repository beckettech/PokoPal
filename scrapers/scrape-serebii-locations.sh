#!/bin/bash
# Scrape Serebii Pokemon MAP LOCATIONS (not habitats)

pokemon=(
  "geodude" "pikachu" "eevee" "bulbasaur" "charmander" "squirtle"
  "charizard" "venusaur" "blastoise" "gengar" "dragonite" "lucario"
  "greninja" "gyarados" "arcanine" "ninetales" "tyranitar" "metagross"
  "blaziken" "empoleon" "torchic" "piplup" "scorbunny" "sprigatito"
  "froakie" "cinderace" "meowscarada" "raichu" "vulpix" "growlithe"
  "slowpoke" "magikarp" "porygon" "riolu" "zorua" "mimikyu"
  "abra" "absol" "aerodactyl" "alakazam" "altaria" "amaura"
  "ampharos" "arbok" "ariados" "audino" "aurorus" "axew"
  "azumarill" "azurill" "bastiodon" "beldum" "bellossom" "bellsprout"
  "blissey" "bonsly" "cacnea" "cacturne" "carkol" "ceruledge"
  "chandelure" "chansey" "charcadet" "charjabug" "charmeleon" "chatot"
  "cinccino" "clefable" "clefairy" "cleffa" "clodsire" "coalossal"
  "combee" "combusken" "conkeldurr" "corviknight" "corvisquire" "cranidos"
  "crobat" "cubone" "cyndaquil" "dachsbun" "dartrix" "decidueye"
  "dedenne" "diglett" "dragapult" "dragonair" "drakloak" "dratini"
  "dreepy" "drifblim" "drifloon" "drilbur" "dugtrio" "dusclops"
  "dusknoir" "duskull" "ekans" "electabuzz" "electivire" "electrode"
  "elekid" "excadrill" "exeggcute" "exeggutor" "farigiraf" "fidough"
  "flaaffy" "floragato" "flygon" "fraxure" "frogadier" "gallade"
  "garbodor" "gardevoir" "gastly" "gastrodon" "gholdengo" "gimmighoul"
  "girafarig" "glimmet" "glimmora" "gloom" "golduck" "golem"
  "goodra" "goomy" "graveler" "greedent" "grimer" "grubbin"
  "gurdurr" "happiny" "hariyama" "haunter" "haxorus" "heracross"
  "hitmonchan" "hitmonlee" "hitmontop" "honchkrow" "hoothoot" "igglybuff"
  "illumise" "ivysaur" "jigglypuff" "kadabra" "kilowattrel" "kirlia"
  "kricketot" "kricketune" "lampent" "lapras" "larvesta" "larvitar"
  "litwick" "lombre" "lotad" "ludicolo" "machamp" "machoke"
  "magby" "magmar" "magmortar" "magnemite" "magneton" "magnezone"
  "makuhita" "mareep" "marill" "marowak" "meowth" "metang"
  "minccino" "minun" "misdreavus" "mismagius" "muk" "murkrow"
  "noctowl" "noibat" "noivern" "oddish" "onix" "paldeanwooper"
  "paras" "parasect" "pawmi" "pawmo" "pawmot" "persian"
  "pidgeot" "pidgeotto" "pidgey" "pinsir" "plusle" "politoed"
  "poliwag" "poliwhirl" "poliwrath" "prinplup" "psyduck" "pupitar"
  "quilava" "raboot" "ralts" "rampardos" "rattata" "raticate"
  "rolycoly" "rookidee" "rowlet" "sandshrew" "sandslash" "scizor"
  "scorbunny" "scyther" "serperior" "servine" "shieldon" "shellos"
  "skwovet" "slowbro" "slowking" "sliggoo" "smeargle" "snivy"
  "spearow" "spinarak" "squawkabilly" "steelix" "stunky" "sudowoodo"
  "swablu" "swalot" "tatsugiri" "timburr" "tinkatink" "tinkatuff"
  "tinkaton" "torkoal" "toxel" "toxtricityampedform" "toxtricitylowkeyform" "trapinch"
  "trubbish" "typhlosion" "tyrantrum" "tyrogue" "tyrunt" "venomoth"
  "venonat" "vespiquen" "vibrava" "victreebel" "vileplume" "volbeat"
  "volcarona" "voltorb" "wartortle" "wattrel" "weepinbell" "wigglytuff"
  "wingull" "wooper" "wormadam" "wormadamsandy" "wormadamtrash" "yanma"
  "yungoos" "zangoose" "zapdos" "zebstrika" "zubat"
)

echo "{"
echo '  "pokemon_to_locations": {'

first=true
for name in "${pokemon[@]}"; do
  url="https://www.serebii.net/pokemonpokopia/pokedex/${name}.shtml"
  echo "Scraping $name..." >&2
  
  html=$(curl -s "$url" 2>/dev/null)
  
  # Extract ONLY map locations from the "Location:" section
  # These are links that start with /pokemonpokopia/locations/
  locations=$(echo "$html" | \
    grep -oE '/pokemonpokopia/locations/[^"]+\.shtml' | \
    sed 's|/pokemonpokopia/locations/||g; s|\.shtml||g' | \
    sed 's/-/ /g' | \
    sed 's/\b\(.\)/\u\1/g' | \
    sort -u | \
    tr '\n' ',' | \
    sed 's/,$//')
  
  if [ -z "$locations" ]; then
    # Legendary or unknown
    locations=""
  fi
  
  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi
  
  # Format as JSON array
  if [ -n "$locations" ]; then
    IFS=',' read -ra LOCArray <<< "$locations"
    json_array="["
    for i in "${!LOCArray[@]}"; do
      if [ $i -gt 0 ]; then
        json_array+=", "
      fi
      json_array+="\"${LOCArray[$i]}\""
    done
    json_array+="]"
  else
    json_array="[]"
  fi
  
  echo -n "    \"$name\": $json_array"
done

echo ""
echo "  }"
echo "}"
