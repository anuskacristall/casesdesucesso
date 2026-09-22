import io
import json
import unittest

import server


class FakeResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps([{"id": "case-1", "status": "approved"}]).encode()


class TestApprovalFlow(unittest.TestCase):
    def test_approve_case_only_updates_status(self):
        requests = []
        responses = []

        def fake_urlopen(request, context=None):
            requests.append(request)
            return FakeResponse()

        handler = server.SecureBackendHandler.__new__(server.SecureBackendHandler)
        admin_token = server.generate_jwt("admin-1", "admin@sebraemg.com.br", "admin")
        handler.headers = {"Authorization": f"Bearer {admin_token}"}
        handler.send_json_response = lambda status, data: responses.append((status, data))

        orig_urlopen = getattr(server, "open_remote", None)
        server.open_remote = fake_urlopen
        try:
            handler.handle_approve_case("case-1")
        finally:
            server.open_remote = orig_urlopen

        self.assertEqual(responses, [(200, {"id": "case-1", "status": "approved"})])
        patch_requests = [r for r in requests if r.get_method() == "PATCH"]
        self.assertEqual(len(patch_requests), 1)
        self.assertEqual(json.loads(patch_requests[0].data), {"status": "approved"})
        self.assertFalse(any("resend" in request.full_url.lower() for request in requests))

    def test_approve_case_blocked_if_parent_municipality_rejected(self):
        responses = []

        handler = server.SecureBackendHandler.__new__(server.SecureBackendHandler)
        admin_token = server.generate_jwt("admin-1", "admin@sebraemg.com.br", "admin")
        handler.headers = {"Authorization": f"Bearer {admin_token}"}
        handler.send_json_response = lambda status, data: responses.append((status, data))

        store = server.load_data_store()
        # Create a test case with a rejected municipality
        test_case_id = "test-case-rejected-parent"
        test_mun_name = "Municipio Rejeitado Teste"
        store.setdefault("extra_cases", []).append({
            "id": test_case_id,
            "titulo": "Case Teste",
            "municipio": test_mun_name,
            "status": "pending"
        })
        store.setdefault("municipalities", []).append({
            "id": "mun-test-rejected",
            "nome": test_mun_name,
            "status": "rejected"
        })
        server.save_data_store(store)

        try:
            handler.handle_approve_case(test_case_id)
            self.assertEqual(len(responses), 1)
            status_code, resp_data = responses[0]
            self.assertEqual(status_code, 400)
            self.assertIn("está com status REJEITADO", resp_data.get("error", ""))
        finally:
            # Clean up test data
            clean_store = server.load_data_store()
            clean_store["extra_cases"] = [c for c in clean_store.get("extra_cases", []) if str(c.get("id")) != test_case_id]
            clean_store["municipalities"] = [m for m in clean_store.get("municipalities", []) if str(m.get("id")) != "mun-test-rejected"]
            server.save_data_store(clean_store)


if __name__ == "__main__":
    unittest.main()
