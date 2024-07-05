const pages = [
    { path: '/summary.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
    { path: '/greeting.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
    { path: '/addTask.html', classes: ['addTaskLink', 'addTaskLinkDesktop', 'addTaskDesktopIcon'] },
    { path: '/board.html', classes: ['boardLink', 'boardLinkDesktop', 'boardDesktopIcon'] },
    { path: '/contacts.html', classes: ['contactsLink', 'contactsLinkDesktop', 'contactsDesktopIcon'] },
    { path: '/privacyPolice.html', classes: ['privacyLink'], exclusive: 'legalLink' },
    { path: '/legalNotice.html', classes: ['legalLink'], exclusive: 'privacyLink' }
];

function pagesArray() {
    const pages = [
        { path: '/summary.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
        { path: '/greeting.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
        { path: '/addTask.html', classes: ['addTaskLink', 'addTaskLinkDesktop', 'addTaskDesktopIcon'] },
        { path: '/board.html', classes: ['boardLink', 'boardLinkDesktop', 'boardDesktopIcon'] },
        { path: '/contacts.html', classes: ['contactsLink', 'contactsLinkDesktop', 'contactsDesktopIcon'] },
        { path: '/privacyPolice.html', classes: ['privacyLink'], exclusive: 'legalLink' },
        { path: '/legalNotice.html', classes: ['legalLink'], exclusive: 'privacyLink' }
    ];
    return pages;
}


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

function addClassActive(){
    
}

function menuActive() {
    pagesArray();

    const currentPage = pages.find(page => window.location.pathname === page.path);
    if (currentPage) {
        currentPage.classes.forEach(className => {
            const element = document.getElementById(className);
            if (element) {
                element.classList.add('active');
                if (className.endsWith('Desktop')) {
                    element.classList.add('activeDesktop');
                }
                if (className.endsWith('Icon')) {
                    element.classList.add('activeDesktopIcon' + className.split('Desktop')[0]);
                }
            }
        });

        const exclusivePage = pages.find(page => page.exclusive && window.location.pathname === page.path);
        if (exclusivePage) {
            const exclusiveElement = document.getElementById(exclusivePage.exclusive);
            if (exclusiveElement) {
                exclusiveElement.classList.remove('active');
            }
        }
    }
}


function goToAddTask() {
    window.location.href = '/addTask.html';
}


