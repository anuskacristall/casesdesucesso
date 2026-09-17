// ==========================================================================
// SUPABASE CLOUD DATABASE CONFIGURATION
// ==========================================================================
// Se quiser usar banco de dados na nuvem (Supabase) para múltiplos usuários:
// Preencha as duas constantes abaixo com os dados do seu projeto Supabase.
// Se deixadas vazias, a plataforma usará automaticamente o LocalStorage do navegador.
// O backend gerencia a conexão e esconde as chaves do Supabase.
// O cliente JavaScript se comunica de forma segura apenas com a API local (/api/cases).
let isCloudMode = false;

// ==========================================================================
// CONFIGURATION & SEED DATA
// ==========================================================================

const COLOR_MAP = {
  "CentroOeste": "#F97316",
  "Centro": "#10B981",
  "Noroeste": "#8B5CF6",
  "Triângulo": "#06B6D4",
  "Norte": "#F59E0B",
  "Rio Doce": "#EF4444",
  "Sul": "#3B82F6",
  "Zona da Mata": "#EC4899",
  "Jequitinhonha/Mucuri": "#84CC16"
};

const REGIONAL_NAMES = {
  "CentroOeste": "Centro-Oeste",
  "Centro": "Centro",
  "Noroeste": "Noroeste",
  "Triângulo": "Triângulo",
  "Norte": "Norte",
  "Rio Doce": "Rio Doce",
  "Sul": "Sul",
  "Zona da Mata": "Zona da Mata",
  "Jequitinhonha/Mucuri": "Jequitinhonha/Mucuri"
};

