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
    document.getElementById('background').remove(); // Remove the background element
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


async function saveContact() {                                                          // Function to save a new contact
    let contactName = document.getElementById('contactName').value;                     // Get the value of the contact name input
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;                    // Regular expression pattern to validate the contact name
    if (!namePattern.test(contactName)) {                                               // Check if the contact name matches the pattern
        return;                                                                         // Return if the contact name is invalid
    }

    let contactEmail = document.getElementById('contactEmail').value;                   // Get the value of the contact email input
    let contactPhone = document.getElementById('contactPhone').value;                   // Get the value of the contact phone input
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];    // Get a random color from the profileColor array
    let initials = contactName.split(' ').map((n) => n[0]).join('');                    // Get the initials of the contact name    
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = userId.id;                                                                 // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');                          // Get the guestLoggedIn value from local storage
    try {
        if (guestLoggedIn === 'true') {
            userId = '-O-Mr5g8976g5-yCxVK8';                                            // Set the user ID to the guest user ID if the guest is logged in
        }

        await postData('/users/' + userId + '/contacts', {                              // Send a POST request to add the contact to the server
            'name': contactName,
            'email': contactEmail,
            'phone': contactPhone,
            'initials': initials,
            'profileColor': randomColor
        });

        document.getElementById('contactMain').innerHTML += successfullyHtml();         // Add the success message to the contact main element
        setTimeout(() => {
            document.getElementById('conctactSuccessfully').remove();                   // Remove the success message after 800 milliseconds
        }, 800);

        closeAddContact();                                                              // Close the add contact form

        contactInit();                                                                  // Initialize the contact page
    } catch (error) {
        console.error('Error adding contact:', error);                                  // Log an error if there was an error adding the contact
    }
};



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
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = userId.id; // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn'); // Get the guestLoggedIn value from local storage
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8'; // Set the user ID to the guest user ID if the guest is logged in
    }
    if (!userId) {
        console.error('User not found'); // Log an error message if user ID is not found
        return;
    }
    try {
        await deleteData('/users/' + userId + '/contacts/' + contactId); // Delete the contact data from the server
        window.location.href = 'contacts.html'; // Redirect to the contacts page after deleting the contact
    } catch (error) {
        console.error('Error deleting contact:', error); // Log an error message if there is an error deleting the contact
    }
};

// Function to navigate to the contacts page
function goToContacts() {
    window.location.href = 'contacts.html';
};

// Function to open the option container
function openOption() {
    document.getElementById('optionContainer').classList.remove('slideOutRight'); // Remove the 'slideOutRight' class from the option container
    document.getElementById('optionContainer').classList.add('slideInRight'); // Add the 'slideInRight' class to the option container
    document.getElementById('optionContainer').style.display = 'flex'; // Set the display property of the option container to 'flex'
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
function openEditContact(contactId) {
    let container;
    closeOption(); // Close the option container
    let contact = contacts.find(contact => contact.id === contactId); // Find the contact object with the specified contactId

    if (window.innerWidth >= 1100) {
        container = document.getElementById('contactMain'); // Get the container element for the contact view
        container.innerHTML += editContactDesktop(contact); // Append the edit contact form to the container
    } else if(document.getElementById('contactViewContainer' + contactId)) {
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
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')))?.id || '-O-Mr5g8976g5-yCxVK8';
    let guestLoggedIn = localStorage.getItem('guestLoggedIn') === 'true';
    let contactDetails = ['Name', 'Email', 'Phone'].reduce((details, field) => {
        details[field.toLowerCase()] = document.getElementById(`contact${field}${contactId}`).value;
        return details;
    }, {});
    contactDetails.initials = contactDetails.name.split(' ').map((n) => n[0]).join('');
    contactDetails.profileColor = contact.profileColor;

    try {
        if (guestLoggedIn) {
            userId = '-O-Mr5g8976g5-yCxVK8';
        }
        await putData(`/users/${userId}/contacts/${contactId}`, contactDetails);

        ['Email', 'Phone', 'Name'].forEach(field => {
            document.getElementById(`contactView${field}`).innerHTML = contactDetails[field.toLowerCase()];
        });

        let contactViewProfileIcon = document.getElementById('contactViewProfileIcon');
        contactViewProfileIcon.style.backgroundColor = contact.profileColor;
        contactViewProfileIcon.innerHTML = contactDetails.initials;

        closeEditContact();
    } catch (error) {
        console.error('Error editing contact:', error);
    }
};



