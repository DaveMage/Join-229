function handleOrientationChange() {
    if (window.orientation === 90 || window.orientation === -90) {
        document.querySelector('.landscape-warning').style.display = 'block';
        document.querySelector('.noLandscapeMode').style.display = 'none';
    } else {
        document.querySelector('.landscape-warning').style.display = 'none';
        document.querySelector('.noLandscapeMode').style.display = 'block';
    }
}

// JavaScript zur Überwachung von Änderungen der Ausrichtung
window.addEventListener('orientationchange', handleOrientationChange);

// Initiale Überprüfung
document.addEventListener('DOMContentLoaded', function() {
    handleOrientationChange();
});