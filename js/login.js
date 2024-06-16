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

async function createUser(user) {

    try {

        await postData('/users', user);
        document.getElementById('signUpMain').innerHTML += successfullyMessageHTML();
        setTimeout(() => { window.location.href = "/login.html"; }, 800);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

function guestLogin() {
    let initials = 'G';
    let name = 'Guest';
    let email = 'guest@mail.com';

    createUser({ initials, name, email});

    window.location.href = "/summary.html";
}


async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let rememberMe = document.getElementById('checkboxRemember').checked;

    try {
        const response = await fetch(BASE_URL + '/users.json');
        const data = await response.json();
        
        // Check for user authentication separately
        const user = Object.values(data).find(user => user.email === email && user.password === password);

        if (user) {
            if (rememberMe) {
                storeTokens(email, password); // Store email and password separately as tokens
            }
            loginSuccess(user);
        } else {
            console.error('Invalid email or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}

function storeTokens(email, password) {
    // Basic token generation using Base64 encoding
    const emailToken = btoa(email);
    console.log(emailToken);
    const passwordToken = btoa(password);
    localStorage.setItem('emailToken', emailToken);
    localStorage.setItem('passwordToken', passwordToken);
}

function loginSuccess(user) {
    localStorage.setItem('user', JSON.stringify(user));
    // Redirect to the dashboard or another page after successful login
    window.location.href = "/summary.html";
}

function displayUserEmailPassword() {
    let emailToken = localStorage.getItem('emailToken');
    let passwordToken = localStorage.getItem('passwordToken');
    if (emailToken && passwordToken) {
        const email = atob(emailToken);
        const password = atob(passwordToken);
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
    }
}





