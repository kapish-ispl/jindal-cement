// server.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    '/backend',
    createProxyMiddleware({
      target: 'https://api.jindalsteelpower.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/backend': '' },
    })
  );

  // All other Next.js routes
  server.use((req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`🖥️  Server ready at http://localhost:${port}`);
  });
});
