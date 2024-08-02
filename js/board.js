let currentDraggedElement = null;


/**
 * Initializes the task board interface, setting up various UI components and loading necessary data.
 *
 * This asynchronous function sets up the initial state of the task board, including mobile and desktop
 * UI elements, user login status, and contacts. It also loads the task cards and activates necessary
 * UI components.
 */
async function boardInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    await getContacts();
    displayTaskCard();
    menuActive();
    templateInit();
}


/**
 * Sets the minimum allowable date for a task's due date to the current date.
 *
 * This function updates the minimum date attribute of the date input field for a specific task
 * to prevent selecting a past date. It ensures that the due date cannot be set earlier than today.
 *
 * @param {string} taskId - The unique identifier of the task whose date input field is being updated.
 */
function dateTreshholdEdit(taskId) {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById(`date${taskId}`).setAttribute('min', today);
}


/**
 * Adds an 'inputActive' class to the search bar elements.
 *
 * This function adds a CSS class to both the mobile and desktop search bar elements
 * to visually indicate that they are active or focused.
 */
function addActiveClass() {
    document.getElementById('searchBar').classList.add('inputActive');
    document.getElementById('searchBarDesktop').classList.add('inputActive');
}


/**
 * Removes the 'inputActive' class from the search bar elements.
 *
 * This function removes the CSS class from both the mobile and desktop search bar elements,
 * indicating that they are no longer active or focused.
 */
function removeActiveClass() {
    document.getElementById('searchBar').classList.remove('inputActive');
    document.getElementById('searchBarDesktop').classList.remove('inputActive');
}


/**
 * Allows an element to be dropped into a drop target.
 *
 * This function prevents the default behavior of the drag event, allowing the dragged element
 * to be dropped into a designated drop target.
 *
 * @param {Event} ev - The event object representing the drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Initiates the dragging of a task by setting the data transfer and storing the task ID.
 *
 * This function is called when a drag event starts on a task element. It sets the task ID
 * as the data to be transferred and stores the ID in a global variable for later use.
 *
 * @param {Event} event - The drag event object.
 * @param {string} taskId - The unique identifier of the task being dragged.
 */
function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
    currentDraggedElement = taskId;
}


/**
 * Moves a task to a different status and updates the task on the server.
 *
 * This asynchronous function updates the status of a task based on the given status parameter.
 * It retrieves the user information, updates the task status both locally and on the server,
 * and refreshes the task board UI.
 *
 * @param {string} status - The new status to which the task should be moved.
 */
async function moveTo(status) {
    userId = await getUserId();
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }
    const task = tasks.find(t => t.id === currentDraggedElement);

    if (task) {
        task.status = status;
        updateBoardHtml();
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task);
    } else {
        console.error('Task not found with ID:', currentDraggedElement);
    }
}


/**
 * Displays the move-to menu for a given task.
 * If the menu already exists, it is removed.
 * 
 * @param {string} taskId - The ID of the task element.
 */
function displayMoveToMenu(taskId) {
    let taskElement = document.getElementById(taskId);
    let existingMenu = document.getElementById('moveToMenu' + taskId);

    if (existingMenu) {
        existingMenu.remove();
        return;
    }

    taskElement.innerHTML += menuMoveToHtml(taskId);
}

function closeMoveToMenu(taskId) {
    let existingMenu = document.getElementById('moveToMenu' + taskId);
    if (existingMenu) {
        existingMenu.remove();
    }
}


/**
 * Moves a task to a new status based on the provided status and taskId.
 * @param {string} status - The new status of the task.
 * @param {string} taskId - The ID of the task to be moved.
 * @returns {Promise<void>} - A promise that resolves when the task is successfully moved.
 */
