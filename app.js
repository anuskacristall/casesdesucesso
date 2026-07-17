// ==========================================================================
// SUPABASE CLOUD DATABASE CONFIGURATION
// ==========================================================================
// Se quiser usar banco de dados na nuvem (Supabase) para múltiplos usuários:
// Preencha as duas constantes abaixo com os dados do seu projeto Supabase.
// Se deixadas vazias, a plataforma usará automaticamente o LocalStorage do navegador.
// Read Supabase credentials from local config.js if available, otherwise default to empty strings
const SUPABASE_URL = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_URL) || ""; 
const SUPABASE_KEY = (window.SEBRAE_CONFIG && window.SEBRAE_CONFIG.SUPABASE_KEY) || ""; 

// Cliente Supabase global
let supabaseClient = null;
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
    titulo: "Horta Orgânica Escolar",
    descricao: "Projeto de fomento à alimentação saudável, cultivo agroecológico e espírito cooperativo escolar na região de Pouso Alegre.",
    municipio: "Pouso Alegre",
    regional: "Sul",
    mr: "MR Pouso Alegre",
    escola: "Colégio Municipal Dr. Ângelo",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    hasStudentCase: true,
    studentSummary: "Horta Orgânica Comunitária e Ecológica gerida integralmente pelos alunos, com venda direta em feira e doação a asilos locais.",
    studentContact: "hortasul@escolaangelo.edu.br",
    hasCoop: true,
    coopSummary: "Sicredi ministra oficinas mensais de cooperativismo de crédito e educação financeira, apoiando com insumos para a horta.",
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
    titulo: "Sabão Ecológico e Sustentável",
    descricao: "Desenvolvimento de produtos de limpeza sustentáveis a partir do reaproveitamento de óleos vegetais usados, fomentando o empreendedorismo ambiental.",
    municipio: "Montes Claros",
    regional: "Norte",
    mr: "MR Montes Claros",
    escola: "Instituto Federal do Norte de Minas (IFNMG)",
    tecnicoNome: "Clara Rocha",
    tecnicoEmail: "clara.rocha@sebraemg.com.br",
    tecnicoContato: "(38) 99911-2233",
    hasStudentCase: true,
    studentSummary: "Produção de Sabão Ecológico e velas aromatizadas a partir de óleo de fritura usado, recolhido em restaurantes parceiros da cidade.",
    studentContact: "sabaoecojovem@ifnmg.edu.br",
    hasCoop: true,
    coopSummary: "Apoio da Sicoob Credinor, promovendo mini-créditos simulados para aquisição de matéria-prima das equipes de estudantes.",
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
    titulo: "Jogos de Tabuleiro Históricos",
    descricao: "Fomento ao aprendizado dinâmico de história regional e educação financeira por meio da criação e jogabilidade de tabuleiros pedagógicos.",
    municipio: "Divinópolis",
    regional: "CentroOeste",
    mr: "MR Divinópolis",
    escola: "Escola Estadual Joaquim Nabuco",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    hasStudentCase: true,
    studentSummary: "Criação de Jogos de Tabuleiro didáticos sobre história regional e finanças, utilizados como dinâmica de aprendizado lúdico.",
    studentContact: "contato@tabuleirojovem.com.br",
    hasCoop: true,
    coopSummary: "Patrocínio do Sicoob Divicred para impressão física dos tabuleiros criados pelos estudantes.",
    edu70: "nao",
    hasLaw: true,
    lawSummary: "Lei municipal determina incentivos fiscais para empresas locais que patrocinarem projetos de empreendedorismo juvenil escolar.",
    hasCommittee: false,
    committeeSummary: "",
    hasIes: true,
    iesSummary: "Mentoria de design gráfico e regras de jogos com estudantes da UEMG Divinópolis.",
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
    titulo: "Brechó e Moda Circular",
    descricao: "Iniciativa de brechó estudantil e oficinas de customização de roupas escolares usadas, incentivando a redução do desperdício.",
    municipio: "Belo Horizonte",
    regional: "Centro",
    mr: "MR Belo Horizonte",
    escola: "Escola Municipal Fernando Dias",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    hasStudentCase: true,
    studentSummary: "Brechó e Customização de Roupas Escolares de segunda mão, promovendo consumo consciente e moda circular.",
    studentContact: "@brecho_fdias",
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
    titulo: "Artesanato e Resgate Cultural Indígena",
    descricao: "Projeto de resgate, valorização e empreendedorismo cultural com foco em artesanatos tradicionais e línguas nativas da região do Jequitinhonha.",
    escola: "Escola Estadual Xucuru Kariri",
    municipio: "Teófilo Otoni",
    regional: "Jequitinhonha/Mucuri",
    mr: "MR Teófilo Otoni",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    hasStudentCase: true,
    studentSummary: "Feira de artesanato estudantil indígena e produção de e-books de contos folclóricos locais, vendidos em benefício da comunidade escolar.",
    studentContact: "contato.xucuru@gmail.com",
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
    titulo: "Ecomodas e Customização Social",
    descricao: "Iniciativa de transformação de peças de vestuário descartadas ou doadas em roupas modernas e utilitárias de Governador Valadares.",
    escola: "Escola Estadual Professor Nelson de Sena",
    municipio: "Governador Valadares",
    regional: "Rio Doce",
    mr: "MR Governador Valadares",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    hasStudentCase: true,
    studentSummary: "Desenvolvimento de ecobags e mochilas escolares resistentes criadas a partir de calças jeans velhas descartadas.",
    studentContact: "@ecomodajovem_gv",
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
    titulo: "Fomento Agrícola e Compostagem do Cerrado",
    descricao: "Desenvolvimento de um polo escolar de compostagem e reciclagem de resíduos orgânicos coletados nas cantinas públicas da região de Patos de Minas.",
    escola: "Escola Municipal Marcolino de Barros",
    municipio: "Patos de Minas",
    regional: "Noroeste",
    mr: "MR Patos de Minas",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    hasStudentCase: true,
    studentSummary: "Produção de adubo orgânico de alta qualidade a partir de resíduos de comida, distribuído a agricultores familiares locais.",
    studentContact: "compostajovem@patos.gov.br",
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

