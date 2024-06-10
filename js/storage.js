const BASE_URL = 'https://join-229-c9c59-default-rtdb.europe-west1.firebasedatabase.app';
let contacts = [];
let tasks = [];
let users = []; 

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

let profileColor = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B']


/**
 * Retrieves users from the server and displays them on the webpage.
 * @returns {Array} An array of user objects.
 */
async function getUsers() {
    let response = await fetch(BASE_URL + '/users.json');
    let responseToJson = await response.json();
    let fetchedUsers = [];

    for (const key in responseToJson) {
        let user = responseToJson[key];
        user.id = key;
        fetchedUsers.push(user);
    }

    users = fetchedUsers; // Store fetched contacts in a global variable
    return users;
}





