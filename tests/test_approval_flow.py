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
        self.assertEqual(requests[0].method, "PATCH")
        self.assertEqual(json.loads(requests[0].data), {"status": "approved"})
        self.assertFalse(any("resend" in request.full_url.lower() for request in requests))


if __name__ == "__main__":
    unittest.main()
