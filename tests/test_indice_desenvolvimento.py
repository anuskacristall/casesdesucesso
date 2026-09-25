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
        """Verifica a ordem dos 13 critérios, seus pesos de 13 a 1 e soma total 91."""
        dummy_all_true = {
            "educacao_70_porcento": True,
            "parceria_secretaria_educacao": True,
            "jepp_municipio": "Total",
            "produto_despertar": True,
            "parceria_superintendencia": True,
            "parceria_ies": True,
            "rede_aqui_tem_sebrae": True,
            "convenio_parceria": True,
            "comite_acoes_conjuntas": True,
            "empresa_simulada": True,
            "escola_sebrae": True,
            "cooperativa_credito": True,
            "lei_educacao_empreendedora": True,
        }
        res = calculate_municipio_development_index(dummy_all_true)
        self.assertEqual(res["pontuacao_maxima"], 91)
        self.assertEqual(res["pontuacao"], 91)
        self.assertEqual(res["percentual"], 100.0)
        self.assertEqual(res["classificacao"], "Desenvolvido")
        self.assertEqual(res["classificacao_key"], "desenvolvido")

        criterios = res["criterios"]
        self.assertEqual(len(criterios), 13)

        expected = [
            (1, "1º", 13, "educacao_70_porcento"),
            (2, "2º", 12, "parceria_secretaria_educacao"),
            (3, "3º", 11, "jepp_municipio"),
            (4, "4º", 10, "produto_despertar"),
            (5, "5º", 9, "parceria_superintendencia"),
            (6, "6º", 8, "parceria_ies"),
            (7, "7º", 7, "rede_aqui_tem_sebrae"),
            (8, "8º", 6, "convenio_parceria"),
            (9, "9º", 5, "comite_acoes_conjuntas"),
            (10, "10º", 4, "empresa_simulada"),
            (11, "11º", 3, "escola_sebrae"),
            (12, "12º", 2, "cooperativa_credito"),
            (13, "13º", 1, "lei_educacao_empreendedora"),
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

        self.assertEqual(total_weights, 91)

    def test_score_cutoffs_and_tiers(self):
        """Valida as faixas de corte exatas:
        - Em Desenvolvimento: 0 a 63 pts (0% a 69.2%)
        - Desenvolvido: 64 a 91 pts (70.3% a 100%)
        """
        # 0 pontos -> Em Desenvolvimento (faixa unificada de 0 a 63 pontos)
        res0 = calculate_municipio_development_index({})
        self.assertEqual(res0["pontuacao"], 0)
        self.assertEqual(res0["percentual"], 0.0)
        self.assertEqual(res0["classificacao"], "Em Desenvolvimento")
        self.assertEqual(res0["classificacao_key"], "em_desenvolvimento")

        # 63 pontos (13 + 12 + 11 + 10 + 9 + 8 = 63) -> Em Desenvolvimento (69.2% <= 70%)
        res63 = calculate_municipio_development_index({
            "educacao_70_porcento": True,          # 13
            "parceria_secretaria_educacao": True,  # 12
            "jepp_municipio": "Total",             # 11
            "produto_despertar": True,             # 10
            "parceria_superintendencia": True,     # 9
            "parceria_ies": True                   # 8
        })
        self.assertEqual(res63["pontuacao"], 63)
        self.assertEqual(res63["percentual"], 69.2)
        self.assertEqual(res63["classificacao"], "Em Desenvolvimento")
        self.assertEqual(res63["classificacao_key"], "em_desenvolvimento")

        # 64 pontos (63 + 1 = 64) -> Desenvolvido (70.3% > 70%)
        res64 = calculate_municipio_development_index({
            "educacao_70_porcento": True,          # 13
            "parceria_secretaria_educacao": True,  # 12
            "jepp_municipio": "Total",             # 11
            "produto_despertar": True,             # 10
            "parceria_superintendencia": True,     # 9
            "parceria_ies": True,                  # 8
            "lei_educacao_empreendedora": True     # 1
        })
        self.assertEqual(res64["pontuacao"], 64)
        self.assertEqual(res64["percentual"], 70.3)
        self.assertEqual(res64["classificacao"], "Desenvolvido")
        self.assertEqual(res64["classificacao_key"], "desenvolvido")

    def test_jepp_flexibility(self):
        """Verifica que JEPP é pontuado quando Total, Parcial, Sim, True ou 1."""
        for val in ["Total", "Sim (Total)", "Parcial", "Sim", "sim", True, 1]:
            res = calculate_municipio_development_index({"jepp_municipio": val})
            jepp_crit = next(c for c in res["criterios"] if c["identificador"] == "jepp_municipio")
            self.assertTrue(jepp_crit["atendido"], f"JEPP com valor '{val}' deveria ser atendido")
            self.assertEqual(jepp_crit["pontos"], 11)

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

    def test_jepp_labels_and_public_modal_aesthetic(self):
        """Valida que o JEPP no modal exibe os rótulos Sim / Não e o score foi removido da visão pública."""
        with open(os.path.join(ROOT_DIR, "app.js"), "r", encoding="utf-8") as f:
            app_js = f.read()
        self.assertIn("details-jepp", app_js)
        self.assertIn('devScore.style.display = "none"', app_js)

        with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8") as f:
            index_html = f.read()
        self.assertIn("dev-index-modal-card", index_html)
        self.assertIn("details-empresa-descricao", index_html)
        # Font color of description is dark and prominent
        self.assertIn("#1e293b", index_html)

        with open(os.path.join(ROOT_DIR, "style.css"), "r", encoding="utf-8") as f:
            style_css = f.read()
        self.assertIn(".dev-index-modal-card", style_css)
        self.assertIn(".dev-index-modal-badge", style_css)
        self.assertIn(".indicator-toggle > label", style_css)

    def test_instrumentos_score_and_destaque(self):
        """Valida que palestra vale 5 pontos, demais valem 10, e destaque é concedido a partir de 25 pontos."""
        # 0 instrumentos
        res0 = calculate_municipio_development_index({"instrumentos_aplicados": []})
        self.assertEqual(res0["instrumentos_aplicados"], [])
        self.assertEqual(res0["pontuacao_instrumentos"], 0)
        self.assertFalse(res0["destaque_instrumentos"])

        # 2 instrumentos sem palestra (10 + 10 = 20 pts, sem destaque pois < 25)
        res2 = calculate_municipio_development_index({"instrumentos_aplicados": ["material_didatico", "oficina"]})
        self.assertEqual(len(res2["instrumentos_aplicados"]), 2)
        self.assertEqual(res2["pontuacao_instrumentos"], 20)
        self.assertFalse(res2["destaque_instrumentos"])

        # 2 instrumentos com palestra (10 + 5 = 15 pts, sem destaque)
        res_pal_2 = calculate_municipio_development_index({"instrumentos_aplicados": ["curso", "palestra"]})
        self.assertEqual(res_pal_2["pontuacao_instrumentos"], 15)
        self.assertFalse(res_pal_2["destaque_instrumentos"])

        # 3 instrumentos com palestra (10 + 10 + 5 = 25 pts, exatamente no limite de destaque!)
        res_pal_3 = calculate_municipio_development_index({"instrumentos_aplicados": ["curso", "oficina", "palestra"]})
        self.assertEqual(len(res_pal_3["instrumentos_aplicados"]), 3)
        self.assertEqual(res_pal_3["pontuacao_instrumentos"], 25)
        self.assertTrue(res_pal_3["destaque_instrumentos"])

        # 3 instrumentos de 10 pts (10 + 10 + 10 = 30 pts, com destaque)
        res3 = calculate_municipio_development_index({"instrumentos_aplicados": ["material_didatico", "oficina", "curso"]})
        self.assertEqual(len(res3["instrumentos_aplicados"]), 3)
        self.assertEqual(res3["pontuacao_instrumentos"], 30)
        self.assertTrue(res3["destaque_instrumentos"])

        # 5 instrumentos (10 + 10 + 10 + 10 + 5 = 45 pts, com destaque)
        res5 = calculate_municipio_development_index({"instrumentos_aplicados": ["material_didatico", "oficina", "curso", "encontro_mediado", "palestra"]})
        self.assertEqual(len(res5["instrumentos_aplicados"]), 5)
        self.assertEqual(res5["pontuacao_instrumentos"], 45)
        self.assertTrue(res5["destaque_instrumentos"])

        # Auto-derivação a partir dos indicadores quando instrumentos_aplicados é None
        res_derived = calculate_municipio_development_index({
            "status_jepp": "Sim",
            "empresa_simulada": True
        })
        self.assertIn("material_didatico", res_derived["instrumentos_aplicados"])
        self.assertIn("oficina", res_derived["instrumentos_aplicados"])
        self.assertIn("curso", res_derived["instrumentos_aplicados"])
        self.assertEqual(res_derived["pontuacao_instrumentos"], 30)
        self.assertTrue(res_derived["destaque_instrumentos"])


if __name__ == "__main__":
    unittest.main()
