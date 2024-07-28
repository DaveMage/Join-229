/**
 * Initializes the task addition process by setting up the template, loading contacts, and setting the date threshold.
 *
 * This asynchronous function performs several initialization tasks necessary for adding a new task.
 * It sets up the task template, fetches contact data, and sets the minimum date for the due date input.
 */
async function addTaskInit() {
    templateInit();
    await getContacts();
    dateThreshold();
};


/**
 * Toggles the visibility of the assigned dropdown menu and rotates the dropdown arrow icon.
 *
 * This function toggles the display of the assigned dropdown menu and rotates the associated
 * dropdown arrow icon to indicate whether the menu is open or closed. It also attaches or removes
 * a click event listener to close the dropdown when clicking outside of it. Additionally, it refreshes
 * the content of the dropdown by calling `displayAssignedTo()` and `setCheckedAssigned()`.
 */
function toggleAssignedDropdown() {
    let dropdown = document.getElementById('dropdownAssigned');
    let icon = document.getElementById('assignedDropdownArrow');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', handleClickOutside);
    } else {
        dropdown.style.display = 'flex';
        icon.style.transform = 'rotate(180deg)';

        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);
    }
    displayAssignedTo();
    setCheckedAssigned();
};


/**
 * Handles clicks outside the dropdown menu, icon, and input field to close the dropdown.
 *
 * This function checks if a click event occurred outside the specified dropdown menu, the dropdown
 * arrow icon, and the input field. If the click is outside these elements, it hides the dropdown menu,
 * resets the icon's rotation, and removes the event listener for further clicks.
 *
 * @param {Event} event - The click event object.
 */
function handleClickOutside(event) {
    let dropdown = document.getElementById('dropdownAssigned');
    let icon = document.getElementById('assignedDropdownArrow');
    let input = document.getElementById('addTaskFormAssignedInput');

    if (!dropdown.contains(event.target) && !icon.contains(event.target) && !input.contains(event.target)) {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', handleClickOutside);
    }
}


/**
 * Toggles the display of the category dropdown menu and rotates the dropdown arrow icon.
 *
 * This function toggles the visibility of the category dropdown menu. It changes the display
 * style between 'flex' and 'none', and rotates the dropdown arrow icon to indicate the state
 * of the dropdown (expanded or collapsed).
 */
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


/**
 * Sets the minimum date for the due date input field to today's date.
 *
 * This function ensures that the user cannot select a past date for the task's due date.
 * It retrieves the current date and sets it as the minimum allowable date in the due date input field.
 */
function dateThreshold() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("addTaskDueDate").setAttribute('min', today);
}


/**
 * Retrieves the selected priority from the available priority options.
 *
 * This function identifies the selected priority level from a group of radio buttons
 * named 'priority'. It returns an object containing the value of the selected priority
 * and the source of the associated image, if a priority is selected.
 *
 * @return {Object|null} An object containing the selected priority value and image source,
 *                       or null if no priority is selected.
 */
function getSelectedPriority() {
    const priorities = document.getElementsByName('priority');
    let selectedPriority = null;

    for (const priority of priorities) {
        if (priority.checked) {
            selectedPriority = priority;
            break;
        }
    }

    if (selectedPriority) {
        const priorityValue = selectedPriority.value;
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`);
        const priorityImgSrc = priorityLabel.querySelector('img').src;

        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }
    return null;
}


/**
 * Retrieves the selected priority for a specific task during editing.
 *
 * This function finds the selected priority level for a task being edited based on
 * the radio buttons with names specific to the task ID. It returns an object containing
 * the value of the selected priority and the source of the associated image, if a priority
 * is selected.
 *
 * @param {string} taskId - The unique identifier for the task.
 * @return {Object|null} An object containing the selected priority value and image source,
 *                       or null if no priority is selected.
 */
function getSelectedPriorityEditTask(taskId) {
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
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`);
        const priorityImgSrc = priorityLabel.querySelector('img').src;

        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }
    return null;
}


/**
 * Sets the selected category in the input field based on the user's selection.
 *
 * This function updates the category input field with the text content of the selected category
 * element. It is typically called when a user selects a category from a list or dropdown menu.
 *
 * @param {HTMLElement} element - The HTML element representing the selected category.
 */
function selectCategory(element) {
    const categoryInput = document.getElementById('addTaskCategory');
    categoryInput.value = element.textContent.trim();
}


/**
 * Displays a list of assigned contact items in a dropdown menu.
 *
 * This function populates the dropdown container with HTML representations of each contact.
 * It iterates through the `contacts` array and uses the `assignedItemHtml` function to generate
 * the necessary HTML for each contact, which is then added to the dropdown container.
 */
function displayAssignedTo() {
    let container = document.getElementById('dropdownAssigned');
    container.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        container.innerHTML += assignedItemHtml(contacts[i]);
    }
}


