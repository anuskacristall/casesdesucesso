import ast
import os
import re
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def validate_js_syntax(filepath):
    """Tokeniza e valida abertura e fechamento balanceado de blocos em JavaScript."""
    with open(filepath, "r", encoding="utf-8") as f:
        src = f.read()

    i = 0
    n = len(src)
    stack = []

    while i < n:
        c = src[i]
        nxt = src[i+1] if i+1 < n else ""

        # Comentário de linha //
        if c == "/" and nxt == "/":
            i += 2
            while i < n and src[i] != "\n":
                i += 1
            continue

        # Comentário de bloco /* ... */
        if c == "/" and nxt == "*":
            i += 2
            while i < n - 1 and not (src[i] == "*" and src[i+1] == "/"):
                i += 1
            i += 2
            continue

        # String com aspas simples '...'
        if c == "'":
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                elif src[i] == "'":
                    i += 1
                    break
                else:
                    i += 1
            continue

        # String com aspas duplas "..."
        if c == '"':
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                elif src[i] == '"':
                    i += 1
                    break
                else:
                    i += 1
            continue

        # Template literal `...`
        if c == "`":
            i += 1
            while i < n:
                if src[i] == "\\":
                    i += 2
                elif src[i] == "$" and i+1 < n and src[i+1] == "{":
                    stack.append(("{", i, "template"))
                    i += 2
                    break
                elif src[i] == "`":
                    i += 1
                    break
                else:
                    i += 1
            continue

        # Expressão regular /.../
        if c == "/" and nxt not in ("/", "*"):
            prev_idx = i - 1
            while prev_idx >= 0 and src[prev_idx] in " \t\r\n":
                prev_idx -= 1
            prev_c = src[prev_idx] if prev_idx >= 0 else ""
            if prev_c in "=([,{;:!&|?~^":
                i += 1
                while i < n:
                    if src[i] == "\\":
                        i += 2
                    elif src[i] == "/":
                        i += 1
                        break
                    elif src[i] == "\n":
                        break
                    else:
                        i += 1
                continue

        # Delimitadores estruturais
        if c in "({[":
            stack.append((c, i, "normal"))
        elif c in ")}]":
            matching = {"(": ")", "{": "}", "[": "]"}.get(stack[-1][0] if stack else "")
            if not stack or matching != c:
                line = src[:i].count("\n") + 1
                return False, f"Delimitador '{c}' inesperado na linha {line}"
            popped = stack.pop()
            if popped[2] == "template":
                # Continua no template literal
                while i < n:
                    i += 1
                    if i >= n:
                        break
                    if src[i] == "\\":
                        i += 1
                    elif src[i] == "$" and i+1 < n and src[i+1] == "{":
                        stack.append(("{", i, "template"))
                        i += 1
                        break
                    elif src[i] == "`":
                        break
        i += 1

    if stack:
        first = stack[0]
        line = src[:first[1]].count("\n") + 1
        return False, f"Bloco '{first[0]}' nao fechado iniciado na linha {line}"
    return True, "OK"


class TestLint(unittest.TestCase):
    def test_python_syntax_and_compilation(self):
        """Verifica que todos os arquivos Python compilam perfeitamente sem erros de sintaxe."""
        py_files = []
        for root, dirs, files in os.walk(ROOT_DIR):
            rel_root = os.path.relpath(root, ROOT_DIR)
            if rel_root.startswith(".git") or "__pycache__" in rel_root:
                continue
            for f in files:
                if f.endswith(".py"):
                    py_files.append(os.path.join(root, f))

        self.assertGreater(len(py_files), 0, "Deveria haver arquivos Python no projeto.")
        for py_path in py_files:
            rel_path = os.path.relpath(py_path, ROOT_DIR)
            with self.subTest(file=rel_path):
                with open(py_path, "r", encoding="utf-8-sig") as f:
                    content = f.read()
                # 1. Parse AST
                try:
                    tree = ast.parse(content, filename=rel_path)
                    self.assertIsNotNone(tree)
                except SyntaxError as e:
                    self.fail(f"Erro de sintaxe em {rel_path}: {e}")

                # 2. Compile to bytecode
                try:
                    code_obj = compile(content, rel_path, "exec")
                    self.assertIsNotNone(code_obj)
                except Exception as e:
                    self.fail(f"Erro de compilacao em {rel_path}: {e}")

    def test_javascript_syntax_integrity(self):
        """Verifica integridade de sintaxe e balanceamento de blocos em arquivos JavaScript."""
        js_files = ["app.js", "admin.js", "municipalities.js"]
        for js_name in js_files:
            js_path = os.path.join(ROOT_DIR, js_name)
            if not os.path.exists(js_path):
                continue
            with self.subTest(file=js_name):
                is_valid, err_msg = validate_js_syntax(js_path)
                self.assertTrue(is_valid, f"Erro em {js_name}: {err_msg}")

    def test_javascript_critical_functions_exist(self):
        """Garante que funcoes essenciais e manipuladores de seguranca estao declarados."""
        app_js_path = os.path.join(ROOT_DIR, "app.js")
        with open(app_js_path, "r", encoding="utf-8") as f:
            app_code = f.read()

        required_app_funcs = [
            "function handleLogin",
            "function handleLogout",
            "function handleFormSubmit",
            "function handleMunicipalitySubmit",
            "function getRegionalColorClass",
            "function showSubmissionLoadingModal",
            "isSubmittingMunicipality",
            "sebrae_auth_token"
        ]
        for func in required_app_funcs:
            self.assertIn(func, app_code, f"app.js deve conter '{func}'")

        admin_js_path = os.path.join(ROOT_DIR, "admin.js")
        with open(admin_js_path, "r", encoding="utf-8") as f:
            admin_code = f.read()

        required_admin_funcs = [
            "function checkAdminAuth",
            "function handleAdminLoginSubmit",
            "function handleAdminLogout",
            "function getAdminAuthHeaders",
            "function deleteMunicipality",
            "function deleteCase",
            "function handleSaveMunicipalityEdit",
            "function handleSaveCaseEdit",
            "sebrae_admin_token"
        ]
        for func in required_admin_funcs:
            self.assertIn(func, admin_code, f"admin.js deve conter '{func}'")

    def test_html_files_integrity(self):
        """Verifica que index.html e admin.html existem e referenciam os scripts e modais corretos."""
        for html_name, script_name in [("index.html", "app.js"), ("admin.html", "admin.js")]:
            html_path = os.path.join(ROOT_DIR, html_name)
            self.assertTrue(os.path.exists(html_path), f"{html_name} deve existir.")
            with open(html_path, "r", encoding="utf-8") as f:
                content = f.read()
            self.assertIn("<!DOCTYPE html>", content)
            self.assertIn(script_name, content, f"{html_name} deve referenciar {script_name}")
        
        # Verifica presenca do modal de bloqueio de submissao
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_content = f.read()
        self.assertIn("modal-submission-loading", index_content, "index.html deve conter o modal de bloqueio de envio.")
        self.assertIn("Aguarde, estamos registrando as informações...", index_content)


if __name__ == "__main__":
    unittest.main()
