import os
import sys
import json
import pathlib
import mimetypes
import urllib.request
import urllib.error
import ssl
import uuid
from urllib.parse import urlsplit
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# Create an unverified SSL context to bypass corporate proxy certificate inspection errors
ssl_context = ssl._create_unverified_context()

# Supabase is called directly through an opener that does not inherit broken local proxy settings
supabase_opener = urllib.request.build_opener(
    urllib.request.ProxyHandler({}),
    urllib.request.HTTPSHandler(context=ssl_context),
)

def open_remote(request):
    return supabase_opener.open(request, timeout=10)

# Load environment variables from .env if present
def load_env():
    env_path = pathlib.Path(__file__).parent / ".env"
    secrets_path = pathlib.Path("/etc/secrets/.env")
    target_path = env_path if env_path.exists() else (secrets_path if secrets_path.exists() else None)
    if target_path:
        print(f"Carregando credenciais do arquivo {target_path}...")
        with open(target_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip()

load_env()

def generate_random_token():
    return uuid.uuid4().hex

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
PORT = int(os.environ.get("PORT", 8001))

DATA_STORE_PATH = os.path.join(os.path.dirname(__file__), "data_store.json")

def load_data_store():
    if os.path.exists(DATA_STORE_PATH):
        try:
            with open(DATA_STORE_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "next_code": 10000,
        "cases_status": {},
        "case_codes": {},
        "extra_cases": [],
        "municipalities": []
    }

def save_data_store(store):
    try:
        with open(DATA_STORE_PATH, "w", encoding="utf-8") as f:
            json.dump(store, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Erro ao salvar data_store: {e}")

REQUEST_CODE_COUNTER = 0

def get_next_code():
    global REQUEST_CODE_COUNTER
    store = load_data_store()
    curr = store.get("next_code", 10000)
    if REQUEST_CODE_COUNTER > 0 and REQUEST_CODE_COUNTER > curr:
        curr = REQUEST_CODE_COUNTER
    next_val = curr + 10000
    REQUEST_CODE_COUNTER = next_val
    store["next_code"] = next_val
    save_data_store(store)
    return f"#{curr}"

# Credenciais padrão simuladas
USER_DEFAULT_EMAIL = os.getenv('USER_DEFAULT_EMAIL', 'user@example.com')
USER_DEFAULT_PASSWORD = os.getenv('USER_DEFAULT_PASSWORD', 'user123')
ADMIN_DEFAULT_EMAIL = os.getenv('ADMIN_DEFAULT_EMAIL', 'admin@example.com')
ADMIN_DEFAULT_PASSWORD = os.getenv('ADMIN_DEFAULT_PASSWORD', 'admin123')

class SecureBackendHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent caching of JS/CSS during development
        request_path = urlsplit(self.path).path
        if request_path.endswith((".js", ".css", ".html")):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, Prefer")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_HEAD(self):
        if self.path == "/api/cases" or self.path == "/api/municipalities":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
        else:
            super().do_HEAD()

    def do_GET(self):
        clean_path = urlsplit(self.path).path
        if clean_path in ("/admin", "/admin/", "/admin-dashboard", "/admin-dashboard.html"):
            self.send_response(301)
            self.send_header("Location", "/admin.html")
            self.end_headers()
            return
        elif self.path == "/api/cases":
            self.handle_get_cases()
        elif self.path == "/api/municipalities":
            self.handle_get_municipalities()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == "/api/cases":
            self.handle_post_case()
        elif self.path == "/api/municipalities":
            self.handle_post_municipality()
        elif self.path == "/api/login/user":
            self.handle_user_login()
        elif self.path == "/api/login/admin":
            self.handle_admin_login()
        else:
            self.send_error(404, "Endpoint não encontrado")

    def handle_get_cases(self):
        store = load_data_store()
        data = []

        if SUPABASE_URL and SUPABASE_KEY:
            url = f"{SUPABASE_URL}/rest/v1/cases?select=*"
            headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
            req = urllib.request.Request(url, headers=headers)
            try:
                with open_remote(req) as response:
                    data = json.loads(response.read().decode("utf-8"))
            except Exception as e:
                print(f"Supabase GET error: {e}")

        # Baseline cases from Supabase are approved by default
        needs_save = False
        cases_status = store.setdefault("cases_status", {})
        case_codes = store.setdefault("case_codes", {})
        deleted_cases = set(store.get("deleted_cases", []))
        cases_overrides = store.get("cases_overrides", {})

        for idx, c in enumerate(data):
            cid = str(c.get("id"))
            if cid not in cases_status:
                cases_status[cid] = "approved"
                needs_save = True
            c["status"] = cases_status[cid]

            if cid not in case_codes:
                code_val = 10000 * (idx + 1)
                case_codes[cid] = f"#{code_val}"
                if code_val >= store.get("next_code", 10000):
                    store["next_code"] = code_val + 10000
                needs_save = True
            c["request_code"] = case_codes[cid]

        # Merge any extra cases submitted locally/through API
        extra_cases = store.get("extra_cases", [])
        existing_ids = {str(c.get("id")) for c in data}
        for ec in extra_cases:
            if str(ec.get("id")) not in existing_ids:
                ec_id = str(ec.get("id"))
                ec["status"] = cases_status.get(ec_id, ec.get("status", "pending"))
                if ec_id in case_codes:
                    ec["request_code"] = case_codes[ec_id]
                data.append(ec)

        # Filter out deleted cases
        data = [c for c in data if str(c.get("id")) not in deleted_cases]

        # Apply any edited overrides
        for c in data:
            cid = str(c.get("id"))
            if cid in cases_overrides:
                c.update(cases_overrides[cid])

        if needs_save:
            save_data_store(store)

        self.send_json_response(200, data)

    def handle_get_municipalities(self):
        store = load_data_store()
        self.send_json_response(200, store.get("municipalities", []))

    def handle_post_case(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = json.loads(self.rfile.read(content_length))
        records = post_data if isinstance(post_data, list) else [post_data]
        store = load_data_store()

        for record in records:
            if not record.get("status"):
                record["status"] = "pending"
            if not record.get("request_code"):
                record["request_code"] = get_next_code()
            rec_id = str(record.get("id", f"case-{uuid.uuid4().hex[:8]}"))
            record["id"] = rec_id
            store.setdefault("cases_status", {})[rec_id] = record["status"]
            store.setdefault("case_codes", {})[rec_id] = record["request_code"]
            store.setdefault("extra_cases", []).append(record)

        save_data_store(store)
        self.send_json_response(201, records[0] if len(records) == 1 else records)

    def handle_post_municipality(self):
        content_length = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(content_length))
        if not payload.get("status"):
            payload["status"] = "pending"
        if not payload.get("request_code"):
            payload["request_code"] = get_next_code()
        if not payload.get("id"):
            payload["id"] = f"mun-{uuid.uuid4().hex[:8]}"

        store = load_data_store()
        store.setdefault("municipalities", []).append(payload)
        save_data_store(store)
        self.send_json_response(201, payload)

    def handle_approve_case(self, case_id):
        store = load_data_store()
        store.setdefault("cases_status", {})[str(case_id)] = "approved"
        for c in store.get("extra_cases", []):
            if str(c.get("id")) == str(case_id):
                c["status"] = "approved"
        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/cases?id=eq.{case_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
                req = urllib.request.Request(url, data=json.dumps({"status": "approved"}).encode('utf-8'), headers=headers, method='PATCH')
                open_remote(req)
            except Exception:
                pass

        self.send_json_response(200, {"id": case_id, "status": "approved"})

    def handle_reject_case(self, case_id):
        store = load_data_store()
        store.setdefault("cases_status", {})[str(case_id)] = "rejected"
        for c in store.get("extra_cases", []):
            if str(c.get("id")) == str(case_id):
                c["status"] = "rejected"
        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/cases?id=eq.{case_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
                req = urllib.request.Request(url, data=json.dumps({"status": "rejected"}).encode('utf-8'), headers=headers, method='PATCH')
                open_remote(req)
            except Exception:
                pass

        self.send_json_response(200, {"id": case_id, "status": "rejected"})

    def handle_approve_municipality(self, mun_id):
        store = load_data_store()
        target = None
        for m in store.get("municipalities", []):
            if str(m.get("id")) == str(mun_id):
                m["status"] = "approved"
                target = m
                break
        save_data_store(store)
        self.send_json_response(200, target or {"id": mun_id, "status": "approved"})

    def handle_reject_municipality(self, mun_id):
        store = load_data_store()
        target = None
        for m in store.get("municipalities", []):
            if str(m.get("id")) == str(mun_id):
                m["status"] = "rejected"
                target = m
                break
        save_data_store(store)
        self.send_json_response(200, target or {"id": mun_id, "status": "rejected"})

    # ---------- Login Handlers ----------
    def handle_user_login(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(content_length))
            email = data.get('email')
            password = data.get('password')
            if email == USER_DEFAULT_EMAIL and password == USER_DEFAULT_PASSWORD:
                token = generate_random_token()
                response = {"token": token, "user": "user", "email": email}
                self.send_json_response(200, response)
            else:
                self.send_json_response(401, {"error": "Credenciais inválidas"})
        except Exception as e:
            self.send_json_response(400, {"error": str(e)})

    def handle_admin_login(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(content_length))
            email = data.get('email')
            password = data.get('password')
            if email == ADMIN_DEFAULT_EMAIL and password == ADMIN_DEFAULT_PASSWORD:
                token = generate_random_token()
                response = {"token": token, "user": "admin", "email": email}
                self.send_json_response(200, response)
            else:
                self.send_json_response(401, {"error": "Credenciais inválidas"})
        except Exception as e:
            self.send_json_response(400, {"error": str(e)})

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, Prefer")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))


    def handle_delete_case(self, case_id):
        store = load_data_store()
        cid = str(case_id)
        deleted = store.setdefault("deleted_cases", [])
        if cid not in deleted:
            deleted.append(cid)
        store["extra_cases"] = [c for c in store.get("extra_cases", []) if str(c.get("id")) != cid]
        if cid in store.get("cases_status", {}):
            del store["cases_status"][cid]
        if cid in store.get("case_codes", {}):
            del store["case_codes"][cid]
        if cid in store.get("cases_overrides", {}):
            del store["cases_overrides"][cid]
        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/cases?id=eq.{case_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
                req = urllib.request.Request(url, headers=headers, method='DELETE')
                open_remote(req)
            except Exception as e:
                print(f"Supabase delete case error: {e}")

        self.send_json_response(200, {"id": case_id, "deleted": True})

    def handle_edit_case(self, case_id, updated_data):
        store = load_data_store()
        cid = str(case_id)
        overrides = store.setdefault("cases_overrides", {})
        if cid not in overrides:
            overrides[cid] = {}
        overrides[cid].update(updated_data)

        for c in store.get("extra_cases", []):
            if str(c.get("id")) == cid:
                c.update(updated_data)

        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/cases?id=eq.{case_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
                req = urllib.request.Request(url, data=json.dumps(updated_data).encode('utf-8'), headers=headers, method='PATCH')
                open_remote(req)
            except Exception as e:
                print(f"Supabase edit case error: {e}")

        self.send_json_response(200, {"id": case_id, "updated": True, "data": updated_data})

    def handle_delete_municipality(self, mun_id):
        store = load_data_store()
        mid = str(mun_id)
        store["municipalities"] = [m for m in store.get("municipalities", []) if str(m.get("id")) != mid]
        deleted = store.setdefault("deleted_municipalities", [])
        if mid not in deleted:
            deleted.append(mid)
        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/municipalities?id=eq.{mun_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
                req = urllib.request.Request(url, headers=headers, method='DELETE')
                open_remote(req)
            except Exception as e:
                print(f"Supabase delete municipality error: {e}")

        self.send_json_response(200, {"id": mun_id, "deleted": True})

    def handle_edit_municipality(self, mun_id, updated_data):
        store = load_data_store()
        mid = str(mun_id)
        target = None
        for m in store.get("municipalities", []):
            if str(m.get("id")) == mid:
                m.update(updated_data)
                target = m
                break
        save_data_store(store)

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                url = f"{SUPABASE_URL}/rest/v1/municipalities?id=eq.{mun_id}"
                headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}", "Content-Type": "application/json"}
                req = urllib.request.Request(url, data=json.dumps(updated_data).encode('utf-8'), headers=headers, method='PATCH')
                open_remote(req)
            except Exception as e:
                print(f"Supabase edit municipality error: {e}")

        self.send_json_response(200, target or {"id": mun_id, "updated": True, "data": updated_data})


    def do_DELETE(self):
        parts = self.path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'api':
            resource, identifier = parts[1], parts[2]
            if resource == 'cases':
                self.handle_delete_case(identifier)
                return
            if resource == 'municipalities':
                self.handle_delete_municipality(identifier)
                return
        self.send_error(404, "Endpoint DELETE não encontrado")

    def do_PUT(self):
        parts = self.path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'api':
            resource, identifier = parts[1], parts[2]
            try:
                content_length = int(self.headers.get('Content-Length', 0))
                updated_data = json.loads(self.rfile.read(content_length))
            except Exception as e:
                self.send_json_response(400, {"error": f"JSON inválido: {e}"})
                return

            if resource == 'cases':
                self.handle_edit_case(identifier, updated_data)
                return
            if resource == 'municipalities':
                self.handle_edit_municipality(identifier, updated_data)
                return
        self.send_error(404, "Endpoint PUT não encontrado")

    def do_PATCH(self):
        parts = self.path.strip('/').split('/')
        if len(parts) >= 4 and parts[0] == 'api':
            resource, action, identifier = parts[1], parts[2], parts[3]
            if resource == 'cases' and action == 'approve':
                self.handle_approve_case(identifier)
                return
            if resource == 'cases' and action == 'reject':
                self.handle_reject_case(identifier)
                return
            if resource == 'municipalities' and action == 'approve':
                self.handle_approve_municipality(identifier)
                return
            if resource == 'municipalities' and action == 'reject':
                self.handle_reject_municipality(identifier)
                return
        self.send_error(404, "Endpoint PATCH não encontrado")

def run():
    server_dir = pathlib.Path(__file__).parent.resolve()
    os.chdir(server_dir)

    server_address = ("", PORT)
    httpd = ThreadingHTTPServer(server_address, SecureBackendHandler)
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
