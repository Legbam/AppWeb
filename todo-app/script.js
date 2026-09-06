const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearDoneBtn = document.getElementById("clearDoneBtn");

let tasks= JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = "all"   // "let" car sa valeur va changer selon le filtre cliqué

// Affiche les tâches stockées au chargement
function renderTasks() {
    taskList.innerHTML = '';

    // On associe chaque tâche à son index D'ORIGINE avant de filtrer
    const tasksWithIndex = tasks.map((task, index) => ({ task, index }));

    // On garde seulement les tâches qui correspondent au filtre actif
    const filteredTasks = tasksWithIndex.filter(({ task }) => {
        if (currentFilter === "active") return !task.done;
        if (currentFilter === "done") return task.done;
        return true; // "all"
    });

    // Si, après filtrage, il n'y a aucune tâche à afficher,
    // on montre un message au lieu de laisser un espace vide.
    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'empty-message';

        // Le message change selon le filtre actif, pour être plus précis
        if (currentFilter === "active") {
            emptyMessage.textContent = "Aucune tâche active 🎉";
        } else if (currentFilter === "done") {
            emptyMessage.textContent = "Aucune tâche terminée pour l'instant";
        } else {
            emptyMessage.textContent = "Aucune tâche pour le moment. Ajoutes-en une !";
        }

        taskList.appendChild(emptyMessage);
        updateCounter();
        updateClearButton();
        return; // on arrête ici, pas besoin d'exécuter le reste de la fonction
    }

    filteredTasks.forEach(({ task, index }) => {
        const li = document.createElement('li');
        li.classList.add('fade-in');
        if (task.done) li.classList.add('done');


        const taskText = document.createElement('span');
    taskText.textContent = task.text;
    taskText.style.cursor = 'pointer';

        // ==========================================================
        // Distinction simple clic / double-clic
        // ==========================================================
        // Le navigateur déclenche TOUJOURS un "click" avant un "dblclick".
        // Sans précaution, cocher une tâche se déclencherait par erreur
        // à chaque tentative de double-clic pour l'éditer.
        // Astuce : on retarde légèrement l'action du simple clic
        // (setTimeout), et si un double-clic survient entre-temps,
        // on annule ce délai (clearTimeout) avant qu'il ne s'exécute.

        let clickTimer = null;
        taskText.onclick = () => {
            // On annule TOUT minuteur précédent avant d'en créer un nouveau,
            // pour ne jamais en laisser un "orphelin" se déclencher plus tard.
            clearTimeout(clickTimer);

            clickTimer = setTimeout(() => {
                tasks[index].done = !tasks[index].done;
                saveTasks();
                renderTasks();
            }, 200);
        };

        taskText.ondblclick = (e) => {
            clearTimeout(clickTimer); // annule le simple clic en attente
            startEditing();
        };

        // ==========================================================
        // Passe la tâche en mode édition : remplace le <span> par un
        // champ <input> pré-rempli avec le texte actuel
        // ==========================================================
        function startEditing() {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.className = 'edit-input';
        
            // Remplace le <span> par le champ <input> dans le DOM
            li.replaceChild(input, taskText);
            input.focus();
            input.select(); // sélectionne tout le texte, pratique pour tout réécrire
        
            function saveEdit() {
                const newText = input.value.trim();
                if (newText !== '') {
                    tasks[index].text = newText;
                    saveTasks();
                }
                renderTasks(); // réaffiche, avec le nouveau texte ou l'ancien si vide
            }
        
            // Sauvegarde quand le champ perd le focus (clic ailleurs)
            input.addEventListener('blur', saveEdit);
            
            input.addEventListener('keydown', (evt) => {
                if (evt.key === 'Enter') {
                    input.blur(); // déclenche "blur", qui déclenche saveEdit()
                }
                if (evt.key === 'Escape') {
                    // On retire D'ABORD le gestionnaire "blur", pour qu'il ne
                    // se déclenche pas malgré lui quand renderTasks() va
                    // supprimer ce champ du DOM juste après.
                    input.removeEventListener('blur', saveEdit);
                    renderTasks();
                }
            });
        }

        if (task.done) taskText.classList.add('done');
        li.appendChild(taskText);

        const btnSuppr = document.createElement('button');
        btnSuppr.textContent = ' ❌ ';
        btnSuppr.className = 'delete';
        btnSuppr.setAttribute('aria-label', 'Supprimer la tâche');
        btnSuppr.onclick = (e) => {
            e.stopPropagation();
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };
        li.appendChild(btnSuppr);

        taskList.appendChild(li);
    });

    updateCounter();
    updateClearButton();
}