// ==========================================================================
// SUPABASE DATABASE COLUMN MAPPING (PORTUGUESE COLUMN NAMES)
// ==========================================================================

function mapDatabaseToApp(dbItem) {
  if (!dbItem) return null;
  // If the database has student summary/contact from legacy format, default to estudante
  const inferredType = dbItem.tipo_case || (dbItem.estudante_possui || (dbItem.estudante_resumo && dbItem.estudante_resumo.trim()) ? 'estudante' : 'professor');
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
    // Keep this for legacy compatibility
    hasStudentCase: inferredType === 'estudante',
    studentSummary: dbItem.estudante_resumo || "",
    studentContact: dbItem.estudante_contato || "",
    
    // New fields
    tipoCase: inferredType,
    estudanteNome: dbItem.estudante_nome || "",
    estudanteEmail: dbItem.estudante_email || "",
    estudanteTelefone: dbItem.estudante_telefone || "",
    
    hasCoop: dbItem.cooperativa_possui || false,
    coopSummary: dbItem.cooperativa_resumo || "",
    edu70: dbItem.municipio_ee_70 || "nao",
    hasLaw: dbItem.lei_possui || false,
    lawSummary: dbItem.lei_resumo || "",
    hasCommittee: dbItem.comite_possui || false,
    committeeSummary: dbItem.comite_resumo || "",
    hasIes: dbItem.ies_possui || false,
    iesSummary: dbItem.ies_resumo || "",
    jeppStatus: dbItem.status_jepp || "Não"
  };
}

