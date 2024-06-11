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


let user = [];



async function getUser(){
    let response = await fetch(BASE_URL + '/users.json');
    let responseToJson = await response.json();
    let fetchedUser = [];

    for (const key in responseToJson) {
        let user = responseToJson[key];
        user.id = key;
        fetchedUser.push({id: user.id, email: user.email});
    }

    console.log(fetchedUser);
    return fetchedUser;
}
 
function loginSuccess(user, rememberMe) {
    if (rememberMe) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userPassword', user.password);
        localStorage.setItem('userId', user.id);
    } else {
        localStorage.setItem('userEmail', user.email);
    }
    localStorage.setItem('user', JSON.stringify(user));
    
    // Update the currentUser variable
    currentUser.push(user.id);

    // Redirect to the dashboard or another page after successful login
    window.location.href = "/summary.html";
}

async function getUser(){
    let response = await fetch(BASE_URL + '/users.json');
    let responseToJson = await response.json();
    let fetchedUser = [];

    for (const key in responseToJson) {
        let user = responseToJson[key];
        user.id = key;
        fetchedUser.push({id: user.id, email: user.email});
    }

    console.log(fetchedUser);
    return fetchedUser;
}

async function getUserIdByEmail() {
    let users = await getUser();
    let userEmail = localStorage.getItem('userEmail');
    let user = users.find(user => user.email === userEmail);
    if (user) {
        let userId = user.id;
        console.log('User ID:', userId);
        currentUser.push(userId);
        console.log('Current User:', currentUser);
        return userId;
    } else {
        console.log('User not found');
        return null;
    }
}

let currentUser = [];