/**
 * Generates the HTML for a dropdown item representing an assigned contact.
 *
 * This function returns a string of HTML representing a contact item in a dropdown list.
 * It includes the contact's profile icon, name, and a checkbox for selecting the contact.
 * The checkbox triggers functions to update the UI and selection state when checked or unchecked.
 *
 * @param {Object} contact - The contact object containing information about the contact.
 * @param {string} contact.id - The unique identifier for the contact.
 * @param {string} contact.profileColor - The background color for the contact's profile icon.
 * @param {string} contact.initials - The initials to display in the contact's profile icon.
 * @param {string} contact.name - The full name of the contact.
 * @return {string} HTML string representing the assigned contact item.
 */
function assignedItemHtml(contact) {
    return /*html*/ `
        <label class="dropdownItemAssigned" id="label${contact.id}" for="addTaskFromAssignedCheckbox${contact.id}">
            <div class="profileNameContainer">
                <div class="profileIconAssigned" style="background-color: ${contact.profileColor};">
                    ${contact.initials}
                </div>
                <span id="name${contact.id}" class="assignedName" data-value="${contact.name}">
                    ${contact.name}
                </span>
            </div>
            <input
                id="addTaskFromAssignedCheckbox${contact.id}"
                type="checkbox"
                class="checkboxAssigned"
                onchange="assignedItemCheckBackgroundColor(this, 'name${contact.id}'); selectAssigned()"/>
        </label>`;
}


/**
 * Updates the background color and text color of an assigned item based on the checkbox state.
 *
 * This function changes the background color of the assigned item and the text color of the associated
 * name element based on whether the checkbox is checked or not. If the checkbox is checked, the background
 * becomes dark and the text color turns white; otherwise, the background becomes white and the text color
 * reverts to the default.
 *
 * @param {HTMLInputElement} checkbox - The checkbox element associated with the assigned item.
 * @param {string} nameId - The ID of the name element associated with the assigned item.
 */
function assignedItemCheckBackgroundColor(checkbox, nameId) {
    const label = checkbox.closest('.dropdownItemAssigned');
    const name = document.getElementById(nameId);

    if (checkbox.checked) {
        label.style.backgroundColor = '#2A3647';
        name.classList.add('nameWhite');
    } else {
        label.style.backgroundColor = 'white';
        name.classList.remove('nameWhite');
    }
}


/**
 * Sets the checked state of checkboxes based on the `selectedAssigned` array and updates the UI.
 *
 * This function iterates through all checkboxes with the class 'checkboxAssigned'. For each checkbox,
 * it determines if the associated contact name is in the `selectedAssigned` array and sets the checkbox
 * state accordingly. It also calls a function to update the background color of the assigned items
 * based on their checked state.
 */
function setCheckedAssigned() {
    let checkboxes = document.querySelectorAll('.checkboxAssigned');

    checkboxes.forEach(checkbox => {
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');
        let isSelected = selectedAssigned.some(contact => contact.name === contactName);
        checkbox.checked = isSelected;
        assignedItemCheckBackgroundColor(checkbox, checkbox.parentNode.querySelector('.assignedName').id);
    });
}


/**
 * Updates the list of selected assigned contacts based on the checked checkboxes.
 *
 * This function iterates through all checkboxes with the class 'checkboxAssigned'. It checks which
 * checkboxes are selected and updates the `selectedAssigned` array with the corresponding contacts
 * from the `contacts` array. It also updates the input field displaying the names of the assigned
 * contacts.
 *
 * @return {Array} Returns the array of selected contacts.
 */
function selectAssigned() {
    selectedAssigned = [];

    let checkboxes = document.querySelectorAll('.checkboxAssigned');
    checkboxes.forEach(checkbox => {
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');

        if (checkbox.checked) {
            let contact = contacts.find(c => c.name === contactName);
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });
    let inputAssigned = document.getElementById('addTaskFormAssignedInput');
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';

    return selectedAssigned;
}


/**
 * Validates the title input field and displays an error message if it's empty.
 *
 * This function checks if the title input field is empty. If it is, it adds an error style
 * to the input field and displays an error message. If the input field is not empty, it removes
 * the error styles and hides the error message.
 *
 * @return {boolean} Returns false if the title is not provided, true otherwise.
 */
function titlequery() {
    let title = document.getElementById("addTaskTitle");

    if (title.value === "") {
        title.classList.add('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'block';
        return false;
    } else {
        title.classList.remove('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'none';
    }
    return true;
}


/**
 * Validates the due date input field and displays an error message if it's empty.
 *
 * This function checks if the due date input field is empty. If it is, it adds an error style
 * to the input field and displays an error message. If the input field is not empty, it removes
 * the error styles and hides the error message.
 *
 * @return {boolean} Returns false if the due date is not provided, true otherwise.
 */
function datequery() {
    let date = document.getElementById("addTaskDueDate");
    if (date.value === "") {
        date.classList.add('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'block';
        return false;
    } else {
        date.classList.remove('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'none';
    }
    return true;
}


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