const SEED_CASES = [
  {
    id: "seed-1",
    titulo: "Lixeiras Inteligentes IoT",
    descricao: "Implantação de práticas de economia circular e sustentabilidade ecológica de forma interdisciplinar na rede de ensino de Belo Horizonte.",
    municipio: "Belo Horizonte",
    regional: "Centro",
    mr: "MR Belo Horizonte",
    escola: "Escola Estadual Sebrae",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    hasStudentCase: true,
    studentSummary: "Startup Escolar de Reciclagem Inteligente, desenvolvendo lixeiras IoT que geram pontos trocáveis por materiais escolares na cantina.",
    studentContact: "(31) 98765-1111",
    hasCoop: true,
    coopSummary: "Parceria com Sicoob para capacitação em finanças pessoais, abertura de contas poupança didáticas e patrocínio da feira de empreendedorismo da escola.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei Municipal 12.345 que institui a Semana Municipal da Educação Empreendedora e destina verbas de incentivo a projetos escolares.",
    hasCommittee: true,
    committeeSummary: "Reuniões bimestrais de alinhamento estratégico entre a Secretaria Municipal de Educação, Superintendência Regional de Ensino e Sebrae.",
    hasIes: true,
    iesSummary: "Estudantes de administração da UFMG atuam como mentores dos alunos do ensino médio no desenvolvimento dos planos de negócios.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-2",
    tipoCase: "professor",
    titulo: "Horta Pedagógica e Alimentação Consciente",
    descricao: "Metodologia pedagógica interdisciplinar integrando ciências da natureza, nutrição e empreendedorismo por meio do cultivo agroecológico escolar.",
    municipio: "Pouso Alegre",
    regional: "Sul",
    mr: "MR Pouso Alegre",
    escola: "Colégio Municipal Dr. Ângelo",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: true,
    coopSummary: "Sicredi ministra oficinas mensais de cooperativismo de crédito e educação financeira aos docentes e comunidade.",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Dispõe sobre a inclusão de temas de empreendedorismo na grade complementar das escolas locais. Lei aprovada em 2024.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Mentoria acadêmica com a Univas (Universidade do Vale do Sapucaí) integrando projetos de sustentabilidade social.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-3",
    titulo: "App Conecta Vizinhança",
    descricao: "Iniciativa de inovação social com foco em solidariedade intergeracional e desenvolvimento de competências tecnológicas e de programação em Uberlândia.",
    municipio: "Uberlândia",
    regional: "Triângulo",
    mr: "MR Uberlândia",
    escola: "Escola Municipal Messias Pedreiro",
    tecnicoNome: "Fernando Cruz",
    tecnicoEmail: "fernando.cruz@sebraemg.com.br",
    tecnicoContato: "(34) 99122-3344",
    hasStudentCase: true,
    studentSummary: "Desenvolvimento de aplicativo móvel 'Apoio Próximo' para conectar vizinhos e jovens a idosos necessitando de tarefas domésticas simples.",
    studentContact: "@apoio_proximo_udl",
    hasCoop: false,
    coopSummary: "",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de Incentivo à Inovação e Empreendedorismo de Uberlândia, abrangendo a difusão da cultura empreendedora na rede pública.",
    hasCommittee: true,
    committeeSummary: "Comitê conjunto de inovação tecnológica na educação escolar, articulando SEBRAE, prefeitura e incubadoras locais.",
    hasIes: true,
    iesSummary: "Mentoria e laboratórios de informática cedidos pela Universidade Federal de Uberlândia (UFU).",
    jeppStatus: "Sim"
  },
  {
    id: "seed-4",
    tipoCase: "professor",
    titulo: "Metodologia STEAM com Química Sustentável",
    descricao: "Prática pedagógica docente inovadora voltada à contextualização química e sustentabilidade prática: transformação de óleos residuais em sabão ecológico e bioinsumos.",
    municipio: "Montes Claros",
    regional: "Norte",
    mr: "MR Montes Claros",
    escola: "Instituto Federal do Norte de Minas (IFNMG)",
    tecnicoNome: "Clara Rocha",
    tecnicoEmail: "clara.rocha@sebraemg.com.br",
    tecnicoContato: "(38) 99911-2233",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: true,
    coopSummary: "Apoio da Sicoob Credinor, fomentando dinâmicas docentes de cooperativismo e simulação de microcrédito.",
    edu70: "nao",
    hasLaw: false,
    lawSummary: "",
    hasCommittee: true,
    committeeSummary: "Ações conjuntas para disseminação do empreendedorismo integrado ao ensino técnico profissionalizante da região.",
    hasIes: true,
    iesSummary: "Projeto de extensão conjunto com a Unimontes para análises químicas de segurança do sabão produzido.",
    jeppStatus: "Parcial"
  },
  {
    id: "seed-5",
    titulo: "Doces Saudáveis de Frutas Locais",
    descricao: "Projeto de capacitação em desidratação de frutas locais e produção de alimentos gourmet saudáveis no Vale do Aço.",
    municipio: "Ipatinga",
    regional: "Rio Doce",
    mr: "MR Ipatinga",
    escola: "Escola Estadual Alberto Giovannini",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    hasStudentCase: true,
    studentSummary: "Produção de Doces Saudáveis gourmet com frutas locais desidratadas, servidos como alternativa nutritiva na escola.",
    studentContact: "(31) 97555-0000",
    hasCoop: true,
    coopSummary: "Capacitações em gestão empresarial promovidas pela cooperativa local Sicoob Cosmipa.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei n° 5.221/2023 - Institui a Educação Empreendedora e Financeira nas escolas municipais de Ipatinga.",
    hasCommittee: true,
    committeeSummary: "Fórum de Educação Empreendedora do Vale do Aço, unindo SEBRAE, Superintendência Estadual e Secretarias Municipais.",
    hasIes: true,
    iesSummary: "Alinhamento com o Centro Universitário de Leste de Minas (Unileste) em projetos de inovação social.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-6",
    tipoCase: "professor",
    titulo: "Gamificação Pedagógica de História Regional",
    descricao: "Metodologia docente de ensino de história e finanças por meio de jogos de tabuleiro didáticos desenvolvidos por educadores para dinamizar a sala de aula.",
    municipio: "Divinópolis",
    regional: "CentroOeste",
    mr: "MR Divinópolis",
    escola: "Escola Estadual Joaquim Nabuco",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: true,
    coopSummary: "Patrocínio do Sicoob Divicred para impressão física dos materiais didáticos pedagógicos.",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Lei municipal determina incentivos fiscais para empresas locais que patrocinarem projetos de empreendedorismo juvenil escolar.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Mentoria de design instrucional e regras de jogos com docentes da UEMG Divinópolis.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-7",
    titulo: "Costura Criativa e Reciclagem",
    descricao: "Cooperativa de costura focada na reciclagem de retalhos descartados por indústrias têxteis locais, promovendo a moda circular.",
    municipio: "Juiz de Fora",
    regional: "Zona da Mata",
    mr: "MR Juiz de Fora",
    escola: "Colégio de Aplicação João XXIII",
    tecnicoNome: "Beatriz Neves",
    tecnicoEmail: "beatriz.neves@sebraemg.com.br",
    tecnicoContato: "(32) 99988-1122",
    hasStudentCase: true,
    studentSummary: "Cooperativa Escolar de Costura Criativa, reciclando retalhos e restos de tecidos descartados pela indústria polo têxtil de Juiz de Fora.",
    studentContact: "@eco_costura_joaoxxiii",
    hasCoop: false,
    coopSummary: "",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de inserção de conceitos de economia circular e empreendedorismo social no currículo básico do município.",
    hasCommittee: true,
    committeeSummary: "Parceria direta com a Superintendência Regional de Ensino de Juiz de Fora e SEBRAE para capacitação docente continuada.",
    hasIes: true,
    iesSummary: "Apoio metodológico da Faculdade de Serviço Social da UFJF em cooperativismo de base.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-8",
    titulo: "Mini-Agência de Ecoturismo",
    descricao: "Mini-agência escolar focada na valorização e mapeamento do potencial turístico, cultural e ecológico do Vale do Mucuri.",
    municipio: "Teófilo Otoni",
    regional: "Jequitinhonha/Mucuri",
    mr: "MR Teófilo Otoni",
    escola: "Escola Municipal Pastor Hollerbach",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    hasStudentCase: true,
    studentSummary: "Mini-agência de Ecoturismo de Teófilo Otoni, desenvolvendo roteiros virtuais e cartilhas físicas sobre a rota das pedras preciosas.",
    studentContact: "turismojovem.to@gmail.com",
    hasCoop: true,
    coopSummary: "Oficinas de poupança cooperativa ministradas por técnicos do Sicoob Credimonte.",
    edu70: "nao",
    hasLaw: false,
    lawSummary: "",
    hasCommittee: true,
    committeeSummary: "Ações coordenadas de valorização cultural e economia criativa com a Secretaria de Cultura e SEBRAE.",
    hasIes: true,
    iesSummary: "Mentoria do departamento de Turismo e Geografia da Universidade Federal dos Vales do Jequitinhonha e Mucuri (UFVJM).",
    jeppStatus: "Sim"
  },
  {
    id: "seed-9",
    titulo: "Mel Orgânico e Apicultura Escolar",
    descricao: "Projeto de apicultura pedagógica e cooperativa escolar de Paracatu, aliando ecologia e empreendedorismo rural.",
    municipio: "Paracatu",
    regional: "Noroeste",
    mr: "MR Paracatu",
    escola: "Escola Estadual Afonso Roquete",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    hasStudentCase: true,
    studentSummary: "Produção de Mel Orgânico e Velas de Cera de Abelha aromatizadas, explorando o cooperativismo apícola entre alunos.",
    studentContact: "(38) 99222-0011",
    hasCoop: true,
    coopSummary: "Financiamento coletivo estruturado com cooperativas de crédito agropecuárias locais para aquisição das colmeias didáticas.",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Lei Municipal autoriza o uso de áreas públicas ociosas para hortas e apiários comunitários escolares com fins pedagógicos.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Mentoria técnica em agronomia da Faculdade FINOM.",
    jeppStatus: "Parcial"
  },
  {
    id: "seed-10",
    tipoCase: "professor",
    titulo: "Prática Docente de Economia Circular Escolar",
    descricao: "Projeto pedagógico interdisciplinar integrando matemática, artes e sustentabilidade a partir da cultura do reaproveitamento e oficinas de moda circular.",
    municipio: "Belo Horizonte",
    regional: "Centro",
    mr: "MR Belo Horizonte",
    escola: "Escola Municipal Fernando Dias",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: false,
    coopSummary: "",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei Municipal 12.345 que institui o Programa Municipal de Incentivo ao Empreendedorismo de Alunos.",
    hasCommittee: true,
    committeeSummary: "Integrado ao plano de ação de Belo Horizonte juntamente com a Superintendência Escolar Metropolitana.",
    hasIes: false,
    iesSummary: "",
    jeppStatus: "Sim"
  },
  {
    id: "seed-11",
    titulo: "Clube Escolar de Robótica Agrícola",
    descricao: "Desenvolvimento de pequenos sensores automatizados e protótipos de irrigação sustentável com sucata eletrônica por alunos de Uberaba.",
    escola: "Escola Estadual Professor Chaves",
    municipio: "Uberaba",
    regional: "Triângulo",
    mr: "MR Uberaba",
    tecnicoNome: "Fernando Cruz",
    tecnicoEmail: "fernando.cruz@sebraemg.com.br",
    tecnicoContato: "(34) 99122-3344",
    hasStudentCase: true,
    studentSummary: "Desenvolvimento de robôs irrigadores solares de baixo custo para hortas de pequenos produtores da região.",
    studentContact: "robotica.chaves@gmail.com",
    hasCoop: true,
    coopSummary: "Apoio financeiro da Sicoob Credimed para compra de kits eletrônicos e componentes solares.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de Educação Empreendedora e Tecnológica municipal, incentivando projetos integrados de ciência de dados e campo nas escolas públicas.",
    hasCommittee: true,
    committeeSummary: "Fórum de Integração Agro-Tecnológica do Triângulo Mineiro.",
    hasIes: true,
    iesSummary: "Mentoria de professores e universitários do curso de Engenharia Agrícola da UFTM.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-12",
    tipoCase: "professor",
    titulo: "Etnopedagogia e Empreendedorismo Cultural",
    descricao: "Prática pedagógica docente de valorização do patrimônio imaterial, línguas nativas e resgate da ancestralidade indígena do Vale do Mucuri aliada à economia criativa escolar.",
    escola: "Escola Estadual Xucuru Kariri",
    municipio: "Teófilo Otoni",
    regional: "Jequitinhonha/Mucuri",
    mr: "MR Teófilo Otoni",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: false,
    coopSummary: "",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Lei Municipal de Proteção e Fomento ao Patrimônio Histórico, Imaterial e Empreendedorismo de Comunidades Tradicionais.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Cooperação cultural e pedagógica com a UFVJM.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-13",
    titulo: "Mini-Indústria de Sabores do Cerrado",
    descricao: "Produção cooperativa de doces, geleias e panificações utilizando frutos típicos do Cerrado, promovendo o beneficiamento alimentar rural e empreendedorismo sustentável.",
    escola: "Escola Estadual Dona Guiomar de Melo",
    municipio: "Patos de Minas",
    regional: "Noroeste",
    mr: "MR Patos de Minas",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    hasStudentCase: true,
    studentSummary: "Geleias e compotas Gourmet de Baru e Pequi colhidos de forma sustentável, comercializados em feiras regionais.",
    studentContact: "@saboresdocerrado_patos",
    hasCoop: true,
    coopSummary: "Apoio e oficinas de cooperativismo do Sicoob Credipatos.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Institui o Programa Municipal de Apoio ao Pequeno Produtor Escolar e Cooperativas Agrícolas Juvenis.",
    hasCommittee: true,
    committeeSummary: "Comitê de Desenvolvimento Econômico e Agrícola de Patos de Minas.",
    hasIes: true,
    iesSummary: "Mentoria técnica em Engenharia de Alimentos da FPM (Faculdade de Patos de Minas).",
    jeppStatus: "Sim"
  },
  {
    id: "seed-14",
    titulo: "Fábrica Jovem de Velas Ecológicas",
    descricao: "Desenvolvimento de velas de cera de soja e aromas naturais da Mata Atlântica, reduzindo o uso de parafinas derivadas do petróleo.",
    escola: "Escola Estadual Professor Mário Casassanta",
    municipio: "São João del-Rei",
    regional: "CentroOeste",
    mr: "MR São João del-Rei",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    hasStudentCase: true,
    studentSummary: "Startup de velas aromatizadas e terapêuticas feitas de cera vegetal de soja biodegradável e essências naturais.",
    studentContact: "velasecojovem.sjdr@gmail.com",
    hasCoop: true,
    coopSummary: "Crédito cooperativo mirim viabilizado pela cooperativa de crédito Sicoob Credishow.",
    edu70: "nao",
    hasLaw: false,
    lawSummary: "",
    hasCommittee: true,
    committeeSummary: "Grupo de fomento de empreendedorismo estudantil integrado com a prefeitura.",
    hasIes: true,
    iesSummary: "Suporte laboratorial e mentoria química com a UFSJ (Universidade Federal de São João del-Rei).",
    jeppStatus: "Parcial"
  },
  {
    id: "seed-15",
    titulo: "Laboratório de Economia Circular de Papel",
    descricao: "Oficina escolar de reciclagem e produção de papéis artesanais a partir de aparas de papelão e embalagens coletadas em comércios de Varginha.",
    escola: "Escola Estadual Deputado Domingos de Figueiredo",
    municipio: "Varginha",
    regional: "Sul",
    mr: "MR Varginha",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    hasStudentCase: true,
    studentSummary: "Produção de agendas, cadernos e cartões artesanais feitos de papel reciclado e sementes de flores incorporadas.",
    studentContact: "papelsemente.jovem@gmail.com",
    hasCoop: true,
    coopSummary: "Parceria com o Sicredi para confecção de materiais de papelaria corporativa ecológica para a cooperativa.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de incentivo à reciclagem e fomento da educação socioambiental cooperativa.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Oficinas de design e marketing com estudantes do CEFET-MG Varginha.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-16",
    tipoCase: "professor",
    titulo: "Design Sustentável e Upcycling na Educação",
    descricao: "Metodologia docente integrando formação profissionalizante e design ecológico, capacitando turmas na transformação de resíduos da indústria têxtil e de confecção.",
    escola: "Escola Estadual Professor Nelson de Sena",
    municipio: "Governador Valadares",
    regional: "Rio Doce",
    mr: "MR Governador Valadares",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: false,
    coopSummary: "",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Institui o Plano Municipal de Empreendedorismo de Valadares voltado ao desenvolvimento sustentável da juventude.",
    hasCommittee: true,
    committeeSummary: "Comitê de fomento educacional e social do Rio Doce.",
    hasIes: true,
    iesSummary: "Mentoria de administração e marketing digital com a UFJF-GV.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-17",
    titulo: "Horta Hidropônica Inteligente",
    descricao: "Projeto de agricultura urbana e cultivo sustentável automatizado usando hidroponia vertical e IoT na rede pública de Betim.",
    escola: "Escola Estadual Virgílio de Melo Franco",
    municipio: "Betim",
    regional: "Centro",
    mr: "MR Belo Horizonte",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    hasStudentCase: true,
    studentSummary: "Produção hidropônica de folhosas em sistemas verticais controlados por sensores que economizam 90% de água.",
    studentContact: "contato.hidroponiabetim@gmail.com",
    hasCoop: true,
    coopSummary: "Investimento inicial do Sicoob Crediminas para compra das bombas de água e mangueiras.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de Fomento à Agricultura Familiar Escolar e Incentivo ao Desenvolvimento de Práticas Ecológicas nas Escolas.",
    hasCommittee: true,
    committeeSummary: "Comitê de Segurança Alimentar e Nutricional Escolar de Betim.",
    hasIes: true,
    iesSummary: "Consultoria agronômica com bolsistas da PUC Minas.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-18",
    titulo: "Fábrica Jovem de Briquetes Ecológicos",
    descricao: "Produção de biomassa compactada (briquetes) para lareiras e churrasqueiras a partir de serragem descartada por serrarias e marcenarias locais.",
    escola: "Escola Estadual Dom João Antônio dos Santos",
    municipio: "Diamantina",
    regional: "Jequitinhonha/Mucuri",
    mr: "MR Diamantina",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    hasStudentCase: true,
    studentSummary: "Briquetes ecológicos de alta queima fabricados de serragem e jornais reciclados, vendidos como alternativa ao carvão vegetal tradicional.",
    studentContact: "briquetesdiamantina@escola.com",
    hasCoop: false,
    coopSummary: "",
    edu70: "nao",
    hasLaw: false,
    lawSummary: "",
    hasCommittee: true,
    committeeSummary: "Grupo de fomento de educação ambiental e empreendedorismo regional.",
    hasIes: true,
    iesSummary: "Suporte técnico laboratorial e testes de queima com a UFVJM.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-19",
    titulo: "Startup Escolar Eco-Copos",
    descricao: "Desenvolvimento e fabricação de copos biodegradáveis a partir de fibras da casca de coco e mandioca, reduzindo plásticos de uso único.",
    escola: "Escola Estadual Professor Nelson de Sena",
    municipio: "Governador Valadares",
    regional: "Rio Doce",
    mr: "MR Governador Valadares",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    hasStudentCase: true,
    studentSummary: "Design e manufatura artesanal de copos descartáveis biodegradáveis feitos com fibras vegetais orgânicas, utilizados em eventos escolares.",
    studentContact: "@ecocopovad",
    hasCoop: true,
    coopSummary: "Linha de financiamento cooperativo para a prensa térmica estudantil com Sicoob AC Credi.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de redução gradativa de copos descartáveis na rede de ensino pública.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Estudos de degradação e análises biológicas com a UNIVALE.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-20",
    titulo: "Cooperativa Jovem de Games de Educação",
    descricao: "Criação de jogos eletrônicos interativos para alfabetização matemática e financeira nas séries iniciais do ensino fundamental de Divinópolis.",
    escola: "Escola Estadual Dona Antonieta Fonseca",
    municipio: "Divinópolis",
    regional: "CentroOeste",
    mr: "MR Divinópolis",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    hasStudentCase: true,
    studentSummary: "Equipe de estudantes desenvolvedores de jogos mobile focados em finanças para crianças de 6 a 9 anos.",
    studentContact: "jogoseducasul@gmail.com",
    hasCoop: true,
    coopSummary: "Apoio institucional e testes práticos de usabilidade com filhos de cooperados do Sicoob.",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Política Pública de Fomento a Jogos Digitais e Ferramentas Pedagógicas do Centro-Oeste.",
    hasCommittee: true,
    committeeSummary: "Comitê de Inovação Aberta Escolar do Sebrae Divinópolis.",
    hasIes: true,
    iesSummary: "Oficina de programação de jogos cedida pelo campus da UEMG.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-21",
    tipoCase: "professor",
    titulo: "Compostagem Pedagógica e Ciências do Solo",
    descricao: "Projeto docente interdisciplinar articulando biologia, ciências agrícolas e sustentabilidade alimentar por meio de polo escolar de compostagem e reciclagem de resíduos orgânicos.",
    escola: "Escola Municipal Marcolino de Barros",
    municipio: "Patos de Minas",
    regional: "Noroeste",
    mr: "MR Patos de Minas",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    hasStudentCase: false,
    studentSummary: "",
    studentContact: "",
    hasCoop: true,
    coopSummary: "Apoio e patrocínio das embalagens de adubo ecológicas promovidos pela cooperativa local.",
    edu70: "sim",
    hasLaw: true,
    lawSummary: "Lei de Compostagem Escolar e Resíduos Sólidos Municipais.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Análise laboratorial de nitrogênio e fósforo no composto orgânico com a FPM.",
    jeppStatus: "Sim"
  },
  {
    id: "seed-22",
    titulo: "Clube de Sabores Gourmet Saudáveis",
    descricao: "Oficinas estudantis de culinária saudável e reaproveitamento integral de cascas e talos, estimulando a alimentação consciente e finanças culinárias.",
    escola: "Escola Estadual Padre Alberto Fuger",
    municipio: "Campo Belo",
    regional: "Sul",
    mr: "MR Campo Belo",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    hasStudentCase: true,
    studentSummary: "Produção de geleias gourmet feitas de casca de maracujá e talos de abacaxi, vendidas em potes reutilizados higienizados.",
    studentContact: "culinariajovem.fuger@gmail.com",
    hasCoop: false,
    coopSummary: "",
    edu70: "nao",
    hasLaw: false,
    lawSummary: "",
    hasCommittee: true,
    committeeSummary: "Ações estratégicas de promoção da alimentação sustentável intersetorial.",
    hasIes: true,
    iesSummary: "Oficinas de microbiologia e conservação com acadêmicos de nutrição.",
    jeppStatus: "Sim"
  }
];

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================

