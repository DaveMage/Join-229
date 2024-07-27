let currentDraggedElement = null;


/**
 * Initializes the task board interface, setting up various UI components and loading necessary data.
 *
 * This asynchronous function sets up the initial state of the task board, including mobile and desktop
 * UI elements, user login status, and contacts. It also loads the task cards and activates necessary
 * UI components.
 */
async function boardInit() {
    // Display the header for mobile view
    displayMobileHeader();

    // Display the menu for mobile view
    displayMobileMenu();

    // Display the menu for desktop view
    displayDesktopMenu();

    // Load guest login information, if available
    loadGuestLogin();

    // Check the guest login status and handle it accordingly
    checkGuestLogin();

    // Load the initials of the logged-in user
    loadUserInitial();

    // Fetch the list of contacts and handle them once retrieved
    await getContacts();

    // Display the task cards on the board
    displayTaskCard();

    // Activate the menu items or buttons in the UI
    menuActive();

    // Initialize any templates used in the interface
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
    // Get today's date in the format 'YYYY-MM-DD'
    let today = new Date().toISOString().split('T')[0];

    // Set the minimum date attribute of the date input field to today's date
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
    // Set the data transfer data with the task ID in plain text format
    event.dataTransfer.setData('text/plain', taskId);

    // Store the current dragged element's task ID in a global variable
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
    // Fetch the user data
    await getUser();

    // Retrieve the user ID from the local storage or set a default guest ID
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = user ? user.id : '-O-Mr5g8976g5-yCxVK8';
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    // If a guest is logged in, use the guest user ID
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }

    // Find the task using the currentDraggedElement ID
    const task = tasks.find(t => t.id === currentDraggedElement);

    if (task) {
        // Update the task's status
        task.status = status;

        // Update the task board UI
        updateBoardHtml();

        // Send the updated task data to the server
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task);
    } else {
        // Log an error if the task is not found
        console.error('Task not found with ID:', currentDraggedElement);
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
    // Define an object to hold the HTML content and container IDs for each task status
    const statuses = {
        open: { html: '', containerId: 'toDoContainer' },
        inProgress: { html: '', containerId: 'progressContainer' },
        awaitFeedback: { html: '', containerId: 'feedbackContainer' },
        done: { html: '', containerId: 'doneContainer' }
    };

    // Iterate through each status type and accumulate HTML for tasks with that status
    for (let status in statuses) {
        let tasksByStatus = tasks.filter(task => task.status === status);
        tasksByStatus.forEach(task => {
            statuses[status].html += taskCardHTML(task);
        });

        // Update the HTML content of the respective container based on the task status
        document.getElementById(statuses[status].containerId).innerHTML = statuses[status].html;
    }

    // Display messages for empty categories if no tasks are available
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
    // Get the container elements for each task category
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    // Show a general warning if all categories are empty
    showEmptyWarning(toDo, inProgress, awaitFeedback, done);

    // Display a message if the "To Do" category is empty
    if (toDo.innerHTML === '') {
        toDo.innerHTML = displayNoTasksToDo();
    }

    // Display a message if the "In Progress" category is empty
    if (inProgress.innerHTML === '') {
        inProgress.innerHTML = displayNoTasksProgress();
    }

    // Display a message if the "Awaiting Feedback" category is empty
    if (awaitFeedback.innerHTML === '') {
        awaitFeedback.innerHTML = displayNoTasksFeedback();
    }

    // Display a message if the "Done" category is empty
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
    // Check if all category containers are empty
    if (toDo.innerHTML === '' && inProgress.innerHTML === '' && awaitFeedback.innerHTML === '' && done.innerHTML === '') {
        // If all are empty, show the warning message
        document.getElementById('noSearchResults').classList.add('d-block');
    } else {
        // Otherwise, hide the warning message
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
    // Get the container elements for each task category
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    // Fetch tasks and handle them once they are retrieved
    await getTask().then(tasks => {
        // Iterate over each task and display it in the appropriate category container
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

    // Display a message or indication if no tasks are available
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
    // Find the task by its ID in the tasks array
    let task = tasks.find(t => t.id === taskId);

    // Append the task overview card HTML to the main board
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
    // Get the elements associated with the task card overview
    let floatId = document.getElementById('taskCardOverviewBodyId');
    let removeBackground = document.getElementById('taskCardOverviewBackground');
    let overlay = document.getElementById('backgroundOverlay');

    // Add the 'closing' class to initiate the closing animation
    floatId.classList.add('closing');

    // Listen for the end of the animation to remove the elements from the DOM
    floatId.addEventListener('animationend', () => {
        removeBackground.remove(); // Remove the task card overview background
        overlay.remove();          // Remove the overlay
    });
}


/**
 * Closes the task card overview without applying any animation effects.
 *
 * This function immediately removes the task card overview background and its associated
 * overlay from the DOM, providing a quick and direct way to close the overview.
 */
function closeTaskCardOverviewWithoutAnimation() {
    // Remove the task card overview background element from the DOM
    document.getElementById('taskCardOverviewBackground').remove();

    // Remove the background overlay element from the DOM
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
    // Retrieve the user ID based on the email stored in localStorage
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))).id;
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    // If a guest is logged in, use the guest user ID
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }

    // Check if user ID is valid
    if (!userId) {
        console.error('User not found');
        return;
    }

    try {
        // Delete the task from the server
        await deleteData('/users/' + userId + '/tasks/' + taskId);

        // Close the task overview UI and refresh the page
        closeTaskCardOverview();
        window.location.reload();
    } catch (error) {
        // Log any errors that occur during the deletion process
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
    // Get the search query from the search field and convert it to lowercase
    let search = document.getElementById('seachFieldBoard').value.toLowerCase();

    // Get the container elements for each task category
    let todo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    // Clear all categories before displaying the filtered tasks
    clearEveryCategorie(todo, inProgress, awaitFeedback, done);

    // Iterate through each task and display it if it matches the search query
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {
            // Display tasks in their respective categories based on their status
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

    // Display a message or indication if no tasks match the search criteria
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
    // Get the search query from the search field and convert it to lowercase
    let search = document.getElementById('seachFieldBoardDesktop').value.toLowerCase();

    // Get the container elements for each task category
    let todo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    // Clear all categories before displaying the filtered tasks
    clearEveryCategorie(todo, inProgress, awaitFeedback, done);

    // Iterate through each task and display it if it matches the search query
    tasks.forEach(task => {
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {
            // Display tasks in their respective categories based on their status
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

    // Display a message or indication if no tasks match the search criteria
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
    // Clear the content of the "To Do" category container
    todo.innerHTML = '';

    // Clear the content of the "In Progress" category container
    inProgress.innerHTML = '';

    // Clear the content of the "Awaiting Feedback" category container
    awaitFeedback.innerHTML = '';

    // Clear the content of the "Done" category container
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
    // Find the task by its ID
    let task = tasks.find(t => t.id === taskId);

    if (task) {
        // Append the edit task modal HTML to the main board
        document.getElementById('mainBoard').innerHTML += taskCardEditHTML(task);

        // Close the task card overview without animation
        closeTaskCardOverviewWithoutAnimation();

        // Fill the selected assigned contacts for the task
        fillSelectedAssigned(taskId);

        // Set the date threshold for the task's due date
        dateTreshholdEdit(taskId);

        // Add event listeners for editing the task
        addTaskEditEventListeners(taskId);
    } else {
        // Log an error if the task is not found
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
    // Get the elements associated with the edit task modal
    let floatId = document.getElementById('taskCardEditBackgroundFloat');
    let removeBackground = document.getElementById('taskCardEditBackground');
    let overlay = document.getElementById('backgroundOverlayEdit');

    // Add the 'closing' class to trigger the closing animation
    floatId.classList.add('closing');

    // Listen for the end of the animation to remove the modal and overlay elements
    floatId.addEventListener('animationend', () => {
        removeBackground.remove(); // Remove the modal background element from the DOM
        overlay.remove(); // Remove the overlay element from the DOM
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
    // Find the task by its ID
    let task = tasks.find(t => t.id === taskId);

    // If the task is found, proceed to fill selectedAssigned and update the UI
    if (task) {
        // Fill the selectedAssigned array with the assigned contacts of the task
        selectedAssigned = task.assigned;

        // Iterate over the selectedAssigned contacts and update the UI for each
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
    // Get the elements associated with the contactId
    let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
    let contactName = document.getElementById(`contactName${contactId}`);
    let assignedItem = document.getElementById(`wrapper${contactId}`);

    // If the checkbox is checked, update the UI to reflect the selected state
    if (assignedCheckbox.checked) {
        assignedItem.style.backgroundColor = '#2A3647'; // Dark background for selected state
        contactName.style.color = '#fff'; // White text for better contrast
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobileChecked.png)'; // Checked checkbox image
    } else {
        // If the checkbox is not checked, update the UI to reflect the unselected state
        assignedItem.style.backgroundColor = '#fff'; // White background for unselected state
        contactName.style.color = '#000'; // Black text for normal visibility
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobile.png)'; // Unchecked checkbox image
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
    // Initialize the selectedAssigned array to hold selected contacts
    selectedAssigned = [];

    // Get all checkboxes with the class 'assignedCheckbox'
    let checkboxes = document.querySelectorAll('.assignedCheckbox');

    // Iterate over each checkbox to check if it is selected
    checkboxes.forEach(checkbox => {
        let contactId = checkbox.getAttribute('data-value');

        // If the checkbox is checked, find the corresponding contact
        if (checkbox.checked) {
            let contact = contacts.find(c => c.id === contactId);
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });

    // Update the input field with the names of the selected contacts
    let inputAssigned = document.getElementById('assigned' + taskId);
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';

    // Return the array of selected contact objects
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
    // Find the task by its ID
    const task = tasks.find(t => t.id === taskId);

    // If the task is found, proceed with deletion
    if (task) {
        // Remove the subtask at the specified index from the subtasks array
        task.subtasks.splice(subtaskIndex, 1);

        // Get the container element for the subtasks of the task
        const subtaskContainer = document.getElementById(`subtaskContainer${taskId}`);

        // If the container is found, update its HTML to reflect the remaining subtasks
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
    // Get the subtask input field by its class
    const inputField = document.querySelector('.subtaskInput');

    // Get the icons and separator elements by their IDs
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    // Enable the input field for editing
    inputField.readOnly = false;

    // Set focus on the input field
    inputField.focus();

    // Adjust the display properties of the icons and separator
    addIcon.style.display = 'none';  // Hide the add icon
    checkIcon.style.display = 'flex';  // Show the check icon
    closeIcon.style.display = 'flex';  // Show the close icon
    separator.style.display = 'flex';  // Show the separator
}


/**
 * Handles the UI changes when the subtask input field loses focus.
 *
 * This function sets the subtask input field to read-only and adjusts the visibility of 
 * various icons and separators associated with the subtask input. It is typically called 
 * after a subtask has been edited or added.
 */
function onBlurSubtaskInput() {
    // Get the subtask input field by its class
    const inputField = document.querySelector('.subtaskInput');

    // Get the icons and separator elements by their IDs
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    // Set the input field to read-only
    inputField.readOnly = true;

    // Adjust the display properties of the icons and separator
    addIcon.style.display = 'flex';  // Show the add icon
    checkIcon.style.display = 'none';  // Hide the check icon
    closeIcon.style.display = 'none';  // Hide the close icon
    separator.style.display = 'none';  // Hide the separator
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
    // Find the task by its ID
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }

    // Initialize subtasks array if it doesn't exist
    if (!task.subtasks) {
        task.subtasks = [];
    }

    // Get the subtask input field and retrieve the subtask name
    let subtaskInput = document.getElementById('subtask' + taskId);
    let subtaskName = subtaskInput.value.trim();

    // Check if the subtask name is empty
    if (subtaskName === '') {
        console.error('Subtask cannot be empty');
        return;
    }

    // Add the new subtask to the task's subtasks array
    task.subtasks.push({ name: subtaskName, completed: false });

    // Update the subtask list display
    let subtaskList = document.getElementById('subtaskContainer' + taskId);
    subtaskList.innerHTML = displaySubtasksHTML(task);

    // Clear the subtask input field
    subtaskInput.value = '';

    // Call onBlurSubtaskInput if it's defined as a function
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
    // Get the subtask input field by its ID using the taskId and subtaskIndex
    const subtaskInput = document.getElementById(`subtaskEditInput${taskId}-${subtaskIndex}`);

    // Remove the 'disabled' attribute to enable editing
    subtaskInput.removeAttribute('disabled');

    // Set focus on the input field for immediate editing
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
    // Get the subtask input field by its ID using the taskId
    let subtaskInput = document.getElementById('subtask' + taskId);

    // Clear the value of the subtask input field
    subtaskInput.value = '';

    // Call the function to handle further actions after the input loses focus
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
    // Extract existing subtasks from the current task, keeping their names and completed statuses
    let existingSubtasks = currentTask.subtasks.map(subtask => ({ name: subtask.name, completed: subtask.completed }));

    // Map new subtasks, setting completed status to false
    let newSubtasks = subtasks.map(subtask => ({ name: subtask, completed: false }));

    // Combine existing and new subtasks
    let combinedSubtasks = [...existingSubtasks, ...newSubtasks];

    // Return an object with the updated task data
    return {
        title: document.getElementById('title' + taskId).value,
        description: document.getElementById('description' + taskId).value,
        date: document.getElementById('date' + taskId).value,
        priority: getSelectedPriorityEditTask(taskId),
        category: currentTask.category,
        subtasks: combinedSubtasks,
        assigned: updateSelectedAssignedAndInputField(taskId),
        status: currentTask.status,
    };
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
    // Find the current task based on the taskId
    let currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }

    // Retrieve form data for the edited task
    let formData = getEditFormData(taskId, currentTask);

    // Map through the current subtasks and update their names if edited
    let editedSubtasks = currentTask.subtasks.map((subtask, index) => {
        let inputElement = document.getElementById(`subtaskEditInput${taskId}-${index}`);
        return {
            ...subtask,
            name: inputElement ? inputElement.value : subtask.name
        };
    });

    try {
        // Get the user ID
        let userId = await getUserId();

        if (!userId) {
            throw new Error('User ID not found');
        }

        // Send the updated task data to the server
        await putData(`/users/${userId}/tasks/${taskId}`, {
            title: formData.title,
            description: formData.description,
            assigned: formData.assigned,
            date: formData.date,
            priority: formData.priority,
            category: formData.category,
            subtasks: editedSubtasks,
            status: formData.status
        });

        // Close the edit task modal or view
        closeEditTask();

        // Reload the page to reflect changes
        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error);
    }

    // Update the board UI
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
    // Get all radio buttons for priorities associated with the taskId
    const priorities = document.getElementsByName(`priority${taskId}`);
    let selectedPriority = null; 

    // Find the radio button that is checked
    for (const priority of priorities) {
        if (priority.checked) {
            selectedPriority = priority;
            break;
        }
    }

    // If a priority is selected, retrieve its value and associated image source
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
    // Get the main board container element by its ID
    let main = document.getElementById('mainBoard');

    // Append the HTML for the new task to the main board
    main.innerHTML += addNewTaskOnBoardHtml(taskStatus);

    // Set the date threshold to prevent selection of past dates
    dateThreshold();

    // Add event listeners to the new task form and input fields
    addEventListeners();
}


/**
 * Adds event listeners to the task addition form and its input fields for handling form submission and key events.
 *
 * This function attaches event listeners to the form used for adding a new task and its associated input fields.
 * It prevents the default form submission behavior and provides functionality for handling 'Enter' key presses,
 * specifically adding subtasks when the 'Enter' key is pressed in the subtask input field.
 */
function addEventListeners() {
    // Get the form element for adding a new task by its ID
    const form = document.getElementById('addTaskForm');

    // Add an event listener to prevent the form's default submit behavior
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    }

    // Get all input fields related to task addition by their class names
    const inputFields = document.querySelectorAll('.addTaskInput, .addTaskDescription');

    // Add event listeners for keydown events on the input fields
    inputFields.forEach(input => {
        if (input) {
            input.addEventListener('keydown', function (event) {
                // Prevent default action if 'Enter' key is pressed
                if (event.key === 'Enter') {
                    event.preventDefault();

                    // If the input field is for adding a subtask, trigger the subtask addition function
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
    // Get the form element for the task edit form by its ID
    const form = document.getElementById(`editTaskForm${taskId}`);

    // Add an event listener to prevent the form's default submit behavior
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });
    }

    // Get all input fields related to the task by their IDs
    const inputFields = document.querySelectorAll(`#title${taskId}, #description${taskId}, #date${taskId}, #subtask${taskId}`);

    // Add event listeners for keydown events on the input fields
    inputFields.forEach(input => {
        if (input) {
            input.addEventListener('keydown', function (event) {
                // Prevent default action if 'Enter' key is pressed
                if (event.key === 'Enter') {
                    event.preventDefault();

                    // If the input field is a subtask field, trigger the subtask addition/editing function
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
    // Get the elements for the floating animation, task card, and overlay
    let float = document.getElementById('forAnimationFloating');
    let addTaskChard = document.getElementById('addTaskChard');
    let overlay = document.getElementById('backgroundOverlay');

    // Add a CSS class to start the closing animation
    float.classList.add('closing');

    // Listen for the end of the animation to remove the elements
    float.addEventListener('animationend', () => {
        addTaskChard.remove();  // Remove the "Add Task" card from the DOM
        overlay.remove();       // Remove the overlay from the DOM
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
        // Fetch the user data
        await getUser();

        // Retrieve the user ID based on the email stored in localStorage or guest status
        let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
        let guestLoggedIn = localStorage.getItem('guestLoggedIn');
        userId = guestLoggedIn === 'true' ? '-O-Mr5g8976g5-yCxVK8' : userId.id;

        // Find the task by its ID
        let task = tasks.find(task => task.id === taskId);
        if (!task) {
            console.error('Task not found');
            return;
        }

        // Toggle the completed status of the specified subtask
        task.subtasks[subtaskIndex].completed = !task.subtasks[subtaskIndex].completed;

        // Update the task data on the server
        await putData(`/users/${userId}/tasks/${taskId}`, {
            ...task
        });

        // Calculate the progress percentage and update the progress bar
        let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        let progressPercentage = (completedSubtasks / task.subtasks.length) * 100;
        document.getElementById(`progressbar${task.id}`).style.width = `${progressPercentage}%`;

        // Update the tasks array with the modified task
        tasks = tasks.map(t => t.id === taskId ? task : t);
    } catch (error) {
        console.error('Error toggling subtask:', error);
    }

    // Update the board HTML to reflect the changes
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
    // Get the main board container element by its ID
    let mainContainer = document.getElementById('mainBoard');

    // Append the success message HTML to the main container
    mainContainer.innerHTML += successfullyTaskDesktopHtml();

    // Set a timeout to remove the success message and overlay after 900 milliseconds
    setTimeout(() => {
        document.getElementById('background').remove();
        document.getElementById('backgroundOverlay').remove();
    }, 900);
};