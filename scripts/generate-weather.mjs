/**
 * Weather Dashboard Generator for Kindle E-ink
 * Fetches weather from Open-Meteo and generates static HTML
 * 
 * Location: İzmir Konak (Göztepe Mahallesi)
 * Language: Turkish
 */

const LOCATION = {
  name: "İzmir · Konak",
  latitude: 38.4192,
  longitude: 27.1287,
};

// Turkish day names
const turkishDays = [
  "Pazar", "Pazartesi", "Salı", "Çarşamba",
  "Perşembe", "Cuma", "Cumartesi"
];

// Turkish month names  
const turkishMonths = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

// WMO Weather codes to Turkish descriptions
const weatherConditions = {
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

// Weather code to SVG icon mapping
const weatherIcons = {
  0: "sun",
  1: "sun",
  2: "cloud-sun",
  3: "cloud",
  45: "cloud-fog",
  48: "cloud-fog",
  51: "cloud-drizzle",
  53: "cloud-drizzle",
  55: "cloud-drizzle",
  56: "cloud-drizzle",
  57: "cloud-drizzle",
  61: "cloud-rain",
  63: "cloud-rain",
  65: "cloud-rain",
  66: "cloud-rain",
  67: "cloud-rain",
  71: "snowflake",
  73: "snowflake",
  75: "snowflake",
  77: "snowflake",
  80: "cloud-rain",
  81: "cloud-rain",
  82: "cloud-rain",
  85: "snowflake",
  86: "snowflake",
  95: "cloud-lightning",
  96: "cloud-lightning",
  99: "cloud-lightning",
};

// Simple SVG icons (inline for Kindle compatibility)
const svgIcons = {
  sun: `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
  "cloud-sun": `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
  cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  "cloud-fog": `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>`,
  "cloud-drizzle": `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>`,
  "cloud-rain": `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
  "cloud-lightning": `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`,
  snowflake: `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>`,
};

function formatTurkishDate(date) {
  const day = date.getDate();
  // Capitalize first letter only (not all uppercase)
  const month = turkishMonths[date.getMonth()].charAt(0).toUpperCase() + turkishMonths[date.getMonth()].slice(1).toLowerCase();
  const year = date.getFullYear();
  const dayName = turkishDays[date.getDay()];
  return { datePart: `${day} ${month} ${year}`, dayName };
}

async function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LOCATION.latitude}&longitude=${LOCATION.longitude}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&timezone=Europe/Istanbul&forecast_hours=4`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  const current = {
    temperature: Math.round(data.current.temperature_2m),
    conditionCode: data.current.weather_code,
    condition: weatherConditions[data.current.weather_code] || "Bilinmiyor",
  };
  
  // Get hourly forecast for next 4 hours
  const hourly = [];
  for (let i = 0; i < 4; i++) {
    const time = new Date(data.hourly.time[i]);
    hourly.push({
      hour: time.getHours().toString().padStart(2, '0') + ':00',
      temperature: Math.round(data.hourly.temperature_2m[i]),
      conditionCode: data.hourly.weather_code[i],
      condition: weatherConditions[data.hourly.weather_code[i]] || "Bilinmiyor",
    });
  }
  
  return { current, hourly };
}

function generateHTML(dateInfo, weather, location) {
  const iconKey = weatherIcons[weather.current.conditionCode] || "cloud";
  const icon = svgIcons[iconKey];

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta http-equiv="refresh" content="3600">
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
      font-family: system-ui, -apple-system, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      min-height: calc(100vh + 50px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      padding-bottom: 52px;
      text-align: center;
    }
    .date {
      font-size: 3.5rem;
      font-weight: bold;
      letter-spacing: 0.02em;
      margin-bottom: 0.5rem;
    }
    .day-name {
      font-size: 3.5rem;
      font-weight: bold;
      letter-spacing: 0.02em;
      margin-bottom: 3rem;
    }
    .main-weather {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }
    .icon {
      flex-shrink: 0;
    }
    .temperature {
      font-size: 10rem;
      letter-spacing: -0.02em;
      line-height: 1;
    }
    .condition {
      font-size: 3rem;
      letter-spacing: 0.02em;
      margin-bottom: 3rem;
    }
    .location {
      font-size: 0.875rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      opacity: 0.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="date">${dateInfo.datePart}</div>
    <div class="day-name">${dateInfo.dayName}</div>
    <div class="main-weather">
      <div class="icon">${icon}</div>
      <div class="temperature">${weather.current.temperature}°</div>
    </div>
    <div class="condition">${weather.current.condition}</div>
    <div class="location">${location}</div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('Fetching weather data...');
  
  const weather = await fetchWeather();
  const now = new Date();
  const dateInfo = formatTurkishDate(now);
  
  console.log(`Current: ${weather.current.temperature}°C, ${weather.current.condition}`);
  console.log(`Hourly forecast: ${weather.hourly.map(h => `${h.hour}: ${h.temperature}°`).join(', ')}`);
  
  const html = generateHTML(dateInfo, weather, LOCATION.name);
  
  // Create dist directory and write file
  const fs = await import('fs');
  const path = await import('path');
  
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(distDir, 'index.html'), html);
  console.log('Generated dist/index.html');
}

main().catch(console.error);
