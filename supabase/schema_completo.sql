-- ==============================================================================
-- SCHEMA COMPLETO E SEED - SEBRAE MG (MAPA DE CASES DE SUCESSO)
-- Gerado para o Supabase Corporativo
-- Execute este script completo no SQL Editor do Dashboard do Supabase da empresa.
-- ==============================================================================

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


-- ==============================================================================
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


-- ==============================================================================
-- 20260929140003_seed_data.sql
-- Inserção de Dados Canônicos Consolidados (23 Cases + 18 Municípios)
-- ==============================================================================

-- Inicialização de Contador Sequencial de Protocolo
INSERT INTO public.system_counters (key, value, updated_at)
VALUES ('next_code', 40000, TIMEZONE('utc'::text, NOW()))
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = EXCLUDED.updated_at;

-- Inserção / Atualização de Cases de Sucesso (23 registros)
INSERT INTO public.cases (
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
    'seed-6', '#80000', 'Jogos de Tabuleiro Históricos', 'Fomento ao aprendizado dinâmico de história regional e educação financeira por meio da criação e jogabilidade de tabuleiros pedagógicos.', 'Divinópolis', 'Centro-Oeste e Sudoeste', 'MR Divinópolis',
    'Escola Estadual Joaquim Nabuco', '', '', -20.1446, -44.8912, 'approved', 'professor',
    'Patrícia Lima', 'patricia.lima@sebraemg.com.br', '(37) 98822-1100',
    NULL, NULL, NULL,
    'False', NULL, NULL, NULL, 'Criação de Jogos de Tabuleiro didáticos sobre história regional e finanças, utilizados como dinâmica de aprendizado lúdico.', 'contato@tabuleirojovem.com.br',
    NULL, NULL, NULL,
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Mentoria de design gráfico e regras de jogos com estudantes da UEMG Divinópolis.',
    NULL, NULL, NULL, 'False', 'False', '',
    NULL, NULL, 'True', 'True', 'Patrocínio do Sicoob Divicred para impressão física dos tabuleiros criados pelos estudantes.',
    'True', 'True', 'Lei municipal determina incentivos fiscais para empresas locais que patrocinarem projetos de empreendedorismo juvenil escolar.',
    '["curso", "material_didatico", "palestra"]'::jsonb, 25, TRUE,
    22, 24.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 22, "pontuacao_maxima": 91, "percentual": 24.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "material_didatico", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-3', '#20000', 'App Conecta Vizinhança', 'Iniciativa de inovação social com foco em solidariedade intergeracional e desenvolvimento de competências tecnológicas e de programação em Uberlândia.', 'Uberlândia', 'Triângulo', 'MR Uberlândia',
    'Escola Municipal Messias Pedreiro', 'Fundamental', 'Municipal', -18.9141, -48.2749, 'approved', 'estudante',
    'Fernando Cruz', 'fernando.cruz@sebraemg.com.br', '(34) 99122-3344',
    NULL, NULL, NULL,
    'True', 'Beatriz Helena Costa', 'beatriz.costa@escola.uberlandia.mg.gov.br', '(34) 99122-3344', 'Desenvolvimento de aplicativo móvel ''Apoio Próximo'' para conectar vizinhos e jovens a idosos necessitando de tarefas domésticas simples.', '@apoio_proximo_udl',
    'Vizinho Solidário App', 'Inovação Social / Aplicativos Mobile', 'Plataforma móvel colaborativa desenvolvida por estudantes para conectar voluntários jovens a idosos da comunidade que necessitam de suporte em tarefas cotidianas.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Mentoria e laboratórios de informática cedidos pela Universidade Federal de Uberlândia (UFU).',
    NULL, 'True', 'True', 'True', 'True', 'Comitê conjunto de inovação tecnológica na educação escolar, articulando SEBRAE, prefeitura e incubadoras locais.',
    'True', 'False', 'False', 'False', '',
    'True', 'True', 'Lei de Incentivo à Inovação e Empreendedorismo de Uberlândia, abrangendo a difusão da cultura empreendedora na rede pública.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    57, 62.6, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 57, "pontuacao_maxima": 91, "percentual": 62.6, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-5', '#30000', 'Doces Saudáveis de Frutas Locais', 'Projeto de capacitação em desidratação de frutas locais e produção de alimentos gourmet saudáveis no Vale do Aço.', 'Ipatinga', 'Rio Doce e Vale do Aço', 'MR Ipatinga',
    'Escola Estadual Alberto Giovannini', 'Médio', 'Estadual', -19.4703, -42.5476, 'approved', 'estudante',
    'Marcos Oliveira', 'marcos.oliveira@sebraemg.com.br', '(31) 97555-4433',
    NULL, NULL, NULL,
    'True', 'Mariana Alvarenga Santos', 'mariana.santos@aluno.mg.gov.br', '(31) 97555-0000', 'Produção de Doces Saudáveis gourmet com frutas locais desidratadas, servidos como alternativa nutritiva na escola.', '(31) 97555-0000',
    'Sabor do Vale Frutas Desidratadas', 'Alimentos Artesanais / Nutrição Saudável', 'Produção e comercialização de doces e snacks naturais gourmet a partir de frutas locais desidratadas, servidos como alternativa nutritiva e saudável na escola e região.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Alinhamento com o Centro Universitário de Leste de Minas (Unileste) em projetos de inovação social.',
    NULL, 'True', 'True', 'True', 'True', 'Fórum de Educação Empreendedora do Vale do Aço, unindo SEBRAE, Superintendência Estadual e Secretarias Municipais.',
    'True', 'False', 'True', 'True', 'Capacitações em gestão empresarial promovidas pela cooperativa local Sicoob Cosmipa.',
    'True', 'True', 'Lei n° 5.221/2023 - Institui a Educação Empreendedora e Financeira nas escolas municipais de Ipatinga.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    59, 64.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 59, "pontuacao_maxima": 91, "percentual": 64.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-7', '#40000', 'Costura Criativa e Reciclagem', 'Cooperativa de costura focada na reciclagem de retalhos descartados por indústrias têxteis locais, promovendo a moda circular.', 'Juiz de Fora', 'Zona da Mata e Vertentes', 'MR Juiz de Fora',
    'Colégio de Aplicação João XXIII', 'Médio', 'Federal', -21.7595, -43.3398, 'approved', 'estudante',
    'Beatriz Neves', 'beatriz.neves@sebraemg.com.br', '(32) 99988-1122',
    NULL, NULL, NULL,
    'True', 'Letícia Ribeiro Prado', 'leticia.prado@coljoaoxxiii.ufjf.br', '(32) 99188-7766', 'Cooperativa Escolar de Costura Criativa, reciclando retalhos e restos de tecidos descartados pela indústria polo têxtil de Juiz de Fora.', '@eco_costura_joaoxxiii',
    'EcoCostura Fashion Upcycling', 'Moda Sustentável / Artesanato Têxtil', 'Marca estudantil de ecobags, estojos e acessórios de vestuário criados exclusivamente com retalhos e sobras descartadas do polo confeccionista local.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Apoio metodológico da Faculdade de Serviço Social da UFJF em cooperativismo de base.',
    NULL, 'True', 'True', 'True', 'True', 'Parceria direta com a Superintendência Regional de Ensino de Juiz de Fora e SEBRAE para capacitação docente continuada.',
    'True', 'False', 'False', 'False', '',
    'True', 'True', 'Lei de inserção de conceitos de economia circular e empreendedorismo social no currículo básico do município.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    57, 62.6, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 57, "pontuacao_maxima": 91, "percentual": 62.6, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-8', '#50000', 'Mini-Agência de Ecoturismo', 'Mini-agência escolar focada na valorização e mapeamento do potencial turístico, cultural e ecológico do Vale do Mucuri.', 'Teófilo Otoni', 'Jequitinhonha e Mucuri', 'MR Teófilo Otoni',
    'Escola Municipal Pastor Hollerbach', '', '', -17.8595, -41.5087, 'approved', 'professor',
    'Samuel Santos', 'samuel.santos@sebraemg.com.br', '(33) 98444-5566',
    NULL, NULL, NULL,
    'True', NULL, NULL, NULL, 'Mini-agência de Ecoturismo de Teófilo Otoni, desenvolvendo roteiros virtuais e cartilhas físicas sobre a rota das pedras preciosas.', 'turismojovem.to@gmail.com',
    NULL, NULL, NULL,
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Mentoria do departamento de Turismo e Geografia da Universidade Federal dos Vales do Jequitinhonha e Mucuri (UFVJM).',
    NULL, NULL, NULL, 'True', 'True', 'Ações coordenadas de valorização cultural e economia criativa com a Secretaria de Cultura e SEBRAE.',
    NULL, NULL, 'True', 'True', 'Oficinas de poupança cooperativa ministradas por técnicos do Sicoob Credimonte.',
    'False', 'False', '',
    '["palestra"]'::jsonb, 5, FALSE,
    26, 28.6, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 26, "pontuacao_maxima": 91, "percentual": 28.6, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["palestra"], "pontuacao_instrumentos": 5, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-9', '#60000', 'Mel Orgânico e Apicultura Escolar', 'Projeto de apicultura pedagógica e cooperativa escolar de Paracatu, aliando ecologia e empreendedorismo rural.', 'Paracatu', 'Noroeste e Alto Paranaíba', 'MR Paracatu',
    'Escola Estadual Afonso Roquete', 'Médio', 'Estadual', -17.2252, -46.8711, 'approved', 'estudante',
    'Denise Mendes', 'denise.mendes@sebraemg.com.br', '(38) 99222-8899',
    NULL, NULL, NULL,
    'True', 'Rodrigo Mendonça Pinto', 'rodrigo.mendonca@aluno.mg.gov.br', '(38) 99733-2211', 'Produção de Mel Orgânico e Velas de Cera de Abelha aromatizadas, explorando o cooperativismo apícola entre alunos.', '(38) 99222-0011',
    'Mel do Vale Apicultura Jovem', 'Apicultura Sustentável / Alimentos Naturais', 'Manejo responsável de abelhas nativas sem ferrão e extração de mel orgânico certificado com rotulagem personalizada produzida pelos estudantes.',
    'nao', 'nao', NULL, 'Parcial', 'Parcial',
    NULL, 'True', 'True', 'True', 'Mentoria técnica em agronomia da Faculdade FINOM.',
    NULL, 'True', 'True', 'False', 'False', '',
    'False', 'False', 'True', 'True', 'Financiamento coletivo estruturado com cooperativas de crédito agropecuárias locais para aquisição das colmeias didáticas.',
    'True', 'True', 'Lei Municipal autoriza o uso de áreas públicas ociosas para hortas e apiários comunitários escolares com fins pedagógicos.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    37, 40.7, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 37, "pontuacao_maxima": 91, "percentual": 40.7, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-4', '#70000', 'Sabão Ecológico e Sustentável', 'Desenvolvimento de produtos de limpeza sustentáveis a partir do reaproveitamento de óleos vegetais usados, fomentando o empreendedorismo ambiental.', 'Montes Claros', 'Norte', 'MR Montes Claros',
    'Instituto Federal do Norte de Minas (IFNMG)', 'Técnico', 'Federal', -16.7282, -43.8578, 'approved', 'professor',
    'Clara Rocha', 'clara.rocha@sebraemg.com.br', '(38) 99911-2233',
    'Prof. Carlos Eduardo Mendes', 'carlos.mendes@ifnmg.edu.br', '(38) 99876-5432',
    'False', NULL, NULL, NULL, 'Produção de Sabão Ecológico e velas aromatizadas a partir de óleo de fritura usado, recolhido em restaurantes parceiros da cidade.', 'sabaoecojovem@ifnmg.edu.br',
    'BioSabão EcoMinas', 'Química Sustentável / Saneantes Ecológicos', 'Produção e comercialização pedagógica de sabão ecológico e bioinsumos biodegradáveis a partir do reaproveitamento de óleos vegetais residuais de restaurantes parceiros.',
    'nao', 'nao', NULL, 'Parcial', 'Parcial',
    NULL, 'True', 'True', 'True', 'Projeto de extensão conjunto com a Unimontes para análises químicas de segurança do sabão produzido.',
    NULL, 'True', 'True', 'True', 'True', 'Ações conjuntas para disseminação do empreendedorismo integrado ao ensino técnico profissionalizante da região.',
    'False', 'False', 'True', 'True', 'Apoio da Sicoob Credinor, promovendo mini-créditos simulados para aquisição de matéria-prima das equipes de estudantes.',
    'False', 'False', '',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    41, 45.1, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 41, "pontuacao_maxima": 91, "percentual": 45.1, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-16', '#170000', 'Ecomodas e Customização Social', 'Iniciativa de transformação de peças de vestuário descartadas ou doadas em roupas modernas e utilitárias de Governador Valadares.', 'Governador Valadares', 'Rio Doce e Vale do Aço', 'MR Governador Valadares',
    'Escola Estadual Professor Nelson de Sena', 'Médio', 'Estadual', -18.8545, -41.9555, 'approved', 'professor',
    'Marcos Oliveira', 'marcos.oliveira@sebraemg.com.br', '(31) 97555-4433',
    'Profª. Renata Silveira Castro', 'renata.castro@educacao.mg.gov.br', '(33) 98777-6655',
    'False', NULL, NULL, NULL, 'Desenvolvimento de ecobags e mochilas escolares resistentes criadas a partir de calças jeans velhas descartadas.', '@ecomodajovem_gv',
    'UpDesign Mobiliário Escolar Sustentável', 'Design Sustentável / Mobiliário e Upcycling', 'Oficina docente de upcycling e design sustentável que transforma resíduos têxteis e madeiras de descarte em peças de mobiliário e utilitários escolares.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Mentoria de administração e marketing digital com a UFJF-GV.',
    NULL, 'True', 'True', 'True', 'True', 'Comitê de fomento educacional e social do Rio Doce.',
    'False', 'False', 'False', 'False', '',
    'True', 'True', 'Institui o Plano Municipal de Empreendedorismo de Valadares voltado ao desenvolvimento sustentável da juventude.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    53, 58.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 53, "pontuacao_maxima": 91, "percentual": 58.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-11', '#90000', 'Clube Escolar de Robótica Agrícola', 'Desenvolvimento de pequenos sensores automatizados e protótipos de irrigação sustentável com sucata eletrônica por alunos de Uberaba.', 'Uberaba', 'Triângulo', 'MR Uberaba',
    'Escola Estadual Professor Chaves', 'Médio', 'Estadual', -19.7472, -47.9381, 'approved', 'estudante',
    'Fernando Cruz', 'fernando.cruz@sebraemg.com.br', '(34) 99122-3344',
    NULL, NULL, NULL,
    'True', 'Felipe Nogueira Borges', 'felipe.borges@aluno.mg.gov.br', '(34) 99233-1122', 'Desenvolvimento de robôs irrigadores solares de baixo custo para hortas de pequenos produtores da região.', 'robotica.chaves@gmail.com',
    'AgroBot Automação Rural', 'Tecnologia Agrícola / Robótica e Automação', 'Prototipagem de sistemas automatizados de irrigação com sensores de umidade de baixo custo voltados para a agricultura familiar do Triângulo.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Mentoria de professores e universitários do curso de Engenharia Agrícola da UFTM.',
    NULL, 'True', 'True', 'True', 'True', 'Fórum de Integração Agro-Tecnológica do Triângulo Mineiro.',
    'False', 'False', 'True', 'True', 'Apoio financeiro da Sicoob Credimed para compra de kits eletrônicos e componentes solares.',
    'True', 'True', 'Lei de Educação Empreendedora e Tecnológica municipal, incentivando projetos integrados de ciência de dados e campo nas escolas públicas.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    55, 60.4, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 55, "pontuacao_maxima": 91, "percentual": 60.4, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-13', '#100000', 'Mini-Indústria de Sabores do Cerrado', 'Produção cooperativa de doces, geleias e panificações utilizando frutos típicos do Cerrado, promovendo o beneficiamento alimentar rural e empreendedorismo sustentável.', 'Patos de Minas', 'Noroeste e Alto Paranaíba', 'MR Patos de Minas',
    'Escola Estadual Dona Guiomar de Melo', 'Médio', 'Estadual', -18.5699, -46.5013, 'approved', 'estudante',
    'Denise Mendes', 'denise.mendes@sebraemg.com.br', '(38) 99222-8899',
    NULL, NULL, NULL,
    'True', 'Amanda Caroline Soares', 'amanda.soares@aluno.mg.gov.br', '(34) 98855-6677', 'Geleias e compotas Gourmet de Baru e Pequi colhidos de forma sustentável, comercializados em feiras regionais.', '@saboresdocerrado_patos',
    'Delícias do Cerrado Mineiro', 'Gastronomia Regional / Agroindústria Artesanal', 'Mini-agroindústria escolar para produção de geleias, pastas e farinhas enriquecidas a partir de frutos nativos do Cerrado como pequi, jatobá e baru.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Mentoria técnica em Engenharia de Alimentos da FPM (Faculdade de Patos de Minas).',
    NULL, 'True', 'True', 'True', 'True', 'Comitê de Desenvolvimento Econômico e Agrícola de Patos de Minas.',
    'True', 'False', 'True', 'True', 'Apoio e oficinas de cooperativismo do Sicoob Credipatos.',
    'True', 'True', 'Institui o Programa Municipal de Apoio ao Pequeno Produtor Escolar e Cooperativas Agrícolas Juvenis.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    59, 64.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 59, "pontuacao_maxima": 91, "percentual": 64.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-14', '#110000', 'Fábrica Jovem de Velas Ecológicas', 'Desenvolvimento de velas de cera de soja e aromas naturais da Mata Atlântica, reduzindo o uso de parafinas derivadas do petróleo.', 'São João del-Rei', 'Zona da Mata e Vertentes', 'MR São João Del Rei',
    'Escola Estadual Professor Mário Casassanta', 'Médio', 'Estadual', -21.1311, -44.2526, 'approved', 'estudante',
    'Patrícia Lima', 'patricia.lima@sebraemg.com.br', '(37) 98822-1100',
    NULL, NULL, NULL,
    'True', 'Thiago Augusto Resende', 'thiago.resende@aluno.mg.gov.br', '(32) 99811-2244', 'Startup de velas aromatizadas e terapêuticas feitas de cera vegetal de soja biodegradável e essências naturais.', 'velasecojovem.sjdr@gmail.com',
    'Luz Criativa Velas Aromáticas', 'Velas Artesanais / Decoração Sustentável', 'Produção sustentável de velas aromatizadas terapêuticas feitas com cera de soja ecológica e essências de flores típicas das vertentes mineiras.',
    'nao', 'nao', NULL, 'Parcial', 'Parcial',
    NULL, 'True', 'True', 'True', 'Suporte laboratorial e mentoria química com a UFSJ (Universidade Federal de São João del-Rei).',
    NULL, 'True', 'True', 'True', 'True', 'Grupo de fomento de empreendedorismo estudantil integrado com a prefeitura.',
    'False', 'False', 'True', 'True', 'Crédito cooperativo mirim viabilizado pela cooperativa de crédito Sicoob Credishow.',
    'False', 'False', '',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    41, 45.1, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 41, "pontuacao_maxima": 91, "percentual": 45.1, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-15', '#120000', 'Laboratório de Economia Circular de Papel', 'Oficina escolar de reciclagem e produção de papéis artesanais a partir de aparas de papelão e embalagens coletadas em comércios de Varginha.', 'Varginha', 'Sul', 'MR Varginha',
    'Escola Estadual Deputado Domingos de Figueiredo', 'Médio', 'Estadual', -21.5556, -45.4364, 'approved', 'estudante',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    NULL, NULL, NULL,
    'True', 'Larissa Bueno Carvalho', 'larissa.carvalho@aluno.mg.gov.br', '(35) 99199-8877', 'Produção de agendas, cadernos e cartões artesanais feitos de papel reciclado e sementes de flores incorporadas.', 'papelsemente.jovem@gmail.com',
    'Papel Vivo Cadernos Artesanais', 'Papelaria Artesanal / Reciclagem de Papel', 'Oficina escolar de reaproveitamento de papel sulfite usado na escola para confecção de cadernos artesanais e cartões com sementes germináveis.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Oficinas de design e marketing com estudantes do CEFET-MG Varginha.',
    NULL, 'True', 'True', 'False', 'False', '',
    'False', 'False', 'True', 'True', 'Parceria com o Sicredi para confecção de materiais de papelaria corporativa ecológica para a cooperativa.',
    'True', 'True', 'Lei de incentivo à reciclagem e fomento da educação socioambiental cooperativa.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    50, 54.9, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 50, "pontuacao_maxima": 91, "percentual": 54.9, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-17', '#130000', 'Horta Hidropônica Inteligente', 'Projeto de agricultura urbana e cultivo sustentável automatizado usando hidroponia vertical e IoT na rede pública de Betim.', 'Betim', 'Centro', 'MR Das Indústrias',
    'Escola Estadual Virgílio de Melo Franco', '', '', -19.9668, -44.2008, 'approved', 'professor',
    'Amanda Souza', 'amanda.souza@sebraemg.com.br', '(31) 98765-4321',
    NULL, NULL, NULL,
    'True', NULL, NULL, NULL, 'Produção hidropônica de folhosas em sistemas verticais controlados por sensores que economizam 90% de água.', 'contato.hidroponiabetim@gmail.com',
    NULL, NULL, NULL,
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Consultoria agronômica com bolsistas da PUC Minas.',
    NULL, NULL, NULL, 'True', 'True', 'Comitê de Segurança Alimentar e Nutricional Escolar de Betim.',
    NULL, NULL, 'True', 'True', 'Investimento inicial do Sicoob Crediminas para compra das bombas de água e mangueiras.',
    'True', 'True', 'Lei de Fomento à Agricultura Familiar Escolar e Incentivo ao Desenvolvimento de Práticas Ecológicas nas Escolas.',
    '["material_didatico", "oficina", "palestra"]'::jsonb, 25, TRUE,
    40, 44.0, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 40, "pontuacao_maxima": 91, "percentual": 44.0, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["material_didatico", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-18', '#140000', 'Fábrica Jovem de Briquetes Ecológicos', 'Produção de biomassa compactada (briquetes) para lareiras e churrasqueiras a partir de serragem descartada por serrarias e marcenarias locais.', 'Diamantina', 'Jequitinhonha e Mucuri', 'MR Diamantina',
    'Escola Estadual Dom João Antônio dos Santos', 'Médio', 'Estadual', -18.2413, -43.6031, 'approved', 'estudante',
    'Samuel Santos', 'samuel.santos@sebraemg.com.br', '(33) 98444-5566',
    NULL, NULL, NULL,
    'True', 'Otávio Pereira Cunha', 'otavio.cunha@aluno.mg.gov.br', '(38) 99888-3311', 'Briquetes ecológicos de alta queima fabricados de serragem e jornais reciclados, vendidos como alternativa ao carvão vegetal tradicional.', 'briquetesdiamantina@escola.com',
    'EcoBriquetes Diamantina', 'Energia Renovável / Biomassa Sustentável', 'Prensagem mecânica de serragem vegetal e resíduos secos locais para fabricação de briquetes ecológicos substitutos do carvão vegetal comum.',
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Suporte técnico laboratorial e testes de queima com a UFVJM.',
    NULL, 'True', 'True', 'True', 'True', 'Grupo de fomento de educação ambiental e empreendedorismo regional.',
    'False', 'False', 'False', 'False', '',
    'False', 'False', '',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    39, 42.9, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 39, "pontuacao_maxima": 91, "percentual": 42.9, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-19', '#150000', 'Startup Escolar Eco-Copos', 'Desenvolvimento e fabricação de copos biodegradáveis a partir de fibras da casca de coco e mandioca, reduzindo plásticos de uso único.', 'Governador Valadares', 'Rio Doce e Vale do Aço', 'MR Governador Valadares',
    'Escola Estadual Professor Nelson de Sena', 'Médio', 'Estadual', -18.8545, -41.9555, 'approved', 'estudante',
    'Marcos Oliveira', 'marcos.oliveira@sebraemg.com.br', '(31) 97555-4433',
    NULL, NULL, NULL,
    'True', 'Sofia Vasconcelos Lima', 'sofia.lima@aluno.mg.gov.br', '(33) 99122-8899', 'Design e manufatura artesanal de copos descartáveis biodegradáveis feitos com fibras vegetais orgânicas, utilizados em eventos escolares.', '@ecocopovad',
    'Copos da Terra Biodegradáveis', 'Embalagens Ecológicas / Biomateriais', 'Desenvolvimento de copos e tigelas 100% biodegradáveis com base em fécula de mandioca e fibras vegetais para eliminar recipientes plásticos na escola.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Estudos de degradação e análises biológicas com a UNIVALE.',
    NULL, 'True', 'True', 'False', 'False', '',
    'False', 'False', 'True', 'True', 'Linha de financiamento cooperativo para a prensa térmica estudantil com Sicoob AC Credi.',
    'True', 'True', 'Lei de redução gradativa de copos descartáveis na rede de ensino pública.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    50, 54.9, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 50, "pontuacao_maxima": 91, "percentual": 54.9, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-12', '#160000', 'Artesanato e Resgate Cultural Indígena', 'Projeto de resgate, valorização e empreendedorismo cultural com foco em artesanatos tradicionais e línguas nativas da região do Jequitinhonha.', 'Teófilo Otoni', 'Jequitinhonha e Mucuri', 'MR Teófilo Otoni',
    'Escola Estadual Xucuru Kariri', '', '', -17.8595, -41.5087, 'approved', 'professor',
    'Samuel Santos', 'samuel.santos@sebraemg.com.br', '(33) 98444-5566',
    NULL, NULL, NULL,
    'False', NULL, NULL, NULL, 'Feira de artesanato estudantil indígena e produção de e-books de contos folclóricos locais, vendidos em benefício da comunidade escolar.', 'contato.xucuru@gmail.com',
    NULL, NULL, NULL,
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Cooperação cultural e pedagógica com a UFVJM.',
    NULL, NULL, NULL, 'False', 'False', '',
    NULL, NULL, 'False', 'False', '',
    'True', 'True', 'Lei Municipal de Proteção e Fomento ao Patrimônio Histórico, Imaterial e Empreendedorismo de Comunidades Tradicionais.',
    '["oficina", "palestra"]'::jsonb, 15, FALSE,
    20, 22.0, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 20, "pontuacao_maxima": 91, "percentual": 22.0, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["oficina", "palestra"], "pontuacao_instrumentos": 15, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-1', '#10000', 'Lixeiras Inteligentes IoT', 'Implantação de práticas de economia circular e sustentabilidade ecológica de forma interdisciplinar na rede de ensino de Belo Horizonte.', 'Belo Horizonte', 'Centro', 'MR Grande Belo Horizonte',
    'Escola Estadual Sebrae', 'Médio', 'Estadual', -19.9102, -43.9266, 'approved', 'estudante',
    'Amanda Souza', 'amanda.souza@sebraemg.com.br', '(31) 98765-4321',
    NULL, NULL, NULL,
    'True', 'Lucas Gabriel Ferreira', 'lucas.ferreira@aluno.sebraemg.com.br', '(31) 98765-1111', 'Startup Escolar de Reciclagem Inteligente, desenvolvendo lixeiras IoT que geram pontos trocáveis por materiais escolares na cantina.', '(31) 98765-1111',
    'SmartWaste Recicla', 'Tecnologia / Sustentabilidade e IoT', 'Solução de lixeiras inteligentes conectadas com sensores ultrassônicos para monitoramento de descarte e gamificação de pontos trocáveis por materiais escolares.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Estudantes de administração da UFMG atuam como mentores dos alunos do ensino médio no desenvolvimento dos planos de negócios.',
    NULL, 'True', 'True', 'True', 'True', 'Reuniões bimestrais de alinhamento estratégico entre a Secretaria Municipal de Educação, Superintendência Regional de Ensino e Sebrae.',
    'False', 'True', 'True', 'True', 'Parceria com Sicoob para capacitação em finanças pessoais, abertura de contas poupança didáticas e patrocínio da feira de empreendedorismo da escola.',
    'True', 'True', 'Lei Municipal 12.345 que institui a Semana Municipal da Educação Empreendedora e destina verbas de incentivo a projetos escolares.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    58, 63.7, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 58, "pontuacao_maxima": 91, "percentual": 63.7, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": true, "pontos": 3}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-20', '#180000', 'Cooperativa Jovem de Games de Educação', 'Criação de jogos eletrônicos interativos para alfabetização matemática e financeira nas séries iniciais do ensino fundamental de Divinópolis.', 'Divinópolis', 'Centro-Oeste e Sudoeste', 'MR Divinópolis',
    'Escola Estadual Dona Antonieta Fonseca', '', '', -20.1446, -44.8912, 'approved', 'professor',
    'Patrícia Lima', 'patricia.lima@sebraemg.com.br', '(37) 98822-1100',
    NULL, NULL, NULL,
    'True', NULL, NULL, NULL, 'Equipe de estudantes desenvolvedores de jogos mobile focados em finanças para crianças de 6 a 9 anos.', 'jogoseducasul@gmail.com',
    NULL, NULL, NULL,
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Oficina de programação de jogos cedida pelo campus da UEMG.',
    NULL, NULL, NULL, 'True', 'True', 'Comitê de Inovação Aberta Escolar do Sebrae Divinópolis.',
    NULL, NULL, 'True', 'True', 'Apoio institucional e testes práticos de usabilidade com filhos de cooperados do Sicoob.',
    'True', 'True', 'Política Pública de Fomento a Jogos Digitais e Ferramentas Pedagógicas do Centro-Oeste.',
    '["palestra"]'::jsonb, 5, FALSE,
    27, 29.7, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 27, "pontuacao_maxima": 91, "percentual": 29.7, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["palestra"], "pontuacao_instrumentos": 5, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-22', '#190000', 'Clube de Sabores Gourmet Saudáveis', 'Oficinas estudantis de culinária saudável e reaproveitamento integral de cascas e talos, estimulando a alimentação consciente e finanças culinárias.', 'Campo Belo', 'Sul', 'MR Lavras',
    'Escola Estadual Padre Alberto Fuger', 'Médio', 'Estadual', -20.8932, -45.2699, 'approved', 'estudante',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    NULL, NULL, NULL,
    'True', 'Clara Beatriz Guimarães', 'clara.guimaraes@aluno.mg.gov.br', '(35) 99877-6655', 'Produção de geleias gourmet feitas de casca de maracujá e talos de abacaxi, vendidas em potes reutilizados higienizados.', 'culinariajovem.fuger@gmail.com',
    'Sabor & Saúde Pães e Lanches', 'Panificação Saudável / Alimentação Escolar', 'Empreendimento escolar de panificação artesanal saudável com produtos integrais, frutas da estação e geleias de cascas para cantinas e feiras.',
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Oficinas de microbiologia e conservação com acadêmicos de nutrição.',
    NULL, 'True', 'True', 'True', 'True', 'Ações estratégicas de promoção da alimentação sustentável intersetorial.',
    'False', 'False', 'False', 'False', '',
    'False', 'False', '',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    39, 42.9, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 39, "pontuacao_maxima": 91, "percentual": 42.9, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'case-1784213991897', '#200000', 'Teste', 'Estamos Testando', 'Belo Horizonte', 'Centro', 'MR Grande Belo Horizonte',
    'Escola Sebrae', 'Técnico', 'Privada', -19.9102, -43.9266, 'approved', 'professor',
    'Maria', 'maria@gmail.com', '31998133295',
    'Prof. André Luiz Silveira', 'andre.silveira@sebraemg.com.br', '(31) 98765-4321',
    'False', NULL, NULL, NULL, '', '',
    'InovaTech Educação', 'Tecnologia / Educação Maker', 'Laboratório de prototipagem maker e soluções tecnológicas voltadas à resolução de desafios na comunidade escolar.',
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, 'True', 'False', 'False', '',
    NULL, 'True', 'True', 'False', 'False', '',
    'True', 'True', 'True', 'True', 'Acordo com o estado',
    'False', 'False', '',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    35, 38.5, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 35, "pontuacao_maxima": 91, "percentual": 38.5, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": false, "pontos": 0}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": true, "pontos": 3}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-2', '#210000', 'Horta Orgânica Escolar', 'Projeto de fomento à alimentação saudável, cultivo agroecológico e espírito cooperativo escolar na região de Pouso Alegre.', 'Pouso Alegre', 'Sul', 'MR Pouso Alegre',
    'Colégio Municipal Dr. Ângelo', '', '', -22.2266, -45.9389, 'approved', 'professor',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    NULL, NULL, NULL,
    'False', NULL, NULL, NULL, 'Horta Orgânica Comunitária e Ecológica gerida integralmente pelos alunos, com venda direta em feira e doação a asilos locais.', 'hortasul@escolaangelo.edu.br',
    NULL, NULL, NULL,
    'nao', 'nao', NULL, 'Sim', 'Sim',
    NULL, NULL, 'True', 'True', 'Mentoria acadêmica com a Univas (Universidade do Vale do Sapucaí) integrando projetos de sustentabilidade social.',
    NULL, NULL, NULL, 'False', 'False', '',
    NULL, NULL, 'True', 'True', 'Sicredi ministra oficinas mensais de cooperativismo de crédito e educação financeira, apoiando com insumos para a horta.',
    'True', 'True', 'Dispõe sobre a inclusão de temas de empreendedorismo na grade complementar das escolas locais. Lei aprovada em 2024.',
    '["curso", "oficina", "palestra"]'::jsonb, 25, TRUE,
    22, 24.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 22, "pontuacao_maxima": 91, "percentual": 24.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-10', '#220000', 'Brechó e Moda Circular', 'Iniciativa de brechó estudantil e oficinas de customização de roupas escolares usadas, incentivando a redução do desperdício.', 'Belo Horizonte', 'Centro', 'MR Grande Belo Horizonte',
    'Escola Municipal Fernando Dias', 'Fundamental', 'Municipal', -19.9102, -43.9266, 'approved', 'professor',
    'Amanda Souza', 'amanda.souza@sebraemg.com.br', '(31) 98765-4321',
    'Profª. Juliana Martins Dutra', 'juliana.dutra@pbh.gov.br', '(31) 98666-5544',
    'False', NULL, NULL, NULL, 'Brechó e Customização de Roupas Escolares de segunda mão, promovendo consumo consciente e moda circular.', '@brecho_fdias',
    'Circula Moda Brechó Educativo', 'Economia Circular / Varejo Sustentável', 'Laboratório pedagógico de moda sustentável e brechó comunitário que ensina consumo consciente, reparos de roupas e noções de precificação e fluxo de caixa.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'False', 'False', '',
    NULL, 'True', 'True', 'True', 'True', 'Integrado ao plano de ação de Belo Horizonte juntamente com a Superintendência Escolar Metropolitana.',
    'True', 'False', 'False', 'False', '',
    'True', 'True', 'Lei Municipal 12.345 que institui o Programa Municipal de Incentivo ao Empreendedorismo de Alunos.',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    49, 53.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 49, "pontuacao_maxima": 91, "percentual": 53.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": false, "pontos": 0}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.cases (
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
    'seed-21', '#230000', 'Fomento Agrícola e Compostagem do Cerrado', 'Desenvolvimento de um polo escolar de compostagem e reciclagem de resíduos orgânicos coletados nas cantinas públicas da região de Patos de Minas.', 'Patos de Minas', 'Noroeste e Alto Paranaíba', 'MR Patos de Minas',
    'Escola Municipal Marcolino de Barros', 'Fundamental', 'Municipal', -18.5699, -46.5013, 'approved', 'professor',
    'Denise Mendes', 'denise.mendes@sebraemg.com.br', '(38) 99222-8899',
    'Profª. Eliane Cristina Faria', 'eliane.faria@patosdeminas.mg.gov.br', '(34) 99655-4433',
    'False', NULL, NULL, NULL, 'Produção de adubo orgânico de alta qualidade a partir de resíduos de comida, distribuído a agricultores familiares locais.', 'compostajovem@patos.gov.br',
    'Adubo Verde Fertilizantes Orgânicos', 'Biofertilizantes / Gestão de Resíduos Orgânicos', 'Projeto pedagógico docente de compostagem acelerada de resíduos da merenda gerando adubo natural de alta qualidade para hortas e pequenos produtores.',
    'sim', 'sim', NULL, 'Sim', 'Sim',
    NULL, 'True', 'True', 'True', 'Análise laboratorial de nitrogênio e fósforo no composto orgânico com a FPM.',
    NULL, 'True', 'True', 'False', 'False', '',
    'False', 'False', 'True', 'True', 'Apoio e patrocínio das embalagens de adubo ecológicas promovidos pela cooperativa local.',
    'True', 'True', 'Lei de Compostagem Escolar e Resíduos Sólidos Municipais.',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    50, 54.9, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 50, "pontuacao_maxima": 91, "percentual": 54.9, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    titulo_projeto = EXCLUDED.titulo_projeto,
    descricao_geral = EXCLUDED.descricao_geral,
    municipio = EXCLUDED.municipio,
    regional = EXCLUDED.regional,
    tipo_case = EXCLUDED.tipo_case,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());

