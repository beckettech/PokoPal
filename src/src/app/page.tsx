import Link from "next/link";

const regions = [
  {
    name: "Withered Wastelands",
    description: "Fuchsia City area",
    size: "240x240",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Bleak Beach",
    description: "Vermilion City coast",
    size: "272x272",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Rocky Ridges",
    description: "Pewter City mountains",
    size: "272x272",
    color: "from-gray-500 to-slate-700",
  },
  {
    name: "Sparkling Skylands",
    description: "Celadon & Saffron",
    size: "352x352",
    color: "from-purple-500 to-pink-600",
  },
  {
    name: "Palette Town",
    description: "Pallet Town starter area",
    size: "384x384",
    color: "from-green-500 to-emerald-600",
  },
];

export default function MapPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🗺️ Region Maps</h1>
      <p className="text-gray-600 mb-6">
        Explore all 5 regions of Pokopia
      </p>

      <div className="grid gap-4">
        {regions.map((region) => (
          <Link
            key={region.name}
            href={`/map/${region.name.toLowerCase().replace(/\s+/g, "-")}`}
            className="block"
          >
            <div
              className={`bg-gradient-to-r ${region.color} rounded-xl p-4 text-white`}
            >
              <h2 className="font-bold text-lg">{region.name}</h2>
              <p className="text-white/80 text-sm">{region.description}</p>
              <p className="text-white/60 text-xs mt-1">{region.size} blocks</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-xl">
        <h3 className="font-bold mb-2">📊 Map Features</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Pokémon spawn locations</li>
          <li>• Collectible items</li>
          <li>• Recipe locations</li>
          <li>• Material nodes</li>
          <li>• NPC locations</li>
        </ul>
      </div>
    </div>
  );
}
