import io
import json
import time
import unittest
import server

class TestSecurity(unittest.TestCase):
    def setUp(self):
        server.rate_limiter = server.SecurityRateLimiter()

    def test_is_valid_resource_id_blocks_sql_injection(self):
        valid_ids = ["case-123", "mun_456", "ABC-123_45", "#10001", "id12345"]
        for vid in valid_ids:
            self.assertTrue(server.is_valid_resource_id(vid), f"Should accept valid ID: {vid}")

        malicious_ids = [
            "1; DROP TABLE cases;--",
            "case' OR '1'='1",
            'case" OR "1"="1',
            "../../../etc/passwd",
            "<script>alert(1)</script>",
            "case 123",
            "case;select*from users",
            "",
            None
        ]
        for mid in malicious_ids:
            self.assertFalse(server.is_valid_resource_id(mid), f"Should reject malicious ID: {mid}")

    def test_brute_force_rate_limiter(self):
        ip = "10.0.0.42"
        limiter = server.SecurityRateLimiter()
        
        is_locked, _ = limiter.is_locked(ip)
        self.assertFalse(is_locked)
        
        # 5 failed attempts
        for _ in range(5):
            limiter.record_failed_login(ip)
            
        # 6th attempt should be locked out
        is_locked, remaining = limiter.is_locked(ip)
        self.assertTrue(is_locked)
        self.assertGreater(remaining, 0)

        # Successful login on another IP should not be locked
        other_ip = "10.0.0.43"
        limiter.record_successful_login(other_ip)
        is_other_locked, _ = limiter.is_locked(other_ip)
        self.assertFalse(is_other_locked)

    def test_jwt_generation_verification_and_tamper(self):
        user_id = "admin-user-001"
        email = "admin@sebraemg.com.br"
        role = "admin"

        token = server.generate_jwt(user_id, email, role, expires_in_seconds=3600)
        self.assertIsInstance(token, str)
        self.assertEqual(token.count("."), 2)

        # Verification succeeds
        payload = server.verify_jwt(token)
        self.assertIsNotNone(payload)
        self.assertEqual(payload["sub"], user_id)
        self.assertEqual(payload["email"], email)
        self.assertEqual(payload["role"], role)

        # Tampered signature fails
        parts = token.split(".")
        tampered_token = f"{parts[0]}.{parts[1]}.tampered_sig"
        self.assertIsNone(server.verify_jwt(tampered_token))

        # Expired token fails
        expired_token = server.generate_jwt(user_id, email, role, expires_in_seconds=-10)
        self.assertIsNone(server.verify_jwt(expired_token))

    def test_space_string_validation_and_sanitization(self):
        valid, _ = server.validate_space_string({"campo": "   "}, ["campo"])
        self.assertFalse(valid)
        valid, _ = server.validate_space_string({"campo": ""}, ["campo"])
        self.assertFalse(valid)
        valid, _ = server.validate_space_string({"campo": "  \t\n  "}, ["campo"])
        self.assertFalse(valid)
        valid, _ = server.validate_space_string({"campo": "Belo Horizonte"}, ["campo"])
        self.assertTrue(valid)

        dirty_data = {
            "titulo": "  Case Empreendedorismo <script>alert(1)</script>  ",
            "link": "javascript:alert(2)",
            "descricao": "Texto seguro"
        }
        clean_data = server.sanitize_string_fields(dirty_data)
        self.assertEqual(clean_data["titulo"], "Case Empreendedorismo")
        self.assertEqual(clean_data["link"], "alert(2)")
        self.assertEqual(clean_data["descricao"], "Texto seguro")

    def test_login_authentication_and_lockout(self):
        handler = server.SecureBackendHandler.__new__(server.SecureBackendHandler)
        handler.client_address = ("192.168.1.50", 12345)
        responses = []
        handler.send_json_response = lambda status, data: responses.append((status, data))

        def set_body(payload):
            body = json.dumps(payload).encode("utf-8")
            handler.headers = {"Content-Length": str(len(body))}
            handler.rfile = io.BytesIO(body)

        # 1. Valid user login
        set_body({"email": "teste@sebraemg.com.br", "password": "teste123"})
        handler.handle_user_login()
        self.assertEqual(responses[-1][0], 200)
        self.assertIn("token", responses[-1][1])
        self.assertEqual(responses[-1][1]["role"], "user")

        # 2. Valid admin login
        set_body({"email": "admin@sebraemg.com.br", "password": "admin123"})
        handler.handle_admin_login()
        self.assertEqual(responses[-1][0], 200)
        self.assertIn("token", responses[-1][1])
        self.assertEqual(responses[-1][1]["role"], "admin")

        # 3. Invalid credentials
        set_body({"email": "hacker@evil.com", "password": "wrongpass"})
        handler.handle_user_login()
        self.assertEqual(responses[-1][0], 401)

        # 4. Trigger brute force lockout (4 more failed attempts = total 5)
        for _ in range(4):
            set_body({"email": "teste@sebraemg.com.br", "password": "wrongpass"})
            handler.handle_user_login()
        
        # 6th attempt should be blocked by rate limiter with 429
        set_body({"email": "teste@sebraemg.com.br", "password": "teste123"})
        handler.handle_user_login()
        self.assertEqual(responses[-1][0], 429)

    def test_protected_endpoints_auth_and_authorization(self):
        handler = server.SecureBackendHandler.__new__(server.SecureBackendHandler)
        handler.client_address = ("192.168.1.60", 12345)
        responses = []
        handler.send_json_response = lambda status, data: responses.append((status, data))

        # Missing token -> 401
        handler.headers = {}
        handler.handle_approve_case("case-1")
        self.assertEqual(responses[-1][0], 401)

        # User token attempting admin action -> 403
        user_token = server.generate_jwt("u1", "teste@sebraemg.com.br", "user")
        handler.headers = {"Authorization": f"Bearer {user_token}"}
        handler.handle_approve_case("case-1")
        self.assertEqual(responses[-1][0], 403)

        # Admin token on SQL injection resource ID -> 400
        admin_token = server.generate_jwt("a1", "admin@sebraemg.com.br", "admin")
        handler.headers = {"Authorization": f"Bearer {admin_token}"}
        handler.handle_approve_case("case-1; DROP TABLE cases;--")
        self.assertEqual(responses[-1][0], 400)

        # Space string only in POST case -> 400
        body = json.dumps({"titulo": "   ", "municipio": "Belo Horizonte", "regional": "Centro"}).encode("utf-8")
        handler.headers = {
            "Authorization": f"Bearer {admin_token}",
            "Content-Length": str(len(body))
        }
        handler.rfile = io.BytesIO(body)
        handler.handle_post_case()
        self.assertEqual(responses[-1][0], 400)

if __name__ == '__main__':
    unittest.main()
