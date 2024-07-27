async function addTaskInit() {
    templateInit();
    await getContacts();
    dateTreshhold();
    
};


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
}


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

function handleClickOutside(event) {
    let dropdown = document.getElementById('dropdownAssigned');
    let icon = document.getElementById('assignedDropdownArrow');

    if (!dropdown.contains(event.target) && !icon.contains(event.target)) {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
        document.removeEventListener('click', handleClickOutside);
    }
}


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
};


function dateTreshhold() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("addTaskDueDate").setAttribute('min', today);
};


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
};


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
        const priorityImgSrc = priorityLabel.querySelector('img').src;   // Holt den Bildpfad des Bildes innerhalb des Labels

        return {                                                         // Rückgabe eines Objekts mit dem Wert und dem Bildpfad 
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }
};


function selectCategory(element) {                                      // Funktion zum Auswählen einer Kategorie und Übertragen in das Eingabefeld
    const categoryInput = document.getElementById('addTaskCategory');
    categoryInput.value = element.textContent.trim();                   // Setzt den Text des ausgewählten Elements in das Eingabefeld
};


function displayAssignedTo() {
    let container = document.getElementById('dropdownAssigned');

    container.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        container.innerHTML += assignedItemHtml(contacts[i]);
    }
};


function assignedItemHtml(contact) {
    return /*html*/ `                
        <label class="dropdownItemAssigned" id="label${contact.id}" for="addTaskFromAssignedCheckbox${contact.id}">
            <div class="profileNameContainer">
                <div class="profileIconAssigned" style="background-color: ${contact.profileColor};">${contact.initials}</div>
                <span id="name${contact.id}" class="assignedName" data-value="${contact.name}">${contact.name}</span>
            </div>
            <input
                id="addTaskFromAssignedCheckbox${contact.id}"
                type="checkbox"
                class="checkboxAssigned"
                onchange="assignedItemChackBackgroundColor(this, 'name${contact.id}'); selectAssigned()"/>
        </label>`;
};


function assignedItemChackBackgroundColor(checkbox, nameId) {
    const label = checkbox.closest('.dropdownItemAssigned');
    const name = document.getElementById(nameId);
    if (checkbox.checked) {
        label.style.backgroundColor = '#2A3647';
        name.classList.add('nameWhite');
    } else {
        label.style.backgroundColor = 'white';
        name.classList.remove('nameWhite');
    }
};


function setCheckedAssigned() {
    let checkboxes = document.querySelectorAll('.checkboxAssigned');        // Get all the checkboxes that indicate assigned contacts

    checkboxes.forEach(checkbox => {                                        // Iterate over each checkbox    
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');     // Get the name of the contact from the data-value attribute of the assigned-name element
        let isSelected = selectedAssigned.some(contact => contact.name === contactName);                     // Check if the contact is in the selectedAssigned array
        checkbox.checked = isSelected;                                      // Set the checked state of the checkbox
        assignedItemChackBackgroundColor(checkbox, checkbox.parentNode.querySelector('.assignedName').id);  // Update the background color based on the checked state
    });
};



function selectAssigned() {
    selectedAssigned = [];                                                  // Clear the selectedAssigned array at the beginning
    let checkboxes = document.querySelectorAll('.checkboxAssigned');        // Get all the checkboxes that indicate assigned contacts

    checkboxes.forEach(checkbox => {// Iterate over each checkbox

        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');// Get the name of the contact from the data-value attribute of the assigned-name element   
        if (checkbox.checked) {                                             // Check if the checkbox is checked           
            let contact = contacts.find(c => c.name === contactName);       // Find the contact object in the contacts array that matches the contact name           
            if (contact) {                                                  // Add the contact object to the selectedAssigned array
                selectedAssigned.push(contact);
            }
        }
    });
    let inputAssigned = document.getElementById('addTaskFormAssignedInput');// Update the inputAssigned element with the names of the selected contacts
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';

    return selectedAssigned;                                                // Return the array of selected assigned contacts
};


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
};


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
};


