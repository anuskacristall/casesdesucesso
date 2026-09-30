-- ==============================================================================
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
