import App from "@/App";
import { WallpaperProvider } from "../context/WallpaperContext";
import { NotificationProvider } from "../context/NotificationContext";

export default function HomePage() {
  return (
    <NotificationProvider>
      <WallpaperProvider>
        <App />
      </WallpaperProvider>
    </NotificationProvider>
  );
}
