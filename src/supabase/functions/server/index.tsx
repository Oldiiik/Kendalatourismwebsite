import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import weatherApp from "./weather_config.tsx";

const app = new Hono();

app.onError((err, c) => {
    if (err.message && err.message.includes("connection closed before message completed")) {
        return c.text("", 204);
    }
    console.error("Hono error:", err);
    return c.json({ error: err.message }, 500);
});

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-user-token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const getUser = async (c: any) => {
    try {
        let token = c.req.header('x-user-token');
        
        if (!token) {
            const authHeader = c.req.header('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            console.log("No authorization token found");
            return null;
        }
        
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        );
        
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) {
            // Suppress common JWT errors that just mean "not logged in" or "bad token"
            if (error.message.includes("missing sub claim") || error.message.includes("invalid claim")) {
                console.log("Auth warning: Invalid token claims (" + error.message + ")");
            } else {
                console.error("Auth verification error:", error.message);
            }
            return null;
        }
        if (!user) {
            console.log("No user found for token");
            return null;
        }
        console.log("User authenticated:", user.id);
        return user;
    } catch (e) {
        console.error("Auth verification failed:", e);
        return null;
    }
};

// Health
app.get("/make-server-3ab99f71/health", (c) => c.json({ status: "ok" }));

// --- WEATHER ---
app.route("/make-server-3ab99f71/weather", weatherApp);

// --- MAP CONFIG ---
app.get("/make-server-3ab99f71/maps-config", async (c) => {
    try {
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { data: envData, error } = await supabase
            .from('env')
            .select('GOOGLE_MAPS_API')
            .limit(1)
            .single();

        if (error) {
            console.error("Error fetching Maps API from env table:", error);
            // Fallback to system env var if table fetch fails
            const fallback = Deno.env.get("GOOGLE_MAPS_API_KEY");
            if (fallback) return c.json({ apiKey: fallback });
            return c.json({ error: "Maps API key not found" }, 404);
        }

        if (!envData?.GOOGLE_MAPS_API) {
             const fallback = Deno.env.get("GOOGLE_MAPS_API_KEY");
             if (fallback) return c.json({ apiKey: fallback });
             return c.json({ error: "Maps API key column empty" }, 404);
        }

        return c.json({ apiKey: envData.GOOGLE_MAPS_API });
    } catch (e: any) {
        return c.json({ error: "Server error: " + e.message }, 500);
    }
});

// --- PROFILE ---
app.get("/make-server-3ab99f71/profile", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const profile = await kv.get(`profile:${user.id}`);
        return c.json(profile || { 
            email: user.email, 
            level: 'Explorer Lvl. 1',
            name: user.user_metadata?.name || 'Traveler'
        });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/profile", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const data = await c.req.json();
        await kv.set(`profile:${user.id}`, { ...data, email: user.email });
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

// --- WISHLIST ---
app.get("/make-server-3ab99f71/wishlist", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const wishlist = (await kv.get(`wishlist:${user.id}`)) || [];
        return c.json(wishlist);
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/wishlist", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const newItem = await c.req.json();
        const currentList = (await kv.get(`wishlist:${user.id}`)) || [];
        
        // Avoid duplicates
        if (!currentList.some((i: any) => i.id === newItem.id)) {
             const updatedList = [...currentList, newItem];
             await kv.set(`wishlist:${user.id}`, updatedList);
        }
        
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/wishlist/:id", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const id = c.req.param('id');
        const currentList = (await kv.get(`wishlist:${user.id}`)) || [];
        
        const updatedList = currentList.filter((i: any) => i.id !== id);
        await kv.set(`wishlist:${user.id}`, updatedList);
        
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

// --- BOOKINGS / TRIPS ---
app.get("/make-server-3ab99f71/bookings", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        console.log(`Fetching bookings for user: ${user.id}`);
        const bookings = (await kv.get(`bookings:${user.id}`)) || [];
        console.log(`Found ${bookings.length} bookings`);
        return c.json(bookings);
    } catch (e: any) {
        console.error("Error fetching bookings:", e);
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/bookings", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const trip = await c.req.json();
        console.log(`Saving new booking for user: ${user.id}`, trip.title);
        const currentTrips = (await kv.get(`bookings:${user.id}`)) || [];
        
        const newTrip = { 
            ...trip, 
            id: crypto.randomUUID(), 
            date_created: new Date().toISOString() 
        };
        
        const updatedTrips = [...currentTrips, newTrip];
        await kv.set(`bookings:${user.id}`, updatedTrips);
        console.log(`Updated bookings count: ${updatedTrips.length}`);
        
        return c.json({ success: true, booking: newTrip });
    } catch (e: any) {
        console.error("Error saving booking:", e);
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.put("/make-server-3ab99f71/bookings/:id", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const id = c.req.param('id');
        const updatedData = await c.req.json();
        const currentTrips = (await kv.get(`bookings:${user.id}`)) || [];
        
        const index = currentTrips.findIndex((t: any) => t.id === id);
        if (index === -1) return c.json({ error: "Trip not found" }, 404);
        
        currentTrips[index] = { ...currentTrips[index], ...updatedData, id };
        await kv.set(`bookings:${user.id}`, currentTrips);
        
        return c.json({ success: true, booking: currentTrips[index] });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/bookings/:id", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const id = c.req.param('id');
        const currentTrips = (await kv.get(`bookings:${user.id}`)) || [];
        
        const remainingTrips = currentTrips.filter((t: any) => t.id !== id);
        await kv.set(`bookings:${user.id}`, remainingTrips);
        
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: "Database error: " + e.message }, 500);
    }
});

