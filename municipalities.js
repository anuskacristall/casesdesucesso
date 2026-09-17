/**
 * Base Oficial de Municípios de Minas Gerais - SEBRAE MG
 * Total: 852 municípios mapeados com Regional Oficial SEBRAE, Microrregião e Coordenadas Geográficas (IBGE)
 */

const SEBRAE_REGIONAIS = [
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

const SEBRAE_MICRORREGIOES = [
  {
    "mr": "Alto Paraopeba e Inconfidentes",
    "regional": "Centro"
  },
  {
    "mr": "Curvelo",
    "regional": "Centro"
  },
  {
    "mr": "Das Indústrias",
    "regional": "Centro"
  },
  {
    "mr": "Grande Belo Horizonte",
    "regional": "Centro"
  },
  {
    "mr": "Sete Lagoas",
    "regional": "Centro"
  },
  {
    "mr": "Divinópolis",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "Formiga",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "Itaúna",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "Nova Serrana",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "Passos",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "São Sebastião do Paraíso",
    "regional": "Centro-Oeste e Sudoeste"
  },
  {
    "mr": "Almenara",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Araçuaí",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Chapada de Minas",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Diamantina",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Nanuque",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Teófilo Otoni",
    "regional": "Jequitinhonha e Mucuri"
  },
  {
    "mr": "Grande Sertão Veredas",
    "regional": "Noroeste e Alto Paranaíba"
  },
  {
    "mr": "Paracatu",
    "regional": "Noroeste e Alto Paranaíba"
  },
  {
    "mr": "Patos de Minas",
    "regional": "Noroeste e Alto Paranaíba"
  },
  {
    "mr": "Patrocínio",
    "regional": "Noroeste e Alto Paranaíba"
  },
  {
    "mr": "Unaí",
    "regional": "Noroeste e Alto Paranaíba"
  },
  {
    "mr": "Alto Rio Pardo",
    "regional": "Norte"
  },
  {
    "mr": "Januária",
    "regional": "Norte"
  },
  {
    "mr": "Montes Claros",
    "regional": "Norte"
  },
  {
    "mr": "Pirapora",
    "regional": "Norte"
  },
  {
    "mr": "Serra Geral",
    "regional": "Norte"
  },
  {
    "mr": "Aimorés",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Caratinga",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Governador Valadares",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Guanhães",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Ipatinga",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Itabira",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "João Monlevade",
    "regional": "Rio Doce e Vale do Aço"
  },
  {
    "mr": "Alfenas",
    "regional": "Sul"
  },
  {
    "mr": "Itajubá",
    "regional": "Sul"
  },
  {
    "mr": "Lavras",
    "regional": "Sul"
  },
  {
    "mr": "Mantiqueira de Minas",
    "regional": "Sul"
  },
  {
    "mr": "Pouso Alegre",
    "regional": "Sul"
  },
  {
    "mr": "Poços de Caldas",
    "regional": "Sul"
  },
  {
    "mr": "Vale da Eletrônica",
    "regional": "Sul"
  },
  {
    "mr": "Varginha",
    "regional": "Sul"
  },
  {
    "mr": "Araguari",
    "regional": "Triângulo"
  },
  {
    "mr": "Araxá",
    "regional": "Triângulo"
  },
  {
    "mr": "Frutal",
    "regional": "Triângulo"
  },
  {
    "mr": "Ituiutaba",
    "regional": "Triângulo"
  },
  {
    "mr": "Uberaba",
    "regional": "Triângulo"
  },
  {
    "mr": "Uberlândia",
    "regional": "Triângulo"
  },
  {
    "mr": "Barbacena",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Cataguases",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Juiz de Fora",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Manhuaçu",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Muriaé",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Ponte Nova",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "São João Del Rei",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Ubá",
    "regional": "Zona da Mata e Vertentes"
  },
  {
    "mr": "Viçosa",
    "regional": "Zona da Mata e Vertentes"
  }
];

const MUNICIPALITIES_DATABASE = {
  "abaete": {
    "name": "Abaeté",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -19.1551,
    "lng": -45.4444
  },
  "aracai": {
    "name": "Araçaí",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.1955,
    "lng": -44.2493
  },
  "augusto de lima": {
    "name": "Augusto de Lima",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.0997,
    "lng": -44.2655
  },
  "baldim": {
    "name": "Baldim",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.2832,
    "lng": -43.9613
  },
  "belo horizonte": {
    "name": "Belo Horizonte",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.9102,
    "lng": -43.9266
  },
  "belo vale": {
    "name": "Belo Vale",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.4077,
    "lng": -44.0275
  },
  "betim": {
    "name": "Betim",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -19.9668,
    "lng": -44.2008
  },
  "brumadinho": {
    "name": "Brumadinho",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -20.151,
    "lng": -44.2007
  },
  "cachoeira da prata": {
    "name": "Cachoeira da Prata",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.521,
    "lng": -44.4544
  },
  "caetanopolis": {
    "name": "Caetanópolis",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.2971,
    "lng": -44.4189
  },
  "caete": {
    "name": "Caeté",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.8826,
    "lng": -43.6704
  },
  "capim branco": {
    "name": "Capim Branco",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.5471,
    "lng": -44.1304
  },
  "casa grande": {
    "name": "Casa Grande",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.7925,
    "lng": -43.9343
  },
  "catas altas da noruega": {
    "name": "Catas Altas da Noruega",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.6901,
    "lng": -43.4939
  },
  "cedro do abaete": {
    "name": "Cedro do Abaeté",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -19.1458,
    "lng": -45.712
  },
  "conceicao do mato dentro": {
    "name": "Conceição do Mato Dentro",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.0344,
    "lng": -43.4221
  },
  "confins": {
    "name": "Confins",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.6282,
    "lng": -43.9931
  },
  "congonhas": {
    "name": "Congonhas",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.4958,
    "lng": -43.851
  },
  "congonhas do norte": {
    "name": "Congonhas do Norte",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -18.8021,
    "lng": -43.6767
  },
  "conselheiro lafaiete": {
    "name": "Conselheiro Lafaiete",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.6634,
    "lng": -43.7846
  },
  "contagem": {
    "name": "Contagem",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -19.9321,
    "lng": -44.0539
  },
  "cordisburgo": {
    "name": "Cordisburgo",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.1224,
    "lng": -44.3224
  },
  "corinto": {
    "name": "Corinto",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.369,
    "lng": -44.4542
  },
  "cristiano otoni": {
    "name": "Cristiano Otoni",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.8324,
    "lng": -43.8166
  },
  "curvelo": {
    "name": "Curvelo",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.7527,
    "lng": -44.4303
  },
  "desterro de entre rios": {
    "name": "Desterro de Entre Rios",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.665,
    "lng": -44.3334
  },
  "diogo de vasconcelos": {
    "name": "Diogo de Vasconcelos",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.4879,
    "lng": -43.1953
  },
  "dom joaquim": {
    "name": "Dom Joaquim",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -18.961,
    "lng": -43.2544
  },
  "entre rios de minas": {
    "name": "Entre Rios de Minas",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.6706,
    "lng": -44.0654
  },
  "esmeraldas": {
    "name": "Esmeraldas",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -19.764,
    "lng": -44.3065
  },
  "felixlandia": {
    "name": "Felixlândia",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.7507,
    "lng": -44.9004
  },
  "fortuna de minas": {
    "name": "Fortuna de Minas",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.5578,
    "lng": -44.4472
  },
  "funilandia": {
    "name": "Funilândia",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.3661,
    "lng": -44.061
  },
  "ibirite": {
    "name": "Ibirité",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -20.0252,
    "lng": -44.0569
  },
  "igarape": {
    "name": "Igarapé",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -20.0707,
    "lng": -44.2994
  },
  "inhauma": {
    "name": "Inhaúma",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.4898,
    "lng": -44.3934
  },
  "inimutaba": {
    "name": "Inimutaba",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.7271,
    "lng": -44.3584
  },
  "itabirito": {
    "name": "Itabirito",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.2501,
    "lng": -43.8038
  },
  "itambe do mato dentro": {
    "name": "Itambé do Mato Dentro",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.4158,
    "lng": -43.3182
  },
  "itaverava": {
    "name": "Itaverava",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.6769,
    "lng": -43.6141
  },
  "jaboticatubas": {
    "name": "Jaboticatubas",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.5119,
    "lng": -43.7373
  },
  "jeceaba": {
    "name": "Jeceaba",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.5339,
    "lng": -43.9894
  },
  "jequitiba": {
    "name": "Jequitibá",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.2345,
    "lng": -44.0304
  },
  "juatuba": {
    "name": "Juatuba",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -19.9448,
    "lng": -44.3451
  },
  "lagoa santa": {
    "name": "Lagoa Santa",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.6397,
    "lng": -43.8932
  },
  "maravilhas": {
    "name": "Maravilhas",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.5076,
    "lng": -44.6779
  },
  "mariana": {
    "name": "Mariana",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.3765,
    "lng": -43.414
  },
  "mario campos": {
    "name": "Mário Campos",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -20.0582,
    "lng": -44.1883
  },
  "mateus leme": {
    "name": "Mateus Leme",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -19.9794,
    "lng": -44.4318
  },
  "matozinhos": {
    "name": "Matozinhos",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.5543,
    "lng": -44.0868
  },
  "moeda": {
    "name": "Moeda",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.3399,
    "lng": -44.0509
  },
  "monjolos": {
    "name": "Monjolos",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.3245,
    "lng": -44.118
  },
  "morro da garca": {
    "name": "Morro da Garça",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.5356,
    "lng": -44.601
  },
  "morro do pilar": {
    "name": "Morro do Pilar",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.2236,
    "lng": -43.3795
  },
  "nova lima": {
    "name": "Nova Lima",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.9758,
    "lng": -43.8509
  },
  "ouro branco": {
    "name": "Ouro Branco",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.5263,
    "lng": -43.6962
  },
  "ouro preto": {
    "name": "Ouro Preto",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.3796,
    "lng": -43.512
  },
  "papagaios": {
    "name": "Papagaios",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.4419,
    "lng": -44.7468
  },
  "paraopeba": {
    "name": "Paraopeba",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.2732,
    "lng": -44.4044
  },
  "pedro leopoldo": {
    "name": "Pedro Leopoldo",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.6308,
    "lng": -44.0383
  },
  "pequi": {
    "name": "Pequi",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.6284,
    "lng": -44.6604
  },
  "pompeu": {
    "name": "Pompéu",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -19.2257,
    "lng": -45.0141
  },
  "presidente juscelino": {
    "name": "Presidente Juscelino",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.6401,
    "lng": -44.06
  },
  "prudente de morais": {
    "name": "Prudente de Morais",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.4742,
    "lng": -44.1591
  },
  "queluzito": {
    "name": "Queluzito",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.7416,
    "lng": -43.8851
  },
  "raposos": {
    "name": "Raposos",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.9636,
    "lng": -43.8079
  },
  "ribeirao das neves": {
    "name": "Ribeirão das Neves",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.7621,
    "lng": -44.0844
  },
  "rio acima": {
    "name": "Rio Acima",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -20.0876,
    "lng": -43.7878
  },
  "sabara": {
    "name": "Sabará",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.884,
    "lng": -43.8263
  },
  "santa luzia": {
    "name": "Santa Luzia",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.7548,
    "lng": -43.8497
  },
  "santana de pirapama": {
    "name": "Santana de Pirapama",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -18.9962,
    "lng": -44.0409
  },
  "santana do riacho": {
    "name": "Santana do Riacho",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.1662,
    "lng": -43.722
  },
  "santana dos montes": {
    "name": "Santana dos Montes",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.7868,
    "lng": -43.6949
  },
  "santo hipolito": {
    "name": "Santo Hipólito",
    "regional": "Centro",
    "mr": "Curvelo",
    "lat": -18.2968,
    "lng": -44.2229
  },
  "sao bras do suacui": {
    "name": "São Brás do Suaçuí",
    "regional": "Centro",
    "mr": "Alto Paraopeba e Inconfidentes",
    "lat": -20.6242,
    "lng": -43.9515
  },
  "sao joaquim de bicas": {
    "name": "São Joaquim de Bicas",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -20.048,
    "lng": -44.2749
  },
  "sao jose da lapa": {
    "name": "São José da Lapa",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.6971,
    "lng": -43.9586
  },
  "sarzedo": {
    "name": "Sarzedo",
    "regional": "Centro",
    "mr": "Das Indústrias",
    "lat": -20.0367,
    "lng": -44.1446
  },
  "sete lagoas": {
    "name": "Sete Lagoas",
    "regional": "Centro",
    "mr": "Sete Lagoas",
    "lat": -19.4569,
    "lng": -44.2413
  },
  "vespasiano": {
    "name": "Vespasiano",
    "regional": "Centro",
    "mr": "Grande Belo Horizonte",
    "lat": -19.6883,
    "lng": -43.9239
  },
  "alpinopolis": {
    "name": "Alpinópolis",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.8631,
    "lng": -46.3878
  },
  "araujos": {
    "name": "Araújos",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.9405,
    "lng": -45.1671
  },
  "arceburgo": {
    "name": "Arceburgo",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.359,
    "lng": -46.9401
  },
  "arcos": {
    "name": "Arcos",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.2863,
    "lng": -45.5373
  },
  "bambui": {
    "name": "Bambuí",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.0166,
    "lng": -45.9754
  },
  "bom despacho": {
    "name": "Bom Despacho",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.7386,
    "lng": -45.2622
  },
  "bom jesus da penha": {
    "name": "Bom Jesus da Penha",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.0148,
    "lng": -46.5174
  },
  "bonfim": {
    "name": "Bonfim",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.3302,
    "lng": -44.2366
  },
  "cabo verde": {
    "name": "Cabo Verde",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.4699,
    "lng": -46.3919
  },
  "camacho": {
    "name": "Camacho",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.6294,
    "lng": -45.1593
  },
  "candeias": {
    "name": "Candeias",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.7692,
    "lng": -45.2765
  },
  "capetinga": {
    "name": "Capetinga",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.6163,
    "lng": -47.0571
  },
  "capitolio": {
    "name": "Capitólio",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.6164,
    "lng": -46.0493
  },
  "carmo da mata": {
    "name": "Carmo da Mata",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.5575,
    "lng": -44.8735
  },
  "carmo do cajuru": {
    "name": "Carmo do Cajuru",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.1912,
    "lng": -44.7664
  },
  "carmo do rio claro": {
    "name": "Carmo do Rio Claro",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.9736,
    "lng": -46.1149
  },
  "carmopolis de minas": {
    "name": "Carmópolis de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.5396,
    "lng": -44.6336
  },
  "cassia": {
    "name": "Cássia",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.5831,
    "lng": -46.9201
  },
  "claraval": {
    "name": "Claraval",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.397,
    "lng": -47.2768
  },
  "claudio": {
    "name": "Cláudio",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.4437,
    "lng": -44.7673
  },
  "conceicao do para": {
    "name": "Conceição do Pará",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.7456,
    "lng": -44.8945
  },
  "corrego danta": {
    "name": "Córrego Danta",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -19.8198,
    "lng": -45.9032
  },
  "corrego fundo": {
    "name": "Córrego Fundo",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.4474,
    "lng": -45.5617
  },
  "cristais": {
    "name": "Cristais",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.8733,
    "lng": -45.5167
  },
  "crucilandia": {
    "name": "Crucilândia",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.3923,
    "lng": -44.3334
  },
  "delfinopolis": {
    "name": "Delfinópolis",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.3468,
    "lng": -46.8456
  },
  "divinopolis": {
    "name": "Divinópolis",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.1446,
    "lng": -44.8912
  },
  "dores do indaia": {
    "name": "Dores do Indaiá",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.4628,
    "lng": -45.5927
  },
  "doresopolis": {
    "name": "Doresópolis",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.2868,
    "lng": -45.9007
  },
  "estrela do indaia": {
    "name": "Estrela do Indaiá",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.5169,
    "lng": -45.7859
  },
  "florestal": {
    "name": "Florestal",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.888,
    "lng": -44.4318
  },
  "formiga": {
    "name": "Formiga",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.4618,
    "lng": -45.4268
  },
  "fortaleza de minas": {
    "name": "Fortaleza de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.8508,
    "lng": -46.712
  },
  "guaranesia": {
    "name": "Guaranésia",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.3009,
    "lng": -46.7964
  },
  "guaxupe": {
    "name": "Guaxupé",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.305,
    "lng": -46.7081
  },
  "ibiraci": {
    "name": "Ibiraci",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.4611,
    "lng": -47.1222
  },
  "igaratinga": {
    "name": "Igaratinga",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.9476,
    "lng": -44.7063
  },
  "iguatama": {
    "name": "Iguatama",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.1776,
    "lng": -45.7111
  },
  "itaguara": {
    "name": "Itaguara",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.3947,
    "lng": -44.4875
  },
  "itamogi": {
    "name": "Itamogi",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.0758,
    "lng": -47.046
  },
  "itapecerica": {
    "name": "Itapecerica",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.4704,
    "lng": -45.127
  },
  "itatiaiucu": {
    "name": "Itatiaiuçu",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.1983,
    "lng": -44.4211
  },
  "itau de minas": {
    "name": "Itaú de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.7375,
    "lng": -46.7525
  },
  "itauna": {
    "name": "Itaúna",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.0818,
    "lng": -44.5801
  },
  "jacui": {
    "name": "Jacuí",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.0137,
    "lng": -46.7359
  },
  "japaraiba": {
    "name": "Japaraíba",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -20.1442,
    "lng": -45.5015
  },
  "juruaia": {
    "name": "Juruaia",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.2493,
    "lng": -46.5735
  },
  "lagoa da prata": {
    "name": "Lagoa da Prata",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -20.0237,
    "lng": -45.5401
  },
  "leandro ferreira": {
    "name": "Leandro Ferreira",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.7193,
    "lng": -45.0279
  },
  "luz": {
    "name": "Luz",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.7911,
    "lng": -45.6794
  },
  "martinho campos": {
    "name": "Martinho Campos",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.3306,
    "lng": -45.2434
  },
  "medeiros": {
    "name": "Medeiros",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -19.9865,
    "lng": -46.2181
  },
  "moema": {
    "name": "Moema",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.8387,
    "lng": -45.4127
  },
  "monte santo de minas": {
    "name": "Monte Santo de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.1873,
    "lng": -46.9753
  },
  "muzambinho": {
    "name": "Muzambinho",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.3692,
    "lng": -46.5213
  },
  "nova resende": {
    "name": "Nova Resende",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.1286,
    "lng": -46.4157
  },
  "nova serrana": {
    "name": "Nova Serrana",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.8713,
    "lng": -44.9847
  },
  "oliveira": {
    "name": "Oliveira",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.6982,
    "lng": -44.829
  },
  "onca de pitangui": {
    "name": "Onça de Pitangui",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.7276,
    "lng": -44.8058
  },
  "pains": {
    "name": "Pains",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.3705,
    "lng": -45.6627
  },
  "para de minas": {
    "name": "Pará de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.8534,
    "lng": -44.6114
  },
  "passa tempo": {
    "name": "Passa Tempo",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.6539,
    "lng": -44.4926
  },
  "passos": {
    "name": "Passos",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.7193,
    "lng": -46.609
  },
  "pedra do indaia": {
    "name": "Pedra do Indaiá",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.2563,
    "lng": -45.2107
  },
  "perdigao": {
    "name": "Perdigão",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.9411,
    "lng": -45.078
  },
  "piedade dos gerais": {
    "name": "Piedade dos Gerais",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.4715,
    "lng": -44.2243
  },
  "pimenta": {
    "name": "Pimenta",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -20.4827,
    "lng": -45.8049
  },
  "piracema": {
    "name": "Piracema",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.5089,
    "lng": -44.4783
  },
  "pitangui": {
    "name": "Pitangui",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.6741,
    "lng": -44.8964
  },
  "piumhi": {
    "name": "Piumhi",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.4762,
    "lng": -45.9589
  },
  "pratapolis": {
    "name": "Pratápolis",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.7411,
    "lng": -46.8624
  },
  "quartel geral": {
    "name": "Quartel Geral",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.2703,
    "lng": -45.5569
  },
  "rio manso": {
    "name": "Rio Manso",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -20.2666,
    "lng": -44.3069
  },
  "santo antonio do monte": {
    "name": "Santo Antônio do Monte",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -20.085,
    "lng": -45.2947
  },
  "sao francisco de paula": {
    "name": "São Francisco de Paula",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.7036,
    "lng": -44.9838
  },
  "sao goncalo do para": {
    "name": "São Gonçalo do Pará",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -19.9822,
    "lng": -44.8593
  },
  "sao joao batista do gloria": {
    "name": "São João Batista do Glória",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.635,
    "lng": -46.508
  },
  "sao jose da barra": {
    "name": "São José da Barra",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.7178,
    "lng": -46.313
  },
  "sao jose da varginha": {
    "name": "São José da Varginha",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Itaúna",
    "lat": -19.7006,
    "lng": -44.556
  },
  "sao pedro da uniao": {
    "name": "São Pedro da União",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -21.131,
    "lng": -46.6123
  },
  "sao roque de minas": {
    "name": "São Roque de Minas",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.249,
    "lng": -46.3639
  },
  "sao sebastiao do oeste": {
    "name": "São Sebastião do Oeste",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Divinópolis",
    "lat": -20.2758,
    "lng": -45.0063
  },
  "sao sebastiao do paraiso": {
    "name": "São Sebastião do Paraíso",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -20.9167,
    "lng": -46.9837
  },
  "sao tomas de aquino": {
    "name": "São Tomás de Aquino",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "São Sebastião do Paraíso",
    "lat": -20.7791,
    "lng": -47.0962
  },
  "serra da saudade": {
    "name": "Serra da Saudade",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Nova Serrana",
    "lat": -19.4447,
    "lng": -45.795
  },
  "tapirai": {
    "name": "Tapiraí",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Formiga",
    "lat": -19.8936,
    "lng": -46.0221
  },
  "vargem bonita": {
    "name": "Vargem Bonita",
    "regional": "Centro-Oeste e Sudoeste",
    "mr": "Passos",
    "lat": -20.3333,
    "lng": -46.3688
  },
  "agua boa": {
    "name": "Água Boa",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.9914,
    "lng": -42.3806
  },
  "aguas formosas": {
    "name": "Águas Formosas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.0802,
    "lng": -40.9384
  },
  "almenara": {
    "name": "Almenara",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.1785,
    "lng": -40.6942
  },
  "alvorada de minas": {
    "name": "Alvorada de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.7334,
    "lng": -43.3638
  },
  "angelandia": {
    "name": "Angelândia",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.7279,
    "lng": -42.2641
  },
  "aracuai": {
    "name": "Araçuaí",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.8523,
    "lng": -42.0637
  },
  "aricanduva": {
    "name": "Aricanduva",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.8666,
    "lng": -42.5533
  },
  "ataleia": {
    "name": "Ataléia",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -18.0438,
    "lng": -41.1149
  },
  "bandeira": {
    "name": "Bandeira",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -15.8783,
    "lng": -40.5622
  },
  "berilo": {
    "name": "Berilo",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.9567,
    "lng": -42.4606
  },
  "bertopolis": {
    "name": "Bertópolis",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.059,
    "lng": -40.58
  },
  "cachoeira de pajeu": {
    "name": "Cachoeira de Pajeú",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -15.9688,
    "lng": -41.4948
  },
  "capelinha": {
    "name": "Capelinha",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.6888,
    "lng": -42.5147
  },
  "carai": {
    "name": "Caraí",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.1862,
    "lng": -41.7004
  },
  "carbonita": {
    "name": "Carbonita",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.5255,
    "lng": -43.0137
  },
  "carlos chagas": {
    "name": "Carlos Chagas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.6973,
    "lng": -40.7723
  },
  "catuji": {
    "name": "Catuji",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.3018,
    "lng": -41.5276
  },
  "chapada do norte": {
    "name": "Chapada do Norte",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.0881,
    "lng": -42.5392
  },
  "comercinho": {
    "name": "Comercinho",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.2963,
    "lng": -41.7945
  },
  "coronel murta": {
    "name": "Coronel Murta",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.6148,
    "lng": -42.184
  },
  "couto de magalhaes de minas": {
    "name": "Couto de Magalhães de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.0727,
    "lng": -43.4648
  },
  "crisolita": {
    "name": "Crisólita",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.2381,
    "lng": -40.9184
  },
  "datas": {
    "name": "Datas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.4478,
    "lng": -43.6591
  },
  "diamantina": {
    "name": "Diamantina",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.2413,
    "lng": -43.6031
  },
  "divisopolis": {
    "name": "Divisópolis",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -15.7254,
    "lng": -40.9997
  },
  "felicio dos santos": {
    "name": "Felício dos Santos",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.0755,
    "lng": -43.2422
  },
  "felisburgo": {
    "name": "Felisburgo",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.6348,
    "lng": -40.7605
  },
  "francisco badaro": {
    "name": "Francisco Badaró",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.9883,
    "lng": -42.3568
  },
  "franciscopolis": {
    "name": "Franciscópolis",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.9578,
    "lng": -42.0094
  },
  "frei gaspar": {
    "name": "Frei Gaspar",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -18.0709,
    "lng": -41.4325
  },
  "fronteira dos vales": {
    "name": "Fronteira dos Vales",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -16.8898,
    "lng": -40.923
  },
  "gouveia": {
    "name": "Gouveia",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.4519,
    "lng": -43.7423
  },
  "itaipe": {
    "name": "Itaipé",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.4014,
    "lng": -41.6697
  },
  "itamarandiba": {
    "name": "Itamarandiba",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.8552,
    "lng": -42.8561
  },
  "itambacuri": {
    "name": "Itambacuri",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -18.035,
    "lng": -41.683
  },
  "itaobim": {
    "name": "Itaobim",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.5571,
    "lng": -41.5017
  },
  "itinga": {
    "name": "Itinga",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.61,
    "lng": -41.7672
  },
  "jacinto": {
    "name": "Jacinto",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.1428,
    "lng": -40.295
  },
  "jenipapo de minas": {
    "name": "Jenipapo de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -17.0831,
    "lng": -42.2589
  },
  "jequitinhonha": {
    "name": "Jequitinhonha",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.4375,
    "lng": -41.0117
  },
  "joaima": {
    "name": "Joaíma",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.6522,
    "lng": -41.0229
  },
  "jordania": {
    "name": "Jordânia",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -15.9009,
    "lng": -40.1841
  },
  "jose goncalves de minas": {
    "name": "José Gonçalves de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -16.9053,
    "lng": -42.6014
  },
  "ladainha": {
    "name": "Ladainha",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.6279,
    "lng": -41.7488
  },
  "leme do prado": {
    "name": "Leme do Prado",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.0793,
    "lng": -42.6936
  },
  "machacalis": {
    "name": "Machacalis",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.0723,
    "lng": -40.7245
  },
  "malacacheta": {
    "name": "Malacacheta",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.8456,
    "lng": -42.0769
  },
  "mata verde": {
    "name": "Mata Verde",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -15.6869,
    "lng": -40.7366
  },
  "medina": {
    "name": "Medina",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.2245,
    "lng": -41.4728
  },
  "minas novas": {
    "name": "Minas Novas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.2156,
    "lng": -42.5884
  },
  "monte formoso": {
    "name": "Monte Formoso",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.8691,
    "lng": -41.2473
  },
  "nanuque": {
    "name": "Nanuque",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.8481,
    "lng": -40.3533
  },
  "novo cruzeiro": {
    "name": "Novo Cruzeiro",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.4654,
    "lng": -41.8826
  },
  "novo oriente de minas": {
    "name": "Novo Oriente de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.4089,
    "lng": -41.2194
  },
  "ouro verde de minas": {
    "name": "Ouro Verde de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -18.0719,
    "lng": -41.2734
  },
  "padre paraiso": {
    "name": "Padre Paraíso",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.0758,
    "lng": -41.4821
  },
  "palmopolis": {
    "name": "Palmópolis",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.7364,
    "lng": -40.4296
  },
  "pavao": {
    "name": "Pavão",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.4267,
    "lng": -41.0035
  },
  "pedra azul": {
    "name": "Pedra Azul",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.0086,
    "lng": -41.2909
  },
  "ponto dos volantes": {
    "name": "Ponto dos Volantes",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.7473,
    "lng": -41.5025
  },
  "pote": {
    "name": "Poté",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.8077,
    "lng": -41.786
  },
  "presidente kubitschek": {
    "name": "Presidente Kubitschek",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.6193,
    "lng": -43.5628
  },
  "rio do prado": {
    "name": "Rio do Prado",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.6056,
    "lng": -40.5714
  },
  "rio vermelho": {
    "name": "Rio Vermelho",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.2922,
    "lng": -43.0018
  },
  "rubim": {
    "name": "Rubim",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.3775,
    "lng": -40.5397
  },
  "salto da divisa": {
    "name": "Salto da Divisa",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.0063,
    "lng": -39.9391
  },
  "santa helena de minas": {
    "name": "Santa Helena de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -16.9707,
    "lng": -40.6727
  },
  "santa maria do salto": {
    "name": "Santa Maria do Salto",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.2479,
    "lng": -40.1512
  },
  "santo antonio do itambe": {
    "name": "Santo Antônio do Itambé",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.4609,
    "lng": -43.3006
  },
  "santo antonio do jacinto": {
    "name": "Santo Antônio do Jacinto",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Almenara",
    "lat": -16.5332,
    "lng": -40.1817
  },
  "sao goncalo do rio preto": {
    "name": "São Gonçalo do Rio Preto",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.0025,
    "lng": -43.3854
  },
  "senador modestino goncalves": {
    "name": "Senador Modestino Gonçalves",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -17.9465,
    "lng": -43.2172
  },
  "serra azul de minas": {
    "name": "Serra Azul de Minas",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.3602,
    "lng": -43.1675
  },
  "serra dos aimores": {
    "name": "Serra dos Aimorés",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.7872,
    "lng": -40.2453
  },
  "serro": {
    "name": "Serro",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Diamantina",
    "lat": -18.5991,
    "lng": -43.3744
  },
  "setubinha": {
    "name": "Setubinha",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.6002,
    "lng": -42.1587
  },
  "teofilo otoni": {
    "name": "Teófilo Otoni",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Teófilo Otoni",
    "lat": -17.8595,
    "lng": -41.5087
  },
  "turmalina": {
    "name": "Turmalina",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.2828,
    "lng": -42.7285
  },
  "umburatiba": {
    "name": "Umburatiba",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Nanuque",
    "lat": -17.2548,
    "lng": -40.5779
  },
  "veredinha": {
    "name": "Veredinha",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Chapada de Minas",
    "lat": -17.3974,
    "lng": -42.7307
  },
  "virgem da lapa": {
    "name": "Virgem da Lapa",
    "regional": "Jequitinhonha e Mucuri",
    "mr": "Araçuaí",
    "lat": -16.807,
    "lng": -42.3431
  },
  "abadia dos dourados": {
    "name": "Abadia dos Dourados",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.4831,
    "lng": -47.3916
  },
  "arapua": {
    "name": "Arapuá",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.0268,
    "lng": -46.1484
  },
  "arinos": {
    "name": "Arinos",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -15.9187,
    "lng": -46.1043
  },
  "biquinhas": {
    "name": "Biquinhas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.7754,
    "lng": -45.4974
  },
  "bonfinopolis de minas": {
    "name": "Bonfinópolis de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -16.568,
    "lng": -45.9839
  },
  "brasilandia de minas": {
    "name": "Brasilândia de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -16.9999,
    "lng": -46.0081
  },
  "buritis": {
    "name": "Buritis",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -15.6218,
    "lng": -46.4221
  },
  "cabeceira grande": {
    "name": "Cabeceira Grande",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -16.0335,
    "lng": -47.0862
  },
  "carmo do paranaiba": {
    "name": "Carmo do Paranaíba",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -18.991,
    "lng": -46.3167
  },
  "chapada gaucha": {
    "name": "Chapada Gaúcha",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -15.3014,
    "lng": -45.6116
  },
  "coromandel": {
    "name": "Coromandel",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.4734,
    "lng": -47.1933
  },
  "cruzeiro da fortaleza": {
    "name": "Cruzeiro da Fortaleza",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.944,
    "lng": -46.6669
  },
  "dom bosco": {
    "name": "Dom Bosco",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -16.652,
    "lng": -46.2597
  },
  "douradoquara": {
    "name": "Douradoquara",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.4338,
    "lng": -47.5993
  },
  "estrela do sul": {
    "name": "Estrela do Sul",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.7399,
    "lng": -47.6956
  },
  "formoso": {
    "name": "Formoso",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -14.9446,
    "lng": -46.2371
  },
  "grupiara": {
    "name": "Grupiara",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.5003,
    "lng": -47.7318
  },
  "guarda-mor": {
    "name": "Guarda-Mor",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -17.7673,
    "lng": -47.0998
  },
  "guimarania": {
    "name": "Guimarânia",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.8425,
    "lng": -46.7901
  },
  "irai de minas": {
    "name": "Iraí de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.9819,
    "lng": -47.461
  },
  "joao pinheiro": {
    "name": "João Pinheiro",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -17.7398,
    "lng": -46.1715
  },
  "lagamar": {
    "name": "Lagamar",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.1759,
    "lng": -46.8063
  },
  "lagoa formosa": {
    "name": "Lagoa Formosa",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -18.7715,
    "lng": -46.4012
  },
  "lagoa grande": {
    "name": "Lagoa Grande",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -17.8323,
    "lng": -46.5165
  },
  "matutina": {
    "name": "Matutina",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.2179,
    "lng": -45.9664
  },
  "monte carmelo": {
    "name": "Monte Carmelo",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.7302,
    "lng": -47.4912
  },
  "morada nova de minas": {
    "name": "Morada Nova de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.5998,
    "lng": -45.3584
  },
  "natalandia": {
    "name": "Natalândia",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -16.5021,
    "lng": -46.4874
  },
  "paineiras": {
    "name": "Paineiras",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.8993,
    "lng": -45.5321
  },
  "paracatu": {
    "name": "Paracatu",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -17.2252,
    "lng": -46.8711
  },
  "patos de minas": {
    "name": "Patos de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -18.5699,
    "lng": -46.5013
  },
  "patrocinio": {
    "name": "Patrocínio",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.9379,
    "lng": -46.9934
  },
  "pintopolis": {
    "name": "Pintópolis",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -16.0572,
    "lng": -45.1402
  },
  "presidente olegario": {
    "name": "Presidente Olegário",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -18.4096,
    "lng": -46.4165
  },
  "riachinho": {
    "name": "Riachinho",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -16.2258,
    "lng": -45.9888
  },
  "rio paranaiba": {
    "name": "Rio Paranaíba",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.1861,
    "lng": -46.2455
  },
  "romaria": {
    "name": "Romaria",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -18.8838,
    "lng": -47.5782
  },
  "santa fe de minas": {
    "name": "Santa Fé de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -16.6859,
    "lng": -45.4102
  },
  "santa rosa da serra": {
    "name": "Santa Rosa da Serra",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.5186,
    "lng": -45.9611
  },
  "sao goncalo do abaete": {
    "name": "São Gonçalo do Abaeté",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.3315,
    "lng": -45.8265
  },
  "sao gotardo": {
    "name": "São Gotardo",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.3087,
    "lng": -46.0465
  },
  "sao romao": {
    "name": "São Romão",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -16.3641,
    "lng": -45.0749
  },
  "serra do salitre": {
    "name": "Serra do Salitre",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patrocínio",
    "lat": -19.1083,
    "lng": -46.6961
  },
  "tiros": {
    "name": "Tiros",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -19.0037,
    "lng": -45.9626
  },
  "tres marias": {
    "name": "Três Marias",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -18.2048,
    "lng": -45.2473
  },
  "unai": {
    "name": "Unaí",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Unaí",
    "lat": -16.3592,
    "lng": -46.9022
  },
  "uruana de minas": {
    "name": "Uruana de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -16.0634,
    "lng": -46.2443
  },
  "urucuia": {
    "name": "Urucuia",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Grande Sertão Veredas",
    "lat": -16.1244,
    "lng": -45.7352
  },
  "varjao de minas": {
    "name": "Varjão de Minas",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Patos de Minas",
    "lat": -18.3741,
    "lng": -46.0313
  },
  "vazante": {
    "name": "Vazante",
    "regional": "Noroeste e Alto Paranaíba",
    "mr": "Paracatu",
    "lat": -17.9827,
    "lng": -46.9088
  },
  "aguas vermelhas": {
    "name": "Águas Vermelhas",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.7431,
    "lng": -41.4571
  },
  "berizal": {
    "name": "Berizal",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.61,
    "lng": -41.7432
  },
  "bocaiuva": {
    "name": "Bocaiúva",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.1135,
    "lng": -43.8104
  },
  "bonito de minas": {
    "name": "Bonito de Minas",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.3231,
    "lng": -44.7543
  },
  "botumirim": {
    "name": "Botumirim",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.8657,
    "lng": -43.0086
  },
  "brasilia de minas": {
    "name": "Brasília de Minas",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.2104,
    "lng": -44.4299
  },
  "buenopolis": {
    "name": "Buenópolis",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.8744,
    "lng": -44.1775
  },
  "buritizeiro": {
    "name": "Buritizeiro",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -17.3656,
    "lng": -44.9606
  },
  "campo azul": {
    "name": "Campo Azul",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.5028,
    "lng": -44.8096
  },
  "capitao eneas": {
    "name": "Capitão Enéas",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.3265,
    "lng": -43.7084
  },
  "catuti": {
    "name": "Catuti",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.3616,
    "lng": -42.9627
  },
  "claro dos pocoes": {
    "name": "Claro dos Poções",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.082,
    "lng": -44.2061
  },
  "conego marinho": {
    "name": "Cônego Marinho",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.2892,
    "lng": -44.4181
  },
  "coracao de jesus": {
    "name": "Coração de Jesus",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.6841,
    "lng": -44.3635
  },
  "cristalia": {
    "name": "Cristália",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.716,
    "lng": -42.8571
  },
  "curral de dentro": {
    "name": "Curral de Dentro",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.9327,
    "lng": -41.8557
  },
  "divisa alegre": {
    "name": "Divisa Alegre",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.7221,
    "lng": -41.3463
  },
  "engenheiro navarro": {
    "name": "Engenheiro Navarro",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.2831,
    "lng": -43.947
  },
  "espinosa": {
    "name": "Espinosa",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -14.9249,
    "lng": -42.809
  },
  "francisco dumont": {
    "name": "Francisco Dumont",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.3107,
    "lng": -44.2317
  },
  "francisco sa": {
    "name": "Francisco Sá",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.4827,
    "lng": -43.4896
  },
  "fruta de leite": {
    "name": "Fruta de Leite",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -16.1225,
    "lng": -42.5288
  },
  "gameleiras": {
    "name": "Gameleiras",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.0829,
    "lng": -43.125
  },
  "glaucilandia": {
    "name": "Glaucilândia",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.8481,
    "lng": -43.692
  },
  "grao mogol": {
    "name": "Grão Mogol",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.5662,
    "lng": -42.8923
  },
  "guaraciama": {
    "name": "Guaraciama",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.0142,
    "lng": -43.6675
  },
  "ibiai": {
    "name": "Ibiaí",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -16.8591,
    "lng": -44.9046
  },
  "ibiracatu": {
    "name": "Ibiracatu",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -15.6605,
    "lng": -44.1667
  },
  "icarai de minas": {
    "name": "Icaraí de Minas",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -16.214,
    "lng": -44.9034
  },
  "indaiabira": {
    "name": "Indaiabira",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.4911,
    "lng": -42.2005
  },
  "itacambira": {
    "name": "Itacambira",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.0625,
    "lng": -43.3069
  },
  "itacarambi": {
    "name": "Itacarambi",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.089,
    "lng": -44.095
  },
  "jaiba": {
    "name": "Jaíba",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.3432,
    "lng": -43.6688
  },
  "janauba": {
    "name": "Janaúba",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.8022,
    "lng": -43.3132
  },
  "januaria": {
    "name": "Januária",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.4802,
    "lng": -44.3639
  },
  "japonvar": {
    "name": "Japonvar",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -15.9891,
    "lng": -44.2758
  },
  "jequitai": {
    "name": "Jequitaí",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -17.229,
    "lng": -44.4376
  },
  "joaquim felicio": {
    "name": "Joaquim Felício",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.758,
    "lng": -44.1643
  },
  "josenopolis": {
    "name": "Josenópolis",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.5417,
    "lng": -42.5151
  },
  "juramento": {
    "name": "Juramento",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.8473,
    "lng": -43.5865
  },
  "juvenilia": {
    "name": "Juvenília",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -14.2662,
    "lng": -44.1597
  },
  "lagoa dos patos": {
    "name": "Lagoa dos Patos",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -16.978,
    "lng": -44.5754
  },
  "lassance": {
    "name": "Lassance",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -17.887,
    "lng": -44.5735
  },
  "lontra": {
    "name": "Lontra",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -15.9013,
    "lng": -44.306
  },
  "luislandia": {
    "name": "Luislândia",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.1095,
    "lng": -44.5886
  },
  "mamonas": {
    "name": "Mamonas",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.0479,
    "lng": -42.9469
  },
  "manga": {
    "name": "Manga",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -14.7529,
    "lng": -43.9391
  },
  "matias cardoso": {
    "name": "Matias Cardoso",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -14.8563,
    "lng": -43.9146
  },
  "mato verde": {
    "name": "Mato Verde",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.3944,
    "lng": -42.86
  },
  "mirabela": {
    "name": "Mirabela",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.256,
    "lng": -44.1602
  },
  "miravania": {
    "name": "Miravânia",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -14.7348,
    "lng": -44.4092
  },
  "montalvania": {
    "name": "Montalvânia",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -14.4197,
    "lng": -44.3719
  },
  "monte azul": {
    "name": "Monte Azul",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.1514,
    "lng": -42.8718
  },
  "montes claros": {
    "name": "Montes Claros",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.7282,
    "lng": -43.8578
  },
  "montezuma": {
    "name": "Montezuma",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.1702,
    "lng": -42.4941
  },
  "ninheira": {
    "name": "Ninheira",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.3148,
    "lng": -41.7564
  },
  "nova porteirinha": {
    "name": "Nova Porteirinha",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.7993,
    "lng": -43.2941
  },
  "novorizonte": {
    "name": "Novorizonte",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -16.0162,
    "lng": -42.4044
  },
  "olhos-d'agua": {
    "name": "Olhos-d'Água",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -17.3982,
    "lng": -43.5719
  },
  "padre carvalho": {
    "name": "Padre Carvalho",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.3646,
    "lng": -42.5088
  },
  "pai pedro": {
    "name": "Pai Pedro",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.5271,
    "lng": -43.07
  },
  "patis": {
    "name": "Patis",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.0773,
    "lng": -44.0787
  },
  "pedras de maria da cruz": {
    "name": "Pedras de Maria da Cruz",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.6032,
    "lng": -44.391
  },
  "pirapora": {
    "name": "Pirapora",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -17.3392,
    "lng": -44.934
  },
  "ponto chique": {
    "name": "Ponto Chique",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -16.6282,
    "lng": -45.0588
  },
  "porteirinha": {
    "name": "Porteirinha",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.7404,
    "lng": -43.0281
  },
  "riacho dos machados": {
    "name": "Riacho dos Machados",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -16.0091,
    "lng": -43.0488
  },
  "rio pardo de minas": {
    "name": "Rio Pardo de Minas",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.616,
    "lng": -42.5405
  },
  "rubelita": {
    "name": "Rubelita",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -16.4053,
    "lng": -42.261
  },
  "salinas": {
    "name": "Salinas",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -16.1753,
    "lng": -42.2964
  },
  "santa cruz de salinas": {
    "name": "Santa Cruz de Salinas",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -16.0967,
    "lng": -41.7418
  },
  "santo antonio do retiro": {
    "name": "Santo Antônio do Retiro",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.3393,
    "lng": -42.6171
  },
  "sao francisco": {
    "name": "São Francisco",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -15.9514,
    "lng": -44.8593
  },
  "sao joao da lagoa": {
    "name": "São João da Lagoa",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.8455,
    "lng": -44.3507
  },
  "sao joao da ponte": {
    "name": "São João da Ponte",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -15.9271,
    "lng": -44.0096
  },
  "sao joao das missoes": {
    "name": "São João das Missões",
    "regional": "Norte",
    "mr": "Januária",
    "lat": -14.8859,
    "lng": -44.0922
  },
  "sao joao do pacui": {
    "name": "São João do Pacuí",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.5373,
    "lng": -44.5134
  },
  "sao joao do paraiso": {
    "name": "São João do Paraíso",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.3168,
    "lng": -42.0213
  },
  "serranopolis de minas": {
    "name": "Serranópolis de Minas",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.8176,
    "lng": -42.8732
  },
  "taiobeiras": {
    "name": "Taiobeiras",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.8106,
    "lng": -42.2259
  },
  "ubai": {
    "name": "Ubaí",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -16.2885,
    "lng": -44.7783
  },
  "vargem grande do rio pardo": {
    "name": "Vargem Grande do Rio Pardo",
    "regional": "Norte",
    "mr": "Alto Rio Pardo",
    "lat": -15.3987,
    "lng": -42.3085
  },
  "varzea da palma": {
    "name": "Várzea da Palma",
    "regional": "Norte",
    "mr": "Pirapora",
    "lat": -17.5944,
    "lng": -44.7226
  },
  "varzelandia": {
    "name": "Varzelândia",
    "regional": "Norte",
    "mr": "Montes Claros",
    "lat": -15.6992,
    "lng": -44.0278
  },
  "verdelandia": {
    "name": "Verdelândia",
    "regional": "Norte",
    "mr": "Serra Geral",
    "lat": -15.5845,
    "lng": -43.6121
  },
  "acucena": {
    "name": "Açucena",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.0671,
    "lng": -42.5419
  },
  "aimores": {
    "name": "Aimorés",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.5007,
    "lng": -41.0746
  },
  "alpercata": {
    "name": "Alpercata",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.974,
    "lng": -41.97
  },
  "alvarenga": {
    "name": "Alvarenga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.4174,
    "lng": -41.7317
  },
  "alvinopolis": {
    "name": "Alvinópolis",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -20.1098,
    "lng": -43.0535
  },
  "antonio dias": {
    "name": "Antônio Dias",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.6491,
    "lng": -42.8732
  },
  "barao de cocais": {
    "name": "Barão de Cocais",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.9389,
    "lng": -43.4755
  },
  "bela vista de minas": {
    "name": "Bela Vista de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.8302,
    "lng": -43.0922
  },
  "belo oriente": {
    "name": "Belo Oriente",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.2199,
    "lng": -42.4828
  },
  "bom jesus do amparo": {
    "name": "Bom Jesus do Amparo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.7054,
    "lng": -43.4782
  },
  "bom jesus do galho": {
    "name": "Bom Jesus do Galho",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.836,
    "lng": -42.3165
  },
  "braunas": {
    "name": "Braúnas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -19.0562,
    "lng": -42.7099
  },
  "bugre": {
    "name": "Bugre",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.4231,
    "lng": -42.2552
  },
  "campanario": {
    "name": "Campanário",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.2427,
    "lng": -41.7355
  },
  "cantagalo": {
    "name": "Cantagalo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.5248,
    "lng": -42.6223
  },
  "capitao andrade": {
    "name": "Capitão Andrade",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.0748,
    "lng": -41.8614
  },
  "caratinga": {
    "name": "Caratinga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.7868,
    "lng": -42.1292
  },
  "carmesia": {
    "name": "Carmésia",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -19.0877,
    "lng": -43.1382
  },
  "catas altas": {
    "name": "Catas Altas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -20.0734,
    "lng": -43.4061
  },
  "central de minas": {
    "name": "Central de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.7612,
    "lng": -41.3143
  },
  "coluna": {
    "name": "Coluna",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.2311,
    "lng": -42.8352
  },
  "conceicao de ipanema": {
    "name": "Conceição de Ipanema",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.9326,
    "lng": -41.6908
  },
  "conselheiro pena": {
    "name": "Conselheiro Pena",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.1789,
    "lng": -41.4736
  },
  "coroaci": {
    "name": "Coroaci",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.6156,
    "lng": -42.2791
  },
  "coronel fabriciano": {
    "name": "Coronel Fabriciano",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.5179,
    "lng": -42.6276
  },
  "corrego novo": {
    "name": "Córrego Novo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.8361,
    "lng": -42.3988
  },
  "cuparaque": {
    "name": "Cuparaque",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.9648,
    "lng": -41.0986
  },
  "dionisio": {
    "name": "Dionísio",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.8433,
    "lng": -42.7701
  },
  "divino das laranjeiras": {
    "name": "Divino das Laranjeiras",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.7755,
    "lng": -41.4781
  },
  "divinolandia de minas": {
    "name": "Divinolândia de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.8004,
    "lng": -42.6103
  },
  "dom cavati": {
    "name": "Dom Cavati",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.3735,
    "lng": -42.1121
  },
  "dores de guanhaes": {
    "name": "Dores de Guanhães",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -19.0516,
    "lng": -42.9254
  },
  "engenheiro caldas": {
    "name": "Engenheiro Caldas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.2065,
    "lng": -42.0503
  },
  "entre folhas": {
    "name": "Entre Folhas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.6218,
    "lng": -42.2306
  },
  "fernandes tourinho": {
    "name": "Fernandes Tourinho",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.1541,
    "lng": -42.0803
  },
  "ferros": {
    "name": "Ferros",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.2343,
    "lng": -43.0192
  },
  "frei inocencio": {
    "name": "Frei Inocêncio",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.5556,
    "lng": -41.9121
  },
  "frei lagonegro": {
    "name": "Frei Lagonegro",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.1751,
    "lng": -42.7617
  },
  "galileia": {
    "name": "Galiléia",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.0005,
    "lng": -41.5387
  },
  "goiabeira": {
    "name": "Goiabeira",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.9807,
    "lng": -41.2235
  },
  "gonzaga": {
    "name": "Gonzaga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.8196,
    "lng": -42.4769
  },
  "governador valadares": {
    "name": "Governador Valadares",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.8545,
    "lng": -41.9555
  },
  "guanhaes": {
    "name": "Guanhães",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.7713,
    "lng": -42.9312
  },
  "iapu": {
    "name": "Iapu",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.4387,
    "lng": -42.2147
  },
  "imbe de minas": {
    "name": "Imbé de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.6017,
    "lng": -41.9695
  },
  "inhapim": {
    "name": "Inhapim",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.5476,
    "lng": -42.1147
  },
  "ipaba": {
    "name": "Ipaba",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.4158,
    "lng": -42.4139
  },
  "ipanema": {
    "name": "Ipanema",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.7992,
    "lng": -41.7164
  },
  "ipatinga": {
    "name": "Ipatinga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.4703,
    "lng": -42.5476
  },
  "itabira": {
    "name": "Itabira",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.6239,
    "lng": -43.2312
  },
  "itabirinha": {
    "name": "Itabirinha",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.5712,
    "lng": -41.234
  },
  "itanhomi": {
    "name": "Itanhomi",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.1736,
    "lng": -41.863
  },
  "itueta": {
    "name": "Itueta",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.3999,
    "lng": -41.1746
  },
  "jaguaracu": {
    "name": "Jaguaraçu",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.647,
    "lng": -42.7498
  },
  "jampruca": {
    "name": "Jampruca",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.461,
    "lng": -41.809
  },
  "joanesia": {
    "name": "Joanésia",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.1729,
    "lng": -42.6775
  },
  "joao monlevade": {
    "name": "João Monlevade",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.8126,
    "lng": -43.1735
  },
  "jose raydan": {
    "name": "José Raydan",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.2195,
    "lng": -42.4946
  },
  "mantena": {
    "name": "Mantena",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.7761,
    "lng": -40.9874
  },
  "marilac": {
    "name": "Marilac",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.5079,
    "lng": -42.0822
  },
  "marlieria": {
    "name": "Marliéria",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.7096,
    "lng": -42.7327
  },
  "materlandia": {
    "name": "Materlândia",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.4699,
    "lng": -43.0579
  },
  "mathias lobato": {
    "name": "Mathias Lobato",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.59,
    "lng": -41.9166
  },
  "mendes pimentel": {
    "name": "Mendes Pimentel",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.6631,
    "lng": -41.4052
  },
  "mesquita": {
    "name": "Mesquita",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.224,
    "lng": -42.6079
  },
  "mutum": {
    "name": "Mutum",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.8121,
    "lng": -41.4407
  },
  "nacip raydan": {
    "name": "Nacip Raydan",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.4544,
    "lng": -42.2481
  },
  "naque": {
    "name": "Naque",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.2291,
    "lng": -42.3312
  },
  "nova belem": {
    "name": "Nova Belém",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.4925,
    "lng": -41.1107
  },
  "nova era": {
    "name": "Nova Era",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.7577,
    "lng": -43.0333
  },
  "nova modica": {
    "name": "Nova Módica",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.4417,
    "lng": -41.4984
  },
  "nova uniao": {
    "name": "Nova União",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.6876,
    "lng": -43.583
  },
  "passabem": {
    "name": "Passabém",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.3509,
    "lng": -43.1383
  },
  "paulistas": {
    "name": "Paulistas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.4276,
    "lng": -42.8628
  },
  "pecanha": {
    "name": "Peçanha",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.5441,
    "lng": -42.5583
  },
  "periquito": {
    "name": "Periquito",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.1573,
    "lng": -42.2333
  },
  "pescador": {
    "name": "Pescador",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.357,
    "lng": -41.6006
  },
  "piedade de caratinga": {
    "name": "Piedade de Caratinga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.7593,
    "lng": -42.0756
  },
  "pingo-d'agua": {
    "name": "Pingo-d'Água",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.7287,
    "lng": -42.4095
  },
  "pocrane": {
    "name": "Pocrane",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.6208,
    "lng": -41.6334
  },
  "resplendor": {
    "name": "Resplendor",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.3194,
    "lng": -41.2462
  },
  "rio piracicaba": {
    "name": "Rio Piracicaba",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.9284,
    "lng": -43.1829
  },
  "sabinopolis": {
    "name": "Sabinópolis",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.6653,
    "lng": -43.0752
  },
  "santa barbara": {
    "name": "Santa Bárbara",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.9604,
    "lng": -43.4101
  },
  "santa barbara do leste": {
    "name": "Santa Bárbara do Leste",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.9753,
    "lng": -42.1457
  },
  "santa efigenia de minas": {
    "name": "Santa Efigênia de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.8235,
    "lng": -42.4388
  },
  "santa maria de itabira": {
    "name": "Santa Maria de Itabira",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.4431,
    "lng": -43.1064
  },
  "santa maria do suacui": {
    "name": "Santa Maria do Suaçuí",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.1896,
    "lng": -42.4139
  },
  "santa rita de minas": {
    "name": "Santa Rita de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.876,
    "lng": -42.1363
  },
  "santa rita do itueto": {
    "name": "Santa Rita do Itueto",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.3576,
    "lng": -41.3821
  },
  "santana do paraiso": {
    "name": "Santana do Paraíso",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.3661,
    "lng": -42.5446
  },
  "santo antonio do rio abaixo": {
    "name": "Santo Antônio do Rio Abaixo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.2374,
    "lng": -43.2604
  },
  "sao domingos das dores": {
    "name": "São Domingos das Dores",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.5246,
    "lng": -42.0106
  },
  "sao domingos do prata": {
    "name": "São Domingos do Prata",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.8678,
    "lng": -42.971
  },
  "sao felix de minas": {
    "name": "São Félix de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.5959,
    "lng": -41.4889
  },
  "sao geraldo da piedade": {
    "name": "São Geraldo da Piedade",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.8411,
    "lng": -42.2867
  },
  "sao geraldo do baixio": {
    "name": "São Geraldo do Baixio",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.9097,
    "lng": -41.363
  },
  "sao goncalo do rio abaixo": {
    "name": "São Gonçalo do Rio Abaixo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.8221,
    "lng": -43.366
  },
  "sao joao do manteninha": {
    "name": "São João do Manteninha",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -18.723,
    "lng": -41.1628
  },
  "sao joao do oriente": {
    "name": "São João do Oriente",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.3384,
    "lng": -42.1575
  },
  "sao joao evangelista": {
    "name": "São João Evangelista",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.548,
    "lng": -42.7655
  },
  "sao jose da safira": {
    "name": "São José da Safira",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.3243,
    "lng": -42.1431
  },
  "sao jose do divino": {
    "name": "São José do Divino",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.4793,
    "lng": -41.3907
  },
  "sao jose do goiabal": {
    "name": "São José do Goiabal",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "João Monlevade",
    "lat": -19.9214,
    "lng": -42.7035
  },
  "sao jose do jacuri": {
    "name": "São José do Jacuri",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.281,
    "lng": -42.6729
  },
  "sao pedro do suacui": {
    "name": "São Pedro do Suaçuí",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.3609,
    "lng": -42.5981
  },
  "sao sebastiao do anta": {
    "name": "São Sebastião do Anta",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.5064,
    "lng": -41.985
  },
  "sao sebastiao do maranhao": {
    "name": "São Sebastião do Maranhão",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.0873,
    "lng": -42.5659
  },
  "sao sebastiao do rio preto": {
    "name": "São Sebastião do Rio Preto",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.2959,
    "lng": -43.1757
  },
  "sardoa": {
    "name": "Sardoá",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.7828,
    "lng": -42.3629
  },
  "senhora do porto": {
    "name": "Senhora do Porto",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.8909,
    "lng": -43.0799
  },
  "sobralia": {
    "name": "Sobrália",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.2345,
    "lng": -42.0998
  },
  "taparuba": {
    "name": "Taparuba",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Aimorés",
    "lat": -19.7621,
    "lng": -41.608
  },
  "taquaracu de minas": {
    "name": "Taquaraçu de Minas",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Itabira",
    "lat": -19.6652,
    "lng": -43.6922
  },
  "tarumirim": {
    "name": "Tarumirim",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -19.2835,
    "lng": -42.0097
  },
  "timoteo": {
    "name": "Timóteo",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Ipatinga",
    "lat": -19.5811,
    "lng": -42.6471
  },
  "tumiritinga": {
    "name": "Tumiritinga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.9844,
    "lng": -41.6527
  },
  "ubaporanga": {
    "name": "Ubaporanga",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.6351,
    "lng": -42.1059
  },
  "vargem alegre": {
    "name": "Vargem Alegre",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Caratinga",
    "lat": -19.5988,
    "lng": -42.2949
  },
  "virginopolis": {
    "name": "Virginópolis",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Guanhães",
    "lat": -18.8154,
    "lng": -42.7015
  },
  "virgolandia": {
    "name": "Virgolândia",
    "regional": "Rio Doce e Vale do Aço",
    "mr": "Governador Valadares",
    "lat": -18.4738,
    "lng": -42.3067
  },
  "aguanil": {
    "name": "Aguanil",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -20.9439,
    "lng": -45.3915
  },
  "aiuruoca": {
    "name": "Aiuruoca",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9736,
    "lng": -44.6042
  },
  "alagoa": {
    "name": "Alagoa",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.171,
    "lng": -44.6413
  },
  "albertina": {
    "name": "Albertina",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.2018,
    "lng": -46.6139
  },
  "alfenas": {
    "name": "Alfenas",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.4256,
    "lng": -45.9477
  },
  "alterosa": {
    "name": "Alterosa",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.2488,
    "lng": -46.1387
  },
  "andradas": {
    "name": "Andradas",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.0695,
    "lng": -46.5724
  },
  "andrelandia": {
    "name": "Andrelândia",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.7411,
    "lng": -44.3117
  },
  "arantina": {
    "name": "Arantina",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9102,
    "lng": -44.2555
  },
  "areado": {
    "name": "Areado",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.3572,
    "lng": -46.1421
  },
  "baependi": {
    "name": "Baependi",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.957,
    "lng": -44.8874
  },
  "bandeira do sul": {
    "name": "Bandeira do Sul",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -21.7308,
    "lng": -46.3833
  },
  "boa esperanca": {
    "name": "Boa Esperança",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.0927,
    "lng": -45.5612
  },
  "bocaina de minas": {
    "name": "Bocaina de Minas",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.1697,
    "lng": -44.3972
  },
  "bom repouso": {
    "name": "Bom Repouso",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.4675,
    "lng": -46.144
  },
  "bom sucesso": {
    "name": "Bom Sucesso",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.0329,
    "lng": -44.7537
  },
  "borda da mata": {
    "name": "Borda da Mata",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.2707,
    "lng": -46.1653
  },
  "botelhos": {
    "name": "Botelhos",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -21.6412,
    "lng": -46.391
  },
  "brazopolis": {
    "name": "Brazópolis",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.4743,
    "lng": -45.6166
  },
  "bueno brandao": {
    "name": "Bueno Brandão",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.4383,
    "lng": -46.3491
  },
  "cachoeira de minas": {
    "name": "Cachoeira de Minas",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.3511,
    "lng": -45.7809
  },
  "caldas": {
    "name": "Caldas",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -21.9183,
    "lng": -46.3843
  },
  "camanducaia": {
    "name": "Camanducaia",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.7515,
    "lng": -46.1494
  },
  "cambui": {
    "name": "Cambuí",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.6115,
    "lng": -46.0572
  },
  "cambuquira": {
    "name": "Cambuquira",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.854,
    "lng": -45.2896
  },
  "campanha": {
    "name": "Campanha",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.836,
    "lng": -45.4004
  },
  "campestre": {
    "name": "Campestre",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -21.7079,
    "lng": -46.2381
  },
  "campo belo": {
    "name": "Campo Belo",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -20.8932,
    "lng": -45.2699
  },
  "campo do meio": {
    "name": "Campo do Meio",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.1127,
    "lng": -45.8273
  },
  "campos gerais": {
    "name": "Campos Gerais",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.237,
    "lng": -45.7569
  },
  "cana verde": {
    "name": "Cana Verde",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.0232,
    "lng": -45.1801
  },
  "careacu": {
    "name": "Careaçu",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.0424,
    "lng": -45.696
  },
  "carmo da cachoeira": {
    "name": "Carmo da Cachoeira",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.4633,
    "lng": -45.2201
  },
  "carmo de minas": {
    "name": "Carmo de Minas",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.1204,
    "lng": -45.1307
  },
  "carrancas": {
    "name": "Carrancas",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.4898,
    "lng": -44.6446
  },
  "carvalhopolis": {
    "name": "Carvalhópolis",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.7735,
    "lng": -45.8421
  },
  "carvalhos": {
    "name": "Carvalhos",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.0,
    "lng": -44.4632
  },
  "caxambu": {
    "name": "Caxambu",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9753,
    "lng": -44.9319
  },
  "conceicao da aparecida": {
    "name": "Conceição da Aparecida",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.096,
    "lng": -46.2049
  },
  "conceicao das pedras": {
    "name": "Conceição das Pedras",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.1576,
    "lng": -45.4562
  },
  "conceicao do rio verde": {
    "name": "Conceição do Rio Verde",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.8778,
    "lng": -45.087
  },
  "conceicao dos ouros": {
    "name": "Conceição dos Ouros",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.4078,
    "lng": -45.7996
  },
  "congonhal": {
    "name": "Congonhal",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.1488,
    "lng": -46.043
  },
  "consolacao": {
    "name": "Consolação",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.5493,
    "lng": -45.9255
  },
  "coqueiral": {
    "name": "Coqueiral",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.1858,
    "lng": -45.4366
  },
  "cordislandia": {
    "name": "Cordislândia",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.7891,
    "lng": -45.6999
  },
  "corrego do bom jesus": {
    "name": "Córrego do Bom Jesus",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.6269,
    "lng": -46.0241
  },
  "cristina": {
    "name": "Cristina",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.208,
    "lng": -45.2673
  },
  "cruzilia": {
    "name": "Cruzília",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.84,
    "lng": -44.8067
  },
  "delfim moreira": {
    "name": "Delfim Moreira",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.5036,
    "lng": -45.2792
  },
  "divisa nova": {
    "name": "Divisa Nova",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.5092,
    "lng": -46.1904
  },
  "dom vicoso": {
    "name": "Dom Viçoso",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.2511,
    "lng": -45.1643
  },
  "eloi mendes": {
    "name": "Elói Mendes",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.6088,
    "lng": -45.5691
  },
  "espirito santo do dourado": {
    "name": "Espírito Santo do Dourado",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.0454,
    "lng": -45.9548
  },
  "estiva": {
    "name": "Estiva",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.4577,
    "lng": -46.0191
  },
  "extrema": {
    "name": "Extrema",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.854,
    "lng": -46.3178
  },
  "fama": {
    "name": "Fama",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.4089,
    "lng": -45.8286
  },
  "goncalves": {
    "name": "Gonçalves",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.6545,
    "lng": -45.8556
  },
  "guape": {
    "name": "Guapé",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -20.7631,
    "lng": -45.9152
  },
  "heliodora": {
    "name": "Heliodora",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.0644,
    "lng": -45.5453
  },
  "ibitiura de minas": {
    "name": "Ibitiúra de Minas",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.0604,
    "lng": -46.4368
  },
  "ibituruna": {
    "name": "Ibituruna",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.1541,
    "lng": -44.7479
  },
  "ijaci": {
    "name": "Ijaci",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.1738,
    "lng": -44.9233
  },
  "ilicinea": {
    "name": "Ilicínea",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -20.9402,
    "lng": -45.8308
  },
  "inconfidentes": {
    "name": "Inconfidentes",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.3136,
    "lng": -46.3264
  },
  "ingai": {
    "name": "Ingaí",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.4024,
    "lng": -44.9152
  },
  "ipuiuna": {
    "name": "Ipuiúna",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.1013,
    "lng": -46.1915
  },
  "itajuba": {
    "name": "Itajubá",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.4225,
    "lng": -45.4598
  },
  "itamonte": {
    "name": "Itamonte",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.2859,
    "lng": -44.868
  },
  "itanhandu": {
    "name": "Itanhandu",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.2942,
    "lng": -44.9382
  },
  "itapeva": {
    "name": "Itapeva",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.7665,
    "lng": -46.2241
  },
  "itumirim": {
    "name": "Itumirim",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.3171,
    "lng": -44.8724
  },
  "jacutinga": {
    "name": "Jacutinga",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.286,
    "lng": -46.6166
  },
  "jesuania": {
    "name": "Jesuânia",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9887,
    "lng": -45.2911
  },
  "lambari": {
    "name": "Lambari",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9671,
    "lng": -45.3498
  },
  "lavras": {
    "name": "Lavras",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.248,
    "lng": -45.0009
  },
  "liberdade": {
    "name": "Liberdade",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.0275,
    "lng": -44.3208
  },
  "luminarias": {
    "name": "Luminárias",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.5145,
    "lng": -44.9034
  },
  "machado": {
    "name": "Machado",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.6778,
    "lng": -45.9219
  },
  "maria da fe": {
    "name": "Maria da Fé",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.3044,
    "lng": -45.3773
  },
  "marmelopolis": {
    "name": "Marmelópolis",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.447,
    "lng": -45.1645
  },
  "minduri": {
    "name": "Minduri",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.6797,
    "lng": -44.6051
  },
  "monsenhor paulo": {
    "name": "Monsenhor Paulo",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.7579,
    "lng": -45.5391
  },
  "monte belo": {
    "name": "Monte Belo",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.3271,
    "lng": -46.3635
  },
  "monte siao": {
    "name": "Monte Sião",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.4335,
    "lng": -46.573
  },
  "munhoz": {
    "name": "Munhoz",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.6092,
    "lng": -46.362
  },
  "natercia": {
    "name": "Natércia",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.1158,
    "lng": -45.5123
  },
  "nepomuceno": {
    "name": "Nepomuceno",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.2324,
    "lng": -45.235
  },
  "olimpio noronha": {
    "name": "Olímpio Noronha",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.0685,
    "lng": -45.2657
  },
  "ouro fino": {
    "name": "Ouro Fino",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.2779,
    "lng": -46.3716
  },
  "paraguacu": {
    "name": "Paraguaçu",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.5465,
    "lng": -45.7374
  },
  "paraisopolis": {
    "name": "Paraisópolis",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.5539,
    "lng": -45.7803
  },
  "passa quatro": {
    "name": "Passa Quatro",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.3871,
    "lng": -44.9709
  },
  "passa vinte": {
    "name": "Passa Vinte",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.2097,
    "lng": -44.2344
  },
  "pedralva": {
    "name": "Pedralva",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.2386,
    "lng": -45.4654
  },
  "perdoes": {
    "name": "Perdões",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.0932,
    "lng": -45.0896
  },
  "pirangucu": {
    "name": "Piranguçu",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.5249,
    "lng": -45.4945
  },
  "piranguinho": {
    "name": "Piranguinho",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.395,
    "lng": -45.5324
  },
  "poco fundo": {
    "name": "Poço Fundo",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.78,
    "lng": -45.9658
  },
  "pocos de caldas": {
    "name": "Poços de Caldas",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -21.78,
    "lng": -46.5692
  },
  "pouso alegre": {
    "name": "Pouso Alegre",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.2266,
    "lng": -45.9389
  },
  "pouso alto": {
    "name": "Pouso Alto",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.1964,
    "lng": -44.9748
  },
  "ribeirao vermelho": {
    "name": "Ribeirão Vermelho",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -21.1879,
    "lng": -45.0637
  },
  "santa rita de caldas": {
    "name": "Santa Rita de Caldas",
    "regional": "Sul",
    "mr": "Poços de Caldas",
    "lat": -22.0292,
    "lng": -46.3385
  },
  "santa rita do sapucai": {
    "name": "Santa Rita do Sapucaí",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.2461,
    "lng": -45.7034
  },
  "santana da vargem": {
    "name": "Santana da Vargem",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.2449,
    "lng": -45.5005
  },
  "santana do jacare": {
    "name": "Santana do Jacaré",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -20.9007,
    "lng": -45.1285
  },
  "santo antonio do amparo": {
    "name": "Santo Antônio do Amparo",
    "regional": "Sul",
    "mr": "Lavras",
    "lat": -20.943,
    "lng": -44.9176
  },
  "sao bento abade": {
    "name": "São Bento Abade",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.5839,
    "lng": -45.0699
  },
  "sao goncalo do sapucai": {
    "name": "São Gonçalo do Sapucaí",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.8932,
    "lng": -45.5893
  },
  "sao joao da mata": {
    "name": "São João da Mata",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -21.928,
    "lng": -45.9297
  },
  "sao jose do alegre": {
    "name": "São José do Alegre",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.3243,
    "lng": -45.5258
  },
  "sao lourenco": {
    "name": "São Lourenço",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.1166,
    "lng": -45.0506
  },
  "sao sebastiao da bela vista": {
    "name": "São Sebastião da Bela Vista",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.1583,
    "lng": -45.7546
  },
  "sao sebastiao do rio verde": {
    "name": "São Sebastião do Rio Verde",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.2183,
    "lng": -44.9761
  },
  "sao tome das letras": {
    "name": "São Tomé das Letras",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.7218,
    "lng": -44.9849
  },
  "sao vicente de minas": {
    "name": "São Vicente de Minas",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.7042,
    "lng": -44.4431
  },
  "sapucai-mirim": {
    "name": "Sapucaí-Mirim",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.7409,
    "lng": -45.738
  },
  "senador amaral": {
    "name": "Senador Amaral",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.5869,
    "lng": -46.1763
  },
  "senador jose bento": {
    "name": "Senador José Bento",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.1633,
    "lng": -46.1792
  },
  "seritinga": {
    "name": "Seritinga",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.9134,
    "lng": -44.518
  },
  "serrania": {
    "name": "Serrania",
    "regional": "Sul",
    "mr": "Alfenas",
    "lat": -21.5441,
    "lng": -46.0417
  },
  "serranos": {
    "name": "Serranos",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -21.8857,
    "lng": -44.5125
  },
  "silvianopolis": {
    "name": "Silvianópolis",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -22.0274,
    "lng": -45.8385
  },
  "soledade de minas": {
    "name": "Soledade de Minas",
    "regional": "Sul",
    "mr": "Mantiqueira de Minas",
    "lat": -22.0554,
    "lng": -45.0464
  },
  "tocos do moji": {
    "name": "Tocos do Moji",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.3698,
    "lng": -46.0971
  },
  "toledo": {
    "name": "Toledo",
    "regional": "Sul",
    "mr": "Pouso Alegre",
    "lat": -22.7421,
    "lng": -46.3728
  },
  "tres coracoes": {
    "name": "Três Corações",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.6921,
    "lng": -45.2511
  },
  "tres pontas": {
    "name": "Três Pontas",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.3694,
    "lng": -45.5109
  },
  "turvolandia": {
    "name": "Turvolândia",
    "regional": "Sul",
    "mr": "Vale da Eletrônica",
    "lat": -21.8733,
    "lng": -45.7859
  },
  "varginha": {
    "name": "Varginha",
    "regional": "Sul",
    "mr": "Varginha",
    "lat": -21.5556,
    "lng": -45.4364
  },
  "virginia": {
    "name": "Virgínia",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.3264,
    "lng": -45.0965
  },
  "wenceslau braz": {
    "name": "Wenceslau Braz",
    "regional": "Sul",
    "mr": "Itajubá",
    "lat": -22.5368,
    "lng": -45.3626
  },
  "agua comprida": {
    "name": "Água Comprida",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -20.0576,
    "lng": -48.1069
  },
  "araguari": {
    "name": "Araguari",
    "regional": "Triângulo",
    "mr": "Araguari",
    "lat": -18.6456,
    "lng": -48.1934
  },
  "arapora": {
    "name": "Araporã",
    "regional": "Triângulo",
    "mr": "Araguari",
    "lat": -18.4357,
    "lng": -49.1847
  },
  "araxa": {
    "name": "Araxá",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.5902,
    "lng": -46.9438
  },
  "cachoeira dourada": {
    "name": "Cachoeira Dourada",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.5161,
    "lng": -49.5039
  },
  "campina verde": {
    "name": "Campina Verde",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.5382,
    "lng": -49.4862
  },
  "campo florido": {
    "name": "Campo Florido",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.7631,
    "lng": -48.5716
  },
  "campos altos": {
    "name": "Campos Altos",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.6914,
    "lng": -46.1725
  },
  "canapolis": {
    "name": "Canápolis",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.7212,
    "lng": -49.2035
  },
  "capinopolis": {
    "name": "Capinópolis",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.6862,
    "lng": -49.5706
  },
  "carneirinho": {
    "name": "Carneirinho",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.6987,
    "lng": -50.6894
  },
  "cascalho rico": {
    "name": "Cascalho Rico",
    "regional": "Triângulo",
    "mr": "Araguari",
    "lat": -18.5772,
    "lng": -47.8716
  },
  "centralina": {
    "name": "Centralina",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.5852,
    "lng": -49.2014
  },
  "comendador gomes": {
    "name": "Comendador Gomes",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.6973,
    "lng": -49.0789
  },
  "conceicao das alagoas": {
    "name": "Conceição das Alagoas",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.9172,
    "lng": -48.3839
  },
  "conquista": {
    "name": "Conquista",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.9312,
    "lng": -47.5492
  },
  "delta": {
    "name": "Delta",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.9721,
    "lng": -47.7841
  },
  "fronteira": {
    "name": "Fronteira",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -20.2748,
    "lng": -49.1984
  },
  "frutal": {
    "name": "Frutal",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -20.0259,
    "lng": -48.9355
  },
  "gurinhata": {
    "name": "Gurinhatã",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -19.2143,
    "lng": -49.7876
  },
  "ibia": {
    "name": "Ibiá",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.4749,
    "lng": -46.5474
  },
  "indianopolis": {
    "name": "Indianópolis",
    "regional": "Triângulo",
    "mr": "Araguari",
    "lat": -19.0341,
    "lng": -47.9155
  },
  "ipiacu": {
    "name": "Ipiaçu",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.6927,
    "lng": -49.9436
  },
  "itapagipe": {
    "name": "Itapagipe",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.9062,
    "lng": -49.3781
  },
  "ituiutaba": {
    "name": "Ituiutaba",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.9772,
    "lng": -49.4639
  },
  "iturama": {
    "name": "Iturama",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.7276,
    "lng": -50.1966
  },
  "limeira do oeste": {
    "name": "Limeira do Oeste",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.5512,
    "lng": -50.5815
  },
  "monte alegre de minas": {
    "name": "Monte Alegre de Minas",
    "regional": "Triângulo",
    "mr": "Uberlândia",
    "lat": -18.869,
    "lng": -48.881
  },
  "nova ponte": {
    "name": "Nova Ponte",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.1461,
    "lng": -47.6779
  },
  "pedrinopolis": {
    "name": "Pedrinópolis",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.2241,
    "lng": -47.4579
  },
  "perdizes": {
    "name": "Perdizes",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.3434,
    "lng": -47.2963
  },
  "pirajuba": {
    "name": "Pirajuba",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.9092,
    "lng": -48.7027
  },
  "planura": {
    "name": "Planura",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -20.1376,
    "lng": -48.7
  },
  "prata": {
    "name": "Prata",
    "regional": "Triângulo",
    "mr": "Uberlândia",
    "lat": -19.3086,
    "lng": -48.9276
  },
  "pratinha": {
    "name": "Pratinha",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.739,
    "lng": -46.3755
  },
  "sacramento": {
    "name": "Sacramento",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.8622,
    "lng": -47.4508
  },
  "santa juliana": {
    "name": "Santa Juliana",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.3108,
    "lng": -47.5322
  },
  "santa vitoria": {
    "name": "Santa Vitória",
    "regional": "Triângulo",
    "mr": "Ituiutaba",
    "lat": -18.8414,
    "lng": -50.1208
  },
  "sao francisco de sales": {
    "name": "São Francisco de Sales",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.8611,
    "lng": -49.7727
  },
  "tapira": {
    "name": "Tapira",
    "regional": "Triângulo",
    "mr": "Araxá",
    "lat": -19.9166,
    "lng": -46.8264
  },
  "tupaciguara": {
    "name": "Tupaciguara",
    "regional": "Triângulo",
    "mr": "Araguari",
    "lat": -18.5866,
    "lng": -48.6985
  },
  "uberaba": {
    "name": "Uberaba",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.7472,
    "lng": -47.9381
  },
  "uberlandia": {
    "name": "Uberlândia",
    "regional": "Triângulo",
    "mr": "Uberlândia",
    "lat": -18.9141,
    "lng": -48.2749
  },
  "uniao de minas": {
    "name": "União de Minas",
    "regional": "Triângulo",
    "mr": "Frutal",
    "lat": -19.5299,
    "lng": -50.338
  },
  "verissimo": {
    "name": "Veríssimo",
    "regional": "Triângulo",
    "mr": "Uberaba",
    "lat": -19.6657,
    "lng": -48.3118
  },
  "abre campo": {
    "name": "Abre Campo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2996,
    "lng": -42.4743
  },
  "acaiaca": {
    "name": "Acaiaca",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.359,
    "lng": -43.1439
  },
  "alem paraiba": {
    "name": "Além Paraíba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.8797,
    "lng": -42.7176
  },
  "alfredo vasconcelos": {
    "name": "Alfredo Vasconcelos",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.1535,
    "lng": -43.7718
  },
  "alto caparao": {
    "name": "Alto Caparaó",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.431,
    "lng": -41.8738
  },
  "alto jequitiba": {
    "name": "Alto Jequitibá",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.4208,
    "lng": -41.967
  },
  "alto rio doce": {
    "name": "Alto Rio Doce",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.0281,
    "lng": -43.4067
  },
  "amparo do serra": {
    "name": "Amparo do Serra",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.5051,
    "lng": -42.8009
  },
  "antonio carlos": {
    "name": "Antônio Carlos",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.321,
    "lng": -43.7451
  },
  "antonio prado de minas": {
    "name": "Antônio Prado de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -21.0192,
    "lng": -42.1109
  },
  "aracitaba": {
    "name": "Aracitaba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.3446,
    "lng": -43.3736
  },
  "araponga": {
    "name": "Araponga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.6686,
    "lng": -42.5178
  },
  "argirita": {
    "name": "Argirita",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.6083,
    "lng": -42.8292
  },
  "astolfo dutra": {
    "name": "Astolfo Dutra",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.3184,
    "lng": -42.8572
  },
  "barbacena": {
    "name": "Barbacena",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.2214,
    "lng": -43.7703
  },
  "barra longa": {
    "name": "Barra Longa",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.2869,
    "lng": -43.0402
  },
  "barroso": {
    "name": "Barroso",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.1907,
    "lng": -43.972
  },
  "belmiro braga": {
    "name": "Belmiro Braga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.944,
    "lng": -43.4084
  },
  "bias fortes": {
    "name": "Bias Fortes",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.602,
    "lng": -43.7574
  },
  "bicas": {
    "name": "Bicas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.7232,
    "lng": -43.056
  },
  "bom jardim de minas": {
    "name": "Bom Jardim de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.9479,
    "lng": -44.1885
  },
  "bras pires": {
    "name": "Brás Pires",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.8419,
    "lng": -43.2406
  },
  "caiana": {
    "name": "Caiana",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.6956,
    "lng": -41.9292
  },
  "cajuri": {
    "name": "Cajuri",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.7903,
    "lng": -42.7925
  },
  "canaa": {
    "name": "Canaã",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.6869,
    "lng": -42.6167
  },
  "caparao": {
    "name": "Caparaó",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.5289,
    "lng": -41.9061
  },
  "capela nova": {
    "name": "Capela Nova",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -20.9179,
    "lng": -43.622
  },
  "caputira": {
    "name": "Caputira",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.1703,
    "lng": -42.2683
  },
  "caranaiba": {
    "name": "Caranaíba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -20.8707,
    "lng": -43.7417
  },
  "carandai": {
    "name": "Carandaí",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -20.9566,
    "lng": -43.811
  },
  "carangola": {
    "name": "Carangola",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.7343,
    "lng": -42.0313
  },
  "cataguases": {
    "name": "Cataguases",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.3924,
    "lng": -42.6896
  },
  "chacara": {
    "name": "Chácara",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.6733,
    "lng": -43.215
  },
  "chale": {
    "name": "Chalé",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.0453,
    "lng": -41.6897
  },
  "chiador": {
    "name": "Chiador",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.9996,
    "lng": -43.0617
  },
  "cipotanea": {
    "name": "Cipotânea",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.9026,
    "lng": -43.3629
  },
  "coimbra": {
    "name": "Coimbra",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.8535,
    "lng": -42.8008
  },
  "conceicao da barra de minas": {
    "name": "Conceição da Barra de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.1316,
    "lng": -44.4729
  },
  "coronel pacheco": {
    "name": "Coronel Pacheco",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.5898,
    "lng": -43.256
  },
  "coronel xavier chaves": {
    "name": "Coronel Xavier Chaves",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.0277,
    "lng": -44.2206
  },
  "descoberto": {
    "name": "Descoberto",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.46,
    "lng": -42.9618
  },
  "desterro do melo": {
    "name": "Desterro do Melo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.143,
    "lng": -43.5178
  },
  "divinesia": {
    "name": "Divinésia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.9917,
    "lng": -43.0003
  },
  "divino": {
    "name": "Divino",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.6134,
    "lng": -42.1438
  },
  "dom silverio": {
    "name": "Dom Silvério",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.1627,
    "lng": -42.9627
  },
  "dona euzebia": {
    "name": "Dona Euzébia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.319,
    "lng": -42.807
  },
  "dores de campos": {
    "name": "Dores de Campos",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.1139,
    "lng": -44.0207
  },
  "dores do turvo": {
    "name": "Dores do Turvo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.9785,
    "lng": -43.1834
  },
  "durande": {
    "name": "Durandé",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2058,
    "lng": -41.7977
  },
  "ervalia": {
    "name": "Ervália",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.8403,
    "lng": -42.6544
  },
  "espera feliz": {
    "name": "Espera Feliz",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.6508,
    "lng": -41.9119
  },
  "estrela dalva": {
    "name": "Estrela Dalva",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.7412,
    "lng": -42.4574
  },
  "eugenopolis": {
    "name": "Eugenópolis",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -21.1002,
    "lng": -42.1878
  },
  "ewbank da camara": {
    "name": "Ewbank da Câmara",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.5498,
    "lng": -43.5068
  },
  "faria lemos": {
    "name": "Faria Lemos",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.8097,
    "lng": -42.0213
  },
  "fervedouro": {
    "name": "Fervedouro",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.726,
    "lng": -42.279
  },
  "goiana": {
    "name": "Goianá",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.536,
    "lng": -43.1957
  },
  "guaraciaba": {
    "name": "Guaraciaba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.5716,
    "lng": -43.0094
  },
  "guarani": {
    "name": "Guarani",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.3563,
    "lng": -43.0328
  },
  "guarara": {
    "name": "Guarará",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.7304,
    "lng": -43.0334
  },
  "guidoval": {
    "name": "Guidoval",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.155,
    "lng": -42.7887
  },
  "guiricema": {
    "name": "Guiricema",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.0098,
    "lng": -42.7207
  },
  "ibertioga": {
    "name": "Ibertioga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.433,
    "lng": -43.9639
  },
  "itamarati de minas": {
    "name": "Itamarati de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.4179,
    "lng": -42.813
  },
  "itutinga": {
    "name": "Itutinga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.3,
    "lng": -44.6567
  },
  "jequeri": {
    "name": "Jequeri",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.4542,
    "lng": -42.6651
  },
  "juiz de fora": {
    "name": "Juiz de Fora",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.7595,
    "lng": -43.3398
  },
  "lagoa dourada": {
    "name": "Lagoa Dourada",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -20.9139,
    "lng": -44.0797
  },
  "lajinha": {
    "name": "Lajinha",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.1539,
    "lng": -41.6228
  },
  "lamim": {
    "name": "Lamim",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.79,
    "lng": -43.4706
  },
  "laranjal": {
    "name": "Laranjal",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -21.3715,
    "lng": -42.4732
  },
  "leopoldina": {
    "name": "Leopoldina",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.5296,
    "lng": -42.6421
  },
  "lima duarte": {
    "name": "Lima Duarte",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.8386,
    "lng": -43.7934
  },
  "luisburgo": {
    "name": "Luisburgo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.4468,
    "lng": -42.0976
  },
  "madre de deus de minas": {
    "name": "Madre de Deus de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.483,
    "lng": -44.3287
  },
  "manhuacu": {
    "name": "Manhuaçu",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2572,
    "lng": -42.028
  },
  "manhumirim": {
    "name": "Manhumirim",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.3591,
    "lng": -41.9589
  },
  "mar de espanha": {
    "name": "Mar de Espanha",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.8707,
    "lng": -43.0062
  },
  "maripa de minas": {
    "name": "Maripá de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.6979,
    "lng": -42.9546
  },
  "martins soares": {
    "name": "Martins Soares",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2546,
    "lng": -41.8786
  },
  "matias barbosa": {
    "name": "Matias Barbosa",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.869,
    "lng": -43.3135
  },
  "matipo": {
    "name": "Matipó",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2873,
    "lng": -42.3401
  },
  "merces": {
    "name": "Mercês",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.1976,
    "lng": -43.3337
  },
  "miradouro": {
    "name": "Miradouro",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.8899,
    "lng": -42.3458
  },
  "mirai": {
    "name": "Miraí",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.2021,
    "lng": -42.6122
  },
  "muriae": {
    "name": "Muriaé",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -21.13,
    "lng": -42.3693
  },
  "nazareno": {
    "name": "Nazareno",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.2168,
    "lng": -44.6138
  },
  "olaria": {
    "name": "Olaria",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.8598,
    "lng": -43.9356
  },
  "oliveira fortes": {
    "name": "Oliveira Fortes",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.3401,
    "lng": -43.4499
  },
  "oratorios": {
    "name": "Oratórios",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.4298,
    "lng": -42.7977
  },
  "orizania": {
    "name": "Orizânia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.5142,
    "lng": -42.1991
  },
  "paiva": {
    "name": "Paiva",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.2913,
    "lng": -43.4088
  },
  "palma": {
    "name": "Palma",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.3748,
    "lng": -42.3123
  },
  "patrocinio do muriae": {
    "name": "Patrocínio do Muriaé",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -21.1544,
    "lng": -42.2125
  },
  "paula candido": {
    "name": "Paula Cândido",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.8754,
    "lng": -42.9752
  },
  "pedra bonita": {
    "name": "Pedra Bonita",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.5219,
    "lng": -42.3304
  },
  "pedra do anta": {
    "name": "Pedra do Anta",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.5968,
    "lng": -42.7123
  },
  "pedra dourada": {
    "name": "Pedra Dourada",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.8266,
    "lng": -42.1515
  },
  "pedro teixeira": {
    "name": "Pedro Teixeira",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.7076,
    "lng": -43.743
  },
  "pequeri": {
    "name": "Pequeri",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.8341,
    "lng": -43.1145
  },
  "piau": {
    "name": "Piau",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.5096,
    "lng": -43.313
  },
  "piedade de ponte nova": {
    "name": "Piedade de Ponte Nova",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.2438,
    "lng": -42.7379
  },
  "piedade do rio grande": {
    "name": "Piedade do Rio Grande",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.469,
    "lng": -44.1938
  },
  "piranga": {
    "name": "Piranga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.6834,
    "lng": -43.2967
  },
  "pirapetinga": {
    "name": "Pirapetinga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.6554,
    "lng": -42.3434
  },
  "pirauba": {
    "name": "Piraúba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.2825,
    "lng": -43.0172
  },
  "ponte nova": {
    "name": "Ponte Nova",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.4111,
    "lng": -42.8978
  },
  "porto firme": {
    "name": "Porto Firme",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.6642,
    "lng": -43.0834
  },
  "prados": {
    "name": "Prados",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.0597,
    "lng": -44.0778
  },
  "presidente bernardes": {
    "name": "Presidente Bernardes",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.7656,
    "lng": -43.1895
  },
  "raul soares": {
    "name": "Raul Soares",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.1061,
    "lng": -42.4502
  },
  "recreio": {
    "name": "Recreio",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.5289,
    "lng": -42.4676
  },
  "reduto": {
    "name": "Reduto",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.2401,
    "lng": -41.9848
  },
  "resende costa": {
    "name": "Resende Costa",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -20.9171,
    "lng": -44.2407
  },
  "ressaquinha": {
    "name": "Ressaquinha",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.0642,
    "lng": -43.7598
  },
  "rio casca": {
    "name": "Rio Casca",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.2285,
    "lng": -42.6462
  },
  "rio doce": {
    "name": "Rio Doce",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.2412,
    "lng": -42.8995
  },
  "rio espera": {
    "name": "Rio Espera",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.855,
    "lng": -43.4721
  },
  "rio novo": {
    "name": "Rio Novo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.4649,
    "lng": -43.1168
  },
  "rio pomba": {
    "name": "Rio Pomba",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.2712,
    "lng": -43.1696
  },
  "rio preto": {
    "name": "Rio Preto",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -22.0861,
    "lng": -43.8293
  },
  "ritapolis": {
    "name": "Ritápolis",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.0276,
    "lng": -44.3204
  },
  "rochedo de minas": {
    "name": "Rochedo de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.6284,
    "lng": -43.0165
  },
  "rodeiro": {
    "name": "Rodeiro",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.2035,
    "lng": -42.8586
  },
  "rosario da limeira": {
    "name": "Rosário da Limeira",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.9812,
    "lng": -42.5112
  },
  "santa barbara do monte verde": {
    "name": "Santa Bárbara do Monte Verde",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.9592,
    "lng": -43.7027
  },
  "santa barbara do tugurio": {
    "name": "Santa Bárbara do Tugúrio",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.2431,
    "lng": -43.5607
  },
  "santa cruz de minas": {
    "name": "Santa Cruz de Minas",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.1241,
    "lng": -44.2202
  },
  "santa cruz do escalvado": {
    "name": "Santa Cruz do Escalvado",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.2372,
    "lng": -42.8169
  },
  "santa margarida": {
    "name": "Santa Margarida",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.3839,
    "lng": -42.2519
  },
  "santa rita de ibitipoca": {
    "name": "Santa Rita de Ibitipoca",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.5658,
    "lng": -43.9163
  },
  "santa rita de jacutinga": {
    "name": "Santa Rita de Jacutinga",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -22.1474,
    "lng": -44.0977
  },
  "santana de cataguases": {
    "name": "Santana de Cataguases",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.2893,
    "lng": -42.5524
  },
  "santana do deserto": {
    "name": "Santana do Deserto",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.9512,
    "lng": -43.1583
  },
  "santana do garambeu": {
    "name": "Santana do Garambéu",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.5983,
    "lng": -44.105
  },
  "santana do manhuacu": {
    "name": "Santana do Manhuaçu",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.1031,
    "lng": -41.9278
  },
  "santo antonio do aventureiro": {
    "name": "Santo Antônio do Aventureiro",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.7606,
    "lng": -42.8115
  },
  "santo antonio do grama": {
    "name": "Santo Antônio do Grama",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.3185,
    "lng": -42.6047
  },
  "santos dumont": {
    "name": "Santos Dumont",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.4634,
    "lng": -43.5499
  },
  "sao francisco do gloria": {
    "name": "São Francisco do Glória",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.7923,
    "lng": -42.2673
  },
  "sao geraldo": {
    "name": "São Geraldo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.9252,
    "lng": -42.8364
  },
  "sao joao del rei": {
    "name": "São João del Rei",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.1311,
    "lng": -44.2526
  },
  "sao joao do manhuacu": {
    "name": "São João do Manhuaçu",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.3933,
    "lng": -42.1533
  },
  "sao joao nepomuceno": {
    "name": "São João Nepomuceno",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.5381,
    "lng": -43.0069
  },
  "sao jose do mantimento": {
    "name": "São José do Mantimento",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.0058,
    "lng": -41.7486
  },
  "sao miguel do anta": {
    "name": "São Miguel do Anta",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.7067,
    "lng": -42.7174
  },
  "sao pedro dos ferros": {
    "name": "São Pedro dos Ferros",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.1732,
    "lng": -42.5251
  },
  "sao sebastiao da vargem alegre": {
    "name": "São Sebastião da Vargem Alegre",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -19.7477,
    "lng": -43.3679
  },
  "sao tiago": {
    "name": "São Tiago",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -20.9075,
    "lng": -44.5098
  },
  "sem-peixe": {
    "name": "Sem-Peixe",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.1008,
    "lng": -42.8483
  },
  "senador cortes": {
    "name": "Senador Cortes",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.7986,
    "lng": -42.9424
  },
  "senador firmino": {
    "name": "Senador Firmino",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -20.9158,
    "lng": -43.0904
  },
  "senhora de oliveira": {
    "name": "Senhora de Oliveira",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.7972,
    "lng": -43.3394
  },
  "senhora dos remedios": {
    "name": "Senhora dos Remédios",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Barbacena",
    "lat": -21.0351,
    "lng": -43.5812
  },
  "sericita": {
    "name": "Sericita",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.4748,
    "lng": -42.4828
  },
  "silveirania": {
    "name": "Silveirânia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.1615,
    "lng": -43.2128
  },
  "simao pereira": {
    "name": "Simão Pereira",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Juiz de Fora",
    "lat": -21.964,
    "lng": -43.3088
  },
  "simonesia": {
    "name": "Simonésia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Manhuaçu",
    "lat": -20.1341,
    "lng": -42.0091
  },
  "tabuleiro": {
    "name": "Tabuleiro",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.3632,
    "lng": -43.2381
  },
  "teixeiras": {
    "name": "Teixeiras",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.6561,
    "lng": -42.8564
  },
  "tiradentes": {
    "name": "Tiradentes",
    "regional": "Zona da Mata e Vertentes",
    "mr": "São João Del Rei",
    "lat": -21.1102,
    "lng": -44.1744
  },
  "tocantins": {
    "name": "Tocantins",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.1774,
    "lng": -43.0127
  },
  "tombos": {
    "name": "Tombos",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.9086,
    "lng": -42.0228
  },
  "uba": {
    "name": "Ubá",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.1204,
    "lng": -42.9359
  },
  "urucania": {
    "name": "Urucânia",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.3521,
    "lng": -42.737
  },
  "vermelho novo": {
    "name": "Vermelho Novo",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ponte Nova",
    "lat": -20.0406,
    "lng": -42.2688
  },
  "vicosa": {
    "name": "Viçosa",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Viçosa",
    "lat": -20.7559,
    "lng": -42.8742
  },
  "vieiras": {
    "name": "Vieiras",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Muriaé",
    "lat": -20.867,
    "lng": -42.2401
  },
  "visconde do rio branco": {
    "name": "Visconde do Rio Branco",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Ubá",
    "lat": -21.0127,
    "lng": -42.8361
  },
  "volta grande": {
    "name": "Volta Grande",
    "regional": "Zona da Mata e Vertentes",
    "mr": "Cataguases",
    "lat": -21.7671,
    "lng": -42.5375
  }
};

// Capitais e centros regionais para fallback
const REGIONAL_FALLBACK_COORDINATES = {
  "Centro": { lat: -19.9191, lng: -43.9378, name: "Belo Horizonte (Centro)" },
  "Centro-Oeste e Sudoeste": { lat: -20.1436, lng: -44.8911, name: "Divinópolis (Centro-Oeste e Sudoeste)" },
  "CentroOeste": { lat: -20.1436, lng: -44.8911, name: "Divinópolis" },
  "Jequitinhonha e Mucuri": { lat: -17.8574, lng: -41.5053, name: "Teófilo Otoni (Jequitinhonha e Mucuri)" },
  "Jequitinhonha/Mucuri": { lat: -17.8574, lng: -41.5053, name: "Teófilo Otoni" },
  "Noroeste e Alto Paranaíba": { lat: -18.5794, lng: -46.5139, name: "Patos de Minas (Noroeste e Alto Paranaíba)" },
  "Noroeste": { lat: -18.5794, lng: -46.5139, name: "Patos de Minas" },
  "Norte": { lat: -16.7266, lng: -43.8647, name: "Montes Claros (Norte)" },
  "Rio Doce e Vale do Aço": { lat: -18.8496, lng: -41.9492, name: "Governador Valadares (Rio Doce e Vale do Aço)" },
  "Rio Doce": { lat: -18.8496, lng: -41.9492, name: "Governador Valadares" },
  "Sul": { lat: -22.2289, lng: -45.9381, name: "Pouso Alegre (Sul)" },
  "Triângulo": { lat: -18.9186, lng: -48.2772, name: "Uberlândia (Triângulo)" },
  "Zona da Mata e Vertentes": { lat: -21.7588, lng: -43.3512, name: "Juiz de Fora (Zona da Mata e Vertentes)" },
  "Zona da Mata": { lat: -21.7588, lng: -43.3512, name: "Juiz de Fora" }
};

/**
 * Retorna as coordenadas de um município
 */
function getMunicipalityCoordinates(cityName, regionalName) {
  if (!cityName) return REGIONAL_FALLBACK_COORDINATES[regionalName] || REGIONAL_FALLBACK_COORDINATES["Centro"];
  const normalizedKey = cityName.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (MUNICIPALITIES_DATABASE[normalizedKey]) {
    return MUNICIPALITIES_DATABASE[normalizedKey];
  }

  const fallback = REGIONAL_FALLBACK_COORDINATES[regionalName] || REGIONAL_FALLBACK_COORDINATES["Centro"];
  return {
    name: cityName,
    regional: regionalName || "Centro",
    lat: fallback.lat,
    lng: fallback.lng,
    isFallback: true
  };
}

// Carrega municípios adicionais aprovados pela moderação se houver
try {
  const approvedList = JSON.parse(localStorage.getItem("sebrae_approved_municipalities") || "[]");
  if (Array.isArray(approvedList)) {
    approvedList.forEach(item => {
      const key = (item.nome || item.municipio || "").toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (key && !MUNICIPALITIES_DATABASE[key]) {
        const regCoords = REGIONAL_FALLBACK_COORDINATES[item.regional] || REGIONAL_FALLBACK_COORDINATES["Centro"];
        MUNICIPALITIES_DATABASE[key] = {
          name: item.nome || item.municipio,
          regional: item.regional || "Centro",
          mr: item.mr || "Geral",
          lat: item.lat || (regCoords ? regCoords.lat : -19.9167),
          lng: item.lng || (regCoords ? regCoords.lng : -43.9345)
        };
      }
    });
  }
} catch (err) {
  console.warn("Aviso ao carregar municípios aprovados do cache local:", err);
}

// Exporta para o escopo global
window.SEBRAE_REGIONAIS = SEBRAE_REGIONAIS;
window.SEBRAE_MICRORREGIOES = SEBRAE_MICRORREGIOES;
window.MUNICIPALITIES_DATABASE = MUNICIPALITIES_DATABASE;
window.REGIONAL_FALLBACK_COORDINATES = REGIONAL_FALLBACK_COORDINATES;
window.getMunicipalityCoordinates = getMunicipalityCoordinates;
