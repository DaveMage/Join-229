const BASE_URL = 'https://join-229-c9c59-default-rtdb.europe-west1.firebasedatabase.app';
let profileColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']
let contacts = [];
let tasks = [];
let users = [];
let selectedAssigned = [];
let subtasks = [];


/**
 * Fetches data from a specified endpoint and converts it to JSON format.
 *
 * This asynchronous function retrieves data from a given path appended to a base URL.
 * The data is then converted to a JSON object. This function is useful for fetching
 * data from APIs or other data sources.
 *
 * @param {string} path - The path to append to the base URL for fetching data. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the JSON data fetched from the specified path.
 */
async function loadData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Retrieves data from a specified endpoint and converts it to JSON format.
 *
 * This asynchronous function fetches data from a given path appended to a base URL,
 * converts the response to JSON format, and returns the resulting object.
 *
 * @param {string} path - The path to append to the base URL for fetching data. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the JSON data fetched from the specified path.
 */
async function getData(path = '') {
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Sends updated data to a specified endpoint using the HTTP PUT method.
 *
 * This asynchronous function sends JSON data to a given path appended to a base URL
 * using the HTTP PUT method. It handles errors by catching exceptions and logging them.
 *
 * @param {string} path - The path to append to the base URL for sending data. Defaults to an empty string.
 * @param {Object} data - The data object to be sent to the server. Defaults to an empty object.
 * @returns {Promise<Object>} A promise that resolves to the JSON response data from the server.
 * @throws Will throw an error if the network response is not ok or if any other error occurs.
 */
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
}


/**
 * Deletes data from a specified endpoint.
 *
 * This asynchronous function sends a DELETE request to a given path appended to a base URL.
 * It returns the JSON response from the server.
 *
 * @param {string} path - The path to append to the base URL for deleting data. Defaults to an empty string.
 * @returns {Promise<Object>} A promise that resolves to the JSON response data from the server.
 */
async function deleteData(path = '') {
    let response = await fetch(BASE_URL + path + '.json', {
        method: 'DELETE',
    });
    return responseToJson = await response.json();
}


/**
 * Sends new data to a specified endpoint using the HTTP POST method.
 *
 * This asynchronous function sends JSON data to a given path appended to a base URL
 * using the HTTP POST method. It returns the JSON response from the server.
 *
 * @param {string} path - The path to append to the base URL for posting data. Defaults to an empty string.
 * @param {Object} data - The data object to be sent to the server. Defaults to an empty object.
 * @returns {Promise<Object>} A promise that resolves to the JSON response data from the server.
 */
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


/**
 * Retrieves user data from the server and stores it locally.
 *
 * This asynchronous function fetches user data from the server, converts it to JSON format,
 * and stores the users in a global array. It also assigns an ID to each user.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
async function getUser() {
    let response = await fetch(BASE_URL + '/users.json');
    let responseToJson = await response.json();
    users = [];

    for (const key in responseToJson) {
        let user = responseToJson[key];
        user.id = key;
        users.push(user);
    }
    return users;
}


/**
 * Handles successful login and stores user data in localStorage.
 *
 * This function stores the logged-in user's email and optionally password and ID in localStorage,
 * depending on whether the 'remember me' option is selected. It then redirects the user to the summary page.
 *
 * @param {Object} user - The user object containing user information.
 * @param {boolean} rememberMe - A boolean indicating whether to remember the user's login details.
 */
function loginSuccess(user, rememberMe) {
    if (rememberMe) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPassword', user.password);
        localStorage.setItem('userId', user.id);
    } else {
        localStorage.setItem('userEmail', user.email);
    }
    localStorage.setItem('user', JSON.stringify(user));
    currentUser.push(user.id);
    window.location.href = "/summary.html";
}


/**
 * Retrieves contacts for the logged-in user.
 *
 * This asynchronous function fetches contact data for the logged-in user from the server,
 * converts it to JSON format, and stores the contacts in a global array.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of contact objects.
 */
async function getContacts() {
    await getUser();
    let userId = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8';
    } else {
        userId = userId.id;
    }
    let response = await fetch(BASE_URL + '/users/' + userId + '/contacts.json');
    let contactsJson = await response.json();
    contacts = [];
    for (const key in contactsJson) {
        let contact = contactsJson[key];
        contact.id = key;
        contacts.push(contact);
    }
    return contacts;
}


/**
 * Retrieves tasks for the logged-in user.
 *
 * This asynchronous function fetches task data for the logged-in user from the server,
 * converts it to JSON format, and stores the tasks in a global array.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of task objects.
 */
async function getTask() {
    let userId = await getUserId();
    let response = await fetch(BASE_URL + '/users/' + userId + '/tasks.json');
    let responseToJson = await response.json();
    tasks = [];
    for (const key in responseToJson) {
        let task = responseToJson[key];
        task.id = key;
        tasks.push(task);
    }
    return tasks;
}


/**
 * Marks a subtask as completed.
 *
 * This asynchronous function updates the status of a specific subtask to 'done',
 * and then sends the updated subtask data to the server.
 *
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskId - The ID of the subtask to be marked as completed.
 */
async function setSubtaskTrue(taskId, subtaskId) {
    let userId = await getUserId();
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
    subtask.done = true;
    await putData('/users/' + userId + '/tasks/' + taskId + '/subtasks/' + subtaskId, subtask);
}


/**
 * Retrieves form data for creating or editing a task.
 *
 * This function collects and returns data from the task form inputs,
 * including title, date, description, priority, category, assigned contacts, and subtasks.
 *
 * @returns {Object} An object containing the form data.
 */
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
}


/**
 * Retrieves the ID of the currently logged-in user.
 *
 * This asynchronous function decodes the user's email from localStorage and finds the corresponding user ID.
 * If a guest is logged in, it returns a predefined guest ID.
 *
 * @returns {Promise<string>} A promise that resolves to the user's ID or null if not found.
 */
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
}


/**
 * Validates form data for creating or editing a task.
 *
 * This function checks if the required fields (title and date) are filled.
 * If not, it triggers appropriate validation functions and returns false.
 *
 * @param {Object} formData - The form data object to be validated.
 * @returns {boolean} True if the form data is valid, otherwise false.
 */
function validateFormData(formData) {
    if (formData.title === '' || formData.date === '') {
        titlequery();
        datequery();
        return false;
    }
    return true;
}


/**
 * Saves a new task or updates an existing task.
 *
 * This asynchronous function collects form data, validates it, and sends it to the server.
 * It handles both creating new tasks and updating existing ones, and redirects the user
 * to the appropriate page upon successful save.
 *
 * @param {string} taskStatus - The status to assign to the task (e.g., 'inProgress', 'awaitFeedback', 'open').
 */
async function saveTask(taskStatus) {
    let formData = getFormData();

    if (!validateFormData(formData)) return;

    try {
        let userId = await getUserId();
        if (!userId) throw new Error('User ID not found');

        await postData(`/users/${userId}/tasks`, {
            ...formData,
            status: taskStatus === 'inProgress' ? 'inProgress' : taskStatus === 'awaitFeedback' ? 'awaitFeedback' : 'open'
        });

        handleAddTaskChard();
        handlePageRedirection();

    } catch (error) {
        console.error('Error saving task:', error);
    }
}


function handleAddTaskChard() {
    if (document.getElementById('addTaskChard')) {
        document.getElementById('addTaskChard').remove();
    }
}


function handlePageRedirection() {
    if (window.location.pathname === '/addTask.html') {
        window.location.href = '/board.html';
    } else if (window.location.pathname === '/board.html') {
        displaySuccsessfullyBoardMessage();
        window.location.reload();
    }
}


