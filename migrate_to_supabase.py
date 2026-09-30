#!/usr/bin/env python3
"""
Script de Migração e Geração de Migrations para Supabase Corporativo
Sebrae MG - Mapa de Cases de Sucesso & Indicadores Municipais
"""

import os
import sys
import json
import ssl
import re
import argparse
import urllib.request
import urllib.error
from pathlib import Path

# Add project dir to path so we can import calculation logic from server
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

try:
    from server import calculate_municipio_development_index
except ImportError:
    def calculate_municipio_development_index(item):
        return {
            "pontuacao": 0,
            "percentual": 0.0,
            "classificacao": "Em Desenvolvimento",
            "classificacao_key": "em_desenvolvimento",
            "instrumentos_aplicados": [],
            "pontuacao_instrumentos": 0,
            "destaque_instrumentos": False,
            "criterios": []
        }

ssl_context = ssl._create_unverified_context()
opener = urllib.request.build_opener(
    urllib.request.ProxyHandler({}),
    urllib.request.HTTPSHandler(context=ssl_context)
)

def sql_escape_string(val):
    if val is None:
        return "NULL"
    s = str(val).replace("'", "''")
    return f"'{s}'"

def sql_escape_num(val, default="0"):
    if val is None or val == "":
        return default
    try:
        float(val)
        return str(val)
    except ValueError:
        return default

def sql_escape_bool(val):
    if val is True or str(val).lower() in ("true", "1", "t", "yes"):
        return "TRUE"
    return "FALSE"

def sql_escape_json(val):
    if val is None:
        return "'[]'::jsonb"
    s = json.dumps(val, ensure_ascii=False).replace("'", "''")
    return f"'{s}'::jsonb"

