function loadEmptyToDoColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks To do</p>
        </div>
    `
}

function loadEmptyInProgressColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks To do</p>
        </div>
    `
}

function loadEmptyAwaitFeedbackColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks waiting for feedback</p>
        </div>
    `
}

function loadEmptyDoneColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks Done</p>
        </div>
    `
}

function loadTasksHTML(task, numberOfTask) {    
    return /*html*/ `
        <div class="taskCard" id="taskCard${numberOfTask}" onclick="openTask(${numberOfTask})" draggable="true" ondragstart="dragTask()">
            <div class="cardBody">
                <p class="${((task.Category == 'Technical Task') ? ('technicalTask') : (task.Category == 'User Story') ? ('userStory') : (''))}">${task.Category}</p>
                <div class="taskHeadline">
                    ${task.title}
                </div>
                <div class="taskDescr">
                    ${task.description}
                </div>
                <div class="subtasks">
                    ${subtaskProgressbar(task)}
                </div>
                <div class="taskFooter">
                    <div class="profiles">
                        <div class="profileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                        <div class="profileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                        <div class="profileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                    </div>
                    <img class="prioritySymbol" src="${task.Priority.imgSrc}" alt="priority Level">
                </div>
            </div>
        </div>  
    `
}

function subtaskProgressbarHTML(subtask) {
    console.log(subtask.Subtasks.length);

    return /*html*/ `
        <div class="progressBar"></div>
        <div class="progressText">
            <span class="complTasks">${subtask.Subtasks.length}</span>
            /
            <span class="totalNumOfTasks">${subtask.Subtasks.length}</span>Subtasks
        </div>
    `
}

function viewTask(task, number) {
    return /*html*/ `
        <div class="overlayTask" id="task${number}">
            <div class="overlayHeader">
                <p class="userStory userStoryOverlay">${task.Category}</p>
                <img onclick="closeTask()" class="closeTask" src="./img/Mobile/Board/closeTask.png" alt="close Task">
            </div>
            <h1 class="overlayHeadline">${task.title}</h1>
            <p class="overlayDescription">
                ${task.description}
            </p>
            <div class="taskBody">
                <div class="dueDateSection bodySection">
                    <span class="dueDate spanDatePriorityAssigned">Due date:</span>
                    <span class="date">${task.date}</span>
                </div>
                <div class="prioritySection bodySection">
                    <span class="priorityTask spanDatePriorityAssigned">Priority:</span>
                    <span class="priorityLevel">${task.Priority.value}</span><img src="${task.Priority.imgSrc}" alt="priority Level">
                </div>
                <div class="assignedToSection bodySection"> <!-- auslagern um die einzelnen assigned Contacts anzuzeigen -->
                    <span class="assignedTo spanDatePriorityAssigned">Assigned To:</span>
                    <div class="assignedToProfiles">
                        <div class="taskProfile">
                            <div class="profileIcon taskProfileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                            <span>${task.Assigned[0].name}</span>
                        </div>
                        <div class="taskProfile">
                            <div class="profileIcon taskProfileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                            <span>${task.Assigned[0].name}</span>
                        </div>
                        <div class="taskProfile">
                            <div class="profileIcon taskProfileIcon" style="background-color:${task.Assigned[0].profileColor};">${task.Assigned[0].initials}</div>
                            <span>${task.Assigned[0].name}</span>
                        </div>
                    </div>
                </div>
                <div class="taskSubtask">
                    ${((task.Subtasks == null) ? '' : `<h3 class="subtasksHeadline spanDatePriorityAssigned">Subtasks</h3><div id="loadSubtasks"></div>`)}
                    ${((task.Subtasks == null) ? '' : renderSubtasks(task))}
                </div>
            </div>
            <div class="showTaskFooter">
                <div class="deleteEditTask">
                    <img class="taskFooterIcon taskFooterIconDelete" src="./img/Mobile/Board/deleteWithText.png" alt="">
                    <!-- <span>Delete</span> -->
                </div>
                <img class="barFooter" src="./img/Mobile/Board/bar.png">
                <div class="deleteEditTask" onclick="openEditTask()">
                    <img class="taskFooterIcon taskFooterIconEdit" src="./img/Mobile/Board/editTaskWithText.png" alt="">
                    <!-- <span>Edit</span> -->
                </div>
            </div>
        </div>
    `
}

function renderSubtasks(subtasks) {
    for (let i = 0; i < subtasks.Subtasks.length; i++) {
        console.log(subtasks.Subtasks[i]);
        return /*html*/ `
        <div class="taskSubtasks">
            <input class="checkboxSubtasks" type="checkbox">
            <span>${subtasks.Subtasks[i]}</span>
        </div>
    `;
    }
}

function showSubtask() {
    return /*html*/ `
        <div class="taskSubtasks">
            <input class="checkboxSubtasks" type="checkbox" checked>
            <span>${subtask[0]}</span>
        </div>
    `;
}