/**
 * Adds event listeners to the task addition form and its input fields for handling form submission and key events.
 *
 * This function attaches event listeners to the form used for adding a new task and its associated input fields.
 * It prevents the default form submission behavior and provides functionality for handling 'Enter' key presses,
 * specifically adding subtasks when the 'Enter' key is pressed in the subtask input field.
 */
function addEventListenersCreateContact() {
    const form = document.getElementById('contactFormAddContact');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });

        form.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && event.target.type !== 'textarea') {
                event.preventDefault();
                return false;
            }
        });
    }
}


/**
 * Adds event listeners to the form to prevent the default submit behavior
 * and to prevent the Enter key from submitting the form in input fields (except textareas).
 */
function addEventListenersEditContact() {
    const form = document.getElementById('editContactFormAddContact');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
        });

        form.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' && event.target.type !== 'textarea') {
                event.preventDefault();
                return false;
            }
        });
    }
}


/**
 * Displays an error message for a form field.
 * @function displayError
 * @param {string} labelId - The ID of the label element to highlight.
 * @param {string} errorSpanId - The ID of the span element to display the error message.
 * @param {string} errorMessage - The error message to display.
 */
function displayError(labelId, errorSpanId, errorMessage) {
    document.getElementById(labelId).style.borderColor = '#ff8190';
    document.getElementById(errorSpanId).innerHTML = errorMessage;
}


/**
 * Clears an error message for a form field.
 *
 * This function resets the border color of the input field and clears the error message
 * in the corresponding error span element.
 *
 * @param {string} labelId - The ID of the label element to clear the highlight.
 * @param {string} errorSpanId - The ID of the span element to clear the error message.
 */
function clearError(labelId, errorSpanId) {
    document.getElementById(labelId).style.borderColor = '';
    document.getElementById(errorSpanId).innerHTML = '';
}


/**
 * Displays a success message based on the window size.
 * 
 * This function displays a success message after a contact is added. It handles both desktop and mobile views,
 * removing the message after a short delay.
 */
async function showSuccessMessage() {
    if (window.innerWidth >= 1100) {
        closeAddContactDesktop();
        document.getElementById('contactMain').innerHTML += successfullyDesktopHtml();
        setTimeout(() => document.getElementById('conctactSuccessfully').remove(), 800);
    } else {
        closeAddContact();
        document.getElementById('contactMain').innerHTML += successfullyHtml();
        setTimeout(() => document.getElementById('conctactSuccessfully').remove(), 800);
    }
}


/**
 * Closes the add contact form in the desktop view.
 *
 * This function adds an animation class to fade out the desktop add contact form and then
 * removes the form's background and overlay elements from the DOM after the animation completes.
 */
function closeAddContactDesktop() {
    document.getElementById('background').remove();
}


/**
 * Opens the add contact form, adapting the layout based on the screen width.
 *
 * This function checks the window width and displays the add contact form
 * accordingly, either in a desktop or mobile layout.
 */
function openAddContact() {
    if (window.innerWidth >= 1100) {
        document.getElementById('contactMain').innerHTML += addContactDesktop();
    } else {
        document.getElementById('contactMain').innerHTML += addContactHtml();
    }
    disableCreateContactButton();
    addEventListenersCreateContact();
}


/**
 * Closes the add contact form and removes the background overlay.
 *
 * This function adds an animation class to slide out the add contact form and then removes
 * the form's background element from the DOM after the animation completes.
 */
function closeAddContact() {
    document.getElementById('addContactContainer').classList.remove('slideInBottom');
    document.getElementById('addContactContainer').classList.add('slideOutBottom');
    setTimeout(() => {
        document.getElementById('background').remove();
    }, 300);
}


/**
 * Opens the contact view for the specified contact ID.
 * 
 * This function displays the detailed view of a contact. It adjusts the display based on the window width,
 * using different layouts for desktop and mobile views.
 * 
 * @param {number} contactId - The ID of the contact to open the view for.
 * @returns {Promise<void>} - A promise that resolves when the contact view is opened.
 */
async function openContactView(contactId) {
    let contact = contacts.find(contact => contact.id === contactId);
    if (contact) {
        if (window.innerWidth >= 1100) {
            document.getElementById('contactViewDesktop').style.display = 'flex';
            document.getElementById('contactViewDesktop').innerHTML = contactViewDesktop(contact);
            let items = document.querySelectorAll('.contactItemActive');
            items.forEach(item => item.classList.remove('contactItemActive'));
            let currentItem = document.getElementById(`contactItem${contactId}`);
            if (currentItem) {
                currentItem.classList.add('contactItemActive');
            }
        } else {
            document.getElementById('contactMain').innerHTML = contactViewHtml(contact);
        }
    }
}