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



function countOpenTasks(tasks) {
    return tasks.filter(task => task.status === 'open').length;
}

function countInProgressTasks(tasks) {
    return tasks.filter(task => task.status === 'inProgress').length;
}

function countAwaitFeedbackTasks(tasks) {
    return tasks.filter(task => task.status === 'awaitFeedback').length;
}

function countDoneTasks(tasks) {
    return tasks.filter(task => task.status === 'done').length;
}


async function displayCountToDo() {
    let tasks = await getTask(); // Fetch the tasks
    console.log(tasks); // Log the tasks to ensure they are fetched correctly
    let openTasksCount = countOpenTasks(tasks); // Count the 'open' tasks
    document.getElementById('openTasks').innerHTML = openTasksCount;
}

async function displayCountInProgress() {
    let tasks = await getTask(); // Fetch the tasks
    let inProgressTasksCount = countInProgressTasks(tasks); // Count the 'inProgress' tasks
    document.getElementById('inProgressTasks').innerHTML = inProgressTasksCount;
}

async function displayCountAwaitFeedback() {
    let tasks = await getTask(); // Fetch the tasks
    let awaitFeedbackTasksCount = countAwaitFeedbackTasks(tasks); // Count the 'awaitFeedback' tasks
    document.getElementById('awaitFeedbackTasks').innerHTML = awaitFeedbackTasksCount;
}

async function displayCountDone() {
    let tasks = await getTask(); // Fetch the tasks
    let doneTasksCount = countDoneTasks(tasks); // Count the 'done' tasks
    document.getElementById('doneTasks').innerHTML = doneTasksCount;
}


function countInit(){
    displayCountToDo();
    displayCountInProgress();
    displayCountAwaitFeedback();
    displayCountDone();
}

