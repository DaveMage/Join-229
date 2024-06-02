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
}

/**
 * Displays the contacts in the provided array on the webpage.
 * 
 * @param {Array} contacts - The array of contacts to be displayed.
 * @returns {Array} - The same array of contacts.
 */
function displayContacts(contacts){
    let container = document.getElementById('contacts');

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let contactHtml = contactListItemHtml(contact);
        container.innerHTML += contactHtml;
    }
    return contacts;
}


/**
 * Saves a contact by retrieving the contact name, email, and phone from the input fields,
 * generates a random profile color, and sends a POST request to the '/contacts' endpoint
 * with the contact details. Then, it closes the add contact form and updates the contacts list.
 */
function saveContact() {
    let contactName = document.getElementById('contactName').value;
    let contactEmail = document.getElementById('contactEmail').value;
    let contactPhone = document.getElementById('contactPhone').value;
    let randomColor = profileColor[Math.floor(Math.random() * profileColor.length)];
    let initials = contactName.split(' ').map((n) => n[0]).join('');
    postData('/contacts', { 'name': contactName, 'email': contactEmail, 'phone': contactPhone, 'initials': initials, 'profileColor': randomColor });
    closeAddContact();
    getContacts();
}



