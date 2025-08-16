// in vite.config.ts
import path from 'path';
import { defineConfig, loadEnv } from 'vite'; // <--- loadEnv wieder hinzufügen
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import bodyParser from 'body-parser';

// Das Plugin bleibt unverändert
function apiPlugin(): Plugin {
  return {
    name: 'vite-plugin-api',
    configureServer(server) {
      server.middlewares.use(bodyParser.json());
      server.middlewares.use(async (req: IncomingMessage & { body?: any }, res: ServerResponse, next) => {
        if (req.url && req.url.startsWith('/api/')) {
          try {
            const modulePath = `.${req.url}.ts`;
            const handlerModule = await server.ssrLoadModule(modulePath);
            await handlerModule.default(req, res);
          } catch (error) {
            console.error(`Fehler bei der API-Anfrage für ${req.url}:`, error);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else {
          next();
        }
      });
    },
  };
}

// Hier ist die entscheidende Änderung
export default defineConfig(({ mode }) => {
  // Diese Zeile lädt die .env.local Datei und macht die Variablen für den Vite-Prozess (unseren Server) verfügbar
  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')};

  return {
    define: {
      // Dieser Block bleibt leer, um den Key nicht an den Client weiterzugeben
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    plugins: [apiPlugin()],
  };
});