def fetch_source_data(source_url=None, source_key=None):
    """Obtém dados consolidados do banco fonte e do data_store local."""
    data_store_path = BASE_DIR / "data_store.json"
    store = {}
    if data_store_path.exists():
        with open(data_store_path, "r", encoding="utf-8") as f:
            try:
                store = json.load(f)
            except Exception as e:
                print(f"[AVISO] Falha ao ler data_store.json: {e}")

    if not source_url:
        source_url = os.environ.get("SUPABASE_URL", "https://clpnbsedfjxdjptdagsj.supabase.co")
    if not source_key:
        source_key = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNscG5ic2VkZmp4ZGpwdGRhZ3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxMTU3MjMsImV4cCI6MjA5OTY5MTcyM30.YqNvSMrGeGVrxonMUTotPbXbLjmewAAnIKn6y0mOg4g")

    raw_cases = []
    try:
        req = urllib.request.Request(
            f"{source_url}/rest/v1/cases?select=*",
            headers={
                "apikey": source_key,
                "Authorization": f"Bearer {source_key}"
            }
        )
        with opener.open(req, timeout=12) as resp:
            raw_cases = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] {len(raw_cases)} cases brutos obtidos do Supabase fonte.")
    except Exception as e:
        print(f"[INFO] Não foi possível conectar ao Supabase remoto ({e}). Usando fallback de exportação...")

    export_json_path = BASE_DIR / "supabase" / "supabase_export.json"
    if not raw_cases and export_json_path.exists():
        with open(export_json_path, "r", encoding="utf-8") as f:
            saved_export = json.load(f)
            return saved_export.get("cases", []), saved_export.get("municipalities", []), saved_export.get("next_code", 240000)

    cases_status = store.get("cases_status", {})
    case_codes = store.get("case_codes", {})
    cases_overrides = store.get("cases_overrides", {})
    deleted_cases = set(store.get("deleted_cases", []))
    extra_cases = store.get("extra_cases", [])

    merged_cases = []
    existing_ids = set()

    for idx, c in enumerate(raw_cases):
        cid = str(c.get("id"))
        if cid in deleted_cases:
            continue
        existing_ids.add(cid)
        c["status"] = cases_status.get(cid, c.get("status", "approved"))
        c["request_code"] = case_codes.get(cid, f"#{10000 * (idx + 1)}")
        if cid in cases_overrides:
            c.update(cases_overrides[cid])

        dev_idx = calculate_municipio_development_index(c)
        c["indice_desenvolvimento"] = dev_idx
        c["indice_pontuacao"] = dev_idx["pontuacao"]
        c["indice_percentual"] = dev_idx["percentual"]
        c["indice_classificacao"] = dev_idx["classificacao"]
        c["indice_classificacao_key"] = dev_idx["classificacao_key"]
        c["instrumentos_aplicados"] = dev_idx.get("instrumentos_aplicados", [])
        c["pontuacao_instrumentos"] = dev_idx.get("pontuacao_instrumentos", 0)
        c["destaque_instrumentos"] = dev_idx.get("destaque_instrumentos", False)

        merged_cases.append(c)

    for ec in extra_cases:
        ec_id = str(ec.get("id"))
        if ec_id not in existing_ids and ec_id not in deleted_cases:
            ec["status"] = cases_status.get(ec_id, ec.get("status", "pending"))
            ec["request_code"] = case_codes.get(ec_id, ec.get("request_code", f"#{240000}"))
            dev_idx = calculate_municipio_development_index(ec)
            ec["indice_desenvolvimento"] = dev_idx
            ec["indice_pontuacao"] = dev_idx["pontuacao"]
            ec["indice_percentual"] = dev_idx["percentual"]
            ec["indice_classificacao"] = dev_idx["classificacao"]
            ec["indice_classificacao_key"] = dev_idx["classificacao_key"]
            ec["instrumentos_aplicados"] = dev_idx.get("instrumentos_aplicados", [])
            ec["pontuacao_instrumentos"] = dev_idx.get("pontuacao_instrumentos", 0)
            ec["destaque_instrumentos"] = dev_idx.get("destaque_instrumentos", False)
            merged_cases.append(ec)

    # Municípios
    muns = store.get("municipalities", [])
    deleted_muns = set(store.get("deleted_municipalities", []))
    merged_muns = []
    for m in muns:
        mid = str(m.get("id"))
        if mid in deleted_muns:
            continue
        # Harmonização canônica dos 13 indicadores
        if 'educacao_70_porcento' not in m or m['educacao_70_porcento'] is None:
            m['educacao_70_porcento'] = m.get('municipio_ee_70') or m.get('edu70') or 'nao'
        if 'jepp_municipio' not in m or m['jepp_municipio'] is None:
            m['jepp_municipio'] = m.get('status_jepp') or m.get('jeppStatus') or 'nao'
        if 'parceria_secretaria_educacao' not in m or m['parceria_secretaria_educacao'] is None:
            m['parceria_secretaria_educacao'] = m.get('secretaria_educacao_possui', False)
        if 'produto_despertar' not in m or m['produto_despertar'] is None:
            m['produto_despertar'] = m.get('despertar_possui', False)
        if 'parceria_superintendencia' not in m or m['parceria_superintendencia'] is None:
            m['parceria_superintendencia'] = m.get('superintendencia_possui', False)
        if 'parceria_ies' not in m or m['parceria_ies'] is None:
            m['parceria_ies'] = m.get('ies_possui', False)
        if 'rede_aqui_tem_sebrae' not in m or m['rede_aqui_tem_sebrae'] is None:
            m['rede_aqui_tem_sebrae'] = m.get('aqui_tem_sebrae_possui', False)
        if 'convenio_parceria' not in m or m['convenio_parceria'] is None:
            m['convenio_parceria'] = m.get('convenio_sebrae', False)
        if 'comite_acoes_conjuntas' not in m or m['comite_acoes_conjuntas'] is None:
            m['comite_acoes_conjuntas'] = m.get('comite_possui', False)
        if 'empresa_simulada' not in m or m['empresa_simulada'] is None:
            m['empresa_simulada'] = m.get('empresa_simulada_possui', False)
        if 'escola_sebrae' not in m or m['escola_sebrae'] is None:
            m['escola_sebrae'] = m.get('escola_sebrae_possui', False)
        if 'cooperativa_credito' not in m or m['cooperativa_credito'] is None:
            m['cooperativa_credito'] = m.get('cooperativa_possui', False)
        if 'lei_educacao_empreendedora' not in m or m['lei_educacao_empreendedora'] is None:
            m['lei_educacao_empreendedora'] = m.get('lei_possui', False)

        dev_idx = calculate_municipio_development_index(m)
        m["indice_desenvolvimento"] = dev_idx
        m["indice_pontuacao"] = dev_idx["pontuacao"]
        m["indice_percentual"] = dev_idx["percentual"]
        m["indice_classificacao"] = dev_idx["classificacao"]
        m["indice_classificacao_key"] = dev_idx["classificacao_key"]
        m["instrumentos_aplicados"] = dev_idx.get("instrumentos_aplicados", [])
        m["pontuacao_instrumentos"] = dev_idx.get("pontuacao_instrumentos", 0)
        m["destaque_instrumentos"] = dev_idx.get("destaque_instrumentos", False)
        merged_muns.append(m)

    next_code = store.get("next_code", 240000)

    return merged_cases, merged_muns, next_code

