/**
 * Initializes the contact page by setting up various UI components and loading necessary data.
 *
 * This asynchronous function sets up the initial state of the contact page, including displaying
 * mobile and desktop menus, loading guest login information, and displaying the user's contacts.
 */
async function contactInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    menuActive();
    await getContacts();
    displayContacts(contacts);
    loadUserInitial();
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
        document.getElementById('contactAddFormBackground').remove();
    }, 300);
}


/**
 * Closes the add contact form in the desktop view.
 *
 * This function adds an animation class to fade out the desktop add contact form and then
 * removes the form's background and overlay elements from the DOM after the animation completes.
 */
function closeAddContactDesktop() {
    let floatId = document.getElementById('background');
    let overlay = document.getElementById('backgroundOverlay');

    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        if (floatId) {
            floatId.remove();
        }
        if (overlay) {
            overlay.remove();
        }       
    });
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
 * Displays the contacts in alphabetical order.
 *
 * This function sorts the contacts array alphabetically and displays each contact under
 * the corresponding letter section in the contact list.
 *
 * @param {Array} contacts - The array of contacts to be displayed.
 */
function displayContacts(contacts) {
    let container = document.getElementById('contacts');
    if (container) {
        container.innerHTML = '';
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        alphabet.forEach(letter => {
            let contactsByLetter = contacts.filter(contact => contact.name.toUpperCase().startsWith(letter));
            if (contactsByLetter.length > 0) {
                container.innerHTML += `<div class="contactAlphabet">${letter}</div><div class="contactSeperator"></div>`;
                contactsByLetter.forEach(contact => {
                    container.innerHTML += contactListItemHtml(contact);
                });
            }
        });
    }
}


/**
 * Saves a new contact by sending a POST request to the server.
 *
 * This asynchronous function gathers data from the form, validates it, and sends it to the server
 * to create a new contact. It then reloads the contacts and shows a success message.
 */
async function saveContact() {
    if (!validateForm()) {
        return;
    }
    let contactName = document.getElementById('contactName').value;
    let contactEmail = document.getElementById('contactEmail').value;
    let contactPhone = document.getElementById('contactPhone').value;
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];
    let initials = contactName.split(' ').map(n => n[0]).join('');
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = localStorage.getItem('guestLoggedIn') === 'true' ? '-O-Mr5g8976g5-yCxVK8' : user.id;

    try {
        await postData(`/users/${userId}/contacts`, {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
            initials: initials,
            profileColor: randomColor
        });
        await showSuccessMessage();
        document.getElementById('backgroundOverlay').remove();
        contactInit();
    } catch (error) {
        console.error('Error adding contact:', error);
    }
    contactInit();
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
 * Validates the form fields and displays errors if necessary.
 * 
 * This function checks the form fields for a contact name, a valid email, and a phone number.
 * It displays appropriate error messages if any validation checks fail.
 * 
 * @function validateForm
 * @returns {boolean} - Whether the form is valid.
 */
function validateForm() {
    const contactName = document.getElementById('contactName').value.trim();
    const contactEmail = document.getElementById('contactEmail');
    const contactPhone = document.getElementById('contactPhone').value.trim();
    let isValid = true;

    if (contactName === '') {
        displayError('contactLabelName', 'nameErrorSpan', 'Please enter a name');
        isValid = false;
    } else {
        clearError('contactLabelName', 'nameErrorSpan');
    }

    if (!validateEmail(contactEmail)) {
        displayError('contactLabelEmail', 'emailErrorSpan', 'Please enter a correct email (example@mail.com)');
        isValid = false;
    } else {
        clearError('contactLabelEmail', 'emailErrorSpan');
    }

    if (contactPhone === '') {
        displayError('contactLabelPhone', 'phoneErrorSpan', 'Please enter a phone number');
        isValid = false;
    } else {
        clearError('contactLabelPhone', 'phoneErrorSpan');
    }
    return isValid;
}


/**
 * Validates an email address using a regular expression pattern.
 * 
 * This function checks if the provided email field contains a valid email address format.
 * 
 * @param {HTMLInputElement} emailField - The email input field element to validate.
 * @returns {boolean} - True if the email is valid, otherwise false.
 */