-- Inserção / Atualização de Municípios Avaliados (18 registros)

INSERT INTO public.municipalities (
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
    'mun-1789569692644', '#370000', 'ffsz', 'CentroOeste', 'sg',
    'sfgxs', 'fshxsh@aefda.com', '(14) 98888-1356',
    'rejected', 0, 0,
    'nao', 'False', 'Sim',
    'False', 'False', 'True',
    'False', 'False', 'True',
    'True', 'False', 'True',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    31, 34.1, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 31, "pontuacao_maxima": 91, "percentual": 34.1, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": false, "pontos": 0}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": false, "pontos": 0}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": false, "pontos": 0}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-belo-horizonte', '#M-10010', 'Belo Horizonte', 'Centro', 'MR Grande Belo Horizonte',
    'Amanda Souza', 'amanda.souza@sebraemg.com.br', '(31) 98765-4321',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'False', 'True', 'True',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    87, 95.6, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 87, "pontuacao_maxima": 91, "percentual": 95.6, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": true, "pontos": 3}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-betim', '#M-10020', 'Betim', 'Centro', 'MR Das Indústrias',
    'Amanda Souza', 'amanda.souza@sebraemg.com.br', '(31) 98765-4321',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'False', 'False', 'True',
    'True',
    '["curso", "oficina", "palestra"]'::jsonb, 25, TRUE,
    84, 92.3, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 84, "pontuacao_maxima": 91, "percentual": 92.3, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-campo-belo', '#M-10030', 'Campo Belo', 'Sul', 'MR Lavras',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    'approved', 0, 0,
    'nao', 'True', 'Sim',
    'False', 'True', 'True',
    'False', 'True', 'True',
    'False', 'False', 'False',
    'False',
    '["oficina", "palestra"]'::jsonb, 15, FALSE,
    51, 56.0, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 51, "pontuacao_maxima": 91, "percentual": 56.0, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["oficina", "palestra"], "pontuacao_instrumentos": 15, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-diamantina', '#M-10040', 'Diamantina', 'Jequitinhonha e Mucuri', 'MR Diamantina',
    'Samuel Santos', 'samuel.santos@sebraemg.com.br', '(33) 98444-5566',
    'approved', 0, 0,
    'nao', 'True', 'Sim',
    'False', 'True', 'True',
    'False', 'True', 'True',
    'False', 'False', 'False',
    'False',
    '["palestra"]'::jsonb, 5, FALSE,
    51, 56.0, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 51, "pontuacao_maxima": 91, "percentual": 56.0, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["palestra"], "pontuacao_instrumentos": 5, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-divinopolis', '#M-10050', 'Divinópolis', 'Centro-Oeste e Sudoeste', 'MR Divinópolis',
    'Patrícia Lima', 'patricia.lima@sebraemg.com.br', '(37) 98822-1100',
    'approved', 0, 0,
    'nao', 'True', 'Sim',
    'False', 'True', 'True',
    'False', 'True', 'False',
    'False', 'False', 'True',
    'True',
    '["curso", "material_didatico", "palestra"]'::jsonb, 25, TRUE,
    49, 53.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 49, "pontuacao_maxima": 91, "percentual": 53.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "material_didatico", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-governador-valadares', '#M-10060', 'Governador Valadares', 'Rio Doce e Vale do Aço', 'MR Governador Valadares',
    'Marcos Oliveira', 'marcos.oliveira@sebraemg.com.br', '(31) 97555-4433',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'False', 'False', 'False',
    'True',
    '["encontro_mediado", "palestra"]'::jsonb, 15, FALSE,
    82, 90.1, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 82, "pontuacao_maxima": 91, "percentual": 90.1, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "palestra"], "pontuacao_instrumentos": 15, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-ipatinga', '#M-10070', 'Ipatinga', 'Rio Doce e Vale do Aço', 'MR Ipatinga',
    'Marcos Oliveira', 'marcos.oliveira@sebraemg.com.br', '(31) 97555-4433',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'True', 'False', 'True',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    88, 96.7, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 88, "pontuacao_maxima": 91, "percentual": 96.7, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-juiz-de-fora', '#M-10080', 'Juiz de Fora', 'Zona da Mata e Vertentes', 'MR Juiz de Fora',
    'Beatriz Neves', 'beatriz.neves@sebraemg.com.br', '(32) 99988-1122',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'True', 'False', 'False',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    86, 94.5, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 86, "pontuacao_maxima": 91, "percentual": 94.5, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-montes-claros', '#M-10090', 'Montes Claros', 'Norte', 'MR Montes Claros',
    'Clara Rocha', 'clara.rocha@sebraemg.com.br', '(38) 99911-2233',
    'approved', 0, 0,
    'nao', 'True', 'Parcial',
    'False', 'True', 'True',
    'False', 'True', 'True',
    'False', 'False', 'True',
    'False',
    '["material_didatico", "oficina", "palestra"]'::jsonb, 25, TRUE,
    53, 58.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 53, "pontuacao_maxima": 91, "percentual": 58.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["material_didatico", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-paracatu', '#M-10100', 'Paracatu', 'Noroeste e Alto Paranaíba', 'MR Paracatu',
    'Denise Mendes', 'denise.mendes@sebraemg.com.br', '(38) 99222-8899',
    'approved', 0, 0,
    'nao', 'True', 'Parcial',
    'False', 'True', 'True',
    'False', 'True', 'False',
    'False', 'False', 'True',
    'True',
    '["palestra"]'::jsonb, 5, FALSE,
    49, 53.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 49, "pontuacao_maxima": 91, "percentual": 53.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["palestra"], "pontuacao_instrumentos": 5, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-patos-de-minas', '#M-10110', 'Patos de Minas', 'Noroeste e Alto Paranaíba', 'MR Patos de Minas',
    'Denise Mendes', 'denise.mendes@sebraemg.com.br', '(38) 99222-8899',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'True', 'False', 'True',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    88, 96.7, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 88, "pontuacao_maxima": 91, "percentual": 96.7, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-pouso-alegre', '#M-10120', 'Pouso Alegre', 'Sul', 'MR Pouso Alegre',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    'approved', 0, 0,
    'nao', 'True', 'Sim',
    'False', 'True', 'True',
    'False', 'True', 'False',
    'False', 'False', 'True',
    'True',
    '["encontro_mediado", "oficina", "palestra"]'::jsonb, 25, TRUE,
    49, 53.8, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 49, "pontuacao_maxima": 91, "percentual": 53.8, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-sao-joao-del-rei', '#M-10130', 'São João del-Rei', 'Zona da Mata e Vertentes', 'MR São João Del Rei',
    'Patrícia Lima', 'patricia.lima@sebraemg.com.br', '(37) 98822-1100',
    'approved', 0, 0,
    'nao', 'True', 'Parcial',
    'False', 'True', 'True',
    'False', 'True', 'True',
    'False', 'False', 'True',
    'False',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    53, 58.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 53, "pontuacao_maxima": 91, "percentual": 58.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-teofilo-otoni', '#M-10140', 'Teófilo Otoni', 'Jequitinhonha e Mucuri', 'MR Teófilo Otoni',
    'Samuel Santos', 'samuel.santos@sebraemg.com.br', '(33) 98444-5566',
    'approved', 0, 0,
    'nao', 'True', 'Sim',
    'False', 'True', 'True',
    'False', 'True', 'True',
    'False', 'False', 'True',
    'False',
    '["palestra"]'::jsonb, 5, FALSE,
    53, 58.2, 'Em Desenvolvimento', 'em_desenvolvimento', '{"pontuacao": 53, "pontuacao_maxima": 91, "percentual": 58.2, "classificacao": "Em Desenvolvimento", "classificacao_key": "em_desenvolvimento", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": false, "pontos": 0}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": false, "pontos": 0}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": false, "pontos": 0}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": false, "pontos": 0}], "instrumentos_aplicados": ["palestra"], "pontuacao_instrumentos": 5, "destaque_instrumentos": false}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-uberaba', '#M-10150', 'Uberaba', 'Triângulo', 'MR Uberaba',
    'Fernando Cruz', 'fernando.cruz@sebraemg.com.br', '(34) 99122-3344',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'False', 'False', 'True',
    'True',
    '["curso", "oficina", "palestra"]'::jsonb, 25, TRUE,
    84, 92.3, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 84, "pontuacao_maxima": 91, "percentual": 92.3, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "oficina", "palestra"], "pontuacao_instrumentos": 25, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-uberlandia', '#M-10160', 'Uberlândia', 'Triângulo', 'MR Uberlândia',
    'Fernando Cruz', 'fernando.cruz@sebraemg.com.br', '(34) 99122-3344',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'True',
    'True', 'False', 'False',
    'True',
    '["curso", "encontro_mediado", "material_didatico", "oficina"]'::jsonb, 40, TRUE,
    86, 94.5, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 86, "pontuacao_maxima": 91, "percentual": 94.5, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": true, "pontos": 5}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": true, "pontos": 4}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": false, "pontos": 0}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["curso", "encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 40, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
