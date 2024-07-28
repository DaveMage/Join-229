const pages = [
    { path: '/summary.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
    { path: '/greeting.html', classes: ['summaryLink', 'summaryLinkDesktop', 'summaryDesktopIcon'] },
    { path: '/addTask.html', classes: ['addTaskLink', 'addTaskLinkDesktop', 'addTaskDesktopIcon'] },
    { path: '/board.html', classes: ['boardLink', 'boardLinkDesktop', 'boardDesktopIcon'] },
    { path: '/contacts.html', classes: ['contactsLink', 'contactsLinkDesktop', 'contactsDesktopIcon'] },
    { path: '/privacyPolice.html', classes: ['privacyLink'], exclusive: 'legalLink' },
    { path: '/legalNotice.html', classes: ['legalLink'], exclusive: 'privacyLink' }
];


/**
 * Returns an array of page objects containing path and class information.
 * 
 * This function defines the paths and associated CSS classes for different pages in the application.
 * The classes are used to identify and style the active page and its elements.
 * 
 * @returns {Array} An array of objects, each containing the path and classes for a page.
 */
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


/**
 * Initializes the page when it loads.
 * 
 * This asynchronous function sets up the user interface by displaying the user name,
 * loading headers and menus, checking for guest login status, and initializing counts.
 * 
 * @async
 * @function onloadInit
 */
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


/**
 * Initializes the common elements of the page template.
 * 
 * This asynchronous function sets up the mobile and desktop headers and menus, checks for guest login status,
 * loads the user's initials, and activates the menu highlighting.
 * 
 * @async
 * @function templateInit
 */
async function templateInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    await loadUserInitial();
    menuActive();
}


/**
 * Loads the user's initials into the profile section.
 * 
 * This asynchronous function fetches the current user's data and sets the initials in the profile area.
 * If a guest is logged in, it sets the initials to 'G'.
 * 
 * @async
 * @function loadUserInitial
 */
async function loadUserInitial() {
    let user = await getUser();
    user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));  
    
    
    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';
    }
    if (user) {
        document.getElementById('profileInitial').innerHTML = user.initials;
    }
}


/**
 * Displays the mobile header.
 * 
 * This function sets the inner HTML of the header element to the mobile header template.
 */
function displayMobileHeader() {
    let mobileHeader = document.getElementById("header");
    if(mobileHeader) {
        mobileHeader.innerHTML = headerMobileHtml();
    }
    
}


/**
 * Displays the mobile menu.
 * 
 * This function sets the inner HTML of the menu element to the mobile menu template.
 */
function displayMobileMenu() {
    let mobileMenu = document.getElementById("menu");
    if(document.getElementById('profileInitial').innerHTML === null || document.getElementById('profileInitial').innerHTML === '') {
        mobileMenu.style.display = 'none';
    }
    
    if(mobileMenu) {
        mobileMenu.innerHTML = menuMobileHtml();
    }
    
}


/**
 * Displays the desktop menu.
 * 
 * This function sets the inner HTML of the menu element to the desktop menu template.
 */
function displayDesktopMenu() {
    let desktopMenu = document.getElementById("menuDesktop");
    if(desktopMenu) {
        desktopMenu.innerHTML = menuDesktopHtml();
    }
    
    
}


/**
 * Toggles the visibility of the mobile logout option.
 * 
 * This function shows or hides the logout option in the mobile view by applying and removing CSS classes
 * for sliding animations.
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
 * Navigates back to the previous page.
 * 
 * This function uses the browser's history to go back to the previous page.
 */
function back() {
    window.history.back();
}


/**
 * Loads guest login settings if a guest is logged in.
 * 
 * This function sets the profile initials to 'G' and adjusts the display of the menu
 * and legal links if the guest login flag is set in localStorage.
 */
function loadGuestLogin() {
    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';
        document.getElementById('menu').style.display = 'flex';
        if (window.innerWidth >= 1100) {
            document.getElementById('privacyLink').target = '_blank';
            document.getElementById('legalLink').target = '_blank';
        }
    }
}



/**
 * Checks the guest login status and adjusts the UI accordingly.
 * 
 * This function checks if the profile initials are empty, indicating that no user is logged in.
 * It adjusts the height of the main policy section if necessary.
 */
function checkGuestLogin() {
    let notLoggedIn = document.getElementById('profileInitial');
    if (notLoggedIn.innerHTML === '') {
        if (document.getElementById('mainPolicy')) {
            document.getElementById('mainPolicy').style.height = '100vh';
        }
    }
}


/**
 * Logs the user out and clears the session data.
 * 
 * This function clears the user's session data from localStorage, except for the email and password tokens.
 * It then redirects the user to the login page.
 */
function logout() {
    const emailToken = localStorage.getItem('emailToken');
    const passwordToken = localStorage.getItem('passwordToken');
    const rememberMe = localStorage.getItem('rememberMe');

    localStorage.clear();

    if (rememberMe === 'true') {
        localStorage.setItem('emailToken', emailToken);
        localStorage.setItem('passwordToken', passwordToken);
        localStorage.setItem('rememberMe', 'true');
    } else if (rememberMe === 'false') {
        localStorage.setItem('emailToken', emailToken);
    }

    window.location.href = "./login.html";
}



/**
 * Activates the menu item corresponding to the current page.
 * 
 * This function iterates through the list of pages and adds the 'active' class to the
 * corresponding menu item based on the current URL path. It also handles exclusive page
 * conditions to remove active states from other elements.
 */
function menuActive() {
    const pages = pagesArray();
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