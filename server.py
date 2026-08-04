import os
import sys
import json
import pathlib
import mimetypes
import urllib.request
import urllib.error
import ssl
from http.server import SimpleHTTPRequestHandler, HTTPServer

# Create an unverified SSL context to bypass corporate proxy certificate inspection errors
ssl_context = ssl._create_unverified_context()

# Load environment variables from .env if present
def load_env():
    env_path = pathlib.Path(__file__).parent / ".env"
    if env_path.exists():
        print("Carregando credenciais do arquivo .env...")
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip()

load_env()

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
PORT = int(os.environ.get("PORT", 8001))

class SecureBackendHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent caching of JS/CSS during development
        if self.path.endswith((".js", ".css", ".html")):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_HEAD(self):
        if self.path == "/api/cases":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        if self.path == "/api/cases":
            self.handle_get_cases()
        else:
            # Fallback to serving static files (index.html, style.css, app.js, etc.)
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/cases":
            self.handle_post_case()
        else:
            self.send_error(404, "Endpoint não encontrado")

    def handle_get_cases(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            self.send_json_response(500, {"error": "Credenciais do Supabase não configuradas no servidor."})
            return

        url = f"{SUPABASE_URL}/rest/v1/cases?select=*"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, context=ssl_context) as response:
                data = json.loads(response.read().decode("utf-8"))
                self.send_json_response(200, data)
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"Erro do Supabase (GET): {e.code} - {err_msg}")
            self.send_json_response(e.code, {"error": err_msg})
        except Exception as e:
            print(f"Erro interno de rede (GET): {str(e)}")
            self.send_json_response(500, {"error": str(e)})

    def handle_post_case(self):
        if not SUPABASE_URL or not SUPABASE_KEY:
            self.send_json_response(500, {"error": "Credenciais do Supabase não configuradas no servidor."})
            return

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        url = f"{SUPABASE_URL}/rest/v1/cases"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        req = urllib.request.Request(url, data=post_data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req, context=ssl_context) as response:
                data = json.loads(response.read().decode("utf-8"))
                self.send_json_response(201, data)
        except urllib.error.HTTPError as e:
            err_msg = e.read().decode("utf-8")
            print(f"Erro do Supabase (POST): {e.code} - {err_msg}")
            self.send_json_response(e.code, {"error": err_msg})
        except Exception as e:
            print(f"Erro interno de rede (POST): {str(e)}")
            self.send_json_response(500, {"error": str(e)})

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        # Allow localhost development origins
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

def run():
    # Make sure we serve files from the folder where server.py is located
    server_dir = pathlib.Path(__file__).parent.resolve()
    os.chdir(server_dir)

    server_address = ("", PORT)
    httpd = HTTPServer(server_address, SecureBackendHandler)
    print(f"============================================================")
    print(f"SERVIDOR BACKEND SEGURO RODANDO")
    print(f"Acesse: http://localhost:{PORT}/")
    print(f"Banco de dados conectado: {SUPABASE_URL}")
    print(f"============================================================")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado pelo usuário.")
        sys.exit(0)

if __name__ == "__main__":
    run()
