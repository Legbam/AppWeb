# ✅ ToDo App

Une application de gestion de tâches simple et soignée, avec persistance des données, mode sombre, filtres et édition en ligne — pensée pour une expérience utilisateur complète malgré un périmètre volontairement minimaliste.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![Status](https://img.shields.io/badge/status-completed-brightgreen)

## ✨ Fonctionnalités

- ➕ Ajout de tâches (bouton ou touche Entrée)
- ✔️ Marquage terminé/non terminé en un clic
- ✏️ Édition en ligne par double-clic, avec validation (Entrée) ou annulation (Échap)
- 🗑️ Suppression individuelle, ou en masse via "Effacer les terminées"
- 🔍 Filtres : Toutes / Actives / Terminées
- 🔢 Compteur dynamique de tâches restantes
- 💾 Persistance des données via `localStorage` (les tâches survivent au rechargement de la page)
- 🌙 Mode sombre avec préférence sauvegardée
- ♿ Boutons accessibles au clavier (focus visible, activation par Entrée/Espace)
- 🎨 Fond en filigrane personnalisé, décliné en mode clair et sombre

## 🛠️ Stack technique

HTML5, CSS3 (Flexbox, animations, SVG en data-URI), JavaScript ES6+ (vanilla, sans framework ni dépendance externe).

## 🧩 Défis techniques résolus

**Distinguer simple clic et double-clic sur un même élément**
Le navigateur déclenche toujours un `click` avant un `dblclick`. Sans précaution, cocher une tâche se déclenchait par erreur à chaque tentative d'édition. Solution : un léger délai (`setTimeout`) sur l'action du simple clic, annulé (`clearTimeout`) si un double-clic survient entre-temps.

**Annuler une édition sans la sauvegarder par erreur**
Retirer du DOM un champ `<input>` qui a le focus déclenche automatiquement un événement `blur` — ce qui sauvegardait la modification même en cas d'annulation avec "Échap". Solution : détacher explicitement le gestionnaire `blur` (`removeEventListener`) avant de retirer le champ dans ce cas précis.

**Conflit de spécificité CSS en mode sombre**
Un sélecteur basé sur un `id` (`#taskList li`) l'emportait systématiquement sur un sélecteur de classe (`body.dark li`), peu importe l'ordre des règles dans le fichier — rendant le mode sombre illisible sur les tâches. Résolu en augmentant la spécificité de la règle du mode sombre plutôt qu'en réorganisant le fichier au hasard.

## 🚀 Installation locale

```bash
git clone https://github.com/Legbam/AppWeb.git
```
Ouvre ensuite `todo-app/index.html` directement dans un navigateur — aucun serveur n'est nécessaire, ce projet ne dépend d'aucun backend.

## 📚 Ce que ce projet démontre

- Manipulation du DOM (création, remplacement, suppression d'éléments)
- Gestion fine des événements (clic, double-clic, clavier, focus/blur)
- Persistance de données côté client (`localStorage`)
- Attention portée à l'accessibilité (navigation clavier, contraste)
- Débogage méthodique de bugs liés à l'ordre d'exécution et à la spécificité CSS

## 📄 Licence

Projet personnel, développé et amélioré de façon itérative.
