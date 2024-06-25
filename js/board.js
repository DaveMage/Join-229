async function initBoard() {
    displayTask();
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    getContacts();
    menuActive();
    await getTask();
    displayTask();
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

function openTask(taskId) {
    let task = tasks.find(task => task.id === taskId);
    
    if(task){
        document.getElementById('mainBoard').innerHTML += viewTask(task);
    }  else {
        console.error('Task not found');
    }
}


function subtaskProgressbar(viewedSubtask) {
    if (viewedSubtask.Subtasks == null) {
        return '';
    } else {
        return subtaskProgressbarHTML(viewedSubtask)
    }
}

function closeTask() {
    document.getElementById('taskOverlayBackground').remove();
}

function closeEditTask() {
    document.getElementById('taskOverlayBackground').remove();
    document.getElementById('editTaskOverlayBackground').remove();
}

function saveTaskChanges() {
    console.log('not ready');
}

function openEditTask(taskId) {
    document.getElementById('taskOverlayBackground').innerHTML = '';
    let task = tasks.find(task => task.id === taskId);
    

    if(task){
        document.getElementById('mainBoard').innerHTML += displayEditTask(task);
    }  else {
        console.error('Task not found');
    }
}



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

async function deleteTask(taskId) {
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = localStorage.getItem('guestLoggedIn') === 'true' ? '-O-Mr5g8976g5-yCxVK8' : user?.id;

    if (!userId) {
        console.error('User not found');
        return;
    }

    try {
        await deleteData(`/users/${userId}/tasks/${taskId}`);
        location.reload();
        closeTask();
        displayTask();
    } catch (error) {
        console.error('Error deleting Task:', error);
    }
}


function searchAndDisplayTasks(elementId, search, status) {
    let element = document.getElementById(elementId);
    element.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        if ((task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) && task.status === status) {
            element.innerHTML += loadTasksHTML(task, i);
        }
    }
}

function searchTask() {
    let search = document.getElementById('findTask').value.toLowerCase();

    searchAndDisplayTasks('tasksToDo', search, 'toDo');
    searchAndDisplayTasks('tasksAwaitFeedback', search, 'awaitFeedback');
    searchAndDisplayTasks('tasksDone', search, 'done');
    searchAndDisplayTasks('tasksInProgress', search, 'inProgress');
}