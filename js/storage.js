const BASE_URL = 'https://join-229-c9c59-default-rtdb.europe-west1.firebasedatabase.app';
let profileColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
let contacts = [];
let tasks = [];
let users = []; 
let selectedAssigned = [];
let subtasks = [];


async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    // console.log(responseToJson);
};


async function getData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
};


async function putData(path = '', data = {}) {
    try {
        let response = await fetch(`${BASE_URL}${path}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('Error putting data:', error);
        throw error;
    }
};


async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
};


async function postData(path = '', data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'POST',
        header: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return responseToJson = await response.json();
};


async function getUser(){  // Funktion, um Benutzerdaten abzurufen
    let response = await fetch(BASE_URL + '/users.json'); // API-Anfrage, um Benutzerdaten abzurufen
    let responseToJson = await response.json(); // Antwort in JSON-Format umwandeln
    users = []; // Array für abgerufene Benutzerdaten erstellen

    for (const key in responseToJson) {    // Schleife durch die abgerufenen Benutzerdaten
        let user = responseToJson[key]; // Benutzerobjekt für den aktuellen Schlüssel erhalten
        user.id = key; // Benutzer-ID zum Benutzerobjekt hinzufügen
        users.push(user); // Benutzerobjekt mit ID und E-Mail-Adresse zum Array hinzufügen
    }    
    return users; // Abgerufene Benutzerdaten zurückgeben  
};


function loginSuccess(user, rememberMe) {       // Funktion, die aufgerufen wird, wenn der Login erfolgreich ist
    if (rememberMe) {    // Überprüfen, ob "rememberMe" aktiviert ist
        localStorage.setItem('userEmail', user.email);        // Benutzerdaten im lokalen Speicher speichern
        localStorage.setItem('userPassword', user.password);
        localStorage.setItem('userId', user.id);
    } else {
        localStorage.setItem('userEmail', user.email);        // Nur die E-Mail-Adresse im lokalen Speicher speichern
    }
    localStorage.setItem('user', JSON.stringify(user));    // Benutzerobjekt im lokalen Speicher als JSON speichern
    currentUser.push(user.id);    // Aktualisieren der "currentUser" Variable
    window.location.href = "/summary.html";    // Nach erfolgreichem Login zur Dashboard-Seite oder einer anderen Seite weiterleiten
};


async function getContacts() {
    await getUser();
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    if(guestLoggedIn === 'true'){
        userId = '-O-Mr5g8976g5-yCxVK8';
    } else { 
        userId = userId.id;
    }       
    let response = await fetch(BASE_URL + '/users/' + userId + '/contacts.json'); // Fetch contacts from the server
    let contactsJson = await response.json(); // Convert the response to JSON format
    contacts = []; // Define an array to store the contacts
    for (const key in contactsJson) { // Iterate through each key in the response JSON object
        let contact = contactsJson[key]; // Get the contact object
        contact.id = key; // Assign the key as the contact ID
        contacts.push(contact); // Add the contact to the fetchedContacts array
    }   
    return contacts; // Return the fetched contacts array
};


async function getTask() {
    let userId = await getUserId();  
    let response = await fetch(BASE_URL + '/users/' + userId + '/tasks.json'); // Fetch tasks from the server
    let responseToJson = await response.json(); // Convert the response to JSON format
    tasks = [];
    for (const key in responseToJson) { // Iterate through each key in the response JSON object
        let task = responseToJson[key]; // Get the task object
        task.id = key; // Assign the key as the task ID
        tasks.push(task); // Add the task to the fetchedtask array
    }
    return tasks; // Return the fetched tasks array
};



async function setSubtaskTrue(taskId, subtaskId){
    let userId = await getUserId();   
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
    subtask.done = true;
    await putData('/users/' + userId + '/tasks/' + taskId + '/subtasks/' + subtaskId, subtask);
};


// Funktion zum Abrufen von Formulardaten
function getFormData() {
    return {
        title: document.getElementById('addTaskTitle').value,
        date: document.getElementById('addTaskDueDate').value,
        description: document.getElementById('addTaskDescription').value,
        prio: getSelectedPriority(),
        category: document.getElementById('addTaskCategory').value,
        assigned: selectedAssigned,
        subtasks: subtasks.map(subtask => ({ name: subtask, completed: false })) // Ensure subtasks are stored as objects
    };
};


// Funktion zum Abrufen der Benutzer-ID
async function getUserId() {
    await getUser();
    let emailToken = localStorage.getItem('emailToken');
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    
    if (guestLoggedIn === 'true') {
        return '-O-Mr5g8976g5-yCxVK8';
    } else {
        let decodedEmail = atob(emailToken);
        let user = users.find(user => user.email === decodedEmail);
        return user ? user.id : null;
    }
};


// Funktion zum Überprüfen der Formulardaten
function validateFormData(formData) {
    if (formData.title === '' || formData.date === '') {
        titlequery();
        datequery();
        // console.log("error");
        return false;
    }
    return true;
};


// Funktion zum Speichern der Aufgabe
async function saveTask(taskStatus) {
    let formData = getFormData();

    if (!validateFormData(formData)) {
        return;
    }
    try {
        let userId = await getUserId();

        if (!userId) {
            throw new Error('User ID not found');
        }
        await postData(`/users/${userId}/tasks`, {
            title: formData.title,
            description: formData.description,
            assigned: formData.assigned,
            date: formData.date,
            priority: formData.prio,
            category: formData.category,
            subtasks: formData.subtasks,
            status: ((taskStatus == 'inProgress') ? ('inProgress') : (taskStatus == 'awaitFeedback') ? ('awaitFeedback') : ('open'))
        });
                
        if (document.getElementById('addTaskChard')) {
            document.getElementById('addTaskChard').remove();
        }
        if (window.location.pathname === '/addTask.html') {
            window.location.href = '/board.html';
        }
         
    } catch (error) {
        console.error('Error saving task:', error);
    }

    if (window.location.pathname === '/addTask.html') {
        displaySuccsessfullyMessage();
    }
    if(window.location.pathname === '/board.html'){
        displaySuccsessfullyBoardMessage();
    }
    updateBoardHtml();
};

