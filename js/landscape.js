/**
 * Handles changes in screen orientation and adjusts the UI accordingly.
 *
 * This function checks the screen orientation and displays a warning if the device is
 * in landscape mode. It hides the warning and displays the normal UI if the device is in portrait mode.
 */
function handleOrientationChange() {
    if (window.orientation === 90 || window.orientation === -90) {
        // Device is in landscape mode
        document.querySelector('.landscape-warning').style.display = 'block';
        document.querySelector('.noLandscapeMode').style.display = 'none';
    } else {
        // Device is in portrait mode
        document.querySelector('.landscape-warning').style.display = 'none';
        document.querySelector('.noLandscapeMode').style.display = 'block';
    }
}


window.addEventListener('orientationchange', handleOrientationChange);

document.addEventListener('DOMContentLoaded', function () {
    handleOrientationChange();
});