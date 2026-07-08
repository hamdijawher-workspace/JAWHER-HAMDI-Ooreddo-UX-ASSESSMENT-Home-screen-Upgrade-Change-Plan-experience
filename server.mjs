import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const preferredPort = Number(process.env.PORT || 5173);
const host = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const requested = decodeURIComponent(url.pathname);
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(root, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    filePath = join(root, 'index.html');
  }

  if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  res.writeHead(200, {
    'content-type': types[extname(filePath)] || 'application/octet-stream',
    'cache-control': 'no-store'
  });
  createReadStream(filePath).pipe(res);
});

function listen(port) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE' && !process.env.PORT) {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    const localUrl = host === '0.0.0.0' ? `http://127.0.0.1:${port}/` : `http://${host}:${port}/`;
    console.log(`Ooredoo prototype running at ${localUrl}`);
  });
}

listen(preferredPort);
