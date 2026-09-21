import os
import sys
import json
import pathlib
import mimetypes
import urllib.request
import urllib.error
import ssl
import uuid
import hmac
import hashlib
import base64
import time
import re
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

# ==============================================================================
# SECURITY & AUTHENTICATION UTILITIES (JWT, RATE LIMITING, SQLi & SPACE STRING)
# ==============================================================================

JWT_SECRET = os.environ.get("JWT_SECRET", "sebrae-mg-secure-secret-key-2026-CasesDeSucesso!")
RESOURCE_ID_REGEX = re.compile(r'^[a-zA-Z0-9_\-#]+$')

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('ascii')

def base64url_decode(s: str) -> bytes:
    rem = len(s) % 4
    if rem > 0:
        s += '=' * (4 - rem)
    return base64.urlsafe_b64decode(s.encode('ascii'))

def generate_jwt(user_id: str, email: str, role: str, expires_in_seconds: int = 86400) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    now = int(time.time())
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": now,
        "exp": now + expires_in_seconds
    }
    encoded_header = base64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    encoded_payload = base64url_encode(json.dumps(payload, separators=(',', ':')).encode('utf-8'))
    message = f"{encoded_header}.{encoded_payload}".encode('ascii')
    signature = hmac.new(JWT_SECRET.encode('utf-8'), message, hashlib.sha256).digest()
    encoded_signature = base64url_encode(signature)
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def verify_jwt(token: str):
    if not token or not isinstance(token, str):
        return None
    parts = token.strip().split('.')
    if len(parts) != 3:
        return None
    encoded_header, encoded_payload, encoded_signature = parts
    try:
        message = f"{encoded_header}.{encoded_payload}".encode('ascii')
        expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), message, hashlib.sha256).digest()
        provided_sig = base64url_decode(encoded_signature)
        if not hmac.compare_digest(expected_sig, provided_sig):
            return None
        payload_bytes = base64url_decode(encoded_payload)
        payload = json.loads(payload_bytes.decode('utf-8'))
        now = int(time.time())
        if payload.get("exp") and payload["exp"] < now:
            return None  # Expired
        return payload
    except Exception:
        return None

class SecurityRateLimiter:
    def __init__(self):
        self.failed_logins = {}     # ip -> list of timestamps
        self.lockouts = {}          # ip -> lock_until_timestamp
        self.requests = {}          # ip -> list of timestamps
        self.max_failed = 5
        self.window_seconds = 300   # 5 minutes
        self.lockout_seconds = 900  # 15 minutes
        self.global_rate_limit = 200 # max 200 reqs/min
        self.global_window = 60

    def is_locked(self, ip: str) -> tuple[bool, int]:
        now = time.time()
        lock_until = self.lockouts.get(ip, 0)
        if now < lock_until:
            return True, int(lock_until - now)
        elif ip in self.lockouts:
            del self.lockouts[ip]
            self.failed_logins.pop(ip, None)
        return False, 0

    def record_failed_login(self, ip: str) -> tuple[bool, int]:
        now = time.time()
        attempts = self.failed_logins.setdefault(ip, [])
        self.failed_logins[ip] = [t for t in attempts if now - t < self.window_seconds]
        self.failed_logins[ip].append(now)
        if len(self.failed_logins[ip]) >= self.max_failed:
            lock_until = now + self.lockout_seconds
            self.lockouts[ip] = lock_until
            return True, self.lockout_seconds
        return False, 0

    def record_successful_login(self, ip: str):
        self.failed_logins.pop(ip, None)
        self.lockouts.pop(ip, None)

    def check_global_rate(self, ip: str) -> bool:
        now = time.time()
        reqs = self.requests.setdefault(ip, [])
        self.requests[ip] = [t for t in reqs if now - t < self.global_window]
        if len(self.requests[ip]) >= self.global_rate_limit:
            return False
        self.requests[ip].append(now)
        return True

rate_limiter = SecurityRateLimiter()

# Cooldown e controle de desduplicação de submissões de formulários
recent_form_submissions = {}
SUBMISSION_COOLDOWN_SECONDS = 15

