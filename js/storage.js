const BASE_URL = 'https://join-229-c9c59-default-rtdb.europe-west1.firebasedatabase.app';
let profileColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
let contacts = [];
let tasks = [];
let users = []; 
let currentUser = [];
let selectedAssigned = [];

async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    console.log(responseToJson);
}


async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}


async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}


async function putData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
}



// Funktion, um Benutzerdaten abzurufen
async function getUser(){
    let response = await fetch(BASE_URL + '/users.json'); // API-Anfrage, um Benutzerdaten abzurufen
    let responseToJson = await response.json(); // Antwort in JSON-Format umwandeln
    let fetchedUser = []; // Array für abgerufene Benutzerdaten erstellen

    // Schleife durch die abgerufenen Benutzerdaten
    for (const key in responseToJson) {
        let user = responseToJson[key]; // Benutzerobjekt für den aktuellen Schlüssel erhalten
        user.id = key; // Benutzer-ID zum Benutzerobjekt hinzufügen
        fetchedUser.push({id: user.id, email: user.email, initial: user.initials}); // Benutzerobjekt mit ID und E-Mail-Adresse zum Array hinzufügen
    }    
    return fetchedUser; // Abgerufene Benutzerdaten zurückgeben
}



 

// Funktion, die aufgerufen wird, wenn der Login erfolgreich ist
function loginSuccess(user, rememberMe) {
    // Überprüfen, ob "rememberMe" aktiviert ist
    if (rememberMe) {
        // Benutzerdaten im lokalen Speicher speichern
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPassword', user.password);
        localStorage.setItem('userId', user.id);
    } else {
        // Nur die E-Mail-Adresse im lokalen Speicher speichern
        localStorage.setItem('userEmail', user.email);
    }
    // Benutzerobjekt im lokalen Speicher als JSON speichern
    localStorage.setItem('user', JSON.stringify(user));
    
    // Aktualisieren der "currentUser" Variable
    currentUser.push(user.id);

    // Nach erfolgreichem Login zur Dashboard-Seite oder einer anderen Seite weiterleiten
    window.location.href = "/summary.html";
}


// Funktion, um die Benutzer-ID anhand der E-Mail-Adresse zu erhalten
async function getUserIdByEmail() {
    let users = await getUser(); // Benutzerdaten abrufen
    let emailToken = localStorage.getItem('emailToken'); // E-Mail-Token aus dem lokalen Speicher abrufen
    
    if (emailToken) {
        const userEmail = atob(emailToken); // E-Mail-Adresse decodieren
        
        let user = users.find(user => user.email === userEmail); // Benutzer anhand der E-Mail-Adresse finden
        if (user) {
            let userId = user.id; // Benutzer-ID erhalten       
            currentUser.push(userId); // Benutzer-ID zum aktuellen Benutzer hinzufügen                  
            return userId; // Benutzer-ID zurückgeben
        } else {
            console.log('User not found'); // Benutzer nicht gefunden
            return null; // Null zurückgeben
        }
    } else {
        console.log('Email token not found in local storage');
        return null;
    }
}


/**
 * Retrieves contacts from the server and displays them on the webpage.
 * @returns {Array} An array of contact objects.
 */
async function getContacts() {
    let userId = await getUserIdByEmail(); // Wait for the user ID   

    let response = await fetch(BASE_URL + '/users/' + userId + '/contacts.json'); // Fetch contacts from the server
    let responseToJson = await response.json(); // Convert the response to JSON format
    let fetchedContacts = [];

    for (const key in responseToJson) { // Iterate through each key in the response JSON object
        let contact = responseToJson[key]; // Get the contact object
        contact.id = key; // Assign the key as the contact ID
        fetchedContacts.push(contact); // Add the contact to the fetchedContacts array
    }

    contacts = fetchedContacts; // Store fetched contacts in a global variable   
    return contacts; // Return the fetched contacts array
}





