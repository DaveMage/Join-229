function handleOrientationChange() {
    if (window.orientation === 90 || window.orientation === -90) {
        document.querySelector('.landscape-warning').style.display = 'block';
        document.querySelector('.mainContainer').style.display = 'none';
    } else {
        document.querySelector('.landscape-warning').style.display = 'none';
        document.querySelector('.mainContainer').style.display = 'block';
    }
}

// JavaScript zur Überwachung von Änderungen der Ausrichtung
window.addEventListener('orientationchange', handleOrientationChange);

// Initiale Überprüfung
document.addEventListener('DOMContentLoaded', function() {
    handleOrientationChange();
});