<?php

//  On dit au navigateur que le contenu renvoyé est du JSON
header('Content-Type: application/json');

if (!isset($_GET['lat']) || !isset($_GET['lon'])) {
    http_response_code(400);
    echo json_encode(["error" => "lat et lon sont requis"]);
    exit;
}

$lat = $_GET['lat'];
$lon = $_GET['lon'];

//  On construit l'URL vers la vraie API 7Timer
$url = "http://www.7timer.info/bin/api.pl?lon=$lon&lat=$lat&product=civil&output=json";

$data = @file_get_contents($url);

if ($data === FALSE) {
    http_response_code(502);
    echo json_encode(["error" => "Impossible de joindre 7Timer"]);
    exit;
}

// ==========================================================
// Vérification que la réponse est bien du JSON valide
// ==========================================================
// json_decode() essaie de convertir le texte en donnée PHP.
// Si ça échoue (texte pas au format JSON, ex: page d'erreur HTML),
// elle renvoie "null". On s'en sert pour détecter le problème
// AVANT de transmettre une réponse invalide au JavaScript.

$decoded = json_decode($data);

if ($decoded === null) {
    http_response_code(502);
    echo json_encode(["error" => "7Timer a renvoyé une réponse invalide, réessayez."]);
    exit;
}

//  On renvoie telles quelles les données au navigateur
echo $data;
?>