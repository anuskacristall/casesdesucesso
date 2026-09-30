/**
 * server.js — Ponto de entrada Node.js para hospedagem na Hostinger / Ambientes Cloud
 * Projeto: Mapa Interativo de Cases de Sucesso — Sebrae Minas Gerais
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn } = require('child_process');

const PORT = parseInt(process.env.PORT || '8001', 10);
const INTERNAL_PY_PORT = 18001;
const BASE_DIR = __dirname;
const DATA_STORE_PATH = path.join(BASE_DIR, 'data_store.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8',
  '.geojson': 'application/geo+json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

let pythonProcess = null;
let pythonReady = false;

// Tenta iniciar o backend Python (server.py) em porta interna
function startPythonBackend() {
  const pythonCmds = ['python3', 'python'];
  
  function trySpawn(index) {
    if (index >= pythonCmds.length) {
      console.log('ℹ️ [Hostinger Node.js] Python indisponível. Operando em modo servidor estático/fallback nativo Node.js.');
      return;
    }
    
    const cmd = pythonCmds[index];
    const env = Object.assign({}, process.env, { PORT: String(INTERNAL_PY_PORT) });
    
    try {
      const child = spawn(cmd, ['server.py'], { cwd: BASE_DIR, env: env });
      
      child.on('error', () => {
        trySpawn(index + 1);
      });
      
      child.stdout.on('data', (d) => {
        const str = d.toString();
        if (str.includes('Servidor iniciado') || str.includes('Rodando') || str.includes('http')) {
          pythonReady = true;
        }
      });
      
      child.stderr.on('data', (d) => {
        // logs de erro do python
      });

      child.on('close', () => {
        pythonReady = false;
      });

      pythonProcess = child;
      // Aguarda 1s para o Python iniciar
      setTimeout(() => {
        pythonReady = true;
      }, 1000);

    } catch (e) {
      trySpawn(index + 1);
    }
  }

  trySpawn(0);
}

// Inicializa a tentativa do backend Python
startPythonBackend();

function serveStaticFile(req, res, pathname) {
  let relativePath = pathname === '/' ? '/index.html' : pathname;
  
  if (relativePath === '/admin') relativePath = '/admin.html';
  if (relativePath === '/documentacao') relativePath = '/documentacao.html';
  
  const safePath = path.normalize(decodeURIComponent(relativePath)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(BASE_DIR, safePath);

  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Proibido');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Nao Encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

function proxyToPython(req, res) {
  const options = {
    hostname: '127.0.0.1',
    port: INTERNAL_PY_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (pyRes) => {
    res.writeHead(pyRes.statusCode, pyRes.headers);
    pyRes.pipe(res);
  });

  proxyReq.on('error', () => {
    // Se falhar proxy para o Python, atende estático ou fallback
    const parsedUrl = url.parse(req.url);
    serveStaticFile(req, res, parsedUrl.pathname);
  });

  req.pipe(proxyReq);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Se Python estiver ativo, faz proxy de requisições de API ou de todas
  if (pythonReady && pythonProcess) {
    if (pathname.startsWith('/api/')) {
      return proxyToPython(req, res);
    }
  }

  // Fallback direto para endpoints de leitura básicos caso Python não esteja no servidor
  if (pathname === '/api/municipalities' && req.method === 'GET') {
    if (fs.existsSync(DATA_STORE_PATH)) {
      try {
        const data = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data.municipalities || []));
        return;
      } catch (e) {}
    }
  }

  if (pathname === '/api/cases' && req.method === 'GET') {
    if (fs.existsSync(DATA_STORE_PATH)) {
      try {
        const data = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'utf-8'));
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data.extra_cases || []));
        return;
      } catch (e) {}
    }
  }

  // Servir arquivos estáticos
  serveStaticFile(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`🚀 [Hostinger / Node.js] Servidor rodando na porta ${PORT}`);
  console.log(`🗺️ Acesse: http://localhost:${PORT}/`);
});

process.on('SIGTERM', () => {
  if (pythonProcess) pythonProcess.kill('SIGTERM');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  if (pythonProcess) pythonProcess.kill('SIGINT');
  server.close(() => process.exit(0));
});
