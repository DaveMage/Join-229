
/**
 * Activates the subtask input field for editing and adjusts the visibility of related icons.
 *
 * This function makes the subtask input field editable and sets the focus on it.
 * It also updates the display of various icons to reflect the active editing state.
 */
function focusSubtaskInput() {
    const inputField = document.querySelector('#addTaskSubtask');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeparator');

    inputField.readOnly = false;
    inputField.focus();

    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';
    separator.style.display = 'flex';
}


/**
 * Activates the editing mode for a subtask input field and displays corresponding icons.
 *
 * This function is called when the user starts editing a subtask.
 * It makes the input field editable, sets the focus on it, and displays the
 * icons for confirming or canceling the editing process.
 *
 * @param {string | number} task - The ID or unique identifier of the task to which the subtask belongs.
 */
function focusEditSubtaskInput(task) {
    const inputField = document.querySelector(`#subtask${task}`);
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeparator');

    inputField.readOnly = false;
    inputField.focus();

    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';
    separator.style.display = 'flex';
}


/**
 * Clears the subtask input field and updates the UI elements associated with it.
 *
 * This function clears the value of the subtask input field, sets it to read-only,
 * and adjusts the visibility and functionality of related icons and separators.
 * It typically signals the end of the subtask input process.
 */
function deleteValueSubtask() {
    let subtaskInput = document.getElementById('addTaskSubtask');
    let firstSubtaskIcon = document.getElementById('firstSubtaskIcon');
    let secondSubtaskIcon = document.getElementById('secondSubtaskIcon');

    subtaskInput.value = '';
    subtaskInput.setAttribute('readonly', 'readonly');
    firstSubtaskIcon.src = './img/Mobile/AddTask/addIconAddTask.png';
    firstSubtaskIcon.setAttribute('onclick', 'activateSubtaskInput()');
    secondSubtaskIcon.style.display = 'none';
    document.getElementById('subtaskInputSeperator').style.display = 'none';
}


/**
 * Handles the UI changes when the subtask input field loses focus.
 *
 * This function is called when the subtask input field loses focus, either after adding
 * a subtask or canceling the input. It sets the input field to read-only and adjusts the
 * display of various icons and separators to reflect the inactive state of the input field.
 */
function onBlurSubtaskInput() {
    const inputField = document.querySelector('#addTaskSubtask');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeparator');

    if (inputField != null) {
        inputField.readOnly = true;
    }

    addIcon.style.display = 'flex';
    checkIcon.style.display = 'none';
    closeIcon.style.display = 'none';
    separator.style.display = 'none';
}


/**
 * Adds a new subtask item to the list and updates the display.
 *
 * This function reads the value from the subtask input field, adds it to the
 * `subtasks` array if it's not empty, and then updates the display of all subtasks
 * by generating the appropriate HTML. It also clears the input field and performs
 * additional actions defined in `onBlurSubtaskInput()`.
 */
function addSubtaskItem() {
    let subtaskInput = document.getElementById('addTaskSubtask');

    if (subtaskInput.value === '') {
        return;
    }
    subtasks.push(subtaskInput.value);
    document.getElementById('subtaskContainer').innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        document.getElementById('subtaskContainer').innerHTML += addSubtaskItemHTML(i);
    }
    subtaskInput.value = '';
    onBlurSubtaskInput();
}


/**
 * Generates the HTML string for displaying a subtask item.
 *
 * This function creates and returns an HTML string that represents a subtask item,
 * including an input field for the subtask, and icons for editing and deleting the subtask.
 *
 * @return {string} HTML string representing a subtask item.
 */
function addSubtaskItemHTML(i) {
    return /*html*/ `
    <li class="addTaskSubtaskItem">
        <input type="text" class="subtaskItemInput" value="${subtasks[i]}" readonly>
        <div class="subtaskItemIconContainer">
            <img src="./img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon" onclick="editSubtaskItem(event)">
            <span class="subtaskSeperator"></span>
            <img src="./img/Mobile/AddTask/trashIcon.png" alt="Delete Icon" class="subtaskItemIcon" id="subtaskItemRightIcon" onclick="deleteSubtaskItem(event)">
        </div>
    </li>
    `;
}


/**
 * Clears the input field for adding a new subtask and triggers additional cleanup.
 *
 * This function clears the value of the subtask input field and then calls an additional function
 * `onBlurSubtaskInput` to handle any further actions needed after clearing the input.
 */
function emptySubtaskInput() {
    let subtaskInput = document.getElementById('addTaskSubtask');
    subtaskInput.value = '';
    onBlurSubtaskInput();
}


/**
 * Deletes a subtask item from the DOM and removes it from the subtasks array.
 *
 * This function is triggered when the user chooses to delete a subtask item.
 * It removes the subtask item from the DOM and also removes the corresponding
 * value from the `subtasks` array to keep the data consistent.
 *
 * @param {Event} event - The event object from the delete action, typically triggered by a button click.
 */
