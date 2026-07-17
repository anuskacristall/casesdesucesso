/**
 * Banco de dados estático de municípios de Minas Gerais
 * Contém coordenadas (lat, lng) e regional do SEBRAE MG correspondente.
 */
const MUNICIPALITIES_DATABASE = {
  // CentroOeste
  "divinopolis": { name: "Divinópolis", regional: "CentroOeste", lat: -20.1436, lng: -44.8911 },
  "itauna": { name: "Itaúna", regional: "CentroOeste", lat: -20.0750, lng: -44.5767 },
  "nova serrana": { name: "Nova Serrana", regional: "CentroOeste", lat: -19.8697, lng: -44.9847 },
  "para de minas": { name: "Pará de Minas", regional: "CentroOeste", lat: -19.8606, lng: -44.6083 },
  "formiga": { name: "Formiga", regional: "CentroOeste", lat: -20.4636, lng: -45.4264 },
  "bom despacho": { name: "Bom Despacho", regional: "CentroOeste", lat: -19.7356, lng: -45.2519 },

  // Centro
  "belo horizonte": { name: "Belo Horizonte", regional: "Centro", lat: -19.9191, lng: -43.9378 },
  "contagem": { name: "Contagem", regional: "Centro", lat: -19.9320, lng: -44.0539 },
  "betim": { name: "Betim", regional: "Centro", lat: -19.9678, lng: -44.1983 },
  "sete lagoas": { name: "Sete Lagoas", regional: "Centro", lat: -19.4658, lng: -44.2467 },
  "santa luzia": { name: "Santa Luzia", regional: "Centro", lat: -19.7697, lng: -43.8519 },
  "birite": { name: "Ibirité", regional: "Centro", lat: -20.0219, lng: -44.0583 },
  "sabara": { name: "Sabará", regional: "Centro", lat: -19.8906, lng: -43.8114 },
  "vespasiano": { name: "Vespasiano", regional: "Centro", lat: -19.6914, lng: -43.9228 },
  "ribeirao das neves": { name: "Ribeirão das Neves", regional: "Centro", lat: -19.7678, lng: -44.0867 },
  "ouro preto": { name: "Ouro Preto", regional: "Centro", lat: -20.3856, lng: -43.5036 },
  "mariana": { name: "Mariana", regional: "Centro", lat: -20.3778, lng: -43.4164 },
  "congonhas": { name: "Congonhas", regional: "Centro", lat: -20.5019, lng: -43.8572 },
  "conselheiro lafaiete": { name: "Conselheiro Lafaiete", regional: "Centro", lat: -20.6617, lng: -43.7856 },
  "itabira": { name: "Itabira", regional: "Centro", lat: -19.6197, lng: -43.2269 },

  // Noroeste
  "paracatu": { name: "Paracatu", regional: "Noroeste", lat: -17.2222, lng: -46.8747 },
  "patos de minas": { name: "Patos de Minas", regional: "Noroeste", lat: -18.5794, lng: -46.5139 },
  "unai": { name: "Unaí", regional: "Noroeste", lat: -16.3575, lng: -46.9064 },
  "joao pinheiro": { name: "João Pinheiro", regional: "Noroeste", lat: -17.7378, lng: -46.1719 },
  "sao gotardo": { name: "São Gotardo", regional: "Noroeste", lat: -19.3117, lng: -46.0492 },

  // Triângulo
  "uberlandia": { name: "Uberlândia", regional: "Triângulo", lat: -18.9186, lng: -48.2772 },
  "uberaba": { name: "Uberaba", regional: "Triângulo", lat: -19.7476, lng: -47.9392 },
  "araguari": { name: "Araguari", regional: "Triângulo", lat: -18.6482, lng: -48.1884 },
  "ituiutaba": { name: "Ituiutaba", regional: "Triângulo", lat: -18.9686, lng: -49.4650 },
  "patrocinio": { name: "Patrocínio", regional: "Triângulo", lat: -18.9439, lng: -46.9922 },
  "frutal": { name: "Frutal", regional: "Triângulo", lat: -20.0247, lng: -48.9328 },
  "iturama": { name: "Iturama", regional: "Triângulo", lat: -19.7283, lng: -50.1956 },
  "araxa": { name: "Araxá", regional: "Triângulo", lat: -19.5919, lng: -46.9422 },

  // Norte
  "montes claros": { name: "Montes Claros", regional: "Norte", lat: -16.7266, lng: -43.8647 },
  "januaria": { name: "Januária", regional: "Norte", lat: -15.4856, lng: -44.3606 },
  "janauba": { name: "Janaúba", regional: "Norte", lat: -15.8028, lng: -43.3089 },
  "pirapora": { name: "Pirapora", regional: "Norte", lat: -17.3453, lng: -44.9392 },
  "salinas": { name: "Salinas", regional: "Norte", lat: -16.1706, lng: -42.2903 },
  "bocaiuva": { name: "Bocaiúva", regional: "Norte", lat: -17.1089, lng: -43.8136 },
  "porteirinha": { name: "Porteirinha", regional: "Norte", lat: -15.7436, lng: -43.0239 },

  // Rio Doce
  "governador valadares": { name: "Governador Valadares", regional: "Rio Doce", lat: -18.8496, lng: -41.9492 },
  "ipatinga": { name: "Ipatinga", regional: "Rio Doce", lat: -19.4690, lng: -42.5372 },
  "coronel fabriciano": { name: "Coronel Fabriciano", regional: "Rio Doce", lat: -19.5206, lng: -42.6300 },
  "timoteo": { name: "Timóteo", regional: "Rio Doce", lat: -19.5828, lng: -42.6433 },
  "caratinga": { name: "Caratinga", regional: "Rio Doce", lat: -19.7906, lng: -42.1386 },
  "guanhaes": { name: "Guanhães", regional: "Rio Doce", lat: -18.7744, lng: -42.9300 },

  // Sul
  "pouso alegre": { name: "Pouso Alegre", regional: "Sul", lat: -22.2289, lng: -45.9381 },
  "pocos de caldas": { name: "Poços de Caldas", regional: "Sul", lat: -21.7892, lng: -46.5625 },
  "varginha": { name: "Varginha", regional: "Sul", lat: -21.5514, lng: -45.4344 },
  "itajuba": { name: "Itajubá", regional: "Sul", lat: -22.4247, lng: -45.4608 },
  "lavras": { name: "Lavras", regional: "Sul", lat: -21.2444, lng: -44.9961 },
  "alfenas": { name: "Alfenas", regional: "Sul", lat: -21.4286, lng: -45.9472 },
  "tres coracoes": { name: "Três Corações", regional: "Sul", lat: -21.6936, lng: -45.2536 },
  "passos": { name: "Passos", regional: "Sul", lat: -20.7189, lng: -46.6097 },
  "sao sebastiao do paraiso": { name: "São Sebastião do Paraíso", regional: "Sul", lat: -20.9169, lng: -46.9842 },
  "tres pontas": { name: "Três Pontas", regional: "Sul", lat: -21.3686, lng: -45.5139 },

  // Zona da Mata
  "juiz de fora": { name: "Juiz de Fora", regional: "Zona da Mata", lat: -21.7588, lng: -43.3512 },
  "barbacena": { name: "Barbacena", regional: "Zona da Mata", lat: -21.2239, lng: -43.7739 },
  "muriae": { name: "Muriaé", regional: "Zona da Mata", lat: -21.1306, lng: -42.3664 },
  "uba": { name: "Ubá", regional: "Zona da Mata", lat: -21.1203, lng: -42.9436 },
  "vicosa": { name: "Viçosa", regional: "Zona da Mata", lat: -20.7539, lng: -42.8819 },
  "cataguases": { name: "Cataguases", regional: "Zona da Mata", lat: -21.3858, lng: -42.6967 },
  "leopoldina": { name: "Leopoldina", regional: "Zona da Mata", lat: -21.5303, lng: -42.6436 },
  "manhuacu": { name: "Manhuaçu", regional: "Zona da Mata", lat: -20.2581, lng: -42.0336 },
  "santos dumont": { name: "Santos Dumont", regional: "Zona da Mata", lat: -21.4558, lng: -43.5181 },
  "sao joao del rei": { name: "São João del-Rei", regional: "Zona da Mata", lat: -21.1356, lng: -44.2617 },

  // Jequitinhonha/Mucuri
  "teofilo otoni": { name: "Teófilo Otoni", regional: "Jequitinhonha/Mucuri", lat: -17.8574, lng: -41.5053 },
  "diamantina": { name: "Diamantina", regional: "Jequitinhonha/Mucuri", lat: -18.2443, lng: -43.6006 },
  "almenara": { name: "Almenara", regional: "Jequitinhonha/Mucuri", lat: -16.1836, lng: -40.6939 },
  "capelinha": { name: "Capelinha", regional: "Jequitinhonha/Mucuri", lat: -17.6917, lng: -42.5156 },
  "aracuai": { name: "Araçuaí", regional: "Jequitinhonha/Mucuri", lat: -16.8492, lng: -42.0125 },
  "nanuque": { name: "Nanuque", regional: "Jequitinhonha/Mucuri", lat: -17.8397, lng: -40.3528 },
  "itamarandiba": { name: "Itamarandiba", regional: "Jequitinhonha/Mucuri", lat: -17.8597, lng: -42.8592 },
  "turmalina": { name: "Turmalina", regional: "Jequitinhonha/Mucuri", lat: -17.2858, lng: -42.7297 }
};

