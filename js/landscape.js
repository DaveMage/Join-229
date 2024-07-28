/**
 * Handles changes in screen orientation and adjusts the UI accordingly.
 *
 * This function checks the screen orientation and displays a warning if the device is
 * in landscape mode. It hides the warning and displays the normal UI if the device is in portrait mode.
 */
function handleOrientationChange() {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
    const landscapeWarning = document.querySelector('.landscape-warning');
    const noLandscapeMode = document.querySelector('.noLandscapeMode');

    if (landscapeWarning && noLandscapeMode) {
        if (orientation.type.includes('landscape')) {
            landscapeWarning.style.display = 'block';
            noLandscapeMode.style.display = 'none';
        } else if (orientation.type.includes('portrait')) {
            landscapeWarning.style.display = 'none';
            noLandscapeMode.style.display = 'block';
        }
    }
}

window.addEventListener('orientationchange', handleOrientationChange);
handleOrientationChange(); 
