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
    document.getElementById('contactMain').innerHTML += addContactHtml();               // Append the HTML for the add contact form to the contactMain element
};


function closeAddContact() {                                                            // Function to close the add contact form
    document.getElementById('addContactContainer').classList.remove('slideInBottom');   // Remove the 'slideInBottom' class from the addContactContainer element
    document.getElementById('addContactContainer').classList.add('slideOutBottom');     // Add the 'slideOutBottom' class to the addContactContainer element
    setTimeout(() => {
        document.getElementById('contactAddFormBackground').remove();                   // Remove the contactAddFormBackground element after a delay of 300 milliseconds
    }, 300);
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
        document.getElementById('contactMain').innerHTML = contactViewHtml(contact); // Update the HTML with the contact view
    } else {
        console.log('Contact with id ' + contactId + ' not found'); // Log an error message if the contact was not found
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
    document.getElementById('optionContainer').classList.remove('slideInRight'); // Remove the 'slideInRight' class from the option container
    document.getElementById('optionContainer').classList.add('slideOutRight'); // Add the 'slideOutRight' class to the option container
    setTimeout(() => {
        document.getElementById('optionContainer').style.display = 'none'; // Set the display property of the option container to 'none' after a delay of 300 milliseconds
    }, 300);
};

// Function to open the edit contact form for a specific contact
function openEditContact(contactId) {
    let container = document.getElementById('contactViewContainer' + contactId); // Get the container element for the contact view
    closeOption(); // Close the option container
    contactId = contacts.find(contact => contact.id === contactId); // Find the contact object with the specified contactId
    container.innerHTML += contactEditForm(contactId); // Append the edit contact form to the container
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
    let contact = await getContactById(contactId); // Fetch the contact details
    let contactName = document.getElementById('contactName' + contactId).value; // Get the value of the contact name input field
    let contactEmail = document.getElementById('contactEmail' + contactId).value; // Get the value of the contact email input field
    let contactPhone = document.getElementById('contactPhone' + contactId).value; // Get the value of the contact phone input field
    let initials = contactName.split(' ').map((n) => n[0]).join(''); // Generate initials from the contact name
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = userId.id; // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn'); // Get the guestLoggedIn value from local storage 

    try {

        if (guestLoggedIn === 'true') {
            userId = '-O-Mr5g8976g5-yCxVK8'; // Set the user ID to the guest user ID if the guest is logged in
        }

        await putData('/users/' + userId + '/contacts/' + contactId, { // Update the contact details on the server
            'name': contactName,
            'email': contactEmail,
            'phone': contactPhone,
            'initials': initials,
            'profileColor': contact.profileColor
        });
        // Update the contact details in the contact view
        let contactViewEmail = document.getElementById('contactViewEmail');
        let contactViewPhone = document.getElementById('contactViewPhone');
        let contactViewName = document.getElementById('contactViewName');
        let contactViewProfileIcon = document.getElementById('contactViewProfileIcon');
        contactViewEmail.innerHTML = contactEmail; // Update the contact email in the contact view
        contactViewPhone.innerHTML = contactPhone; // Update the contact phone in the contact view
        contactViewName.innerHTML = contactName; // Update the contact name in the contact view
        contactViewProfileIcon.style.backgroundColor = contact.profileColor; // Update the profile icon background color in the contact view
        contactViewProfileIcon.innerHTML = initials; // Update the profile icon initials in the contact view
        closeEditContact(); // Close the edit contact form
    } catch (error) {
        console.error('Error editing contact:', error); // Log an error if there is an issue editing the contact
    }
};