// Capitais/Centros regionais para fallback
const REGIONAL_FALLBACK_COORDINATES = {
  "CentroOeste": { lat: -20.1436, lng: -44.8911, name: "Divinópolis (Centro-Oeste)" },
  "Centro": { lat: -19.9191, lng: -43.9378, name: "Belo Horizonte (Centro)" },
  "Noroeste": { lat: -18.5794, lng: -46.5139, name: "Patos de Minas (Noroeste)" },
  "Triângulo": { lat: -18.9186, lng: -48.2772, name: "Uberlândia (Triângulo)" },
  "Norte": { lat: -16.7266, lng: -43.8647, name: "Montes Claros (Norte)" },
  "Rio Doce": { lat: -18.8496, lng: -41.9492, name: "Governador Valadares (Rio Doce)" },
  "Sul": { lat: -22.2289, lng: -45.9381, name: "Pouso Alegre (Sul)" },
  "Zona da Mata": { lat: -21.7588, lng: -43.3512, name: "Juiz de Fora (Zona da Mata)" },
  "Jequitinhonha/Mucuri": { lat: -17.8574, lng: -41.5053, name: "Teófilo Otoni (Jequitinhonha/Mucuri)" }
};

/**
 * Retorna as coordenadas de um município ou tenta buscar via API Nominatim.
 * Caso falhe ou não encontre, usa a coordenada central da Regional fornecida.
 */
