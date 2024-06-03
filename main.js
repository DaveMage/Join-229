function onloadInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    checkGuestLogin();
}

/**
 * Sets the innerHTML of the element with id "header" to the result of the headerMobileHtml function.
 */
function displayMobileHeader() {
    document.getElementById("header").innerHTML = headerMobileHtml();
}

/**
 * Displays the mobile menu by updating the HTML content of the "menu" element.
 */
function displayMobileMenu() {
    document.getElementById("menu").innerHTML = menuMobileHtml();
}


/**
 * Toggles the display of the logout element on mobile devices.
 */
function displayMobileLogout() {
    let logout = document.getElementById("logout");
    if (logout.style.display === "flex") {
        logout.style.display = "none";
    } else {
        logout.style.display = "flex";
    }
}


/**
 * Navigates the browser back to the previous page in the history.
 */
function back() {
    window.history.back();
}


/**
 * Loads the guest login information.
 * If the guest is logged in, it updates the profile initial to 'G'.
 */
function loadGuestLogin() {
    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';

    }
}

function checkGuestLogin() {
    if (localStorage.getItem('guestLoggedIn') === null) {
        document.getElementById('menu').style.display = 'none';
    }
}


/**
 * Clears the localStorage and redirects the user to the login page.
 */
function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}