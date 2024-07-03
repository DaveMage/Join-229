function boardInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    getContacts();
    displayTaskCard();
    menuActive();
}

function addActiveClass() {
    document.getElementById('searchBar').classList.add('inputActive');
}

function removeActiveClass() {
    document.getElementById('searchBar').classList.remove('inputActive');
}

// drag and drop
let currentDraggedElement = null;
function allowDrop(ev) {
    ev.preventDefault();
}

function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId); // Legt die zu übertragende Daten (Task-ID) fest    
    currentDraggedElement = taskId; // Speichert die Task-ID des aktuell gezogenen Elements
}

async function moveTo(status) {
    await getUser();
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = user.id; // Speichern Sie die ID des Benutzers

    const task = tasks.find(t => t.id === currentDraggedElement);
    if (task) {
        task.status = status;
        updateBoardHtml();
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task); // Übergeben Sie die spezifische Aufgabe        
    } else {
        console.error('Task not found with ID:', currentDraggedElement);
    }
}

function updateBoardHtml() {
    const statuses = {
        open: { html: '', containerId: 'toDoContainer' },
        inProgress: { html: '', containerId: 'progressContainer' },
        awaitFeedback: { html: '', containerId: 'feedbackContainer' },
        done: { html: '', containerId: 'doneContainer' }
    };

    for (let status in statuses) {
        let tasksByStatus = tasks.filter(task => task.status === status);
        tasksByStatus.forEach(task => {
            statuses[status].html += taskCardHTML(task);
        });
        document.getElementById(statuses[status].containerId).innerHTML = statuses[status].html;
    }

    displayNoTasks();
}

//----------------------------------------------


function displayNoTasks() {
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    if (toDo.innerHTML === '') {
        toDo.innerHTML = displayNoTasksToDo();
    }
    if (inProgress.innerHTML === '') {
        inProgress.innerHTML = displayNoTasksProgress();
    }
    if (awaitFeedback.innerHTML === '') {
        awaitFeedback.innerHTML = displayNoTasksFeedback();
    }
    if (done.innerHTML === '') {
        done.innerHTML = displayNoTasksDone();
    }

}

async function displayTaskCard() {
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');
    await getTask().then(tasks => {
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task.status === 'open') {
                toDo.innerHTML += taskCardHTML(task);
            } else if (task.status === 'inProgress') {
                inProgress.innerHTML += taskCardHTML(task);
            } else if (task.status === 'awaitFeedback') {
                awaitFeedback.innerHTML += taskCardHTML(task);
            } else if (task.status === 'done') {
                done.innerHTML += taskCardHTML(task);
            }
        }
    });

    displayNoTasks();

}

function displayOverviewTaskCard(taskId) {
    let task = tasks.find(t => t.id === taskId);
    document.getElementById('mainBoard').innerHTML += overviewTaskCardHTML(task);
}

function closeTaskCardOverview() {
    document.getElementById('taskCardOverviewBackground').remove();
}



async function deleteTask(taskId) {
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

        closeTaskCardOverview(); // Close the task card overview
        window.location.reload(); // Reload the page        

    } catch (error) {
        console.error('Error deleting contact:', error); // Log an error message if there is an error deleting the contact
    }
}


// Such Funktion
function searchForTasks() {
    let search = document.getElementById('seachFieldBoard').value.toLowerCase();    //suche die value aus dem feld
    let todo = document.getElementById('toDoContainer');        // ziehe den inhalt aus den feldern
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');
    clearEveryCategorie(todo, inProgress, awaitFeedback, done);  // lösche alles

    tasks.forEach(task => {  //durchsuche die tasks
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {  //suche nach dem wort
            if (task.status === 'open') {
                todo.innerHTML += taskCardHTML(task);  //füge es in die kategorie ein
            } else if (task.status === 'inProgress') {
                inProgress.innerHTML += taskCardHTML(task);
            } else if (task.status === 'awaitFeedback') {
                awaitFeedback.innerHTML += taskCardHTML(task);
            } else if (task.status === 'done') {
                done.innerHTML += taskCardHTML(task);
            }
        }

    });
    displayNoTasks();
}

function clearEveryCategorie(todo, inProgress, awaitFeedback, done) {
    todo.innerHTML = '';
    inProgress.innerHTML = '';
    awaitFeedback.innerHTML = '';
    done.innerHTML = '';
}
//----------------------------------------------

//Edit Task function

