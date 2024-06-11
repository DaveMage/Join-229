async function contactInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    await getContacts();
    displayContacts(contacts);
    loadUserInitial();
}


function openAddContact() {
    document.getElementById('contactMain').innerHTML += addContactHtml();
}


function closeAddContact() {
    document.getElementById('addContactContainer').classList.remove('slideInBottom');
    document.getElementById('addContactContainer').classList.add('slideOutBottom');
    setTimeout(() => {
        document.getElementById('contactAddFormBackground').remove();
    }, 300);

}


/**
 * Retrieves contacts from the server and displays them on the webpage.
 * @returns {Array} An array of contact objects.
 */
async function getContacts() {
    let response = await fetch(BASE_URL + '/contacts.json');
    let responseToJson = await response.json();
    let fetchedContacts = [];

    for (const key in responseToJson) {
        let contact = responseToJson[key];
        contact.id = key;
        fetchedContacts.push(contact);
    }

    contacts = fetchedContacts; // Store fetched contacts in a global variable
    return contacts;
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
}

/**
 * Saves a contact by retrieving the contact name, email, and phone from the input fields,
 * generates a random profile color, and sends a POST request to the '/contacts' endpoint
 * with the contact details. Then, it closes the add contact form and updates the contacts list.
 */
async function saveContact() {
    let contactName = document.getElementById('contactName').value;
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    if (!namePattern.test(contactName)) {
        alert('Please enter a valid name');//auslagern und als onchange event setzen
        return;
    }

    let contactEmail = document.getElementById('contactEmail').value;
    let contactPhone = document.getElementById('contactPhone').value;
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];
    let initials = contactName.split(' ').map((n) => n[0]).join('');

    try {
        await postData('/contacts', {
            'name': contactName,
            'email': contactEmail,
            'phone': contactPhone,
            'initials': initials,
            'profileColor': randomColor
        });

        document.getElementById('contactMain').innerHTML += successfullyHtml();
        setTimeout(() => {
            document.getElementById('conctactSuccessfully').remove();
        }, 800);
        closeAddContact();// ersetzen durch openView des contactes

        // Fetch and display the updated contacts list
        contactInit()
    } catch (error) {
        console.error('Error adding contact:', error);
    }
}



async function openContactView(contactId) {
    // Make sure the contacts are loaded
    if (!contacts) {
        await getContacts();
    }

    // Find the contact with the given id
    let contact = contacts.find(contact => contact.id === contactId);

    // If the contact was found, update the HTML
    if (contact) {
        document.getElementById('contactMain').innerHTML = contactViewHtml(contact);
    } else {
        console.log('Contact with id ' + contactId + ' not found');
    }
}

async function deleteContact(contactId) {
    try {
        await deleteData('/contacts/' + contactId);
        window.location.href = 'contacts.html';
    } catch (error) {
        console.error('Error deleting contact:', error);
    }
}

function goToContacts() {
    window.location.href = 'contacts.html';
}

function openOption() {
    document.getElementById('optionContainer').classList.remove('slideOutRight');
    document.getElementById('optionContainer').classList.add('slideInRight');
    document.getElementById('optionContainer').style.display = 'flex';

}

function closeOption() {
    document.getElementById('optionContainer').classList.remove('slideInRight');
    document.getElementById('optionContainer').classList.add('slideOutRight');
    setTimeout(() => {
        document.getElementById('optionContainer').style.display = 'none';
    }, 300);

}

function openEditContact(contactId) {
    let container = document.getElementById('contactViewContainer' + contactId);
    closeOption();
    contactId = contacts.find(contact => contact.id === contactId);
    container.innerHTML += contactEditForm(contactId);
}

function closeEditContact() {
    document.getElementById('editContactContainer').classList.remove('slideInBottom');
    document.getElementById('editContactContainer').classList.add('slideOutBottom');
    setTimeout(() => {
        document.getElementById('contactEditFormBackground').remove();
    }, 300);
}

async function getContactById(contactId) {
    if (contacts.length === 0) {
        await getContacts(); // Fetch contacts if not already fetched
    }
    return contacts.find(contact => contact.id === contactId);
}

async function saveEditContact(contactId) {
    let contact = await getContactById(contactId); // Fetch the contact details
    let contactName = document.getElementById('contactName' + contactId).value;
    let contactEmail = document.getElementById('contactEmail' + contactId).value;
    let contactPhone = document.getElementById('contactPhone' + contactId).value;
    let initials = contactName.split(' ').map((n) => n[0]).join('');

    try {
        await putData('/contacts/' + contactId, {
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
        contactViewEmail.innerHTML = contactEmail;
        contactViewPhone.innerHTML = contactPhone;
        contactViewName.innerHTML = contactName;
        contactViewProfileIcon.style.backgroundColor = contact.profileColor;
        contactViewProfileIcon.innerHTML = initials;

        closeEditContact();
    } catch (error) {
        console.error('Error editing contact:', error);
    }
}