let map = null;
let tileLayer = null;
let cases = [];
let markersLayer = null;
let currentRegisterType = 'professor'; // 'professor' or 'estudante'
const selectedLocationFilters = new Map(); // id -> { id, type, name, val, regional, lat, lng }

// ==========================================================================
// SUPABASE DATABASE COLUMN MAPPING (PORTUGUESE COLUMN NAMES)
// ==========================================================================

function mapDatabaseToApp(dbItem) {
  if (!dbItem) return null;
  // If dbItem.estudante_possui is false, it's explicitly professor
  const isEstudante = dbItem.tipo_case === 'estudante' || (dbItem.tipo_case !== 'professor' && (dbItem.estudante_possui === true || (!('estudante_possui' in dbItem) && dbItem.estudante_resumo && dbItem.estudante_resumo.trim() && !dbItem.estudante_resumo.startsWith("Professor:"))));
  const inferredType = isEstudante ? 'estudante' : 'professor';
  
  let profNome = dbItem.professor_nome || "";
  let profEmail = dbItem.professor_email || "";
  let profTel = dbItem.professor_telefone || "";
  
  if (!profNome && dbItem.estudante_resumo && dbItem.estudante_resumo.startsWith("Professor:")) {
    const match = dbItem.estudante_resumo.match(/^Professor:\s*([^(]+)(?:\(([^ -]+)?\s*-\s*([^)]+)?\))?/);
    if (match) {
      profNome = match[1] ? match[1].trim() : "";
      profEmail = match[2] ? match[2].trim() : "";
      profTel = match[3] ? match[3].trim() : "";
    }
  }

  return {
    id: dbItem.id,
    titulo: dbItem.titulo_projeto || "",
    descricao: dbItem.descricao_geral || "",
    municipio: dbItem.municipio || "",
    regional: dbItem.regional || "",
    mr: dbItem.microrregiao_mr || "",
    escola: dbItem.escola_instituicao || "",
    lat: dbItem.latitude,
    lng: dbItem.longitude,
    tecnicoNome: dbItem.tecnico_nome || "",
    tecnicoEmail: dbItem.tecnico_email || "",
    tecnicoContato: dbItem.tecnico_telefone || "",
    
    // Legacy compatibility
    hasStudentCase: inferredType === 'estudante',
    studentSummary: dbItem.estudante_resumo || "",
    studentContact: dbItem.estudante_contato || "",
    
    // Type and contact fields
    tipoCase: inferredType,
    estudanteNome: dbItem.estudante_nome || "",
    estudanteEmail: dbItem.estudante_email || "",
    estudanteTelefone: dbItem.estudante_telefone || dbItem.estudante_contato || "",
    
    professorNome: profNome,
    professorEmail: profEmail,
    professorTelefone: profTel,
    
    hasCoop: dbItem.cooperativa_possui || false,
    coopSummary: dbItem.cooperativa_resumo || "",
    edu70: dbItem.municipio_ee_70 || "nao",
    hasLaw: dbItem.lei_possui || false,
    lawSummary: dbItem.lei_resumo || "",
    hasCommittee: dbItem.comite_possui || false,
    committeeSummary: dbItem.comite_resumo || "",
    hasIes: dbItem.ies_possui || false,
    iesSummary: dbItem.ies_resumo || "",
    jeppStatus: dbItem.status_jepp || "Não",
    status: dbItem.status || "approved",
    request_code: dbItem.request_code || ""
  };
}

function mapAppToDatabase(appItem) {
  if (!appItem) return null;
  const isEstudante = appItem.tipoCase === 'estudante';
  let resumo = appItem.studentSummary || "";
  let contato = isEstudante ? (appItem.studentContact || appItem.estudanteTelefone || "") : (appItem.professorTelefone || "");
  
  if (!isEstudante && (appItem.professorNome || appItem.professorEmail || appItem.professorTelefone)) {
    resumo = `Professor: ${appItem.professorNome || ''} (${appItem.professorEmail || ''} - ${appItem.professorTelefone || ''})`;
  }
  
  return {
    id: appItem.id,
    titulo_projeto: appItem.titulo || "",
    descricao_geral: appItem.descricao || "",
    municipio: appItem.municipio || "",
    regional: appItem.regional || "",
    microrregiao_mr: appItem.mr || "",
    escola_instituicao: appItem.escola || "",
    latitude: appItem.lat,
    longitude: appItem.lng,
    tecnico_nome: appItem.tecnicoNome || "",
    tecnico_email: appItem.tecnicoEmail || "",
    tecnico_telefone: appItem.tecnicoContato || "",
    estudante_possui: isEstudante,
    estudante_resumo: resumo,
    estudante_contato: contato,
    cooperativa_possui: appItem.hasCoop || false,
    cooperativa_resumo: appItem.coopSummary || "",
    municipio_ee_70: appItem.edu70 || "nao",
    lei_possui: appItem.hasLaw || false,
    lei_resumo: appItem.lawSummary || "",
    comite_possui: appItem.hasCommittee || false,
    comite_resumo: appItem.committeeSummary || "",
    ies_possui: appItem.hasIes || false,
    ies_resumo: appItem.iesSummary || "",
    status_jepp: appItem.jeppStatus || "Não"
  };
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

// ==========================================================================
// API & NETWORK HELPERS
// ==========================================================================


function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getApiUrl(path) {
  if (window.location.protocol === "file:") {
    return `http://localhost:8001${path}`;
  }
  return path;
}

// ==========================================================================
// TELEPHONE MASK & VALIDATION (DDD ENTRE PARÊNTESES: (XX) XXXXX-XXXX)
// ==========================================================================

function formatPhoneNumber(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function isValidPhone(value) {
  if (!value) return false;
  const digits = String(value).replace(/\D/g, "");
  // Telefone no Brasil: 10 dígitos (fixo) ou 11 dígitos (móvel) com DDD
  if (digits.length < 10 || digits.length > 11) return false;
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (isNaN(ddd) || ddd < 11 || ddd > 99) return false;
  // Celular com 11 dígitos começa com 9 após o DDD
  if (digits.length === 11 && digits.charAt(2) !== '9') return false;
  return true;
}

function setupPhoneInputs() {
  const phoneInputIds = [
    "municipality-contact-phone",
    "form-tecnico-contato",
    "form-professor-contato",
    "form-estudante-contato"
  ];

  phoneInputIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.setAttribute("maxlength", "15"); // Formato: (XX) XXXXX-XXXX
    el.setAttribute("placeholder", "(31) 98888-7777");

    el.addEventListener("input", () => {
      el.value = formatPhoneNumber(el.value);
    });

    el.addEventListener("blur", () => {
      const val = el.value.trim();
      if (val && !isValidPhone(val)) {
        el.style.borderColor = "var(--danger, #ef4444)";
        el.style.boxShadow = "0 0 0 2px rgba(239, 68, 68, 0.2)";
      } else {
        el.style.borderColor = "";
        el.style.boxShadow = "";
      }
    });
  });
}

// ==========================================================================
// CÓDIGO SEQUENCIAL DE 5 DÍGITOS DE 10000 EM 10000 (#10000, #20000...)
// ==========================================================================

function generateNextRequestCode() {
  let highest = 0;
  try {
    const localMun = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    const localCases = JSON.parse(localStorage.getItem("sebrae_success_cases") || "[]");
    
    [...localMun, ...localCases, ...(cases || [])].forEach(item => {
      const code = item.request_code || item.requestCode || "";
      const match = String(code).match(/#?(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > highest) {
          highest = num;
        }
      }
    });
  } catch (e) {
    console.warn("Aviso ao calcular próximo código de solicitação:", e);
  }
  const next = highest >= 10000 ? Math.floor(highest / 10000 + 1) * 10000 : 10000;
  return `#${next}`;
}

async function init() {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
  // Set up phone masks and validation
  setupPhoneInputs();
  
  // Load data
  await initData();
  
  // Initialize Map
  initMap();
  
  // Initialize Theme
  initTheme();
  
  // Bind Event Listeners
  bindEvents();
  
  // Populate statistics and legend
  renderDashboard();

  // Run Authentication check
  checkAuth();
}

if (document.readyState !== "loading") {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}

