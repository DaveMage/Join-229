function onloadInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    dateTreshhold();
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

function loadUserInitial() {
    if (localStorage.getItem('user') !== null) {
        let user = JSON.parse(localStorage.getItem('user'));
        document.getElementById('profileInitial').innerHTML = user.initials;
        document.getElementById('menu').style.display = 'flex';
    }

}


/**
 * Clears the localStorage and redirects the user to the login page.
 */
function logout() {
    localStorage.clear();
    window.location.href = "/login.html";
}


//Summary Content

/**
  * This function switches the navbar on or out if the user clicks on the circle in the top corner.
  */
function openNavbar() {
    document.getElementById('navbar').classList.toggle('d-none');
}

/**
 * This function hides the navbar if the user clicks on the main container.
 */
function closeNavbar() {
    document.getElementById('navbar').classList.add('d-none');
}

/**functions goes to Board */
function goToBoardUsual(mark) {
    window.location.href = `./board.html#${mark}`;
}

/**
* function goes to the board and at the same time searches for the task
* which id is stored
*/
function goToBoard() {
    window.location.href =
        "./board.html?findtaskbyid=" + encodeURIComponent(holdTaskId);
}




