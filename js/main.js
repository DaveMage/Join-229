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
};


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
};


async function templateInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    await loadUserInitial();
    menuActive();
};


async function loadUserInitial() {
    let user = await getUser();
    user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));

    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';
    } else {
        document.getElementById('profileInitial').innerHTML = user.initials;
    }
};


function displayMobileHeader() {
    document.getElementById("header").innerHTML = headerMobileHtml();
};


function displayMobileMenu() {
    document.getElementById("menu").innerHTML = menuMobileHtml();
};


function displayDesktopMenu() {
    document.getElementById("menuDesktop").innerHTML = menuDesktopHtml();
};


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
};


function back() {
    window.history.back();
};


function loadGuestLogin() {
    if (localStorage.getItem('guestLoggedIn') === 'true') {
        document.getElementById('profileInitial').innerHTML = 'G';
        document.getElementById('menu').style.display = 'flex';
    }
};


function checkGuestLogin() {
    let notLoggedIn = document.getElementById('profileInitial');
    if (notLoggedIn.innerHTML === '') {
        document.getElementById('menu').style.display = 'none';
        if (document.getElementById('mainPolicy')) {
            document.getElementById('mainPolicy').style.height = '100vh';
        }
    }
};


function logout() {
    const emailToken = localStorage.getItem('emailToken');    // Store the tokens before clearing local storage
    const passwordToken = localStorage.getItem('passwordToken');
    localStorage.clear();    // Clear all local storage
    if (emailToken) {    // Restore the tokens
        localStorage.setItem('emailToken', emailToken);
    }
    if (passwordToken) {
        localStorage.setItem('passwordToken', passwordToken);
    }
    window.location.href = "./login.html";    // Redirect to the login page
};


function addClassActive() {     //kann die weg?-------------------------------------------------------------------------------------------
};


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
};