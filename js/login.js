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




async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;
    let rememberMe = document.getElementById('checkboxRemember').checked;

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
            window.location.href = "/summary.html";            
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
}


async function guestLogin(){
    let respnose = await fetch(BASE_URL + '/users/-O-Mr5g8976g5-yCxVK8.json');    

    if(respnose.ok){
        
        localStorage.setItem('guestLoggedIn', 'true');
        window.location.href = "/summary.html";
    } else {
        console.error('Error during guest login:', error);
    }
    

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





