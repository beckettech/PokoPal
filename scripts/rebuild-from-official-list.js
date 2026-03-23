#!/usr/bin/env node
/**
 * Rebuild pokemon-data.ts from the official Serebii Pokopia dex list
 * Sequential 1-300, Mew = #300
 * Forms share the same number (e.g. Shellos #59 West + East)
 */

const fs = require('fs');
const path = require('path');

// Official Pokopia dex from Serebii (sequential 1-300)
const OFFICIAL_LIST = [
  { id: 1,   name: "Bulbasaur",              specialties: ["Grow"] },
  { id: 2,   name: "Ivysaur",                specialties: ["Grow"] },
  { id: 3,   name: "Venusaur",               specialties: ["Grow","Litter"] },
  { id: 4,   name: "Charmander",             specialties: ["Burn"] },
  { id: 5,   name: "Charmeleon",             specialties: ["Burn"] },
  { id: 6,   name: "Charizard",              specialties: ["Burn","Fly"] },
  { id: 7,   name: "Squirtle",               specialties: ["Water"] },
  { id: 8,   name: "Wartortle",              specialties: ["Water"] },
  { id: 9,   name: "Blastoise",              specialties: ["Water","Trade"] },
  { id: 10,  name: "Pidgey",                 specialties: ["Fly","Search"] },
  { id: 11,  name: "Pidgeotto",              specialties: ["Fly","Search"] },
  { id: 12,  name: "Pidgeot",                specialties: ["Fly","Chop"] },
  { id: 13,  name: "Oddish",                 specialties: ["Grow"] },
  { id: 14,  name: "Gloom",                  specialties: ["Grow"] },
  { id: 15,  name: "Vileplume",              specialties: ["Grow","Litter"] },
  { id: 16,  name: "Bellossom",              specialties: ["Grow","Hype"] },
  { id: 17,  name: "Paras",                  specialties: ["Search"] },
  { id: 18,  name: "Parasect",               specialties: ["Search"] },
  { id: 19,  name: "Venonat",                specialties: ["Search"] },
  { id: 20,  name: "Venomoth",               specialties: ["Search"] },
  { id: 21,  name: "Bellsprout",             specialties: ["Grow","Litter"] },
  { id: 22,  name: "Weepinbell",             specialties: ["Grow","Litter"] },
  { id: 23,  name: "Victreebel",             specialties: ["Grow","Chop"] },
  { id: 24,  name: "Slowpoke",               specialties: ["Water","Yawn"] },
  { id: 25,  name: "Slowbro",                specialties: ["Water","Trade"] },
  { id: 26,  name: "Slowking",               specialties: ["Water","Teleport"] },
  { id: 27,  name: "Magnemite",              specialties: ["Generate"] },
  { id: 28,  name: "Magneton",               specialties: ["Generate"] },
  { id: 29,  name: "Magnezone",              specialties: ["Generate","Recycle"] },
  { id: 30,  name: "Onix",                   specialties: ["Crush","Bulldoze"] },
  { id: 31,  name: "Steelix",                specialties: ["Crush","Bulldoze"] },
  { id: 32,  name: "Cubone",                 specialties: ["Build"] },
  { id: 33,  name: "Marowak",                specialties: ["Build"] },
  { id: 34,  name: "Tyrogue",                specialties: ["Trade"] },
  { id: 35,  name: "Hitmonlee",              specialties: ["Trade"] },
  { id: 36,  name: "Hitmonchan",             specialties: ["Trade"] },
  { id: 37,  name: "Hitmontop",              specialties: ["Trade"] },
  { id: 38,  name: "Koffing",                specialties: ["Recycle"] },
  { id: 39,  name: "Weezing",                specialties: ["Recycle"] },
  { id: 40,  name: "Tangela",                specialties: ["Grow","Litter"] },
  { id: 41,  name: "Professor Tangrowth",    specialties: ["Appraise"], isNPC: true },
  { id: 41,  name: "Tangrowth",              specialties: ["Grow","Litter"] },
  { id: 42,  name: "Scyther",                specialties: ["Chop"] },
  { id: 43,  name: "Scizor",                 specialties: ["Chop"] },
  { id: 44,  name: "Pinsir",                 specialties: ["Chop","Build"] },
  { id: 45,  name: "Magikarp",               specialties: ["???"] },
  { id: 46,  name: "Gyarados",               specialties: ["Water"] },
  { id: 47,  name: "Ditto",                  specialties: ["Transform"] },
  { id: 48,  name: "Hoothoot",               specialties: ["Trade","Fly"] },
  { id: 49,  name: "Noctowl",                specialties: ["Trade","Fly"] },
  { id: 50,  name: "Heracross",              specialties: ["Chop","Build"] },
  { id: 51,  name: "Volbeat",                specialties: ["Hype"] },
  { id: 52,  name: "Illumise",               specialties: ["Hype"] },
  { id: 53,  name: "Gulpin",                 specialties: ["Storage"] },
  { id: 54,  name: "Swalot",                 specialties: ["Storage"] },
  { id: 55,  name: "Cacnea",                 specialties: ["Grow"] },
  { id: 56,  name: "Cacturne",               specialties: ["Grow","Litter"] },
  { id: 57,  name: "Combee",                 specialties: ["Litter"] },
  { id: 58,  name: "Vespiquen",              specialties: ["Gather Honey","Search"] },
  { id: 59,  name: "Shellos",                specialties: ["Water"] },
  { id: 59,  name: "Shellos East Sea",       specialties: ["Water"] },
  { id: 60,  name: "Gastrodon",              specialties: ["Water","Trade"] },
  { id: 60,  name: "Gastrodon East Sea",     specialties: ["Water","Trade"] },
  { id: 61,  name: "Drifloon",               specialties: ["Dream Island"] },
  { id: 62,  name: "Drifblim",               specialties: ["Fly","Gather"] },
  { id: 63,  name: "Drilbur",                specialties: ["Search"] },
  { id: 64,  name: "Excadrill",              specialties: ["Search","Chop"] },
  { id: 65,  name: "Timburr",                specialties: ["Build"] },
  { id: 66,  name: "Gurdurr",                specialties: ["Build"] },
  { id: 67,  name: "Conkeldurr",             specialties: ["Build","Crush"] },
  { id: 68,  name: "Litwick",                specialties: ["Burn"] },
  { id: 69,  name: "Lampent",                specialties: ["Burn"] },
  { id: 70,  name: "Chandelure",             specialties: ["Burn"] },
  { id: 71,  name: "Axew",                   specialties: ["Chop"] },
  { id: 72,  name: "Fraxure",                specialties: ["Chop"] },
  { id: 73,  name: "Haxorus",                specialties: ["Chop","Litter"] },
  { id: 74,  name: "Goomy",                  specialties: ["Water"] },
  { id: 75,  name: "Sliggoo",                specialties: ["Water"] },
  { id: 76,  name: "Goodra",                 specialties: ["Water","Trade"] },
  { id: 77,  name: "Cramorant",              specialties: ["Fly","Water"] },
  { id: 78,  name: "Pichu",                  specialties: ["Generate"] },
  { id: 79,  name: "Peakychu",               specialties: ["Illuminate"] },
  { id: 79,  name: "Pikachu",                specialties: ["Generate"] },
  { id: 80,  name: "Raichu",                 specialties: ["Generate","Hype"] },
  { id: 81,  name: "Zubat",                  specialties: ["Search"] },
  { id: 82,  name: "Golbat",                 specialties: ["Search"] },
  { id: 83,  name: "Crobat",                 specialties: ["Search","Chop"] },
  { id: 84,  name: "Meowth",                 specialties: ["Trade"] },
  { id: 85,  name: "Persian",                specialties: ["Trade","Search"] },
  { id: 86,  name: "Psyduck",                specialties: ["Search"] },
  { id: 87,  name: "Golduck",                specialties: ["Search"] },
  { id: 88,  name: "Growlithe",              specialties: ["Burn","Search"] },
  { id: 89,  name: "Arcanine",               specialties: ["Burn","Search"] },
  { id: 90,  name: "Farfetch'd",             specialties: ["Chop","Build"] },
  { id: 91,  name: "Grimer",                 specialties: ["Litter"] },
  { id: 92,  name: "Muk",                    specialties: ["Litter"] },
  { id: 93,  name: "Gastly",                 specialties: ["Gather","Trade"] },
  { id: 94,  name: "Haunter",                specialties: ["Gather","Trade"] },
  { id: 95,  name: "Gengar",                 specialties: ["Gather","Trade"] },
  { id: 96,  name: "Voltorb",                specialties: ["Generate","Explode"] },
  { id: 97,  name: "Electrode",              specialties: ["Generate","Explode"] },
  { id: 98,  name: "Exeggcute",              specialties: ["Grow","Teleport"] },
  { id: 99,  name: "Exeggutor",              specialties: ["Grow","Teleport"] },
  { id: 100, name: "Happiny",                specialties: ["Trade"] },
  { id: 101, name: "Chansey",                specialties: ["Trade"] },
  { id: 102, name: "Blissey",                specialties: ["Trade","Litter"] },
  { id: 103, name: "Elekid",                 specialties: ["Generate"] },
  { id: 104, name: "Electabuzz",             specialties: ["Generate"] },
  { id: 105, name: "Electivire",             specialties: ["Generate","Crush"] },
  { id: 106, name: "Lapras",                 specialties: ["Water"] },
  { id: 107, name: "Munchlax",               specialties: ["Bulldoze"] },
  { id: 108, name: "Mosslax",                specialties: ["Eat"] },
  { id: 108, name: "Snorlax",                specialties: ["Trade","Bulldoze"] },
  { id: 109, name: "Spinarak",               specialties: ["Litter"] },
  { id: 110, name: "Ariados",                specialties: ["Litter"] },
  { id: 111, name: "Mareep",                 specialties: ["Generate","Litter"] },
  { id: 112, name: "Flaaffy",                specialties: ["Generate","Litter"] },
  { id: 113, name: "Ampharos",               specialties: ["Generate","Trade"] },
  { id: 114, name: "Azurill",                specialties: ["Water","Hype"] },
  { id: 115, name: "Marill",                 specialties: ["Water","Hype"] },
  { id: 116, name: "Azumarill",              specialties: ["Water","Build"] },
  { id: 117, name: "Paldean Wooper",         specialties: ["Litter"] },
  { id: 118, name: "Clodsire",               specialties: ["Litter","Bulldoze"] },
  { id: 119, name: "Smeargle",               specialties: ["Paint"] },
  { id: 120, name: "Torchic",                specialties: ["Burn"] },
  { id: 121, name: "Combusken",              specialties: ["Burn","Build"] },
  { id: 122, name: "Blaziken",               specialties: ["Burn","Build"] },
  { id: 123, name: "Wingull",                specialties: ["Water","Fly"] },
  { id: 124, name: "Pelipper",               specialties: ["Water","Fly"] },
  { id: 125, name: "Makuhita",               specialties: ["Build","Bulldoze"] },
  { id: 126, name: "Hariyama",               specialties: ["Build","Bulldoze"] },
  { id: 127, name: "Absol",                  specialties: ["Chop"] },
  { id: 128, name: "Piplup",                 specialties: ["Water"] },
  { id: 129, name: "Prinplup",               specialties: ["Water","Trade"] },
  { id: 130, name: "Empoleon",               specialties: ["Water","Trade"] },
  { id: 131, name: "Audino",                 specialties: ["Trade"] },
  { id: 132, name: "Trubbish",               specialties: ["Recycle"] },
  { id: 133, name: "Garbodor",               specialties: ["Recycle","Litter"] },
  { id: 134, name: "Zorua",                  specialties: ["Trade"] },
  { id: 135, name: "Zoroark",                specialties: ["Trade","Chop"] },
  { id: 136, name: "Minccino",               specialties: ["Gather"] },
  { id: 137, name: "Cinccino",               specialties: ["Gather","Recycle"] },
  { id: 138, name: "Grubbin",                specialties: ["Chop"] },
  { id: 139, name: "Charjabug",              specialties: ["Generate","Chop"] },
  { id: 140, name: "Vikavolt",               specialties: ["Generate","Chop"] },
  { id: 141, name: "Mimikyu",                specialties: ["Trade"] },
  { id: 142, name: "Pawmi",                  specialties: ["Generate"] },
  { id: 143, name: "Pawmo",                  specialties: ["Generate","Crush"] },
  { id: 144, name: "Pawmot",                 specialties: ["Generate","Crush"] },
  { id: 145, name: "Tatsugiri Curly Form",   specialties: ["Trade"] },
  { id: 145, name: "Tatsugiri Droopy Form",  specialties: ["Trade"] },
  { id: 145, name: "Tatsugiri Stretchy Form",specialties: ["Trade"] },
  { id: 146, name: "Ekans",                  specialties: ["Search"] },
  { id: 147, name: "Arbok",                  specialties: ["Search"] },
  { id: 148, name: "Cleffa",                 specialties: ["Hype"] },
  { id: 149, name: "Clefairy",               specialties: ["Hype"] },
  { id: 150, name: "Clefable",               specialties: ["Hype","Trade"] },
  { id: 151, name: "Igglybuff",              specialties: ["Hype"] },
  { id: 152, name: "Jigglypuff",             specialties: ["Hype"] },
  { id: 153, name: "Wigglytuff",             specialties: ["Hype","Trade"] },
  { id: 154, name: "Diglett",                specialties: ["Hype"] },
  { id: 155, name: "Dugtrio",                specialties: ["Hype","Crush"] },
  { id: 156, name: "Machop",                 specialties: ["Build","Gather"] },
  { id: 157, name: "Machoke",                specialties: ["Build","Gather"] },
  { id: 158, name: "Machamp",                specialties: ["Build","Gather"] },
  { id: 159, name: "Geodude",                specialties: ["Crush"] },
  { id: 160, name: "Graveler",               specialties: ["Crush"] },
  { id: 161, name: "Golem",                  specialties: ["Crush","Trade"] },
  { id: 162, name: "Magby",                  specialties: ["Burn"] },
  { id: 163, name: "Magmar",                 specialties: ["Burn"] },
  { id: 164, name: "Magmortar",              specialties: ["Burn","Crush"] },
  { id: 165, name: "Bonsly",                 specialties: ["Bulldoze"] },
  { id: 166, name: "Sudowoodo",              specialties: ["Trade"] },
  { id: 167, name: "Murkrow",                specialties: ["Trade","Fly"] },
  { id: 168, name: "Honchkrow",              specialties: ["Trade","Fly"] },
  { id: 169, name: "Larvitar",               specialties: ["Crush","Bulldoze"] },
  { id: 170, name: "Pupitar",                specialties: ["Crush","Bulldoze"] },
  { id: 171, name: "Tyranitar",              specialties: ["Crush","Bulldoze"] },
  { id: 172, name: "Lotad",                  specialties: ["Water"] },
  { id: 173, name: "Lombre",                 specialties: ["Water"] },
  { id: 174, name: "Ludicolo",               specialties: ["Water","Hype"] },
  { id: 175, name: "Mawile",                 specialties: ["Trade","Build"] },
  { id: 176, name: "Torkoal",                specialties: ["Burn"] },
  { id: 177, name: "Kricketot",              specialties: ["Hype"] },
  { id: 178, name: "Kricketune",             specialties: ["Hype"] },
  { id: 179, name: "Chatot",                 specialties: ["Hype","Fly"] },
  { id: 180, name: "Riolu",                  specialties: ["Build"] },
  { id: 181, name: "Lucario",                specialties: ["Build"] },
  { id: 182, name: "Stereo Rotom",           specialties: ["DJ"] },
  { id: 183, name: "Larvesta",               specialties: ["Burn","Litter"] },
  { id: 184, name: "Volcarona",              specialties: ["Burn","Litter"] },
  { id: 185, name: "Rowlet",                 specialties: ["Grow"] },
  { id: 186, name: "Dartrix",                specialties: ["Grow","Chop"] },
  { id: 187, name: "Decidueye",              specialties: ["Grow","Chop"] },
  { id: 188, name: "Scorbunny",              specialties: ["Burn"] },
  { id: 189, name: "Raboot",                 specialties: ["Burn"] },
  { id: 190, name: "Cinderace",              specialties: ["Burn","Hype"] },
  { id: 191, name: "Skwovet",                specialties: ["Search","Hype"] },
  { id: 192, name: "Greedent",               specialties: ["Party"] },
  { id: 193, name: "Rolycoly",               specialties: ["Burn","Gather"] },
  { id: 194, name: "Carkol",                 specialties: ["Burn","Gather"] },
  { id: 195, name: "Coalossal",              specialties: ["Burn","Gather"] },
  { id: 196, name: "Toxel",                  specialties: ["Generate"] },
  { id: 197, name: "Toxtricity Amped Form",  specialties: ["Generate","Hype"] },
  { id: 197, name: "Toxtricity Low Key Form",specialties: ["Generate","Hype"] },
  { id: 198, name: "Fidough",                specialties: ["Search"] },
  { id: 199, name: "Dachsbun",               specialties: ["Search","Trade"] },
  { id: 200, name: "Charcadet",              specialties: ["Burn"] },
  { id: 201, name: "Armarouge",              specialties: ["Burn","Trade"] },
  { id: 202, name: "Ceruledge",              specialties: ["Burn","Trade"] },
  { id: 203, name: "Glimmet",                specialties: ["Litter"] },
  { id: 204, name: "Glimmora",               specialties: ["Litter"] },
  { id: 205, name: "Gimmighoul",             specialties: ["Collect"] },
  { id: 206, name: "Gholdengo",              specialties: ["Collect"] },
  { id: 207, name: "Vulpix",                 specialties: ["Burn"] },
  { id: 208, name: "Ninetales",              specialties: ["Burn"] },
  { id: 209, name: "Poliwag",                specialties: ["Water"] },
  { id: 210, name: "Poliwhirl",              specialties: ["Water"] },
  { id: 211, name: "Poliwrath",              specialties: ["Water","Build"] },
  { id: 212, name: "Politoed",               specialties: ["Water","Hype"] },
  { id: 213, name: "Abra",                   specialties: ["Teleport"] },
  { id: 214, name: "Kadabra",                specialties: ["Teleport"] },
  { id: 215, name: "Alakazam",               specialties: ["Teleport","Trade"] },
  { id: 216, name: "Mime Jr.",               specialties: ["Gather"] },
  { id: 217, name: "Mr. Mime",               specialties: ["Gather","Build"] },
  { id: 218, name: "Porygon",                specialties: ["Recycle"] },
  { id: 219, name: "Porygon2",               specialties: ["Recycle"] },
  { id: 220, name: "Porygon-Z",              specialties: ["Rarify"] },
  { id: 221, name: "Dratini",                specialties: ["Water"] },
  { id: 222, name: "Dragonair",              specialties: ["Water"] },
  { id: 223, name: "Dragonite",              specialties: ["Water","Fly"] },
  { id: 224, name: "Cyndaquil",              specialties: ["Burn"] },
  { id: 225, name: "Quilava",                specialties: ["Burn"] },
  { id: 226, name: "Typhlosion",             specialties: ["Burn","Trade"] },
  { id: 227, name: "Misdreavus",             specialties: ["Trade"] },
  { id: 228, name: "Mismagius",              specialties: ["Gather","Trade"] },
  { id: 229, name: "Girafarig",              specialties: ["Gather"] },
  { id: 230, name: "Farigiraf",              specialties: ["Gather","Search"] },
  { id: 231, name: "Ralts",                  specialties: ["Teleport"] },
  { id: 232, name: "Kirlia",                 specialties: ["Teleport"] },
  { id: 233, name: "Gardevoir",              specialties: ["Teleport","Trade"] },
  { id: 234, name: "Gallade",                specialties: ["Teleport","Build"] },
  { id: 235, name: "Plusle",                 specialties: ["Generate"] },
  { id: 236, name: "Minun",                  specialties: ["Generate"] },
  { id: 237, name: "Trapinch",               specialties: ["Bulldoze","Litter"] },
  { id: 238, name: "Vibrava",                specialties: ["Bulldoze","Fly"] },
  { id: 239, name: "Flygon",                 specialties: ["Bulldoze","Fly"] },
  { id: 240, name: "Swablu",                 specialties: ["Litter"] },
  { id: 241, name: "Altaria",                specialties: ["Litter","Fly"] },
  { id: 242, name: "Duskull",                specialties: ["Gather"] },
  { id: 243, name: "Dusclops",               specialties: ["Gather"] },
  { id: 244, name: "Dusknoir",               specialties: ["Gather","Trade"] },
  { id: 245, name: "Beldum",                 specialties: ["Recycle"] },
  { id: 246, name: "Metang",                 specialties: ["Recycle"] },
  { id: 247, name: "Metagross",              specialties: ["Recycle","Crush"] },
  { id: 248, name: "Snivy",                  specialties: ["Grow","Litter"] },
  { id: 249, name: "Servine",                specialties: ["Grow","Litter"] },
  { id: 250, name: "Serperior",              specialties: ["Grow","Litter"] },
  { id: 251, name: "Froakie",                specialties: ["Water"] },
  { id: 252, name: "Frogadier",              specialties: ["Water"] },
  { id: 253, name: "Greninja",               specialties: ["Water","Chop"] },
  { id: 254, name: "Dedenne",                specialties: ["Search"] },
  { id: 255, name: "Noibat",                 specialties: ["Search"] },
  { id: 256, name: "Noivern",                specialties: ["Search","Fly"] },
  { id: 257, name: "Rookidee",               specialties: ["Chop"] },
  { id: 258, name: "Corvisquire",            specialties: ["Chop"] },
  { id: 259, name: "Corviknight",            specialties: ["Chop","Fly"] },
  { id: 260, name: "Dreepy",                 specialties: ["Gather","Search"] },
  { id: 261, name: "Drakloak",               specialties: ["Gather","Search"] },
  { id: 262, name: "Dragapult",              specialties: ["Gather","Trade"] },
  { id: 263, name: "Sprigatito",             specialties: ["Grow"] },
  { id: 264, name: "Floragato",              specialties: ["Grow"] },
  { id: 265, name: "Meowscarada",            specialties: ["Grow","Hype"] },
  { id: 266, name: "Wattrel",                specialties: ["Generate"] },
  { id: 267, name: "Kilowattrel",            specialties: ["Generate","Fly"] },
  { id: 268, name: "Tinkatink",              specialties: ["Build"] },
  { id: 269, name: "Tinkatuff",              specialties: ["Build"] },
  { id: 270, name: "Tinkaton",               specialties: ["Engineer"] },
  { id: 271, name: "Aerodactyl",             specialties: ["Fly"] },
  { id: 272, name: "Cranidos",               specialties: ["Crush"] },
  { id: 273, name: "Rampardos",              specialties: ["Crush","Litter"] },
  { id: 274, name: "Shieldon",               specialties: ["Crush"] },
  { id: 275, name: "Bastiodon",              specialties: ["Crush","Litter"] },
  { id: 276, name: "Tyrunt",                 specialties: ["Crush"] },
  { id: 277, name: "Tyrantrum",              specialties: ["Crush","Litter"] },
  { id: 278, name: "Amaura",                 specialties: ["Crush"] },
  { id: 279, name: "Aurorus",                specialties: ["Crush","Litter"] },
  { id: 280, name: "Eevee",                  specialties: ["Trade"] },
  { id: 281, name: "Vaporeon",               specialties: ["Water"] },
  { id: 282, name: "Jolteon",                specialties: ["Generate"] },
  { id: 283, name: "Flareon",                specialties: ["Burn"] },
  { id: 284, name: "Espeon",                 specialties: ["Gather"] },
  { id: 285, name: "Umbreon",                specialties: ["Search"] },
  { id: 286, name: "Leafeon",                specialties: ["Grow"] },
  { id: 287, name: "Glaceon",                specialties: ["Trade"] },
  { id: 288, name: "Sylveon",                specialties: ["Hype"] },
  { id: 289, name: "Kyogre",                 specialties: ["???"],          legendary: true },
  { id: 290, name: "Raikou",                 specialties: ["Generate"],     legendary: true },
  { id: 291, name: "Entei",                  specialties: ["Burn"],         legendary: true },
  { id: 292, name: "Suicune",                specialties: ["Water"],        legendary: true },
  { id: 293, name: "Volcanion",              specialties: ["Burn"],         legendary: true },
  { id: 294, name: "Articuno",               specialties: ["Fly"],          legendary: true },
  { id: 295, name: "Zapdos",                 specialties: ["Fly"],          legendary: true },
  { id: 296, name: "Moltres",                specialties: ["Fly"],          legendary: true },
  { id: 297, name: "Lugia",                  specialties: ["???"],          legendary: true },
  { id: 298, name: "Ho-Oh",                  specialties: ["???"],          legendary: true },
  { id: 299, name: "Mewtwo",                 specialties: ["Teleport"],     legendary: true },
  { id: 300, name: "Mew",                    specialties: ["Teleport"],     legendary: true },
];

