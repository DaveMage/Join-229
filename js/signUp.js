

function focusInput(inputId) {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    let passwortImg = document.getElementById('signUpPasswortImg');
    let passwortConfirmImg = document.getElementById('signUpPasswortConfirmImg');

    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });

    passwortImg.src = inputId === 'signUpLabelPassword' ? "/img/Mobile/LogIn/visibilityOffIconLogIn.png" : "../img/Mobile/LogIn/lockIconLogIn.png";
    passwortConfirmImg.src = inputId === 'signUpLabelConfirmPassword' ? "../img/Mobile/LogIn/visibilityOffIconLogIn.png" : "../img/Mobile/LogIn/lockIconLogIn.png";
}

function showPassword() {
    let passwordInput = document.getElementById('signUpPassword');
    let passwordImg = document.getElementById('signUpPasswortImg');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordImg.classList.add('showPasswordImg');
    } else {
        passwordInput.type = 'password';
        passwordImg.classList.remove('showPasswordImg');
    }
}

function showConfirmPassword() {
    let passwortConfirmInput = document.getElementById('signUpConfirmPassword');
    let passwortConfirmImg = document.getElementById('signUpPasswortConfirmImg');

    if (passwortConfirmInput.type === 'password') {
        passwortConfirmInput.type = 'text';
        passwortConfirmImg.classList.add('showPasswordImg');
    } else {
        passwortConfirmInput.type = 'password';
        passwortConfirmImg.classList.remove('showPasswordImg');
    }
}



function resetFocus() {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = "#D1D1D1";
    });
}

function goToLogin() {
    window.location.href = "/login.html";
}

async function checkEmailAvailability(email) {
    try {
        const response = await fetch(BASE_URL + '/users.json');
        const data = await response.json();
        const users = Object.values(data);

        // Überprüfen Sie, ob ein Benutzer mit der gleichen E-Mail gefunden wurde
        const emailExists = users.some(user => user.email === email);
        console.log('Email exists:', emailExists);
        return emailExists;
    } catch (error) {
        console.error('Error checking email availability:', error);
        return false;
    }
}

function successfullyMessageHTML() {
    return `<div class="backgroundSuccessfullyMessage">
    <div id="SignUpSuccessfully" class="successfullyMessage slideInBottom">
    You Signed Up successfully
    </div>
    </div>`;
}


async function signUp() {
    let initials = getInitials();
    let name = document.getElementById('signUpName').value;
    let email = document.getElementById('signUpEmail').value;
    let password = document.getElementById('signUpPassword').value;
    let confirmPassword = document.getElementById('signUpConfirmPassword').value;

    let isEmailAvailable = await checkEmail(email);
    let isNameValid = validateName(name);
    let arePasswordsValid = validatePasswords(password, confirmPassword);

    if (isEmailAvailable && isNameValid && arePasswordsValid) {
        await createUser({ initials, name, email, password });
    }
}


function getInitials() {
    return document.getElementById('signUpName').value.split(' ').map((n) => n[0]).join('').toUpperCase();
}


async function checkEmail(email) {
    let isEmailAvailable = await checkEmailAvailability(email);
    if (isEmailAvailable) {
        showError('signUpLabelEmail', 'emailErrorSpan', "This email is already taken");
        return false;
    }
    clearError('signUpLabelEmail', 'emailErrorSpan');
    return true;
}


function validateName(name) {
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    if (!namePattern.test(name)) {
        showError('signUpLabelName', 'nameErrorSpan', "Please enter your full name");
        return false;
    }
    clearError('signUpLabelName', 'nameErrorSpan');
    return true;
}


function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        showError('signUpLabelConfirmPassword', 'passwordErrorSpan', "Ups! your password don't match");
        return false;
    }
    clearError('signUpLabelConfirmPassword', 'passwordErrorSpan');
    return true;
}


function showError(labelId, errorSpanId, message) {
    document.getElementById(labelId).classList.add("errorInput");
    let errorSpan = document.getElementById(errorSpanId);
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
}

function clearError(labelId, errorSpanId) {
    document.getElementById(labelId).classList.remove("errorInput");
    document.getElementById(errorSpanId).style.display = "none";
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

async function createUser(user) {

    try {

        await postData('/users', user);
        document.getElementById('signUpMain').innerHTML += successfullyMessageHTML();
        setTimeout(() => { window.location.href = "/login.html"; }, 800);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}
