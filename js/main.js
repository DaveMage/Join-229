async function onloadInit() {
    displayUserName();
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    await loadUserInitial();
    menuActive();
    countInit();
}

async function templateInit(){    
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    await loadUserInitial();
    menuActive();
}

async function loadUserInitial() {
    let user = await getUser();    
    user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    document.getElementById('profileInitial').innerHTML = user.initials;
    document.getElementById('menu').style.display = 'flex';
    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';
    }
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
 * Displays the desktop menu by updating the HTML content of the "menu" element.
 */
function displayDesktopMenu() {
    document.getElementById("menuDesktop").innerHTML = menuDesktopHtml();
}

/**
 * Toggles the display of the logout element on mobile devices.
 */
function displayMobileLogout() {
    let logout = document.getElementById("logout");
    if (logout.style.display === "flex") {
        
        logout.classList.remove('slideInRight');
        logout.classList.add('slideOutRight');
        setTimeout(() => {
            logout.classList.remove('slideOutRight');
            logout.classList.add('slideInRight');
            logout.style.display = "none";
        }, 250);
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
        document.getElementById('menu').style.display = 'flex';
    }
}


function checkGuestLogin() {
    let notLoggedIn = document.getElementById('profileInitial');
    if (notLoggedIn.innerHTML === '') {
        document.getElementById('menu').style.display = 'none';
        if (document.getElementById('mainPolicy')) {
            document.getElementById('mainPolicy').style.height = '100vh';
        }
    }
}

/**
 * Clears the localStorage and redirects the user to the login page.
 */
function logout() {
    // Store the tokens before clearing local storage
    const emailToken = localStorage.getItem('emailToken');
    const passwordToken = localStorage.getItem('passwordToken');

    // Clear all local storage
    localStorage.clear();

    // Restore the tokens
    if (emailToken) {
        localStorage.setItem('emailToken', emailToken);
    }
    if (passwordToken) {
        localStorage.setItem('passwordToken', passwordToken);
    }

    // Redirect to the login page
    window.location.href = "/login.html";
}

function menuActive(){
    let summary = document.getElementById('summaryLink');
    let summaryDesktop = document.getElementById('summaryLinkDesktop');
    let summaryIconDesktop = document.getElementById('summaryDesktopIcon');
    let board = document.getElementById('boardLink');
    let boardDesktop = document.getElementById('boardLinkDesktop');
    let boardIconDesktop = document.getElementById('boardDesktopIcon');
    let addTask = document.getElementById('addTaskLink');
    let addTaskDesktop = document.getElementById('addTaskLinkDesktop');
    let addTaskIconDesktop = document.getElementById('addTaskDesktopIcon');
    let contacts = document.getElementById('contactsLink');
    let contactsDesktop = document.getElementById('contactsLinkDesktop');
    let contactsIconDesktop = document.getElementById('contactsDesktopIcon');

    if (window.location.pathname === '/summary.html') {
        summary.classList.add('active');
        summaryDesktop.classList.add('activeDesktop');
        summaryIconDesktop.classList.add('activeDesktopIconSummary');
        addTask.classList.remove('active');
        addTaskDesktop.classList.remove('activeDesktop');
        addTaskIconDesktop.classList.remove('activeDesktopIconAddTask');
        board.classList.remove('active');
        boardDesktop.classList.remove('activeDesktop');
        boardIconDesktop.classList.remove('activeDesktopIconBoard');
        contacts.classList.remove('active');
        contactsDesktop.classList.remove('activeDesktop');
        contactsIconDesktop.classList.remove('activeDesktopIconContacts');
    }

    if (window.location.pathname === '/greeting.html') {
        summary.classList.add('active');
        summaryDesktop.classList.add('activeDesktop');
        summaryIconDesktop.classList.add('activeDesktopIconSummary');
        addTask.classList.remove('active');
        addTaskDesktop.classList.remove('activeDesktop');
        addTaskIconDesktop.classList.remove('activeDesktopIconAddTask');
        board.classList.remove('active');
        boardDesktop.classList.remove('activeDesktop');
        boardIconDesktop.classList.remove('activeDesktopIconBoard');
        contacts.classList.remove('active');
        contactsDesktop.classList.remove('activeDesktop');
        contactsIconDesktop.classList.remove('activeDesktopIconContacts');
    }

    if (window.location.pathname === '/addTask.html') {
        addTask.classList.add('active');
        addTaskDesktop.classList.add('activeDesktop');
        addTaskIconDesktop.classList.add('activeDesktopIconAddTask');
        summary.classList.remove('active');
        summaryDesktop.classList.remove('activeDesktop');
        summaryIconDesktop.classList.remove('activeDesktopIconSummary');
        board.classList.remove('active');
        boardDesktop.classList.remove('activeDesktop');
        boardIconDesktop.classList.remove('activeDesktopIconBoard');
        contacts.classList.remove('active');
        contactsDesktop.classList.remove('activeDesktop');
        contactsIconDesktop.classList.remove('activeDesktopIconContacts');
    }

    if (window.location.pathname === '/board.html') {
        board.classList.add('active');
        boardDesktop.classList.add('activeDesktop');
        boardIconDesktop.classList.add('activeDesktopIconBoard');
        summary.classList.remove('active');
        summaryDesktop.classList.remove('activeDesktop');
        summaryIconDesktop.classList.remove('activeDesktopIconSummary');
        addTask.classList.remove('active');
        addTaskDesktop.classList.remove('activeDesktop');
        addTaskIconDesktop.classList.remove('activeDesktopIconAddTask');
        contacts.classList.remove('active');
        contactsDesktop.classList.remove('activeDesktop');
        contactsIconDesktop.classList.remove('activeDesktopIconContacts');
    }
    if (window.location.pathname === '/contacts.html') {
        contacts.classList.add('active');
        contactsDesktop.classList.add('activeDesktop');
        contactsIconDesktop.classList.add('activeDesktopIconContacts');
        summary.classList.remove('active');
        summaryDesktop.classList.remove('activeDesktop');
        summaryIconDesktop.classList.remove('activeDesktopIconSummary');
        addTask.classList.remove('active');
        addTaskDesktop.classList.remove('activeDesktop');
        addTaskIconDesktop.classList.remove('activeDesktopIconAddTask');
        board.classList.remove('active');
        boardDesktop.classList.remove('activeDesktop');
        boardIconDesktop.classList.remove('activeDesktopIconBoard');
    }
}

function goToAddTask() {
    window.location.href = '/addTask.html';
}


