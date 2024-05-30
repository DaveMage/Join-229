function focusInputName() {
    document.getElementById("signUpLabelName").style.borderColor = "#29ABE2";
    document.getElementById("signUpLabelEmail").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelPassword").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelConfirmPassword").style.borderColor = "#D1D1D1";
}
function focusInputEmail() {
    document.getElementById("signUpLabelEmail").style.borderColor = "#29ABE2";
    document.getElementById("signUpLabelName").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelPassword").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelConfirmPassword").style.borderColor = "#D1D1D1";
}

function focusInputPassword() {
    document.getElementById("signUpLabelPassword").style.borderColor = "#29ABE2";
    document.getElementById("signUpLabelConfirmPassword").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelEmail").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelName").style.borderColor = "#D1D1D1";

}

function focusInputPasswordConfirm() {
    document.getElementById("signUpLabelConfirmPassword").style.borderColor = "#29ABE2";
    document.getElementById("signUpLabelEmail").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelName").style.borderColor = "#D1D1D1";
    document.getElementById("signUpLabelPassword").style.borderColor = "#D1D1D1";
}

function goToLogin() {
    window.location.href = "/login.html";
}