async function initData() {
  updateDbStatus("connecting");
  
  const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
  const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";

  // 1. First attempt direct connection to Supabase Cloud REST API
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/cases?select=*`, {
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        isCloudMode = true;
        if (Array.isArray(data) && data.length > 0) {
          cases = data.map(mapDatabaseToApp);
        } else {
          cases = [...SEED_CASES];
        }
        updateDbStatus("online");
        return;
      }
    } catch (err) {
      console.warn("Conexão direta com o Supabase falhou, tentando backend proxy...", err);
    }
  }

  // 2. Next attempt via local/remote server proxy (which handles Supabase Cloud SSL bypass)
  const proxyEndpoints = [
    getApiUrl("/api/cases"),
    "http://localhost:8001/api/cases",
    "/api/cases"
  ];

  for (const endpoint of proxyEndpoints) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        isCloudMode = true;
        if (Array.isArray(data) && data.length > 0) {
          cases = data.map(mapDatabaseToApp);
        } else {
          cases = [...SEED_CASES];
        }
        updateDbStatus("online");
        return;
      }
    } catch (e) {
      // Try next endpoint
    }
  }

  // 3. Fallback to LocalStorage
  isCloudMode = false;
  updateDbStatus("local", "Operando em modo local offline");
  loadLocalStorageFallback();
  return;
}

function loadLocalStorageFallback() {
  const stored = localStorage.getItem("sebrae_success_cases");
  if (stored) {
    try {
      cases = JSON.parse(stored);
      if (!Array.isArray(cases) || cases.length === 0) {
        cases = [...SEED_CASES];
      } else {
        // If stored data has 0 professor cases, update with SEED_CASES so professor examples are available
        const hasProfessor = cases.some(c => c.tipoCase === "professor");
        if (!hasProfessor) {
          cases = [...SEED_CASES];
        }
      }
    } catch (e) {
      cases = [...SEED_CASES];
    }
  } else {
    cases = [...SEED_CASES];
  }
  
  // Guarantee that all loaded local cases have a valid tipoCase property
  cases = cases.map(item => {
    if (!item.tipoCase) {
      item.tipoCase = (item.hasStudentCase || (item.studentSummary && item.studentSummary.trim())) ? 'estudante' : 'professor';
    }
    return item;
  });
  
  localStorage.setItem("sebrae_success_cases", JSON.stringify(cases));
}

function updateDbStatus(status, errorMsg = "") {
  const badge = document.getElementById("db-status-badge");
  if (!badge) return;
  
  badge.className = "db-status-badge " + (status === "online" ? "cloud-online" : status === "connecting" ? "cloud-connecting" : "local");
  
  const icon = badge.querySelector("i");
  const text = badge.querySelector("span");
  
  if (status === "online") {
    text.textContent = "Modo Nuvem";
    badge.title = "Conectado ao Banco de Dados na Nuvem (Supabase)";
  } else if (status === "connecting") {
    text.textContent = "Conectando...";
    badge.title = "Estabelecendo conexão com o Supabase...";
  } else {
    text.textContent = "Modo Local";
    badge.title = "Salvando dados localmente (LocalStorage)" + (errorMsg ? `. Erro: ${errorMsg}` : "");
  }
  
  // Refresh Lucide icons in the badge
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root: badge });
  }
}

function initTheme() {
  const body = document.body;
  body.classList.remove("dark-theme");
  body.classList.add("light-theme");
  updateMapTilesForTheme();
}

function initMap() {
  // Minas Gerais Central Coordinates: Lat -18.5, Lng -44.5. Zoom 7
  map = L.map("map", {
    zoomControl: true,
    maxZoom: 18,
    minZoom: 6
  }).setView([-18.5, -44.5], 7);

  markersLayer = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 40,
    iconCreateFunction: function(cluster) {
      const markers = cluster.getAllChildMarkers();
      // Collect all regionals in this cluster
      const regionals = markers.map(m => m.caseData ? m.caseData.regional : null).filter(Boolean);
      const uniqueRegionals = [...new Set(regionals)];
      
      // Determine cluster color: if all markers are same regional, use its color. Otherwise use Sebrae blue.
      let clusterColor = "var(--sebrae-blue)";
      if (uniqueRegionals.length === 1) {
        const reg = uniqueRegionals[0];
        clusterColor = COLOR_MAP[reg] || "var(--sebrae-blue)";
      }
      
      const childCount = cluster.getChildCount();
      return L.divIcon({
        html: `<div class="marker-cluster-custom" style="background-color: ${clusterColor}; box-shadow: 0 0 15px ${clusterColor};"><span>${childCount}</span></div>`,
        className: 'marker-cluster-container',
        iconSize: L.point(40, 40)
      });
    }
  }).addTo(map);

  // Re-render Lucide icons inside Leaflet popups dynamically on open
  map.on('popupopen', function(e) {
    const container = e.popup.getElement();
    if (container) {
      lucide.createIcons({
        attrs: {
          class: 'lucide-icon-popup'
        },
        nameAttr: 'data-lucide',
        root: container
      });
    }
  });

  updateMapTilesForTheme();
}

function updateMapTilesForTheme() {
  if (!map) return;
  
  const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
    
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }
  
  tileLayer = L.tileLayer(tileUrl, {
    attribution: 'Tiles &copy; Esri',
    className: 'gray-map-tiles',
    maxZoom: 19
  }).addTo(map);
}


// ==========================================================================
// UNIFIED LOCATION ENTITIES & FILTER HELPERS
// ==========================================================================

function getAllLocationEntities() {
  const list = [];
  
  // 1. Regionais SEBRAE (all 9)
  const regKeys = ["CentroOeste", "Centro", "Noroeste", "Triângulo", "Norte", "Rio Doce", "Sul", "Zona da Mata", "Jequitinhonha/Mucuri"];
  regKeys.forEach(k => {
    const label = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[k]) || k;
    list.push({
      id: `reg:${k}`,
      type: 'regional',
      name: label,
      val: k,
      searchStr: `${label} regional sebrae minas gerais`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      sub: "Regional SEBRAE"
    });
  });

  // 2. Microrregiões (MRs)
  const seenMrs = new Set();
  cases.forEach(c => {
    if (c.mr && c.mr.trim()) {
      let mrName = c.mr.trim();
      if (!mrName.startsWith("MR ") && !mrName.startsWith("MR")) mrName = `MR ${mrName}`;
      const normKey = mrName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!seenMrs.has(normKey)) {
        seenMrs.add(normKey);
        const regLabel = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[c.regional]) || c.regional || "";
        list.push({
          id: `mr:${normKey}`,
          type: 'mr',
          name: mrName,
          val: mrName,
          searchStr: `${mrName} microrregiao mr ${regLabel}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          sub: regLabel ? `Microrregião • ${regLabel}` : "Microrregião"
        });
      }
    }
  });

  // 3. Municípios from MUNICIPALITIES_DATABASE + loaded cases
  const seenMuns = new Set();
  if (window.MUNICIPALITIES_DATABASE) {
    Object.keys(window.MUNICIPALITIES_DATABASE).forEach(k => {
      const m = window.MUNICIPALITIES_DATABASE[k];
      const normKey = m.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!seenMuns.has(normKey)) {
        seenMuns.add(normKey);
        const regLabel = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[m.regional]) || m.regional || "";
        list.push({
          id: `mun:${normKey}`,
          type: 'municipio',
          name: m.name,
          val: normKey,
          lat: m.lat,
          lng: m.lng,
          regional: m.regional,
          searchStr: `${m.name} municipio cidade ${regLabel}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          sub: regLabel ? `Município • ${regLabel}` : "Município"
        });
      }
    });
  }

  cases.forEach(c => {
    if (c.municipio && c.municipio.trim()) {
      const normKey = c.municipio.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!seenMuns.has(normKey)) {
        seenMuns.add(normKey);
        const regLabel = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[c.regional]) || c.regional || "";
        list.push({
          id: `mun:${normKey}`,
          type: 'municipio',
          name: c.municipio.trim(),
          val: normKey,
          lat: c.lat,
          lng: c.lng,
          regional: c.regional,
          searchStr: `${c.municipio} municipio cidade ${regLabel}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
          sub: regLabel ? `Município • ${regLabel}` : "Município"
        });
      }
    }
  });

  return list;
}

function getActiveLocationFilters() {
  const selectedRegs = [];
  const selectedMrs = [];
  const selectedMuns = [];

  selectedLocationFilters.forEach(item => {
    if (item.type === 'regional') {
      selectedRegs.push(item.val);
    } else if (item.type === 'mr') {
      const norm = item.val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/^mr\s*/, "").trim();
      selectedMrs.push(norm);
    } else if (item.type === 'municipio') {
      selectedMuns.push(item.val);
    }
  });

  return { selectedRegs, selectedMrs, selectedMuns };
}

