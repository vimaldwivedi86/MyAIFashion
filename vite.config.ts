import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { app } from './server/index.ts';

// Mounts the real API service (server/index.ts) into the Vite dev server so
// `npm run dev` exercises the same route handlers that run standalone via
// `npm run server` / `node server/index.ts` in production. Keeps a single
// source of truth for every route that touches customer data.
const apiPlugin = {
  name: 'api-routes',
  configureServer(server: any) {
    server.middlewares.use(app);
  },
};

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin],
  server: {
    host: true,                                          // expose on LAN
    port: Number(process.env.PORT) || 5173,              // harness injects PORT via autoPort
    allowedHosts: true,                                  // allow Cloudflare tunnel + any proxy
  },
});
