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


/**
 * Closes the 'Move To' menu for a given task by removing the menu element from the DOM.
 *
 * @param {string} taskId - The ID of the task for which the 'Move To' menu should be closed.
 */
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

    toDo.innerHTML = '';
    inProgress.innerHTML = '';
    awaitFeedback.innerHTML = '';
    done.innerHTML = '';

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
    userId = await getUserId();
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