function goToSighUp() {
    window.location.href = "./signUp.html";
};


function focusInput(inputId) {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });
};


function resetFocus() {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = "#D1D1D1";
    });
};


async function createUser(user) {
    try {
        await postData('/users', user);
        document.getElementById('signUpMain').innerHTML += successfullyMessageHTML();
        setTimeout(() => { window.location.href = "/login.html"; }, 800);
    } catch (error) {
        console.error('Error creating user:', error);
    }
};


async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let rememberMe = document.getElementById('checkboxRemember').checked;

    if (email == '' && password == '') {
        showError('loginLabelEmail', 'emailErrorSpan', 'Please enter your email address!')
        showError('loginLabelPassword', 'passwordErrorSpan', 'Please enter your password!')
    } else if (password == '') {
        showError('loginLabelPassword', 'passwordErrorSpan', 'Please enter your password!')
    } else if (email == '') {
        showError('loginLabelEmail', 'emailErrorSpan', 'Please enter your email address!')
    } else {
        try {
            let users = await getUser();
            let user = users.find(user => user.email === email && user.password === password);
            if (user) {
                if (rememberMe) {
                    localStorage.setItem('emailToken', btoa(email));
                    localStorage.setItem('passwordToken', btoa(password));
                } else {
                    localStorage.removeItem('emailToken');
                    localStorage.removeItem('passwordToken');
                }
                window.location.href = "/greeting.html";
            } else {
                showError('', 'passwordAndMailErrorSpan', 'Please enter your correct email address and password!')
                // console.log('User not found');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
};


function showError(labelId, errorSpanId, message) {
    if (labelId == '') {
        document.getElementById('loginLabelEmail').classList.add("errorInput");
        document.getElementById('loginLabelPassword').classList.add("errorInput");
        let errorSpan = document.getElementById(errorSpanId);
        errorSpan.style.display = "block";
        errorSpan.textContent = message;
    } else {
        document.getElementById(labelId).classList.add("errorInput");
        let errorSpan = document.getElementById(errorSpanId);
        errorSpan.style.display = "block";
        errorSpan.textContent = message;
    }
};


async function guestLogin() {
    let respnose = await fetch(BASE_URL + '/users/-O-Mr5g8976g5-yCxVK8.json');

    if (respnose.ok) {
        localStorage.setItem('guestLoggedIn', 'true');
        window.location.href = "/greeting.html";
    } else {
        console.error('Error during guest login:', error);
    }
};


function displayUserEmailPassword() {
    let emailToken = localStorage.getItem('emailToken');
    let passwordToken = localStorage.getItem('passwordToken');
    if (emailToken && passwordToken) {
        const email = atob(emailToken);
        const password = atob(passwordToken);
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
    }
};


function disableLoginButton() {
    let form = document.getElementById('loginForm');
    let fields = form.querySelectorAll('#loginEmail, #loginPassword');
    let submitBtn = document.getElementById('submitBtn');

    function checkFormCompletion() {
        let allFilled = true;
        fields.forEach(field => {
            if (!field.value.trim()) {
                allFilled = false;
                }
            });
            submitBtn.disabled = !allFilled;
        }

        fields.forEach(field => {
            field.addEventListener('input', checkFormCompletion);
    });

    checkFormCompletion();
};