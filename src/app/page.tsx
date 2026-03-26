'use client'

import { useAppStore } from "@/lib/store";
import { HomePage } from "@/components/pages/home-page";
import { DexPage } from "@/components/pages/dex-page";
import { HabitatDexPage } from "@/components/pages/habitat-dex-page";
import { MapPage } from "@/components/pages/map-page";
import { RequestsPage } from "@/components/pages/requests-page";
import { CloudIslandsPage } from "@/components/pages/cloud-islands-page";
import { DreamIslandsPage } from "@/components/pages/dream-islands-page";
import { RelicsPage } from "@/components/pages/relics-page";
import { ItemsPage } from "@/components/pages/items-page";
import { MysteryGiftsPage } from "@/components/pages/mystery-gifts-page";
import { ChatPage } from "@/components/pages/chat-page";
import { CoinShopPage } from "@/components/pages/coin-shop-page";
import { SettingsPage } from "@/components/pages/settings-page";
import { MobileAdBanner } from "@/components/MobileAdBanner";

export default function Home() {
  const currentPage = useAppStore((state) => state.currentPage);
  
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "dex":
        return <DexPage />;
      case "habitat-dex":
        return <HabitatDexPage />;
      case "map":
        return <MapPage />;
      case "requests":
        return <RequestsPage />;
      case "cloud-islands":
        return <CloudIslandsPage />;
      case "dream-islands":
        return <DreamIslandsPage />;
      case "relics":
        return <RelicsPage />;
      case "items":
        return <ItemsPage />;
      case "mystery-gifts":
        return <MysteryGiftsPage />;
      case "chat":
        return <ChatPage />;
      case "coin-shop":
        return <CoinShopPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <main className="h-screen bg-gradient-to-b from-red-500 to-red-700 overflow-hidden">
      <div key={currentPage} className="h-full">
        {renderPage()}
      </div>
      <MobileAdBanner />
    </main>
  );
}