function focusSubtaskInput() {                                           // Funktion zum Wechseln der Bilder und Entfernen des readonly-Attributs
    const inputField = document.querySelector('#addTaskSubtask');
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


function deleteValueSubtask() {
    let subtaskInput = document.getElementById('addTaskSubtask');
    let firstSubtaskIcon = document.getElementById('firstSubtaskIcon');
    let secondSubtaskIcon = document.getElementById('secondSubtaskIcon');

    subtaskInput.value = '';
    subtaskInput.setAttribute('readonly', 'readonly');
    firstSubtaskIcon.src = './img/Mobile/AddTask/addIconAddTask.png';
    secondSubtaskIcon.style.display = 'none';
    document.getElementById('subtaskInputSeperator').style.display = 'none';
    firstSubtaskIcon.setAttribute('onclick', 'activateSubtaskInput()');
};


function onBlurSubtaskInput() {
    const inputField = document.querySelector('#addTaskSubtask');
    let checkIcon = document.getElementById('checkSubtaskIcon');
    let closeIcon = document.getElementById('closeSubtaskIcon');
    let addIcon = document.getElementById('addEditSubtaskIcon');
    let seperator = document.getElementById('subtaskEditInputSeperator');

    if (inputField != null) {
        inputField.readOnly = true;
    }

    addIcon.style.display = 'flex';
    checkIcon.style.display = 'none';
    closeIcon.style.display = 'none';
    seperator.style.display = 'none';
};


function addSubtaskItem() {
    let subtaskInput = document.getElementById('addTaskSubtask');

    if (subtaskInput.value === '') {
        return;
    }
    subtasks.push(subtaskInput.value);
    document.getElementById('subtaskContainer').innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {

        document.getElementById('subtaskContainer').innerHTML +=
            `<li class="addTaskSubtaskItem"><input type="text" class="subtaskItemInput" value="${subtasks[i]}" readonly>            
            <div class="subtaskItemIconContainer">
            <img src="./img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon" onclick="editSubtaskItem(event)">
            <span class="subtaskSeperator"></span>
            <img src="./img/Mobile/AddTask/trashIcon.png" alt="Edit Icon" class="subtaskItemIcon" onclick="deleteSubtaskItem(event)"
            id="subtaskItemRightIcon"
            >
            </div>
            </li>`;
    }
    subtaskInput.value = '';
    onBlurSubtaskInput();
};


function emptySubtaskInput() {
    let subtaskInput = document.getElementById('addTaskSubtask');
    subtaskInput.value = '';
    onBlurSubtaskInput();
};


function deleteSubtaskItem(event) {
    let subtaskItem = event.target.closest('.addTaskSubtaskItem');
    let subtaskItemValue = subtaskItem.querySelector('.subtaskItemInput').value;

    subtasks = subtasks.filter(subtask => subtask !== subtaskItemValue);
    subtaskItem.remove();
};


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
};


function saveSubtaskItem(event) {
    const subtaskItem = event.target.closest('.addTaskSubtaskItem');
    const leftIcon = subtaskItem.querySelector('#subtaskItemLeftIcon');
    const rightIcon = subtaskItem.querySelector('#subtaskItemRightIcon');
    const subtaskItemInput = subtaskItem.querySelector('.subtaskItemInput');
    const subtaskId = subtaskItem.dataset.id;                                       // Angenommen, jedes Subtask-Item hat eine eindeutige ID

    const subtaskIndex = subtasks.findIndex(subtask => subtask.id === subtaskId);   // Prüfen, ob das Subtask bereits im Array ist und aktualisieren
    if (subtaskIndex !== -1) {
        subtasks[subtaskIndex] = subtaskItemInput.value;
    }
    // console.log(subtasks);
    subtaskItemInput.setAttribute('readonly', 'readonly');                          // Setzen des Inputs auf "readonly"

    leftIcon.src = './img/Mobile/AddTask/editIcon.png';                              // Anpassen der Icons und deren Click-Handler
    leftIcon.setAttribute('onclick', 'editSubtaskItem(event)');
    rightIcon.src = './img/Mobile/AddTask/trashIcon.png';
    rightIcon.setAttribute('onclick', 'deleteSubtaskItem(event)');
};


function clearFrom() {
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
};


function successfullyNewTask() {
    return `
        <div class="backGroundNewTask" id="newTaskBGMessage">
          <div class="addToBoard taskSlideIn" id="createBoardItem">
            <h1 class="addToBoardHeadline">Task added to board</h1>
            <img src="./img/Mobile/AddTask/addTaskBoardIcons.png" alt="board">
          </div>
        </div>
    `;
};


function displaySuccsessfullyMessage() {
    let mainContainer = document.getElementById('mainContainerId');
    mainContainer.innerHTML += successfullyNewTask();
    
    // Remove the success message after 900 milliseconds
    setTimeout(() => {
        document.getElementById('newTaskBGMessage').remove();        
        window.location.href = '/board.html'; 
    }, 900);
};





function focusEditSubtaskInput(task) {                                           // Funktion zum Wechseln der Bilder und Entfernen des readonly-Attributs
    const inputField = document.querySelector(`#subtask${task}`);
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

/**
 * eventListener sorgt dafür, dass eine Subtask mit der Entertaste hinzugefügt werden kann
 */
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
});