def check_form_duplicate_submission(form_type: str, client_ip: str, unique_key: str) -> tuple[bool, int]:
    now = time.time()
    composite_key = (form_type, client_ip, unique_key.strip().lower())
    last_time = recent_form_submissions.get(composite_key, 0)
    if now - last_time < SUBMISSION_COOLDOWN_SECONDS:
        remaining = max(1, int(SUBMISSION_COOLDOWN_SECONDS - (now - last_time)))
        return True, remaining
    # Purge old entries if dict grows
    if len(recent_form_submissions) > 500:
        cutoff = now - 3600
        for k in list(recent_form_submissions.keys()):
            if recent_form_submissions[k] < cutoff:
                del recent_form_submissions[k]
    recent_form_submissions[composite_key] = now
    return False, 0

def is_valid_resource_id(identifier: str) -> bool:
    if not identifier or not isinstance(identifier, str):
        return False
    return bool(RESOURCE_ID_REGEX.match(identifier.strip()))

def validate_space_string(data: dict, required_fields: list[str]) -> tuple[bool, str]:
    if not isinstance(data, dict):
        return False, "Carga de dados inválida"
    for field in required_fields:
        val = data.get(field)
        if val is None:
            return False, f"Campo obrigatório ausente: {field}"
        if isinstance(val, str):
            if len(val.strip()) == 0:
                return False, f"O campo '{field}' não pode ser vazio ou conter apenas espaços em branco"
    return True, ""

