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


/**
 * Updates the profile icons for a task based on the checked assigned checkboxes.
 *
 * @param {string} taskId - The ID of the task to update the profile icons for.
 */
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
    const task = tasks.find(task => task.id === taskId);
    task.assigned = assignedContacts;
    const profileIconContainer = document.getElementById('profileIconAssingedContainer');
    profileIconContainer.innerHTML = displayAssignedProfileIcons(task);
}