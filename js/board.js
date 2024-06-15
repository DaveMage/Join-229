

function openTask() {
    let task = document.getElementById('taskOverlay');
    task.classList.remove('dNone');
    let content = document.getElementById('wholeContent');
    content.classList.add('overflowHidden');
    let body = document.getElementById('template');
    body.classList.add('overflowHidden');
}

function closeTask() {
    let task = document.getElementById('taskOverlay');
    task.classList.add('dNone');
    let content = document.getElementById('wholeContent');
    content.classList.remove('overflowHidden');
    let body = document.getElementById('template');
    body.classList.remove('overflowHidden');
}

function openEditTask() {
    let task = document.getElementById('taskOverlay');
    task.classList.add('dNone');
    let editTask = document.getElementById('editTaskOverlay');
    editTask.classList.remove('dNone');
}

function closeEditTask() {
    let editTask = document.getElementById('editTaskOverlay');
    editTask.classList.add('dNone');
    let content = document.getElementById('wholeContent');
    content.classList.remove('overflowHidden');
    let body = document.getElementById('template');
    body.classList.remove('overflowHidden');
}