async function moveToClick(status, taskId) {
    try {
        let userId = await getUserId();
        let guestLoggedIn = localStorage.getItem('guestLoggedIn');

        if (guestLoggedIn === 'true') {
            userId = '-O-Mr5g8976g5-yCxVK8';
        }
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.status = status;
            updateBoardHtml();
            await putData('/users/' + userId + '/tasks/' + taskId, task);
        } else {
            console.error('Task not found with ID:', taskId);
        }
    } catch (error) {
        console.error('Error in moveTo:', error);
    }
}


/**
 * Updates the HTML content of the task board based on the status of each task.
 *
 * This function iterates through each task, categorizing them by their status,
 * and updates the respective HTML containers for each status category.
 * It also ensures that appropriate messages are displayed if any category is empty.
 */
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


/**
 * Displays appropriate messages when task categories are empty and shows a general warning if all are empty.
 *
 * This function checks each task category container for content. If a container is empty,
 * it displays a specific message indicating that there are no tasks in that category.
 * It also uses the `showEmptyWarning` function to display a general warning if all categories are empty.
 */
function displayNoTasks() {
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    showEmptyWarning(toDo, inProgress, awaitFeedback, done);

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


/**
 * Displays or hides a warning message when all task categories are empty.
 *
 * This function checks if all provided task category containers are empty. If they are,
 * it displays a warning message to indicate that there are no tasks available. Otherwise,
 * it hides the warning message.
 *
 * @param {HTMLElement} toDo - The HTML element representing the "To Do" category container.
 * @param {HTMLElement} inProgress - The HTML element representing the "In Progress" category container.
 * @param {HTMLElement} awaitFeedback - The HTML element representing the "Awaiting Feedback" category container.
 * @param {HTMLElement} done - The HTML element representing the "Done" category container.
 */
function showEmptyWarning(toDo, inProgress, awaitFeedback, done) {
    if (toDo.innerHTML === '' && inProgress.innerHTML === '' && awaitFeedback.innerHTML === '' && done.innerHTML === '') {
        document.getElementById('noSearchResults').classList.add('d-block');
    } else {
        document.getElementById('noSearchResults').classList.remove('d-block');
    }
}


/**
 * Fetches tasks and displays them in the appropriate category containers on the board.
 *
 * This asynchronous function retrieves tasks from the server, then iterates over the task list
 * to display each task in its corresponding category container based on the task's status.
 * It also calls a function to handle cases where no tasks are available.
 */
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


/**
 * Displays the overview task card for a specific task.
 *
 * This function finds the task by its ID and appends the generated HTML for the
 * task overview card to the main board. The overview card provides a detailed
 * view of the task's information.
 *
 * @param {string} taskId - The unique identifier of the task to display in the overview card.
 */
function displayOverviewTaskCard(taskId) {
    let task = tasks.find(t => t.id === taskId);
    document.getElementById('mainBoard').innerHTML += overviewTaskCardHTML(task);
}


/**
 * Closes the task card overview with an animation effect.
 *
 * This function triggers a closing animation for the task card overview.
 * Once the animation is complete, it removes the overview and its associated
 * overlay from the DOM.
 */
function closeTaskCardOverview() {
    let floatId = document.getElementById('taskCardOverviewBodyId');
    let removeBackground = document.getElementById('taskCardOverviewBackground');
    let overlay = document.getElementById('backgroundOverlay');

    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        removeBackground.remove();
        overlay.remove();
    });
}


/**
 * Closes the task card overview without applying any animation effects.
 *
 * This function immediately removes the task card overview background and its associated
 * overlay from the DOM, providing a quick and direct way to close the overview.
 */
function closeTaskCardOverviewWithoutAnimation() {
    document.getElementById('taskCardOverviewBackground').remove();
    document.getElementById('backgroundOverlay').remove();
}


/**
 * Deletes a task and refreshes the UI to reflect the changes.
 *
 * This asynchronous function deletes a specified task from the server, using the user ID
 * to identify the user. It handles both regular and guest user scenarios, updates the UI
 * after deletion, and logs errors if the operation fails.
 *
 * @param {string} taskId - The unique identifier of the task to be deleted.
 */