INSERT INTO public.municipalities (
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
    'mun-varginha', '#M-10170', 'Varginha', 'Sul', 'MR Varginha',
    'Roberto Fonseca', 'roberto.fonseca@sebraemg.com.br', '(35) 99888-7766',
    'approved', 0, 0,
    'sim', 'True', 'Sim',
    'True', 'True', 'True',
    'True', 'True', 'False',
    'False', 'False', 'True',
    'True',
    '["encontro_mediado", "material_didatico", "oficina"]'::jsonb, 30, TRUE,
    79, 86.8, 'Desenvolvido', 'desenvolvido', '{"pontuacao": 79, "pontuacao_maxima": 91, "percentual": 86.8, "classificacao": "Desenvolvido", "classificacao_key": "desenvolvido", "criterios": [{"ordem": 1, "ordem_str": "1º", "nome": "Possui Educação Empreendedora em mais de 70% do município", "identificador": "educacao_70_porcento", "peso": 13, "atendido": true, "pontos": 13}, {"ordem": 2, "ordem_str": "2º", "nome": "Parceria com Secretária Municipal de Educação", "identificador": "parceria_secretaria_educacao", "peso": 12, "atendido": true, "pontos": 12}, {"ordem": 3, "ordem_str": "3º", "nome": "JEPP no município", "identificador": "jepp_municipio", "peso": 11, "atendido": true, "pontos": 11}, {"ordem": 4, "ordem_str": "4º", "nome": "Produto Despertar implantado", "identificador": "produto_despertar", "peso": 10, "atendido": true, "pontos": 10}, {"ordem": 5, "ordem_str": "5º", "nome": "Parceria com superintendência de ensino", "identificador": "parceria_superintendencia", "peso": 9, "atendido": true, "pontos": 9}, {"ordem": 6, "ordem_str": "6º", "nome": "Parceria com instituição de ensino superior", "identificador": "parceria_ies", "peso": 8, "atendido": true, "pontos": 8}, {"ordem": 7, "ordem_str": "7º", "nome": "Rede Aqui Tem Sebrae", "identificador": "rede_aqui_tem_sebrae", "peso": 7, "atendido": true, "pontos": 7}, {"ordem": 8, "ordem_str": "8º", "nome": "Convênio / termo de parceria", "identificador": "convenio_parceria", "peso": 6, "atendido": true, "pontos": 6}, {"ordem": 9, "ordem_str": "9º", "nome": "Comitê e ações conjuntas", "identificador": "comite_acoes_conjuntas", "peso": 5, "atendido": false, "pontos": 0}, {"ordem": 10, "ordem_str": "10º", "nome": "Empresa simulada", "identificador": "empresa_simulada", "peso": 4, "atendido": false, "pontos": 0}, {"ordem": 11, "ordem_str": "11º", "nome": "Sistema de Ensino Escola do Sebrae (Cursos Técnicos)", "identificador": "escola_sebrae", "peso": 3, "atendido": false, "pontos": 0}, {"ordem": 12, "ordem_str": "12º", "nome": "Parceria com Cooperativa de Crédito", "identificador": "cooperativa_credito", "peso": 2, "atendido": true, "pontos": 2}, {"ordem": 13, "ordem_str": "13º", "nome": "Lei da educação empreendedora", "identificador": "lei_educacao_empreendedora", "peso": 1, "atendido": true, "pontos": 1}], "instrumentos_aplicados": ["encontro_mediado", "material_didatico", "oficina"], "pontuacao_instrumentos": 30, "destaque_instrumentos": true}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
    request_code = EXCLUDED.request_code,
    nome = EXCLUDED.nome,
    regional = EXCLUDED.regional,
    status = EXCLUDED.status,
    updated_at = TIMEZONE('utc'::text, NOW());
