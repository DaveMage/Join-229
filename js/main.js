function onloadInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
}


function displayMobileHeader() {
    document.getElementById("header").innerHTML = headerMobileHtml();
}


function displayMobileMenu() {
    document.getElementById("menu").innerHTML = menuMobileHtml();
}


function displayMobileLogout() {
    let logout = document.getElementById("logout");
    if (logout.style.display === "flex") {
        logout.style.display = "none";
    } else {
        logout.style.display = "flex";
    }
}

function back() {
    window.history.back();
}

function loadGuestLogin(){
    if(localStorage.getItem('guestLoggedIn') === 'true'){
        document.getElementById('profileInitial').innerHTML = 'G';

    }
}