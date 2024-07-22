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


function openAddContact() {                                                             // Function to open the add contact form
    if (window.innerWidth >= 1100) {
        document.getElementById('contactMain').innerHTML += addContactDesktop(); // Append the HTML for the add contact form to the contactViewDesktop element
    } else {
        document.getElementById('contactMain').innerHTML += addContactHtml();           // Append the HTML for the add contact form to the contactMain element
    }
};


function closeAddContact() {                                                            // Function to close the add contact form
    document.getElementById('addContactContainer').classList.remove('slideInBottom');   // Remove the 'slideInBottom' class from the addContactContainer element
    document.getElementById('addContactContainer').classList.add('slideOutBottom');     // Add the 'slideOutBottom' class to the addContactContainer element
    setTimeout(() => {
        document.getElementById('contactAddFormBackground').remove();                   // Remove the contactAddFormBackground element after a delay of 300 milliseconds
    }, 300);
};

function closeAddContactDesktop() {
    // Remove the background element
    document.getElementById('background').remove();
};


/**
 * Displays the contacts in the provided array in alphabetical order.
 * Each contact is displayed under the corresponding letter section.
 * 
 * @param {Array} contacts - The array of contacts to be displayed.
 */
function displayContacts(contacts) {
    let container = document.getElementById('contacts');                                // Get the container element

    if (container) {                                                                    // Check if the container element exists
        container.innerHTML = '';                                                       // Clear the container
        contacts.sort((a, b) => a.name.localeCompare(b.name));                          // Sort the contacts array alphabetically by name
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');                          // Create an array of letters from A to Z

        for (let i = 0; i < alphabet.length; i++) {                                     // Iterate through each letter
            let letter = alphabet[i];                                                   // Get the current letter
            let contactsByLetter = contacts.filter(contact => contact.name.toUpperCase().startsWith(letter)); // Filter contacts that start with the current letter

            if (contactsByLetter.length > 0) {                                          // Check if there are contacts for the current letter
                container.innerHTML += `<div class="contactAlphabet">${letter}</div><div class="contactSeperator"></div>`; // Add the letter section to the container

                for (let j = 0; j < contactsByLetter.length; j++) {                     // Iterate through each contact for the current letter
                    let contact = contactsByLetter[j];                                  // Get the current contact
                    container.innerHTML += contactListItemHtml(contact);                // Add the contact item to the container
                }
            }
        }
    }
};


async function saveContact() {
    let contactName = document.getElementById('contactName').value;
    if (!isValidName(contactName)) return;

    let contactEmail = document.getElementById('contactEmail').value;
    let contactPhone = document.getElementById('contactPhone').value;
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];
    let initials = contactName.split(' ').map(n => n[0]).join('');
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = localStorage.getItem('guestLoggedIn') === 'true' ? '-O-Mr5g8976g5-yCxVK8' : user.id;

    try {
        await postData(`/users/${userId}/contacts`, { name: contactName, email: contactEmail, phone: contactPhone, initials: initials, profileColor: randomColor });
        await showSuccessMessage();

        contactInit();
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}

// Auslagerung der Validierung
function isValidName(name) {
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    return namePattern.test(name);
}

// Auslagerung der Erfolgsmeldung
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





// Function to open the contact view for a specific contact
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
async function deleteContact(contactId) {
    await getUser(); // Fetch users if not already fetched
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = users.id; // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn'); // Get the guestLoggedIn value from local storage
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8'; // Set the user ID to the guest user ID if the guest is logged in
    }
    if (!userId) {
        console.error('User not found'); // Log an error message if user ID is not found
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
function goToContacts() {
    window.location.href = 'contacts.html';
};

// Function to open the option container
function openOption() {
    // Remove the 'slideOutRight' class from the option container
    document.getElementById('optionContainer').classList.remove('slideOutRight');
    // Add the 'slideInRight' class to the option container
    document.getElementById('optionContainer').classList.add('slideInRight');
    // Set the display property of the option container to 'flex'
    document.getElementById('optionContainer').style.display = 'flex';
};

// Function to close the option container
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
function closeEditContact() {
    document.getElementById('editContactContainer').classList.remove('slideInBottom'); // Remove the 'slideInBottom' class from the edit contact container
    document.getElementById('editContactContainer').classList.add('slideOutBottom'); // Add the 'slideOutBottom' class to the edit contact container
    setTimeout(() => {
        document.getElementById('contactEditFormBackground').remove(); // Remove the contact edit form background element after a delay of 300 milliseconds
    }, 300);
};

// Function to retrieve a contact by its ID
async function getContactById(contactId) {
    if (contacts.length === 0) {
        getContacts(); // Fetch contacts if not already fetched
    }
    return contacts.find(contact => contact.id === contactId); // Find the contact with the specified ID
};


async function saveEditContact(contactId) {
    let contact = await getContactById(contactId);
    let name = document.getElementById('contactName' + contactId).value;
    let email = document.getElementById('contactEmail' + contactId).value;
    let phone = document.getElementById('contactPhone' + contactId).value;
    let profileColor = contact.profileColor;
    let initials = name.split(' ').map(n => n[0]).join('');


    try {
        userId = await getUserId();

        await putData(`/users/${userId}/contacts/${contactId}`,
            {
                name: name,
                email: email,
                phone: phone,
                profileColor: profileColor,
                initials: initials
            });



        let contactViewProfileIcon = document.getElementById('profileIconEditDesktop');
        contactViewProfileIcon.style.backgroundColor = contact.profileColor;
        contactViewProfileIcon.innerHTML = contact.initials;
        if (window.innerWidth >= 1100) {
            closeAddContactDesktop();
            updateContactsSite();
        } else {
            closeEditContact();            
            
        }

    } catch (error) {
        console.error('Error editing contact:', error);
    }

   
    
};




function updateContactsSite(){
    location.reload();
}


