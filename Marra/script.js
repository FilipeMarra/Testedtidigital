let map;
let markersGroup;

// Função para inicializar o mapa
function initMap() {
    if (!map) {
        map = L.map('map').setView([-19.9167, -43.9345], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        markersGroup = L.layerGroup().addTo(map);
    } else {
        markersGroup.clearLayers(); // Limpa os marcadores anteriores
    }
}
function calcular() {
    const dataInput = document.getElementById("data");
    const pequenosInput = document.getElementById("pequenos");
    const grandesInput = document.getElementById("grandes");

    const data = new Date(dataInput.value);
    const pequenos = parseInt(pequenosInput.value);
    const grandes = parseInt(grandesInput.value);

    if (!dataInput.value) {
        alert("Por favor, insira uma data válida.");
        return;
    }
    if (isNaN(pequenos) || pequenos < 0) {
        alert("Por favor, insira um número válido de cães pequenos.");
        return;
    }
    if (isNaN(grandes) || grandes < 0) {
        alert("Por favor, insira um número válido de cães grandes.");
        return;
    }

    initMap(); // Inicializa ou limpa o mapa

    const petshops = {
        "Meu Canino Feliz": { distancia: 2, p_semana: { pequeno: 20, grande: 40 }, fds: { pequeno: 24, grande: 48 } },
        "Vai Rex": { distancia: 1.7, p_semana: { pequeno: 15, grande: 50 }, fds: { pequeno: 20, grande: 55 } },
        "ChowChawgas": { distancia: 0.8, p_semana: { pequeno: 30, grande: 45 }, fds: { pequeno: 30, grande: 45 } }
    };

    let melhorPetshop = null;
    let menorPreco = Infinity;

    for (const [nome, dados] of Object.entries(petshops)) {
        const ehFinalDeSemana = data.getDay() === 0 || data.getDay() === 6;
        const precos = ehFinalDeSemana ? dados.fds : dados.p_semana;
        const precoTotal = precos.pequeno * pequenos + precos.grande * grandes;

        if (precoTotal < menorPreco || (precoTotal === menorPreco && dados.distancia < petshops[melhorPetshop]?.distancia)) {
            melhorPetshop = nome;
            menorPreco = precoTotal;
        }
    }

    updateMap(melhorPetshop);
    document.getElementById("resultado").textContent = `Melhor petshop: ${melhorPetshop}, Distância: ${petshops[melhorPetshop].distancia.toFixed(2)} km, Preço total: R$${menorPreco.toFixed(2)}`;
}

function updateMap(melhorPetshop) {
    // Garante que o mapa esteja inicializado e limpo
    initMap();

    // Define as localizações do canil e do melhor petshop
    const localizacoes = {
        "Você (Canil)": [-19.9167, -43.9345],
        [melhorPetshop]: getPetshopCoords(melhorPetshop) // Obtém as coordenadas do melhor petshop
    };

    // Adiciona marcadores para as localizações relevantes
    Object.entries(localizacoes).forEach(([nome, coords]) => {
        const iconUrl = nome === "Você (Canil)" ?
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png' :
            'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';

        const markerOptions = {
            icon: L.icon({
                iconUrl: iconUrl,
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        };

        L.marker(coords, markerOptions).addTo(markersGroup).bindPopup(nome);
    });
}

// Função auxiliar para obter coordenadas do melhor petshop
function getPetshopCoords(petshopName) {
    const petshopCoords = {
        "Meu Canino Feliz": [-19.9167, -43.9545],
        "Vai Rex": [-19.9167, -43.9475],
        "ChowChawgas": [-19.9167, -43.9305]
    };
    return petshopCoords[petshopName];
}