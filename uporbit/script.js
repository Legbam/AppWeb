
//  Liste des villes avec leurs coordonnées
const cities = {
    "Paris": {lat: 48.8566, lon: 2.3522},
    "Londres": {lat: 51.5074, lon: -0.1278},
    "Berlin": {lat: 52.52, lon: 13.405},
    "Madrid": {lat: 40.4168, lon: -3.7038},
    "Rome": {lat: 41.9028, lon: 12.4964},
    "Amsterdam": {lat: 52.3676, lon: 4.9041},
    "Bruxelles": {lat: 50.8503, lon: 4.3517},
    "Lisbonne": {lat: 38.7169, lon: -9.1392},
    "Vienne": {lat: 48.2082, lon: 16.3738},
    "Prague": {lat: 50.0755, lon: 14.4378}
};

//  Récupération des éléments <select> dans le HTML
const citySelect = document.getElementById('city-select');

//  Option par défaut, non sélectionnable comme un vrai choix
const defaultOption = document.createElement('option');
defaultOption.value = "";
defaultOption.textContent = "-- sélectionnez une ville --";
defaultOption.disabled = true;
defaultOption.selected = true;
citySelect.appendChild(defaultOption); // Ajout de l'option par défaut au <select>

//  Remplissage du <select> avec les villes
for (const cityName in cities) {
    const option = document.createElement('option'); // Création d'une balise <option>
    option.value = cityName; // Valeur envoyée lors de la sélection
    option.textContent = cityName; //   Texte affiché à l'utilisateur
    citySelect.appendChild(option); // Ajout de l'option au <select>
}

//  Récupération du bouton "Rechercher"
const resultsDiv = document.getElementById("results");

// ==========================================================
// Gestion de l'unité de température (Celsius / Fahrenheit)
// ==========================================================
const unitLabel = document.getElementById("unit-label");
const unitSwitch = document.getElementById("unit-switch");
const unitToggle = document.getElementById("unit-toggle");

// "let" (et pas "const") car cette variable va CHANGER de valeur
// selon le choix de l'utilisateur.
let currentUnit = "C"; // Valeur par défaut : Celsius

// On garde une copie des dernières données météo reçues, pour
// pouvoir réafficher les cartes sans refaire un appel à l'API
// quand on change juste d'unité.
let lastData = null;


// ==========================================================
// Table de correspondance : code météo (anglais, envoyé par
// l'API) -> emoji + description en français
// ==========================================================
// C'est encore un objet { clé: valeur }, mais ici chaque valeur
// est elle-même un petit objet { icon: ..., label: ... }.
// Ça nous permet de retrouver facilement l'icône ET le texte
// à partir d'un seul code, ex: weatherIcons["clearday"].icon

const weatherIcons = {
    "clearday":     { icon: "☀️", label: "Ensoleillé" },
    "clearnight":   { icon: "🌙", label: "Ciel dégagé" },
    "pcloudyday":   { icon: "🌤️", label: "Peu nuageux" },
    "pcloudynight": { icon: "🌤️", label: "Peu nuageux" },
    "mcloudyday":   { icon: "⛅", label: "Nuageux" },
    "mcloudynight": { icon: "☁️", label: "Nuageux" },
    "cloudyday":    { icon: "☁️", label: "Couvert" },
    "cloudynight":  { icon: "☁️", label: "Couvert" },
    "humidday":     { icon: "💧", label: "Humide" },
    "humidnight":   { icon: "💧", label: "Humide" },
    "lightrainday": { icon: "🌦️", label: "Pluie légère" },
    "lightrainnight": { icon: "🌦️", label: "Pluie légère" },
    "oshowerday":   { icon: "🌦️", label: "Averses" },
    "oshowernight": { icon: "🌦️", label: "Averses" },
    "ishowerday":   { icon: "🌧️", label: "Averses" },
    "ishowernight": { icon: "🌧️", label: "Averses" },
    "rainday":      { icon: "🌧️", label: "Pluie" },
    "rainnight":    { icon: "🌧️", label: "Pluie" },
    "tsday":        { icon: "⛈️", label: "Orage" },
    "tsnight":      { icon: "⛈️", label: "Orage" },
    "tsrainday":    { icon: "⛈️", label: "Orage + pluie" },
    "tsrainnight":  { icon: "⛈️", label: "Orage + pluie" },
    "snowday":      { icon: "❄️", label: "Neige" },
    "snownight":    { icon: "❄️", label: "Neige" }
}


