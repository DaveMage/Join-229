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
            displayTaskCard();
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
            displayTaskCard();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
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