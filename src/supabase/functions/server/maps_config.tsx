
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const app = new Hono();

app.use('*', cors());

app.get('/config', (c) => {
  return c.json({
    apiKey: Deno.env.get('GOOGLE_MAPS_API_KEY') || '',
  });
});

export default app;
