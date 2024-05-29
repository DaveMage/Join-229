
function onloadInit() {
    displayHeader();
    displayMenu();
}

function displayHeader(){
    document.getElementById("header").innerHTML = headerMobileHtml();
}

function displayMenu(){
    document.getElementById("menu").innerHTML = menuMobileHtml();
}