function boardInit() {
    displayMobileHeader();
    displayMobileMenu();
    displayDesktopMenu();
    loadGuestLogin();
    checkGuestLogin();
    loadUserInitial();
    getContacts();
    displayTaskCard();
    menuActive();
}

function addActiveClass() {
    document.getElementById('searchBar').classList.add('inputActive');
}

function removeActiveClass() {
    document.getElementById('searchBar').classList.remove('inputActive');
}

// drag and drop
let currentDraggedElement = null;
function allowDrop(ev) {
    ev.preventDefault();
}

function startDragging(event, taskId) {
    event.dataTransfer.setData('text/plain', taskId); // Legt die zu übertragende Daten (Task-ID) fest    
    currentDraggedElement = taskId; // Speichert die Task-ID des aktuell gezogenen Elements
}

async function moveTo(status) {
    await getUser();
    let user = users.find(user => user.email === atob(localStorage.getItem('emailToken')));
    let userId = user.id; // Speichern Sie die ID des Benutzers

    const task = tasks.find(t => t.id === currentDraggedElement);
    if (task) {
        task.status = status;
        updateBoardHtml();
        await putData('/users/' + userId + '/tasks/' + currentDraggedElement, task); // Übergeben Sie die spezifische Aufgabe        
    } else {
        console.error('Task not found with ID:', currentDraggedElement);
    }
}

function updateBoardHtml() {
    const statuses = {
        open: { html: '', containerId: 'toDoContainer' },
        inProgress: { html: '', containerId: 'progressContainer' },
        awaitFeedback: { html: '', containerId: 'feedbackContainer' },
        done: { html: '', containerId: 'doneContainer' }
    };

    for (let status in statuses) {
        let tasksByStatus = tasks.filter(task => task.status === status);
        tasksByStatus.forEach(task => {
            statuses[status].html += taskCardHTML(task);
        });
        document.getElementById(statuses[status].containerId).innerHTML = statuses[status].html;
    }

    displayNoTasks();
}

//----------------------------------------------


function displayNoTasks() {
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');

    if (toDo.innerHTML === '') {
        toDo.innerHTML = displayNoTasksToDo();
    }
    if (inProgress.innerHTML === '') {
        inProgress.innerHTML = displayNoTasksProgress();
    }
    if (awaitFeedback.innerHTML === '') {
        awaitFeedback.innerHTML = displayNoTasksFeedback();
    }
    if (done.innerHTML === '') {
        done.innerHTML = displayNoTasksDone();
    }

}

async function displayTaskCard() {
    let toDo = document.getElementById('toDoContainer');
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');
    await getTask().then(tasks => {
        for (let i = 0; i < tasks.length; i++) {
            let task = tasks[i];
            if (task.status === 'open') {
                toDo.innerHTML += taskCardHTML(task);
            } else if (task.status === 'inProgress') {
                inProgress.innerHTML += taskCardHTML(task);
            } else if (task.status === 'awaitFeedback') {
                awaitFeedback.innerHTML += taskCardHTML(task);
            } else if (task.status === 'done') {
                done.innerHTML += taskCardHTML(task);
            }
        }
    });

    displayNoTasks();

}

function displayOverviewTaskCard(taskId) {
    let task = tasks.find(t => t.id === taskId);
    document.getElementById('mainBoard').innerHTML += overviewTaskCardHTML(task);
}

function closeTaskCardOverview() {
    document.getElementById('taskCardOverviewBackground').remove();
}



async function deleteTask(taskId) {
    let = userId = users.find(user => user.email === atob(localStorage.getItem('emailToken'))); // Find the user object with the specified email
    userId = userId.id; // Get the user ID from the user object    
    let guestLoggedIn = localStorage.getItem('guestLoggedIn'); // Get the guestLoggedIn value from local storage
    if (guestLoggedIn === 'true') {
        userId = '-O-Mr5g8976g5-yCxVK8'; // Set the user ID to the guest user ID if the guest is logged in
    }
    if (!userId) {
        console.error('User not found'); // Log an error message if user ID is not found
        return;
    }
    try {
        await deleteData('/users/' + userId + '/tasks/' + taskId); // Delete the contact data from the server

        closeTaskCardOverview(); // Close the task card overview
        window.location.reload(); // Reload the page        

    } catch (error) {
        console.error('Error deleting contact:', error); // Log an error message if there is an error deleting the contact
    }
}


// Such Funktion
function searchForTasks() {
    let search = document.getElementById('seachFieldBoard').value.toLowerCase();    //suche die value aus dem feld
    let todo = document.getElementById('toDoContainer');        // ziehe den inhalt aus den feldern
    let inProgress = document.getElementById('progressContainer');
    let awaitFeedback = document.getElementById('feedbackContainer');
    let done = document.getElementById('doneContainer');
    clearEveryCategorie(todo, inProgress, awaitFeedback, done);  // lösche alles

    tasks.forEach(task => {  //durchsuche die tasks
        if (task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search)) {  //suche nach dem wort
            if (task.status === 'open') {
                todo.innerHTML += taskCardHTML(task);  //füge es in die kategorie ein
            } else if (task.status === 'inProgress') {
                inProgress.innerHTML += taskCardHTML(task);
            } else if (task.status === 'awaitFeedback') {
                awaitFeedback.innerHTML += taskCardHTML(task);
            } else if (task.status === 'done') {
                done.innerHTML += taskCardHTML(task);
            }
        }          

    });
    displayNoTasks();
}

function clearEveryCategorie(todo, inProgress, awaitFeedback, done) {
    todo.innerHTML = '';
    inProgress.innerHTML = '';
    awaitFeedback.innerHTML = '';
    done.innerHTML = '';
}
//----------------------------------------------

//Edit Task function

function openEditTask(taskId) {
    let task = tasks.find(t => t.id === (taskId));
    if (task) {
        document.getElementById('mainBoard').innerHTML += taskCardEditHTML(task);
        closeTaskCardOverview();
    } else {
        console.error('Task not found with ID:', taskId);
    }
}

function closeEditTask() {
    document.getElementById('taskCardEditBackground').remove();
}

async function selectEditAssigned(taskId){
        const selectedAssigned = [];
        const inputAssigned = document.getElementById(`assigned${taskId}`);
        const checkboxes = document.querySelectorAll('.assignedCheckbox');

        checkboxes.forEach(checkbox => {
            // Get the contact name element
            const contactNameElement = checkbox.parentNode.querySelector('p[id^="contactName"]');
            
            if (checkbox.checked && contactNameElement) {
                const contactName = contactNameElement.textContent.trim();
                const contact = contacts.find(c => c.name === contactName);
                if (contact) {
                    selectedAssigned.push(contact);                   
                }
            }
        });

        // Set the value of the input field
        if (inputAssigned) {
            inputAssigned.value = selectedAssigned.length > 0 ? 'An: ' + selectedAssigned.map(c => c.name).join(', ') : '';    
        } else {
            console.error(`Input field assigned${taskId} not found`);
        }       

        return selectedAssigned;
    }