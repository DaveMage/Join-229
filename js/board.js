let currentDraggedElement = null; // drag and drop

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
};


function addActiveClass() {
    document.getElementById('searchBar').classList.add('inputActive');
};


function removeActiveClass() {
    document.getElementById('searchBar').classList.remove('inputActive');
};


function allowDrop(ev) {
    ev.preventDefault();
};


function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId); // Legt die zu übertragende Daten (Task-ID) fest    
    currentDraggedElement = taskId; // Speichert die Task-ID des aktuell gezogenen Elements
};


async function moveTo(status) {
    await getUser();
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = user ? user.id : '-O-Mr5g8976g5-yCxVK8'; // Setzen Sie einen Standardwert für userId, wenn kein Benutzer gefunden wurde
    const task = tasks.find(t => t.id === currentDraggedElement);
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }

    if (task) {
        task.status = status;
        updateBoardHtml();
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task); // Übergeben Sie die spezifische Aufgabe        
    } else {
        console.error('Task not found with ID:', currentDraggedElement);
    }
};


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
};


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
};


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
};


function displayOverviewTaskCard(taskId) {
    let task = tasks.find(t => t.id === taskId);
    document.getElementById('mainBoard').innerHTML += overviewTaskCardHTML(task);
};


function closeTaskCardOverview() {
    document.getElementById('taskCardOverviewBackground').remove();
};


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
};


function searchForTasks() {     // Such Funktion
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
};


function clearEveryCategorie(todo, inProgress, awaitFeedback, done) {
    todo.innerHTML = '';
    inProgress.innerHTML = '';
    awaitFeedback.innerHTML = '';
    done.innerHTML = '';
};


function openEditTask(taskId) {
    let task = tasks.find(t => t.id === (taskId));

    if (task) {
        document.getElementById('mainBoard').innerHTML += taskCardEditHTML(task);
        fillSelectedAssigned(taskId);

        closeTaskCardOverview();
    } else {
        console.error('Task not found with ID:', taskId);
    }
};


function closeEditTask() {
    document.getElementById('taskCardEditBackground').remove();
};


function fillSelectedAssigned(taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task) {
        selectedAssigned = task.assigned; // Angenommen, task.assigned ist ein Array von zugewiesenen Kontaktnamen

        // Nach dem Füllen von selectedAssigned, die Hintergrundfarbe ändern
        for (let i = 0; i < selectedAssigned.length; i++) {
            changeEditColorAssignedItem(selectedAssigned[i].id);
        }
    }
};


function changeEditColorAssignedItem(contactId) {
    let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
    let contactName = document.getElementById(`contactName${contactId}`);
    let assignedItem = document.getElementById(`wrapper${contactId}`);

    if (assignedCheckbox.checked) {
        assignedItem.style.backgroundColor = '#2A3647';
        contactName.style.color = '#fff';
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobileChecked.png)';
    }   else {
        assignedItem.style.backgroundColor = '#fff';
        contactName.style.color = '#000';
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobile.png)';
    }
};


function updateSelectedAssignedAndInputField(taskId) {
    // Clear the selectedAssigned array at the beginning
    selectedAssigned = [];

    // Get all the checkboxes that indicate assigned contacts
    let checkboxes = document.querySelectorAll('.assignedCheckbox');

    // Iterate over each checkbox
    checkboxes.forEach(checkbox => {
        // Get the data-value attribute of the checkbox
        let contactId = checkbox.getAttribute('data-value');

        // Check if the checkbox is checked
        if (checkbox.checked) {
            // Find the contact object in the contacts array that matches the contact ID
            let contact = contacts.find(c => c.id === contactId);
            // Add the contact object to the selectedAssigned array
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });

    // Update the inputAssigned element with the names of the selected contacts
    let inputAssigned = document.getElementById('assigned' + taskId); // Adjusted to match your example
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';

    // Return the array of selected assigned contacts
    return selectedAssigned;
};


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
};


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
};


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
};


function addEditSubtask(taskId) {
    // Retrieve the task by taskId
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }
    // Ensure that the task has a subtasks array
    if (!task.subtasks) {
        task.subtasks = [];
    }
    // Retrieve the value of the subtask input field
    let subtaskInput = document.getElementById('subtask' + taskId);
    let subtask = subtaskInput.value.trim();
    if (subtask === '') {
        console.error('Subtask cannot be empty');
        return;
    }
    // Add the new subtask to the task's subtasks array
    task.subtasks.push(subtask);
    // Retrieve the subtask list element
    let subtaskList = document.getElementById('subtaskContainer' + taskId);
    // Update the subtask list HTML using a function that generates HTML for subtasks
    subtaskList.innerHTML = displaySubtasksHTML(task);
    // Clear the input field
    subtaskInput.value = '';
    // Optionally call a function to handle UI changes after input field is cleared
    if (typeof onBlurSubtaskInput === 'function') {
        onBlurSubtaskInput();
    }
};


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
};


function emptySubtaskInput(taskId) {
    let subtaskInput = document.getElementById('subtask' + taskId);
    subtaskInput.value = '';
    onBlurSubtaskInput();
};


async function saveEditTask(taskId) {
    let currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }
    let title = document.getElementById('title' + taskId).value;
    let description = document.getElementById('description' + taskId).value;
    let date = document.getElementById('date' + taskId).value;
    let priority = getSelectedPriority(taskId);
    let category = currentTask.category;
    let subtasks = currentTask.subtasks;
    let assigned = updateSelectedAssignedAndInputField(taskId);
    let status = currentTask.status;
    let userEmailToken = localStorage.getItem('emailToken');
    let userId = users.find(user => user.email === atob(userEmailToken));
    userId = userId ? userId.id : null;
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    try {
        if (guestLoggedIn === 'true') {
            userId = '-O-Mr5g8976g5-yCxVK8';
        }

        if (!userId) {
            throw new Error('User ID is not available.');
        }
        await putData('/users/' + userId + '/tasks/' + taskId, {
            'category': category,
            'title': title,
            'description': description,
            'date': date,
            'priority': priority,
            'subtasks': subtasks,
            'assigned': assigned,
            'status': status
        });
        closeEditTask();
        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};


function getSelectedPriority(taskId) {  // Funktion, um die ausgewählte Priorität basierend auf der Aufgaben-ID zu ermitteln
    // Holt alle Radio-Buttons mit dem Namen, der der Aufgaben-ID entspricht
    const priorities = document.getElementsByName(`priority${taskId}`);
    let selectedPriority = null; // Variable zur Speicherung des ausgewählten Radio-Buttons

    // Schleife durch alle Prioritäten (Radio-Buttons)
    for (const priority of priorities) {
        // Überprüfen, ob der aktuelle Radio-Button ausgewählt ist
        if (priority.checked) {
            selectedPriority = priority; // Speichere den ausgewählten Radio-Button
            break; // Schleife abbrechen, da wir die Auswahl gefunden haben
        }
    }

    // Überprüfen, ob eine Priorität ausgewählt wurde
    if (selectedPriority) {
        const priorityValue = selectedPriority.value; // Wert des ausgewählten Radio-Buttons
        const priorityLabel = document.querySelector(`label[for='${selectedPriority.id}']`); // Holt das zugehörige Label-Element
        const priorityImgSrc = priorityLabel.querySelector('img').src; // Holt den Bildpfad des Bildes innerhalb des Labels

        // Rückgabe eines Objekts mit dem Wert und dem Bildpfad
        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    } else {
        // Falls keine Priorität ausgewählt wurde, können wir einen Standardwert oder eine Fehlerbehandlung zurückgeben
        return null; // oder passende Fehlermeldung/Logik
    }
};












