"""
Testes Automatizados para as Migrations e Exportações do Supabase Corporativo
Sebrae MG - Mapa de Cases de Sucesso & Indicadores Municipais
"""

import json
import unittest
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MIGRATIONS_DIR = BASE_DIR / "supabase" / "migrations"
SCHEMA_FILE = BASE_DIR / "supabase" / "schema_completo.sql"
EXPORT_JSON_FILE = BASE_DIR / "supabase" / "supabase_export.json"

class TestSupabaseMigrations(unittest.TestCase):

    def test_migration_files_exist(self):
        """Valida que todos os arquivos de migração e schemas unificados existem."""
        expected_files = [
            MIGRATIONS_DIR / "20260929140000_create_cases_table.sql",
            MIGRATIONS_DIR / "20260929140001_create_municipalities_table.sql",
            MIGRATIONS_DIR / "20260929140002_enable_rls_and_policies.sql",
            MIGRATIONS_DIR / "20260929140003_seed_data.sql",
            SCHEMA_FILE,
            EXPORT_JSON_FILE,
        ]
        for f in expected_files:
            self.assertTrue(f.exists(), f"Arquivo essencial de migração ausente: {f}")
            self.assertGreater(f.stat().st_size, 0, f"Arquivo está vazio: {f}")

    def test_cases_table_schema_completeness(self):
        """Garante que a tabela cases contém todas as colunas necessárias para Professor e Estudante."""
        file_path = MIGRATIONS_DIR / "20260929140000_create_cases_table.sql"
        content = file_path.read_text(encoding="utf-8")

        required_columns = [
            "id TEXT PRIMARY KEY",
            "request_code TEXT UNIQUE",
            "titulo_projeto TEXT",
            "descricao_geral TEXT",
            "municipio TEXT",
            "regional TEXT",
            "tipo_case TEXT",
            "status TEXT",
            # Professor
            "professor_nome TEXT",
            "professor_email TEXT",
            "professor_telefone TEXT",
            # Estudante
            "estudante_possui TEXT",
            "estudante_nome TEXT",
            "estudante_email TEXT",
            "estudante_telefone TEXT",
            "estudante_resumo TEXT",
            # Empresa Real
            "empresa_nome TEXT",
            "empresa_tipo TEXT",
            "empresa_descricao TEXT",
            # Indicadores
            "educacao_70_porcento TEXT",
            "parceria_secretaria_educacao TEXT",
            "jepp_municipio TEXT",
            "produto_despertar TEXT",
            "parceria_superintendencia TEXT",
            "parceria_ies TEXT",
            "rede_aqui_tem_sebrae TEXT",
            "convenio_parceria TEXT",
            "comite_acoes_conjuntas TEXT",
            "empresa_simulada TEXT",
            "escola_sebrae TEXT",
            "cooperativa_credito TEXT",
            "lei_educacao_empreendedora TEXT",
            # Índices e Instrumentos
            "instrumentos_aplicados JSONB",
            "pontuacao_instrumentos INTEGER",
            "destaque_instrumentos BOOLEAN",
            "indice_pontuacao INTEGER",
            "indice_percentual NUMERIC",
            "indice_classificacao TEXT",
            "indice_desenvolvimento JSONB",
            # Timestamps
            "created_at TIMESTAMPTZ",
            "updated_at TIMESTAMPTZ"
        ]

        for col in required_columns:
            self.assertIn(col, content, f"Coluna ou tipo esperado não encontrado em cases: {col}")

        # Índices
        self.assertIn("CREATE INDEX IF NOT EXISTS idx_cases_status", content)
        self.assertIn("CREATE INDEX IF NOT EXISTS idx_cases_tipo", content)
        self.assertIn("CREATE INDEX IF NOT EXISTS idx_cases_request_code", content)

    def test_municipalities_table_schema_completeness(self):
        """Garante que a tabela municipalities possui todos os 13 indicadores oficiais e índices."""
        file_path = MIGRATIONS_DIR / "20260929140001_create_municipalities_table.sql"
        content = file_path.read_text(encoding="utf-8")

        required_columns = [
            "id TEXT PRIMARY KEY",
            "request_code TEXT UNIQUE",
            "nome TEXT NOT NULL",
            "regional TEXT",
            "mr TEXT",
            "responsavel_nome TEXT",
            "responsavel_email TEXT",
            "status TEXT",
            # 13 Indicadores
            "educacao_70_porcento TEXT",
            "parceria_secretaria_educacao TEXT",
            "jepp_municipio TEXT",
            "produto_despertar TEXT",
            "parceria_superintendencia TEXT",
            "parceria_ies TEXT",
            "rede_aqui_tem_sebrae TEXT",
            "convenio_parceria TEXT",
            "comite_acoes_conjuntas TEXT",
            "empresa_simulada TEXT",
            "escola_sebrae TEXT",
            "cooperativa_credito TEXT",
            "lei_educacao_empreendedora TEXT",
            # Índices e Instrumentos
            "instrumentos_aplicados JSONB",
            "pontuacao_instrumentos INTEGER",
            "destaque_instrumentos BOOLEAN",
            "indice_pontuacao INTEGER",
            "indice_percentual NUMERIC",
            "indice_classificacao TEXT",
            "indice_desenvolvimento JSONB",
            # Timestamps
            "created_at TIMESTAMPTZ",
            "updated_at TIMESTAMPTZ"
        ]

        for col in required_columns:
            self.assertIn(col, content, f"Coluna esperada ausente em municipalities: {col}")

        # Tabela system_counters
        self.assertIn("CREATE TABLE IF NOT EXISTS public.system_counters", content)

    def test_rls_security_and_triggers(self):
        """Valida se RLS está ativo em todas as tabelas com políticas e triggers."""
        file_path = MIGRATIONS_DIR / "20260929140002_enable_rls_and_policies.sql"
        content = file_path.read_text(encoding="utf-8")

        # RLS Enabled
        self.assertIn("ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;", content)
        self.assertIn("ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;", content)
        self.assertIn("ALTER TABLE public.system_counters ENABLE ROW LEVEL SECURITY;", content)

        # Triggers
        self.assertIn("handle_updated_at()", content)
        self.assertIn("trg_cases_updated_at", content)
        self.assertIn("trg_municipalities_updated_at", content)

        # Políticas essenciais
        self.assertIn('"Public cases read policy"', content)
        self.assertIn('"Public cases insert policy"', content)
        self.assertIn('"Admin cases update policy"', content)
        self.assertIn('"Public municipalities read policy"', content)
        self.assertIn('"Public municipalities insert policy"', content)
        self.assertIn('"System counters access policy"', content)

    def test_seed_data_counts_and_consistency(self):
        """Valida que o arquivo de seed contém exatamente os 23 cases e 18 municípios canônicos."""
        file_path = MIGRATIONS_DIR / "20260929140003_seed_data.sql"
        content = file_path.read_text(encoding="utf-8")

        cases_insert_count = content.count("INSERT INTO public.cases")
        muns_insert_count = content.count("INSERT INTO public.municipalities")
        counters_insert_count = content.count("INSERT INTO public.system_counters")

        self.assertEqual(cases_insert_count, 23, "Deveriam existir 23 cases no seed_data.sql")
        self.assertEqual(muns_insert_count, 18, "Deveriam existir 18 municípios no seed_data.sql")
        self.assertGreaterEqual(counters_insert_count, 1, "Deveria existir a inicialização de system_counters")

        # Verifica presença de casos de professor e de estudante no seed
        self.assertIn("'professor'", content)
        self.assertIn("'estudante'", content)

    def test_export_json_validity(self):
        """Garante que a exportação JSON é válida e consistente com o banco."""
        content = json.loads(EXPORT_JSON_FILE.read_text(encoding="utf-8"))
        self.assertIn("metadata", content)
        self.assertIn("cases", content)
        self.assertIn("municipalities", content)

        cases = content["cases"]
        muns = content["municipalities"]

        self.assertEqual(len(cases), 23)
        self.assertEqual(len(muns), 18)

        # Valida que todos os cases possuem request_code e status
        for c in cases:
            self.assertTrue(c.get("request_code", "").startswith("#"), f"Case sem request_code: {c.get('id')}")
            self.assertIn(c.get("status"), ["approved", "pending", "rejected"])
            self.assertIn("indice_pontuacao", c)
            self.assertIn("indice_classificacao", c)

        # Valida que todos os municípios possuem os 13 indicadores
        for m in muns:
            self.assertTrue(m.get("nome"), "Município sem nome")
            self.assertIn("educacao_70_porcento", m)
            self.assertIn("parceria_secretaria_educacao", m)
            self.assertIn("jepp_municipio", m)
            self.assertIn("indice_classificacao", m)

    def test_schema_completo_unifies_all_files(self):
        """Valida que schema_completo.sql consolida as tabelas, RLS e dados de seed."""
        content = SCHEMA_FILE.read_text(encoding="utf-8")
        self.assertIn("CREATE TABLE IF NOT EXISTS public.cases", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS public.municipalities", content)
        self.assertIn("CREATE TABLE IF NOT EXISTS public.system_counters", content)
        self.assertIn("ENABLE ROW LEVEL SECURITY", content)
        self.assertIn("INSERT INTO public.cases", content)
        self.assertIn("INSERT INTO public.municipalities", content)
        self.assertEqual(content.count("INSERT INTO public.cases"), 23)
        self.assertEqual(content.count("INSERT INTO public.municipalities"), 18)

if __name__ == "__main__":
    unittest.main()
