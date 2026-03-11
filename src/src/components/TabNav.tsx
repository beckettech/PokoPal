"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Map", href: "/", icon: "🗺️" },
  { name: "Pokédex", href: "/pokedex", icon: "📖" },
  { name: "Habitats", href: "/habitats", icon: "🏠" },
  { name: "Chat", href: "/chat", icon: "💬" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || 
            (tab.href !== "/" && pathname.startsWith(tab.href));
          
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive 
                  ? "text-red-600" 
                  : "text-gray-500"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-1">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
