//Summary Content
/**functions goes to Board */
function goToBoardUsual(mark) {
    window.location.href = `./board.html#${mark}`;
}

/**
* function goes to the board and at the same time searches for the task
* which id is stored
*/
function goToBoard() {
    window.location.href =
        "./board.html?findtaskbyid=" + encodeURIComponent(holdTaskId);
}

async function displayUserName() {
    await getUser();
    let user = users.find(user => user.email && user.email === atob(localStorage.getItem('emailToken')));
    let mainContainer = document.getElementById('greetingMain');

    if (mainContainer) {
        if (user && user.name) {

            document.getElementById('greetingName').innerHTML = user.name;

        } else {
            console.error('User or user name not found');
        }
        setTimeout(() => {
            mainContainer.classList.add('fadeOut');
        }, 1000);

        setTimeout(() => {

            mainContainer.classList.remove('fadeOut');
            window.location.href = "/summary.html";
        }, 2000);
    }

}