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
  // Nomes Oficiais SEBRAE MG
  "Centro": "#10B981",
  "Centro-Oeste e Sudoeste": "#F97316",
  "Jequitinhonha e Mucuri": "#84CC16",
  "Noroeste e Alto Paranaíba": "#8B5CF6",
  "Norte": "#F59E0B",
  "Rio Doce e Vale do Aço": "#EF4444",
  "Sul": "#3B82F6",
  "Triângulo": "#06B6D4",
  "Zona da Mata e Vertentes": "#EC4899",
  
  // Compatibilidade com chaves legadas
  "CentroOeste": "#F97316",
  "Centro-Oeste": "#F97316",
  "Noroeste": "#8B5CF6",
  "Rio Doce": "#EF4444",
  "Zona da Mata": "#EC4899",
  "Jequitinhonha/Mucuri": "#84CC16"
};

const REGIONAL_NAMES = {
  "Centro": "Centro",
  "Centro-Oeste e Sudoeste": "Centro-Oeste e Sudoeste",
  "Jequitinhonha e Mucuri": "Jequitinhonha e Mucuri",
  "Noroeste e Alto Paranaíba": "Noroeste e Alto Paranaíba",
  "Norte": "Norte",
  "Rio Doce e Vale do Aço": "Rio Doce e Vale do Aço",
  "Sul": "Sul",
  "Triângulo": "Triângulo",
  "Zona da Mata e Vertentes": "Zona da Mata e Vertentes",
  
  // Compatibilidade
  "CentroOeste": "Centro-Oeste e Sudoeste",
  "Centro-Oeste": "Centro-Oeste e Sudoeste",
  "Noroeste": "Noroeste e Alto Paranaíba",
  "Rio Doce": "Rio Doce e Vale do Aço",
  "Zona da Mata": "Zona da Mata e Vertentes",
  "Jequitinhonha/Mucuri": "Jequitinhonha e Mucuri"
};

