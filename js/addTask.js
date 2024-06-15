addTaskToArray = [];

function addTaskInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadUserInitial();
    dateTreshhold();
    getContacts();
<<<<<<< Updated upstream
    
    
=======


>>>>>>> Stashed changes
}

function toggleAssignedDropdown() {
    const dropdown = document.getElementById('dropdownAssigned');
    let icon = document.getElementById('assignedDropdownArrow');

    if (dropdown.style.display === 'flex') {
        dropdown.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';

    } else {
        dropdown.style.display = 'flex';
        icon.style.transform = 'rotate(180deg)';

    }
    displayAssignedTo();
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

}

function dateTreshhold() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("addTaskDueDate").setAttribute('min', today);
};



async function saveTask() {
    let title = document.getElementById('addTaskTitle').value;
    let date = document.getElementById('addTaskDueDate').value;
    let userId = await getUserIdByEmail(); // Wait for the user ID
    let description = document.getElementById('addTaskDescription').value;
    let prio = getSelectedPriority();
    let category = document.getElementById('addTaskCategory').value;
    if (title === '' || date === '') {
        titlequery();
        datequery();
        console.log("error")
        return;
    }

    try {
        await postData('/users/' + userId + '/tasks', {
            'title': title,
            'date': date,
            'description': description,
            'Priority': prio,
            'Assigned': selectedAssigned,
            'Category': category,
        });
        selectedAssigned = [];
        document.getElementById('addTaskFormAssignedInput').value = '';
    } catch (error) {
        console.error('Error saving task:', error);
    }


}

// Funktion, um die ausgewählte Priorität zu ermitteln
function getSelectedPriority() {
    // Holt alle Radio-Buttons mit dem Namen 'priority'
    const priorities = document.getElementsByName('priority');
    let selectedPriority = null; // Variable zur Speicherung des ausgewählten Radio-Buttons

    // Schleife durch alle Prioritäten (Radio-Buttons)
    for (const priority of priorities) {
        // Überprüfen, ob der aktuelle Radio-Button ausgewählt ist
        if (priority.checked) {
            selectedPriority = priority; // Speichere den ausgewählten Radio-Button
            break; // Schleife abbrechen, da wir die Auswahl gefunden haben
        }
    }

    // Überprüfen, ob eine Priorität ausgewählt wurde
    if (selectedPriority) {
        const priorityValue = selectedPriority.value; // Wert des ausgewählten Radio-Buttons
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`); // Holt das zugehörige Label-Element
        const priorityImgSrc = priorityLabel.querySelector('img').src; // Holt den Bildpfad des Bildes innerhalb des Labels

        // Rückgabe eines Objekts mit dem Wert und dem Bildpfad
        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }
}


// Funktion zum Auswählen einer Kategorie und Übertragen in das Eingabefeld
function selectCategory(element) {
    const categoryInput = document.getElementById('addTaskCategory');
    categoryInput.value = element.textContent.trim(); // Setzt den Text des ausgewählten Elements in das Eingabefeld

}

function displayAssignedTo() {
    let container = document.getElementById('dropdownAssigned');

    container.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {

        container.innerHTML += assignedItemHtml(contacts[i]);
    }
}

function assignedItemHtml(contact) {
    return /*html*/ `                
        <label class="dropdownItemAssigned" id="label${contact.id}">
            <div class="profileNameContainer">
                <div class="profileIconAssigned" style="background-color: ${contact.profileColor};">${contact.initials}</div>
                <span id="name${contact.id}" class="assignedName" data-value="${contact.name}">${contact.name}</span>
            </div>
            <input
                id="addTaskFromAssignedCheckbox${contact.id}"
                type="checkbox"
                class="checkboxAssigned"
                onchange="assignedItemChackBackgroundColor.call(this, 'name${contact.id}');selectAssigned()"/>  
        </label>`;
}

function assignedItemChackBackgroundColor(nameId) {
    const label = this.closest('.dropdownItemAssigned');
    const name = document.getElementById(nameId);
    if (this.checked) {
        label.style.backgroundColor = '#2A3647';
        name.classList.add('nameWhite');
    } else {
        label.style.backgroundColor = 'white';
        name.classList.remove('nameWhite');
    }
}

let selectedAssigned = [];
function selectAssigned() {
    // Initialize an array to hold the selected assigned contacts

    // Get the input element where the selected contacts will be displayed
    let inputAssigned = document.getElementById('addTaskFormAssignedInput');
    // Get all the checkboxes that indicate assigned contacts
    let checkboxes = document.querySelectorAll('.checkboxAssigned');

    // Iterate over each checkbox
    checkboxes.forEach(checkbox => {
        // Get the name of the contact from the data-value attribute of the assigned-name element
        let contactName = checkbox.parentNode.querySelector('.assignedName').getAttribute('data-value');

        // Check if the checkbox is checked
        if (checkbox.checked) {
            // Find the contact object in the contacts array that matches the contact name
            let contact = contacts.find(c => c.name === contactName);
            // Add the contact object to the selectedAssigned array
            if (contact) {
                selectedAssigned.push(contact);
                console.log(selectedAssigned);
            }
        }
    });

    // Set the value of the inputAssigned element to the names of the selected contacts
    inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';

    // Return the array of selected assigned contacts
    return selectedAssigned;
}





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
}

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
}