// --- AI SESSIONS ---
app.get("/make-server-3ab99f71/ai/sessions", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const sessions = (await kv.get(`ai_sessions:${user.id}`)) || [];
        return c.json(sessions);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/ai/sessions", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const sessions = await c.req.json();
        await kv.set(`ai_sessions:${user.id}`, sessions);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- AI (GEMINI) ---
app.post("/make-server-3ab99f71/ai/chat", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { message } = await c.req.json();
        
        // Get user's chat history
        const chatHistory = (await kv.get(`chat_history:${user.id}`)) || [];
        
        const apiKey = Deno.env.get("GEMINI_API_KEY");
        if (!apiKey) return c.json({ reply: "AI Service is resting. Please try again later." });

        const MODEL = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [{ parts: [{ text: message }] }],
            system_instruction: {
                parts: [{ text: "You are Kendala AI, an elite travel logistics engine for Kazakhstan. Use nomadic metaphors but keep it functional." }]
            }
        };

        let response: Response | null = null;
        const MAX_RETRIES = 3;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody)
            });
            if (response.ok || (response.status !== 503 && response.status !== 429)) break;
            if (attempt < MAX_RETRIES - 1) {
                await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
            }
        }

        if (!response || !response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Gemini API error:", errorData);

            if (response.status === 429) {
                return c.json({ reply: "The digital eagle rests upon the mountain peak. The winds of data are calm. Please wait while the cosmic energies realign." });
            }
            
            return c.json({ reply: `The connection is hazy (${response.status}). The spirits are silent.` });
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated (Check safety filters).";
        
        // Save chat history for this user
        const newChatEntry = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            message,
            reply
        };
        const updatedHistory = [...chatHistory, newChatEntry];
        // Keep only last 50 messages
        if (updatedHistory.length > 50) {
            updatedHistory.shift();
        }
        await kv.set(`chat_history:${user.id}`, updatedHistory);
        
        return c.json({ reply });
    } catch (err: any) {
        console.error("AI chat error:", err);
        return c.json({ error: err.message }, 500);
    }
});