function isCaseMatchingFilters(item, selectedRegs, selectedMrs, selectedMuns, typeFilter) {
  // 1. Type filter
  if (typeFilter !== "All" && item.tipoCase !== typeFilter) {
    return false;
  }

  // 2. Location filter
  const hasLocationFilter = selectedRegs.length > 0 || selectedMrs.length > 0 || selectedMuns.length > 0;
  if (!hasLocationFilter) {
    return true;
  }

  const normCity = (item.municipio || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const normMr = (item.mr || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/^mr\s*/, "").trim();
  const regVal = item.regional;

  if (selectedRegs.length > 0 && selectedRegs.includes(regVal)) {
    return true;
  }

  if (selectedMrs.length > 0 && selectedMrs.some(sm => normMr.includes(sm) || sm.includes(normMr))) {
    return true;
  }

  if (selectedMuns.length > 0 && selectedMuns.includes(normCity)) {
    return true;
  }

  return false;
}

// ==========================================================================
// RENDER MARKERS & PLOTTING WITH JITTERING
// ==========================================================================

function renderMarkers() {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  
  const { selectedRegs, selectedMrs, selectedMuns } = getActiveLocationFilters();
  const typeFilter = document.getElementById("filter-type") ? document.getElementById("filter-type").value : "All";
  
  // Filter cases with unified location & type filter
  const filteredCases = cases.filter(item => 
    isCaseMatchingFilters(item, selectedRegs, selectedMrs, selectedMuns, typeFilter)
  );

  // Track coordinate collision for jittering
  const coordinateRegistry = {};
  
  filteredCases.forEach(item => {
    const coords = getCaseCoordinates(item);
    if (!coords) return;
    
    const lat = coords.lat;
    const lng = coords.lng;
    
    // Jittering logic if coordinates are identical
    const coordKey = `${lat.toFixed(4)}_${lng.toFixed(4)}`;
    let finalLat = lat;
    let finalLng = lng;
    
    if (coordinateRegistry[coordKey] !== undefined) {
      const count = coordinateRegistry[coordKey];
      coordinateRegistry[coordKey] = count + 1;
      
      // Calculate circular offset around center coordinate (approx 1-2km spread)
      const angle = (count * 2 * Math.PI) / 8;
      const distance = 0.012 * Math.ceil(count / 8); 
      
      finalLat = lat + Math.sin(angle) * distance;
      finalLng = lng + Math.cos(angle) * distance;
    } else {
      coordinateRegistry[coordKey] = 1;
    }
    
    const color = COLOR_MAP[item.regional] || "#0284c7";
    
    // Create modern glowing circular marker using divIcon (removed standard title attribute)
    const customIcon = L.divIcon({
      className: "custom-marker",
      html: `<div class="marker-pin" style="background-color: ${color}; box-shadow: 0 0 12px ${color}; --pulse-color: ${color};"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    
    const marker = L.marker([finalLat, finalLng], { icon: customIcon });
    marker.caseData = item; // Attach case data for cluster styling
    
    // Bind a beautiful custom styled Leaflet tooltip
    marker.bindTooltip(`${item.titulo || item.escola} <br><span style="font-size: 0.8rem; opacity: 0.8; font-weight: 500;">${item.municipio}</span>`, {
      direction: "top",
      offset: [0, -10],
      className: "custom-leaflet-tooltip"
    });
    
    // Bind Popup quick overview card
    const popupContent = createQuickLookCard(item);
    marker.bindPopup(popupContent);
    
    markersLayer.addLayer(marker);
  });
}

function getCaseCoordinates(item) {
  // Check if case has custom stored coordinates
  if (item.lat && item.lng) {
    return { lat: item.lat, lng: item.lng };
  }
  
  // Otherwise lookup static municipalities database
  const normalizedKey = item.municipio.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
  if (window.MUNICIPALITIES_DATABASE && window.MUNICIPALITIES_DATABASE[normalizedKey]) {
    return window.MUNICIPALITIES_DATABASE[normalizedKey];
  }
  
  // Fallback to regional coordinates
  if (window.REGIONAL_FALLBACK_COORDINATES && window.REGIONAL_FALLBACK_COORDINATES[item.regional]) {
    return window.REGIONAL_FALLBACK_COORDINATES[item.regional];
  }
  
  return { lat: -19.9191, lng: -43.9378 }; // Belo Horizonte default fallback
}

function createQuickLookCard(item) {
  const container = document.createElement("div");
  container.className = "popup-card";
  
  const regionalLabel = REGIONAL_NAMES[item.regional] || item.regional;
  const desc = item.descricao || item.studentSummary || "Sem descrição cadastrada.";
  const descriptionSnippet = desc.substring(0, 100) + (desc.length > 100 ? "..." : "");
  
  const typeLabelStr = item.tipoCase === "estudante" ? "Estudante" : "Professor";
  const typeBadgeStyle = item.tipoCase === "estudante" 
    ? "background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);" 
    : "background-color: rgba(0, 84, 166, 0.1); color: var(--sebrae-blue); border: 1px solid rgba(0, 84, 166, 0.2);";
    
  container.innerHTML = `
    <div class="popup-header">
      <div style="margin-bottom: 6px;">
        <span class="badge" style="font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; ${typeBadgeStyle}">${typeLabelStr}</span>
      </div>
      <h3 class="popup-school" style="font-size: 1.05rem; font-weight: 700; color: var(--accent-color); margin-bottom: 2px;">${item.titulo || item.escola}</h3>
      ${item.titulo ? `<h4 class="popup-school-sub" style="font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); margin-bottom: 4px;">${item.escola}</h4>` : ''}
      <div class="popup-location">
        <i data-lucide="map-pin"></i> <span>${item.municipio} - ${item.mr.trim().startsWith("MR") ? item.mr.trim() : `MR ${item.mr.trim()}`}</span>
      </div>
    </div>
    <div class="popup-divider"></div>
    <div class="popup-body">
      <div class="popup-info-row">
        <span class="popup-info-label">Regional</span>
        <span class="popup-info-val">${regionalLabel}</span>
      </div>
      <div class="popup-info-row">
        <span class="popup-info-label">Técnico Responsável</span>
        <span class="popup-info-val">${item.tecnicoNome} ${item.tecnicoContato ? `- ${item.tecnicoContato}` : ''}</span>
      </div>
      <div class="popup-info-row">
        <span class="popup-info-label">Resumo do Case</span>
        <p class="popup-summary">${descriptionSnippet}</p>
      </div>
    </div>
    <div class="popup-actions">
      <button class="btn btn-primary btn-ver-mais" data-id="${item.id}">
        <i data-lucide="maximize-2"></i> Ver Mais Detalhes
      </button>
    </div>
  `;
  
  // Re-trigger icon rendering for popup content
  setTimeout(() => {
    lucide.createIcons({
      attrs: {
        class: 'lucide-icon-popup'
      },
      nameAttr: 'data-lucide',
      root: container
    });
    
    // Bind click to the details modal trigger
    container.querySelector(".btn-ver-mais").addEventListener("click", (e) => {
      e.preventDefault();
      const caseId = e.currentTarget.getAttribute("data-id");
      openDetailsModal(caseId);
      map.closePopup();
    });
  }, 10);
  
  return container;
}

// ==========================================================================
// DASHBOARD & STATISTICS CALCULATIONS
// ==========================================================================

function renderDashboard() {
  renderMarkers();
  updateStatistics();
}

function updateStatistics() {
  const { selectedRegs, selectedMrs, selectedMuns } = getActiveLocationFilters();
  const typeFilter = document.getElementById("filter-type") ? document.getElementById("filter-type").value : "All";
  
  // Current active filtered cases with unified location & type filter
  const filtered = cases.filter(item => 
    isCaseMatchingFilters(item, selectedRegs, selectedMrs, selectedMuns, typeFilter)
  );
  
  // Total cases display
  document.getElementById("stat-total-cases").innerText = filtered.length;
  
  // Calculate breakdown count for teacher vs student cases
  let professorCount = 0;
  let estudanteCount = 0;
  filtered.forEach(item => {
    if (item.tipoCase === "estudante") {
      estudanteCount++;
    } else {
      professorCount++;
    }
  });
  
  document.getElementById("stat-professor-count").innerText = professorCount;
  document.getElementById("stat-estudante-count").innerText = estudanteCount;
  
  // Compute regional stats count
  const counts = {
    "CentroOeste": 0, "Centro": 0, "Noroeste": 0, "Triângulo": 0, "Norte": 0,
    "Rio Doce": 0, "Sul": 0, "Zona da Mata": 0, "Jequitinhonha/Mucuri": 0
  };
  
  filtered.forEach(item => {
    if (counts[item.regional] !== undefined) {
      counts[item.regional]++;
    }
  });
  
  // Max count to base progress bar percentages on
  const maxCount = Math.max(...Object.values(counts), 1);
  
  // Build sidebar listing
  const listContainer = document.getElementById("stats-regional-list");
  listContainer.innerHTML = "";
  
  Object.keys(counts).forEach(key => {
    const count = counts[key];
    const percentage = (count / maxCount) * 100;
    const colorClass = key.toLowerCase().replace("/", "-").replace("â", "a"); // handle Triângulo / Jequitinhonha-Mucuri
    
    // Normalize class names for styling: CentroOeste -> centro-oeste, Triângulo -> triangulo etc
    let colorStyleClass = "bg-centro";
    if (key === "CentroOeste") colorStyleClass = "bg-centro-oeste";
    else if (key === "Centro") colorStyleClass = "bg-centro";
    else if (key === "Noroeste") colorStyleClass = "bg-noroeste";
    else if (key === "Triângulo") colorStyleClass = "bg-triangulo";
    else if (key === "Norte") colorStyleClass = "bg-norte";
    else if (key === "Rio Doce") colorStyleClass = "bg-rio-doce";
    else if (key === "Sul") colorStyleClass = "bg-sul";
    else if (key === "Zona da Mata") colorStyleClass = "bg-zona-mata";
    else if (key === "Jequitinhonha/Mucuri") colorStyleClass = "bg-jequitinhonha-mucuri";

    const li = document.createElement("li");
    li.className = "stats-regional-item";
    li.innerHTML = `
      <div class="stats-regional-label">
        <span class="color-dot ${colorStyleClass}"></span> ${REGIONAL_NAMES[key]}
      </div>
      <div class="stats-regional-bar-container">
        <div class="stats-regional-bar">
          <div class="stats-regional-bar-fill ${colorStyleClass}" style="width: ${percentage}%"></div>
        </div>
        <span class="stats-regional-count">${count}</span>
      </div>
    `;
    listContainer.appendChild(li);
  });
}

// ==========================================================================
// MODAL DETAILS PANEL
// ==========================================================================

function openDetailsModal(id) {
  const item = cases.find(c => c.id === id);
  if (!item) return;
  
  // Basic Info
  document.getElementById("details-titulo").innerText = item.titulo || item.escola;
  document.getElementById("details-escola").innerText = item.titulo ? item.escola : "";
  document.getElementById("details-escola").style.display = item.titulo ? "block" : "none";
  const displayMr = item.mr.trim().startsWith("MR") ? item.mr.trim() : `MR ${item.mr.trim()}`;
  document.getElementById("details-location-text").innerHTML = `<i data-lucide="map-pin"></i> ${item.municipio} - ${displayMr}`;
  
  // Description / General Case summary
  document.getElementById("details-descricao").innerText = item.descricao || item.studentSummary || "Sem descrição cadastrada.";
  
  // Set badge regional text & styling
  const regionalBadge = document.getElementById("details-regional-badge");
  regionalBadge.innerText = REGIONAL_NAMES[item.regional];
  regionalBadge.className = "badge"; // reset classes
  
  let badgeColorClass = "bg-centro";
  if (item.regional === "CentroOeste") badgeColorClass = "bg-centro-oeste";
  else if (item.regional === "Centro") badgeColorClass = "bg-centro";
  else if (item.regional === "Noroeste") badgeColorClass = "bg-noroeste";
  else if (item.regional === "Triângulo") badgeColorClass = "bg-triangulo";
  else if (item.regional === "Norte") badgeColorClass = "bg-norte";
  else if (item.regional === "Rio Doce") badgeColorClass = "bg-rio-doce";
  else if (item.regional === "Sul") badgeColorClass = "bg-sul";
  else if (item.regional === "Zona da Mata") badgeColorClass = "bg-zona-mata";
  else if (item.regional === "Jequitinhonha/Mucuri") badgeColorClass = "bg-jequitinhonha-mucuri";
  regionalBadge.classList.add(badgeColorClass);

  // Technical details
  document.getElementById("details-tecnico-nome").innerText = item.tecnicoNome;
  document.getElementById("details-tecnico-email").innerHTML = `<i data-lucide="mail"></i> ${item.tecnicoEmail}`;
  document.getElementById("details-tecnico-contato").innerHTML = `<i data-lucide="phone"></i> ${item.tecnicoContato}`;

  // Professor Details box setup
  const profBox = document.getElementById("details-professor-box");
  if (profBox) {
    if (item.tipoCase === "professor" || (!item.tipoCase && !item.hasStudentCase)) {
      profBox.style.display = "block";
      document.getElementById("details-professor-nome").innerText = item.professorNome || "Não informado";
      
      const emailContainer = document.getElementById("details-professor-email-container");
      if (item.professorEmail) {
        emailContainer.style.display = "flex";
        document.getElementById("details-professor-email").innerText = item.professorEmail;
      } else {
        emailContainer.style.display = "none";
      }
      
      const contactContainer = document.getElementById("details-professor-contato-container");
      if (item.professorTelefone) {
        contactContainer.style.display = "flex";
        document.getElementById("details-professor-contato").innerText = item.professorTelefone;
      } else {
        contactContainer.style.display = "none";
      }
    } else {
      profBox.style.display = "none";
    }
  }

  // Student Details box setup
  const studentBox = document.getElementById("details-student-box");
  if (studentBox) {
    if (item.tipoCase === "estudante") {
      studentBox.style.display = "block";
      document.getElementById("details-student-nome").innerText = item.estudanteNome || "Não informado";
      
      const emailContainer = document.getElementById("details-student-email-container");
      if (item.estudanteEmail) {
        emailContainer.style.display = "flex";
        document.getElementById("details-student-email").innerText = item.estudanteEmail;
      } else {
        emailContainer.style.display = "none";
      }
      
      const contactContainer = document.getElementById("details-student-contato-container");
      if (item.estudanteTelefone) {
        contactContainer.style.display = "flex";
        document.getElementById("details-student-contato").innerText = item.estudanteTelefone;
      } else {
        contactContainer.style.display = "none";
      }
    } else {
      studentBox.style.display = "none";
    }
  }

  // JEPP Status Badge
  const jeppBadge = document.getElementById("details-jepp");
  jeppBadge.innerText = item.jeppStatus === "Sim" ? "Sim (Total)" : (item.jeppStatus === "Parcial" ? "Parcial" : "Não");
  jeppBadge.className = "badge";
  if (item.jeppStatus === "Sim") jeppBadge.classList.add("bg-centro"); // green
  else if (item.jeppStatus === "Parcial") jeppBadge.classList.add("bg-centro-oeste"); // orange
  else jeppBadge.classList.add("bg-rio-doce"); // red

  // Coop Credit Indicator & Box
  const coopBadge = document.getElementById("details-coop-status");
  const coopBox = document.getElementById("details-coop-box");
  coopBadge.innerText = item.hasCoop ? "Sim" : "Não";
  coopBadge.className = "badge " + (item.hasCoop ? "bg-centro" : "bg-rio-doce");
  if (item.hasCoop) {
    coopBox.style.display = "flex";
    document.getElementById("details-coop-summary").innerText = item.coopSummary;
  } else {
    coopBox.style.display = "none";
  }

  // EE > 70% Indicator
  const edu70Badge = document.getElementById("details-edu-70");
  edu70Badge.innerText = item.edu70 === "sim" ? "Sim" : "Não";
  edu70Badge.className = "badge " + (item.edu70 === "sim" ? "bg-centro" : "bg-rio-doce");

  // Municipal Law Indicator & Box
  const lawBadge = document.getElementById("details-law-status");
  const lawBox = document.getElementById("details-law-box");
  lawBadge.innerText = item.hasLaw ? "Sim" : "Não";
  lawBadge.className = "badge " + (item.hasLaw ? "bg-centro" : "bg-rio-doce");
  if (item.hasLaw) {
    lawBox.style.display = "flex";
    document.getElementById("details-law-summary").innerText = item.lawSummary;
  } else {
    lawBox.style.display = "none";
  }

  // Committee Box
  const committeeBox = document.getElementById("details-committee-box");
  const committeeBadge = document.getElementById("details-committee-badge");
  if (item.hasCommittee) {
    committeeBox.style.display = "flex";
    committeeBadge.innerText = "Sim";
    committeeBadge.className = "indicator-badge status-sim";
    document.getElementById("details-committee-summary").innerText = item.committeeSummary;
  } else {
    committeeBox.style.display = "none";
    committeeBadge.innerText = "Não";
    committeeBadge.className = "indicator-badge status-nao";
  }

  // IES Partnership Box
  const iesBox = document.getElementById("details-ies-box");
  const iesBadge = document.getElementById("details-ies-badge");
  if (item.hasIes) {
    iesBox.style.display = "flex";
    iesBadge.innerText = "Sim";
    iesBadge.className = "indicator-badge status-sim";
    document.getElementById("details-ies-summary").innerText = item.iesSummary;
  } else {
    iesBox.style.display = "none";
    iesBadge.innerText = "Não";
    iesBadge.className = "indicator-badge status-nao";
  }

  // Open Modal
  document.getElementById("details-modal").classList.add("active");
  lucide.createIcons({ root: document.getElementById("details-modal") });
}

function closeDetailsModal() {
  document.getElementById("details-modal").classList.remove("active");
}

// ==========================================================================
// REGISTER CASE FORM SLIDE PANEL
// ==========================================================================

function openCaseTypeModal() {
  document.getElementById("case-type-modal").classList.add("active");
  document.getElementById("case-type-modal").style.display = "flex";
  lucide.createIcons({ root: document.getElementById("case-type-modal") });
}

function closeCaseTypeModal() {
  document.getElementById("case-type-modal").classList.remove("active");
  document.getElementById("case-type-modal").style.display = "none";
}

function selectCaseType(type) {
  if (type === "municipio") {
    closeCaseTypeModal();
    openMunicipalityModal();
    return;
  }
  currentRegisterType = type;
  closeCaseTypeModal();
  
  // Update header text label dynamically
  const typeLabel = document.getElementById("register-type-label");
  if (typeLabel) {
    if (type === 'professor') {
      typeLabel.innerText = " | Professor";
      typeLabel.style.color = "var(--sebrae-blue)";
    } else {
      typeLabel.innerText = " | Estudante";
      typeLabel.style.color = "#10b981";
    }
  }
  
  // Open actual form panel
  openRegisterPanel();
}

function openRegisterPanel() {
  document.getElementById("register-panel").classList.add("active");
  document.getElementById("register-form").reset();
  
  // Toggle student and professor fieldset visibility based on register type
  const studentFieldset = document.getElementById("student-details-fieldset");
  const professorFieldset = document.getElementById("professor-details-fieldset");
  const profNome = document.getElementById("form-professor-nome");
  const profEmail = document.getElementById("form-professor-email");
  const profTel = document.getElementById("form-professor-contato");
  const studNome = document.getElementById("form-estudante-nome");
  const studEmail = document.getElementById("form-estudante-email");
  const studTel = document.getElementById("form-estudante-contato");

  if (currentRegisterType === 'estudante') {
    if (studentFieldset) studentFieldset.style.display = "flex";
    if (professorFieldset) professorFieldset.style.display = "none";
    if (studNome) { studNome.required = true; studNome.value = ""; }
    if (studEmail) { studEmail.required = true; studEmail.value = ""; }
    if (studTel) { studTel.required = true; studTel.value = ""; }
    if (profNome) { profNome.required = false; profNome.value = ""; }
    if (profEmail) { profEmail.required = false; profEmail.value = ""; }
    if (profTel) { profTel.required = false; profTel.value = ""; }
  } else {
    // Professor
    if (studentFieldset) studentFieldset.style.display = "none";
    if (professorFieldset) professorFieldset.style.display = "flex";
    if (profNome) { profNome.required = true; profNome.value = ""; }
    if (profEmail) { profEmail.required = true; profEmail.value = ""; }
    if (profTel) { profTel.required = true; profTel.value = ""; }
    if (studNome) { studNome.required = false; studNome.value = ""; }
    if (studEmail) { studEmail.required = false; studEmail.value = ""; }
    if (studTel) { studTel.required = false; studTel.value = ""; }
  }
  
  // Trigger conditional toggles resetting visibility
  toggleConditionalFields("has-coop", "coop-fields");
  toggleConditionalFields("has-law", "law-fields");
  toggleConditionalFields("has-committee", "committee-fields");
  toggleConditionalFields("has-ies", "ies-fields");
}

function closeRegisterPanel() {
  document.getElementById("register-panel").classList.remove("active");
}

function openMunicipalityModal() {
  const modal = document.getElementById("municipality-modal");
  if (modal) {
    const form = document.getElementById("municipality-form");
    if (form) form.reset();
    modal.classList.add("active");
    modal.style.display = "flex";
    lucide.createIcons({ root: modal });
  }
}

function closeMunicipalityModal() {
  const modal = document.getElementById("municipality-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

function openConfirmCodeModal(code) {
  const modal = document.getElementById("confirm-code-modal");
  if (modal) {
    const codeEl = document.getElementById("request-code-value");
    if (codeEl) codeEl.innerText = code;
    modal.classList.add("active");
    modal.style.display = "flex";
    lucide.createIcons({ root: modal });
  }
}

function closeConfirmCodeModal() {
  const modal = document.getElementById("confirm-code-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

async function handleMunicipalitySubmit(e) {
  e.preventDefault();
  const name = document.getElementById("municipality-name").value.trim();
  const regional = document.getElementById("municipality-regional").value;
  const mr = document.getElementById("municipality-mr").value.trim();
  const contactName = document.getElementById("municipality-contact-name").value.trim();
  const contactEmail = document.getElementById("municipality-contact-email").value.trim();
  const contactPhone = document.getElementById("municipality-contact-phone").value.trim();
  const jeppStatus = document.getElementById("municipality-jepp-status").value;
  
  const edu70El = document.querySelector('input[name="municipality-edu-70"]:checked');
  const edu70 = edu70El ? edu70El.value : "nao";
  
  const coopEl = document.querySelector('input[name="municipality-coop"]:checked');
  const hasCoop = coopEl ? coopEl.value === "sim" : false;
  
  const lawEl = document.querySelector('input[name="municipality-law"]:checked');
  const hasLaw = lawEl ? lawEl.value === "sim" : false;
  
  const comEl = document.querySelector('input[name="municipality-committee"]:checked');
  const hasCommittee = comEl ? comEl.value === "sim" : false;
  
  const iesEl = document.querySelector('input[name="municipality-ies"]:checked');
  const hasIes = iesEl ? iesEl.value === "sim" : false;
  
  const empSimEl = document.querySelector('input[name="municipality-empresa-simulada"]:checked');
  const hasEmpresaSimulada = empSimEl ? empSimEl.value === "sim" : false;
  
  const escSebEl = document.querySelector('input[name="municipality-escola-sebrae"]:checked');
  const hasEscolaSebrae = escSebEl ? escSebEl.value === "sim" : false;

  // Validação de telefone com DDD entre parênteses
  if (!isValidPhone(contactPhone)) {
    showToast("Por favor, preencha o Telefone/WhatsApp válido com DDD: (XX) XXXXX-XXXX");
    const phoneInput = document.getElementById("municipality-contact-phone");
    if (phoneInput) {
      phoneInput.focus();
      phoneInput.style.borderColor = "var(--danger, #ef4444)";
      phoneInput.style.boxShadow = "0 0 0 2px rgba(239, 68, 68, 0.2)";
    }
    return;
  }

  const requestCode = generateNextRequestCode();

  const newMunicipality = {
    id: "mun-" + Date.now(),
    request_code: requestCode,
    nome: name,
    regional,
    mr,
    responsavel_nome: contactName,
    responsavel_email: contactEmail,
    responsavel_telefone: formatPhoneNumber(contactPhone),
    status_jepp: jeppStatus,
    municipio_ee_70: edu70,
    cooperativa_possui: hasCoop,
    lei_possui: hasLaw,
    comite_possui: hasCommittee,
    ies_possui: hasIes,
    empresa_simulada: hasEmpresaSimulada,
    escola_sebrae: hasEscolaSebrae,
    status: "pending",
    created_at: new Date().toISOString()
  };

  try {
    const existing = JSON.parse(localStorage.getItem("sebrae_pending_municipalities") || "[]");
    existing.push(newMunicipality);
    localStorage.setItem("sebrae_pending_municipalities", JSON.stringify(existing));
  } catch (err) {
    console.error("Erro ao salvar no localStorage:", err);
  }

  // Envia via backend local/remoto e tenta direto no Supabase
  try {
    await fetch(getApiUrl("/api/municipalities"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMunicipality)
    });
  } catch (err) {
    // Ignored in static / file mode
  }

  const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
  const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/municipalities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(newMunicipality)
      });
    } catch (sbErr) {}
  }

  closeMunicipalityModal();
  openConfirmCodeModal(requestCode);
  showToast(`Solicitação de cadastro de ${name} enviada com sucesso! Protocolo: ${requestCode}`);
  document.getElementById("municipality-form").reset();
}

function toggleConditionalFields(checkboxId, targetDivId) {
  const checkbox = document.getElementById(checkboxId);
  const target = document.getElementById(targetDivId);
  if (checkbox && target) {
    const textarea = target.querySelector("textarea");
    if (checkbox.checked) {
      target.classList.add("active");
      if (textarea) textarea.required = true;
    } else {
      target.classList.remove("active");
      if (textarea) {
        textarea.required = false;
        textarea.value = "";
      }
    }
  }
}

// ==========================================================================
// AUTOCOMPLETE & MUNICIPALITIES AUTO-SELECT LOGIC
// ==========================================================================

function setupAutocomplete() {
  setupUnifiedLocationSearch();

  const formInput = document.getElementById("form-municipio");
  const formList = document.getElementById("form-municipio-suggestions");
  if (formInput && formList) {
    formInput.addEventListener("input", () => {
      const val = formInput.value.trim().toLowerCase();
      formList.innerHTML = "";
      if (!val) {
        formList.style.display = "none";
        return;
      }
      
      const matches = Object.keys(window.MUNICIPALITIES_DATABASE).filter(key => 
        key.includes(val) || window.MUNICIPALITIES_DATABASE[key].name.toLowerCase().includes(val)
      );
      
      if (matches.length > 0) {
        formList.style.display = "block";
        matches.slice(0, 5).forEach(key => {
          const item = window.MUNICIPALITIES_DATABASE[key];
          const li = document.createElement("li");
          li.innerText = item.name;
          li.addEventListener("click", () => {
            formInput.value = item.name;
            formList.style.display = "none";
            
            // Auto-select regional and lock/suggest MR
            const regionalSelect = document.getElementById("form-regional");
            if (regionalSelect) regionalSelect.value = item.regional;
            
            // Fill suggested MR
            const mrInput = document.getElementById("form-mr");
            if (mrInput) mrInput.value = `MR ${item.name}`;
          });
          formList.appendChild(li);
        });
      } else {
        formList.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target !== formInput) {
        formList.style.display = "none";
      }
    });
  }

  // Autocomplete on Municipality Modal Form
  const munInput = document.getElementById("municipality-name");
  const munList = document.getElementById("municipality-suggestions");
  if (munInput && munList) {
    munInput.addEventListener("input", () => {
      const val = munInput.value.trim().toLowerCase();
      munList.innerHTML = "";
      if (!val) {
        munList.style.display = "none";
        return;
      }
      
      const matches = Object.keys(window.MUNICIPALITIES_DATABASE).filter(key => 
        key.includes(val) || window.MUNICIPALITIES_DATABASE[key].name.toLowerCase().includes(val)
      );
      
      if (matches.length > 0) {
        munList.style.display = "block";
        matches.slice(0, 5).forEach(key => {
          const item = window.MUNICIPALITIES_DATABASE[key];
          const li = document.createElement("li");
          li.innerText = item.name;
          li.addEventListener("click", () => {
            munInput.value = item.name;
            munList.style.display = "none";
            
            // Auto-select regional and suggested MR
            const regionalSelect = document.getElementById("municipality-regional");
            if (regionalSelect) regionalSelect.value = item.regional;
            
            const mrInput = document.getElementById("municipality-mr");
            if (mrInput) mrInput.value = `MR ${item.name}`;
          });
          munList.appendChild(li);
        });
      } else {
        munList.style.display = "none";
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target !== munInput) {
        munList.style.display = "none";
      }
    });
  }
}

// ==========================================================================
// UNIFIED LOCATION SEARCH CONTROLLER (CHECKBOXES & CHIPS)
// ==========================================================================

function setupUnifiedLocationSearch() {
  const searchInput = document.getElementById("search-location");
  const dropdown = document.getElementById("location-suggestions-dropdown");
  const dropdownList = document.getElementById("location-dropdown-list");
  const countLabel = document.getElementById("location-dropdown-count");
  const clearInputBtn = document.getElementById("btn-clear-location-input");
  const clearFiltersBtn = document.getElementById("btn-clear-filters");

  if (!searchInput || !dropdown || !dropdownList) return;

  function renderDropdownItems(query = "") {
    const allEntities = getAllLocationEntities();
    const cleanQuery = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    let matches = allEntities;
    if (cleanQuery) {
      matches = allEntities.filter(item => item.searchStr.includes(cleanQuery));
    }

    dropdownList.innerHTML = "";

    if (matches.length === 0) {
      dropdownList.innerHTML = `
        <div style="padding: 14px 12px; text-align: center; color: #94a3b8; font-size: 0.85rem;">
          Nenhum local encontrado para "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      if (countLabel) countLabel.textContent = "0 opções encontradas";
      return;
    }

    if (countLabel) {
      countLabel.textContent = `${matches.length} opções disponíveis`;
    }

    // Allow scrolling through all options (up to 150 items)
    const sliceMatches = matches.slice(0, 150);

    sliceMatches.forEach(item => {
      const isSelected = selectedLocationFilters.has(item.id);
      const row = document.createElement("div");
      row.className = `location-dropdown-item ${isSelected ? "selected" : ""}`;
      row.setAttribute("data-id", item.id);

      let tagClass = "tag-municipio";
      let tagLabel = "MUNICÍPIO";
      if (item.type === "regional") {
        tagClass = "tag-regional";
        tagLabel = "REGIONAL";
      } else if (item.type === "mr") {
        tagClass = "tag-mr";
        tagLabel = "MICRORREGIÃO";
      }

      row.innerHTML = `
        <input type="checkbox" id="chk-${escapeHtml(item.id)}" ${isSelected ? "checked" : ""}>
        <div class="location-item-info">
          <div class="location-item-row" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;">
            <span class="location-item-name">${escapeHtml(item.name)}</span>
            <span class="class-tag ${tagClass}">${tagLabel}</span>
          </div>
          <span class="location-item-sub">${escapeHtml(item.sub)}</span>
        </div>
      `;

      row.addEventListener("click", (e) => {
        const checkbox = row.querySelector("input[type='checkbox']");
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }
        toggleLocationSelection(item, checkbox.checked);
        row.classList.toggle("selected", checkbox.checked);
        searchInput.focus();
      });

      dropdownList.appendChild(row);
    });
  }

  function toggleLocationSelection(item, shouldSelect) {
    if (shouldSelect) {
      selectedLocationFilters.set(item.id, item);
    } else {
      selectedLocationFilters.delete(item.id);
    }

    renderSelectedChips();
    renderDashboard();
    applySmartLocationZoom();
  }

  // Open dropdown on focus or typing
  searchInput.addEventListener("focus", () => {
    dropdown.classList.add("active");
    renderDropdownItems(searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    const val = searchInput.value;
    if (clearInputBtn) {
      clearInputBtn.style.display = val.length > 0 ? "flex" : "none";
    }
    dropdown.classList.add("active");
    renderDropdownItems(val);
  });

  if (clearInputBtn) {
    clearInputBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearInputBtn.style.display = "none";
      renderDropdownItems("");
      searchInput.focus();
    });
  }

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".location-search-group")) {
      dropdown.classList.remove("active");
    }
  });

  // Clear filters button
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }
}

