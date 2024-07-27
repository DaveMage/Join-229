let currentDraggedElement = null;


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
};


function dateTreshholdEdit(taskId) {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById(`date${taskId}`).setAttribute('min', today);
};


function addActiveClass() {
    document.getElementById('searchBar').classList.add('inputActive');
    document.getElementById('searchBarDesktop').classList.add('inputActive');
};


function removeActiveClass() {
    document.getElementById('searchBar').classList.remove('inputActive');
    document.getElementById('searchBarDesktop').classList.remove('inputActive');
};


function allowDrop(ev) {
    ev.preventDefault();
};


function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId);
    currentDraggedElement = taskId;
};


async function moveTo(status) {
    await getUser();
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = user ? user.id : '-O-Mr5g8976g5-yCxVK8';
    const task = tasks.find(t => t.id === currentDraggedElement);
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }

    if (task) {
        task.status = status;
        updateBoardHtml();
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task);
    } else {
        console.error('Task not found with ID:', currentDraggedElement);
    }
};


/**
 * Updates the HTML representation of the board based on the tasks' statuses.
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
};


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
};


function showEmptyWarning(toDo, inProgress, awaitFeedback, done) {
    if (toDo.innerHTML == '' && inProgress.innerHTML == '' && awaitFeedback.innerHTML == '' && done.innerHTML == '') {
        document.getElementById('noSearchResults').classList.add('d-block');
    } else {
        document.getElementById('noSearchResults').classList.remove('d-block');
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
    let floatId = document.getElementById('taskCardOverviewBodyId');
    let removeBackground = document.getElementById('taskCardOverviewBackground');
    let overlay = document.getElementById('backgroundOverlay');

    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        removeBackground.remove();
        overlay.remove();
    });
};


function closeTaskCardOverviewWithoutAnimation() {
    document.getElementById('taskCardOverviewBackground').remove();
    document.getElementById('backgroundOverlay').remove();
};


async function deleteTask(taskId) {
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    userId = users.id;
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    }
    if (!userId) {
        console.error('User not found');
        return;
    }
    try {
        await deleteData('/users/' + userId + '/tasks/' + taskId);
        closeTaskCardOverview();
        window.location.reload();
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
};


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
};


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
        closeTaskCardOverviewWithoutAnimation();
        fillSelectedAssigned(taskId);
        dateTreshholdEdit(taskId);
        addTaskEditEventListeners(taskId);
    } else {
        console.error('Task not found with ID:', taskId);
    }
};


function closeEditTask() {
    let floatId = document.getElementById('taskCardEditBackgroundFloat');
    let removeBackground = document.getElementById('taskCardEditBackground');
    let overlay = document.getElementById('backgroundOverlayEdit');

    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        removeBackground.remove();
        overlay.remove();
    });
};


function fillSelectedAssigned(taskId) {
    let task = tasks.find(t => t.id === taskId);
    if (task) {
        selectedAssigned = task.assigned;
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
    } else {
        assignedItem.style.backgroundColor = '#fff';
        contactName.style.color = '#000';
        assignedCheckbox.style.backgroundImage = 'url(./img/Mobile/Board/checkButtonMobile.png)';
    }
};


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
};


function deleteSubtask(taskId, subtaskIndex) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.subtasks.splice(subtaskIndex, 1);
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
};


function editSubtask(taskId, subtaskIndex) {
    const subtaskInput = document.getElementById(`subtaskEditInput${taskId}-${subtaskIndex}`);
    subtaskInput.removeAttribute('disabled');
    subtaskInput.focus();
};


function emptySubtaskInput(taskId) {
    let subtaskInput = document.getElementById('subtask' + taskId);
    subtaskInput.value = '';
    onBlurSubtaskInput();
};


function getEditFormData(taskId, currentTask) {
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
    };
};


async function saveEditTask(taskId) {
    let currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) {
        console.error(`Task with id ${taskId} not found`);
        return;
    }
    let formData = getEditFormData(taskId, currentTask);
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
            priority: formData.priority,
            category: formData.category,
            subtasks: editedSubtasks,
            status: formData.status
        });
        closeEditTask();
        window.location.reload();
    } catch (error) {
        console.error('Error updating task:', error);
    }
    updateBoardHtml();
};



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
};


function goToAddTask() {
    window.location.href = '/addTask.html';
};


function addNewTaskOnBoard(taskStatus) {
    let main = document.getElementById('mainBoard');
    main.innerHTML += addNewTaskOnBoardHtml(taskStatus);
    dateTreshhold();
    addEventListeners();
};


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
};


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
};


function closeAddTaskOnBoard() {
    let float = document.getElementById('forAnimationFloating');
    let addTaskChard = document.getElementById('addTaskChard');
    let overlay = document.getElementById('backgroundOverlay');
    float.classList.add('closing');
    float.addEventListener('animationend', () => {
        addTaskChard.remove();
        overlay.remove();
    });
};


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
};


function displaySuccsessfullyBoardMessage() {
    let mainContainer = document.getElementById('mainBoard');
    mainContainer.innerHTML += successfullyTaskDesktopHtml();
    setTimeout(() => {
        document.getElementById('background').remove();
        document.getElementById('backgroundOverlay').remove();
    }, 900);
};