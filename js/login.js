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





async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(BASE_URL + '/users.json');
        const data = await response.json();
        const users = Object.values(data);

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            loginSuccess(user)
        } else {
            showError('loginLabelEmail', 'loginErrorSpan', "Invalid email or password");
        }
    } catch (error) {
        console.error('Error during login:', error);
        showError('loginLabelEmail', 'loginErrorSpan', "An error occurred. Please try again.");
    }
}

function loginSuccess(user) {
    // Here you can set the user data in the session or local storage
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect to the dashboard or another page after successful login
    window.location.href = "/summary.html";
}

