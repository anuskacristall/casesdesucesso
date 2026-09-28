import os
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class TestCSVExport(unittest.TestCase):
    """Valida a formatação de exportação CSV, inclusão de indicadores, instrumentos e municípios."""

    def setUp(self):
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            self.index_html = f.read()

        with open(os.path.join(ROOT_DIR, "admin.html"), "r", encoding="utf-8") as f:
            self.admin_html = f.read()

        with open(os.path.join(ROOT_DIR, "app.js"), "r", encoding="utf-8") as f:
            self.app_js = f.read()

        with open(os.path.join(ROOT_DIR, "admin.js"), "r", encoding="utf-8") as f:
            self.admin_js = f.read()

    def test_public_export_modal_has_municipios_option(self):
        """Garante que o seletor público de exportação contém a opção de municípios."""
        self.assertIn('value="municipios"', self.index_html)
        self.assertIn("Municípios de Referência", self.index_html)

    def test_admin_has_export_button_and_labels(self):
        """Garante que o painel admin possui botão de exportar tabela atual."""
        self.assertIn('id="btn-admin-export"', self.admin_html)
        self.assertIn("btn-export-admin", self.admin_html)
        self.assertIn("exportCurrentAdminTableCSV", self.admin_html)
        self.assertIn("Exportar Municípios (CSV)", self.admin_html)

    def test_admin_js_dynamic_label_and_functions(self):
        """Valida que o admin.js gerencia filtros e exportações dinâmicas por aba."""
        self.assertIn("getFilteredAdminMunicipalities", self.admin_js)
        self.assertIn("getFilteredAdminCases", self.admin_js)
        self.assertIn("exportCurrentAdminTableCSV", self.admin_js)
        self.assertIn("btn-admin-export-label", self.admin_js)
        self.assertIn("Planilha_Admin_Municipios", self.admin_js)
        self.assertIn("Planilha_Admin_Cases", self.admin_js)

    def test_app_js_exports_all_13_criteria_and_clean_jepp(self):
        """Verifica se os 13 critérios oficiais e instrumentos constam no CSV e se JEPP não exporta PARCIAL."""
        expected_criteria = [
            "1º EE > 70% (13 pts)",
            "2º Parceria Sec. Educação (12 pts)",
            "3º JEPP no Município (11 pts)",
            "4º Produto Despertar (10 pts)",
            "5º Parceria Superintendência (9 pts)",
            "6º Parceria IES (8 pts)",
            "7º Rede Aqui Tem Sebrae (7 pts)",
            "8º Convênio Sebrae (6 pts)",
            "9º Comitê Gestor (5 pts)",
            "10º Empresa Simulada (4 pts)",
            "11º Escola Sebrae (3 pts)",
            "12º Cooperativa de Crédito (2 pts)",
            "13º Lei EE (1 pt)"
        ]
        for crit in expected_criteria:
            self.assertIn(crit, self.app_js, f"app.js deve conter cabeçalho {crit}")
            self.assertIn(crit, self.admin_js, f"admin.js deve conter cabeçalho {crit}")

        self.assertIn("Planilha_Municipios_SEBRAE.csv", self.app_js)
        self.assertIn("Destaque em Instrumentos", self.app_js)
        self.assertIn("Pontuação dos Instrumentos", self.app_js)
        self.assertIn("Instrumentos Aplicados", self.app_js)
        self.assertIn("formatInstrumentsForCSV", self.app_js)

        # Garante que não há exportação de 'PARCIAL' em JEPP
        self.assertNotIn('escapeCSV(item.jeppStatus || "Não")', self.app_js)

    def test_student_and_professor_field_separation(self):
        """Verifica se os campos de estudante e professor estão devidamente discriminados nas colunas."""
        self.assertIn("Nome do Professor", self.app_js)
        self.assertIn("Nome do Estudante Empreendedor", self.app_js)
        self.assertIn("Nome da Empresa / Empreendimento", self.app_js)
        self.assertIn("Tipo de Negócio", self.app_js)
        self.assertIn("Descrição da Empresa", self.app_js)

        self.assertIn("Nome do Professor", self.admin_js)
        self.assertIn("Nome do Estudante Empreendedor", self.admin_js)
        self.assertIn("Nome da Empresa / Empreendimento", self.admin_js)

if __name__ == "__main__":
    unittest.main()
