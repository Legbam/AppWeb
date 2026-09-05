# 🌍 UPOrbit

Une application web interactive qui affiche les prévisions météo sur 7 jours de certaines grandes villes européennes, conçue pour un scénario réaliste d'agence de voyage cherchant à augmenter ses réservations en ligne.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php)
![API](https://img.shields.io/badge/API-7Timer-blue)
![Status](https://img.shields.io/badge/status-completed-brightgreen)

## 🎯 Contexte

Une agence de voyage européenne souhaitait permettre à ses visiteurs de consulter la météo sur 7 jours pour les grandes villes, afin de :
- Garder les visiteurs plus longtemps sur le site
- Augmenter les réservations en ligne
- Offrir un vrai outil d'aide à la décision avant de réserver un voyage

## ✨ Fonctionnalités

- 🔎 Recherche météo instantanée pour 10 villes européennes (sans bouton, au simple changement de sélection)
- 📅 Prévisions sur 7 jours avec relevés matin/soir, températures min et max
- 🌡️ Bascule Celsius / Fahrenheit en un clic, sans nouvel appel API
- ⏳ Indicateur de chargement animé pendant la récupération des données
- 🛡️ Gestion robuste des erreurs (API indisponible, réponse invalide, timeout)
- 🎨 Interface personnalisée avec dégradés et motifs décoratifs en SVG

## 🛠️ Stack technique

| Côté | Technologies |
|---|---|
| Frontend | HTML5, CSS3 (Flexbox, SVG, animations), JavaScript ES6+ |
| Backend | PHP (proxy léger) |
| API externe | [7Timer!](https://www.7timer.info/) — prévisions météo gratuites, sans clé API |
| Environnement | WampServer (Apache + PHP) |

## 🧩 Défi technique principal : contourner le CORS

L'API 7Timer ne renvoie pas d'en-têtes CORS, ce qui bloque les appels `fetch()` directement depuis le navigateur. Plusieurs proxys CORS publics testés (AllOrigins, CorsProxy.io, CodeTabs) se sont révélés instables ou limités.

**Solution retenue :** un petit proxy PHP (`proxy.php`) qui interroge 7Timer côté serveur — hors de portée des restrictions CORS du navigateur — puis renvoie les données au frontend. Ce proxy valide aussi que la réponse est un JSON exploitable avant de la transmettre, pour éviter de casser le parsing côté client en cas de réponse inattendue de l'API.

```php
$data = @file_get_contents($url);
$decoded = json_decode($data);

if ($decoded === null) {
    http_response_code(502);
    echo json_encode(["error" => "Réponse invalide de 7Timer"]);
    exit;
}
```

## 📸 Aperçu

*(Ajoute ici une capture d'écran de ton application une fois en ligne)*

## 🚀 Installation locale

1. Clone ce dépôt dans le dossier `www` de WampServer (ou tout autre serveur local avec PHP) :
   ```bash
   git clone https://github.com/TON-USERNAME/uporbit.git
   ```
2. Démarre WampServer (ou ton serveur local)
3. Ouvre `http://localhost/uporbit/` dans ton navigateur

> ⚠️ Un serveur avec PHP est nécessaire (le fichier `proxy.php` s'exécute côté serveur). Ouvrir directement `index.html` en double-clic ne fonctionnera pas.

## 📚 Ce que ce projet démontre

- Consommation d'une API REST externe
- Programmation asynchrone en JavaScript (`async`/`await`, `fetch`)
- Traitement et transformation de données JSON
- Manipulation du DOM
- Résolution d'un problème concret de CORS via un proxy backend
- Gestion d'erreurs réseau côté client et serveur

## 📄 Licence

Projet réalisé dans le cadre d'un projet guidé Coursera.
