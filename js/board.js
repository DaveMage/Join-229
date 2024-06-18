async function initBoard() {
    displayTask();
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    getContacts();
    await getTask();
    displayTask();
    // loadTasks();
    // emptyTaskColumns(); // vorübergehende Funktion
}

function toggleAssignedDropdown() {
    const dropdown = document.getElementById('dropdownAssigned');
    let icon = document.getElementById('assignedDropdownArrow');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        dropdown.style.display = 'flex';
        icon.style.transform = 'rotate(180deg)';
    }
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('dropdownCategory');
    let icon = document.getElementById('categoryDropdownArrow');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        dropdown.style.display = 'flex';
        icon.style.transform = 'rotate(180deg)';
    }
}

function displayTask() {
    let toDo = document.getElementById('tasksToDo');
    toDo.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        task = tasks[i];        
        toDo.innerHTML += loadTasksHTML(task, i);
    }
}

function openTask(numberOfTask) {
    let taskOverlay = document.getElementById('taskOverlay');
    taskOverlay.classList.remove('dNone');
    let content = document.getElementById('wholeContent');
    content.classList.add('overflowHidden');
    let body = document.getElementById('template');
    body.classList.add('overflowHidden');
    
    taskOverlay.innerHTML = '';
    taskOverlay.innerHTML = viewTask(tasks[numberOfTask], numberOfTask);
}

function subtaskProgressbar(viewedSubtask) {
    if (viewedSubtask.Subtasks == null) {
        return '';
    } else {
        return subtaskProgressbarHTML(viewedSubtask)
    }
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

function filterTasks() {
    let search = document.getElementById('findTask').value;
    search = search.toLowerCase();

    console.log('Tasks müssen erst im Array vorhanden sein');

    // let columns = document.getElementById('columns');
    // columns.innerHTML = '';

    // Tasks müssen erst im Array vorhanden sein
}

// Drag & Drop

let taskCards = document.getElementsByClassName('taskCard');



/*function loadTasks() {
    let inProgressColumn = document.getElementById('tasksInProgress');
    inProgressColumn.innerHTML += loadTasksHTML();
}*/


function emptyTaskColumns() {
    let toDoColumn = document.getElementById('tasksToDo');
    let awaitFeedbackColumn = document.getElementById('tasksAwaitFeedback');
    let doneColumn = document.getElementById('tasksDone');

    if (tasks[0] == null) {
        toDoColumn.innerHTML += loadEmptyToDoColumn();
    } else {
        console.log('test');
    }

    if (tasks[0] == null) {
        awaitFeedbackColumn.innerHTML += loadEmptyAwaitFeedbackColumn();
    } else {
        console.log('test');
    }

    if (tasks[0] == null) {
        doneColumn.innerHTML += loadEmptyDoneColumn();
    } else {
        console.log('test');
    }
}