// ==========================================================
// Met à jour le texte du compteur de tâches restantes
// ==========================================================
function updateCounter() {
    const taskCounter = document.getElementById("taskCounter");
    const remaining = tasks.filter(task => !task.done).length;

    if (remaining === 0) {
        taskCounter.textContent = tasks.length === 0
            ? ""
            : "Toutes les tâches sont terminées 🎉";
    } else if (remaining === 1) {
        taskCounter.textContent = "1 tâche restante";
    } else {
        taskCounter.textContent = `${remaining} tâches restantes`;
    }
}


// ==========================================================
// Affiche ou cache le bouton "Effacer les terminées" selon
// qu'il existe au moins une tâche terminée ou non
// ==========================================================
function updateClearButton() {
    // .some() renvoie "true" dès qu'AU MOINS UN élément du
    // tableau remplit la condition — plus rapide que .filter()
    // quand on veut juste savoir "y en a-t-il au moins un ?"
    // plutôt que de tous les récupérer.
    const hasDoneTasks = tasks.some(task => task.done);

    clearDoneBtn.style.display = hasDoneTasks ? "block" : "none";
}


// Enregistre les tâches dans le localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Ajoute une nouvelle tâche
function ajouterTache() {
    const text = taskInput.value.trim();
    if (text === '') return;
        tasks.push({ text, done: false });
        saveTasks();
        renderTasks();
        taskInput.value = '';
}

// Événement pour ajouter une tâche au clic du bouton
addTaskBtn.addEventListener('click', ajouterTache);

// ============================================================
// Permet d'ajouter une tâche en appuyant sur "Entrée" dans le
// champ de saisie, sans obligation de cliquer sur le bouton.
// ============================================================
taskInput.addEventListener("keydown", function (event){
    // "event.key" contient le nom de la touche pressée.
    // "Enter" correspond à la touche Entrée/Retour.
    if (event.key === "Enter"){
        ajouterTache();
    }
});


// Affiche les tâches au chargement de la page
renderTasks();


// Fonction pour basculer le thème sombre
const toggleBtn = document.getElementById('toggleTheme');

// Appliquer le thème sauvégardé
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '☀️ Mode clair';
} else {
    toggleBtn.textContent = '🌙 Mode sombre';
}

// Changer de thème au clic
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        toggleBtn.textContent = '☀️ Mode clair';
    } else {
        localStorage.setItem('theme', 'light');
        toggleBtn.textContent = '🌙 Mode sombre';
    }
});


// ==========================================================
// Gestion des filtres (Toutes / Actives / Terminées)
// ==========================================================
// document.querySelectorAll() renvoie TOUS les éléments qui
// correspondent au sélecteur (contrairement à getElementById
// qui n'en renvoie qu'un seul).
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // On lit la valeur stockée dans data-filter de CE bouton précis
        currentFilter = button.dataset.filter;

        // On retire la classe "active" de TOUS les boutons...
        filterButtons.forEach(btn => btn.classList.remove("active"));
        // ...puis on l'ajoute seulement à celui qu'on vient de cliquer.
        button.classList.add("active");

        renderTasks();
    });
});


// ==========================================================
// Efface toutes les tâches déjà marquées comme terminées
// ==========================================================

clearDoneBtn.addEventListener("click", () => {
    // .filter() garde uniquement les tâches NON terminées,
    // et on réassigne ce nouveau tableau à "tasks" — ça élimine
    // d'un coup toutes les tâches cochées.
    tasks = tasks.filter(task => !task.done);
    saveTasks();
    renderTasks();
});