function renderSelectedChips() {
  const container = document.getElementById("selected-location-chips");
  if (!container) return;

  container.innerHTML = "";

  if (selectedLocationFilters.size === 0) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";

  const titleRow = document.createElement("div");
  titleRow.className = "selected-chips-header";
  titleRow.innerHTML = `<span>Selecionados (${selectedLocationFilters.size}):</span>`;
  container.appendChild(titleRow);

  const chipsList = document.createElement("div");
  chipsList.className = "selected-chips-list";

  selectedLocationFilters.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "selected-chip";

    let tagClass = "tag-municipio";
    let tagLabel = "Município";
    if (item.type === "regional") {
      tagClass = "tag-regional";
      tagLabel = "Regional";
    } else if (item.type === "mr") {
      tagClass = "tag-mr";
      tagLabel = "MR";
    }

    chip.innerHTML = `
      <span class="selected-chip-name">${escapeHtml(item.name)}</span>
      <span class="class-tag ${tagClass}">${tagLabel}</span>
      <button type="button" class="chip-remove-btn" title="Remover este local" onclick="removeLocationFilter('${escapeHtml(item.id)}')">
        <i data-lucide="x" style="width: 12px; height: 12px;"></i>
      </button>
    `;
    chipsList.appendChild(chip);
  });

  container.appendChild(chipsList);

  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root: container });
  }
}

