import { createApiApp } from './app.mjs';

const PORT = Number(process.env.API_PORT || 8790);
const app = createApiApp();

app.listen(PORT, () => {
  console.log(`[api] listening on http://127.0.0.1:${PORT}`);
});
