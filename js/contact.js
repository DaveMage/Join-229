async function contactInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    menuActive();
    await getContacts();
    displayContacts(contacts);
    loadUserInitial();

};


function openAddContact() {
    if (window.innerWidth >= 1100) {
        document.getElementById('contactMain').innerHTML += addContactDesktop();
    } else {
        document.getElementById('contactMain').innerHTML += addContactHtml();
    }
};


/**
 * Closes the add contact container and removes the background form.
 */
function closeAddContact() {
    document.getElementById('addContactContainer').classList.remove('slideInBottom');
    document.getElementById('addContactContainer').classList.add('slideOutBottom');
    setTimeout(() => {
        document.getElementById('contactAddFormBackground').remove();
    }, 300);
};


/**
 * Closes the add contact desktop view.
 */
function closeAddContactDesktop() {
    let floatId = document.getElementById('background');
    let overlay = document.getElementById('backgroundOverlay');

    floatId.classList.add('closing');
    floatId.addEventListener('animationend', () => {
        floatId.remove();
        overlay.remove();
    });
}


/**
 * Displays the contacts in the provided array in alphabetical order.
 * Each contact is displayed under the corresponding letter section.
 * 
 * @param {Array} contacts - The array of contacts to be displayed.
 */
function displayContacts(contacts) {
    let container = document.getElementById('contacts');

    if (container) {
        container.innerHTML = '';
        contacts.sort((a, b) => a.name.localeCompare(b.name));
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        for (let i = 0; i < alphabet.length; i++) {
            let letter = alphabet[i];
            let contactsByLetter = contacts.filter(contact => contact.name.toUpperCase().startsWith(letter));

            if (contactsByLetter.length > 0) {
                container.innerHTML += `<div class="contactAlphabet">${letter}</div><div class="contactSeperator"></div>`;

                for (let j = 0; j < contactsByLetter.length; j++) {
                    let contact = contactsByLetter[j];
                    container.innerHTML += contactListItemHtml(contact);
                }
            }
        }
    }
};


/**
 * Saves a contact by sending a POST request to the server.
 * @async
 * @function saveContact
 */
