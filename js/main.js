function displayTemplateMobileHtml() {
    document.getElementById('template').innerHTML = '';
    document.getElementById('template').innerHTML = templateMobileHtml();
}
function onloadInit() {
    displayTemplateMobileHtml();    
}