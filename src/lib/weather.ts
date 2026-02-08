// Turkish weather condition mappings (WMO Weather interpretation codes)
// https://open-meteo.com/en/docs
export const weatherConditions: Record<number, string> = {
  0: "Açık",
  1: "Çoğunlukla Açık",
  2: "Parçalı Bulutlu",
  3: "Kapalı",
  45: "Sisli",
  48: "Kırağılı Sis",
  51: "Hafif Çisenti",
  53: "Orta Çisenti",
  55: "Yoğun Çisenti",
  56: "Dondurucu Çisenti",
  57: "Yoğun Dondurucu Çisenti",
  61: "Hafif Yağmur",
  63: "Orta Yağmur",
  65: "Şiddetli Yağmur",
  66: "Dondurucu Yağmur",
  67: "Şiddetli Dondurucu Yağmur",
  71: "Hafif Kar",
  73: "Orta Kar",
  75: "Yoğun Kar",
  77: "Kar Taneleri",
  80: "Hafif Sağanak",
  81: "Orta Sağanak",
  82: "Şiddetli Sağanak",
  85: "Hafif Kar Sağanağı",
  86: "Yoğun Kar Sağanağı",
  95: "Gök Gürültülü Fırtına",
  96: "Dolu ile Fırtına",
  99: "Şiddetli Dolu Fırtınası",
};

// Turkish day names
export const turkishDays = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

// Turkish month names
export const turkishMonths = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

// Format date in Turkish
export function formatTurkishDate(date: Date): string {
  const day = date.getDate();
  const month = turkishMonths[date.getMonth()];
  const dayName = turkishDays[date.getDay()];
  return `${day} ${month} ${dayName}`;
}

// Weather data interface
export interface WeatherData {
  temperature: number;
  conditionCode: number;
  condition: string;
}

// İzmir Konak coordinates
export const LOCATION = {
  name: "İzmir · Konak",
  latitude: 38.4192,
  longitude: 27.1287,
};

// Fetch weather from Open-Meteo (no API key required)
export async function fetchWeather(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current=temperature_2m,weather_code&timezone=Europe/Istanbul`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const temperature = Math.round(data.current.temperature_2m);
    const conditionCode = data.current.weather_code;
    const condition = weatherConditions[conditionCode] || "Bilinmiyor";

    return { temperature, conditionCode, condition };
  } catch (error) {
    console.error("Weather fetch error:", error);
    // Return fallback data
    return {
      temperature: 15,
      conditionCode: 2,
      condition: "Parçalı Bulutlu",
    };
  }
}

// Generate static HTML for Kindle
export function generateStaticHTML(
  date: string,
  temperature: number,
  condition: string,
  location: string
): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hava Durumu</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html, body {
      height: 100%;
      background: #fff;
      color: #000;
      font-family: Georgia, "Times New Roman", serif;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }
    .date {
      font-size: 1.75rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 3rem;
    }
    .temperature {
      font-size: 10rem;
      letter-spacing: -0.02em;
      line-height: 1;
      margin-bottom: 1.5rem;
    }
    .condition {
      font-size: 1.5rem;
      letter-spacing: 0.02em;
      margin-bottom: 4rem;
    }
    .location {
      font-size: 0.875rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      opacity: 0.6;
      font-family: system-ui, sans-serif;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="date">${date}</div>
    <div class="temperature">${temperature}°</div>
    <div class="condition">${condition}</div>
    <div class="location">${location}</div>
  </div>
</body>
</html>`;
}
