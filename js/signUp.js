/**
 * Highlights the selected input field and adjusts related icons for the sign-up form.
 *
 * This function sets the border color of the selected input field to a highlight color,
 * and resets the border color of other fields. It also changes the icon for the password
 * and confirm password fields based on the selected input.
 *
 * @param {string} inputId - The ID of the input field to highlight.
 */
function focusInput(inputId) {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    let passwortImg = document.getElementById('signUpPasswortImg');
    let passwortConfirmImg = document.getElementById('signUpPasswortConfirmImg');

    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });

    passwortImg.src = inputId === 'signUpLabelPassword' ? "/img/Mobile/LogIn/visibilityOffIconLogIn.png" : "./img/Mobile/LogIn/lockIconLogIn.png";
    passwortConfirmImg.src = inputId === 'signUpLabelConfirmPassword' ? "./img/Mobile/LogIn/visibilityOffIconLogIn.png" : "./img/Mobile/LogIn/lockIconLogIn.png";
}


/**
 * Toggles the visibility of the password input field in the sign-up form.
 *
 * This function changes the input type of the password field between 'text' and 'password'
 * to show or hide the password. It also adjusts the icon associated with the password field.
 */
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


/**
 * Toggles the visibility of the confirm password input field in the sign-up form.
 *
 * This function changes the input type of the confirm password field between 'text' and 'password'
 * to show or hide the password. It also adjusts the icon associated with the confirm password field.
 */
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


/**
 * Resets the border color of all input fields in the sign-up form to the default color.
 *
 * This function removes any highlight from the input fields, returning them to the default
 * border color, typically used when the user clicks away from the input fields.
 */
function resetFocus() {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = "#D1D1D1";
    });
}


/**
 * Redirects the user to the login page.
 *
 * This function navigates the browser to the login page when called.
 */
function goToLogin() {
    window.location.href = "./login.html";
}


/**
 * Returns the HTML content for a successful sign-up message.
 *
 * This function provides the HTML structure for displaying a success message after
 * the user has successfully signed up.
 *
 * @returns {string} The HTML content for the success message.
 */
function successfullyMessageHTML() {
    return `<div class="backgroundSuccessfullyMessage">
    <div id="SignUpSuccessfully" class="successfullyMessage slideInBottom">
    You Signed Up successfully
    </div>
    </div>`;
}


/**
 * Handles the user sign-up process.
 *
 * This asynchronous function gathers form data, validates it, and creates a new user account
 * if the data is valid and the email is available. It also handles displaying errors.
 */
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


/**
 * Extracts and returns the initials from the user's name input.
 *
 * This function takes the value from the name input field, splits it into words,
 * and returns the initials in uppercase.
 *
 * @returns {string} The initials of the user's name.
 */
function getInitials() {
    return document.getElementById('signUpName').value.split(' ').map((n) => n[0]).join('').toUpperCase();
}


/**
 * Checks if the provided email is available for registration.
 *
 * This asynchronous function verifies if the email is not already in use by checking
 * the database. It shows an error if the email is taken, and clears the error if available.
 *
 * @param {string} email - The email to check for availability.
 * @returns {Promise<boolean>} A promise that resolves to true if the email is available, otherwise false.
 */
async function checkEmail(email) {
    let isEmailAvailable = await checkEmailAvailability(email);
    if (isEmailAvailable) {
        showError('signUpLabelEmail', 'emailErrorSpan', "This email is already taken");
        return false;
    }
    clearError('signUpLabelEmail', 'emailErrorSpan');
    return true;
}


/**
 * Validates the user's name input.
 *
 * This function checks if the name input matches a pattern for full names (first and last name).
 * It shows an error if the validation fails, and clears the error if valid.
 *
 * @param {string} name - The name input to validate.
 * @returns {boolean} True if the name is valid, otherwise false.
 */
function validateName(name) {
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    if (!namePattern.test(name)) {
        showError('signUpLabelName', 'nameErrorSpan', "Please enter your full name");
        return false;
    }
    clearError('signUpLabelName', 'nameErrorSpan');
    return true;
}


/**
 * Checks if an email is already registered in the system.
 *
 * This asynchronous function fetches the list of users from the database and checks
 * if the provided email is already in use.
 *
 * @param {string} email - The email to check for availability.
 * @returns {Promise<boolean>} A promise that resolves to true if the email exists, otherwise false.
 */
async function checkEmailAvailability(email) {
    try {
        const response = await fetch(BASE_URL + '/users.json');
        const data = await response.json();
        const users = Object.values(data);
        const emailExists = users.some(user => user.email === email);
        return emailExists;
    } catch (error) {
        console.error('Error checking email availability:', error);
        return false;
    }
}


/**
 * Clears error messages and styles from the specified input label and error span.
 *
 * This function removes the error styling and hides the error message associated with
 * the specified input field.
 *
 * @param {string} labelId - The ID of the input label element.
 * @param {string} errorSpanId - The ID of the error span element.
 */
function clearError(labelId, errorSpanId) {
    document.getElementById(labelId).classList.remove("errorInput");
    document.getElementById(errorSpanId).style.display = "none";
}


/**
 * Displays an error message for the specified input field.
 *
 * This function applies error styling to the input field and displays the provided
 * error message in the corresponding error span element.
 *
 * @param {string} labelId - The ID of the input label element.
 * @param {string} errorSpanId - The ID of the error span element.
 * @param {string} message - The error message to display.
 */
function showError(labelId, errorSpanId, message) {
    document.getElementById(labelId).classList.add("errorInput");
    let errorSpan = document.getElementById(errorSpanId);
    errorSpan.textContent = message;
    errorSpan.style.display = "block";
}


/**
 * Validates that the password and confirm password fields match.
 *
 * This function checks if the provided password and confirm password inputs match.
 * It shows an error if they do not match and clears the error if they do.
 *
 * @param {string} password - The password input.
 * @param {string} confirmPassword - The confirm password input.
 * @returns {boolean} True if the passwords match, otherwise false.
 */
function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        showError('signUpLabelConfirmPassword', 'passwordErrorSpan', "Ups! your password don't match");
        return false;
    }
    clearError('signUpLabelConfirmPassword', 'passwordErrorSpan');
    return true;
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
 * Disables the sign-up button if the form is incomplete.
 *
 * This function checks if all required fields in the sign-up form are filled.
 * It enables or disables the submit button based on the form's completeness.
 */
function disableSignButton() {
    let form = document.getElementById('signUpForm');
    let submitBtn = document.getElementById('submitBtn');
    let fields = form.querySelectorAll('#signUpName, #signUpEmail, #signUpPassword, #signUpConfirmPassword');

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