async function deleteTask(taskId) {
    let userId = users.find(user => user.email == atob(localStorage.getItem('emailToken')));
    userId = userId.id;
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    } else if (!userId) {
        console.error('User not found');
        return;
    }
    
    try {
        await deleteData('/users/' + userId + '/tasks/' + taskId);
        closeTaskCardOverview();
        window.location.reload();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}


/**
 * Searches for tasks based on the input in the search field and displays matching tasks.
 *
 * This function filters tasks by their title or description based on the user's input in the search field.
 * It clears the existing tasks from all categories and displays only the tasks that match the search query.
 */
function searchForTasks() {
    let search = document.getElementById('seachFieldBoard').value.toLowerCase();
    let todo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    clearEveryCategorie(todo, inProgress, awaitFeedback, done);
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {
            if (task.status === 'open') {
                todo.innerHTML += taskCardHTML(task);
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


/**
 * Searches for tasks based on the input in the desktop search field and displays matching tasks.
 *
 * This function filters tasks by the title or description based on the user's input in the search field.
 * It clears the existing tasks from all categories and displays only the tasks that match the search query.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 */
function searchForTasksDesktop() {
    let search = document.getElementById('seachFieldBoardDesktop').value.toLowerCase();
    let todo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    clearEveryCategorie(todo, inProgress, awaitFeedback, done);

    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {
            if (task.status === 'open') {
                todo.innerHTML += taskCardHTML(task);
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


/**
 * Clears the content of task categories on the board.
 *
 * This function empties the innerHTML of each category container, effectively clearing
 * all tasks from the specified categories on the task board.
 *
 * @param {HTMLElement} todo - The HTML element representing the "To Do" category.
 * @param {HTMLElement} inProgress - The HTML element representing the "In Progress" category.
 * @param {HTMLElement} awaitFeedback - The HTML element representing the "Awaiting Feedback" category.
 * @param {HTMLElement} done - The HTML element representing the "Done" category.
 */
function clearEveryCategorie(todo, inProgress, awaitFeedback, done) {
    todo.innerHTML = '';
    inProgress.innerHTML = '';
    awaitFeedback.innerHTML = '';
    done.innerHTML = '';
}


/**
 * Opens the edit task modal for a specific task and initializes the necessary UI components.
 *
 * This function finds the task by its ID, renders the edit task modal, and sets up the
 * UI components and event listeners required for editing the task. It also ensures that
 * the task's assigned contacts and date are appropriately handled.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 */
function openEditTask(taskId) {
    let task = tasks.find(t => t.id === taskId);

    if (task) {
        document.getElementById('mainBoard').innerHTML += taskCardEditHTML(task);
        closeTaskCardOverviewWithoutAnimation();
        fillSelectedAssigned(taskId);
        dateTreshholdEdit(taskId);
        addTaskEditEventListeners(taskId);
    } else {
        console.error('Task not found with ID:', taskId);
    }
}


/**
 * Closes the edit task modal and removes the associated elements from the DOM.
 *
 * This function triggers the closing animation for the edit task modal and, upon completion of
 * the animation, removes the modal background and overlay elements from the DOM.
 */
function closeEditTask() {
    let floatId = document.getElementById('taskCardEditBackgroundFloat');
    let removeBackground = document.getElementById('taskCardEditBackground');
    let overlay = document.getElementById('backgroundOverlayEdit');
    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        removeBackground.remove();
        overlay.remove();
    });
}


/**
 * Fills the selected assigned contacts for a task and updates the UI to reflect the selection.
 *
 * This function finds the specified task by its ID and fills the `selectedAssigned` array
 * with the contacts assigned to the task. It then updates the UI for each assigned contact
 * using `changeEditColorAssignedItem` to visually indicate their selection status.
 *
 * @param {string} taskId - The unique identifier of the task whose assigned contacts are being filled.
 */
function fillSelectedAssigned(taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task && selectedAssigned[0] != null) {
        selectedAssigned = task.assigned;
        for (let i = 0; i < selectedAssigned.length; i++) {
            changeEditColorAssignedItem(selectedAssigned[i].id);
        }
    }
}


/**
 * Updates the appearance of an assigned contact item based on its selection state.
 *
 * This function changes the background color and text color of an assigned contact item
 * and updates the checkbox image depending on whether the contact is selected or not.
 *
 * @param {string} contactId - The unique identifier of the contact item being updated.
 */
function changeEditColorAssignedItem(contactId) {
    let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
    let contactName = document.getElementById(`contactName${contactId}`);
    let assignedItem = document.getElementById(`wrapper${contactId}`);

    if (assignedCheckbox.checked) {
        assignedItem.style.backgroundColor = '#2A3647';
        contactName.style.color = '#fff';
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobileChecked.png)';
    } else {
        assignedItem.style.backgroundColor = '#fff';
        contactName.style.color = '#000';
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobile.png)';
    }
}


/**
 * Updates the list of selected assigned contacts and updates the input field with the selected names.
 *
 * This function iterates through all checkboxes with the class 'assignedCheckbox' to determine
 * which contacts have been selected. It then updates the `selectedAssigned` array with these contacts
 * and sets the value of the assigned input field with the names of the selected contacts.
 *
 * @param {string} taskId - The unique identifier of the task for which the assigned contacts are being updated.
 * @return {Array} An array of selected contact objects.
 */
function updateSelectedAssignedAndInputField(taskId) {
    selectedAssigned = [];

    let checkboxes = document.querySelectorAll('.assignedCheckbox');
    checkboxes.forEach(checkbox => {
        let contactId = checkbox.getAttribute('data-value');

        if (checkbox.checked) {
            let contact = contacts.find(c => c.id === contactId);
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });
    let inputAssigned = document.getElementById('assigned' + taskId);
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';
    return selectedAssigned;
}


/**
 * Deletes a specified subtask from a task and updates the display.
 *
 * This function removes a subtask from the list of subtasks associated with a given task
 * based on the task ID and subtask index. It also updates the user interface to reflect
 * the deletion by re-rendering the subtask list.
 *
 * @param {string} taskId - The unique identifier of the task from which the subtask is being deleted.
 * @param {number} subtaskIndex - The index of the subtask to be deleted within the task's subtasks array.
 */
function deleteSubtask(taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);

    if (task) {
        task.subtasks.splice(subtaskIndex, 1);
        const subtaskContainer = document.getElementById(`subtaskContainer${taskId}`);

        if (subtaskContainer) {
            subtaskContainer.innerHTML = displaySubtasksHTML(task);
        }
    }
}


/**
 * Activates the subtask input field for editing and updates the UI elements accordingly.
 *
 * This function enables the subtask input field by removing the read-only attribute and setting focus on it.
 * It also adjusts the visibility of associated icons and separators to indicate that the subtask input is
 * active and ready for editing.
 */
function focusSubtaskInput() {
    const inputField = document.querySelector('.subtaskInput');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    inputField.readOnly = false;

    inputField.focus();
    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';
    separator.style.display = 'flex';
}


/**
 * Handles the UI changes when the subtask input field loses focus.
 *
 * This function sets the subtask input field to read-only and adjusts the visibility of 
 * various icons and separators associated with the subtask input. It is typically called 
 * after a subtask has been edited or added.
 */
function onBlurSubtaskInput() {
    const inputField = document.querySelector('.subtaskInput');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    inputField.readOnly = true;

    addIcon.style.display = 'flex';
    checkIcon.style.display = 'none';
    closeIcon.style.display = 'none';
    separator.style.display = 'none';
}


/**
 * Adds a new subtask to an existing task and updates the task's subtask list.
 *
 * This function finds the task by its ID, checks for existing subtasks, and adds a new subtask
 * to the list. It also updates the subtask display and clears the subtask input field.
 *
 * @param {string} taskId - The unique identifier of the task to which the subtask is being added.
 */
function addEditSubtask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }
    if (!task.subtasks) {
        task.subtasks = [];
    }

    let subtaskInput = document.getElementById('subtask' + taskId);
    let subtaskName = subtaskInput.value.trim();

    if (subtaskName === '') {
        console.error('Subtask cannot be empty');
        return;
    }

    task.subtasks.push({ name: subtaskName, completed: false });
    let subtaskList = document.getElementById('subtaskContainer' + taskId);
    subtaskList.innerHTML = displaySubtasksHTML(task);
    subtaskInput.value = '';

    if (typeof onBlurSubtaskInput === 'function') {
        onBlurSubtaskInput();
    }
}


