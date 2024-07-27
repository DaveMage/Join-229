/**
 * Initializes the task addition process by setting up the template, loading contacts, and setting the date threshold.
 *
 * This asynchronous function performs several initialization tasks necessary for adding a new task.
 * It sets up the task template, fetches contact data, and sets the minimum date for the due date input.
 */
async function addTaskInit() {
    // Initialize the task template
    templateInit();

    // Fetch contact data asynchronously
    await getContacts();

    // Set the minimum allowable date for the task due date
    dateThreshold();
}


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
        // Hide the dropdown and reset the icon rotation
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', handleClickOutside);
    } else {
        // Show the dropdown and rotate the icon
        dropdown.style.display = 'flex';
        icon.style.transform = 'rotate(180deg)';

        // Add an event listener to close the dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0); 
    }

    // Refresh the content of the dropdown
    displayAssignedTo();
    setCheckedAssigned();
}


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
    // Get the dropdown menu element by its ID
    let dropdown = document.getElementById('dropdownAssigned');

    // Get the dropdown arrow icon element by its ID
    let icon = document.getElementById('assignedDropdownArrow');

    // Get the input field element by its ID
    let input = document.getElementById('addTaskFormAssignedInput');

    // Check if the click was outside the dropdown, icon, and input elements
    if (!dropdown.contains(event.target) && !icon.contains(event.target) && !input.contains(event.target)) {
        // Hide the dropdown menu and reset the icon rotation
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';

        // Remove the click event listener to stop further handling
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
    // Get the dropdown menu element by its ID
    const dropdown = document.getElementById('dropdownCategory');

    // Get the dropdown arrow icon element by its ID
    let icon = document.getElementById('categoryDropdownArrow');

    // Check the current display style of the dropdown menu and toggle it
    if (dropdown.style.display === 'flex') {
        // If the dropdown is currently visible, hide it and reset the arrow icon
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        // If the dropdown is currently hidden, show it and rotate the arrow icon
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
    // Get today's date in YYYY-MM-DD format
    let today = new Date().toISOString().split('T')[0];

    // Set the minimum attribute of the due date input field to today's date
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
    // Get all radio buttons for priority selection
    const priorities = document.getElementsByName('priority');
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
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`);
        const priorityImgSrc = priorityLabel.querySelector('img').src;

        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }

    // Return null if no priority is selected
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
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`);
        const priorityImgSrc = priorityLabel.querySelector('img').src;

        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }

    // Return null if no priority is selected
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
    // Get the category input field where the selected category will be displayed
    const categoryInput = document.getElementById('addTaskCategory');

    // Set the value of the category input field to the trimmed text content of the selected element
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
    // Get the container element where assigned items will be displayed
    let container = document.getElementById('dropdownAssigned');

    // Clear any existing content in the container
    container.innerHTML = '';

    // Iterate through the contacts array and generate HTML for each contact
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
                onchange="assignedItemChackBackgroundColor(this, 'name${contact.id}'); selectAssigned()"/>
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
    // Get the label element closest to the checkbox with the class 'dropdownItemAssigned'
    const label = checkbox.closest('.dropdownItemAssigned');
    
    // Get the name element by its ID
    const name = document.getElementById(nameId);

    // Update the background and text color based on the checkbox state
    if (checkbox.checked) {
        label.style.backgroundColor = '#2A3647'; // Set background color to dark
        name.classList.add('nameWhite'); // Add class to change text color to white
    } else {
        label.style.backgroundColor = 'white'; // Set background color to white
        name.classList.remove('nameWhite'); // Remove class to revert text color
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
    // Get all checkboxes with the class 'checkboxAssigned'
    let checkboxes = document.querySelectorAll('.checkboxAssigned');

    // Iterate through each checkbox
    checkboxes.forEach(checkbox => {
        // Get the contact name associated with the checkbox
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');

        // Check if the contact name is in the selectedAssigned array
        let isSelected = selectedAssigned.some(contact => contact.name === contactName);

        // Set the checked state of the checkbox based on whether the contact is selected
        checkbox.checked = isSelected;

        // Update the background color of the assigned item
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
    selectedAssigned = []; // Reset the selectedAssigned array

    // Get all checkboxes with the class 'checkboxAssigned'
    let checkboxes = document.querySelectorAll('.checkboxAssigned');

    // Iterate through each checkbox
    checkboxes.forEach(checkbox => {
        // Get the contact name associated with the checkbox
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');

        // If the checkbox is checked, find the contact and add to the selectedAssigned array
        if (checkbox.checked) {
            let contact = contacts.find(c => c.name === contactName);
            if (contact) {
                selectedAssigned.push(contact);
            }
        }
    });

    // Update the input field with the names of the selected contacts
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

    // Check if the title input field is empty
    if (title.value === "") {
        // Add error styling to the input field and show the error message
        title.classList.add('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'block';
        return false;
    } else {
        // Remove error styling from the input field and hide the error message
        title.classList.remove('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'none';
    }
    return true; // Added return statement for completeness
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

    // Check if the due date input field is empty
    if (date.value === "") {
        // Add error styling to the input field and show the error message
        date.classList.add('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'block';
        return false;
    } else {
        // Remove error styling from the input field and hide the error message
        date.classList.remove('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'none';
    }
    return true; // Added return statement for completeness
}


/**
 * Activates the subtask input field for editing and adjusts the visibility of related icons.
 *
 * This function makes the subtask input field editable and sets the focus on it.
 * It also updates the display of various icons to reflect the active editing state.
 */
function focusSubtaskInput() {
    // Get the subtask input field and related icons by their IDs
    const inputField = document.querySelector('#addTaskSubtask');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    // Make the input field editable and set focus on it
    inputField.readOnly = false;
    inputField.focus();

    // Hide the add icon and show the check and close icons
    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';

    // Show the separator
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
    // Get the subtask input field and icons by their IDs
    let subtaskInput = document.getElementById('addTaskSubtask');
    let firstSubtaskIcon = document.getElementById('firstSubtaskIcon');
    let secondSubtaskIcon = document.getElementById('secondSubtaskIcon');

    // Clear the value of the subtask input field and set it to read-only
    subtaskInput.value = '';
    subtaskInput.setAttribute('readonly', 'readonly');

    // Update the first icon to the add icon and set its click event to activate the subtask input
    firstSubtaskIcon.src = './img/Mobile/AddTask/addIconAddTask.png';
    firstSubtaskIcon.setAttribute('onclick', 'activateSubtaskInput()');

    // Hide the second icon and the separator
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
    // Get the subtask input field by its ID
    const inputField = document.querySelector('#addTaskSubtask');
    
    // Get the UI elements related to the subtask input field
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeperator');

    // If the input field exists, set it to read-only
    if (inputField != null) {
        inputField.readOnly = true;
    }

    // Adjust the display properties of the icons and separator
    addIcon.style.display = 'flex';  // Show the add icon
    checkIcon.style.display = 'none';  // Hide the check icon
    closeIcon.style.display = 'none';  // Hide the close icon
    separator.style.display = 'none';  // Hide the separator
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

    // If the subtask input field is empty, exit the function early
    if (subtaskInput.value === '') {
        return;
    }

    // Add the input value to the subtasks array
    subtasks.push(subtaskInput.value);

    // Clear the existing subtask items in the subtask container
    document.getElementById('subtaskContainer').innerHTML = '';

    // Loop through the subtasks array and generate the HTML for each subtask
    for (let i = 0; i < subtasks.length; i++) {
        document.getElementById('subtaskContainer').innerHTML += addSubtaskItemHTML();
    }

    // Clear the input field after adding the subtask
    subtaskInput.value = '';

    // Call the onBlurSubtaskInput function for any additional actions needed
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
function addSubtaskItemHTML() {
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
    // Get the input field for adding a new subtask by its ID
    let subtaskInput = document.getElementById('addTaskSubtask');

    // Clear the value of the subtask input field
    subtaskInput.value = '';

    // Call the function to handle further actions after the input loses focus
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
    // Get the closest parent element with the class 'addTaskSubtaskItem'
    let subtaskItem = event.target.closest('.addTaskSubtaskItem');

    // Retrieve the value of the subtask item input
    let subtaskItemValue = subtaskItem.querySelector('.subtaskItemInput').value;

    // Remove the subtask value from the subtasks array
    subtasks = subtasks.filter(subtask => subtask !== subtaskItemValue);

    // Remove the subtask item from the DOM
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
    // Get the closest parent element with the class 'addTaskSubtaskItem'
    let subtaskItem = event.target.closest('.addTaskSubtaskItem');

    // Find the icons and input within the subtask item
    let leftIcon = subtaskItem.querySelector('#subtaskItemLeftIcon');
    let rightIcon = subtaskItem.querySelector('#subtaskItemRightIcon');
    let subtaskItemInput = subtaskItem.querySelector('.subtaskItemInput');

    // Make the input field editable and focus on it
    subtaskItemInput.removeAttribute('readonly');
    subtaskItemInput.focus();

    // Remove the current value from the subtasks array
    subtasks = subtasks.filter(subtask => subtask !== subtaskItemInput.value);

    // Add the current value to the beginning of the subtasks array
    subtasks.splice(0, 0, subtaskItemInput.value);

    // Update the icons to reflect the save and delete actions
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
    // Get the closest parent element with the class 'addTaskSubtaskItem'
    const subtaskItem = event.target.closest('.addTaskSubtaskItem');

    // Find the icons and input within the subtask item
    const leftIcon = subtaskItem.querySelector('#subtaskItemLeftIcon');
    const rightIcon = subtaskItem.querySelector('#subtaskItemRightIcon');
    const subtaskItemInput = subtaskItem.querySelector('.subtaskItemInput');
    const subtaskId = subtaskItem.dataset.id; // Get the unique identifier of the subtask

    // Find the index of the subtask in the subtasks array and update its value
    const subtaskIndex = subtasks.findIndex(subtask => subtask.id === subtaskId);
    if (subtaskIndex !== -1) {
        subtasks[subtaskIndex] = subtaskItemInput.value;
    }

    // Set the input field to readonly to prevent further editing
    subtaskItemInput.setAttribute('readonly', 'readonly');

    // Update the icons to reflect that the subtask can now be edited or deleted
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
    // Clear the assigned input field and reset the selected assigned users array
    document.getElementById('addTaskFormAssignedInput').value = '';
    selectedAssigned = [];

    // Clear the task title input field
    document.getElementById('addTaskTitle').value = '';

    // Clear the due date input field
    document.getElementById('addTaskDueDate').value = '';

    // Clear the task description input field
    document.getElementById('addTaskDescription').value = '';

    // Clear the category input field
    document.getElementById('addTaskCategory').value = '';

    // Clear the subtask input field
    document.getElementById('addTaskSubtask').value = '';

    // Clear the assigned input field (duplicate, safe to keep for completeness)
    document.getElementById('addTaskFormAssignedInput').value = '';

    // Clear the subtasks array and the subtask container in the DOM
    subtasks = [];
    document.getElementById('subtaskContainer').innerHTML = '';

    // Set the default priority level (medium) checkbox to checked
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
    // Selects the main container element by its ID
    let mainContainer = document.getElementById('mainContainerId');

    // Appends the success message to the main container
    mainContainer.innerHTML += successfullyNewTask();

    // Sets a timeout to remove the success message and redirect to the board page
    setTimeout(() => {
        // Removes the success message element
        document.getElementById('newTaskBGMessage').remove();

        // Redirects to the board page
        window.location.href = '/board.html';
    }, 900);
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
    // Selects the subtask input field based on the provided task ID
    const inputField = document.querySelector(`#subtask${task}`);

    // Selects the icons for confirming, canceling, and adding the edit
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let separator = document.getElementById('subtaskEditInputSeparator');

    // Sets the input field to editable and focuses on it
    inputField.readOnly = false;
    inputField.focus();

    // Hides the add icon and shows the icons for confirming and canceling the edit
    addIcon.style.display = 'none';
    checkIcon.style.display = 'flex';
    closeIcon.style.display = 'flex';
    separator.style.display = 'flex';
}


document.addEventListener('DOMContentLoaded', () => {
    
    if (window.location.pathname.endsWith('addTask.html')) {

        const form = document.getElementById('addTaskForm');
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
            });
        }

        const inputFields = document.querySelectorAll('.addTaskInput, .addTaskDescription');
        inputFields.forEach(input => {
            if (input) {
                input.addEventListener('keydown', function(event) {
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