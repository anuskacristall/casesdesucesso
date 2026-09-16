import io
import json

import server


class FakeResponse:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps([{"id": "case-1", "status": "approved"}]).encode()


def test_approve_case_only_updates_status(monkeypatch):
    requests = []
    responses = []

    def fake_urlopen(request, context=None):
        requests.append(request)
        return FakeResponse()

    handler = server.SecureBackendHandler.__new__(server.SecureBackendHandler)
    handler.send_json_response = lambda status, data: responses.append((status, data))
    monkeypatch.setattr(server, "open_remote", fake_urlopen)

    handler.handle_approve_case("case-1")

    assert responses == [(200, {"id": "case-1", "status": "approved"})]
    assert requests[0].method == "PATCH"
    assert json.loads(requests[0].data) == {"status": "approved"}
    assert not any("resend" in request.full_url.lower() for request in requests)
