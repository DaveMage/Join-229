function goToSighUp() {
    window.location.href = "/signUp.html";
}

function focusInput(inputId) {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });
}
function resetFocus() {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = "#D1D1D1";
    });
}

function guestLogin() {
    window.location.href = "/summary.html";
    localStorage.setItem('guestLoggedIn', 'true');
}



/**
 * Retrieves contacts from the server and displays them on the webpage.
 * @returns {Array} An array of contact objects.
 */
async function getContacts() {
    let response = await fetch(BASE_URL + '/users.json');
    let responseToJson = await response.json();
    let fetchedUsers = [];

    for (const key in responseToJson) {
        let user = responseToJson[key];
        user.id = key;
        fetchedUsers.push(user);
    }

    user = fetchedUsers; // Store fetched contacts in a global variable
    return user;
}