// ==========================================================
// Fonction qui affiche un indicateur de chargement animé
// ==========================================================

function showLoading() {
    // On remplace le contenu de resultsDiv par du HTML contenant
    // un div vide (".spinner") qu'on va animer uniquement en CSS,
    // et un texte en dessous.
    resultsDiv.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Chargement des prévisions...</p>
        </div>
    `;
}



citySelect.addEventListener("change", async function () {

    //  Ecouter le clic sur le bouton
    const selectedCity = citySelect.value; // Récupération de la ville sélectionnée


    const coords = cities[selectedCity]; // Récupération des coordonnées de la ville sélectionnée   


    //  Construction de l'URL de l'API Open-Meteo
    const proxyUrl = `proxy.php?lat=${coords.lat}&lon=${coords.lon}`;


    //  Petit message pendant le chargement des données
    showLoading();

    try {
        const response = await fetch(proxyUrl); //  Récupération des données de l'API
        const data = await response.json(); //  Conversion des données en JSON
        
         // Si notre proxy.php a renvoyé un objet avec "error", on
        // affiche ce message au lieu d'essayer d'afficher une météo.
        if (data.error) {
            resultsDiv.textContent = "Erreur : " + data.error + "Réessayez dans quelques instants.";
            return; //  On sort de la fonction pour ne pas continuer
        }

    
        //  Affichage des prévisions météo
        lastData = data; //  On garde une copie des données pour pouvoir les réafficher si l'utilisateur change d'unité
        unitToggle.style.display = "block"; //  On affiche le bouton de changement d'unité
        displayForecast(data); //  Affichage des données dans la conso 
    } catch (error) {
        resultsDiv.textContent = "Erreur lors du chargementde la météo. Réessayez.";
        console.error("Erreur:", error);
    }
});


// ==========================================================
// Boucle "for" classique avec un compteur
// ==========================================================

// On veut UN point par jour, sur 7 jours. Comme il y a 8 points
// par jour (toutes les 3h), on avance de 8 en 8 dans le tableau:
// i = 0, 8, 16, 24, 32, 40, 48 -> 7 valeurs au total.

const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];


// ==========================================================
// Convertit une température de Celsius vers Fahrenheit si besoin
// ==========================================================
// Formule standard : F = C * 9/5 + 32
// Math.round() arrondit à l'entier le plus proche (évite les
// décimales moches du type 23.799999999999997).
function convertTemp(celsius) {
    if (currentUnit === "F") {
        return Math.round(celsius * 9 / 5 + 32); // Conversion en Fahrenheit
    }
    return Math.round(celsius); // Retourne la valeur en Celsius (arrondie)
}


function displayForecast(data){
    const allPoints = data.dataseries; //  Récupération de tous les points météo

    resultsDiv.innerHTML = ""; //  On vide le div avant d'afficher les nouvelles données

    const container = document.createElement("div"); //  Création d'un conteneur pour les prévisions
    container.className = "forecast-container"; //  Ajout d'une classe CSS pour le style

    for (let i = 0; i < 7; i++) {
         // ==========================================================
        // Calcul de la date de ce jour (aujourd'hui + i jours)
        // ==========================================================
        // "new Date()" crée un objet représentant la date/heure
        // actuelle. .getDate() donne le jour du mois (1-31).
        // .setDate(x) permet de MODIFIER cette date -> si on lui
        // donne "aujourd'hui + i", JavaScript gère automatiquement
        // le changement de mois si besoin (ex: 30 + 3 -> 2 du mois suivant).

        const date = new Date();
        date.setDate(date.getDate() + i); //  On avance de i jours

        const dayName = dayNames[date.getDay()]; //  Récupération du nom du jour (Dim, Lun, Mar, ...)
        const dayNumber = date.getDate(); //  Récupération du numéro du jour (1-31)

         // ==========================================================
        // Recherche de la température max (H) et min (L) du jour
        // ==========================================================
        // On regarde les 8 points de CE jour précis (toutes les 3h),
        // donc de l'index (i*8) à (i*8 + 7) inclus.

        let maxTemp = -Infinity; //  Initialisation de la température max
        let minTemp = Infinity; //  Initialisation de la température min
        let middayPoint =  allPoints[i * 8]; //  On prend le point de midi (12h) pour l'icône météo

        for (let j = i * 8; j < i * 8 + 8; j++) {
            const point = allPoints[j]; //  Récupération du point météo
            if (!point) continue; // "continue" = passe au tour suivant sans planter

            // Math.max(a, b) renvoie la plus grande des deux valeurs.
            // On compare la température actuelle à la max trouvée jusqu'ici.
            maxTemp = Math.max(maxTemp, point.temp2m); //  Mise à jour de la température max
            minTemp = Math.min(minTemp, point.temp2m); //  Mise à jour de la température min
        }

        if (!middayPoint) break; //  Si on a trouvé un point de midi, on sort de la boucle

        // ==========================================================
        // Deux points de la journée : environ 9h (index +3) et 18h (index +5)
        // ==========================================================
        // Rappel : dans un jour, les 8 points sont à 3h, 6h, 9h, 12h,
        // 15h, 18h, 21h, 24h. Donc (i*8 + 2) = le point à 9h,
        // et (i*8 + 5) = le point à 18h, pour le jour "i".

        const morningPoint = allPoints[i * 8 + 2] || middayPoint;
        const eveningPoint = allPoints[i * 8 + 5] || middayPoint;

        const morningWeather = weatherIcons[morningPoint.weather] || { icon: "❓", label: morningPoint.weather };
        const eveningWeather = weatherIcons[eveningPoint.weather] || { icon: "❓", label: eveningPoint.weather };

        const card = document.createElement("div"); //  Création d'une carte pour le jour
        card.className = "day-card"; //  Ajout d'une classe CSS pour le style
        

        //  Contenu de la carte : jour, date, icône météo, températures
        card.innerHTML = `
            <p class="day-label">${dayName} ${dayNumber}</p>
            <div class="day-icons">
                <span class="day-icon">${morningWeather.icon}</span>
                <span class="day-icon">${eveningWeather.icon}</span>
            </div>
            <p class="day-desc">${morningWeather.label}</p>
            <p class="day-temp-high">H: ${convertTemp(maxTemp)}°${currentUnit}</p>
            <p class="day-temp-low">L: ${convertTemp(minTemp)}°${currentUnit}</p>
        `;

        container.appendChild(card); //  Ajout de la carte au conteneur
    }
    resultsDiv.appendChild(container); //  Ajout du conteneur au div des résultats
}

// ==========================================================
// Changement d'unité Celsius <-> Fahrenheit
// ==========================================================

unitSwitch.addEventListener("click", function (event) {
    // Un lien <a> recharge la page par défaut au clic.
    // preventDefault() annule ce comportement, pour rester sur place.

    event.preventDefault();

    if (currentUnit === "C") {
        currentUnit = "F"; //  On passe en Fahrenheit
        unitLabel.textContent = "Fahrenheit";
        unitSwitch.textContent = "Passer en Celsius"; //  On change le texte du lien
    } else {
        currentUnit = "C"; //  On passe en Celsius
        unitLabel.textContent = "Celsius";
        unitSwitch.textContent = "Passer en Fahrenheit"; //  On change le texte du lien
    }

    // Si on a déjà des données météo affichées, on les réaffiche
    // immédiatement avec la nouvelle unité (sans refaire d'appel API).
    if (lastData) {
        displayForecast(lastData);
    }
});