// --- DISTANCE / LOGISTICS AI ---
app.post("/make-server-3ab99f71/logistics/estimate", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { from, to, language } = await c.req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");
        const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

        // 1. Get real distance from Google Distance Matrix if possible
        let realDistance = "unknown";
        try {
            const distRes = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(to)}&key=${googleKey}`);
            const distData = await distRes.json();
            if (distData.rows?.[0]?.elements?.[0]?.distance) {
                realDistance = distData.rows[0].elements[0].distance.text;
            }
        } catch (e) {
            console.error("Google Distance Matrix failed", e);
        }

        // 2. Use Gemini to provide "Nomadic Context" and time distortion
        const MODEL = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

        // Map frontend language codes to English names for the prompt
        const langMap: Record<string, string> = {
            'kz': 'Kazakh (Latin or Cyrillic script)',
            'ru': 'Russian',
            'en': 'English'
        };
        const targetLang = langMap[language || 'en'] || 'English';

        const prompt = `Calculate nomadic travel logistics between ${from} and ${to}. 
        Real distance is roughly ${realDistance}.
        Output Language: ${targetLang}.
        
        Provide:
        1. "Time Distortion": How long it feels vs reality (in ${targetLang}).
        2. "Nomadic Scale": Compare the distance to a European country or major landmark (in ${targetLang}).
        3. "Steppe Wisdom": A short warning about this specific route (in ${targetLang}).
        
        Return as JSON: { "distance_km": number, "plane_hrs": number, "train_hrs": number, "car_hrs": number, "scale": "string", "wisdom": "string", "distortion": "string" }`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) {
             if (response.status === 429) {
                 return c.json({ 
                     distance_km: 0, plane_hrs: 0, train_hrs: 0, car_hrs: 0,
                     scale: "The Infinite Pause", 
                     wisdom: "The caravan halts. The stars are too faint to guide us. Rest now.", 
                     distortion: "Time is suspended" 
                 });
             }
             const errorData = await response.json().catch(() => ({}));
             throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
        
        return c.json(result);
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// --- STAR NAV AI ---
app.post("/make-server-3ab99f71/ai/starnav", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { lat, lng, heading, season, language } = await c.req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");
        const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

        // Reverse Geocode for context (approximate location name)
        let locationName = "Unknown Steppe";
        try {
            const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleKey}`);
            const geoData = await geoRes.json();
            if (geoData.results?.[0]) {
                // Try to find a broad administrative area or natural feature
                const components = geoData.results[0].address_components;
                const area = components.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name;
                const country = components.find((c: any) => c.types.includes("country"))?.long_name;
                locationName = area ? `${area}, ${country}` : (country || "The Open Steppe");
            }
        } catch (e) {
            console.error("Geocoding failed", e);
        }

        const MODEL = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

        const langMap: Record<string, string> = {
            'kz': 'Kazakh',
            'ru': 'Russian',
            'en': 'English'
        };
        const targetLang = langMap[language || 'en'] || 'English';

        const prompt = `Act as an ancient Kazakh star-reader (Esepchi). 
        The traveler is at ${lat}, ${lng} (${locationName}) facing ${heading} degrees. Season: ${season}.
        Output Language: ${targetLang}.

        Provide a short "Celestial Reading".
        1. Identify a star or constellation visible in this season/direction (e.g., Polaris/Temirqazyq, Pleiades/Ürker, Great Bear/Jetiqaraqshy).
        2. Give a cryptic but encouraging navigational metaphor (in ${targetLang}).
        3. Keep it under 50 words.
        Return JSON: { "star_name": "string", "reading": "string" }`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                return c.json({ 
                    star_name: "The Void", 
                    reading: "The sky is veiled. The ancestors are silent. Wait for the clouds to part." 
                });
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
        
        return c.json(result);
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// --- STATIC MAP PROXY ---
app.get("/make-server-3ab99f71/proxy/static-map", async (c) => {
    // Publicly accessible for the PDF generator (protected by API key on backend)
    const center = c.req.query("center") || "Kazakhstan";
    const zoom = c.req.query("zoom") || "5";
    const size = c.req.query("size") || "600x400";
    const maptype = c.req.query("maptype") || "terrain";
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");

    if (!apiKey) return c.text("API Key missing", 500);

    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(center)}&zoom=${zoom}&size=${size}&maptype=${maptype}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return c.text("Map fetch failed", response.status);

        const blob = await response.blob();
        return new Response(blob, {
            headers: {
                "Content-Type": "image/png",
                "Access-Control-Allow-Origin": "*" 
            }
        });
    } catch (e) {
        return c.text("Proxy error", 500);
    }
});

