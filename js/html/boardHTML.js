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

function loadTasksHTML(task) {
    return /*html*/ `
        <div class="taskCard" id="taskCard${task.id}" draggable="true" ondragstart="dragTask()" onclick="viewTask2('${task.id}')">
            <div class="cardBody">
                <p class="${((task.category == 'Technical Task') ? ('technicalTask') : (task.category == 'User Story') ? ('userStory') : (''))}">${task.category}</p>
                <div class="taskCardHeadlineDescription">
                    <div class="taskHeadline">
                        ${task.title}
                    </div>
                    <div class="taskDescr">
                        ${task.description}
                    </div>
                </div>
                <div class="subtasks">
                    ${subtaskProgressbarHTML(task)}
                </div>
                <div class="taskFooter">
                    <div class="assignedToProfiles">
                    ${assingedProfileIconHtml(task)}
                    </div>
                    
                    <img class="prioritySymbol" src="${task.priority.imgSrc}" alt="priority Level">
                </div>
            </div>
        </div>  
    `
}

function assingedProfileIconHtml(task) { 
    let assignedProfilesHtml = '';  
    
    for (let i = 0; i < task.assigned.length; i++) {
        assignedProfilesHtml += `
        <div class="taskProfileIcon profileIcon" style="background-color:${task.assigned[i].profileColor};">
        ${task.assigned[i].initials}</div>`;
        
    }

    return assignedProfilesHtml;
}



function subtaskProgressbarHTML(task) {
    let subtaskContentHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const progressPercentage = (completedSubtasks / task.subtasks.length) * 100;

        subtaskContentHtml = `
                <div class="taskCardSubtaskbar">
                  <div class="taskCardSubtaskbarBackground">
                      <div class="taskCardSubtaskProgressbar" style="width: ${progressPercentage}%;"></div>
                      </div>
                  <div class="taskCardSubtaskCounter">${completedSubtasks}/${task.subtasks.length} Subtasks</div>
              </div>`;
    }
    return subtaskContentHtml;
}

function viewTask2(task) {
    return `
        <div class="test">${task.id}</div>
    `;
}

function viewTask(task) {
    return /*html*/ `
        <div class="overlayTask" id="task${task.id}">
            <div class="overlayHeader">
                <p class="userStory userStoryOverlay">${task.category}</p>
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
                    <span class="priorityLevel">${task.priority.value}</span><img src="${task.priority.imgSrc}" alt="priority Level">
                </div>
                <div class="assignedToSection bodySection"> <!-- auslagern um die einzelnen assigned Contacts anzuzeigen -->
                    <span class="assignedTo spanDatePriorityAssigned">Assigned To:</span>
                    <div class="assignedToProfiles">
                        <div class="taskProfile">
                            <div class="profileIcon taskProfileIcon" style="background-color:${task.assigned[0].profileColor};">${task.assigned[0].initials}</div>
                            <span>${task.assigned[0].name}</span>
                        </div>                    
                        
                    </div>
                </div>
                <div class="taskSubtask">
                    ${((task.subtasks == null) ? '' : `<h3 class="subtasksHeadline spanDatePriorityAssigned">Subtasks</h3><div id="loadSubtasks"></div>`)}
                    ${((task.subtasks == null) ? '' : renderSubtasks(task))}
                </div>
            </div>
            <div class="showTaskFooter">
                <div class="deleteEditTask" onclick="deleteTask(${task.id})">
                    <img class="taskFooterIcon taskFooterIconDelete" src="./img/Mobile/Board/deleteWithText.png">
                    <!-- <span>Delete</span> -->
                </div>
                <img class="barFooter" src="./img/Mobile/Board/bar.png">
                <div class="deleteEditTask" onclick="openEditTask()">
                    <img class="taskFooterIcon taskFooterIconEdit" src="./img/Mobile/Board/editTaskWithText.png">
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