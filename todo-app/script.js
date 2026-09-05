const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks= JSON.parse(localStorage.getItem('tasks')) || [];

// Affiche les tâches stockées au chargement
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.classList.add('fade-in');
        if (task.done) li.classList.add('done');

        // Texte de la tâche
        const taskText= document.createElement('span');
        taskText.textContent = task.text;
        taskText.style.cursor = 'pointer';
        // Barre la tache si elle est terminée
        taskText.onclick = () => {
            tasks[index].done = !tasks[index].done;
            saveTasks();
            renderTasks();
        };

        if (task.done) taskText.classList.add('done');
        li.appendChild(taskText);

        // Bouton Supprimer
        const btnSuppr = document.createElement('span');
        btnSuppr.textContent = ' ❌ ';
        btnSuppr.className = 'delete';
        btnSuppr.onclick = (e) => {
            e.stopPropagation(); // Empêche le clic de se propager à la tâche
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        };
        li.appendChild(btnSuppr);
        taskList.appendChild(li);
    });       
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