// --- GHOST PROTOCOL / PDF DATA ---
app.post("/make-server-3ab99f71/tools/protocol", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { location, season } = await c.req.json();
        
        const supabase = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        // 1. Get OpenWeather Key
        const { data: envData } = await supabase
            .from('env')
            .select('OPENWEATHER_API')
            .limit(1)
            .single();
        const weatherKey = envData?.OPENWEATHER_API;

        let weatherInfo = "Unknown weather";
        let temp = "N/A";

        // 2. Fetch Weather if key exists
        if (weatherKey) {
            try {
                const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${weatherKey}&units=metric`);
                if (wRes.ok) {
                    const wData = await wRes.json();
                    temp = `${Math.round(wData.main.temp)}°C`;
                    weatherInfo = `${wData.weather[0].main} (${wData.weather[0].description}), Wind: ${wData.wind.speed}m/s`;
                }
            } catch (e) {
                console.error("Weather fetch for protocol failed", e);
            }
        }

        // 3. Consult Gemini for Survival Protocol
        const apiKey = Deno.env.get("GEMINI_API_KEY");
        const MODEL = "gemini-2.5-flash"; 
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

        const prompt = `Generate a 'Ghost Protocol' survival brief for a traveler in ${location}.
        Season: ${season}. Current Weather: ${temp}, ${weatherInfo}.
        
        Provide strictly formatted JSON:
        {
            "hazards": ["specific hazard 1", "specific hazard 2"],
            "culture_tip": "One crucial, specific local etiquette rule for this exact region.",
            "gear_check": ["Essential Item 1", "Essential Item 2", "Essential Item 3"],
            "emergency_note": "A specific safety warning for this location (e.g. avalanche, border zone, fauna)."
        }
        Do not include markdown blocks.`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                return c.json({
                    weather: { temp, condition: weatherInfo },
                    hazards: ["Silence", "Void"],
                    culture_tip: "The spirits request silence.",
                    gear_check: ["Patience"],
                    emergency_note: "Data storm. Shelter in place."
                });
            }
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        const aiResult = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
        
        return c.json({
            weather: { temp, condition: weatherInfo },
            ...aiResult
        });
    } catch (err: any) {
        return c.json({ error: err.message }, 500);
    }
});

// --- AUTH ---
app.post("/make-server-3ab99f71/signup", async (c) => {
    try {
        const { email, password, name } = await c.req.json();
        
        const supabaseAdmin = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            user_metadata: { name },
            email_confirm: true 
        });

        if (error) return c.json({ error: error.message }, 400);
        return c.json({ user: data.user });
    } catch (e: any) {
        return c.json({ error: "Auth server error: " + e.message }, 500);
    }
});

// --- USER PREFERENCES (Language, Season) ---
app.get("/make-server-3ab99f71/preferences", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const prefs = await kv.get(`preferences:${user.id}`);
        return c.json(prefs || { language: 'en', season: 'summer' });
    } catch (e: any) {
        console.error("Error fetching preferences:", e);
        return c.json({ error: "Database error fetching preferences: " + e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/preferences", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const data = await c.req.json();
        const current = (await kv.get(`preferences:${user.id}`)) || {};
        const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
        await kv.set(`preferences:${user.id}`, updated);
        console.log(`Preferences saved for user ${user.id}:`, updated);
        return c.json({ success: true, preferences: updated });
    } catch (e: any) {
        console.error("Error saving preferences:", e);
        return c.json({ error: "Database error saving preferences: " + e.message }, 500);
    }
});

// --- BATCH GEOCODE (Server-side, uses Google API key) ---
app.post("/make-server-3ab99f71/geocode-batch", async (c) => {
    try {
        const { locations } = await c.req.json();
        if (!Array.isArray(locations) || locations.length === 0) {
            return c.json({ results: [] });
        }

        const googleKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
        const geminiKey = Deno.env.get("GEMINI_API_KEY");
        
        // Cap at 25 to avoid abuse
        const batch = locations.slice(0, 25);
        const results: { location: string; lat: number | null; lng: number | null; source: string }[] = [];

        for (const loc of batch) {
            if (!loc || typeof loc !== 'string') {
                results.push({ location: loc, lat: null, lng: null, source: 'skip' });
                continue;
            }

            let lat: number | null = null;
            let lng: number | null = null;
            let source = 'none';

            // 1. Try Google Geocoding API (most accurate)
            if (googleKey) {
                try {
                    const geoRes = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc + ", Kazakhstan")}&key=${googleKey}`
                    );
                    const geoData = await geoRes.json();
                    if (geoData.results?.[0]?.geometry?.location) {
                        lat = geoData.results[0].geometry.location.lat;
                        lng = geoData.results[0].geometry.location.lng;
                        source = 'google';
                    }
                } catch (e) {
                    console.log(`Google geocode failed for "${loc}":`, e);
                }
            }

            // 2. If Google failed, ask Gemini for coordinates
            if (lat === null && geminiKey) {
                try {
                    const MODEL = "gemini-2.5-flash";
                    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${geminiKey}`;
                    const prompt = `What are the exact GPS coordinates (latitude and longitude) of "${loc}" in Kazakhstan? Return ONLY a JSON object like {"lat": 43.238949, "lng": 76.889709}. No explanation, no markdown, no backticks. If the place doesn't exist, return {"lat": null, "lng": null}.`;
                    
                    const aiRes = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { temperature: 0, maxOutputTokens: 100 }
                        })
                    });
                    
                    if (aiRes.ok) {
                        const aiData = await aiRes.json();
                        const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
                        const jsonMatch = text.match(/\{[\s\S]*\}/);
                        if (jsonMatch) {
                            const coords = JSON.parse(jsonMatch[0]);
                            if (typeof coords.lat === 'number' && typeof coords.lng === 'number' && coords.lat !== null && coords.lng !== null) {
                                lat = coords.lat;
                                lng = coords.lng;
                                source = 'gemini';
                            }
                        }
                    }
                } catch (e) {
                    console.log(`Gemini geocode failed for "${loc}":`, e);
                }
            }

            results.push({ location: loc, lat, lng, source });
        }

        return c.json({ results });
    } catch (err: any) {
        console.log("Batch geocode error:", err);
        return c.json({ error: err.message }, 500);
    }
});