/**
 * Enables editing of a specific subtask for a given task.
 *
 * This function removes the 'disabled' attribute from the subtask input field,
 * allowing the user to edit the subtask. It also sets the focus on the input field
 * to facilitate immediate editing.
 *
 * @param {string} taskId - The unique identifier of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask within the task's subtasks array.
 */
function editSubtask(taskId, subtaskIndex) {
    const subtaskInput = document.getElementById(`subtaskEditInput${taskId}-${subtaskIndex}`);
    subtaskInput.removeAttribute('disabled');
    subtaskInput.focus();
}


/**
 * Clears the subtask input field for a specific task and triggers additional cleanup actions.
 *
 * This function resets the value of the subtask input field to an empty string, effectively clearing any text entered.
 * It also calls a helper function to handle any additional actions needed after the subtask input loses focus.
 *
 * @param {string} taskId - The unique identifier of the task whose subtask input field is being cleared.
 */
function emptySubtaskInput(taskId) {
    let subtaskInput = document.getElementById('subtask' + taskId);
    subtaskInput.value = '';
    onBlurSubtaskInput();
}


/**
 * Retrieves the edited form data for a specific task, including new and existing subtasks.
 *
 * This function gathers the updated form data for a task being edited, including the task's title,
 * description, due date, priority, category, subtasks, assigned users, and status. It combines
 * existing subtasks with any new subtasks added during the editing process.
 *
 * @param {string} taskId - The unique identifier of the task being edited.
 * @param {Object} currentTask - The current task object containing existing data.
 * @return {Object} An object containing the updated task data.
 */