function validateEmail(emailField) {
    let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (pattern.test(emailField.value) == false) {
        return false;
    }

    return true;
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


/**
 * Deletes a contact from the user's contact list.
 * 
 * This asynchronous function deletes a contact by sending a DELETE request to the server.
 * It then redirects to the contacts page upon successful deletion.
 * 
 * @param {string} contactId - The ID of the contact to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the contact is successfully deleted.
 */
async function deleteContact(contactId) {
    await getUser();
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
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
        await deleteData('/users/' + userId + '/contacts/' + contactId);
        window.location.href = 'contacts.html';
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}


/**
 * Redirects the user to the contacts.html page.
 * 
 * This function navigates the browser to the contacts page.
 */
function goToContacts() {
    window.location.href = 'contacts.html';
}


/**
 * Opens the option container.
 * 
 * This function displays the option container by applying the appropriate CSS classes for a slide-in animation.
 */
function openOption() {
    document.getElementById('optionContainer').classList.remove('slideOutRight');
    document.getElementById('optionContainer').classList.add('slideInRight');
    document.getElementById('optionContainer').style.display = 'block';
}


/**
 * Closes the option container.
 * 
 * This function hides the option container by applying a slide-out animation and then
 * setting the display property to 'none' after a short delay.
 */
function closeOption() {
    if (document.getElementById('optionContainer')) {
        document.getElementById('optionContainer').classList.remove('slideInRight');
        document.getElementById('optionContainer').classList.add('slideOutRight');
        setTimeout(() => {
            document.getElementById('optionContainer').style.display = 'none';
        }, 300);
    }
}


/**
 * Opens the edit contact form for the specified contactId.
 * 
 * This function displays the edit form for a contact. It handles both desktop and mobile views,
 * appending the form to the appropriate container.
 * 
 * @param {string} contactId - The ID of the contact to edit.
 */
function openEditContact(contactId) {
    let container;
    closeOption();
    let contact = contacts.find(contact => contact.id === contactId);

    if (window.innerWidth >= 1100) {
        container = document.getElementById('contactMain');
        container.innerHTML += editContactDesktop(contact);
    } else if (document.getElementById('contactViewContainer' + contactId)) {
        container = document.getElementById('contactViewContainer' + contactId);
        container.innerHTML += contactEditForm(contact);
    }
}


/**
 * Closes the edit contact form.
 * 
 * This function hides the edit contact form by applying a slide-out animation and then
 * removing the form elements from the DOM after a short delay.
 */
function closeEditContact() {
    document.getElementById('editContactContainer').classList.remove('slideInBottom');
    document.getElementById('editContactContainer').classList.add('slideOutBottom');
    setTimeout(() => {
        document.getElementById('contactEditFormBackground').remove();
    }, 300);
}


/**
 * Retrieves a contact by its ID.
 * 
 * This function fetches the contact data from the global contacts array. If the array is empty,
 * it first retrieves the contacts from the server.
 * 
 * @param {number} contactId - The ID of the contact to retrieve.
 * @returns {Object|undefined} - The contact object if found, or undefined if not found.
 */
async function getContactById(contactId) {
    if (contacts.length === 0) {
        await getContacts();
    }
    return contacts.find(contact => contact.id === contactId);
}


/**
 * Saves the edited contact information.
 * 
 * This asynchronous function gathers the edited contact details from the form and updates the contact
 * on the server. It updates the display with the new contact information upon success.
 * 
 * @param {string} contactId - The ID of the contact to be edited.
 * @returns {Promise<void>} - A promise that resolves when the contact information is successfully edited.
 * @throws {Error} - If there is an error editing the contact information.
 */
async function saveEditContact(contactId) {
    try {
        const contact = await getContactById(contactId);
        const userId = await getUserId();

        const name = document.getElementById(`contactName${contactId}`).value;
        const email = document.getElementById(`contactEmail${contactId}`).value;
        const phone = document.getElementById(`contactPhone${contactId}`).value;
        const initials = name.split(' ').map(n => n[0]).join('');
        const profileColor = contact.profileColor;

        await putData(`/users/${userId}/contacts/${contactId}`, {
            name,
            email,
            phone,
            profileColor,
            initials
        });

        if (window.innerWidth >= 1100) {
            updateContactDisplay(contactId, name, email, phone, initials);
            await getContacts();
            closeAddContactDesktop();
        }
        if (document.getElementById('contactViewContainer' + contactId)) {
            updateContactDisplayMobile(contactId, name, email, phone, initials);
            await getContacts();
            closeEditContact();
        }
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}


/**
 * Updates the contact display with the provided information.
 * 
 * This function updates the contact details displayed on the screen after a contact has been edited.
 * It handles updates for both the contact view and the contact list.
 * 
 * @param {string} contactId - The ID of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 */
function updateContactDisplay(contactId, name, email, phone, initials) {
    document.getElementById(`cvdName${contactId}`).textContent = name;
    document.getElementById(`cvdEmail${contactId}`).textContent = email;
    document.getElementById(`cvdPhone${contactId}`).textContent = phone;
    document.getElementById(`profileIconDesktop${contactId}`).textContent = initials;

    document.getElementById(`contactItemName${contactId}`).textContent = name;
    document.getElementById(`contactItemEmail${contactId}`).textContent = email;
    document.getElementById(`profileIconItemInitial${contactId}`).textContent = initials;
}


/**
 * Updates the display of a contact on a mobile device.
 * 
 * This function updates the contact details displayed on the screen after a contact has been edited,
 * specifically for mobile view.
 * 
 * @param {string} contactId - The ID of the contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 */
function updateContactDisplayMobile(contactId, name, email, phone, initials) {
    document.getElementById(`contactViewName${contactId}`).textContent = name;
    document.getElementById(`contactViewEmail${contactId}`).textContent = email;
    document.getElementById(`contactViewPhone${contactId}`).textContent = phone;
    document.getElementById(`contactViewProfileIcon${contactId}`).textContent = initials;
}


/**
 * Disables the create contact button until the form is filled.
 * 
 * This function checks if all required fields in the add contact form are filled.
 * It enables or disables the submit button based on the form's completeness.
 */
function disableCreateContactButton() {
    let form = document.getElementById('contactFormAddContact');
    let submitBtn = document.getElementById('submitBtnAddContact');
    let submitBtnMobile = document.getElementById('createContactBtn');
    let fields = form.querySelectorAll('#contactName, #contactEmail, #contactPhone');

    function checkFormCompletion() {
        let allFilled = true;
        fields.forEach(field => {
            if (!field.value.trim()) {
                allFilled = false;
            }
        });
        if (submitBtnMobile == null) {
            submitBtn.disabled = !allFilled;
        } else if (submitBtn == null) {
            submitBtnMobile.disabled = !allFilled;
        }
    }

    fields.forEach(field => {
        field.addEventListener('input', checkFormCompletion);
    });

    checkFormCompletion();
}