// --- REVIEWS ---
app.get("/make-server-3ab99f71/reviews/:type/:targetId", async (c) => {
    try {
        const type = c.req.param('type');
        const targetId = c.req.param('targetId');
        const reviews = (await kv.get(`reviews:${type}:${targetId}`)) || [];
        return c.json(reviews);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/reviews/:type/:targetId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const type = c.req.param('type');
        const targetId = c.req.param('targetId');
        const { rating, text, targetName } = await c.req.json();

        const reviews = (await kv.get(`reviews:${type}:${targetId}`)) || [];

        const existing = reviews.findIndex((r: any) => r.userId === user.id);
        if (existing !== -1) {
            reviews[existing] = {
                ...reviews[existing],
                rating,
                text,
                date: new Date().toISOString(),
            };
        } else {
            reviews.push({
                id: crypto.randomUUID(),
                userId: user.id,
                userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
                rating,
                text,
                date: new Date().toISOString(),
                helpful: 0,
            });
        }

        await kv.set(`reviews:${type}:${targetId}`, reviews);

        // Track known review targets for admin listing
        const knownTargets = (await kv.get(`review_targets:${type}`)) || [];
        if (!knownTargets.includes(targetId)) {
            knownTargets.push(targetId);
            await kv.set(`review_targets:${type}`, knownTargets);
        }

        const allUserReviews = (await kv.get(`user_reviews:${user.id}`)) || [];
        const entry = { type, targetId, targetName, rating, date: new Date().toISOString() };
        const existingUserReview = allUserReviews.findIndex((r: any) => r.targetId === targetId && r.type === type);
        if (existingUserReview !== -1) allUserReviews[existingUserReview] = entry;
        else allUserReviews.push(entry);
        await kv.set(`user_reviews:${user.id}`, allUserReviews);

        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/reviews/:type/:targetId/:reviewId/helpful", async (c) => {
    try {
        const type = c.req.param('type');
        const targetId = c.req.param('targetId');
        const reviewId = c.req.param('reviewId');

        const reviews = (await kv.get(`reviews:${type}:${targetId}`)) || [];
        const idx = reviews.findIndex((r: any) => r.id === reviewId);
        if (idx !== -1) {
            reviews[idx].helpful = (reviews[idx].helpful || 0) + 1;
            await kv.set(`reviews:${type}:${targetId}`, reviews);
        }
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- COMMUNITY / SHARED TRIPS ---
app.get("/make-server-3ab99f71/community/trips", async (c) => {
    try {
        const trips = (await kv.get("community:trips")) || [];
        return c.json(trips);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get("/make-server-3ab99f71/community/trips/:tripId", async (c) => {
    try {
        const tripId = c.req.param('tripId');
        const trips = (await kv.get("community:trips")) || [];
        const trip = trips.find((t: any) => t.id === tripId);
        if (!trip) return c.json({ error: "Trip not found" }, 404);

        trip.views = (trip.views || 0) + 1;
        await kv.set("community:trips", trips);

        return c.json(trip);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/community/trips", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const tripData = await c.req.json();
        const trips = (await kv.get("community:trips")) || [];

        const published = {
            id: crypto.randomUUID(),
            ...tripData,
            authorId: user.id,
            authorName: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
            publishedAt: new Date().toISOString(),
            likes: 0,
            views: 0,
        };

        trips.unshift(published);
        if (trips.length > 200) trips.length = 200;
        await kv.set("community:trips", trips);

        return c.json({ success: true, trip: published });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/community/trips/:tripId/like", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const tripId = c.req.param('tripId');
        const trips = (await kv.get("community:trips")) || [];
        const trip = trips.find((t: any) => t.id === tripId);
        if (!trip) return c.json({ error: "Trip not found" }, 404);

        const userLikes = (await kv.get(`user_likes:${user.id}`)) || [];
        const alreadyLiked = userLikes.includes(tripId);

        if (alreadyLiked) {
            trip.likes = Math.max(0, (trip.likes || 0) - 1);
            const idx = userLikes.indexOf(tripId);
            if (idx !== -1) userLikes.splice(idx, 1);
        } else {
            trip.likes = (trip.likes || 0) + 1;
            userLikes.push(tripId);
        }

        await kv.set("community:trips", trips);
        await kv.set(`user_likes:${user.id}`, userLikes);

        return c.json({ success: true, liked: !alreadyLiked, likes: trip.likes });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/community/trips/:tripId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const tripId = c.req.param('tripId');
        const trips = (await kv.get("community:trips")) || [];
        const idx = trips.findIndex((t: any) => t.id === tripId && t.authorId === user.id);
        if (idx === -1) return c.json({ error: "Not found or not authorized" }, 404);

        trips.splice(idx, 1);
        await kv.set("community:trips", trips);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- SOS BEACON ---
app.get("/make-server-3ab99f71/sos", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const alert = await kv.get(`sos:${user.id}`);
        return c.json(alert || { status: 'inactive' });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/sos", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { lat, lng, emergencyContact, checkinInterval } = await c.req.json();

        const alert = {
            id: crypto.randomUUID(),
            userId: user.id,
            userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
            status: 'active',
            lat,
            lng,
            emergencyContact,
            checkinInterval,
            activatedAt: new Date().toISOString(),
            lastCheckin: new Date().toISOString(),
            locationHistory: [{ lat, lng, timestamp: new Date().toISOString() }],
        };

        await kv.set(`sos:${user.id}`, alert);

        if (emergencyContact) {
            const profile = (await kv.get(`profile:${user.id}`)) || {};
            profile.emergencyContact = emergencyContact;
            await kv.set(`profile:${user.id}`, profile);
        }

        return c.json({ success: true, alert });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/sos/checkin", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const { lat, lng } = await c.req.json();
        const alert = await kv.get(`sos:${user.id}`);
        if (!alert || alert.status !== 'active') return c.json({ error: "No active beacon" }, 404);

        alert.lastCheckin = new Date().toISOString();
        if (lat && lng) {
            alert.lat = lat;
            alert.lng = lng;
            alert.locationHistory = alert.locationHistory || [];
            alert.locationHistory.push({ lat, lng, timestamp: new Date().toISOString() });
            if (alert.locationHistory.length > 100) alert.locationHistory.shift();
        }

        await kv.set(`sos:${user.id}`, alert);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/sos", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        await kv.set(`sos:${user.id}`, { status: 'inactive' });
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- MULTIPLAYER TRIP PLANNING ---
app.get("/make-server-3ab99f71/trips/:tripId/collaborators", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const tripId = c.req.param('tripId');
        const collabs = (await kv.get(`trip_collabs:${tripId}`)) || [];
        return c.json(collabs);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/trips/:tripId/invite", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const tripId = c.req.param('tripId');
        const { email, role } = await c.req.json();

        const collabs = (await kv.get(`trip_collabs:${tripId}`)) || [];

        if (collabs.length === 0) {
            collabs.push({
                userId: user.id,
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'Owner',
                role: 'owner',
                joinedAt: new Date().toISOString(),
            });
        }

        const exists = collabs.find((cl: any) => cl.email === email);
        if (exists) return c.json({ error: "Already invited" }, 400);

        const invite = {
            id: crypto.randomUUID(),
            tripId,
            email,
            role: role || 'editor',
            invitedBy: user.id,
            invitedByName: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const pendingInvites = (await kv.get(`invites:${email}`)) || [];
        pendingInvites.push(invite);
        await kv.set(`invites:${email}`, pendingInvites);

        collabs.push({
            email,
            role: role || 'editor',
            status: 'pending',
            inviteId: invite.id,
            joinedAt: new Date().toISOString(),
        });
        await kv.set(`trip_collabs:${tripId}`, collabs);

        return c.json({ success: true, invite });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get("/make-server-3ab99f71/invites", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const invites = (await kv.get(`invites:${user.email}`)) || [];
        const pending = invites.filter((i: any) => i.status === 'pending');
        return c.json(pending);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/invites/:inviteId/accept", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const inviteId = c.req.param('inviteId');
        const invites = (await kv.get(`invites:${user.email}`)) || [];
        const invite = invites.find((i: any) => i.id === inviteId);
        if (!invite) return c.json({ error: "Invite not found" }, 404);

        invite.status = 'accepted';
        await kv.set(`invites:${user.email}`, invites);

        const collabs = (await kv.get(`trip_collabs:${invite.tripId}`)) || [];
        const collab = collabs.find((cl: any) => cl.inviteId === inviteId);
        if (collab) {
            collab.userId = user.id;
            collab.name = user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler';
            collab.status = 'active';
        }
        await kv.set(`trip_collabs:${invite.tripId}`, collabs);

        const sharedTrips = (await kv.get(`shared_trips:${user.id}`)) || [];
        sharedTrips.push({ tripId: invite.tripId, ownerId: invite.invitedBy, role: invite.role });
        await kv.set(`shared_trips:${user.id}`, sharedTrips);

        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/invites/:inviteId/decline", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const inviteId = c.req.param('inviteId');
        const invites = (await kv.get(`invites:${user.email}`)) || [];
        const invite = invites.find((i: any) => i.id === inviteId);
        if (!invite) return c.json({ error: "Invite not found" }, 404);

        invite.status = 'declined';
        await kv.set(`invites:${user.email}`, invites);

        const collabs = (await kv.get(`trip_collabs:${invite.tripId}`)) || [];
        const idx = collabs.findIndex((cl: any) => cl.inviteId === inviteId);
        if (idx !== -1) collabs.splice(idx, 1);
        await kv.set(`trip_collabs:${invite.tripId}`, collabs);

        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get("/make-server-3ab99f71/shared-trips", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const sharedRefs = (await kv.get(`shared_trips:${user.id}`)) || [];
        const results: any[] = [];

        for (const ref of sharedRefs) {
            const ownerTrips = (await kv.get(`bookings:${ref.ownerId}`)) || [];
            const trip = ownerTrips.find((t: any) => t.id === ref.tripId);
            if (trip) {
                results.push({ ...trip, role: ref.role, ownerId: ref.ownerId });
            }
        }

        return c.json(results);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- CMS / ADMIN ---
app.get("/make-server-3ab99f71/admin/stats", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const communityTrips = (await kv.get("community:trips")) || [];
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];

        if (!adminEmails.includes(user.email)) {
            return c.json({ error: "Forbidden" }, 403);
        }

        return c.json({
            communityTrips: communityTrips.length,
            totalLikes: communityTrips.reduce((s: number, t: any) => s + (t.likes || 0), 0),
            totalViews: communityTrips.reduce((s: number, t: any) => s + (t.views || 0), 0),
        });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get("/make-server-3ab99f71/admin/community-trips", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);

        const trips = (await kv.get("community:trips")) || [];
        return c.json(trips);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/admin/community-trips/:tripId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);

        const tripId = c.req.param('tripId');
        const trips = (await kv.get("community:trips")) || [];
        const filtered = trips.filter((t: any) => t.id !== tripId);
        await kv.set("community:trips", filtered);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/admin/reviews/:type/:targetId/:reviewId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);

        const type = c.req.param('type');
        const targetId = c.req.param('targetId');
        const reviewId = c.req.param('reviewId');
        const reviews = (await kv.get(`reviews:${type}:${targetId}`)) || [];
        const filtered = reviews.filter((r: any) => r.id !== reviewId);
        await kv.set(`reviews:${type}:${targetId}`, filtered);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- USER-SUBMITTED PLACES ---
app.get("/make-server-3ab99f71/user-places", async (c) => {
    try {
        const places = (await kv.get("user_places:all")) || [];
        const approved = places.filter((p: any) => p.status === 'approved');
        return c.json(approved);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.get("/make-server-3ab99f71/user-places/my", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const places = (await kv.get("user_places:all")) || [];
        const myPlaces = places.filter((p: any) => p.authorId === user.id);
        return c.json(myPlaces);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/user-places", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const placeData = await c.req.json();
        const places = (await kv.get("user_places:all")) || [];
        const newPlace = {
            id: crypto.randomUUID(),
            ...placeData,
            authorId: user.id,
            authorName: user.user_metadata?.name || user.email?.split('@')[0] || 'Traveler',
            authorEmail: user.email,
            status: 'pending',
            verificationResult: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        places.unshift(newPlace);
        if (places.length > 500) places.length = 500;
        await kv.set("user_places:all", places);
        return c.json({ success: true, place: newPlace });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.post("/make-server-3ab99f71/user-places/:placeId/verify", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const placeId = c.req.param('placeId');
        const places = (await kv.get("user_places:all")) || [];
        const idx = places.findIndex((p: any) => p.id === placeId);
        if (idx === -1) return c.json({ error: "Place not found" }, 404);
        const place = places[idx];
        place.status = 'verifying';
        place.updatedAt = new Date().toISOString();
        await kv.set("user_places:all", places);

        const apiKey = Deno.env.get("GEMINI_API_KEY");
        if (!apiKey) {
            place.status = 'pending';
            place.verificationResult = { score: 0, verdict: 'unavailable', checks: [], suggestion: 'AI verification unavailable.' };
            await kv.set("user_places:all", places);
            return c.json({ error: "AI verification unavailable" }, 503);
        }

        const MODEL = "gemini-2.5-flash";
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
        const prompt = `You are a travel data verification AI for Kazakhstan. Analyze this user-submitted place listing for ACCURACY and LEGITIMACY.

Place Data:
- Name: ${place.name}
- Type: ${place.type}
- Region: ${place.region}
- City/Settlement: ${place.city || 'Not provided'}
- Coordinates: lat ${place.lat || 'Not provided'}, lng ${place.lng || 'Not provided'}
- Description: ${place.description}
- Category: ${place.category || 'Not provided'}

Verify:
1. Does this place actually exist in Kazakhstan?
2. Are coordinates roughly correct?
3. Is the description accurate?
4. Is the category reasonable?
5. Is the content appropriate (no spam/fake)?
6. Is the region correct?

Return JSON:
{
  "score": <number 0-100>,
  "verdict": "<approved|needs_review|rejected>",
  "confidence": "<high|medium|low>",
  "checks": [
    {"check": "existence", "passed": true/false, "note": "..."},
    {"check": "coordinates", "passed": true/false, "note": "..."},
    {"check": "description_accuracy", "passed": true/false, "note": "..."},
    {"check": "category_match", "passed": true/false, "note": "..."},
    {"check": "content_quality", "passed": true/false, "note": "..."},
    {"check": "region_match", "passed": true/false, "note": "..."}
  ],
  "suggestion": "optional improvement suggestion"
}`;

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) {
            if (response.status === 429) {
                place.status = 'pending';
                place.verificationResult = { score: 0, verdict: 'rate_limited', checks: [], suggestion: 'AI is resting. Try again later.' };
                await kv.set("user_places:all", places);
                return c.json({ success: false, verification: place.verificationResult });
            }
            throw new Error("Gemini API error");
        }

        const data = await response.json();
        const result = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
        place.verificationResult = result;
        place.status = result.verdict === 'approved' ? 'approved' : result.verdict === 'rejected' ? 'rejected' : 'needs_review';
        place.updatedAt = new Date().toISOString();
        await kv.set("user_places:all", places);
        return c.json({ success: true, verification: result, status: place.status });
    } catch (err: any) {
        console.error("Verification error:", err);
        return c.json({ error: err.message }, 500);
    }
});

app.get("/make-server-3ab99f71/admin/user-places", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);
        const places = (await kv.get("user_places:all")) || [];
        return c.json(places);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.put("/make-server-3ab99f71/admin/user-places/:placeId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);
        const placeId = c.req.param('placeId');
        const { status } = await c.req.json();
        const places = (await kv.get("user_places:all")) || [];
        const idx = places.findIndex((p: any) => p.id === placeId);
        if (idx === -1) return c.json({ error: "Place not found" }, 404);
        places[idx].status = status;
        places[idx].updatedAt = new Date().toISOString();
        places[idx].reviewedBy = user.email;
        await kv.set("user_places:all", places);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

app.delete("/make-server-3ab99f71/admin/user-places/:placeId", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);
        const placeId = c.req.param('placeId');
        const places = (await kv.get("user_places:all")) || [];
        const filtered = places.filter((p: any) => p.id !== placeId);
        await kv.set("user_places:all", filtered);
        return c.json({ success: true });
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

// --- ADMIN: List all reviews for a given type (scans known targets) ---
app.get("/make-server-3ab99f71/admin/reviews/:type", async (c) => {
    const user = await getUser(c);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
        const adminEmails = (await kv.get("admin:emails")) || ["admin@kendala.kz"];
        if (!adminEmails.includes(user.email)) return c.json({ error: "Forbidden" }, 403);

        const type = c.req.param('type');
        // Get known target IDs for this review type
        const knownTargets = (await kv.get(`review_targets:${type}`)) || [];
        const allReviews: any[] = [];

        for (const targetId of knownTargets) {
            const reviews = (await kv.get(`reviews:${type}:${targetId}`)) || [];
            for (const review of reviews) {
                allReviews.push({ ...review, targetId, targetType: type });
            }
        }

        return c.json(allReviews);
    } catch (e: any) {
        return c.json({ error: e.message }, 500);
    }
});

Deno.serve({
  onError: (err) => {
    if (err.message && err.message.includes("connection closed before message completed")) {
      return new Response(); // Ignore closed connections
    }
    console.error("Server error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}, app.fetch);