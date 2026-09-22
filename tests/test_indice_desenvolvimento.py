import os
import sys
import unittest

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from server import calculate_municipio_development_index


class TestIndiceDesenvolvimento(unittest.TestCase):
    """Testes completos da regra de negócio e visualização do Índice de Desenvolvimento do Município."""

    def test_criteria_order_weights_and_sum(self):
        """Verifica a ordem dos 10 critérios, seus pesos de 10 a 1 e soma total 55."""
        dummy_all_true = {
            "educacao_70_porcento": True,
            "jepp_municipio": "Total",
            "convenio_parceria": True,
            "comite_acoes_conjuntas": True,
            "parceria_ies": True,
            "empresa_simulada": True,
            "escola_sebrae": True,
            "cooperativa_credito": True,
            "parceria_superintendencia": True,
            "lei_educacao_empreendedora": True,
        }
        res = calculate_municipio_development_index(dummy_all_true)
        self.assertEqual(res["pontuacao_maxima"], 55)
        self.assertEqual(res["pontuacao"], 55)
        self.assertEqual(res["percentual"], 100.0)
        self.assertEqual(res["classificacao"], "Desenvolvido")
        self.assertEqual(res["classificacao_key"], "desenvolvido")

        criterios = res["criterios"]
        self.assertEqual(len(criterios), 10)

        expected = [
            (1, "1º", 10, "educacao_70_porcento"),
            (2, "2º", 9, "jepp_municipio"),
            (3, "3º", 8, "convenio_parceria"),
            (4, "4º", 7, "comite_acoes_conjuntas"),
            (5, "5º", 6, "parceria_ies"),
            (6, "6º", 5, "empresa_simulada"),
            (7, "7º", 4, "escola_sebrae"),
            (8, "8º", 3, "cooperativa_credito"),
            (9, "9º", 2, "parceria_superintendencia"),
            (10, "10º", 1, "lei_educacao_empreendedora"),
        ]

        total_weights = 0
        for idx, (ordem, ordem_str, peso, ident) in enumerate(expected):
            c = criterios[idx]
            self.assertEqual(c["ordem"], ordem)
            self.assertEqual(c["ordem_str"], ordem_str)
            self.assertEqual(c["peso"], peso)
            self.assertEqual(c["identificador"], ident)
            self.assertTrue(c["atendido"])
            self.assertEqual(c["pontos"], peso)
            total_weights += peso

        self.assertEqual(total_weights, 55)

    def test_score_cutoffs_and_tiers(self):
        """Valida as faixas de corte exatas:
        - Início: 0 a 21 pts (0% a 39%)
        - Em Desenvolvimento: 22 a 38 pts (40% a 69%)
        - Desenvolvido: 39 a 55 pts (70% a 100%)
        """
        # 0 pontos -> Início
        res0 = calculate_municipio_development_index({})
        self.assertEqual(res0["pontuacao"], 0)
        self.assertEqual(res0["percentual"], 0.0)
        self.assertEqual(res0["classificacao"], "Início")
        self.assertEqual(res0["classificacao_key"], "inicio")

        # 21 pontos (peso 10 + 8 + 3 = 21) -> Início
        res21 = calculate_municipio_development_index({
            "educacao_70_porcento": True,  # 10
            "convenio_parceria": True,    # 8
            "cooperativa_credito": True   # 3
        })
        self.assertEqual(res21["pontuacao"], 21)
        self.assertEqual(res21["percentual"], 38.2)
        self.assertEqual(res21["classificacao"], "Início")
        self.assertEqual(res21["classificacao_key"], "inicio")

        # 22 pontos (peso 10 + 9 + 3 = 22) -> Em Desenvolvimento
        res22 = calculate_municipio_development_index({
            "educacao_70_porcento": True,  # 10
            "jepp_municipio": "Total",     # 9
            "cooperativa_credito": True    # 3
        })
        self.assertEqual(res22["pontuacao"], 22)
        self.assertEqual(res22["percentual"], 40.0)
        self.assertEqual(res22["classificacao"], "Em Desenvolvimento")
        self.assertEqual(res22["classificacao_key"], "em_desenvolvimento")

        # 38 pontos (peso 10 + 9 + 8 + 7 + 4 = 38) -> Em Desenvolvimento
        res38 = calculate_municipio_development_index({
            "educacao_70_porcento": True,    # 10
            "jepp_municipio": "Sim",         # 9
            "convenio_parceria": True,      # 8
            "comite_acoes_conjuntas": True,  # 7
            "escola_sebrae": True           # 4
        })
        self.assertEqual(res38["pontuacao"], 38)
        self.assertEqual(res38["percentual"], 69.1)
        self.assertEqual(res38["classificacao"], "Em Desenvolvimento")
        self.assertEqual(res38["classificacao_key"], "em_desenvolvimento")

        # 39 pontos (peso 10 + 9 + 8 + 7 + 5 = 39) -> Desenvolvido
        res39 = calculate_municipio_development_index({
            "educacao_70_porcento": True,    # 10
            "jepp_municipio": "Parcial",     # 9
            "convenio_parceria": True,      # 8
            "comite_acoes_conjuntas": True,  # 7
            "empresa_simulada": True         # 5
        })
        self.assertEqual(res39["pontuacao"], 39)
        self.assertEqual(res39["percentual"], 70.9)
        self.assertEqual(res39["classificacao"], "Desenvolvido")
        self.assertEqual(res39["classificacao_key"], "desenvolvido")

    def test_jepp_flexibility(self):
        """Verifica que JEPP é pontuado quando Total, Parcial, Sim, True ou 1."""
        for val in ["Total", "Sim (Total)", "Parcial", "Sim", "sim", True, 1]:
            res = calculate_municipio_development_index({"jepp_municipio": val})
            jepp_crit = next(c for c in res["criterios"] if c["identificador"] == "jepp_municipio")
            self.assertTrue(jepp_crit["atendido"], f"JEPP com valor '{val}' deveria ser atendido")
            self.assertEqual(jepp_crit["pontos"], 9)

        for val in ["Não", "nao", False, None, ""]:
            res = calculate_municipio_development_index({"jepp_municipio": val})
            jepp_crit = next(c for c in res["criterios"] if c["identificador"] == "jepp_municipio")
            self.assertFalse(jepp_crit["atendido"], f"JEPP com valor '{val}' não deveria ser atendido")
            self.assertEqual(jepp_crit["pontos"], 0)

    def test_frontend_files_contain_dev_index(self):
        """Verifica que as funções, estilos e elementos visuais foram adicionados em app.js, index.html, style.css, admin.js, admin.html."""
        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_html = f.read()
        self.assertIn("details-dev-index-container", index_html)
        self.assertIn("details-dev-index-badge", index_html)
        self.assertIn("details-dev-index-score", index_html)

        with open(os.path.join(ROOT_DIR, "style.css"), "r", encoding="utf-8") as f:
            style_css = f.read()
        self.assertIn(".dev-index-badge", style_css)
        self.assertIn(".dev-index-inicio", style_css)
        self.assertIn(".dev-index-em_desenvolvimento", style_css)
        self.assertIn(".dev-index-desenvolvido", style_css)

        with open(os.path.join(ROOT_DIR, "app.js"), "r", encoding="utf-8") as f:
            app_js = f.read()
        self.assertIn("calculateMunicipioDevelopmentIndex", app_js)
        self.assertIn("details-dev-index-badge", app_js)
        self.assertIn("dev-index-badge", app_js)

        with open(os.path.join(ROOT_DIR, "admin.js"), "r", encoding="utf-8") as f:
            admin_js = f.read()
        self.assertIn("calculateMunicipioDevelopmentIndex", admin_js)
        self.assertIn("renderDevIndexCalculationMemory", admin_js)
        self.assertIn("Índice de Desenvolvimento do Município — Memória de Cálculo", admin_js)

        with open(os.path.join(ROOT_DIR, "admin.html"), "r", encoding="utf-8") as f:
            admin_html = f.read()
        self.assertIn("<th>Índice do Município</th>", admin_html)


if __name__ == "__main__":
    unittest.main()