function removeLocationFilter(id) {
  selectedLocationFilters.delete(id);
  renderSelectedChips();
  
  // Update checkbox state in dropdown if visible
  const chk = document.getElementById(`chk-${id}`);
  if (chk) {
    chk.checked = false;
    const row = chk.closest(".location-dropdown-item");
    if (row) row.classList.remove("selected");
  }

  renderDashboard();
  applySmartLocationZoom();
}

function applySmartLocationZoom() {
  if (!map) return;

  if (selectedLocationFilters.size === 0) {
    return;
  }

  // If exactly 1 item selected:
  if (selectedLocationFilters.size === 1) {
    const item = Array.from(selectedLocationFilters.values())[0];
    if (item.type === "municipio" && item.lat && item.lng) {
      map.setView([item.lat, item.lng], 11);
      return;
    }
    if (item.type === "regional" && window.REGIONAL_FALLBACK_COORDINATES && window.REGIONAL_FALLBACK_COORDINATES[item.val]) {
      const c = window.REGIONAL_FALLBACK_COORDINATES[item.val];
      map.setView([c.lat, c.lng], 8);
      return;
    }
  }

  // If multiple or MR: fit markers if present
  if (markersLayer) {
    try {
      const bounds = markersLayer.getBounds();
      if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      }
    } catch (e) {
      // ignore
    }
  }
}

function clearAllFilters() {
  selectedLocationFilters.clear();
  
  const searchInput = document.getElementById("search-location");
  if (searchInput) searchInput.value = "";
  
  const clearInputBtn = document.getElementById("btn-clear-location-input");
  if (clearInputBtn) clearInputBtn.style.display = "none";

  const typeFilter = document.getElementById("filter-type");
  if (typeFilter) typeFilter.value = "All";

  renderSelectedChips();

  // Uncheck all dropdown items
  document.querySelectorAll(".location-dropdown-item").forEach(row => {
    row.classList.remove("selected");
    const chk = row.querySelector("input[type='checkbox']");
    if (chk) chk.checked = false;
  });

  const dropdown = document.getElementById("location-suggestions-dropdown");
  if (dropdown) dropdown.classList.remove("active");

  renderDashboard();

  // Reset map view to full state of Minas Gerais
  if (map) {
    map.setView([-18.5, -44.5], 7);
  }
}

// Make helpers globally accessible
window.removeLocationFilter = removeLocationFilter;
window.clearAllFilters = clearAllFilters;


// ==========================================================================
// EVENT BINDINGS
// ==========================================================================

function bindEvents() {
  // Type filter binding
  const typeFilter = document.getElementById("filter-type");
  if (typeFilter) {
    typeFilter.addEventListener("change", () => {
      renderDashboard();
      applySmartLocationZoom();
    });
  }

  // Export CSV binding
  const exportBtn = document.getElementById("btn-export-csv");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const selectType = document.getElementById("export-select-type");
      const selectedValue = selectType ? selectType.value : "all";
      exportToCSV(selectedValue);
    });
  }

  // Open & Close Panels/Modals
  document.getElementById("btn-open-register").addEventListener("click", openCaseTypeModal);
  document.getElementById("btn-close-register").addEventListener("click", closeRegisterPanel);
  document.getElementById("btn-cancel-register").addEventListener("click", closeRegisterPanel);
  
  document.getElementById("btn-close-details").addEventListener("click", closeDetailsModal);
  
  // Close Case Type Modal triggers
  document.getElementById("btn-close-type-modal").addEventListener("click", closeCaseTypeModal);
  document.getElementById("select-type-professor").addEventListener("click", () => selectCaseType('professor'));
  document.getElementById("select-type-estudante").addEventListener("click", () => selectCaseType('estudante'));

  const btnMun = document.getElementById("select-type-municipio");
  if (btnMun) btnMun.addEventListener("click", () => selectCaseType('municipio'));

  const btnCloseMun = document.getElementById("btn-close-municipality");
  if (btnCloseMun) btnCloseMun.addEventListener("click", closeMunicipalityModal);

  const formMun = document.getElementById("municipality-form");
  if (formMun) formMun.addEventListener("submit", handleMunicipalitySubmit);

  const btnCloseCode = document.getElementById("btn-close-code-modal");
  if (btnCloseCode) btnCloseCode.addEventListener("click", closeConfirmCodeModal);

  const btnFinishCode = document.getElementById("btn-finish-code-modal");
  if (btnFinishCode) btnFinishCode.addEventListener("click", closeConfirmCodeModal);

  const btnCancelMun = document.getElementById("btn-cancel-municipality");
  if (btnCancelMun) btnCancelMun.addEventListener("click", closeMunicipalityModal);

  // Close modal/panel on click outer wrapper
  document.getElementById("details-modal").addEventListener("click", (e) => {
    if (e.target.id === "details-modal") closeDetailsModal();
  });
  document.getElementById("register-panel").addEventListener("click", (e) => {
    if (e.target.id === "register-panel") closeRegisterPanel();
  });
  document.getElementById("case-type-modal").addEventListener("click", (e) => {
    if (e.target.id === "case-type-modal") closeCaseTypeModal();
  });
  const modalMun = document.getElementById("municipality-modal");
  if (modalMun) {
    modalMun.addEventListener("click", (e) => {
      if (e.target.id === "municipality-modal") closeMunicipalityModal();
    });
  }
  const modalCode = document.getElementById("confirm-code-modal");
  if (modalCode) {
    modalCode.addEventListener("click", (e) => {
      if (e.target.id === "confirm-code-modal") closeConfirmCodeModal();
    });
  }

  // Form switches bindings (Case Registration)
  document.getElementById("has-coop").addEventListener("change", () => {
    toggleConditionalFields("has-coop", "coop-fields");
  });
  document.getElementById("has-law").addEventListener("change", () => {
    toggleConditionalFields("has-law", "law-fields");
  });
  document.getElementById("has-committee").addEventListener("change", () => {
    toggleConditionalFields("has-committee", "committee-fields");
  });
  document.getElementById("has-ies").addEventListener("change", () => {
    toggleConditionalFields("has-ies", "ies-fields");
  });

  // Set up Autocomplete search/form
  setupAutocomplete();

  // Collapsible sidebar panels binding
  document.querySelectorAll(".panel-header").forEach(header => {
    header.addEventListener("click", () => {
      const panel = header.closest(".panel");
      if (panel) {
        panel.classList.toggle("collapsed");
      }
    });
  });

  // Form Submit handler
  document.getElementById("register-form").addEventListener("submit", handleFormSubmit);

  // Login Form Submit handler
  document.getElementById("login-form").addEventListener("submit", handleLogin);

  // Logout Button handler
  document.getElementById("btn-logout").addEventListener("click", handleLogout);
}

// ==========================================================================
// FORM SUBMISSION & CASE CREATION
// ==========================================================================

