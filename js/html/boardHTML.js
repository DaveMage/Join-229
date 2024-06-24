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
        <div class="taskCard" id="taskCard${task.id}" draggable="true" ondragstart="dragTask()" onclick="openTask('${task.id}')">
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
    // Überprüfen, ob task.assigned leer ist
    if (!task.assigned || task.assigned.length === 0) {
        return '';
    }

    let assignedProfilesHtml = '';

    for (let i = 0; i < task.assigned.length; i++) {
        if(task.assigned[i]){
            assignedProfilesHtml += /*html*/ `
                <div class="taskProfileIcon profileIcon" style="background-color:${task.assigned[i].profileColor};">
                ${task.assigned[i].initials}</div>
            `;
        } else {
            return '';
        }
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

function viewTask(task) {
    return /*html*/ `
        <div class="taskOverlayBackground" id="taskOverlayBackground">
            <div class="overlayTask" id="task${task.id}">
                <div class="overlayHeader">
                <p class="${((task.category == 'Technical Task') ? ('technicalTask') : (task.category == 'User Story') ? ('userStory') : (''))}">${task.category}</p>
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
                        <div class="assignedToProfiles assignedToProfilesTask">
                            ${renderAssignedProfiles(task)}
                        </div>
                    </div>
                    <div class="taskSubtask">
                        ${((task.subtasks == null) ? '' : `<h3 class="subtasksHeadline spanDatePriorityAssigned">Subtasks</h3><div id="loadSubtasks"></div>`)}
                        ${((task.subtasks == null) ? '' : renderSubtasks(task))}
                    </div>
                </div>
                <div class="showTaskFooter">
                    <div class="deleteEditTask" onclick="deleteTask('${task.id}')">
                        <img class="taskFooterIcon taskFooterIconDelete" src="./img/Mobile/Board/deleteWithText.png">
                    </div>
                    <img class="barFooter" src="./img/Mobile/Board/bar.png">
                    <div class="deleteEditTask" onclick="openEditTask('${task.id}')">
                        <img class="taskFooterIcon taskFooterIconEdit" src="./img/Mobile/Board/editTaskWithText.png">
                    </div>
                </div>
            </div>
        </div>
    `
}

function renderAssignedProfiles(task) {
    let assigendProfilesEditHTML = '';

    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assigendProfilesEditHTML += /*html*/ `
                <div class="taskProfile">
                    <div class="showTaskProfileIcon showTaskProfileIcon editTaskProfileIcon" style="background-color:${task.assigned[i].profileColor};">
                        ${task.assigned[i].initials}
                    </div>
                    <span>${task.assigned[i].name}</span>
                </div>
            `;
        } else {
            return '';
        }
    }
        return assigendProfilesEditHTML
}

function renderSubtasks(subtasks) {
    for (let i = 0; i < subtasks.subtasks.length; i++) {
        console.log(subtasks.subtasks[i]);
        return /*html*/ `
        <div class="taskSubtasks">
            <input class="checkboxSubtasks" type="checkbox">
            <span>${subtasks.subtasks[i]}</span>
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

function displayEditTask(task) {
    return /*html*/ `
        <div class="editTaskOverlayBackground" id="editTaskOverlayBackground">
            <div class="editTaskOverlay">
                <div class="closeEditTask">
                    <img onclick="closeEditTask()" class="closeTask" src="./img/Mobile/Board/closeTask.png" alt="close Task"/>
                </div>
                <div class="editTaskHeader">
                    <h4>Title</h4>
                    <input class="editTaskField editTitle" value="${task.title}">
                </div>
                <div class="editTaskDescription">
                    <h4>Description</h4>
                    <textarea class="editTaskField editDescription" rows="4">${task.description}</textarea>
                </div>
                <!-- edit Date -->
                <div class="editTaskDueDate">
                <label for="addTaskDueDate" class="addTaskLabel">
                    <p>Due Date</p>
                    <input type="date" class="addTaskInput" id="addTaskDueDate" placeholder="Select a Date" value="${task.date}"/>
                </label>
                </div>
                <!-- edit Priority -->
                <div class="priority">
                <label for="addTaskPriority" class="addTaskLabel"> Priority </label>
                <!-- Prio input Radio als btn -->
                <div class="prioContainer">
                    
                    <!-- Prio input Radio Urgent -->
                    <input type="radio" id="urgent" name="priority" value="urgent" hidden/>
                    <label for="urgent" class="prioLabel" id="prioUrgent">
                        Urgent
                        <img src="/img/Mobile/AddTask/urgentIconAddTask.png" />
                    </label>
                    
                    <!-- Prio input Radio Medium -->
                    <input type="radio" id="medium" name="priority" value="medium" hidden/>
                    <label for="medium" class="prioLabel" id="prioMedium">
                        Medium
                        <img src="/img/Mobile/AddTask/mediumIconAddTask.png" />
                    </label>
                    
                    <!-- Prio input Radio Low -->
                    <input type="radio" id="low" name="priority" value="low" hidden />
                    <label for="low" class="prioLabel" id="prioLow">
                        Low
                        <img src="/img/Mobile/AddTask/lowIconAddTask.png" />
                    </label>
                </div>
                </div>
                <!-- edit Contacts -->
                <div class="edtiTaskCategory">
                <label for="addTaskCategory" class="addTaskLabel">
                    Category
                    <div class="addTaskInputIconContainer">
                        <input
                            id="addTaskCategory"
                            type="text"
                            placeholder="Select contacts to assign"
                            class="addTaskInput"
                            readonly
                            onclick="toggleCategoryDropdown()"
                        />
                        <img
                            class="dropdownIcon"
                            id="categoryDropdownArrow"
                            src="/img/Mobile/AddTask/arrowDropDownaa.png"
                        />
                    </div>
                    <div class="customDropdownCategory customDropdownBox" id="dropdownCategory">
                        <div class="dropdownItemCategory contactDropdown">
                            <div class="contactDropout">
                                <div class="profileIcon taskProfileIcon" style="background-color: #1fd7c1">
                                    EM
                                </div>
                                Emmanuel Mauer
                            </div>
                            <img src="./img/Mobile/Board/checkButtonMobile.png" alt="" />
                        </div>
                    </div>
                </label>
                </div>
                
                <!-- edit Subtasks -->
                <div class="editSubtasks">
                    <p>Subtasks</p>
                    <input type="text" class="subtaskField" placeholder="Add new Subtask" rows="1"/>
                </div>
                
                <!-- accept changes -->
                <div class="acceptChanges">
                    <div class="saveChanges" onclick="saveTaskChanges()">
                        <p class="acceptOK">Ok</p>
                        <img src="./img/Mobile/Board/check.png" />
                    </div>
                </div>
            </div>
        </div>
    `;
}