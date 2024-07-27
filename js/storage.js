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
};


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
};


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
};


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
};



async function setSubtaskTrue(taskId, subtaskId) {
    let userId = await getUserId();
    let task = tasks.find(task => task.id === taskId);
    let subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
    subtask.done = true;
    await putData('/users/' + userId + '/tasks/' + taskId + '/subtasks/' + subtaskId, subtask);
};


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


function validateFormData(formData) {
    if (formData.title === '' || formData.date === '') {
        titlequery();
        datequery();
        return false;
    }
    return true;
};


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
    if (window.location.pathname === '/board.html') {
        displaySuccsessfullyBoardMessage();
        window.location.reload();
    }
};

