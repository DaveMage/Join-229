/**
 * Handles changes in screen orientation and adjusts the UI accordingly.
 *
 * This function checks the screen orientation and displays a warning if the device is
 * in landscape mode. It hides the warning and displays the normal UI if the device is in portrait mode.
 */
function handleOrientationChange() {
    const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;

    // Select elements
    const landscapeWarning = document.querySelector('.landscape-warning');
    const noLandscapeMode = document.querySelector('.noLandscapeMode');

    // Ensure elements exist before accessing their styles
    if (landscapeWarning && noLandscapeMode) {
        if (orientation.type.includes('landscape')) {
            // Device is in landscape mode
            landscapeWarning.style.display = 'block';
            noLandscapeMode.style.display = 'none';
        } else if (orientation.type.includes('portrait')) {
            // Device is in portrait mode
            landscapeWarning.style.display = 'none';
            noLandscapeMode.style.display = 'block';
        }
    }
}

// Listen for orientation changes
window.addEventListener('orientationchange', handleOrientationChange);
handleOrientationChange(); // Call the function initially to set the correct display
