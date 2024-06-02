function openAddContact() {
    document.getElementById('contactMain').innerHTML += addContactHtml();
}

function closeAddContact() {
    document.getElementById('contactWindowBackground').remove();
}

function contactInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    getContacts();
}


/**
 * Retrieves contacts from the server and displays them on the webpage.
 * @returns {Array} An array of contact objects.
 */
async function getContacts() {
    let container = document.getElementById('contacts');
    let response = await fetch(BASE_URL + '/contacts.json');
    let responseToJson = await response.json();
    let contacts = [];
    container.innerHTML = '';

    for (const key in responseToJson) {
        let contact = responseToJson[key];
        contact.id = key;
        contacts.push(contact);
    }
    displayContacts(contacts);
    return contacts;
}


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
function saveContact() {
    let contactName = document.getElementById('contactName').value;
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    if (!namePattern.test(contactName)) {
        alert('Please enter a valid name');
        return;
    }
    let contactEmail = document.getElementById('contactEmail').value;
    let contactPhone = document.getElementById('contactPhone').value;
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];
    let initials = contactName.split(' ').map((n) => n[0]).join('');
    postData('/contacts', { 'name': contactName, 'email': contactEmail, 'phone': contactPhone, 'initials': initials, 'profileColor': randomColor });
    closeAddContact();
    getContacts();
}