function openEditTask(taskId) {
    let task = tasks.find(t => t.id === (taskId));
    if (task) {
        document.getElementById('mainBoard').innerHTML += taskCardEditHTML(task);
        closeTaskCardOverview();
    } else {
        console.error('Task not found with ID:', taskId);
    }
}

function closeEditTask() {
    document.getElementById('taskCardEditBackground').remove();
}

async function selectEditAssigned(taskId) {
    const selectedAssigned = [];
    const inputAssigned = document.getElementById(`assigned${taskId}`);
    const checkboxes = document.querySelectorAll('.assignedCheckbox');

    checkboxes.forEach(checkbox => {
        // Get the contact name element
        const contactNameElement = checkbox.parentNode.querySelector('p[id^="contactName"]');

        if (checkbox.checked && contactNameElement) {
            const contactName = contactNameElement.textContent.trim();
            const contact = contacts.find(c => c.name === contactName);
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });

    // Set the value of the input field
    if (inputAssigned) {
        inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';
    } else {
        console.error(`Input field assigned${taskId} not found`);
    }

    return selectedAssigned;
}

function deleteSubtask(taskId, subtaskIndex) {
    // Find the task by taskId
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Remove the subtask at subtaskIndex
        task.subtasks.splice(subtaskIndex, 1);
        // Update the subtask HTML
        const subtaskContainer = document.getElementById(`subtaskContainer${taskId}`);
        if (subtaskContainer) {
            subtaskContainer.innerHTML = displaySubtasksHTML(task);
        }
    }
}



function focusSubtaskInput() {

    const inputField = document.querySelector('.subtaskInput');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let seperator = document.getElementById('subtaskEditInputSeperator');

    inputField.readOnly = false;
    inputField.focus();
    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';
    seperator.style.display = 'flex';

}

function onBlurSubtaskInput() {
    const inputField = document.querySelector('.subtaskInput');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let seperator = document.getElementById('subtaskEditInputSeperator');

    inputField.readOnly = true;
    addIcon.style.display = 'flex';
    checkIcon.style.display = 'none';
    closeIcon.style.display = 'none';
    seperator.style.display = 'none';
}




function addEditSubtask(taskId) {
    // Retrieve the task by taskId
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }

    // Retrieve the value of the subtask input field
    let subtaskInput = document.getElementById('subtask' + taskId);
    let subtask = subtaskInput.value.trim();
    
    // Retrieve the subtask list element
    let subtaskList = document.getElementById('subtaskContainer' + taskId);

    if (subtask === '') {
        console.error('Subtask cannot be empty');
        return;
    }

    // Add the new subtask to the task's subtasks array
    task.subtasks.push(subtask);

    // Update the subtask list HTML
    subtaskList.innerHTML = displaySubtasksHTML(task);

    // Clear the input field
    subtaskInput.value = '';
    onBlurSubtaskInput();
}

function displaySubtasksHTML(task) {
    let subtaskHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            subtaskHtml += /*html*/ `
            <li class="subtaskItem">
                <input type="text" class="subtaskItemInput" value="${task.subtasks[i]}" readonly id="subtaskEditInput${task.id}-${i}">
                <div class="subtaskItemIconContainer">
                    <img src="/img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon" onclick="focusSubtaskInput(${task.id}, ${i})">
                    <span class="subtaskSeperator"></span>
                    <img src="/img/Mobile/AddTask/trashIcon.png" alt="Trash Icon" class="subtaskItemIcon" id="subtaskItemRightIcon" onclick="deleteSubtask(${task.id}, ${i})">
                </div>
            </li>`;
        }
    }
    return subtaskHtml;
}

function emptySubtaskInput(taskId) {
    let subtaskInput = document.getElementById('subtask' + taskId);
    subtaskInput.value = '';
    onBlurSubtaskInput();
}


// muss noch bearbeitet werden FINGER WEG!
function saveEditTask(){
    let taskId = document.getElementById('editTaskId').value;
    let task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }

    let title = document.getElementById('editTaskTitle').value;
    let description = document.getElementById('editTaskDescription').value;
    let assigned = document.getElementById('assigned' + taskId).value;
    let dueDate = document.getElementById('editTaskDueDate').value;
    let subtasks = task.subtasks;

    task.title = title;
    task.description = description;
    task.assigned = assigned;
    task.dueDate = dueDate;
    task.subtasks = subtasks;

    updateTask(taskId, task);
}
