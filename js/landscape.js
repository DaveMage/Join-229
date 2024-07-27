/**
 * Handles changes in screen orientation and adjusts the UI accordingly.
 *
 * This function checks the screen orientation and displays a warning if the device is
 * in landscape mode. It hides the warning and displays the normal UI if the device is in portrait mode.
 */
function handleOrientationChange() {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

    if (orientation.type.includes('landscape')) {
        // Device is in landscape mode
        document.querySelector('.landscape-warning').style.display = 'block';
        document.querySelector('.noLandscapeMode').style.display = 'none';
    } else if (orientation.type.includes('portrait')) {
        // Device is in portrait mode
        document.querySelector('.landscape-warning').style.display = 'none';
        document.querySelector('.noLandscapeMode').style.display = 'block';
    }
}

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);
handleOrientationChange(); // Call the function initially to set the correct display
