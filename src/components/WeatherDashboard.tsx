import { useEffect, useState } from "react";
import {
  fetchWeather,
  formatTurkishDate,
  generateStaticHTML,
  weatherIcons,
  LOCATION,
  type WeatherData,
} from "@/lib/weather";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  type LucideIcon,
} from "lucide-react";

const iconComponents: Record<string, LucideIcon> = {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
};

export default function WeatherDashboard() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [date, setDate] = useState<string>("");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    // Set Turkish date
    const now = new Date();
    setDate(formatTurkishDate(now));

    // Fetch weather
    fetchWeather().then(setWeather);
  }, []);

  const handleExportClick = () => {
    if (!weather) return;
    const html = generateStaticHTML(
      date,
      weather.temperature,
      weather.condition,
      LOCATION.name
    );
    navigator.clipboard.writeText(html);
    setShowExport(true);
    setTimeout(() => setShowExport(false), 2000);
  };

  if (!weather) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground opacity-40">Yükleniyor...</div>
      </div>
    );
  }

  const iconName = weatherIcons[weather.conditionCode] || "Cloud";
  const IconComponent = iconComponents[iconName] || Cloud;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-8">
      {/* Main content - centered */}
      <div className="flex flex-col items-center justify-center text-center flex-1">
        {/* Date */}
        <div className="date-display mb-12 md:mb-16">{date}</div>

        {/* Weather icon */}
        <IconComponent size={64} strokeWidth={1.5} className="mb-6" />

        {/* Temperature - Hero element */}
        <div className="temperature-display mb-6">{weather.temperature}°</div>

        {/* Weather condition */}
        <div className="condition-display mb-16 md:mb-24">
          {weather.condition}
        </div>

        {/* Location */}
        <div className="location-display">{LOCATION.name}</div>
      </div>

      {/* Export button - only visible on hover/touch, positioned at bottom */}
      <button
        onClick={handleExportClick}
        className="fixed bottom-6 right-6 px-4 py-2 text-sm font-sans border border-foreground/20 bg-background text-foreground/60 hover:text-foreground hover:border-foreground transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
        title="Statik HTML'i panoya kopyala"
      >
        {showExport ? "Kopyalandı!" : "HTML Dışa Aktar"}
      </button>
    </div>
  );
}