function deleteSubtaskItem(event) {
    let subtaskItem = event.target.closest('.addTaskSubtaskItem');
    let subtaskItemValue = subtaskItem.querySelector('.subtaskItemInput').value;
    subtasks = subtasks.filter(subtask => subtask !== subtaskItemValue);
    subtaskItem.remove();
}


/**
 * Enables editing of a subtask item and updates the icons to save and delete.
 *
 * This function is triggered when the user chooses to edit a subtask item.
 * It makes the input field editable, focuses on it, and updates the icons to
 * allow the user to save or delete the subtask.
 *
 * @param {Event} event - The event object from the edit action, typically triggered by a button click.
 */
function editSubtaskItem(event) {
    let subtaskItem = event.target.closest('.addTaskSubtaskItem');
    let leftIcon = subtaskItem.querySelector('#subtaskItemLeftIcon');
    let rightIcon = subtaskItem.querySelector('#subtaskItemRightIcon');
    let subtaskItemInput = subtaskItem.querySelector('.subtaskItemInput');

    subtaskItemInput.removeAttribute('readonly');
    subtaskItemInput.focus();
    subtasks = subtasks.filter(subtask => subtask !== subtaskItemInput.value);
    subtasks.splice(0, 0, subtaskItemInput.value);
    leftIcon.src = './img/Mobile/AddTask/trashIcon.png';
    leftIcon.setAttribute('onclick', 'deleteSubtaskItem(event)');
    rightIcon.src = './img/Mobile/AddTask/checkIcon.png';
    rightIcon.setAttribute('onclick', 'saveSubtaskItem(event)');
}


/**
 * Saves the updated value of a subtask item and changes its icons to edit and delete.
 *
 * This function is triggered when a subtask item is saved. It updates the subtask's value in the
 * `subtasks` array, sets the input field to readonly, and changes the left and right icons to
 * edit and delete icons respectively, allowing further actions on the subtask.
 *
 * @param {Event} event - The event object from the save action, typically triggered by a button click.
 */
function saveSubtaskItem(event) {
    const subtaskItem = event.target.closest('.addTaskSubtaskItem');
    const leftIcon = subtaskItem.querySelector('#subtaskItemLeftIcon');
    const rightIcon = subtaskItem.querySelector('#subtaskItemRightIcon');
    const subtaskItemInput = subtaskItem.querySelector('.subtaskItemInput');
    const subtaskId = subtaskItem.dataset.id;

    const subtaskIndex = subtasks.findIndex(subtask => subtask.id === subtaskId);
    if (subtaskIndex !== -1) {
        subtasks[subtaskIndex] = subtaskItemInput.value;
    }

    subtaskItemInput.setAttribute('readonly', 'readonly');

    leftIcon.src = './img/Mobile/AddTask/editIcon.png';
    leftIcon.setAttribute('onclick', 'editSubtaskItem(event)');
    rightIcon.src = './img/Mobile/AddTask/trashIcon.png';
    rightIcon.setAttribute('onclick', 'deleteSubtaskItem(event)');
}


/**
 * Clears the form inputs and resets the task creation form to its default state.
 *
 * This function is used to clear all input fields and reset the form elements related to task creation.
 * It resets text inputs, selects, checkboxes, and arrays that track user selections.
 */
function clearForm() {
    document.getElementById('addTaskFormAssignedInput').value = '';
    selectedAssigned = [];

    document.getElementById('addTaskTitle').value = '';
    document.getElementById('addTaskDueDate').value = '';
    document.getElementById('addTaskDescription').value = '';
    document.getElementById('addTaskCategory').value = '';
    document.getElementById('addTaskSubtask').value = '';
    document.getElementById('addTaskFormAssignedInput').value = '';

    subtasks = [];
    document.getElementById('subtaskContainer').innerHTML = '';
    document.getElementById('medium').checked = true;
}


/**
 * Generates the HTML content for a success message indicating a new task has been added to the board.
 *
 * This function creates and returns a string containing HTML elements that visually indicate
 * that a new task has been successfully added to the board. The generated content includes
 * a background overlay and a message box with a headline and an image.
 *
 * @return {string} HTML string representing the success message.
 */
function successfullyNewTask() {
    return `
        <div class="backGroundNewTask" id="newTaskBGMessage">
          <div class="addToBoard taskSlideIn" id="createBoardItem">
            <h1 class="addToBoardHeadline">Task added to board</h1>
            <img src="./img/Mobile/AddTask/addTaskBoardIcons.png" alt="board">
          </div>
        </div>
    `;
}


/**
 * Displays a success message for a new task and redirects to the board page after a short delay.
 *
 * This function appends a success message to the main container, then removes it after a brief
 * period and redirects the user to the board page.
 */
function displaySuccsessfullyMessage() {
    let mainContainer = document.getElementById('mainContainerId');
    mainContainer.innerHTML += successfullyNewTask();

    setTimeout(() => {
        document.getElementById('newTaskBGMessage').remove();
        window.location.href = '/board.html';
    }, 900);
}


document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('addTask.html')) {
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
})