def sanitize_string_fields(obj):
    if isinstance(obj, str):
        s = obj.strip()
        s = re.sub(r'<\s*script[^>]*>.*?<\s*/\s*script\s*>', '', s, flags=re.IGNORECASE | re.DOTALL)
        s = re.sub(r'javascript\s*:', '', s, flags=re.IGNORECASE)
        return s.strip()
    elif isinstance(obj, dict):
        return {k: sanitize_string_fields(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [sanitize_string_fields(x) for x in obj]
    return obj

# Credenciais oficiais padrão
USER_DEFAULT_EMAIL = os.getenv('USER_DEFAULT_EMAIL', 'teste@sebraemg.com.br')
USER_DEFAULT_PASSWORD = os.getenv('USER_DEFAULT_PASSWORD', 'teste123')
ADMIN_DEFAULT_EMAIL = os.getenv('ADMIN_DEFAULT_EMAIL', 'admin@sebraemg.com.br')
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

    def get_client_ip(self) -> str:
        forwarded_for = self.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return self.client_address[0] if self.client_address else "127.0.0.1"

    def get_auth_token_payload(self):
        auth_header = ""
        if hasattr(self, "headers") and self.headers:
            auth_header = self.headers.get("Authorization") or self.headers.get("authorization") or ""
        if not auth_header.startswith("Bearer "):
            return None
        token = auth_header[7:].strip()
        return verify_jwt(token)

    def check_rate_limit(self) -> bool:
        ip = self.get_client_ip()
        if not rate_limiter.check_global_rate(ip):
            self.send_json_response(429, {"error": "Limite de requisições excedido. Aguarde alguns instantes."})
            return False
        return True

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
        if not self.check_rate_limit():
            return

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
        if not self.check_rate_limit():
            return

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

        extra_cases = store.get("extra_cases", [])
        existing_ids = {str(c.get("id")) for c in data}
        for ec in extra_cases:
            if str(ec.get("id")) not in existing_ids:
                ec_id = str(ec.get("id"))
                ec["status"] = cases_status.get(ec_id, ec.get("status", "pending"))
                if ec_id in case_codes:
                    ec["request_code"] = case_codes[ec_id]
                data.append(ec)

        data = [c for c in data if str(c.get("id")) not in deleted_cases]

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória (Token JWT ausente ou inválido)"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = json.loads(self.rfile.read(content_length))
        except Exception as e:
            self.send_json_response(400, {"error": f"JSON inválido: {e}"})
            return

        records = post_data if isinstance(post_data, list) else [post_data]
        store = load_data_store()

        for record in records:
            title_field = "titulo" if "titulo" in record else "titulo_projeto"
            desc_field = "descricao" if "descricao" in record else "descricao_geral"
            school_field = "escola" if "escola" in record else "escola_instituicao"
            tech_field = "tecnicoNome" if "tecnicoNome" in record else "tecnico_nome"
            mun_field = "municipio"

            ok, err = validate_space_string(record, [title_field, desc_field, mun_field, school_field, tech_field])
            if not ok:
                self.send_json_response(400, {"error": err})
                return

        # Prevenção contra múltiplos envios do mesmo case em rápida sucessão
        client_ip = self.get_client_ip()
        first_rec = records[0] if records else {}
        case_key = f"{first_rec.get('titulo') or first_rec.get('titulo_projeto') or ''}:{first_rec.get('municipio') or ''}"
        is_dup, remaining = check_form_duplicate_submission("case", client_ip, case_key)
        if is_dup:
            self.send_json_response(429, {
                "error": f"Esta solicitação já foi enviada e está sendo processada. Aguarde {remaining} segundos para evitar envios duplicados.",
                "retry_after": remaining
            })
            return

        records = [sanitize_string_fields(r) for r in records]

        for record in records:
            if not record.get("status"):
                record["status"] = "pending"
            if not record.get("request_code"):
                record["request_code"] = get_next_code()
            rec_id = str(record.get("id", f"case-{uuid.uuid4().hex[:8]}"))
            if not is_valid_resource_id(rec_id):
                self.send_json_response(400, {"error": "Identificador de case inválido"})
                return

            record["id"] = rec_id
            store.setdefault("cases_status", {})[rec_id] = record["status"]
            store.setdefault("case_codes", {})[rec_id] = record["request_code"]
            store.setdefault("extra_cases", []).append(record)

        save_data_store(store)
        self.send_json_response(201, records[0] if len(records) == 1 else records)

    def handle_post_municipality(self):
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória (Token JWT ausente ou inválido)"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            payload = json.loads(self.rfile.read(content_length))
        except Exception as e:
            self.send_json_response(400, {"error": f"JSON inválido: {e}"})
            return

        name_field = "nome" if "nome" in payload else "municipio"
        reg_field = "regional"
        mr_field = "mr" if "mr" in payload else "microrregiao_mr"

        ok, err = validate_space_string(payload, [name_field, reg_field, mr_field])
        if not ok:
            self.send_json_response(400, {"error": err})
            return

        # Prevenção contra múltiplos envios do mesmo município em rápida sucessão
        client_ip = self.get_client_ip()
        mun_name = str(payload.get(name_field) or "").strip()
        is_dup, remaining = check_form_duplicate_submission("municipality", client_ip, mun_name)
        if is_dup:
            self.send_json_response(429, {
                "error": f"Esta solicitação já foi enviada e está sendo processada. Aguarde {remaining} segundos para evitar envios duplicados.",
                "retry_after": remaining
            })
            return

        payload = sanitize_string_fields(payload)

        if not payload.get("status"):
            payload["status"] = "pending"
        if not payload.get("request_code"):
            payload["request_code"] = get_next_code()
        if not payload.get("id"):
            payload["id"] = f"mun-{uuid.uuid4().hex[:8]}"

        mid = str(payload.get("id"))
        if not is_valid_resource_id(mid):
            self.send_json_response(400, {"error": "Identificador de município inválido"})
            return

        store = load_data_store()
        store.setdefault("municipalities", []).append(payload)
        save_data_store(store)
        self.send_json_response(201, payload)

    def handle_approve_case(self, case_id):
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(case_id):
            self.send_json_response(400, {"error": "Identificador de case inválido"})
            return

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(case_id):
            self.send_json_response(400, {"error": "Identificador de case inválido"})
            return

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(mun_id):
            self.send_json_response(400, {"error": "Identificador de município inválido"})
            return

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(mun_id):
            self.send_json_response(400, {"error": "Identificador de município inválido"})
            return

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
        ip = self.get_client_ip()
        is_locked, remaining = rate_limiter.is_locked(ip)
        if is_locked:
            self.send_json_response(429, {
                "error": f"Muitas tentativas incorretas. Acesso bloqueado temporariamente por mais {remaining} segundos.",
                "retry_after": remaining
            })
            return

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(content_length))
            email = (data.get('email') or '').strip().lower()
            password = str(data.get('password') or '')

            email_match = hmac.compare_digest(email.encode('utf-8'), USER_DEFAULT_EMAIL.lower().encode('utf-8'))
            pass_match = hmac.compare_digest(password.encode('utf-8'), USER_DEFAULT_PASSWORD.encode('utf-8'))

            if email_match and pass_match:
                rate_limiter.record_successful_login(ip)
                token = generate_jwt(user_id=email, email=email, role="user")
                response = {"token": token, "user": "user", "email": email, "role": "user"}
                self.send_json_response(200, response)
            else:
                locked, lockout_secs = rate_limiter.record_failed_login(ip)
                if locked:
                    self.send_json_response(429, {
                        "error": f"Limite de tentativas incorretas excedido. Bloqueado por {lockout_secs} segundos.",
                        "retry_after": lockout_secs
                    })
                else:
                    self.send_json_response(401, {"error": "Credenciais inválidas"})
        except Exception as e:
            self.send_json_response(400, {"error": f"Requisição inválida: {str(e)}"})

    def handle_admin_login(self):
        ip = self.get_client_ip()
        is_locked, remaining = rate_limiter.is_locked(ip)
        if is_locked:
            self.send_json_response(429, {
                "error": f"Muitas tentativas incorretas. Acesso bloqueado temporariamente por mais {remaining} segundos.",
                "retry_after": remaining
            })
            return

        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = json.loads(self.rfile.read(content_length))
            email = (data.get('email') or '').strip().lower()
            password = str(data.get('password') or '')

            email_match = hmac.compare_digest(email.encode('utf-8'), ADMIN_DEFAULT_EMAIL.lower().encode('utf-8'))
            pass_match = hmac.compare_digest(password.encode('utf-8'), ADMIN_DEFAULT_PASSWORD.encode('utf-8'))

            if email_match and pass_match:
                rate_limiter.record_successful_login(ip)
                token = generate_jwt(user_id=email, email=email, role="admin")
                response = {"token": token, "user": "admin", "email": email, "role": "admin"}
                self.send_json_response(200, response)
            else:
                locked, lockout_secs = rate_limiter.record_failed_login(ip)
                if locked:
                    self.send_json_response(429, {
                        "error": f"Limite de tentativas incorretas excedido. Bloqueado por {lockout_secs} segundos.",
                        "retry_after": lockout_secs
                    })
                else:
                    self.send_json_response(401, {"error": "Credenciais de administrador inválidas"})
        except Exception as e:
            self.send_json_response(400, {"error": f"Requisição inválida: {str(e)}"})

    def send_json_response(self, status_code, data):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, apikey, Prefer")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def handle_delete_case(self, case_id):
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(case_id):
            self.send_json_response(400, {"error": "Identificador de case inválido"})
            return

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(case_id):
            self.send_json_response(400, {"error": "Identificador de case inválido"})
            return

        # Check space string for any text fields being updated
        if isinstance(updated_data, dict):
            for k, v in updated_data.items():
                if isinstance(v, str) and k in ("titulo", "titulo_projeto", "descricao", "descricao_geral", "municipio") and len(v.strip()) == 0:
                    self.send_json_response(400, {"error": f"O campo '{k}' não pode conter apenas espaços em branco"})
                    return

        updated_data = sanitize_string_fields(updated_data)
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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(mun_id):
            self.send_json_response(400, {"error": "Identificador de município inválido"})
            return

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
        user = self.get_auth_token_payload()
        if not user:
            self.send_json_response(401, {"error": "Autenticação obrigatória"})
            return
        if user.get("role") != "admin":
            self.send_json_response(403, {"error": "Permissão de administrador necessária"})
            return
        if not is_valid_resource_id(mun_id):
            self.send_json_response(400, {"error": "Identificador de município inválido"})
            return

        # Check space string for text fields
        if isinstance(updated_data, dict):
            for k, v in updated_data.items():
                if isinstance(v, str) and k in ("nome", "municipio", "regional", "mr") and len(v.strip()) == 0:
                    self.send_json_response(400, {"error": f"O campo '{k}' não pode conter apenas espaços em branco"})
                    return

        updated_data = sanitize_string_fields(updated_data)
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
        if not self.check_rate_limit():
            return

        parts = self.path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'api':
            resource, identifier = parts[1], parts[2]
            if not is_valid_resource_id(identifier):
                self.send_json_response(400, {"error": "Identificador inválido ou potencialmente perigoso"})
                return
            if resource == 'cases':
                self.handle_delete_case(identifier)
                return
            if resource == 'municipalities':
                self.handle_delete_municipality(identifier)
                return
        self.send_error(404, "Endpoint DELETE não encontrado")

    def do_PUT(self):
        if not self.check_rate_limit():
            return

        parts = self.path.strip('/').split('/')
        if len(parts) >= 3 and parts[0] == 'api':
            resource, identifier = parts[1], parts[2]
            if not is_valid_resource_id(identifier):
                self.send_json_response(400, {"error": "Identificador inválido ou potencialmente perigoso"})
                return
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
        if not self.check_rate_limit():
            return

        parts = self.path.strip('/').split('/')
        if len(parts) >= 4 and parts[0] == 'api':
            resource, action, identifier = parts[1], parts[2], parts[3]
            if not is_valid_resource_id(identifier):
                self.send_json_response(400, {"error": "Identificador inválido ou potencialmente perigoso"})
                return
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
