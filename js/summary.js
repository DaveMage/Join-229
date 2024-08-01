/**
 * Redirects to the board page with a specific section marked.
 *
 * This function navigates to the board page (`board.html`) and scrolls to a specific section
 * identified by the `mark` parameter.
 *
 * @param {string} mark - The hash or identifier for the specific section on the board page.
 */
function goToBoardUsual(mark) {
    window.location.href = `./board.html#${mark}`;
}


/**
 * Redirects to the board page.
 *
 * This function navigates to the board page (`board.html`).
 */
function goToBoard() {
    window.location.href = './board.html';
}


/**
 * Displays the user's name on the greeting page and transitions to the summary page.
 *
 * This asynchronous function fetches the current user's information and displays their name
 * on the greeting page. If a guest is logged in, the name display is cleared. It then transitions
 * to the summary page (`summary.html`) after a short delay.
 */
async function displayUserName() {
    await getUser();
    let user = users.find(user => user.email && user.email === atob(localStorage.getItem('emailToken')));
    let mainContainer = document.getElementById('greetingMain');
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');

    if (mainContainer) {
        if (guestLoggedIn === 'true') {
            document.getElementById('greetingName').innerHTML = '';
        } else if (user && user.name && guestLoggedIn !== 'true') {
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


/**
 * Displays a greeting message based on the time of day and guest login status.
 *
 * This function sets the greeting message in the `greetingText` element. It adjusts the greeting
 * for morning, noon, or evening, and checks if a guest is logged in to customize the message.
 */
function greeting() {
    let greetingContainer = document.getElementById('greetingText');
    let date = new Date();
    let hour = date.getHours();
    let greeting = '';
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    if (hour >= 0 && hour < 10) {
        if (guestLoggedIn === 'true') {
            greeting = 'Good morning!';
        } else {
            greeting = 'Good morning,';
        }
    }
    if (hour >= 10 && hour < 18) {
        if (guestLoggedIn === 'true') {
            greeting = 'Good noon!';
        } else {
            greeting = 'Good noon,';
        }
    }
    if (hour >= 18) {
        if (guestLoggedIn === 'true') {
            greeting = 'Good evening!';
        } else {
            greeting = 'Good evening,';
        }
    }
    greetingContainer.innerHTML = greeting;
}


/**
 * Counts the number of tasks with the status 'open'.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The number of open tasks.
 */
function countOpenTasks(tasks) {
    return tasks.filter(task => task.status === 'open').length;
}


/**
 * Counts the number of tasks with the status 'inProgress'.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The number of in-progress tasks.
 */
function countInProgressTasks(tasks) {
    return tasks.filter(task => task.status === 'inProgress').length;
}


/**
 * Counts the number of tasks with the status 'awaitFeedback'.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The number of tasks awaiting feedback.
 */
function countAwaitFeedbackTasks(tasks) {
    return tasks.filter(task => task.status === 'awaitFeedback').length;
}


/**
 * Counts the number of tasks with the status 'done'.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The number of completed tasks.
 */
function countDoneTasks(tasks) {
    return tasks.filter(task => task.status === 'done').length;
}


/**
 * Counts the number of tasks with the priority 'Urgent'.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The number of urgent tasks.
 */
function countUrgentTasks(tasks) {
    return tasks.filter(task => task.prio.value === 'Urgent').length;
}


/**
 * Counts the total number of tasks.
 *
 * @param {Array} tasks - The array of task objects.
 * @returns {number} The total number of tasks.
 */
function countTasks(tasks) {
    return tasks.length;
}


/**
 * Displays the count of open tasks.
 *
 * This asynchronous function fetches the tasks and updates the UI with the count of open tasks.
 */
async function displayCountToDo() {
    let tasks = await getTask();
    let openTasksCount = countOpenTasks(tasks);
    document.getElementById('openTasks').innerHTML = openTasksCount;
}


/**
 * Displays the count of in-progress tasks.
 *
 * This asynchronous function fetches the tasks and updates the UI with the count of in-progress tasks.
 */
async function displayCountInProgress() {
    let tasks = await getTask();
    let inProgressTasksCount = countInProgressTasks(tasks);
    document.getElementById('inProgressTasks').innerHTML = inProgressTasksCount;
}


/**
 * Displays the count of tasks awaiting feedback.
 *
 * This asynchronous function fetches the tasks and updates the UI with the count of tasks awaiting feedback.
 */
async function displayCountAwaitFeedback() {
    let tasks = await getTask();
    let awaitFeedbackTasksCount = countAwaitFeedbackTasks(tasks);
    document.getElementById('awaitFeedbackTasks').innerHTML = awaitFeedbackTasksCount;
}


/**
 * Displays the count of completed tasks.
 *
 * This asynchronous function fetches the tasks and updates the UI with the count of completed tasks.
 */
async function displayCountDone() {
    let tasks = await getTask();
    let doneTasksCount = countDoneTasks(tasks);
    document.getElementById('doneTasks').innerHTML = doneTasksCount;
}


/**
 * Displays the count of urgent tasks.
 *
 * This asynchronous function fetches the tasks and updates the UI with the count of urgent tasks.
 */
async function displayCountUrgent() {
    let tasks = await getTask();
    let urgentTasksCount = countUrgentTasks(tasks);
    document.getElementById('urgentTasks').innerHTML = urgentTasksCount;
}


/**
 * Displays the total count of tasks.
 *
 * This asynchronous function fetches the tasks and updates the UI with the total count of tasks.
 */
async function displayCountAllTasks() {
    let tasks = await getTask();
    let allTasksCount = countTasks(tasks);
    document.getElementById('allTasks').innerHTML = allTasksCount;
}


/**
 * Displays the earliest deadline date for urgent tasks.
 *
 * This asynchronous function fetches the tasks, finds the earliest deadline among urgent tasks,
 * and displays the date in the UI.
 */
async function displayDeadline() {
    let tasks = await getTask();
    let deadlineDate = document.getElementById('deadlineDate');
    let urgentTasks = tasks.filter(task => task.prio.value === 'Urgent');
    let getDeadline = urgentTasks.map(task => new Date(task.date));
    let sortedDeadline = getDeadline.sort((a, b) => a - b);
    let earliestDeadline = sortedDeadline[0];

    if (!getDeadline.length) {
        deadlineDate.innerHTML = '';
    } else {
        deadlineDate.innerHTML = earliestDeadline.toLocaleDateString('en-EN', { month: 'long', day: 'numeric', year: 'numeric' });
    }
}


/**
 * Initializes the task count displays.
 *
 * This function triggers the display functions for various task counts, updating the UI accordingly.
 */
function countInit() {
    displayCountToDo();
    displayCountInProgress();
    displayCountAwaitFeedback();
    displayCountDone();
    displayCountUrgent();
    displayCountAllTasks();
    displayDeadline();
}


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
    return tasks.filter(task => task.prio.value === 'Urgent').length;
};


function countTasks(tasks) {
    return tasks.length;
};


/**
 * Displays a greeting message on the summary page.
 *
 * This asynchronous function fetches the user data, determines the appropriate greeting based on the time of day,
 * and displays it along with the user's name on the summary page.
 */
async function greetingSummary() {
    await getUser();
    let guestLoggedIn = localStorage.getItem('guestLoggedIn');
    let greetingScreen = document.getElementById('greetingScreen');
    let username = '';
    let user = users.find(user => user.email && user.email === atob(localStorage.getItem('emailToken')));

    if (guestLoggedIn === 'true') {
        username = '';
    }
    if (user && user.name && guestLoggedIn !== 'true') {
        username = user.name;
    }
    let greeting = '';
    let hour = new Date().getHours();
    if (hour >= 0 && hour < 10) {
        if (guestLoggedIn === 'true') {
            greeting = 'Good morning!';
        } else {
            greeting = 'Good morning,';
        }
    }
    if (hour >= 10 && hour < 18) {
        if (guestLoggedIn === 'true') {
            greeting = 'Good noon!';
        } else {
            greeting = 'Good noon,';
        }
    }
    if (hour >= 18) {
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
}
