import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerApiRoutes } from './api/app.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 8080);

const app = express();

registerApiRoutes(app);
app.use(express.static(distDir));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next();
    return;
  }
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`[app] listening on http://0.0.0.0:${port}`);
});
