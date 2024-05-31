function onloadInit() {
    displayHeader();
    displayMenu();
}


function displayHeader() {
    document.getElementById("header").innerHTML = headerMobileHtml();
}


function displayMenu() {
    document.getElementById("menu").innerHTML = menuMobileHtml();
}


function displayLogout() {
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