-- ==============================================================================
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