function mapAppToDatabase(appItem) {
  if (!appItem) return null;
  const inferredType = appItem.tipoCase || (appItem.hasStudentCase ? 'estudante' : 'professor');
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
    
    // Set for backward database fields compatibility
    estudante_possui: inferredType === 'estudante',
    estudante_resumo: appItem.studentSummary || "",
    estudante_contato: appItem.studentContact || "",
    
    // New columns mapping
    tipo_case: inferredType,
    estudante_nome: appItem.estudanteNome || "",
    estudante_email: appItem.estudanteEmail || "",
    estudante_telefone: appItem.estudanteTelefone || "",
    
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

async function init() {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
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
  if (SUPABASE_URL && SUPABASE_KEY && typeof supabase !== "undefined") {
    isCloudMode = true;
    updateDbStatus("connecting");
    
    try {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      
      // Fetch cases from Supabase
      const { data, error } = await supabaseClient
        .from('cases')
        .select('*');
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        cases = data.map(mapDatabaseToApp);
      } else {
        // If Supabase table is completely empty, insert seeds
        console.log("Banco de dados na nuvem vazio. Enviando cases semente...");
        
        // Resolve coordinates for seed cases before inserting
        const casesToInsert = SEED_CASES.map(item => {
          const coords = getCaseCoordinates(item);
          return {
            ...item,
            lat: coords.lat,
            lng: coords.lng
          };
        });
        
        const dbCasesToInsert = casesToInsert.map(mapAppToDatabase);
        
        const { error: insertError } = await supabaseClient
          .from('cases')
          .insert(dbCasesToInsert);
          
        if (insertError) throw insertError;
        cases = casesToInsert;
      }
      
      updateDbStatus("online");
      return;
    } catch (e) {
      console.error("Falha ao conectar com o Supabase. Usando LocalStorage de backup.", e);
      const errMsg = e.message || e.details || e.hint || String(e);
      showToast(`Erro na Nuvem: ${errMsg.substring(0, 45)}...`);
      
      isCloudMode = false;
      updateDbStatus("local", errMsg);
      loadLocalStorageFallback();
      return;
    }
  }
  
  // Fallback directly if credentials not filled or library not found
  isCloudMode = false;
  updateDbStatus("local", typeof supabase === "undefined" ? "Biblioteca Supabase (supabase.js) não foi carregada no index.html." : "");
  loadLocalStorageFallback();
}

function loadLocalStorageFallback() {
  const stored = localStorage.getItem("sebrae_success_cases");
  if (stored) {
    try {
      cases = JSON.parse(stored);
      if (!Array.isArray(cases) || cases.length === 0) {
        cases = [...SEED_CASES];
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
    lucide.createIcons({ node: badge });
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
        node: container
      });
    }
  });

  updateMapTilesForTheme();
}

function updateMapTilesForTheme() {
  if (!map) return;
  
  const isDark = document.body.classList.contains("dark-theme");
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }
  
  tileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);
}

// ==========================================================================
// RENDER MARKERS & PLOTTING WITH JITTERING
// ==========================================================================

function renderMarkers() {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  
  const searchVal = document.getElementById("search-city").value.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove accents
  const regionalFilter = document.getElementById("filter-regional").value;
  const typeFilter = document.getElementById("filter-type") ? document.getElementById("filter-type").value : "All";
  
  // Filter cases
  const filteredCases = cases.filter(item => {
    // City filter
    const normCity = item.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchesCity = !searchVal || normCity.includes(searchVal);
    
    // Regional filter
    const matchesRegional = regionalFilter === "All" || item.regional === regionalFilter;
    
    // Type filter
    const matchesType = typeFilter === "All" || item.tipoCase === typeFilter;
    
    return matchesCity && matchesRegional && matchesType;
  });

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
      node: container
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
  const searchVal = document.getElementById("search-city").value.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const regionalFilter = document.getElementById("filter-regional").value;
  const typeFilter = document.getElementById("filter-type") ? document.getElementById("filter-type").value : "All";
  
  // Current active filtered cases
  const filtered = cases.filter(item => {
    const normCity = item.municipio.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchesCity = !searchVal || normCity.includes(searchVal);
    const matchesRegional = regionalFilter === "All" || item.regional === regionalFilter;
    const matchesType = typeFilter === "All" || item.tipoCase === typeFilter;
    return matchesCity && matchesRegional && matchesType;
  });
  
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

  // Student Details box setup
  const studentBox = document.getElementById("details-student-box");
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
  lucide.createIcons({ node: document.getElementById("details-modal") });
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
  lucide.createIcons({ node: document.getElementById("case-type-modal") });
}

function closeCaseTypeModal() {
  document.getElementById("case-type-modal").classList.remove("active");
  document.getElementById("case-type-modal").style.display = "none";
}