// Map old national-dex-style names to old data for habitats/time/weather/locations
const OLD_FILE = path.join(__dirname, '../src/data/scraped/pokemon-serebii.json');
const oldData = JSON.parse(fs.readFileSync(OLD_FILE, 'utf8'));

// Build lookup by name (lowercase)
const oldByName = {};
for (const p of oldData) {
  oldByName[p.name.toLowerCase()] = p;
}

// Helper: get image URL from Pokopia ID and name
function getImage(pokopiaId, name) {
  // Serebii uses the Pokopia ID for their image URLs
  const padded = String(pokopiaId).padStart(3, '0');
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  // Try slug variant for special forms
  if (name.includes('East Sea')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-eastsea.png`;
  if (name.includes('Amped')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-amped.png`;
  if (name.includes('Low Key')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-lowkey.png`;
  if (name.includes('Curly')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-curly.png`;
  if (name.includes('Droopy')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-droopy.png`;
  if (name.includes('Stretchy')) return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-stretchy.png`;
  if (name === 'Peakychu') return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-peakychu.png`;
  if (name === 'Mosslax') return `https://www.serebii.net/pokemonpokopia/pokemon/143-mosslax.png`;
  if (name === 'Stereo Rotom') return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-stereorotom.png`;
  if (name === 'Professor Tangrowth') return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-professortangrowth.png`;
  if (name === 'Paldean Wooper') return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}-paldean.png`;
  return `https://www.serebii.net/pokemonpokopia/pokemon/${padded}.png`;
}

// Determine rarity
function getRarity(entry) {
  if (entry.legendary) return 'Legendary';
  // Check old data
  const old = oldByName[entry.name.toLowerCase()];
  if (old) return old.rarity || 'Common';
  return 'Common';
}

// Get habitats from old data
function getHabitats(name) {
  const old = oldByName[name.toLowerCase()];
  if (old && old.habitats && old.habitats.length) return old.habitats;
  return [];
}

// Get time from old data
function getTime(name) {
  const old = oldByName[name.toLowerCase()];
  if (!old) return 'Any';
  const times = old.timeWeatherPerHabitat?.flatMap(t => t.times || []) || old.time_conditions || [];
  const unique = [...new Set(times)];
  if (!unique.length || unique.length === 4) return 'Any';
  return unique.join(',');
}

// Get weather from old data
function getWeather(name) {
  const old = oldByName[name.toLowerCase()];
  if (!old) return 'Any';
  const weathers = old.timeWeatherPerHabitat?.flatMap(t => t.weathers || []) || [];
  const unique = [...new Set(weathers)];
  if (!unique.length || unique.length === 3) return 'Any';
  return unique.join(',');
}

// Get locations from old data
function getLocations(name) {
  const old = oldByName[name.toLowerCase()];
  if (old && old.habitats && old.habitats.length > 0) {
    // Derive from known habitat-to-location mapping
  }
  return [];
}

// Build deduplicated list (skip NPC entries, keep forms)
const entries = OFFICIAL_LIST.filter(e => !e.isNPC);

// Generate TS
let ts = `// pokemon-data.ts — Auto-generated from official Pokopia dex (sequential 1-300, Mew = #300)
// DO NOT EDIT: regenerate with scripts/rebuild-from-official-list.js

export type Specialty =
  | "Grow" | "Build" | "Chop" | "Burn" | "Water" | "Gather" | "Generate"
  | "Search" | "Fly" | "Trade" | "Crush" | "Bulldoze" | "Litter" | "Hype"
  | "Teleport" | "Transform" | "Recycle" | "Storage" | "Paint" | "Yawn"
  | "Explode" | "Eat" | "Gather Honey" | "Dream Island" | "Illuminate"
  | "DJ" | "Party" | "Collect" | "Rarify" | "Engineer" | "Appraise" | "???";

export interface Pokemon {
  id: number;           // Pokopia dex number (1-300)
  nationalDex: number | null;
  name: string;
  types: Specialty[];
  habitats: string[];
  image: string;
  rarity: "Common" | "Rare" | "Legendary";
  specialties: Specialty[];
  locations: string[];
  time: string;         // "Any" or "Morning,Day,Evening,Night" subset
  weather: string;      // "Any" or "Sun,Cloud,Rain" subset
}

export type RawPokemon = Pokemon;

// Rarity order for filtering
export const rarities = ["Common", "Rare", "Legendary"] as const;

// All Pokemon in Pokopia Dex order (1-300, Mew = #300)
// Forms sharing a number: Shellos #59, Gastrodon #60, Tatsugiri #145, Toxtricity #197, Pikachu/Peakychu #79, Snorlax/Mosslax #108
const _rawPokemonList: RawPokemon[] = [
`;

for (const entry of entries) {
  const habitats = getHabitats(entry.name);
  const time = getTime(entry.name);
  const weather = getWeather(entry.name);
  const rarity = getRarity(entry);
  const image = getImage(entry.id, entry.name);
  const types = entry.specialties.map(s => `"${s}"`).join(',');
  const habitatsStr = habitats.map(h => `"${h.replace(/"/g, '\\"')}"`).join(',');

  ts += `  { id: ${entry.id}, nationalDex: null, name: "${entry.name}", types: [${types}], habitats: [${habitatsStr}], image: "${image}", rarity: "${rarity}", specialties: [${types}], locations: [], time: "${time}", weather: "${weather}" },\n`;
}

ts += `];

// Location → pokemon mapping (populated from habitats data)
function getLocationsForPokemon(_name: string): string[] {
  return [];
}

export const pokemonList: Pokemon[] = _rawPokemonList.map(pokemon => ({
  ...pokemon,
  locations: getLocationsForPokemon(pokemon.name),
}));
`;

// Append the rest of the file (HabitatInfo, CloudIslandPost, MysteryGift, etc.)
const existingFile = fs.readFileSync(path.join(__dirname, '../src/lib/pokemon-data.ts'), 'utf8');
const habitatSection = existingFile.match(/\/\/ Habitat detailed info[\s\S]*/);
if (habitatSection) {
  ts += '\n' + habitatSection[0];
}

fs.writeFileSync(path.join(__dirname, '../src/lib/pokemon-data.ts'), ts);

const unique = [...new Set(entries.map(e => e.id))];
console.log(`Written ${entries.length} entries, ${unique.length} unique IDs`);
console.log(`ID range: ${Math.min(...unique)} - ${Math.max(...unique)}`);
console.log(`Mew: ${entries.find(e => e.name === 'Mew')?.id}`);
console.log(`Legendaries: ${entries.filter(e => e.legendary).map(e => `#${e.id} ${e.name}`).join(', ')}`);
