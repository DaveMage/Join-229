
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