function selectCaseType(type) {
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
  
  // Toggle student details conditional fieldset visibility based on register type
  const studentFieldset = document.getElementById("student-details-fieldset");
  if (studentFieldset) {
    if (currentRegisterType === 'estudante') {
      studentFieldset.style.display = "block";
      document.getElementById("form-estudante-nome").value = "";
      document.getElementById("form-estudante-email").value = "";
      document.getElementById("form-estudante-contato").value = "";
    } else {
      studentFieldset.style.display = "none";
    }
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
  const searchInput = document.getElementById("search-city");
  const searchList = document.getElementById("search-suggestions");
  
  const formInput = document.getElementById("form-municipio");
  const formList = document.getElementById("form-municipio-suggestions");
  
  // Autocomplete on search bar
  searchInput.addEventListener("input", () => {
    const val = searchInput.value.trim().toLowerCase();
    searchList.innerHTML = "";
    if (!val) {
      searchList.style.display = "none";
      renderDashboard(); // Re-render markers if clearing search
      return;
    }
    
    const matches = Object.keys(window.MUNICIPALITIES_DATABASE).filter(key => 
      key.includes(val) || window.MUNICIPALITIES_DATABASE[key].name.toLowerCase().includes(val)
    );
    
    if (matches.length > 0) {
      searchList.style.display = "block";
      matches.slice(0, 5).forEach(key => {
        const item = window.MUNICIPALITIES_DATABASE[key];
        const li = document.createElement("li");
        li.innerText = item.name;
        li.addEventListener("click", () => {
          searchInput.value = item.name;
          searchList.style.display = "none";
          renderDashboard();
          
          // Pan map to search target city
          map.setView([item.lat, item.lng], 11);
        });
        searchList.appendChild(li);
      });
    } else {
      searchList.style.display = "none";
    }
    renderDashboard(); // filter on typing
  });

  // Close search suggestions on outer click
  document.addEventListener("click", (e) => {
    if (e.target !== searchInput) {
      searchList.style.display = "none";
    }
    if (e.target !== formInput) {
      formList.style.display = "none";
    }
  });

  // Autocomplete on Register Form (with regional auto-fill!)
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
          regionalSelect.value = item.regional;
          
          // Fill suggested MR
          const mrInput = document.getElementById("form-mr");
          mrInput.value = `MR ${item.name}`;
        });
        formList.appendChild(li);
      });
    } else {
      formList.style.display = "none";
    }
  });
}

// ==========================================================================
// EVENT BINDINGS
// ==========================================================================

function bindEvents() {
  // Filters
  document.getElementById("filter-regional").addEventListener("change", () => {
    renderDashboard();
    
    // Zoom to regional center if selecting specific regional
    const selectedReg = document.getElementById("filter-regional").value;
    if (selectedReg !== "All" && window.REGIONAL_FALLBACK_COORDINATES[selectedReg]) {
      const regCoords = window.REGIONAL_FALLBACK_COORDINATES[selectedReg];
      map.setView([regCoords.lat, regCoords.lng], 8);
    } else {
      map.setView([-18.5, -44.5], 7); // reset view
    }
  });

  // Type filter binding
  const typeFilter = document.getElementById("filter-type");
  if (typeFilter) {
    typeFilter.addEventListener("change", renderDashboard);
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

  // Form switches bindings
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

  // Show a loading feedback on the submit button
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const origText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Salvando...';
  lucide.createIcons({ node: submitBtn });

  // Look up coordinates (dynamic Nominatim / static fallback)
  const coordsObj = await window.getMunicipalityCoordinates(municipio, regional);
  
  const newCase = {
    id: "case-" + Date.now(),
    municipio: coordsObj.name, // standardize name if matched in db
    regional,
    mr,
    escola,
    titulo,
    descricao,
    tecnicoNome,
    tecnicoEmail,
    tecnicoContato,
    
    // Type and student info
    tipoCase: currentRegisterType,
    estudanteNome,
    estudanteEmail,
    estudanteTelefone,
    
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
  if (isCloudMode && supabaseClient) {
    try {
      const dbCase = mapAppToDatabase(newCase);
      const { error } = await supabaseClient
        .from('cases')
        .insert([dbCase]);
        
      if (error) throw error;
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
  lucide.createIcons({ node: submitBtn });

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
  lucide.createIcons({ node: toast });
  
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
  
  if (email === "teste@sebraemg.com.br" && password === "teste123") {
    errorMsg.classList.remove("active");
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width: 18px; height: 18px;"></i> Entrando...';
    lucide.createIcons({ node: loginBtn });
    
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
