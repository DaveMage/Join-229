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

async function deleteTask(taskId){
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = userId.id; // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn'); // Get the guestLoggedIn value from local storage
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8'; // Set the user ID to the guest user ID if the guest is logged in
    }
    if (!userId) {
        console.error('User not found'); // Log an error message if user ID is not found
        return;
    }

    try {
        await deleteData('/users/' + userId + '/tasks/' + taskId); // Delete the contact data from the server
        closeTask(); // Close the contact overlay
        displayTask();    
    } catch (error) {
        console.error('Error deleting Task:', error); // Log an error message if there is an error deleting the contact
    }
}