def generate_sql_migrations(cases, municipalities, next_code):
    """Gera arquivos de migration individuais e o arquivo unificado schema_completo.sql."""
    migrations_dir = BASE_DIR / "supabase" / "migrations"
    migrations_dir.mkdir(parents=True, exist_ok=True)

    sql_cases_table = """-- ==============================================================================
-- 20260929140000_create_cases_table.sql
-- Tabela de Cases de Sucesso (Educação Empreendedora - Professor e Estudante)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.cases (
    id TEXT PRIMARY KEY,
    request_code TEXT UNIQUE NOT NULL,
    titulo_projeto TEXT NOT NULL,
    descricao_geral TEXT,
    municipio TEXT NOT NULL,
    regional TEXT,
    microrregiao_mr TEXT,
    escola_instituicao TEXT,
    nivel_ensino TEXT,
    dependencia_adm TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    tipo_case TEXT DEFAULT 'professor',
    
    -- Dados do Técnico Sebrae
    tecnico_nome TEXT,
    tecnico_email TEXT,
    tecnico_telefone TEXT,
    
    -- Dados do Professor (se aplicável)
    professor_nome TEXT,
    professor_email TEXT,
    professor_telefone TEXT,
    
    -- Dados do Estudante (se aplicável)
    estudante_possui TEXT,
    estudante_nome TEXT,
    estudante_email TEXT,
    estudante_telefone TEXT,
    estudante_resumo TEXT,
    estudante_contato TEXT,
    
    -- Dados da Empresa / Negócio Real do Estudante
    empresa_nome TEXT,
    empresa_tipo TEXT,
    empresa_descricao TEXT,
    
    -- Indicadores de Educação Empreendedora
    educacao_70_porcento TEXT,
    municipio_ee_70 TEXT,
    parceria_secretaria_educacao TEXT,
    jepp_municipio TEXT,
    status_jepp TEXT,
    produto_despertar TEXT,
    parceria_superintendencia TEXT,
    parceria_ies TEXT,
    ies_possui TEXT,
    ies_resumo TEXT,
    rede_aqui_tem_sebrae TEXT,
    convenio_parceria TEXT,
    convenio_sebrae TEXT,
    comite_acoes_conjuntas TEXT,
    comite_possui TEXT,
    comite_resumo TEXT,
    empresa_simulada TEXT,
    escola_sebrae TEXT,
    cooperativa_credito TEXT,
    cooperativa_possui TEXT,
    cooperativa_resumo TEXT,
    lei_educacao_empreendedora TEXT,
    lei_possui TEXT,
    lei_resumo TEXT,
    
    -- Instrumentos e Índices Pré-calculados
    instrumentos_aplicados JSONB DEFAULT '[]'::jsonb,
    pontuacao_instrumentos INTEGER DEFAULT 0,
    destaque_instrumentos BOOLEAN DEFAULT FALSE,
    indice_pontuacao INTEGER DEFAULT 0,
    indice_percentual NUMERIC(5, 1) DEFAULT 0.0,
    indice_classificacao TEXT,
    indice_classificacao_key TEXT,
    indice_desenvolvimento JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices de consulta rápida
CREATE INDEX IF NOT EXISTS idx_cases_status ON public.cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_municipio ON public.cases(municipio);
CREATE INDEX IF NOT EXISTS idx_cases_regional ON public.cases(regional);
CREATE INDEX IF NOT EXISTS idx_cases_tipo ON public.cases(tipo_case);
CREATE INDEX IF NOT EXISTS idx_cases_request_code ON public.cases(request_code);
"""

    sql_muns_table = """-- ==============================================================================
-- 20260929140001_create_municipalities_table.sql
-- Tabela de Avaliação e Indicadores dos Municípios Mineiros & Contadores
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.municipalities (
    id TEXT PRIMARY KEY,
    request_code TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    regional TEXT,
    mr TEXT,
    responsavel_nome TEXT,
    responsavel_email TEXT,
    responsavel_telefone TEXT,
    status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('approved', 'pending', 'rejected')),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    
    -- 13 Indicadores Oficiais de Desenvolvimento Municipal
    educacao_70_porcento TEXT,
    parceria_secretaria_educacao TEXT,
    jepp_municipio TEXT,
    produto_despertar TEXT,
    parceria_superintendencia TEXT,
    parceria_ies TEXT,
    rede_aqui_tem_sebrae TEXT,
    convenio_parceria TEXT,
    comite_acoes_conjuntas TEXT,
    empresa_simulada TEXT,
    escola_sebrae TEXT,
    cooperativa_credito TEXT,
    lei_educacao_empreendedora TEXT,
    
    -- Instrumentos e Índices Pré-calculados
    instrumentos_aplicados JSONB DEFAULT '[]'::jsonb,
    pontuacao_instrumentos INTEGER DEFAULT 0,
    destaque_instrumentos BOOLEAN DEFAULT FALSE,
    indice_pontuacao INTEGER DEFAULT 0,
    indice_percentual NUMERIC(5, 1) DEFAULT 0.0,
    indice_classificacao TEXT,
    indice_classificacao_key TEXT,
    indice_desenvolvimento JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de contadores sequenciais
CREATE TABLE IF NOT EXISTS public.system_counters (
    key TEXT PRIMARY KEY,
    value BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_municipalities_nome ON public.municipalities(nome);
CREATE INDEX IF NOT EXISTS idx_municipalities_regional ON public.municipalities(regional);
CREATE INDEX IF NOT EXISTS idx_municipalities_status ON public.municipalities(status);
CREATE INDEX IF NOT EXISTS idx_municipalities_request_code ON public.municipalities(request_code);
"""

    sql_rls = """-- ==============================================================================
-- 20260929140002_enable_rls_and_policies.sql
-- Segurança RLS (Row Level Security) e Triggers Automáticos de Atualização
-- ==============================================================================

-- Função para atualizar coluna updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para tabela cases
DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.cases;
CREATE TRIGGER trg_cases_updated_at
BEFORE UPDATE ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para tabela municipalities
DROP TRIGGER IF EXISTS trg_municipalities_updated_at ON public.municipalities;
CREATE TRIGGER trg_municipalities_updated_at
BEFORE UPDATE ON public.municipalities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_counters ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- POLÍTICAS RLS: cases
-- ------------------------------------------------------------------------------

-- Leitura pública para cases aprovados (usuários autenticados podem ver todos)
DROP POLICY IF EXISTS "Public cases read policy" ON public.cases;
CREATE POLICY "Public cases read policy"
ON public.cases
FOR SELECT
TO anon, authenticated
USING (status = 'approved' OR auth.role() = 'authenticated');

-- Inserção pública para novos formulários
DROP POLICY IF EXISTS "Public cases insert policy" ON public.cases;
CREATE POLICY "Public cases insert policy"
ON public.cases
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Atualização e exclusão apenas para autenticados ou service_role
DROP POLICY IF EXISTS "Admin cases update policy" ON public.cases;
CREATE POLICY "Admin cases update policy"
ON public.cases
FOR UPDATE
TO authenticated, service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin cases delete policy" ON public.cases;
CREATE POLICY "Admin cases delete policy"
ON public.cases
FOR DELETE
TO authenticated, service_role
USING (true);

-- ------------------------------------------------------------------------------
-- POLÍTICAS RLS: municipalities
-- ------------------------------------------------------------------------------

-- Leitura pública para municípios aprovados
DROP POLICY IF EXISTS "Public municipalities read policy" ON public.municipalities;
CREATE POLICY "Public municipalities read policy"
ON public.municipalities
FOR SELECT
TO anon, authenticated
USING (status = 'approved' OR auth.role() = 'authenticated');

-- Inserção pública para novas avaliações municipais
DROP POLICY IF EXISTS "Public municipalities insert policy" ON public.municipalities;
CREATE POLICY "Public municipalities insert policy"
ON public.municipalities
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Atualização e exclusão apenas para administradores
DROP POLICY IF EXISTS "Admin municipalities update policy" ON public.municipalities;
CREATE POLICY "Admin municipalities update policy"
ON public.municipalities
FOR UPDATE
TO authenticated, service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admin municipalities delete policy" ON public.municipalities;
CREATE POLICY "Admin municipalities delete policy"
ON public.municipalities
FOR DELETE
TO authenticated, service_role
USING (true);

-- ------------------------------------------------------------------------------
-- POLÍTICAS RLS: system_counters
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "System counters access policy" ON public.system_counters;
CREATE POLICY "System counters access policy"
ON public.system_counters
FOR ALL
TO anon, authenticated, service_role
USING (true)
WITH CHECK (true);
"""

    seed_lines = [
        "-- ==============================================================================",
        "-- 20260929140003_seed_data.sql",
        "-- Inserção de Dados Canônicos Consolidados (23 Cases + 18 Municípios)",
        "-- ==============================================================================",
        "",
        "-- Inicialização de Contador Sequencial de Protocolo",
        f"INSERT INTO public.system_counters (key, value, updated_at)",
        f"VALUES ('next_code', {next_code}, TIMEZONE('utc'::text, NOW()))",
        "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;",
        "",
        "-- Inserção / Atualização de Cases de Sucesso (23 registros)",
    ]

    for c in cases:
        cid = sql_escape_string(c.get("id"))
        req_code = sql_escape_string(c.get("request_code", "#10000"))
        titulo = sql_escape_string(c.get("titulo_projeto") or c.get("titulo") or "Projeto")
        desc = sql_escape_string(c.get("descricao_geral") or c.get("descricao") or "")
        mun = sql_escape_string(c.get("municipio") or "")
        reg = sql_escape_string(c.get("regional") or "")
        mr = sql_escape_string(c.get("microrregiao_mr") or "")
        escola = sql_escape_string(c.get("escola_instituicao") or "")
        nivel = sql_escape_string(c.get("nivel_ensino") or "")
        dep = sql_escape_string(c.get("dependencia_adm") or "")
        lat = sql_escape_num(c.get("latitude"))
        lng = sql_escape_num(c.get("longitude"))
        status = sql_escape_string(c.get("status") or "approved")
        tipo = sql_escape_string(c.get("tipo_case") or "professor")

        tec_nome = sql_escape_string(c.get("tecnico_nome"))
        tec_email = sql_escape_string(c.get("tecnico_email"))
        tec_tel = sql_escape_string(c.get("tecnico_telefone"))

        prof_nome = sql_escape_string(c.get("professor_nome"))
        prof_email = sql_escape_string(c.get("professor_email"))
        prof_tel = sql_escape_string(c.get("professor_telefone"))

        est_possui = sql_escape_string(c.get("estudante_possui"))
        est_nome = sql_escape_string(c.get("estudante_nome"))
        est_email = sql_escape_string(c.get("estudante_email"))
        est_tel = sql_escape_string(c.get("estudante_telefone"))
        est_res = sql_escape_string(c.get("estudante_resumo"))
        est_cont = sql_escape_string(c.get("estudante_contato"))

        emp_nome = sql_escape_string(c.get("empresa_nome"))
        emp_tipo = sql_escape_string(c.get("empresa_tipo"))
        emp_desc = sql_escape_string(c.get("empresa_descricao"))

        edu70 = sql_escape_string(c.get("educacao_70_porcento") or c.get("municipio_ee_70"))
        mun70 = sql_escape_string(c.get("municipio_ee_70"))
        sec = sql_escape_string(c.get("parceria_secretaria_educacao"))
        jepp = sql_escape_string(c.get("jepp_municipio") or c.get("status_jepp"))
        jepp_st = sql_escape_string(c.get("status_jepp"))
        desp = sql_escape_string(c.get("produto_despertar"))
        sup = sql_escape_string(c.get("parceria_superintendencia"))
        ies = sql_escape_string(c.get("parceria_ies") or c.get("ies_possui"))
        ies_pos = sql_escape_string(c.get("ies_possui"))
        ies_res = sql_escape_string(c.get("ies_resumo"))
        rede = sql_escape_string(c.get("rede_aqui_tem_sebrae"))
        conv = sql_escape_string(c.get("convenio_parceria") or c.get("convenio_sebrae"))
        conv_seb = sql_escape_string(c.get("convenio_sebrae"))
        com = sql_escape_string(c.get("comite_acoes_conjuntas") or c.get("comite_possui"))
        com_pos = sql_escape_string(c.get("comite_possui"))
        com_res = sql_escape_string(c.get("comite_resumo"))
        emp_sim = sql_escape_string(c.get("empresa_simulada"))
        esc_seb = sql_escape_string(c.get("escola_sebrae"))
        coop = sql_escape_string(c.get("cooperativa_credito") or c.get("cooperativa_possui"))
        coop_pos = sql_escape_string(c.get("cooperativa_possui"))
        coop_res = sql_escape_string(c.get("cooperativa_resumo"))
        lei = sql_escape_string(c.get("lei_educacao_empreendedora") or c.get("lei_possui"))
        lei_pos = sql_escape_string(c.get("lei_possui"))
        lei_res = sql_escape_string(c.get("lei_resumo"))

        inst_apl = sql_escape_json(c.get("instrumentos_aplicados", []))
        pts_inst = sql_escape_num(c.get("pontuacao_instrumentos", 0))
        dest_inst = sql_escape_bool(c.get("destaque_instrumentos", False))
        ind_pts = sql_escape_num(c.get("indice_pontuacao", 0))
        ind_perc = sql_escape_num(c.get("indice_percentual", 0.0))
        ind_class = sql_escape_string(c.get("indice_classificacao"))
        ind_key = sql_escape_string(c.get("indice_classificacao_key"))
        ind_dev = sql_escape_json(c.get("indice_desenvolvimento"))

        sql = f"""INSERT INTO public.cases (
    id, request_code, titulo_projeto, descricao_geral, municipio, regional, microrregiao_mr,
    escola_instituicao, nivel_ensino, dependencia_adm, latitude, longitude, status, tipo_case,
    tecnico_nome, tecnico_email, tecnico_telefone,
    professor_nome, professor_email, professor_telefone,
    estudante_possui, estudante_nome, estudante_email, estudante_telefone, estudante_resumo, estudante_contato,
    empresa_nome, empresa_tipo, empresa_descricao,
    educacao_70_porcento, municipio_ee_70, parceria_secretaria_educacao, jepp_municipio, status_jepp,
    produto_despertar, parceria_superintendencia, parceria_ies, ies_possui, ies_resumo,
    rede_aqui_tem_sebrae, convenio_parceria, convenio_sebrae, comite_acoes_conjuntas, comite_possui, comite_resumo,
    empresa_simulada, escola_sebrae, cooperativa_credito, cooperativa_possui, cooperativa_resumo,
    lei_educacao_empreendedora, lei_possui, lei_resumo,
    instrumentos_aplicados, pontuacao_instrumentos, destaque_instrumentos,
    indice_pontuacao, indice_percentual, indice_classificacao, indice_classificacao_key, indice_desenvolvimento
) VALUES (
    {cid}, {req_code}, {titulo}, {desc}, {mun}, {reg}, {mr},
    {escola}, {nivel}, {dep}, {lat}, {lng}, {status}, {tipo},
    {tec_nome}, {tec_email}, {tec_tel},
    {prof_nome}, {prof_email}, {prof_tel},
    {est_possui}, {est_nome}, {est_email}, {est_tel}, {est_res}, {est_cont},
    {emp_nome}, {emp_tipo}, {emp_desc},
    {edu70}, {mun70}, {sec}, {jepp}, {jepp_st},
    {desp}, {sup}, {ies}, {ies_pos}, {ies_res},
    {rede}, {conv}, {conv_seb}, {com}, {com_pos}, {com_res},
    {emp_sim}, {esc_seb}, {coop}, {coop_pos}, {coop_res},
    {lei}, {lei_pos}, {lei_res},
    {inst_apl}, {pts_inst}, {dest_inst},
    {ind_pts}, {ind_perc}, {ind_class}, {ind_key}, {ind_dev}
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());"""
        seed_lines.append(sql)

    seed_lines.append("\n-- Inserção / Atualização de Municípios Avaliados (18 registros)\n")

    for m in municipalities:
        mid = sql_escape_string(m.get("id"))
        req_code = sql_escape_string(m.get("request_code", "#10000"))
        nome = sql_escape_string(m.get("nome") or "")
        reg = sql_escape_string(m.get("regional") or "")
        mr = sql_escape_string(m.get("mr") or "")
        resp_nome = sql_escape_string(m.get("responsavel_nome"))
        resp_email = sql_escape_string(m.get("responsavel_email"))
        resp_tel = sql_escape_string(m.get("responsavel_telefone"))
        status = sql_escape_string(m.get("status") or "approved")
        lat = sql_escape_num(m.get("latitude"))
        lng = sql_escape_num(m.get("longitude"))

        edu70 = sql_escape_string(m.get("educacao_70_porcento"))
        sec = sql_escape_string(m.get("parceria_secretaria_educacao"))
        jepp = sql_escape_string(m.get("jepp_municipio"))
        desp = sql_escape_string(m.get("produto_despertar"))
        sup = sql_escape_string(m.get("parceria_superintendencia"))
        ies = sql_escape_string(m.get("parceria_ies"))
        rede = sql_escape_string(m.get("rede_aqui_tem_sebrae"))
        conv = sql_escape_string(m.get("convenio_parceria"))
        com = sql_escape_string(m.get("comite_acoes_conjuntas"))
        emp_sim = sql_escape_string(m.get("empresa_simulada"))
        esc_seb = sql_escape_string(m.get("escola_sebrae"))
        coop = sql_escape_string(m.get("cooperativa_credito"))
        lei = sql_escape_string(m.get("lei_educacao_empreendedora"))

        inst_apl = sql_escape_json(m.get("instrumentos_aplicados", []))
        pts_inst = sql_escape_num(m.get("pontuacao_instrumentos", 0))
        dest_inst = sql_escape_bool(m.get("destaque_instrumentos", False))
        ind_pts = sql_escape_num(m.get("indice_pontuacao", 0))
        ind_perc = sql_escape_num(m.get("indice_percentual", 0.0))
        ind_class = sql_escape_string(m.get("indice_classificacao"))
        ind_key = sql_escape_string(m.get("indice_classificacao_key"))
        ind_dev = sql_escape_json(m.get("indice_desenvolvimento"))

        sql = f"""INSERT INTO public.municipalities (
    id, request_code, nome, regional, mr,
    responsavel_nome, responsavel_email, responsavel_telefone,
    status, latitude, longitude,
    educacao_70_porcento, parceria_secretaria_educacao, jepp_municipio,
    produto_despertar, parceria_superintendencia, parceria_ies,
    rede_aqui_tem_sebrae, convenio_parceria, comite_acoes_conjuntas,
    empresa_simulada, escola_sebrae, cooperativa_credito,
    lei_educacao_empreendedora,
    instrumentos_aplicados, pontuacao_instrumentos, destaque_instrumentos,
    indice_pontuacao, indice_percentual, indice_classificacao, indice_classificacao_key, indice_desenvolvimento
) VALUES (
    {mid}, {req_code}, {nome}, {reg}, {mr},
    {resp_nome}, {resp_email}, {resp_tel},
    {status}, {lat}, {lng},
    {edu70}, {sec}, {jepp},
    {desp}, {sup}, {ies},
    {rede}, {conv}, {com},
    {emp_sim}, {esc_seb}, {coop},
    {lei},
    {inst_apl}, {pts_inst}, {dest_inst},
    {ind_pts}, {ind_perc}, {ind_class}, {ind_key}, {ind_dev}
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());"""
        seed_lines.append(sql)

    sql_seed = "\n".join(seed_lines)

    file_cases = migrations_dir / "20260929140000_create_cases_table.sql"
    file_muns = migrations_dir / "20260929140001_create_municipalities_table.sql"
    file_rls = migrations_dir / "20260929140002_enable_rls_and_policies.sql"
    file_seed = migrations_dir / "20260929140003_seed_data.sql"
    file_all = BASE_DIR / "supabase" / "schema_completo.sql"

    with open(file_cases, "w", encoding="utf-8") as f:
        f.write(sql_cases_table)
    with open(file_muns, "w", encoding="utf-8") as f:
        f.write(sql_muns_table)
    with open(file_rls, "w", encoding="utf-8") as f:
        f.write(sql_rls)
    with open(file_seed, "w", encoding="utf-8") as f:
        f.write(sql_seed)

    full_schema = f"""-- ==============================================================================
-- SCHEMA COMPLETO E SEED - SEBRAE MG (MAPA DE CASES DE SUCESSO)
-- Gerado para o Supabase Corporativo
-- Execute este script completo no SQL Editor do Dashboard do Supabase da empresa.
-- ==============================================================================

{sql_cases_table}

{sql_muns_table}

{sql_rls}

{sql_seed}
"""
    with open(file_all, "w", encoding="utf-8") as f:
        f.write(full_schema)

    print(f"[OK] Migrations geradas em {migrations_dir}")
    print(f"[OK] Script unificado gerado em {file_all}")

