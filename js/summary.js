function goToBoardUsual(mark) {
    window.location.href = `./board.html#${mark}`;
};


function goToBoard() {
    window.location.href = './board.html';       
};


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
};


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
};


function countOpenTasks(tasks) {
    return tasks.filter(task => task.status === 'open').length;
};


function countInProgressTasks(tasks) {
    return tasks.filter(task => task.status === 'inProgress').length;
};


function countAwaitFeedbackTasks(tasks) {
    return tasks.filter(task => task.status === 'awaitFeedback').length;
};


function countDoneTasks(tasks) {
    return tasks.filter(task => task.status === 'done').length;
};


function countUrgentTasks(tasks) {
    return tasks.filter(task => task.priority.value === 'Urgent').length;
};


function countTasks(tasks) {
    return tasks.length;
};


async function displayCountToDo() {
    let tasks = await getTask(); // Fetch the tasks    
    let openTasksCount = countOpenTasks(tasks); // Count the 'open' tasks
    document.getElementById('openTasks').innerHTML = openTasksCount;
};


async function displayCountInProgress() {
    let tasks = await getTask(); // Fetch the tasks
    let inProgressTasksCount = countInProgressTasks(tasks); // Count the 'inProgress' tasks
    document.getElementById('inProgressTasks').innerHTML = inProgressTasksCount;
};


async function displayCountAwaitFeedback() {
    let tasks = await getTask(); // Fetch the tasks
    let awaitFeedbackTasksCount = countAwaitFeedbackTasks(tasks); // Count the 'awaitFeedback' tasks
    document.getElementById('awaitFeedbackTasks').innerHTML = awaitFeedbackTasksCount;
};


async function displayCountDone() {
    let tasks = await getTask(); // Fetch the tasks
    let doneTasksCount = countDoneTasks(tasks); // Count the 'done' tasks
    document.getElementById('doneTasks').innerHTML = doneTasksCount;
};


async function displayCountUrgent() {
    let tasks = await getTask(); // Fetch the tasks
    let urgentTasksCount = countUrgentTasks(tasks); // Count the 'urgent' tasks
    document.getElementById('urgentTasks').innerHTML = urgentTasksCount;
};


async function displayCountAllTasks() {
    let tasks = await getTask(); // Fetch the tasks
    let allTasksCount = countTasks(tasks); // Count all tasks
    document.getElementById('allTasks').innerHTML = allTasksCount;
};


async function displayDeadline() {     
    let tasks = await getTask();
    let deadlineDate = document.getElementById('deadlineDate');
    let urgentTasks = tasks.filter(task => task.priority.value === 'Urgent');
    let getDeadline = urgentTasks.map(task => new Date(task.date));
    let sortedDeadline = getDeadline.sort((a, b) => a - b);
    let earliestDeadline = sortedDeadline[0]; 
       
    if(!getDeadline.length){
        deadlineDate.innerHTML = '';
    } else { 
        deadlineDate.innerHTML = earliestDeadline.toLocaleDateString('en-EN', {month: 'long', day: 'numeric',year: 'numeric' });
    }
};


function countInit(){
    displayCountToDo();
    displayCountInProgress();
    displayCountAwaitFeedback();
    displayCountDone();
    displayCountUrgent();
    displayCountAllTasks();
    displayDeadline();
};


function countOpenTasks(tasks) {
    return tasks.filter(task => task.status === 'open').length;
};


function countInProgressTasks(tasks) {
    return tasks.filter(task => task.status === 'inProgress').length;
};


function countAwaitFeedbackTasks(tasks) {
    return tasks.filter(task => task.status === 'awaitFeedback').length;
};


function countDoneTasks(tasks) {
    return tasks.filter(task => task.status === 'done').length;
};


function countUrgentTasks(tasks) {
    return tasks.filter(task => task.priority.value === 'Urgent').length;
};


function countTasks(tasks) {
    return tasks.length;
};


async function greetingSummary() {
    await getUser();
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    let greetingScreen = document.getElementById('greetingScreen');
    let username = '';    
    let user = users.find(user => user.email && user.email === atob(localStorage.getItem('emailToken')));

    if (guestLoggedIn === 'true'){
        username = '';
    }
    if (user && user.name && guestLoggedIn !== 'true') {
        username = user.name;
    }    
    let greeting = '';   
    let hour = new Date().getHours();
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
    greetingScreen.innerHTML = /*html*/ `
        <div class="greetingContainer">
          <div class="greetingText" id="greetingText">${greeting}</div>
          <div class="greetingText" id="greetingName">${username}</div>
        </div>`;
};