function getEditFormData(taskId, currentTask) {
    if (currentTask.subtasks == null) {
        return {
            title: document.getElementById('title' + taskId).value,
            description: document.getElementById('description' + taskId).value,
            date: document.getElementById('date' + taskId).value,
            priority: getSelectedPriorityEditTask(taskId),
            category: currentTask.category,
            assigned: updateSelectedAssignedAndInputField(taskId),
            status: currentTask.status,
        };
    } else {
        let existingSubtasks = currentTask.subtasks.map(subtask => ({ name: subtask.name, completed: subtask.completed }));
        let newSubtasks = subtasks.map(subtask => ({ name: subtask, completed: false }));
        let combinedSubtasks = [...existingSubtasks, ...newSubtasks];

        return {
            title: document.getElementById('title' + taskId).value,
            description: document.getElementById('description' + taskId).value,
            date: document.getElementById('date' + taskId).value,
            priority: getSelectedPriorityEditTask(taskId),
            category: currentTask.category,
            subtasks: combinedSubtasks,
            assigned: updateSelectedAssignedAndInputField(taskId),
            status: currentTask.status,
        }
    }
}


function updateProfileIcons(taskId) {
    const assignedCheckboxes = document.querySelectorAll(`#editAssignedDropdown .assignedCheckbox`);
    const assignedContacts = [];
    
    assignedCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const contactId = checkbox.getAttribute('data-value');
            const contact = contacts.find(contact => contact.id === contactId);
            assignedContacts.push(contact);
        }
    });

    // Find the task by id and update its assigned contacts
    const task = tasks.find(task => task.id === taskId);
    task.assigned = assignedContacts;

    // Update the profile icons container
    const profileIconContainer = document.getElementById('profileIconAssingedContainer');
    profileIconContainer.innerHTML = displayAssignedProfileIcons(task);
}


