import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import weatherApp from "./weather_config.tsx";

const app = new Hono();

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

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }],
                system_instruction: {
                    parts: [{ text: "You are Kendala AI, an elite travel logistics engine for Kazakhstan. Use nomadic metaphors but keep it functional." }]
                }
            })
        });

        if (!response.ok) {
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

Deno.serve(app.fetch);