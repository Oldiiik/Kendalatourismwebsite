import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

// Helper to get coordinates using OpenWeatherMap Geocoding (if needed) or just use Weather API directly with city name
// OpenWeatherMap Current Weather API supports `q={city name}` directly.

app.get("/", async (c) => {
    const city = c.req.query("city") || "Almaty";
    const lang = c.req.query("lang") || "en";
    
    const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    
    // Get the OpenWeatherMap API Key from the env table
    // User specified: "OPENWEATHER_API column 1st row"
    const { data: envData, error: envError } = await supabase
        .from('env')
        .select('OPENWEATHER_API')
        .limit(1)
        .single();

    const apiKey = envData?.OPENWEATHER_API;

    // Map frontend 'kz' to OWM 'kk'
    const owmLangMap: Record<string, string> = { 'kz': 'kk', 'ru': 'ru', 'en': 'en' };
    const owmLang = owmLangMap[lang] || 'en';

    if (!apiKey) {
        console.error("OpenWeather API Key missing from env table", envError);
        return c.json({ error: "Weather API Configuration Missing" }, 500);
    }

    try {
        // Use OpenWeatherMap API
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=${owmLang}`);
        const data = await weatherRes.json();
        
        if (!weatherRes.ok) {
            console.error("OpenWeatherMap Error:", data);
            return c.json({ error: data.message || "Weather provider error" }, weatherRes.status);
        }

        const temp = data.main.temp;
        const feels_like = data.main.feels_like;
        const wind = data.wind.speed;
        const pressure = data.main.pressure;
        const humidity = data.main.humidity;
        const weatherCode = data.weather[0]?.id; // 800 is clear, 2xx thunderstorm, etc.
        const weatherMain = data.weather[0]?.main;
        const weatherDesc = data.weather[0]?.description;

        // Determine Difficulty (Nomadic Logic)
        let difficulty = "GREEN";
        let warning = "Nomadic conditions are optimal.";

        // Localized Warnings
        const warnings: any = {
            en: {
                optimal: "Nomadic conditions are optimal.",
                wind: "High Winds / Buran potential.",
                snow: "Heavy Snowfall. Roads may be closed.",
                extreme: "Extreme Temperature.",
                challenge: "Challenging conditions. Check your equipment."
            },
            ru: {
                optimal: "Условия оптимальны для кочевки.",
                wind: "Сильный ветер / Буран.",
                snow: "Снегопад. Дороги могут быть закрыты.",
                extreme: "Экстремальная температура.",
                challenge: "Сложные условия. Проверьте снаряжение."
            },
            kz: {
                optimal: "Көш үшін қолайлы жағдай.",
                wind: "Қатты жел / Боран қаупі.",
                snow: "Қалың қар. Жолдар жабық болуы мүмкін.",
                extreme: "Ауа райы өте қатал.",
                challenge: "Қиын жағдай. Жабдықтарды тексеріңіз."
            }
        };

        const t = warnings[lang] || warnings['en'];
        warning = t.optimal;
        
        // Logic similar to previous implementation but adapted for OWM data
        // Wind is m/s
        // Temp is Celsius (units=metric)
        
        if (wind > 15 || temp < -20 || temp > 40 || (weatherCode >= 600 && weatherCode < 700)) { // 6xx is Snow
            difficulty = "RED";
            warning = wind > 15 ? t.wind : 
                      (weatherCode >= 600 && weatherCode < 700) ? t.snow : t.extreme;
        } else if (wind > 10 || temp < -10 || temp > 35 || (weatherCode >= 200 && weatherCode < 600)) { // Thunderstorm, Drizzle, Rain
            difficulty = "YELLOW";
            warning = t.challenge;
        }

        return c.json({
            city: data.name,
            coords: { lat: data.coord.lat, lng: data.coord.lon },
            main: {
                temp: temp,
                feels_like: feels_like,
                humidity: humidity,
                pressure: pressure
            },
            wind: {
                speed: wind,
                deg: data.wind.deg
            },
            weather: [
                { main: weatherMain, description: weatherDesc }
            ],
            difficulty,
            warning,
            provider: "OpenWeatherMap"
        });
    } catch (err: any) {
        console.error("Weather fetch failed:", err);
        return c.json({ error: "Failed to fetch data: " + err.message }, 500);
    }
});

export default app;