const SEED_CASES = [
  {
    id: "seed-1",
    tipoCase: "estudante",
    titulo: "Lixeiras Inteligentes IoT",
    descricao: "Implantação de práticas de economia circular e sustentabilidade ecológica de forma interdisciplinar na rede de ensino de Belo Horizonte.",
    municipio: "Belo Horizonte",
    regional: "Centro",
    mr: "MR Grande Belo Horizonte",
    escola: "Escola Estadual Sebrae",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    estudanteNome: "Lucas Gabriel Ferreira",
    estudanteEmail: "lucas.ferreira@aluno.sebraemg.com.br",
    estudanteTelefone: "(31) 98765-1111",
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
    jeppStatus: "Sim",
    empresaNome: "SmartWaste Recicla",
    empresaTipo: "Tecnologia / Sustentabilidade e IoT",
    empresaDescricao: "Solução de lixeiras inteligentes conectadas com sensores ultrassônicos para monitoramento de descarte e gamificação de pontos trocáveis por materiais escolares.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
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
    nivel_ensino: "Fundamental",
    dependencia_adm: "Municipal",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    professorNome: "Profª. Camila Guimarães Silva",
    professorEmail: "camila.guimaraes@pousoalegre.mg.gov.br",
    professorTelefone: "(35) 99888-7766",
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
    jeppStatus: "Sim",
    empresaNome: "HortaViva Educacional",
    empresaTipo: "Agroecologia / Alimentação Saudável",
    empresaDescricao: "Metodologia pedagógica e minifazenda agroecológica com comercialização de hortaliças frescas para a comunidade e formação alimentar consciente.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-3",
    tipoCase: "estudante",
    titulo: "App Conecta Vizinhança",
    descricao: "Iniciativa de inovação social com foco em solidariedade intergeracional e desenvolvimento de competências tecnológicas e de programação em Uberlândia.",
    municipio: "Uberlândia",
    regional: "Triângulo",
    mr: "MR Uberlândia",
    escola: "Escola Municipal Messias Pedreiro",
    nivel_ensino: "Fundamental",
    dependencia_adm: "Municipal",
    tecnicoNome: "Fernando Cruz",
    tecnicoEmail: "fernando.cruz@sebraemg.com.br",
    tecnicoContato: "(34) 99122-3344",
    estudanteNome: "Beatriz Helena Costa",
    estudanteEmail: "beatriz.costa@escola.uberlandia.mg.gov.br",
    estudanteTelefone: "(34) 99122-3344",
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
    jeppStatus: "Sim",
    empresaNome: "Vizinho Solidário App",
    empresaTipo: "Inovação Social / Aplicativos Mobile",
    empresaDescricao: "Plataforma móvel colaborativa desenvolvida por estudantes para conectar voluntários jovens a idosos da comunidade que necessitam de suporte em tarefas cotidianas.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
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
    nivel_ensino: "Técnico",
    dependencia_adm: "Federal",
    tecnicoNome: "Clara Rocha",
    tecnicoEmail: "clara.rocha@sebraemg.com.br",
    tecnicoContato: "(38) 99911-2233",
    professorNome: "Prof. Carlos Eduardo Mendes",
    professorEmail: "carlos.mendes@ifnmg.edu.br",
    professorTelefone: "(38) 99876-5432",
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
    jeppStatus: "Parcial",
    empresaNome: "BioSabão EcoMinas",
    empresaTipo: "Química Sustentável / Saneantes Ecológicos",
    empresaDescricao: "Produção e comercialização pedagógica de sabão ecológico e bioinsumos biodegradáveis a partir do reaproveitamento de óleos vegetais residuais de restaurantes parceiros.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-5",
    tipoCase: "estudante",
    titulo: "Doces Saudáveis de Frutas Locais",
    descricao: "Projeto de capacitação em desidratação de frutas locais e produção de alimentos gourmet saudáveis no Vale do Aço.",
    municipio: "Ipatinga",
    regional: "Rio Doce e Vale do Aço",
    mr: "MR Ipatinga",
    escola: "Escola Estadual Alberto Giovannini",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    estudanteNome: "Mariana Alvarenga Santos",
    estudanteEmail: "mariana.santos@aluno.mg.gov.br",
    estudanteTelefone: "(31) 97555-0000",
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
    jeppStatus: "Sim",
    empresaNome: "Sabor do Vale Frutas Desidratadas",
    empresaTipo: "Alimentos Artesanais / Nutrição Saudável",
    empresaDescricao: "Produção e comercialização de doces e snacks naturais gourmet a partir de frutas locais desidratadas, servidos como alternativa nutritiva e saudável na escola e região.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-6",
    tipoCase: "professor",
    titulo: "Gamificação Pedagógica de História Regional",
    descricao: "Metodologia docente de ensino de história e finanças por meio de jogos de tabuleiro didáticos desenvolvidos por educadores para dinamizar a sala de aula.",
    municipio: "Divinópolis",
    regional: "Centro-Oeste e Sudoeste",
    mr: "MR Divinópolis",
    escola: "Escola Estadual Joaquim Nabuco",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    professorNome: "Prof. Marcelo Antunes Dias",
    professorEmail: "marcelo.antunes@educacao.mg.gov.br",
    professorTelefone: "(37) 98822-4455",
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
    jeppStatus: "Sim",
    empresaNome: "Ludus Histórica Jogos Educativos",
    empresaTipo: "Educação / Jogos e Gamificação",
    empresaDescricao: "Metodologia docente de ensino de história e educação financeira regional por meio de jogos de tabuleiro didáticos desenvolvidos em sala de aula.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-7",
    tipoCase: "estudante",
    titulo: "Costura Criativa e Reciclagem",
    descricao: "Cooperativa de costura focada na reciclagem de retalhos descartados por indústrias têxteis locais, promovendo a moda circular.",
    municipio: "Juiz de Fora",
    regional: "Zona da Mata e Vertentes",
    mr: "MR Juiz de Fora",
    escola: "Colégio de Aplicação João XXIII",
    nivel_ensino: "Médio",
    dependencia_adm: "Federal",
    tecnicoNome: "Beatriz Neves",
    tecnicoEmail: "beatriz.neves@sebraemg.com.br",
    tecnicoContato: "(32) 99988-1122",
    estudanteNome: "Letícia Ribeiro Prado",
    estudanteEmail: "leticia.prado@coljoaoxxiii.ufjf.br",
    estudanteTelefone: "(32) 99188-7766",
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
    jeppStatus: "Sim",
    empresaNome: "EcoCostura Fashion Upcycling",
    empresaTipo: "Moda Sustentável / Artesanato Têxtil",
    empresaDescricao: "Marca estudantil de ecobags, estojos e acessórios de vestuário criados exclusivamente com retalhos e sobras descartadas do polo confeccionista local.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-8",
    tipoCase: "estudante",
    titulo: "Mini-Agência de Ecoturismo",
    descricao: "Mini-agência escolar focada na valorização e mapeamento do potencial turístico, cultural e ecológico do Vale do Mucuri.",
    municipio: "Teófilo Otoni",
    regional: "Jequitinhonha e Mucuri",
    mr: "MR Teófilo Otoni",
    escola: "Escola Municipal Pastor Hollerbach",
    nivel_ensino: "Fundamental",
    dependencia_adm: "Municipal",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    estudanteNome: "Guilherme Sampaio Ramos",
    estudanteEmail: "guilherme.ramos@educa.teofilootoni.mg.gov.br",
    estudanteTelefone: "(33) 98844-3322",
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
    jeppStatus: "Sim",
    empresaNome: "Rota Verde Ecoturismo Escolar",
    empresaTipo: "Turismo Sustentável e Guiamento",
    empresaDescricao: "Mini-agência jovem idealizada por alunos para planejar e ofertar roteiros guiados de ecoturismo pelas belezas naturais e históricas do Vale do Mucuri.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-9",
    tipoCase: "estudante",
    titulo: "Mel Orgânico e Apicultura Escolar",
    descricao: "Projeto de apicultura pedagógica e cooperativa escolar de Paracatu, aliando ecologia e empreendedorismo rural.",
    municipio: "Paracatu",
    regional: "Noroeste e Alto Paranaíba",
    mr: "MR Paracatu",
    escola: "Escola Estadual Afonso Roquete",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    estudanteNome: "Rodrigo Mendonça Pinto",
    estudanteEmail: "rodrigo.mendonca@aluno.mg.gov.br",
    estudanteTelefone: "(38) 99733-2211",
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
    jeppStatus: "Parcial",
    empresaNome: "Mel do Vale Apicultura Jovem",
    empresaTipo: "Apicultura Sustentável / Alimentos Naturais",
    empresaDescricao: "Manejo responsável de abelhas nativas sem ferrão e extração de mel orgânico certificado com rotulagem personalizada produzida pelos estudantes.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-10",
    tipoCase: "professor",
    titulo: "Prática Docente de Economia Circular Escolar",
    descricao: "Projeto pedagógico interdisciplinar integrando matemática, artes e sustentabilidade a partir da cultura do reaproveitamento e oficinas de moda circular.",
    municipio: "Belo Horizonte",
    regional: "Centro",
    mr: "MR Grande Belo Horizonte",
    escola: "Escola Municipal Fernando Dias",
    nivel_ensino: "Fundamental",
    dependencia_adm: "Municipal",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    professorNome: "Profª. Juliana Martins Dutra",
    professorEmail: "juliana.dutra@pbh.gov.br",
    professorTelefone: "(31) 98666-5544",
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
    jeppStatus: "Sim",
    empresaNome: "Circula Moda Brechó Educativo",
    empresaTipo: "Economia Circular / Varejo Sustentável",
    empresaDescricao: "Laboratório pedagógico de moda sustentável e brechó comunitário que ensina consumo consciente, reparos de roupas e noções de precificação e fluxo de caixa.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-11",
    tipoCase: "estudante",
    titulo: "Clube Escolar de Robótica Agrícola",
    descricao: "Desenvolvimento de pequenos sensores automatizados e protótipos de irrigação sustentável com sucata eletrônica por alunos de Uberaba.",
    escola: "Escola Estadual Professor Chaves",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Uberaba",
    regional: "Triângulo",
    mr: "MR Uberaba",
    tecnicoNome: "Fernando Cruz",
    tecnicoEmail: "fernando.cruz@sebraemg.com.br",
    tecnicoContato: "(34) 99122-3344",
    estudanteNome: "Felipe Nogueira Borges",
    estudanteEmail: "felipe.borges@aluno.mg.gov.br",
    estudanteTelefone: "(34) 99233-1122",
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
    jeppStatus: "Sim",
    empresaNome: "AgroBot Automação Rural",
    empresaTipo: "Tecnologia Agrícola / Robótica e Automação",
    empresaDescricao: "Prototipagem de sistemas automatizados de irrigação com sensores de umidade de baixo custo voltados para a agricultura familiar do Triângulo.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-12",
    tipoCase: "professor",
    titulo: "Etnopedagogia e Empreendedorismo Cultural",
    descricao: "Prática pedagógica docente de valorização do patrimônio imaterial, línguas nativas e resgate da ancestralidade indígena do Vale do Mucuri aliada à economia criativa escolar.",
    escola: "Escola Estadual Xucuru Kariri",
    nivel_ensino: "Fundamental",
    dependencia_adm: "Estadual",
    municipio: "Teófilo Otoni",
    regional: "Jequitinhonha e Mucuri",
    mr: "MR Teófilo Otoni",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    professorNome: "Prof. Pajé Arakém Kariri",
    professorEmail: "arakem.kariri@educacao.mg.gov.br",
    professorTelefone: "(33) 99922-1133",
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
    jeppStatus: "Sim",
    empresaNome: "Arte Ancestral Xucuru",
    empresaTipo: "Economia Criativa / Artesanato Indígena",
    empresaDescricao: "Iniciativa pedagógica de etnoempreendedorismo valorizando a produção artesanal ancestral com biojoias e cerâmicas tradicionais com certificado de origem.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-13",
    tipoCase: "estudante",
    titulo: "Mini-Indústria de Sabores do Cerrado",
    descricao: "Produção cooperativa de doces, geleias e panificações utilizando frutos típicos do Cerrado, promovendo o beneficiamento alimentar rural e empreendedorismo sustentável.",
    escola: "Escola Estadual Dona Guiomar de Melo",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Patos de Minas",
    regional: "Noroeste e Alto Paranaíba",
    mr: "MR Patos de Minas",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    estudanteNome: "Amanda Caroline Soares",
    estudanteEmail: "amanda.soares@aluno.mg.gov.br",
    estudanteTelefone: "(34) 98855-6677",
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
    jeppStatus: "Sim",
    empresaNome: "Delícias do Cerrado Mineiro",
    empresaTipo: "Gastronomia Regional / Agroindústria Artesanal",
    empresaDescricao: "Mini-agroindústria escolar para produção de geleias, pastas e farinhas enriquecidas a partir de frutos nativos do Cerrado como pequi, jatobá e baru.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-14",
    tipoCase: "estudante",
    titulo: "Fábrica Jovem de Velas Ecológicas",
    descricao: "Desenvolvimento de velas de cera de soja e aromas naturais da Mata Atlântica, reduzindo o uso de parafinas derivadas do petróleo.",
    escola: "Escola Estadual Professor Mário Casassanta",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "São João del-Rei",
    regional: "Zona da Mata e Vertentes",
    mr: "MR São João Del Rei",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    estudanteNome: "Thiago Augusto Resende",
    estudanteEmail: "thiago.resende@aluno.mg.gov.br",
    estudanteTelefone: "(32) 99811-2244",
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
    jeppStatus: "Parcial",
    empresaNome: "Luz Criativa Velas Aromáticas",
    empresaTipo: "Velas Artesanais / Decoração Sustentável",
    empresaDescricao: "Produção sustentável de velas aromatizadas terapêuticas feitas com cera de soja ecológica e essências de flores típicas das vertentes mineiras.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-15",
    tipoCase: "estudante",
    titulo: "Laboratório de Economia Circular de Papel",
    descricao: "Oficina escolar de reciclagem e produção de papéis artesanais a partir de aparas de papelão e embalagens coletadas em comércios de Varginha.",
    escola: "Escola Estadual Deputado Domingos de Figueiredo",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Varginha",
    regional: "Sul",
    mr: "MR Varginha",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    estudanteNome: "Larissa Bueno Carvalho",
    estudanteEmail: "larissa.carvalho@aluno.mg.gov.br",
    estudanteTelefone: "(35) 99199-8877",
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
    jeppStatus: "Sim",
    empresaNome: "Papel Vivo Cadernos Artesanais",
    empresaTipo: "Papelaria Artesanal / Reciclagem de Papel",
    empresaDescricao: "Oficina escolar de reaproveitamento de papel sulfite usado na escola para confecção de cadernos artesanais e cartões com sementes germináveis.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-16",
    tipoCase: "professor",
    titulo: "Design Sustentável e Upcycling na Educação",
    descricao: "Metodologia docente integrando formação profissionalizante e design ecológico, capacitando turmas na transformação de resíduos da indústria têxtil e de confecção.",
    escola: "Escola Estadual Professor Nelson de Sena",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Governador Valadares",
    regional: "Rio Doce e Vale do Aço",
    mr: "MR Governador Valadares",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    professorNome: "Profª. Renata Silveira Castro",
    professorEmail: "renata.castro@educacao.mg.gov.br",
    professorTelefone: "(33) 98777-6655",
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
    jeppStatus: "Sim",
    empresaNome: "UpDesign Mobiliário Escolar Sustentável",
    empresaTipo: "Design Sustentável / Mobiliário e Upcycling",
    empresaDescricao: "Oficina docente de upcycling e design sustentável que transforma resíduos têxteis e madeiras de descarte em peças de mobiliário e utilitários escolares.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-17",
    tipoCase: "estudante",
    titulo: "Horta Hidropônica Inteligente",
    descricao: "Projeto de agricultura urbana e cultivo sustentável automatizado usando hidroponia vertical e IoT na rede pública de Betim.",
    escola: "Escola Estadual Virgílio de Melo Franco",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Betim",
    regional: "Centro",
    mr: "MR Das Indústrias",
    tecnicoNome: "Amanda Souza",
    tecnicoEmail: "amanda.souza@sebraemg.com.br",
    tecnicoContato: "(31) 98765-4321",
    estudanteNome: "Gabriel Henrique Moreira",
    estudanteEmail: "gabriel.moreira@aluno.mg.gov.br",
    estudanteTelefone: "(31) 99344-5566",
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
    jeppStatus: "Sim",
    empresaNome: "HidroSmart Folhosas Urbanas",
    empresaTipo: "Horticultura Tecnológica / Hidroponia",
    empresaDescricao: "Cultivo inteligente de alfaces e temperos hidropônicos com recirculação de água controlada por Arduino e abastecimento da merenda escolar comunitária.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-18",
    tipoCase: "estudante",
    titulo: "Fábrica Jovem de Briquetes Ecológicos",
    descricao: "Produção de biomassa compactada (briquetes) para lareiras e churrasqueiras a partir de serragem descartada por serrarias e marcenarias locais.",
    escola: "Escola Estadual Dom João Antônio dos Santos",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Diamantina",
    regional: "Jequitinhonha e Mucuri",
    mr: "MR Diamantina",
    tecnicoNome: "Samuel Santos",
    tecnicoEmail: "samuel.santos@sebraemg.com.br",
    tecnicoContato: "(33) 98444-5566",
    estudanteNome: "Otávio Pereira Cunha",
    estudanteEmail: "otavio.cunha@aluno.mg.gov.br",
    estudanteTelefone: "(38) 99888-3311",
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
    jeppStatus: "Sim",
    empresaNome: "EcoBriquetes Diamantina",
    empresaTipo: "Energia Renovável / Biomassa Sustentável",
    empresaDescricao: "Prensagem mecânica de serragem vegetal e resíduos secos locais para fabricação de briquetes ecológicos substitutos do carvão vegetal comum.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-19",
    tipoCase: "estudante",
    titulo: "Startup Escolar Eco-Copos",
    descricao: "Desenvolvimento e fabricação de copos biodegradáveis a partir de fibras da casca de coco e mandioca, reduzindo plásticos de uso único.",
    escola: "Escola Estadual Professor Nelson de Sena",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Governador Valadares",
    regional: "Rio Doce e Vale do Aço",
    mr: "MR Governador Valadares",
    tecnicoNome: "Marcos Oliveira",
    tecnicoEmail: "marcos.oliveira@sebraemg.com.br",
    tecnicoContato: "(31) 97555-4433",
    estudanteNome: "Sofia Vasconcelos Lima",
    estudanteEmail: "sofia.lima@aluno.mg.gov.br",
    estudanteTelefone: "(33) 99122-8899",
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
    jeppStatus: "Sim",
    empresaNome: "Copos da Terra Biodegradáveis",
    empresaTipo: "Embalagens Ecológicas / Biomateriais",
    empresaDescricao: "Desenvolvimento de copos e tigelas 100% biodegradáveis com base em fécula de mandioca e fibras vegetais para eliminar recipientes plásticos na escola.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-20",
    tipoCase: "estudante",
    titulo: "Cooperativa Jovem de Games de Educação",
    descricao: "Criação de jogos eletrônicos interativos para alfabetização matemática e financeira nas séries iniciais do ensino fundamental de Divinópolis.",
    escola: "Escola Estadual Dona Antonieta Fonseca",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Divinópolis",
    regional: "Centro-Oeste e Sudoeste",
    mr: "MR Divinópolis",
    tecnicoNome: "Patrícia Lima",
    tecnicoEmail: "patricia.lima@sebraemg.com.br",
    tecnicoContato: "(37) 98822-1100",
    estudanteNome: "Matheus Vieira Barreto",
    estudanteEmail: "matheus.barreto@aluno.mg.gov.br",
    estudanteTelefone: "(37) 99933-2244",
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
    jeppStatus: "Sim",
    empresaNome: "EduGamer Studio Cooperativo",
    empresaTipo: "Desenvolvimento de Jogos Digitais",
    empresaDescricao: "Startup cooperativa estudantil que desenvolve jogos digitais educativos e gamificados sobre história mineira, ecologia e matemática financeira.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-21",
    tipoCase: "professor",
    titulo: "Compostagem Pedagógica e Ciências do Solo",
    descricao: "Projeto docente interdisciplinar articulando biologia, ciências agrícolas e sustentabilidade alimentar por meio de polo escolar de compostagem e reciclagem de resíduos orgânicos.",
    escola: "Escola Municipal Marcolino de Barros",
    nivel_ensino: "Fundamental",
    dependencia_adm: "Municipal",
    municipio: "Patos de Minas",
    regional: "Noroeste e Alto Paranaíba",
    mr: "MR Patos de Minas",
    tecnicoNome: "Denise Mendes",
    tecnicoEmail: "denise.mendes@sebraemg.com.br",
    tecnicoContato: "(38) 99222-8899",
    professorNome: "Profª. Eliane Cristina Faria",
    professorEmail: "eliane.faria@patosdeminas.mg.gov.br",
    professorTelefone: "(34) 99655-4433",
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
    jeppStatus: "Sim",
    empresaNome: "Adubo Verde Fertilizantes Orgânicos",
    empresaTipo: "Biofertilizantes / Gestão de Resíduos Orgânicos",
    empresaDescricao: "Projeto pedagógico docente de compostagem acelerada de resíduos da merenda gerando adubo natural de alta qualidade para hortas e pequenos produtores.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
  },
  {
    id: "seed-22",
    tipoCase: "estudante",
    titulo: "Clube de Sabores Gourmet Saudáveis",
    descricao: "Oficinas estudantis de culinária saudável e reaproveitamento integral de cascas e talos, estimulando a alimentação consciente e finanças culinárias.",
    escola: "Escola Estadual Padre Alberto Fuger",
    nivel_ensino: "Médio",
    dependencia_adm: "Estadual",
    municipio: "Campo Belo",
    regional: "Sul",
    mr: "MR Lavras",
    tecnicoNome: "Roberto Fonseca",
    tecnicoEmail: "roberto.fonseca@sebraemg.com.br",
    tecnicoContato: "(35) 99888-7766",
    estudanteNome: "Clara Beatriz Guimarães",
    estudanteEmail: "clara.guimaraes@aluno.mg.gov.br",
    estudanteTelefone: "(35) 99877-6655",
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
    jeppStatus: "Sim",
    empresaNome: "Sabor & Saúde Pães e Lanches",
    empresaTipo: "Panificação Saudável / Alimentação Escolar",
    empresaDescricao: "Empreendimento escolar de panificação artesanal saudável com produtos integrais, frutas da estação e geleias de cascas para cantinas e feiras.",
    convenio_sebrae: true,
    parceria_superintendencia: true,
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
  
  let profNome = dbItem.professor_nome || dbItem.professorNome || "";
  let profEmail = dbItem.professor_email || dbItem.professorEmail || "";
  let profTel = dbItem.professor_telefone || dbItem.professorTelefone || "";
  
  if (!profNome && dbItem.estudante_resumo && dbItem.estudante_resumo.startsWith("Professor:")) {
    const match = dbItem.estudante_resumo.match(/^Professor:\s*([^(]+)(?:\(([^ -]+)?\s*-\s*([^)]+)?\))?/);
    if (match) {
      profNome = match[1] ? match[1].trim() : "";
      profEmail = match[2] ? match[2].trim() : "";
      profTel = match[3] ? match[3].trim() : "";
    }
  }

  let studNome = dbItem.estudante_nome || dbItem.estudanteNome || "";
  let studEmail = dbItem.estudante_email || dbItem.estudanteEmail || "";
  let studTel = dbItem.estudante_telefone || dbItem.estudanteTelefone || dbItem.estudante_contato || "";

  // Seed enrichment fallback
  const seedMatch = typeof SEED_CASES !== "undefined" ? SEED_CASES.find(s => String(s.id) === String(dbItem.id)) : null;
  if (seedMatch) {
    if (!profNome && seedMatch.professorNome) profNome = seedMatch.professorNome;
    if (!profEmail && seedMatch.professorEmail) profEmail = seedMatch.professorEmail;
    if (!profTel && seedMatch.professorTelefone) profTel = seedMatch.professorTelefone;
    if (!studNome && seedMatch.estudanteNome) studNome = seedMatch.estudanteNome;
    if (!studEmail && seedMatch.estudanteEmail) studEmail = seedMatch.estudanteEmail;
    if (!studTel && seedMatch.estudanteTelefone) studTel = seedMatch.estudanteTelefone;
    if (!dbItem.empresa_nome && seedMatch.empresaNome) dbItem.empresa_nome = seedMatch.empresaNome;
    if (!dbItem.empresa_tipo && seedMatch.empresaTipo) dbItem.empresa_tipo = seedMatch.empresaTipo;
    if (!dbItem.empresa_descricao && seedMatch.empresaDescricao) dbItem.empresa_descricao = seedMatch.empresaDescricao;
    if (!dbItem.nivel_ensino && seedMatch.nivel_ensino) dbItem.nivel_ensino = seedMatch.nivel_ensino;
    if (!dbItem.dependencia_adm && seedMatch.dependencia_adm) dbItem.dependencia_adm = seedMatch.dependencia_adm;
  }

  const normCityKey = (dbItem.municipio || "").trim().toLowerCase().replace(/-/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const officialCity = (typeof window !== "undefined" && window.MUNICIPALITIES_DATABASE && window.MUNICIPALITIES_DATABASE[normCityKey]) ? window.MUNICIPALITIES_DATABASE[normCityKey] : null;

  const resolvedRegional = officialCity ? officialCity.regional : (REGIONAL_NAMES[dbItem.regional] || dbItem.regional || "");
  const resolvedMr = officialCity ? (officialCity.mr.startsWith("MR ") ? officialCity.mr : `MR ${officialCity.mr}`) : (dbItem.microrregiao_mr || "");
  const resolvedLat = officialCity ? officialCity.lat : dbItem.latitude;
  const resolvedLng = officialCity ? officialCity.lng : dbItem.longitude;

  return {
    id: dbItem.id,
    titulo: dbItem.titulo_projeto || dbItem.titulo || "",
    descricao: dbItem.descricao_geral || dbItem.descricao || "",
    municipio: dbItem.municipio || (officialCity ? officialCity.name : ""),
    regional: resolvedRegional,
    mr: resolvedMr,
    escola: dbItem.escola_instituicao || dbItem.escola || "",
    lat: resolvedLat,
    lng: resolvedLng,
    tecnicoNome: dbItem.tecnico_nome || dbItem.tecnicoNome || "",
    tecnicoEmail: dbItem.tecnico_email || dbItem.tecnicoEmail || "",
    tecnicoContato: dbItem.tecnico_telefone || dbItem.tecnicoContato || "",
    
    // Legacy compatibility
    hasStudentCase: inferredType === 'estudante',
    studentSummary: dbItem.estudante_resumo || "",
    studentContact: dbItem.estudante_contato || "",
    
    // Type and contact fields (dual casing)
    tipoCase: inferredType,
    tipo_case: inferredType,
    estudanteNome: studNome,
    estudante_nome: studNome,
    estudanteEmail: studEmail,
    estudante_email: studEmail,
    estudanteTelefone: studTel,
    estudante_telefone: studTel,
    
    professorNome: profNome,
    professor_nome: profNome,
    professorEmail: profEmail,
    professor_email: profEmail,
    professorTelefone: profTel,
    professor_telefone: profTel,
    
    hasCoop: dbItem.cooperativa_possui || false,
    coopSummary: dbItem.cooperativa_resumo || "",
    edu70: dbItem.municipio_ee_70 || "nao",
    hasLaw: dbItem.lei_possui || false,
    lawSummary: dbItem.lei_resumo || "",
    hasCommittee: dbItem.comite_possui || false,
    committeeSummary: dbItem.comite_resumo || "",
    hasIes: dbItem.ies_possui || false,
    iesSummary: dbItem.ies_resumo || "",
    hasEmpresaSimulada: dbItem.empresa_simulada || dbItem.empresa_simulada_possui || false,
    hasEscolaSebrae: dbItem.escola_sebrae || dbItem.escola_sebrae_possui || false,
    convenio_sebrae: dbItem.convenio_sebrae || dbItem.hasConvenioSebrae || false,
    hasConvenioSebrae: dbItem.convenio_sebrae || dbItem.hasConvenioSebrae || false,
    parceria_superintendencia: dbItem.parceria_superintendencia || dbItem.hasParceriaSuperintendencia || false,
    hasParceriaSuperintendencia: dbItem.parceria_superintendencia || dbItem.hasParceriaSuperintendencia || false,
    empresaNome: dbItem.empresa_nome || dbItem.empresaNome || "",
    empresa_nome: dbItem.empresa_nome || dbItem.empresaNome || "",
    empresaTipo: dbItem.empresa_tipo || dbItem.empresaTipo || "",
    empresa_tipo: dbItem.empresa_tipo || dbItem.empresaTipo || "",
    empresaDescricao: dbItem.empresa_descricao || dbItem.empresaDescricao || "",
    empresa_descricao: dbItem.empresa_descricao || dbItem.empresaDescricao || "",
    nivel_ensino: dbItem.nivel_ensino || "",
    dependencia_adm: dbItem.dependencia_adm || "",
    jeppStatus: dbItem.status_jepp || "Não",
    status: dbItem.status || "approved",
    request_code: dbItem.request_code || "",
    indice_desenvolvimento: dbItem.indice_desenvolvimento || null,
    indice_pontuacao: dbItem.indice_pontuacao ?? null,
    indice_percentual: dbItem.indice_percentual ?? null,
    indice_classificacao: dbItem.indice_classificacao || "",
    indice_classificacao_key: dbItem.indice_classificacao_key || ""
  };
}

function mapAppToDatabase(appItem) {
  if (!appItem) return null;
  const isEstudante = appItem.tipoCase === 'estudante' || appItem.tipo_case === 'estudante' || appItem.estudante_possui;
  let resumo = appItem.studentSummary || appItem.estudante_resumo || "";
  let contato = isEstudante ? (appItem.studentContact || appItem.estudanteTelefone || appItem.estudante_telefone || "") : (appItem.professorTelefone || appItem.professor_telefone || "");
  
  const profNome = appItem.professorNome || appItem.professor_nome || "";
  const profEmail = appItem.professorEmail || appItem.professor_email || "";
  const profTel = appItem.professorTelefone || appItem.professor_telefone || "";

  const studNome = appItem.estudanteNome || appItem.estudante_nome || "";
  const studEmail = appItem.estudanteEmail || appItem.estudante_email || "";
  const studTel = appItem.estudanteTelefone || appItem.estudante_telefone || appItem.studentContact || "";

  if (!isEstudante && (profNome || profEmail || profTel)) {
    resumo = `Professor: ${profNome} (${profEmail} - ${profTel})`;
  }
  
  return {
    id: appItem.id,
    titulo_projeto: appItem.titulo || appItem.titulo_projeto || "",
    descricao_geral: appItem.descricao || appItem.descricao_geral || "",
    municipio: appItem.municipio || "",
    regional: appItem.regional || "",
    microrregiao_mr: appItem.mr || appItem.microrregiao_mr || "",
    escola_instituicao: appItem.escola || appItem.escola_instituicao || "",
    nivel_ensino: appItem.nivel_ensino || "",
    dependencia_adm: appItem.dependencia_adm || "",
    latitude: appItem.lat || appItem.latitude,
    longitude: appItem.lng || appItem.longitude,
    tecnico_nome: appItem.tecnicoNome || appItem.tecnico_nome || "",
    tecnico_email: appItem.tecnicoEmail || appItem.tecnico_email || "",
    tecnico_telefone: appItem.tecnicoContato || appItem.tecnico_telefone || "",
    tipo_case: isEstudante ? 'estudante' : 'professor',
    tipoCase: isEstudante ? 'estudante' : 'professor',
    professor_nome: profNome,
    professor_email: profEmail,
    professor_telefone: profTel,
    professorNome: profNome,
    professorEmail: profEmail,
    professorTelefone: profTel,
    estudante_nome: studNome,
    estudante_email: studEmail,
    estudante_telefone: studTel,
    estudanteNome: studNome,
    estudanteEmail: studEmail,
    estudanteTelefone: studTel,
    estudante_possui: isEstudante,
    estudante_resumo: resumo,
    estudante_contato: contato,
    empresa_nome: appItem.empresaNome || appItem.empresa_nome || "",
    empresa_tipo: appItem.empresaTipo || appItem.empresa_tipo || "",
    empresa_descricao: appItem.empresaDescricao || appItem.empresa_descricao || "",
    empresaNome: appItem.empresaNome || appItem.empresa_nome || "",
    empresaTipo: appItem.empresaTipo || appItem.empresa_tipo || "",
    empresaDescricao: appItem.empresaDescricao || appItem.empresa_descricao || "",
    convenio_sebrae: appItem.convenio_sebrae || appItem.hasConvenioSebrae || false,
    parceria_superintendencia: appItem.parceria_superintendencia || appItem.hasParceriaSuperintendencia || false,
    cooperativa_possui: appItem.hasCoop || appItem.cooperativa_possui || false,
    cooperativa_resumo: appItem.coopSummary || appItem.cooperativa_resumo || "",
    municipio_ee_70: appItem.edu70 || appItem.municipio_ee_70 || "nao",
    lei_possui: appItem.hasLaw || appItem.lei_possui || false,
    lei_resumo: appItem.lawSummary || appItem.lei_resumo || "",
    comite_possui: appItem.hasCommittee || appItem.comite_possui || false,
    comite_resumo: appItem.committeeSummary || appItem.comite_resumo || "",
    ies_possui: appItem.hasIes || appItem.ies_possui || false,
    ies_resumo: appItem.iesSummary || appItem.ies_resumo || "",
    empresa_simulada: appItem.hasEmpresaSimulada || appItem.empresa_simulada || false,
    escola_sebrae: appItem.hasEscolaSebrae || appItem.escola_sebrae || false,
    status_jepp: appItem.jeppStatus || appItem.status_jepp || "Não"
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

  // 1. First attempt via server API proxy (which consolidates Supabase, enriched overrides, index, and extra cases)
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

  // 2. Next attempt direct connection to Supabase Cloud REST API
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
      console.warn("Conexão direta com o Supabase falhou, tentando fallback local...", err);
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

  // Reset zoom button controller
  setupResetZoomController();
}

function setupResetZoomController() {
  const resetZoomBtn = document.getElementById("btn-reset-map-zoom");
  if (!resetZoomBtn || !map) return;

  function checkMapZoomState() {
    const currentZoom = map.getZoom();

    // Show button strictly when user zooms in beyond the default zoom 7
    if (currentZoom > 7) {
      resetZoomBtn.classList.add("visible");
    } else {
      resetZoomBtn.classList.remove("visible");
    }
  }

  // Listen strictly to zoom changes (not panning/moving sideways)
  map.on("zoomend", checkMapZoomState);

  resetZoomBtn.addEventListener("click", () => {
    map.flyTo([-18.5, -44.5], 7, { duration: 0.8 });
    resetZoomBtn.classList.remove("visible");
  });
}

function updateMapTilesForTheme() {
  if (!map) return;
  
  const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
    
  if (tileLayer) {
    map.removeLayer(tileLayer);
  }
  
  tileLayer = L.tileLayer(tileUrl, {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19
  }).addTo(map);
}


// ==========================================================================
// UNIFIED LOCATION ENTITIES & FILTER HELPERS
// ==========================================================================

function getAllLocationEntities() {
  const list = [];
  
  // 1. Regionais SEBRAE - Apenas as que possuem pelo menos 1 case cadastrado
  const regKeys = ["CentroOeste", "Centro", "Noroeste", "Triângulo", "Norte", "Rio Doce", "Sul", "Zona da Mata", "Jequitinhonha/Mucuri"];
  
  // Mapeia as regionais presentes nos cases cadastrados (normalizadas)
  const regionalsWithCases = new Set();
  if (Array.isArray(cases)) {
    cases.forEach(c => {
      if (c.regional && typeof c.regional === 'string' && c.regional.trim()) {
        regionalsWithCases.add(c.regional.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
      }
    });
  }

  regKeys.forEach(k => {
    const label = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[k]) || k;
    const normKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const normLabel = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Inclui na busca somente se houver pelo menos um case cadastrado nesta regional
    const hasCase = regionalsWithCases.has(normKey) || regionalsWithCases.has(normLabel);
    if (!hasCase) {
      return;
    }

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

  // 3. Municípios - Apenas os que possuem case cadastrado associado
  const seenMuns = new Set();
  cases.forEach(c => {
    if (c.municipio && c.municipio.trim()) {
      const normKey = c.municipio.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!seenMuns.has(normKey)) {
        seenMuns.add(normKey);
        const regLabel = (window.REGIONAL_NAMES && window.REGIONAL_NAMES[c.regional]) || c.regional || "";
        
        let lat = c.lat;
        let lng = c.lng;
        if ((!lat || !lng) && window.MUNICIPALITIES_DATABASE && window.MUNICIPALITIES_DATABASE[normKey]) {
          lat = window.MUNICIPALITIES_DATABASE[normKey].lat;
          lng = window.MUNICIPALITIES_DATABASE[normKey].lng;
        }

        list.push({
          id: `mun:${normKey}`,
          type: 'municipio',
          name: c.municipio.trim(),
          val: normKey,
          lat: lat,
          lng: lng,
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
  // 1. Type filter (case-insensitive check for 'all')
  if (typeFilter && typeFilter.toLowerCase() !== "all" && item.tipoCase !== typeFilter.toLowerCase()) {
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
  if (item && item.municipio) {
    const normalizedKey = item.municipio.trim().toLowerCase()
      .replace(/-/g, " ")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
    if (typeof window !== "undefined" && window.MUNICIPALITIES_DATABASE && window.MUNICIPALITIES_DATABASE[normalizedKey]) {
      return window.MUNICIPALITIES_DATABASE[normalizedKey];
    }
  }

  // Check if case has custom stored coordinates
  if (item && item.lat && item.lng) {
    return { lat: item.lat, lng: item.lng };
  }
  
  // Fallback to regional coordinates
  const regKey = (item && (REGIONAL_NAMES[item.regional] || item.regional)) || "Centro";
  if (typeof window !== "undefined" && window.REGIONAL_FALLBACK_COORDINATES && window.REGIONAL_FALLBACK_COORDINATES[regKey]) {
    return window.REGIONAL_FALLBACK_COORDINATES[regKey];
  }
  
  return { lat: -19.9191, lng: -43.9378 }; // Belo Horizonte default fallback
}

function calculateMunicipioDevelopmentIndex(item) {
  if (!item) return null;
  // If precalculated from API with all criteria, return it
  if (item.indice_desenvolvimento && Array.isArray(item.indice_desenvolvimento.criterios)) {
    return item.indice_desenvolvimento;
  }

  const isAffirmative = (v) => {
    if (v === true || v === 1) return true;
    const s = String(v || "").trim().toLowerCase();
    return s === "sim" || s === "true" || s === "1" || s === "total" || s === "sim (total)" || s === "parcial";
  };

  const isJeppAttended = (v) => {
    const s = String(v || "").trim().toLowerCase();
    return s === "sim" || s === "true" || s === "1" || s === "total" || s === "sim (total)" || s === "parcial";
  };

  const criteriaDefs = [
    {
      ordem: 1,
      ordem_str: "1º",
      nome: "Possui Educação Empreendedora em mais de 70% do município",
      identificador: "educacao_70_porcento",
      peso: 10,
      atendido: isAffirmative(item.educacao_70_porcento) || isAffirmative(item.municipio_ee_70) || isAffirmative(item.edu70)
    },
    {
      ordem: 2,
      ordem_str: "2º",
      nome: "JEPP no município",
      identificador: "jepp_municipio",
      peso: 9,
      atendido: isJeppAttended(item.jepp_municipio) || isJeppAttended(item.status_jepp) || isJeppAttended(item.jeppStatus)
    },
    {
      ordem: 3,
      ordem_str: "3º",
      nome: "Convênio / termo de parceria",
      identificador: "convenio_parceria",
      peso: 8,
      atendido: isAffirmative(item.convenio_parceria) || isAffirmative(item.convenio_sebrae) || isAffirmative(item.hasConvenioSebrae)
    },
    {
      ordem: 4,
      ordem_str: "4º",
      nome: "Comitê e ações conjuntas",
      identificador: "comite_acoes_conjuntas",
      peso: 7,
      atendido: isAffirmative(item.comite_acoes_conjuntas) || isAffirmative(item.comite_possui) || isAffirmative(item.hasCommittee)
    },
    {
      ordem: 5,
      ordem_str: "5º",
      nome: "Parceria com instituição de ensino superior",
      identificador: "parceria_ies",
      peso: 6,
      atendido: isAffirmative(item.parceria_ies) || isAffirmative(item.ies_possui) || isAffirmative(item.hasIes)
    },
    {
      ordem: 6,
      ordem_str: "6º",
      nome: "Empresa simulada",
      identificador: "empresa_simulada",
      peso: 5,
      atendido: isAffirmative(item.empresa_simulada) || isAffirmative(item.empresa_simulada_possui) || isAffirmative(item.hasEmpresaSimulada)
    },
    {
      ordem: 7,
      ordem_str: "7º",
      nome: "Sistema de ensino Escola do Sebrae",
      identificador: "escola_sebrae",
      peso: 4,
      atendido: isAffirmative(item.escola_sebrae) || isAffirmative(item.escola_sebrae_possui) || isAffirmative(item.hasEscolaSebrae)
    },
    {
      ordem: 8,
      ordem_str: "8º",
      nome: "Cooperativa de crédito",
      identificador: "cooperativa_credito",
      peso: 3,
      atendido: isAffirmative(item.cooperativa_credito) || isAffirmative(item.cooperativa_possui) || isAffirmative(item.hasCoop)
    },
    {
      ordem: 9,
      ordem_str: "9º",
      nome: "Parceria com superintendência de ensino",
      identificador: "parceria_superintendencia",
      peso: 2,
      atendido: isAffirmative(item.parceria_superintendencia) || isAffirmative(item.hasParceriaSuperintendencia)
    },
    {
      ordem: 10,
      ordem_str: "10º",
      nome: "Lei da educação empreendedora",
      identificador: "lei_educacao_empreendedora",
      peso: 1,
      atendido: isAffirmative(item.lei_educacao_empreendedora) || isAffirmative(item.lei_possui) || isAffirmative(item.hasLaw)
    }
  ];

  let pontuacaoBruta = 0;
  const criterios = criteriaDefs.map(c => {
    const pontos = c.atendido ? c.peso : 0;
    pontuacaoBruta += pontos;
    return {
      ...c,
      pontos
    };
  });

  const percentual = Math.round((pontuacaoBruta / 55.0) * 1000) / 10;
  let classificacao = "Início";
  let classificacaoKey = "inicio";

  if (pontuacaoBruta <= 21) {
    classificacao = "Início";
    classificacaoKey = "inicio";
  } else if (pontuacaoBruta <= 38) {
    classificacao = "Em Desenvolvimento";
    classificacaoKey = "em_desenvolvimento";
  } else {
    classificacao = "Desenvolvido";
    classificacaoKey = "desenvolvido";
  }

  return {
    pontuacao: pontuacaoBruta,
    pontuacao_maxima: 55,
    percentual,
    classificacao,
    classificacao_key: classificacaoKey,
    criterios
  };
}

function createQuickLookCard(item) {
  const container = document.createElement("div");
  container.className = "popup-card";
  
  const regionalLabel = REGIONAL_NAMES[item.regional] || item.regional;
  const desc = item.descricao || item.studentSummary || "Sem descrição cadastrada.";
  const descriptionSnippet = desc.substring(0, 100) + (desc.length > 100 ? "..." : "");
  
  const typeLabelStr = item.tipoCase === "estudante" ? "Estudante Empreendedor" : "Professor";
  const typeBadgeStyle = item.tipoCase === "estudante" 
    ? "background-color: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2);" 
    : "background-color: rgba(0, 84, 166, 0.1); color: var(--sebrae-blue); border: 1px solid rgba(0, 84, 166, 0.2);";
    
  const devIdx = calculateMunicipioDevelopmentIndex(item);
  const devBadgeStyle = devIdx.classificacao_key === 'inicio'
    ? 'background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a;'
    : (devIdx.classificacao_key === 'em_desenvolvimento'
      ? 'background-color: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd;'
      : 'background-color: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;');

  container.innerHTML = `
    <div class="popup-header">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
        <span class="badge" style="font-size: 0.75rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; ${typeBadgeStyle}">${typeLabelStr}</span>
        <div class="dev-index-badge dev-index-${devIdx.classificacao_key}" title="Pontuação: ${devIdx.pontuacao}/55 (${devIdx.percentual}%)" style="text-align: center; align-items: center; display: inline-flex; flex-direction: column;">
          <span class="dev-index-sub" style="font-size: 0.60rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); line-height: 1; letter-spacing: 0.2px;">Índice do Município</span>
          <span class="dev-index-val" style="font-size: 0.72rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; ${devBadgeStyle}">${devIdx.classificacao}</span>
        </div>
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
  
  // Official 9 Regionais list
  const OFFICIAL_REGIONAIS = [
    "Centro",
    "Centro-Oeste e Sudoeste",
    "Jequitinhonha e Mucuri",
    "Noroeste e Alto Paranaíba",
    "Norte",
    "Rio Doce e Vale do Aço",
    "Sul",
    "Triângulo",
    "Zona da Mata e Vertentes"
  ];

  const counts = {};
  OFFICIAL_REGIONAIS.forEach(reg => { counts[reg] = 0; });

  filtered.forEach(item => {
    const rawReg = item.regional || "";
    const regName = REGIONAL_NAMES[rawReg] || rawReg;
    if (counts[regName] !== undefined) {
      counts[regName]++;
    } else {
      for (const k of OFFICIAL_REGIONAIS) {
        if (regName && (regName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(regName.toLowerCase()))) {
          counts[k]++;
          break;
        }
      }
    }
  });

  // Max count to base progress bar percentages on
  const maxCount = Math.max(...Object.values(counts), 1);

  // Build sidebar listing
  const listContainer = document.getElementById("stats-regional-list");
  listContainer.innerHTML = "";

  OFFICIAL_REGIONAIS.forEach(key => {
    const count = counts[key] || 0;
    const percentage = (count / maxCount) * 100;
    const colorStyleClass = getRegionalColorClass(key);

    const li = document.createElement("li");
    li.className = "stats-regional-item";
    li.innerHTML = `
      <div class="stats-regional-label">
        <span class="color-dot ${colorStyleClass}"></span>
        <span class="stats-regional-text" title="${escapeHtml(key)}">${escapeHtml(key)}</span>
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

function getRegionalColorClass(regional) {
  if (!regional) return "bg-centro";
  const norm = regional.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (norm.includes("centro-oeste") || norm.includes("centro oeste") || norm.includes("centrooeste")) return "bg-centro-oeste";
  if (norm.includes("jequitinhonha") || norm.includes("mucuri")) return "bg-jequitinhonha-mucuri";
  if (norm.includes("noroeste") || norm.includes("paranaiba")) return "bg-noroeste";
  if (norm.includes("norte")) return "bg-norte";
  if (norm.includes("rio doce") || norm.includes("vale do aco")) return "bg-rio-doce";
  if (norm.includes("sul")) return "bg-sul";
  if (norm.includes("triangulo")) return "bg-triangulo";
  if (norm.includes("zona da mata") || norm.includes("vertentes")) return "bg-zona-mata";
  if (norm.includes("centro")) return "bg-centro";
  return "bg-centro";
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
  
  let badgeColorClass = getRegionalColorClass(item.regional);
  regionalBadge.classList.add(badgeColorClass);

  // Set type badge
  const typeBadge = document.getElementById("details-type-badge");
  if (typeBadge) {
    if (item.tipoCase === "estudante") {
      typeBadge.innerText = "Estudante Empreendedor";
      typeBadge.style.background = "rgba(16, 185, 129, 0.15)";
      typeBadge.style.color = "#047857";
      typeBadge.style.border = "1px solid rgba(16, 185, 129, 0.3)";
    } else {
      typeBadge.innerText = "Professor";
      typeBadge.style.background = "rgba(0, 84, 166, 0.15)";
      typeBadge.style.color = "#07549b";
      typeBadge.style.border = "1px solid rgba(0, 84, 166, 0.3)";
    }
  }

  // Set Nível de Ensino badge
  const nivelBadge = document.getElementById("details-nivel-badge");
  if (nivelBadge) {
    const val = item.nivel_ensino || item.nivelEnsino;
    if (val) {
      nivelBadge.innerText = `Nível: ${val}`;
      nivelBadge.style.display = "inline-flex";
    } else {
      nivelBadge.style.display = "none";
    }
  }

  // Set Dependência Administrativa badge
  const depBadge = document.getElementById("details-dep-badge");
  if (depBadge) {
    const val = item.dependencia_adm || item.dependenciaAdm;
    if (val) {
      depBadge.innerText = `Dependência: ${val}`;
      depBadge.style.display = "inline-flex";
    } else {
      depBadge.style.display = "none";
    }
  }

  // Development Index badge in modal header
  const devIdx = calculateMunicipioDevelopmentIndex(item);
  const devBadge = document.getElementById("details-dev-index-badge");
  const devScore = document.getElementById("details-dev-index-score");
  if (devBadge && devIdx) {
    devBadge.innerText = devIdx.classificacao;
    devBadge.className = `dev-index-modal-badge ${devIdx.classificacao_key}`;
    if (devIdx.classificacao_key === "inicio") {
      devBadge.style.background = "#fef3c7";
      devBadge.style.color = "#92400e";
      devBadge.style.border = "1.5px solid #fde68a";
    } else if (devIdx.classificacao_key === "em_desenvolvimento") {
      devBadge.style.background = "#e0f2fe";
      devBadge.style.color = "#0369a1";
      devBadge.style.border = "1.5px solid #bae6fd";
    } else {
      devBadge.style.background = "#dcfce7";
      devBadge.style.color = "#15803d";
      devBadge.style.border = "1.5px solid #bbf7d0";
    }
  }
  if (devScore) {
    devScore.innerText = "";
    devScore.style.display = "none";
  }

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

  // Enterprise details box setup
  const empresaBox = document.getElementById("details-empresa-box");
  if (empresaBox) {
    const nomeEmp = item.empresaNome || item.empresa_nome || "";
    const tipoEmp = item.empresaTipo || item.empresa_tipo || "";
    const descEmp = item.empresaDescricao || item.empresa_descricao || "";

    if (nomeEmp || tipoEmp || descEmp) {
      empresaBox.style.display = "block";
      document.getElementById("details-empresa-nome").innerText = nomeEmp || "Não informado";
      document.getElementById("details-empresa-tipo").innerText = tipoEmp || "Não informado";
      document.getElementById("details-empresa-descricao").innerText = descEmp || "Não informada";
    } else {
      empresaBox.style.display = "none";
    }
  }

  // Helper to check if indicator is affirmative
  const isAffirmative = (v) => v === true || String(v || "").trim().toLowerCase() === "sim" || String(v || "").trim().toLowerCase() === "true" || String(v || "").trim().toLowerCase() === "sim (total)";

  // JEPP Status Badge
  const jeppBadge = document.getElementById("details-jepp");
  if (jeppBadge) {
    const jeppVal = String(item.jeppStatus || item.status_jepp || "").trim().toLowerCase();
    if (jeppVal === "sim" || jeppVal === "sim (total)" || jeppVal === "total" || jeppVal === "totalmente implantado" || jeppVal.includes("total")) {
      jeppBadge.innerText = "Totalmente implantado";
      jeppBadge.className = "badge bg-centro";
    } else if (jeppVal === "parcial" || jeppVal === "em implantação" || jeppVal === "em implantacao" || jeppVal.includes("parcial") || jeppVal.includes("implantação") || jeppVal.includes("implantacao")) {
      jeppBadge.innerText = "Em implantação";
      jeppBadge.className = "badge bg-centro-oeste";
    } else {
      jeppBadge.innerText = "Não implantado";
      jeppBadge.className = "badge bg-rio-doce";
    }
  }

  // Helper to format Sim / Não badges
  const setYesNoBadge = (elementId, isSim) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerText = isSim ? "Sim" : "Não";
    el.className = "badge " + (isSim ? "bg-centro" : "bg-rio-doce");
  };

  // EE > 70% Indicator
  setYesNoBadge("details-edu-70", isAffirmative(item.edu70) || isAffirmative(item.municipio_ee_70));

  // Coop Credit Indicator
  setYesNoBadge("details-coop-status", isAffirmative(item.hasCoop) || isAffirmative(item.cooperativa_possui));

  // Municipal Law Indicator
  setYesNoBadge("details-law-status", isAffirmative(item.hasLaw) || isAffirmative(item.lei_possui));

  // Committee Indicator
  setYesNoBadge("details-committee-status", isAffirmative(item.hasCommittee) || isAffirmative(item.comite_possui));

  // IES Partnership Indicator
  setYesNoBadge("details-ies-status", isAffirmative(item.hasIes) || isAffirmative(item.ies_possui));

  // Empresa Simulada Indicator
  setYesNoBadge("details-empresa-simulada-status", isAffirmative(item.hasEmpresaSimulada) || isAffirmative(item.empresa_simulada));

  // Escola do Sebrae Indicator
  setYesNoBadge("details-escola-sebrae-status", isAffirmative(item.hasEscolaSebrae) || isAffirmative(item.escola_sebrae));

  // Convênio Sebrae Indicator
  setYesNoBadge("details-convenio-status", isAffirmative(item.convenio_sebrae) || isAffirmative(item.hasConvenioSebrae));

  // Parceria Superintendência Indicator
  setYesNoBadge("details-superintendencia-status", isAffirmative(item.parceria_superintendencia) || isAffirmative(item.hasParceriaSuperintendencia));

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
      typeLabel.innerText = " | Estudante Empreendedor";
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

function confirmDiscardForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  const textInputs = form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], textarea");
  let hasData = false;
  for (const inp of textInputs) {
    if (inp.value && inp.value.trim().length > 0) {
      hasData = true;
      break;
    }
  }
  if (hasData) {
    return window.confirm("Atenção: Existem dados preenchidos no formulário. Tem certeza de que deseja fechar e descartar as informações?");
  }
  return true;
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

function openConfirmCodeModal(code, title = "Solicitação enviada", desc = "Guarde este código para acompanhar sua solicitação:") {
  const modal = document.getElementById("confirm-code-modal");
  if (modal) {
    const titleEl = document.getElementById("confirm-code-title");
    const descEl = document.getElementById("confirm-code-desc");
    const codeEl = document.getElementById("request-code-value");
    if (titleEl) titleEl.innerText = title;
    if (descEl) descEl.innerText = desc;
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

// ==========================================================================
// POPUP MODAL DE CARREGAMENTO & PREVENÇÃO DE MÚLTIPLOS ENVIOS
// ==========================================================================

let isSubmittingMunicipality = false;

function showSubmissionLoadingModal(title = "Aguarde, estamos registrando as informações...", desc = "Por favor, não feche a página. Sua solicitação está sendo processada com segurança.") {
  const modal = document.getElementById("modal-submission-loading");
  if (modal) {
    const titleEl = document.getElementById("submission-loading-title");
    const descEl = document.getElementById("submission-loading-desc");
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    modal.classList.add("active");
    modal.style.display = "flex";
    if (typeof lucide !== "undefined") {
      lucide.createIcons({ root: modal });
    }
  }
}

function hideSubmissionLoadingModal() {
  const modal = document.getElementById("modal-submission-loading");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

async function handleMunicipalitySubmit(e) {
  e.preventDefault();

  if (isSubmittingMunicipality) {
    return; // Impede duplo clique e múltiplos envios simultâneos
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const origBtnContent = submitBtn ? submitBtn.innerHTML : "";

  const name = document.getElementById("municipality-name").value.trim();
  const regional = document.getElementById("municipality-regional").value;
  const mr = document.getElementById("municipality-mr").value.trim();
  const contactName = document.getElementById("municipality-contact-name").value.trim();
  const contactEmail = document.getElementById("municipality-contact-email").value.trim();
  const contactPhone = document.getElementById("municipality-contact-phone").value.trim();
  const jeppStatus = document.getElementById("municipality-jepp-status").value;

  const nivelEnsinoEl = document.getElementById("municipality-nivel-ensino");
  const nivelEnsino = nivelEnsinoEl ? nivelEnsinoEl.value : "";
  const dependenciaAdmEl = document.getElementById("municipality-dependencia-adm");
  const dependenciaAdm = dependenciaAdmEl ? dependenciaAdmEl.value : "";

  // Space String validation on required fields
  const requiredFields = [
    { name: "Nome do Município", val: name, id: "municipality-name" },
    { name: "Regional", val: regional, id: "municipality-regional" },
    { name: "Microrregião", val: mr, id: "municipality-mr" },
    { name: "Nome do Responsável", val: contactName, id: "municipality-contact-name" },
    { name: "E-mail do Responsável", val: contactEmail, id: "municipality-contact-email" },
    { name: "Telefone do Responsável", val: contactPhone, id: "municipality-contact-phone" }
  ];

  for (const f of requiredFields) {
    if (!f.val || f.val.trim().length === 0) {
      showToast(`O campo "${f.name}" não pode ficar vazio ou conter apenas espaços.`);
      const el = document.getElementById(f.id);
      if (el) {
        el.focus();
        el.style.borderColor = "var(--danger, #ef4444)";
      }
      return;
    }
  }
  
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

  const convSebEl = document.querySelector('input[name="municipality-convenio-sebrae"]:checked');
  const hasConvenioSebrae = convSebEl ? convSebEl.value === "sim" : false;

  const parcSupEl = document.querySelector('input[name="municipality-parceria-superintendencia"]:checked');
  const hasParceriaSuperintendencia = parcSupEl ? parcSupEl.value === "sim" : false;

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

  // Trava o envio para evitar múltiplos cliques
  isSubmittingMunicipality = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Registrando...';
    if (typeof lucide !== "undefined") lucide.createIcons({ root: submitBtn });
  }

  // Exibe o Pop-up com a mensagem solicitada pelo usuário
  showSubmissionLoadingModal("Aguarde, estamos registrando as informações...");

  try {
    const requestCode = generateNextRequestCode();

    const newMunicipality = {
      id: "mun-" + Date.now(),
      request_code: requestCode,
      nome: name,
      regional,
      mr,
      nivel_ensino: nivelEnsino,
      dependencia_adm: dependenciaAdm,
      responsavel_nome: contactName,
      responsavel_email: contactEmail,
      responsavel_telefone: formatPhoneNumber(contactPhone),
      status_jepp: jeppStatus,
      municipio_ee_70: edu70,
      convenio_sebrae: hasConvenioSebrae,
      parceria_superintendencia: hasParceriaSuperintendencia,
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

    // Envia via backend local/remoto com token JWT e tenta direto no Supabase
    try {
      const token = localStorage.getItem("sebrae_auth_token") || localStorage.getItem("sebrae_admin_token") || "";
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      await fetch(getApiUrl("/api/municipalities"), {
        method: "POST",
        headers: headers,
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

    // Delay de segurança (setTimeout) para garantia de persistência e feedback visual
    await new Promise(resolve => setTimeout(resolve, 1400));

    hideSubmissionLoadingModal();
    closeMunicipalityModal();
    openConfirmCodeModal(requestCode, "Cadastro de município enviado com sucesso!");
    showToast("Município cadastrado com sucesso!");
    document.getElementById("municipality-form").reset();
  } catch (err) {
    console.error("Erro no processamento do município:", err);
    hideSubmissionLoadingModal();
    showToast("Erro ao processar as informações. Tente novamente.");
  } finally {
    isSubmittingMunicipality = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnContent;
      if (typeof lucide !== "undefined") lucide.createIcons({ root: submitBtn });
    }
  }
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

  // Helper for municipality autocomplete setup
  const setupMunicipalityInputAutocomplete = (inputId, listId, regionalSelectId, mrInputId) => {
    const input = document.getElementById(inputId);
    const list = document.getElementById(listId);
    if (!input || !list) return;

    const renderSuggestions = (query) => {
      const val = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list.innerHTML = "";
      if (!val) {
        list.style.display = "none";
        return;
      }

      if (!window.MUNICIPALITIES_DATABASE) {
        list.style.display = "none";
        return;
      }

      const keys = Object.keys(window.MUNICIPALITIES_DATABASE);
      const matches = keys.filter(key => {
        const item = window.MUNICIPALITIES_DATABASE[key];
        const normName = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normReg = (item.regional || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const normMr = (item.mr || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return key.includes(val) || normName.includes(val) || normReg.includes(val) || normMr.includes(val);
      });

      if (matches.length > 0) {
        list.style.display = "block";
        matches.slice(0, 10).forEach(key => {
          const item = window.MUNICIPALITIES_DATABASE[key];
          const li = document.createElement("li");
          li.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.04); gap: 10px;";
          
          const mrText = item.mr ? (item.mr.startsWith("MR") ? item.mr : `MR ${item.mr}`) : "";
          li.innerHTML = `
            <strong style="color: var(--text-primary); font-size: 0.95rem;">${escapeHtml(item.name)}</strong>
            <span style="font-size: 0.76rem; color: var(--text-muted); white-space: nowrap;">${escapeHtml(item.regional)}${mrText ? ` • ${escapeHtml(mrText)}` : ""}</span>
          `;

          li.addEventListener("click", () => {
            input.value = item.name;
            list.style.display = "none";

            // 1. Auto-select Regional
            const regSelect = document.getElementById(regionalSelectId);
            if (regSelect) {
              regSelect.value = item.regional;
              if (!regSelect.value) {
                // Fuzzy match option text if exact value differs
                for (let opt of regSelect.options) {
                  if (opt.text.toLowerCase().includes(item.regional.toLowerCase()) || item.regional.toLowerCase().includes(opt.text.toLowerCase())) {
                    regSelect.value = opt.value;
                    break;
                  }
                }
              }
            }

            // 2. Auto-fill Microrregião
            const mrInp = document.getElementById(mrInputId);
            if (mrInp) {
              mrInp.value = mrText;
            }
          });

          list.appendChild(li);
        });
      } else {
        list.style.display = "none";
      }
    };

    input.addEventListener("input", () => renderSuggestions(input.value));
    input.addEventListener("focus", () => {
      if (input.value.trim().length > 0) {
        renderSuggestions(input.value);
      }
    });

    document.addEventListener("click", (e) => {
      if (e.target !== input && !list.contains(e.target)) {
        list.style.display = "none";
      }
    });
  };

  // Case Registration Form (Professor / Estudante)
  setupMunicipalityInputAutocomplete("form-municipio", "form-municipio-suggestions", "form-regional", "form-mr");

  // Municipality Registration Form
  setupMunicipalityInputAutocomplete("municipality-name", "municipality-suggestions", "municipality-regional", "municipality-mr");
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

  // Export CSV confirmation modal binding
  const exportBtn = document.getElementById("btn-export-csv");
  if (exportBtn) {
    exportBtn.addEventListener("click", openExportConfirmModal);
  }

  const btnCloseExportModal = document.getElementById("btn-close-export-modal");
  if (btnCloseExportModal) btnCloseExportModal.addEventListener("click", closeExportConfirmModal);

  const btnCancelExport = document.getElementById("btn-cancel-export");
  if (btnCancelExport) btnCancelExport.addEventListener("click", closeExportConfirmModal);

  const btnConfirmExport = document.getElementById("btn-confirm-export-download");
  if (btnConfirmExport) btnConfirmExport.addEventListener("click", performFilteredCSVExport);

  const exportModalWrap = document.getElementById("export-confirm-modal");
  if (exportModalWrap) {
    exportModalWrap.addEventListener("click", (e) => {
      if (e.target.id === "export-confirm-modal") closeExportConfirmModal();
    });
  }

  // Open & Close Panels/Modals
  document.getElementById("btn-open-register").addEventListener("click", openCaseTypeModal);
  document.getElementById("btn-close-register").addEventListener("click", () => {
    if (confirmDiscardForm("register-form")) closeRegisterPanel();
  });
  document.getElementById("btn-cancel-register").addEventListener("click", () => {
    if (confirmDiscardForm("register-form")) closeRegisterPanel();
  });
  
  document.getElementById("btn-close-details").addEventListener("click", closeDetailsModal);
  
  // Close Case Type Modal triggers
  document.getElementById("btn-close-type-modal").addEventListener("click", closeCaseTypeModal);
  document.getElementById("select-type-professor").addEventListener("click", () => selectCaseType('professor'));
  document.getElementById("select-type-estudante").addEventListener("click", () => selectCaseType('estudante'));

  const btnMun = document.getElementById("select-type-municipio");
  if (btnMun) btnMun.addEventListener("click", () => selectCaseType('municipio'));

  const btnCloseMun = document.getElementById("btn-close-municipality");
  if (btnCloseMun) btnCloseMun.addEventListener("click", () => {
    if (confirmDiscardForm("municipality-form")) closeMunicipalityModal();
  });

  const formMun = document.getElementById("municipality-form");
  if (formMun) formMun.addEventListener("submit", handleMunicipalitySubmit);

  const btnCloseCode = document.getElementById("btn-close-code-modal");
  if (btnCloseCode) btnCloseCode.addEventListener("click", closeConfirmCodeModal);

  const btnFinishCode = document.getElementById("btn-finish-code-modal");
  if (btnFinishCode) btnFinishCode.addEventListener("click", closeConfirmCodeModal);

  const btnCancelMun = document.getElementById("btn-cancel-municipality");
  if (btnCancelMun) btnCancelMun.addEventListener("click", () => {
    if (confirmDiscardForm("municipality-form")) closeMunicipalityModal();
  });

  // Close informational modals on backdrop click
  // NOTA IMPORTANTE: Formulários de cadastro (register-panel e municipality-modal) NUNCA devem fechar
  // por clique acidental no backdrop ou ao arrastar barra de rolagem até o final da tela!
  document.getElementById("details-modal").addEventListener("click", (e) => {
    if (e.target.id === "details-modal") closeDetailsModal();
  });
  document.getElementById("case-type-modal").addEventListener("click", (e) => {
    if (e.target.id === "case-type-modal") closeCaseTypeModal();
  });
  const modalCode = document.getElementById("confirm-code-modal");
  if (modalCode) {
    modalCode.addEventListener("click", (e) => {
      if (e.target.id === "confirm-code-modal") closeConfirmCodeModal();
    });
  }

  // Previne envio acidental de formulários ao pressionar ENTER em campos de texto
  const preventPrematureEnterSubmit = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "submit") {
        e.preventDefault();
      }
    });
  };
  preventPrematureEnterSubmit("municipality-form");
  preventPrematureEnterSubmit("register-form");

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

let isSubmittingCase = false;

async function handleFormSubmit(e) {
  e.preventDefault();

  if (isSubmittingCase) {
    return; // Impede duplo clique no cadastro de cases
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const origText = submitBtn ? submitBtn.innerHTML : "";

  const municipio = document.getElementById("form-municipio").value.trim();
  const regional = document.getElementById("form-regional").value;
  const mr = document.getElementById("form-mr").value.trim();
  const escola = document.getElementById("form-escola").value.trim();
  const nivelEnsino = (document.getElementById("form-nivel-ensino") ? document.getElementById("form-nivel-ensino").value : "").trim();
  const dependenciaAdm = (document.getElementById("form-dependencia-adm") ? document.getElementById("form-dependencia-adm").value : "").trim();
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

  const empresaNome = (document.getElementById("form-empresa-nome") ? document.getElementById("form-empresa-nome").value : "").trim();
  const empresaTipo = (document.getElementById("form-empresa-tipo") ? document.getElementById("form-empresa-tipo").value : "").trim();
  const empresaDescricao = (document.getElementById("form-empresa-descricao") ? document.getElementById("form-empresa-descricao").value : "").trim();

  // Space String validation on required fields
  const requiredFields = [
    { name: "Município", val: municipio, id: "form-municipio" },
    { name: "Regional", val: regional, id: "form-regional" },
    { name: "Microrregião", val: mr, id: "form-mr" },
    { name: "Escola / Instituição", val: escola, id: "form-escola" },
    { name: "Nível de Ensino", val: nivelEnsino, id: "form-nivel-ensino" },
    { name: "Dependência Administrativa", val: dependenciaAdm, id: "form-dependencia-adm" },
    { name: "Título", val: titulo, id: "form-titulo" },
    { name: "Descrição", val: descricao, id: "form-descricao" },
    { name: "Nome do Técnico", val: tecnicoNome, id: "form-tecnico-nome" },
    { name: "E-mail do Técnico", val: tecnicoEmail, id: "form-tecnico-email" }
  ];

  if (currentRegisterType === 'professor') {
    requiredFields.push({ name: "Nome do Professor", val: professorNome, id: "form-professor-nome" });
    requiredFields.push({ name: "E-mail do Professor", val: professorEmail, id: "form-professor-email" });
  } else if (currentRegisterType === 'estudante') {
    requiredFields.push({ name: "Nome do Estudante", val: estudanteNome, id: "form-estudante-nome" });
  }

  for (const f of requiredFields) {
    if (!f.val || f.val.trim().length === 0) {
      showToast(`O campo "${f.name}" não pode ficar vazio ou conter apenas espaços.`);
      const el = document.getElementById(f.id);
      if (el) {
        el.focus();
        el.style.borderColor = "var(--danger, #ef4444)";
      }
      return;
    }
  }
  
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
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
    return;
  }

  if (currentRegisterType === 'professor') {
    if (!isValidPhone(professorTelefone)) {
      showToast("Telefone do professor inválido. Use o formato com DDD: (XX) XXXXX-XXXX");
      const el = document.getElementById("form-professor-contato");
      if (el) { el.focus(); el.style.borderColor = "var(--danger, #ef4444)"; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
      return;
    }
  }

  if (currentRegisterType === 'estudante') {
    if (estudanteTelefone && !isValidPhone(estudanteTelefone)) {
      showToast("Telefone do estudante inválido. Use o formato com DDD: (XX) XXXXX-XXXX");
      const el = document.getElementById("form-estudante-contato");
      if (el) { el.focus(); el.style.borderColor = "var(--danger, #ef4444)"; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = origText; }
      return;
    }
  }

  // Show a loading feedback on the submit button and open loading modal
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Salvando...';
    lucide.createIcons({ root: submitBtn });
  }
  showSubmissionLoadingModal("Aguarde, estamos registrando as informações...");

  try {
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
      nivel_ensino: nivelEnsino,
      dependencia_adm: dependenciaAdm,
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
      
      // Enterprise fields
      empresaNome,
      empresaTipo,
      empresaDescricao,
      empresa_nome: empresaNome,
      empresa_tipo: empresaTipo,
      empresa_descricao: empresaDescricao,

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
          const token = localStorage.getItem("sebrae_auth_token") || localStorage.getItem("sebrae_admin_token") || "";
          const headers = { "Content-Type": "application/json" };
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
          res = await fetch(getApiUrl("/api/cases"), {
            method: "POST",
            headers: headers,
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

    // Delay de segurança (setTimeout) para feedback e persistência
    await new Promise(resolve => setTimeout(resolve, 1200));

    hideSubmissionLoadingModal();

    // Close panel and notify dashboard
    closeRegisterPanel();
    renderDashboard();

    // Focus map on the newly added marker
    map.setView([coordsObj.lat, coordsObj.lng], 10);
    
    // Custom popup & toast notification of success
    openConfirmCodeModal(requestCode, "Case cadastrado com sucesso!");
    showToast("Case cadastrado com sucesso!");
  } catch (err) {
    console.error("Erro no cadastro de case:", err);
    hideSubmissionLoadingModal();
    showToast("Erro ao processar as informações do case. Tente novamente.");
  } finally {
    isSubmittingCase = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      if (typeof lucide !== "undefined") lucide.createIcons({ root: submitBtn });
    }
  }
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
    
    // Ensure all icons are rendered once dashboard view becomes visible
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
    
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

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const errorMsg = document.getElementById("login-error");
  const loginBtn = document.getElementById("btn-login");
  
  errorMsg.classList.remove("active");
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i data-lucide="loader" class="animate-spin" style="width: 18px; height: 18px;"></i> Autenticando...';
  lucide.createIcons({ root: loginBtn });

  try {
    const res = await fetch(getApiUrl("/api/login/user"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (res.status === 429) {
      const data = await res.json();
      errorMsg.textContent = data.error || "Muitas tentativas. Bloqueio temporário por segurança.";
      errorMsg.classList.add("active");
      loginBtn.disabled = false;
      loginBtn.innerHTML = "<span>Entrar no Painel</span>";
      return;
    }

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("sebrae_auth_token", data.token);
      }
      if (data.role === "admin") {
        localStorage.setItem("sebrae_admin_token", data.token);
        localStorage.setItem("sebrae_admin_authenticated", "true");
        loginBtn.disabled = false;
        loginBtn.innerHTML = "<span>Entrar no Painel</span>";
        window.location.href = "admin.html";
        return;
      }

      localStorage.setItem("sebrae_authenticated", "true");
      loginBtn.disabled = false;
      loginBtn.innerHTML = "<span>Entrar no Painel</span>";
      checkAuth();
      showToast("Autenticado com sucesso!");
      return;
    }
  } catch (err) {
    console.warn("Backend login indisponível, fallback para credenciais locais:", err);
  }

  // Fallback demo credentials (for static/offline file usage)
  if (email.toLowerCase() === "admin@sebraemg.com.br" && password === "admin123") {
    localStorage.setItem("sebrae_admin_authenticated", "true");
    loginBtn.disabled = false;
    loginBtn.innerHTML = "<span>Entrar no Painel</span>";
    window.location.href = "admin.html";
    return;
  }

  if (email.toLowerCase() === "teste@sebraemg.com.br" && password === "teste123") {
    localStorage.setItem("sebrae_authenticated", "true");
    loginBtn.disabled = false;
    loginBtn.innerHTML = "<span>Entrar no Painel</span>";
    checkAuth();
    showToast("Autenticado com sucesso!");
    return;
  }

  errorMsg.textContent = "Credenciais inválidas. Verifique seu e-mail e senha.";
  errorMsg.classList.add("active");
  loginBtn.disabled = false;
  loginBtn.innerHTML = "<span>Entrar no Painel</span>";
}

function handleLogout() {
  localStorage.removeItem("sebrae_authenticated");
  localStorage.removeItem("sebrae_auth_token");
  checkAuth();
  
  // Clear input fields
  document.getElementById("login-email").value = "";
  document.getElementById("login-password").value = "";
  
  showToast("Sessão encerrada com sucesso!");
}

// ==========================================================================
// FILTERED EXPORT CONTROLLER WITH CONFIRMATION MODAL
// ==========================================================================

let pendingExportCases = [];
let pendingExportType = "all";

function getFilteredCasesForExport(selectedTypeScope = "all") {
  const { selectedRegs, selectedMrs, selectedMuns } = getActiveLocationFilters();
  
  let effectiveType = (selectedTypeScope || "all").toLowerCase();
  if (effectiveType === "all") {
    const sidebarType = document.getElementById("filter-type") ? document.getElementById("filter-type").value : "All";
    if (sidebarType && sidebarType.toLowerCase() !== "all") {
      effectiveType = sidebarType.toLowerCase();
    }
  }

  return {
    filteredCases: cases.filter(item => isCaseMatchingFilters(item, selectedRegs, selectedMrs, selectedMuns, effectiveType)),
    effectiveType
  };
}

function openExportConfirmModal() {
  const modal = document.getElementById("export-confirm-modal");
  if (!modal) return;

  const selectType = document.getElementById("export-select-type");
  const selectedScope = selectType ? selectType.value : "all";

  const { filteredCases, effectiveType } = getFilteredCasesForExport(selectedScope);
  pendingExportCases = filteredCases;
  pendingExportType = effectiveType;

  // Render location list in modal
  const locList = document.getElementById("export-modal-locations");
  if (locList) {
    locList.innerHTML = "";
    if (selectedLocationFilters.size === 0) {
      locList.innerHTML = `
        <span class="export-modal-location-tag" style="background: #eff6ff; color: #0054a6; border-color: #bfdbfe;">
          <i data-lucide="map" style="width: 12px; height: 12px;"></i> Todas as localidades (Minas Gerais completa)
        </span>
      `;
    } else {
      selectedLocationFilters.forEach(item => {
        let tagClass = "tag-municipio";
        let tagLabel = "Município";
        if (item.type === "regional") {
          tagClass = "tag-regional";
          tagLabel = "Regional";
        } else if (item.type === "mr") {
          tagClass = "tag-mr";
          tagLabel = "MR";
        }

        const tag = document.createElement("span");
        tag.className = "export-modal-location-tag";
        tag.innerHTML = `
          <span>${escapeHtml(item.name)}</span>
          <span class="class-tag ${tagClass}">${tagLabel}</span>
        `;
        locList.appendChild(tag);
      });
    }
  }

  // Render type label
  const typeLabel = document.getElementById("export-modal-type");
  if (typeLabel) {
    if (effectiveType === "professor") {
      typeLabel.textContent = "Apenas Cases de Professor";
    } else if (effectiveType === "estudante") {
      typeLabel.textContent = "Apenas Cases de Estudante Empreendedor";
    } else {
      typeLabel.textContent = "Todos os Cases (Professor e Estudante Empreendedor)";
    }
  }

  // Render count and download button state
  const countBox = document.getElementById("export-modal-count-box");
  const countText = document.getElementById("export-modal-count-text");
  const downloadBtn = document.getElementById("btn-confirm-export-download");

  if (filteredCases.length === 0) {
    if (countBox) countBox.className = "export-count-box empty";
    if (countText) countText.textContent = "Nenhum case encontrado para os filtros atuais.";
    if (downloadBtn) downloadBtn.disabled = true;
  } else {
    if (countBox) countBox.className = "export-count-box";
    if (countText) countText.textContent = `${filteredCases.length} case(s) pronto(s) para exportação.`;
    if (downloadBtn) downloadBtn.disabled = false;
  }

  modal.style.display = "flex";
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ root: modal });
  }
}

function closeExportConfirmModal() {
  const modal = document.getElementById("export-confirm-modal");
  if (modal) modal.style.display = "none";
}

function performFilteredCSVExport() {
  if (!pendingExportCases || pendingExportCases.length === 0) {
    showToast("Não há cases correspondentes para exportar!");
    closeExportConfirmModal();
    return;
  }

  const casesToExport = pendingExportCases;

  // Determine which contacts to include
  const hasProf = casesToExport.some(c => c.tipoCase === "professor");
  const hasEst = casesToExport.some(c => c.tipoCase === "estudante");

  // Helper to escape values for CSV
  const escapeCSV = (val) => {
    if (val === undefined || val === null) return '""';
    let str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Base Headers
  const headers = [
    "Título do Projeto",
    "Descrição Geral",
    "Município",
    "Regional",
    "Microrregião (MR)",
    "Escola / Instituição",
    "Nível de Ensino",
    "Dependência Administrativa",
    "Nome do Técnico",
    "E-mail do Técnico",
    "Telefone do Técnico",
    "Tipo de Case"
  ];

  // Conditional Contact Columns
  if (hasProf) {
    headers.push("Nome do Professor", "E-mail do Professor", "Telefone do Professor");
  }
  if (hasEst) {
    headers.push("Nome do Estudante Empreendedor", "E-mail do Estudante Empreendedor", "Contato do Estudante Empreendedor");
  }

  // Enterprise Columns
  headers.push("Nome da Empresa", "Tipo de Negócio", "Descrição da Empresa");

  // Municipality Indicators
  headers.push(
    "Status JEPP",
    "Parceria com Cooperativa de Crédito",
    "Possui Educação Empreendedora em mais de 70% do município?",
    "Possui Lei Municipal de Educação Empreendedora",
    "Possui Comitê Conjunto",
    "Parceria com Instituição de Ensino Superior",
    "Possui Empresa Simulada",
    "Possui Sistema de Ensino Escola do Sebrae"
  );

  // Build CSV rows
  const csvRows = [headers.join(";")];

  casesToExport.forEach(item => {
    const row = [
      escapeCSV(item.titulo),
      escapeCSV(item.descricao),
      escapeCSV(item.municipio),
      escapeCSV(REGIONAL_NAMES[item.regional] || item.regional),
      escapeCSV(item.mr),
      escapeCSV(item.escola),
      escapeCSV(item.nivel_ensino || ""),
      escapeCSV(item.dependencia_adm || ""),
      escapeCSV(item.tecnicoNome),
      escapeCSV(item.tecnicoEmail),
      escapeCSV(item.tecnicoContato),
      escapeCSV(item.tipoCase === "estudante" ? "Estudante Empreendedor" : "Professor")
    ];

    if (hasProf) {
      if (item.tipoCase === "professor") {
        row.push(
          escapeCSV(item.professorNome),
          escapeCSV(item.professorEmail),
          escapeCSV(item.professorTelefone)
        );
      } else {
        row.push('""', '""', '""');
      }
    }

    if (hasEst) {
      if (item.tipoCase === "estudante") {
        row.push(
          escapeCSV(item.estudanteNome),
          escapeCSV(item.estudanteEmail),
          escapeCSV(item.estudanteTelefone || item.studentContact)
        );
      } else {
        row.push('""', '""', '""');
      }
    }

    // Enterprise values
    row.push(
      escapeCSV(item.empresaNome || item.empresa_nome || ""),
      escapeCSV(item.empresaTipo || item.empresa_tipo || ""),
      escapeCSV(item.empresaDescricao || item.empresa_descricao || "")
    );

    // Municipality indicators
    row.push(
      escapeCSV(item.jeppStatus || "Não"),
      escapeCSV(item.hasCoop ? "Sim" : "Não"),
      escapeCSV(item.edu70 === "sim" ? "Sim" : "Não"),
      escapeCSV(item.hasLaw ? "Sim" : "Não"),
      escapeCSV(item.hasCommittee ? "Sim" : "Não"),
      escapeCSV(item.hasIes ? "Sim" : "Não"),
      escapeCSV(item.hasEmpresaSimulada ? "Sim" : "Não"),
      escapeCSV(item.hasEscolaSebrae ? "Sim" : "Não")
    );

    csvRows.push(row.join(";"));
  });

  const csvContent = csvRows.join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  let filename = "Planilha_Cases_SEBRAE.csv";
  if (pendingExportType === "professor") {
    filename = "Planilha_Cases_Professor.csv";
  } else if (pendingExportType === "estudante") {
    filename = "Planilha_Cases_Estudante_Empreendedor.csv";
  }

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  closeExportConfirmModal();
  showToast(`Planilha baixada com sucesso! (${casesToExport.length} cases)`);
}
