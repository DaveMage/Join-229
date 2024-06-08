
function focusInput(inputId) {
    const ids = ["signUpLabelName", "signUpLabelEmail", "signUpLabelPassword", "signUpLabelConfirmPassword"];
    ids.forEach(id => {
        document.getElementById(id).style.borderColor = id === inputId ? "#29ABE2" : "#D1D1D1";
    });
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

    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields');
        return;// name nur als Fullname
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');//auslagern und als onchange event setzen
        return;
    }

    try {
        postData('/users', {
            'name': name,
            'email': email,
            'password': password
        });

        alert('Sign up successful');// animation einbauen
    } catch (error) {
        console.error('Error signing up:', error);
    }



}