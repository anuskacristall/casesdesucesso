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
