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

async function displayUserName(){
    await getUser();
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    document.getElementById('greetingName').innerText = user.name;
    
}