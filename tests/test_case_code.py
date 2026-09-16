import server


def test_get_next_code_is_sequential(monkeypatch):
    monkeypatch.setattr(server, "REQUEST_CODE_COUNTER", 0)

    assert server.get_next_code() == "#000001"
    assert server.get_next_code() == "#000002"
    assert server.get_next_code() == "#000003"
