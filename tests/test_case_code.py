import server


def test_get_next_code_is_sequential(monkeypatch):
    monkeypatch.setattr(server, "REQUEST_CODE_COUNTER", 0)

    assert server.get_next_code() == "#0001"
    assert server.get_next_code() == "#0002"
    assert server.get_next_code() == "#0003"