async function saveContact() {
    // Validate form inputs
    if (!validateForm()) {
        return; // Stop execution if validation fails
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
        contactInit();
    } catch (error) {
        console.error('Error adding contact:', error);
    }

    if (window.innerWidth >= 1100) {
        closeAddContactDesktop();
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
 * @function clearError
 * @param {string} labelId - The ID of the label element to clear the highlight.
 * @param {string} errorSpanId - The ID of the span element to clear the error message.
 */
function clearError(labelId, errorSpanId) {
    document.getElementById(labelId).style.borderColor = '';
    document.getElementById(errorSpanId).innerHTML = '';
}

/**
 * Validates the form fields and displays errors if necessary.
 * @function validateForm
 * @returns {boolean} - Whether the form is valid.
 */
function validateForm() {
    const contactName = document.getElementById('contactName').value.trim();
    const contactEmail = document.getElementById('contactEmail').value.trim();
    const contactPhone = document.getElementById('contactPhone').value.trim();

    let isValid = true;

    if (contactName === '') {
        displayError('contactLabelName', 'nameErrorSpan', 'Please enter a name');
        isValid = false;
    } else {
        clearError('contactLabelName', 'nameErrorSpan');
    }

    if (contactEmail === '') {
        displayError('contactLabelEmail', 'emailErrorSpan', 'Please enter an email');
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
 * Displays a success message based on the window size.
 * If the window width is greater than or equal to 1100, it closes the desktop version of the add contact form,
 * adds the success message to the 'contactMain' element, and removes the message after 800 milliseconds.
 * If the window width is less than 1100, it closes the mobile version of the add contact form,
 * adds the success message to the 'contactMain' element, and removes the message after 800 milliseconds.
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
};


// Function to open the contact view for a specific contact
/**
 * Opens the contact view for the specified contact ID.
 * 
 * @param {number} contactId - The ID of the contact to open the view for.
 * @returns {Promise<void>} - A promise that resolves when the contact view is opened.
 */
async function openContactView(contactId) {
    // Find the contact with the given id
    let contact = contacts.find(contact => contact.id === contactId);

    // If the contact was found, update the HTML
    if (contact) {
        if (window.innerWidth >= 1100) {
            document.getElementById('contactViewDesktop').innerHTML = contactViewDesktop(contact);
            // Remove the 'current' class from all items
            let items = document.querySelectorAll('.contactItemActive');
            items.forEach(item => item.classList.remove('contactItemActive'));
            // Add the 'current' class to the current item
            let currentItem = document.getElementById(`contactItem${contactId}`);
            if (currentItem) {
                currentItem.classList.add('contactItemActive');
            }
        } else {
            // Update the HTML with the contact view
            document.getElementById('contactMain').innerHTML = contactViewHtml(contact);
        }
    }
};


// Function to delete a contact
/**
 * Deletes a contact from the user's contact list.
 * @param {string} contactId - The ID of the contact to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the contact is successfully deleted.
 */
async function deleteContact(contactId) {
    await getUser();
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
        // Delete the contact data from the server
        await deleteData('/users/' + userId + '/contacts/' + contactId);
        // Redirect to the contacts page after deleting the contact
        window.location.href = 'contacts.html';
    } catch (error) {
        // Log an error message if there is an error deleting the contact
        console.error('Error deleting contact:', error);
    }
};


// Function to navigate to the contacts page
/**
 * Redirects the user to the contacts.html page.
 */
function goToContacts() {
    window.location.href = 'contacts.html';
};


// Function to open the option container
/**
 * Opens the option container by removing the 'slideOutRight' class and adding the 'slideInRight' class.
 * Also sets the display property of the option container to 'flex'.
 */
function openOption() {
    // Remove the 'slideOutRight' class from the option container
    document.getElementById('optionContainer').classList.remove('slideOutRight');
    // Add the 'slideInRight' class to the option container
    document.getElementById('optionContainer').classList.add('slideInRight');
    // Set the display property of the option container to 'flex'
    document.getElementById('optionContainer').style.display = 'block';
};


// Function to close the option container
/**
 * Closes the option container by removing the 'slideInRight' class, adding the 'slideOutRight' class,
 * and setting the display property to 'none' after a delay of 300 milliseconds.
 */
function closeOption() {
    if (document.getElementById('optionContainer')) {
        document.getElementById('optionContainer').classList.remove('slideInRight'); // Remove the 'slideInRight' class from the option container
        document.getElementById('optionContainer').classList.add('slideOutRight'); // Add the 'slideOutRight' class to the option container
        setTimeout(() => {
            document.getElementById('optionContainer').style.display = 'none'; // Set the display property of the option container to 'none' after a delay of 300 milliseconds
        }, 300);

    }
};


// Function to open the edit contact form for a specific contact
/**
 * Opens the edit contact form for the specified contactId.
 *
 * @param {string} contactId - The ID of the contact to edit.
 */
function openEditContact(contactId) {
    let container;
    closeOption(); // Close the option container
    let contact = contacts.find(contact => contact.id === contactId); // Find the contact object with the specified contactId

    if (window.innerWidth >= 1100) {
        container = document.getElementById('contactMain'); // Get the container element for the contact view
        container.innerHTML += editContactDesktop(contact); // Append the edit contact form to the container
    } else if (document.getElementById('contactViewContainer' + contactId)) {
        container = document.getElementById('contactViewContainer' + contactId); // Get the container element for the contact view
        container.innerHTML += contactEditForm(contact); // Append the edit contact form to the container
    }
};


// Function to close the edit contact form
/**
 * Closes the edit contact form.
 */
function closeEditContact() {
    document.getElementById('editContactContainer').classList.remove('slideInBottom'); // Remove the 'slideInBottom' class from the edit contact container
    document.getElementById('editContactContainer').classList.add('slideOutBottom'); // Add the 'slideOutBottom' class to the edit contact container
    setTimeout(() => {
        document.getElementById('contactEditFormBackground').remove(); // Remove the contact edit form background element after a delay of 300 milliseconds
    }, 300);
};


// Function to retrieve a contact by its ID
/**
 * Retrieves a contact by its ID.
 * @param {number} contactId - The ID of the contact to retrieve.
 * @returns {Object|undefined} - The contact object if found, or undefined if not found.
 */
async function getContactById(contactId) {
    if (contacts.length === 0) {
        getContacts();
    }
    return contacts.find(contact => contact.id === contactId);
};


/**
 * Saves the edited contact information.
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


function validateForm() {
    // Clear previous errors
    document.getElementById('nameErrorSpan').style.display = 'none';
    document.getElementById('emailErrorSpan').style.display = 'none';
    document.getElementById('phoneErrorSpan').style.display = 'none';

    let isValid = true;

    // Validate Name
    const name = document.getElementById('contactName').value;
    if (!name) {
        document.getElementById('nameErrorSpan').style.display = 'block';
        isValid = false;
    }

    // Validate Email
    const email = document.getElementById('contactEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('emailErrorSpan').style.display = 'block';
        isValid = false;
    }

    // Validate Phone
    const phone = document.getElementById('contactPhone').value;
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneErrorSpan').style.display = 'block';
        isValid = false;
    }

    if (isValid) {
        saveContactmobile();
    }

    return false; // Prevent form submission for demonstration purposes
}

async function saveContactmobile() {

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
        contactInit();
    } catch (error) {
        console.error('Error adding contact:', error);
    }

    if (window.innerWidth >= 1100) {
        closeAddContactDesktop();
    }
}