/**
 * Saves the edited task details and updates the task data on the server.
 *
 * This asynchronous function retrieves the edited data from the form, updates the task's details,
 * and sends the updated data to the server. It also handles potential errors and updates the UI accordingly.
 *
 * @param {string} taskId - The unique identifier of the task being edited.
 */
async function saveEditTask(taskId) {
    let currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }
    let formData = getEditFormData(taskId, currentTask);

    if (currentTask.subtasks == null) {
        try {
            let userId = await getUserId();

            if (!userId) {
                throw new Error('User ID not found');
            }
            await putData(`/users/${userId}/tasks/${taskId}`, {
                title: formData.title,
                description: formData.description,
                assigned: formData.assigned,
                date: formData.date,
                prio: formData.priority,
                category: formData.category,
                status: formData.status
            });
            closeEditTask();
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    } else {
        let editedSubtasks = currentTask.subtasks.map((subtask, index) => {
            let inputElement = document.getElementById(`subtaskEditInput${taskId}-${index}`);
            return {
                ...subtask,
                name: inputElement ? inputElement.value : subtask.name
            };
        });

        try {
            let userId = await getUserId();

            if (!userId) {
                throw new Error('User ID not found');
            }
            await putData(`/users/${userId}/tasks/${taskId}`, {
                title: formData.title,
                description: formData.description,
                assigned: formData.assigned,
                date: formData.date,
                prio: formData.priority,
                category: formData.category,
                subtasks: editedSubtasks,
                status: formData.status
            });
            closeEditTask();
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
    updateBoardHtml();
}


/**
 * Retrieves the selected priority details for a specific task.
 *
 * This function finds the selected priority level for a given task based on radio buttons
 * with names corresponding to the task ID. It returns an object containing the value of the
 * selected priority and the source URL of the associated image, or null if no priority is selected.
 *
 * @param {string} taskId - The unique identifier of the task for which to retrieve the selected priority.
 * @return {Object|null} An object containing the selected priority value and image source,
 *                       or null if no priority is selected.
 */
function getSelectedPriority(taskId) {
    const priorities = document.getElementsByName(`priority${taskId}`);
    let selectedPriority = null;

    for (const priority of priorities) {
        if (priority.checked) {
            selectedPriority = priority;
            break;
        }
    }
    if (selectedPriority) {
        const priorityValue = selectedPriority.value;
        const priorityLabel = document.querySelector(`label[for='${selectedPriority.id}']`);
        const priorityImgSrc = priorityLabel.querySelector('img').src;
        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    } else {
        return null;
    }
}


/**
 * Redirects the user to the "Add Task" page.
 *
 * This function changes the current browser window's location to the "Add Task" page,
 * typically used for navigating to a page where users can add new tasks.
 */
function goToAddTask() {
    window.location.href = '/addTask.html';
}


/**
 * Adds a new task to the board and initializes the necessary event listeners and UI settings.
 *
 * This function appends a new task to the main board based on the provided task status.
 * It generates the task's HTML, ensures that the date input field has the correct date restrictions,
 * and sets up event listeners for form interactions.
 *
 * @param {string} taskStatus - The status of the task to be added, used to determine its placement or styling.
 */
function addNewTaskOnBoard(taskStatus) {
    if (window.innerWidth < 1100) {
        goToAddTask();
    } else {
        let main = document.getElementById('mainBoard');
        main.innerHTML += addNewTaskOnBoardHtml(taskStatus);
        clearForm();
        dateThreshold();
        addEventListeners();
    }
}


/**
 * Adds event listeners to the task addition form and its input fields for handling form submission and key events.
 *
 * This function attaches event listeners to the form used for adding a new task and its associated input fields.
 * It prevents the default form submission behavior and provides functionality for handling 'Enter' key presses,
 * specifically adding subtasks when the 'Enter' key is pressed in the subtask input field.
 */
function addEventListeners() {
    const form = document.getElementById('addTaskForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    }

    const inputFields = document.querySelectorAll('.addTaskInput, .addTaskDescription');
    inputFields.forEach(input => {
        if (input) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (input.id === 'addTaskSubtask') {
                        addSubtaskItem();
                    }
                }
            });
        }
    });
}