async function getMunicipalityCoordinates(cityName, regionalName) {
  const normalizedKey = cityName.trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // remove acentos
  
  if (MUNICIPALITIES_DATABASE[normalizedKey]) {
    return MUNICIPALITIES_DATABASE[normalizedKey];
  }

  // Tenta geocodificação gratuita via Nominatim
  try {
    const queryUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName + ", Minas Gerais, Brazil")}&limit=1`;
    const response = await fetch(queryUrl, {
      headers: {
        "Accept-Language": "pt-BR",
        "User-Agent": "MapaCasesSucessoSEBRAEMG/1.0" // Boa prática do Nominatim
      }
    });
    
    if (response.ok) {
      const results = await response.json();
      if (results && results.length > 0) {
        return {
          name: cityName,
          regional: regionalName,
          lat: parseFloat(results[0].lat),
          lng: parseFloat(results[0].lon)
        };
      }
    }
  } catch (error) {
    console.warn("Erro ao buscar coordenadas via Nominatim:", error);
  }

  // Fallback se não encontrar ou der erro
  const fallback = REGIONAL_FALLBACK_COORDINATES[regionalName] || REGIONAL_FALLBACK_COORDINATES["Centro"];
  return {
    name: cityName,
    regional: regionalName,
    lat: fallback.lat,
    lng: fallback.lng,
    isFallback: true
  };
}

// Exporta as variáveis para escopo global ou ES Modules
window.MUNICIPALITIES_DATABASE = MUNICIPALITIES_DATABASE;
window.REGIONAL_FALLBACK_COORDINATES = REGIONAL_FALLBACK_COORDINATES;
window.getMunicipalityCoordinates = getMunicipalityCoordinates;
