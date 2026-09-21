import unittest

import server


class TestCaseCode(unittest.TestCase):
    def test_get_next_code_is_sequential(self):
        store = server.load_data_store()
        store["next_code"] = 10000
        server.save_data_store(store)
        server.REQUEST_CODE_COUNTER = 0

        self.assertEqual(server.get_next_code(), "#10000")
        self.assertEqual(server.get_next_code(), "#20000")
        self.assertEqual(server.get_next_code(), "#30000")


if __name__ == "__main__":
    unittest.main()
