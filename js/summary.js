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
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (mainContainer) {
        if(guestLoggedIn === 'true'){
            document.getElementById('greetingName').innerHTML = '';                     
        }
        if (user && user.name && guestLoggedIn !== 'true') {

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

function greeting(){
    let greetingContainer = document.getElementById('greetingText');
    let date = new Date();
    let hour = date.getHours();
    let greeting = '';
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    if(hour >= 0 && hour < 10){
        if (guestLoggedIn === 'true') {
            greeting = 'Good morning!';
        } else {
            greeting = 'Good morning,';
        }
        
    }
    if(hour >= 10 && hour < 18){
        if (guestLoggedIn === 'true') {
            greeting = 'Good noon!';
        } else {
            greeting = 'Good noon,';
        }
    }
    if(hour >= 18){
        if (guestLoggedIn === 'true') {
            greeting = 'Good evening!';
        } else {
            greeting = 'Good evening,';
        }
    }
    greetingContainer.innerHTML = greeting;
}