/**
 * Adds event listeners to the edit task form and input fields for handling form submission and special key events.
 *
 * This function attaches event listeners to the task edit form and its input fields to manage form submission
 * and handle specific key events like 'Enter' key presses. It prevents the default form submission behavior
 * and provides functionality for editing subtasks when the 'Enter' key is pressed in subtask input fields.
 *
 * @param {string} taskId - The unique identifier of the task being edited.
 */
function addTaskEditEventListeners(taskId) {
    const form = document.getElementById(`editTaskForm${taskId}`);
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    }
    const inputFields = document.querySelectorAll(`#title${taskId}, #description${taskId}, #date${taskId}, #subtask${taskId}`);
    inputFields.forEach(input => {
        if (input) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    if (input.id.startsWith('subtask')) {
                        addEditSubtask(taskId);
                    }
                }
            });
        }
    });
}


/**
 * Closes the "Add Task" card on the board and removes associated elements.
 *
 * This function initiates the closing animation for the "Add Task" card and, upon completion of
 * the animation, removes the card and its overlay from the DOM.
 */
function closeAddTaskOnBoard() {
    let float = document.getElementById('forAnimationFloating');
    let addTaskChard = document.getElementById('addTaskChard');
    let overlay = document.getElementById('backgroundOverlay');
    float.classList.add('closing');
    float.addEventListener('animationend', () => {
        addTaskChard.remove();
        overlay.remove();
    });
}


/**
 * Toggles the completion status of a subtask and updates the task's data on the server.
 *
 * This asynchronous function toggles the completed status of a subtask in a specified task.
 * It fetches user data, updates the task on the server, and visually updates the progress
 * of the task in the UI.
 *
 * @param {number} subtaskIndex - The index of the subtask to toggle within the task's subtasks array.
 * @param {string} taskId - The unique identifier of the task containing the subtask.
 */
async function toggleSubtask(subtaskIndex, taskId) {
    try {
        await getUser();

        let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
        let guestLoggedIn = localStorage.getItem('guestLoggedIn');
        userId = guestLoggedIn === 'true' ? '-O-Mr5g8976g5-yCxVK8' : userId.id;

        let task = tasks.find(task => task.id === taskId);
        if (!task) {
            console.error('Task not found');
            return;
        }
        task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;

        await putData(`/users/${userId}/tasks/${taskId}`, {
            ...task
        });

        let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        let progressPercentage = (completedSubtasks / task.subtasks.length) * 100;
        document.getElementById(`progressbar${task.id}`).style.width = `${progressPercentage}%`;

        tasks = tasks.map(t => t.id === taskId ? task : t);
    } catch (error) {
        console.error('Error toggling subtask:', error);
    }
    updateBoardHtml();
}


/**
 * Displays a success message on the main board and removes it after a short delay.
 *
 * This function adds a success message to the main board by inserting HTML content.
 * It then sets a timeout to remove the message and its overlay after a short delay,
 * ensuring the success message is displayed briefly.
 */
function displaySuccsessfullyBoardMessage() {
    let mainContainer = document.getElementById('mainBoard');
    mainContainer.innerHTML += successfullyTaskDesktopHtml();
    setTimeout(() => {
        document.getElementById('background').remove();
        document.getElementById('backgroundOverlay').remove();
    }, 900);
}