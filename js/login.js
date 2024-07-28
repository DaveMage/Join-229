/**
 * Redirects the user to the sign-up page.
 *
 * This function navigates the browser to the sign-up page when called.
 */
function goToSighUp() {
    window.location.href = "./signUp.html";
}


/**
 * Highlights the selected input field and resets others for the login form.
 *
 * This function sets the border color of the selected input field to a highlight color,
 * and resets the border color of other fields to the default color.
 *
 * @param {string} inputId - The ID of the input field to highlight.
 */
function focusInput(inputId) {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });
}


/**
 * Resets the border color of all input fields in the login form to the default color.
 *
 * This function removes any highlight from the input fields, returning them to the default
 * border color, typically used when the user clicks away from the input fields.
 */
function resetFocus() {
    const ids = ["loginLabelEmail", "loginLabelPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = "#D1D1D1";
    });
}


/**
 * Creates a new user account with the provided user data.
 *
 * This asynchronous function sends the user data to the server to create a new user account.
 * Upon successful creation, it displays a success message and redirects to the login page.
 *
 * @param {Object} user - The user data to create the account.
 */
async function createUser(user) {
    try {
        await postData('/users', user);
        document.getElementById('signUpMain').innerHTML += successfullyMessageHTML();
        setTimeout(() => { window.location.href = "/login.html"; }, 800);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}


/**
 * Handles the user login process.
 *
 * This asynchronous function checks the user's email and password, validates them, and if correct,
 * logs the user in by storing the credentials and redirecting to a greeting page. It also displays errors if any.
 */
async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let rememberMe = document.getElementById('checkboxRemember').checked;

    if (email === '' && password === '') {
        showError('loginLabelEmail', 'emailErrorSpan', 'Please enter your email address!');
        showError('loginLabelPassword', 'passwordErrorSpan', 'Please enter your password!');
    } else if (password === '') {
        showError('loginLabelPassword', 'passwordErrorSpan', 'Please enter your password!');
    } else if (email === '') {
        showError('loginLabelEmail', 'emailErrorSpan', 'Please enter your email address!');
    } else {
        try {
            let users = await getUser();
            let user = users.find(user => user.email === email && user.password === password);
            if (user) {
                localStorage.setItem('emailToken', btoa(email)); // Always store email

                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('passwordToken', btoa(password));
                } else {
                    localStorage.removeItem('passwordToken');
                    localStorage.setItem('rememberMe', 'false');
                }
                
                window.location.href = "/greeting.html";
            } else {
                showError('', 'passwordAndMailErrorSpan', 'Please enter your correct email address and password!');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    }
}



/**
 * Displays an error message for the specified input field.
 *
 * This function applies error styling to the input field and displays the provided
 * error message in the corresponding error span element.
 *
 * @param {string} labelId - The ID of the input label element. Can be empty if showing a general error.
 * @param {string} errorSpanId - The ID of the error span element.
 * @param {string} message - The error message to display.
 */
function showError(labelId, errorSpanId, message) {
    if (labelId === '') {
        document.getElementById('loginLabelEmail').classList.add("errorInput");
        document.getElementById('loginLabelPassword').classList.add("errorInput");
    } else {
        document.getElementById(labelId).classList.add("errorInput");
    }
    let errorSpan = document.getElementById(errorSpanId);
    errorSpan.style.display = "block";
    errorSpan.textContent = message;
}


/**
 * Logs in as a guest user.
 *
 * This asynchronous function fetches the guest user data and sets the localStorage to indicate
 * that a guest is logged in. It then redirects to the greeting page.
 */
async function guestLogin() {
    try {
        let response = await fetch(BASE_URL + '/users/-O-Mr5g8976g5-yCxVK8.json');
        if (response.ok) {
            localStorage.setItem('guestLoggedIn', 'true');
            window.location.href = "/greeting.html";
        } else {
            console.error('Error during guest login:', response.statusText);
        }
    } catch (error) {
        console.error('Error during guest login:', error);
    }
}


/**
 * Displays the saved email and password in the login form if they exist in localStorage.
 *
 * This function retrieves the email and password tokens from localStorage, decodes them,
 * and sets the values in the login form fields.
 */
function displayUserEmailPassword() {
    const rememberMe = localStorage.getItem('rememberMe');
    let emailToken = localStorage.getItem('emailToken');
    let passwordToken = localStorage.getItem('passwordToken');

    if (rememberMe === 'true' && emailToken && passwordToken) {
        const email = atob(emailToken);
        const password = atob(passwordToken);
        document.getElementById('loginEmail').value = email;
        document.getElementById('loginPassword').value = password;
    }
}



/**
 * Disables the login button if the form is incomplete.
 *
 * This function checks if all required fields in the login form are filled.
 * It enables or disables the submit button based on the form's completeness.
 */
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
}