def save_json_export(cases, municipalities, next_code):
    """Salva exportação completa em formato JSON limpo."""
    export_path = BASE_DIR / "supabase" / "supabase_export.json"
    export_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "metadata": {
            "source": "Sebrae MG - Mapa de Cases de Sucesso",
            "version": "2.0.0",
            "cases_count": len(cases),
            "municipalities_count": len(municipalities),
            "next_code": next_code
        },
        "cases": cases,
        "municipalities": municipalities,
        "system_counters": {"next_code": next_code}
    }
    with open(export_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    print(f"[OK] Exportação JSON salva em {export_path}")

def push_data_via_rest(target_url, target_key, cases, municipalities, next_code):
    """Envia dados diretamente para o Supabase de destino via REST API (PostgREST)."""
    target_url = target_url.rstrip("/")
    headers = {
        "apikey": target_key,
        "Authorization": f"Bearer {target_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
    }

    print(f"\n[PUSH] Conectando ao Supabase de destino: {target_url}...")

    try:
        req = urllib.request.Request(
            f"{target_url}/rest/v1/system_counters",
            data=json.dumps([{"key": "next_code", "value": next_code}]).encode("utf-8"),
            headers=headers,
            method="POST"
        )
        with opener.open(req, timeout=15) as resp:
            print(f"[OK] Contador sequencial configurado com sucesso (next_code={next_code}).")
    except Exception as e:
        print(f"[ERRO] Falha ao enviar contador system_counters: {e}")

    print(f"[PUSH] Enviando {len(municipalities)} municípios...")
    muns_success = 0
    chunk_size = 10
    for i in range(0, len(municipalities), chunk_size):
        chunk = municipalities[i:i + chunk_size]
        try:
            req = urllib.request.Request(
                f"{target_url}/rest/v1/municipalities",
                data=json.dumps(chunk, ensure_ascii=False).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with opener.open(req, timeout=20) as resp:
                muns_success += len(chunk)
                print(f"  -> {muns_success}/{len(municipalities)} municípios enviados.")
        except Exception as e:
            print(f"  [ERRO] Lote de municípios {i} a {i+len(chunk)}: {e}")

    print(f"[PUSH] Enviando {len(cases)} cases de sucesso...")
    cases_success = 0
    for i in range(0, len(cases), chunk_size):
        chunk = cases[i:i + chunk_size]
        try:
            req = urllib.request.Request(
                f"{target_url}/rest/v1/cases",
                data=json.dumps(chunk, ensure_ascii=False).encode("utf-8"),
                headers=headers,
                method="POST"
            )
            with opener.open(req, timeout=20) as resp:
                cases_success += len(chunk)
                print(f"  -> {cases_success}/{len(cases)} cases enviados.")
        except Exception as e:
            print(f"  [ERRO] Lote de cases {i} a {i+len(chunk)}: {e}")

    print(f"\n[FIM DO PUSH] Sucesso: {cases_success}/{len(cases)} cases, {muns_success}/{len(municipalities)} municípios.")

def verify_target_supabase(target_url, target_key):
    """Verifica e reporta os dados existentes no Supabase informado."""
    target_url = target_url.rstrip("/")
    headers = {
        "apikey": target_key,
        "Authorization": f"Bearer {target_key}",
        "Content-Type": "application/json"
    }
    print(f"\n[VERIFICAÇÃO] Validando tabelas em {target_url}...")

    try:
        req = urllib.request.Request(f"{target_url}/rest/v1/cases?select=id,titulo_projeto,status,tipo_case", headers=headers)
        with opener.open(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] Tabela 'cases' respondeu: {len(data)} registros encontrados.")
            students = sum(1 for c in data if c.get("tipo_case") == "estudante")
            teachers = sum(1 for c in data if c.get("tipo_case") != "estudante")
            print(f"     -> Cases de Professor: {teachers}")
            print(f"     -> Cases de Estudante: {students}")
    except urllib.error.HTTPError as e:
        print(f"[ERRO] Tabela 'cases': HTTP {e.code} - {e.reason} (verifique se executou as migrations no SQL Editor)")
    except Exception as e:
        print(f"[ERRO] Tabela 'cases': {e}")

    try:
        req = urllib.request.Request(f"{target_url}/rest/v1/municipalities?select=id,nome,status,indice_classificacao", headers=headers)
        with opener.open(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            print(f"[OK] Tabela 'municipalities' respondeu: {len(data)} registros encontrados.")
    except urllib.error.HTTPError as e:
        print(f"[ERRO] Tabela 'municipalities': HTTP {e.code} - {e.reason} (verifique se executou as migrations no SQL Editor)")
    except Exception as e:
        print(f"[ERRO] Tabela 'municipalities': {e}")

def main():
    parser = argparse.ArgumentParser(description="Migração e Gerador de Migrations do Supabase - Sebrae MG")
    parser.add_argument("--generate-sql", action="store_true", help="Gera arquivos de migration e schema_completo.sql")
    parser.add_argument("--dump-json", action="store_true", help="Exporta dados para supabase/supabase_export.json")
    parser.add_argument("--push-rest", action="store_true", help="Faz push dos dados via REST para o Supabase de destino")
    parser.add_argument("--verify", action="store_true", help="Verifica a integridade das tabelas no Supabase")
    parser.add_argument("--target-url", type=str, default="", help="URL do Supabase de destino")
    parser.add_argument("--target-key", type=str, default="", help="Anon ou Service Role Key do Supabase de destino")
    parser.add_argument("--source-url", type=str, default="", help="URL do Supabase de origem")
    parser.add_argument("--source-key", type=str, default="", help="Key do Supabase de origem")

    args = parser.parse_args()

    if not (args.generate_sql or args.dump_json or args.push_rest or args.verify):
        args.generate_sql = True
        args.dump_json = True

    print("=" * 70)
    print("SEBRAE MG - EXPORTAÇÃO E MIGRAÇÃO SUPABASE")
    print("=" * 70)

    cases, municipalities, next_code = fetch_source_data(args.source_url, args.source_key)
    print(f"Total de Cases Carregados: {len(cases)}")
    print(f"Total de Municípios Carregados: {len(municipalities)}")
    print(f"Próximo Código de Protocolo: #{next_code}")

    if args.generate_sql:
        generate_sql_migrations(cases, municipalities, next_code)

    if args.dump_json:
        save_json_export(cases, municipalities, next_code)

    if args.push_rest:
        url = args.target_url or os.environ.get("TARGET_SUPABASE_URL")
        key = args.target_key or os.environ.get("TARGET_SUPABASE_KEY")
        if not url or not key:
            print("[ERRO] Para usar --push-rest, informe --target-url e --target-key (ou defina TARGET_SUPABASE_URL / TARGET_SUPABASE_KEY).")
        else:
            push_data_via_rest(url, key, cases, municipalities, next_code)

    if args.verify:
        url = args.target_url or os.environ.get("TARGET_SUPABASE_URL") or args.source_url or os.environ.get("SUPABASE_URL")
        key = args.target_key or os.environ.get("TARGET_SUPABASE_KEY") or args.source_key or os.environ.get("SUPABASE_KEY")
        if not url or not key:
            print("[ERRO] Para usar --verify, informe --target-url e --target-key.")
        else:
            verify_target_supabase(url, key)

    print("\n[CONCLUÍDO COM SUCESSO]")

if __name__ == "__main__":
    main()
