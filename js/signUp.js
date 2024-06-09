

function focusInput(inputId) {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    let passwortImg = document.getElementById('signUpPasswortImg');
    let passwortConfirmImg = document.getElementById('signUpPasswortConfirmImg');

    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });

    if (inputId === 'signUpLabelPassword') {
        passwortImg.src = "/img/Mobile/LogIn/visibilityOffIconLogIn.png";
    } else {
        passwortImg.src = "../img/Mobile/LogIn/lockIconLogIn.png";
    }

    if (inputId === 'signUpLabelConfirmPassword') {
        passwortConfirmImg.src = "../img/Mobile/LogIn/visibilityOffIconLogIn.png";
    } else {
        passwortConfirmImg.src = "../img/Mobile/LogIn/lockIconLogIn.png";
    }
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

function signUp() {

    let name = document.getElementById('signUpName').value;
    let email = document.getElementById('signUpEmail').value;
    let password = document.getElementById('signUpPassword').value;
    let confirmPassword = document.getElementById('signUpConfirmPassword').value;
    console.log(name, email, password, confirmPassword);

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("Please fill in all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    document.getElementById('signUpMain').innerHTML += successfullyMessageHTML();
    setTimeout(() => {
        window.location.href = "/login.html";
    }, 800);

}

function successfullyMessageHTML() {
    return `<div class="backgroundSuccessfullyMessage">
    <div id="SignUpSuccessfully" class="successfullyMessage slideInBottom">
    You Signed Up successfully
    </div>
    </div>`;
}

function fullnameValidation() {
    let signUpName = document.getElementById('signUpName').value;
    const namePattern = /^[A-Za-zÄäÖöÜüß]+(?:\s[A-Za-zÄäÖöÜüß]+)+$/;
    let signUpLabelName = document.getElementById('signUpLabelName');
    let errorSpan = document.getElementById('nameErrorSpan');

    if (!namePattern.test(signUpName)) {
        signUpLabelName.classList.add("errorInput");
        errorSpan.textContent = "Please enter your full name";
        errorSpan.style.display = "block";
        return;
    }

    signUpLabelName.classList.remove("errorInput");
    errorSpan.style.display = "none";
}

function passwordValidation() {
    let signUpPassword = document.getElementById('signUpPassword').value;
    let signUpConfirmPassword = document.getElementById('signUpConfirmPassword').value;
    let signUpLabelConfirmPassword = document.getElementById('signUpLabelConfirmPassword');
    let errorSpan = document.getElementById('passwordErrorSpan');

    if (signUpPassword !== signUpConfirmPassword) {
        signUpLabelConfirmPassword.classList.add("errorInput");
        errorSpan.textContent = "Ups! yopur password dont´t match";
        errorSpan.style.display = "block";
        return;
    }

    if (signUpPassword === signUpConfirmPassword) {
        signUpLabelConfirmPassword.classList.remove("errorInput");
        errorSpan.style.display = "none";
    }

    signUpConfirmPassword.classList.remove("errorInput");
    errorSpan.style.display = "none";
}