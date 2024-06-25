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

function openEditTask(taskId) {
    document.getElementById('taskOverlayBackground').innerHTML = '';
    let task = tasks.find(task => task.id === taskId);

    if (task) {
        document.getElementById('mainBoard').innerHTML += displayEditTask(task);
    }  else {
        console.error('Task not found');
    }
}

async function saveTaskChanges(editedTask) {
    console.log(editedTask);
    let editTitle = document.getElementById('editTaskTitle').value;
    let editDescription = document.getElementById('editTaskDescription').value;
    let editDate = document.getElementById('editTaskDate');
    // let prio = getSelectedPriority();
    
    await getUser();
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    } else {
        userId = userId.id;
    }

    /*try {
        await postData('/users/' + userId + '/tasks', {
            'title': editTitle,
            'description': editDescription,
            'date': editDate,
            'assigned': selectedAssigned,
            'priority': prio,
            'category': category,
            'subtasks': subtasks,
            'status': 'toDo'
        });
    } catch (error) {
        console.error('Error saving task:', error);
    }*/

    closeEditTask();
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


/**
 * Deletes a task.
 * @param {string} taskId - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
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


/**
 * Searches for tasks based on the given search term and status, and displays them in the specified element.
 * @param {string} elementId - The ID of the HTML element where the tasks will be displayed.
 * @param {string} search - The search term to filter the tasks.
 * @param {string} status - The status of the tasks to filter.
 */
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


/**
 * Searches for tasks based on the input value and displays them in different sections.
 */
function searchTask() {
    let search = document.getElementById('findTask').value.toLowerCase();

    searchAndDisplayTasks('tasksToDo', search, 'toDo');
    searchAndDisplayTasks('tasksAwaitFeedback', search, 'awaitFeedback');
    searchAndDisplayTasks('tasksDone', search, 'done');
    searchAndDisplayTasks('tasksInProgress', search, 'inProgress');
}

function startDragging(event) {
    let taskId = event.target.id;
    event.dataTransfer.setData('text', event.target.id);
    console.log(taskId);    
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    let taskId = event.dataTransfer.getData('text');
    let task = tasks.find(task => task.id === taskId);
    let status = event.target.id;

    if (task) {
        task.status = status;
        updateTask(task);
        displayTask();
    } else {
        console.error('Task not found');
    }
}