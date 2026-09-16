import server


def test_get_next_code_is_sequential(monkeypatch):
    store = server.load_data_store()
    store["next_code"] = 10000
    server.save_data_store(store)
    monkeypatch.setattr(server, "REQUEST_CODE_COUNTER", 0)

    assert server.get_next_code() == "#10000"
    assert server.get_next_code() == "#20000"
    assert server.get_next_code() == "#30000"