async function handleFormSubmit(e) {
  e.preventDefault();
  
  const municipio = document.getElementById("form-municipio").value.trim();
  const regional = document.getElementById("form-regional").value;
  const mr = document.getElementById("form-mr").value.trim();
  const escola = document.getElementById("form-escola").value.trim();
  const titulo = document.getElementById("form-titulo").value.trim();
  const descricao = document.getElementById("form-descricao").value.trim();
  
  const tecnicoNome = document.getElementById("form-tecnico-nome").value.trim();
  const tecnicoEmail = document.getElementById("form-tecnico-email").value.trim();
  const tecnicoContato = document.getElementById("form-tecnico-contato").value.trim();
  
  const professorNome = currentRegisterType === 'professor' ? document.getElementById("form-professor-nome").value.trim() : "";
  const professorEmail = currentRegisterType === 'professor' ? document.getElementById("form-professor-email").value.trim() : "";
  const professorTelefone = currentRegisterType === 'professor' ? document.getElementById("form-professor-contato").value.trim() : "";

  const estudanteNome = currentRegisterType === 'estudante' ? document.getElementById("form-estudante-nome").value.trim() : "";
  const estudanteEmail = currentRegisterType === 'estudante' ? document.getElementById("form-estudante-email").value.trim() : "";
  const estudanteTelefone = currentRegisterType === 'estudante' ? document.getElementById("form-estudante-contato").value.trim() : "";
  
  const hasCoop = document.getElementById("has-coop").checked;
  const coopSummary = document.getElementById("form-coop-summary").value.trim();
  
  // EE > 70% radio
  const edu70Val = document.querySelector('input[name="edu-70"]:checked').value;
  
  const hasLaw = document.getElementById("has-law").checked;
  const lawSummary = document.getElementById("form-law-summary").value.trim();
  
  const hasCommittee = document.getElementById("has-committee").checked;
  const committeeSummary = document.getElementById("form-committee-summary").value.trim();
  
  const hasIes = document.getElementById("has-ies").checked;
  const iesSummary = document.getElementById("form-ies-summary").value.trim();
  
  const jeppStatus = document.getElementById("form-jepp-status").value;

  // Validação de Telefones com DDD entre parênteses
  if (tecnicoContato && !isValidPhone(tecnicoContato)) {
    showToast("Telefone do técnico inválido. Use o formato com DDD: (XX) XXXXX-XXXX");
    const el = document.getElementById("form-tecnico-contato");
    if (el) { el.focus(); el.style.borderColor = "var(--danger, #ef4444)"; }
    submitBtn.disabled = false;
    submitBtn.innerHTML = origText;
    return;
  }

  if (currentRegisterType === 'professor') {
    if (!isValidPhone(professorTelefone)) {
      showToast("Telefone do professor inválido. Use o formato com DDD: (XX) XXXXX-XXXX");
      const el = document.getElementById("form-professor-contato");
      if (el) { el.focus(); el.style.borderColor = "var(--danger, #ef4444)"; }
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      return;
    }
  }

  if (currentRegisterType === 'estudante') {
    if (estudanteTelefone && !isValidPhone(estudanteTelefone)) {
      showToast("Telefone do estudante inválido. Use o formato com DDD: (XX) XXXXX-XXXX");
      const el = document.getElementById("form-estudante-contato");
      if (el) { el.focus(); el.style.borderColor = "var(--danger, #ef4444)"; }
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      return;
    }
  }

  // Show a loading feedback on the submit button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const origText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Salvando...';
  lucide.createIcons({ root: submitBtn });

  // Look up coordinates (dynamic Nominatim / static fallback)
  const coordsObj = await window.getMunicipalityCoordinates(municipio, regional);
  
  const requestCode = generateNextRequestCode();

  const newCase = {
    id: "case-" + Date.now(),
    request_code: requestCode,
    municipio: coordsObj.name, // standardize name if matched in db
    regional,
    mr,
    escola,
    titulo,
    descricao,
    tecnicoNome,
    tecnicoEmail,
    tecnicoContato: formatPhoneNumber(tecnicoContato),
    
    // Type and contact info
    tipoCase: currentRegisterType,
    professorNome,
    professorEmail,
    professorTelefone: formatPhoneNumber(professorTelefone),
    estudanteNome,
    estudanteEmail,
    estudanteTelefone: formatPhoneNumber(estudanteTelefone),
    
    // Legacy support fields
    hasStudentCase: currentRegisterType === 'estudante',
    studentSummary: "",
    studentContact: "",
    
    hasCoop,
    coopSummary: hasCoop ? coopSummary : "",
    edu70: edu70Val,
    hasLaw,
    lawSummary: hasLaw ? lawSummary : "",
    hasCommittee,
    committeeSummary: hasCommittee ? committeeSummary : "",
    hasIes,
    iesSummary: hasIes ? iesSummary : "",
    jeppStatus,
    lat: coordsObj.lat,
    lng: coordsObj.lng
  };

  // Add to state and persist
  if (isCloudMode) {
    const supabaseUrl = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || "";
    const supabaseKey = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || "";

    try {
      const dbCase = mapAppToDatabase(newCase);
      let res;
      if (supabaseUrl && supabaseKey) {
        res = await fetch(`${supabaseUrl}/rest/v1/cases`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": supabaseKey,
            "Authorization": `Bearer ${supabaseKey}`,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify(dbCase)
        });
      } else {
        res = await fetch(getApiUrl("/api/cases"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dbCase)
        });
      }
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      cases.push(newCase);
    } catch (e) {
      console.error("Erro ao salvar case no Supabase:", e);
      showToast("Erro ao salvar na nuvem! O case foi mantido apenas localmente.");
      cases.push(newCase);
      localStorage.setItem("sebrae_success_cases", JSON.stringify(cases));
    }
  } else {
    cases.push(newCase);
    localStorage.setItem("sebrae_success_cases", JSON.stringify(cases));
  }

  // Reset button state
  submitBtn.disabled = false;
  submitBtn.innerHTML = origText;
  lucide.createIcons({ root: submitBtn });

  // Close panel and notify dashboard
  closeRegisterPanel();
  renderDashboard();

  // Focus map on the newly added marker
  map.setView([coordsObj.lat, coordsObj.lng], 10);
  
  // Custom toast notification of success
  showToast(`Case de sucesso da ${escola} em ${municipio} foi cadastrado com sucesso!`);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message glass-panel animate-zoom";
  toast.innerHTML = `<i data-lucide="check-circle" style="color: var(--success); width: 18px; height: 18px;"></i> <span>${message}</span>`;
  
  document.body.appendChild(toast);
  lucide.createIcons({ root: toast });
  
  // Add CSS dynamically for toast
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: "9999",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  });
  
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

// ==========================================================================
// DEMO AUTHENTICATION WORKFLOW
// ==========================================================================

function checkAuth() {
  const isAuth = localStorage.getItem("sebrae_authenticated");
  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  
  if (isAuth === "true") {
    loginView.style.display = "none";
    dashboardView.style.display = "flex";
    
    // Recalculate leaflet map boundary sizes now that container is visible
    if (map) {
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }
  } else {
    loginView.style.display = "flex";
    dashboardView.style.display = "none";
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorMsg = document.getElementById("login-error");
  const loginBtn = document.getElementById("btn-login");
  
  if (email.toLowerCase() === "admin@sebraemg.com.br" && password === "admin123") {
    errorMsg.classList.remove("active");
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width: 18px; height: 18px;"></i> Acessando Admin...';
    lucide.createIcons({ root: loginBtn });
    
    setTimeout(() => {
      localStorage.setItem("sebrae_admin_authenticated", "true");
      loginBtn.disabled = false;
      loginBtn.innerHTML = "<span>Entrar no Painel</span>";
      window.location.href = "admin-dashboard.html";
    }, 600);
    return;
  }

  if (email === "teste@sebraemg.com.br" && password === "teste123") {
    errorMsg.classList.remove("active");
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width: 18px; height: 18px;"></i> Entrando...';
    lucide.createIcons({ root: loginBtn });
    
    setTimeout(() => {
      localStorage.setItem("sebrae_authenticated", "true");
      loginBtn.disabled = false;
      loginBtn.innerHTML = "<span>Entrar no Painel</span>";
      checkAuth();
      showToast("Autenticado com sucesso!");
    }, 800);
  } else {
    errorMsg.classList.add("active");
  }
}

function handleLogout() {
  localStorage.removeItem("sebrae_authenticated");
  checkAuth();
  
  // Clear input fields
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  
  showToast("Sessão encerrada com sucesso!");
}

function exportToCSV(type = 'all') {
  let casesToExport = [...cases];
  let filename = "Planilha_Cases_Todos.csv";
  
  if (type === 'professor') {
    casesToExport = cases.filter(item => item.tipoCase === 'professor');
    filename = "Planilha_Cases_Professor.csv";
  } else if (type === 'estudante') {
    casesToExport = cases.filter(item => item.tipoCase === 'estudante');
    filename = "Planilha_Cases_Estudante.csv";
  }
  
  if (casesToExport.length === 0) {
    showToast("Não há dados para exportar nesta categoria!");
    return;
  }
  
  // Define CSV headers in Portuguese
  const headers = [
    "ID",
    "Título do Projeto",
    "Descrição Geral",
    "Município",
    "Regional",
    "Microrregião (MR)",
    "Escola / Instituição",
    "Latitude",
    "Longitude",
    "Nome do Técnico",
    "E-mail do Técnico",
    "Telefone do Técnico",
    "Tipo de Case",
    "Nome do Estudante",
    "E-mail do Estudante",
    "Telefone do Estudante",
    "Parceria com Cooperativa de Crédito",
    "Resumo da Cooperativa",
    "Município EE > 70%",
    "Possui Lei Municipal de EE",
    "Resumo da Lei",
    "Possui Comitê Conjunto",
    "Resumo do Comitê",
    "Parceria com Ensino Superior (IES)",
    "Resumo da IES",
    "Status JEPP"
  ];
  
  // Helper to escape values for CSV
  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    let str = String(val).replace(/"/g, '""'); // escape quotes
    return `"${str}"`;
  };
  
  // Build rows
  const csvRows = [headers.join(";")]; // Semicolon delimiter is best for Portuguese/Excel
  
  casesToExport.forEach(item => {
    const row = [
      escapeCSV(item.id),
      escapeCSV(item.titulo),
      escapeCSV(item.descricao),
      escapeCSV(item.municipio),
      escapeCSV(REGIONAL_NAMES[item.regional] || item.regional),
      escapeCSV(item.mr),
      escapeCSV(item.escola),
      escapeCSV(item.lat),
      escapeCSV(item.lng),
      escapeCSV(item.tecnicoNome),
      escapeCSV(item.tecnicoEmail),
      escapeCSV(item.tecnicoContato),
      escapeCSV(item.tipoCase === "estudante" ? "Estudante" : "Professor"),
      escapeCSV(item.estudanteNome),
      escapeCSV(item.estudanteEmail),
      escapeCSV(item.estudanteTelefone),
      escapeCSV(item.hasCoop ? "Sim" : "Não"),
      escapeCSV(item.coopSummary),
      escapeCSV(item.edu70 === "sim" ? "Sim" : "Não"),
      escapeCSV(item.hasLaw ? "Sim" : "Não"),
      escapeCSV(item.lawSummary),
      escapeCSV(item.hasCommittee ? "Sim" : "Não"),
      escapeCSV(item.committeeSummary),
      escapeCSV(item.hasIes ? "Sim" : "Não"),
      escapeCSV(item.iesSummary),
      escapeCSV(item.jeppStatus)
    ];
    csvRows.push(row.join(";"));
  });
  
  // Join rows with CRLF
  const csvContent = csvRows.join("\r\n");
  
  // Create Blob with UTF-8 BOM so Excel opens it with accents correctly!
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast("Planilha (CSV) exportada com sucesso!");
}
