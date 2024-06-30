function displayNoTasksToDo() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks To do</p>
        </div>
    `
}

function displayNoTasksDone() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Done</p>
        </div>
    `
}

function displayNoTasksFeedback() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Await feedback</p>
        </div>
    `
}

function displayNoTasksProgress() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks In progress</p>
        </div>
    `
}

function taskCardHTML(task) {
    return /* html */ `<div class="taskCard" ${task.status} id=${task.id} draggable="true" ondragstart="startDragging(event, '${task.id}')" onclick="displayOverviewTaskCard('${task.id}')">

    <div class="taskCardMain">
    ${taskCardCategoryHTML(task)}
      <div class="taskCardTitleDescriptionContainer">
        <div class="taskCardTitle">${task.title}</div>
        <div class="taskCardDescription">${task.description}</div>
      </div>      
      ${subtaskProgressbarHTML(task)}
      <div class="taskCardAssingedPrio">
      <div class="taskCardAssigned">
      ${assingedProfileIconHtml(task)} 
      </div>
      <div class="taskCardPriority"><img src="${task.priority.imgSrc}"></div>  
    </div> 
    </div>
  </div>`;
}


function taskCardCategoryHTML(task) {
    let categoryColor = '';
    let categoryText = '';

    if (task.category) {
        if (task.category === 'Technical Task') {
            categoryColor = 'style="background-color: #1FD7C1"';
        } else {
            categoryColor = 'style="background-color: #0038FF"';
        }

        categoryText = `
        <div class="taskCardCategory" ${categoryColor}>${task.category}</div>`;
    }

    return categoryText;
}

function assingedProfileIconHtml(task) {
    // Überprüfen, ob task.assigned leer ist
    if (!task.assigned || task.assigned.length === 0) {
        return '';
    }

    let assignedProfilesHtml = '';

    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assignedProfilesHtml += /*html*/ `          
                <div class="taskCardProfileIcon" style="background-color:${task.assigned[i].profileColor};">
                ${task.assigned[i].initials}</div>`;
        }
    }

    return assignedProfilesHtml;
}

function subtaskProgressbarHTML(task) {
    let subtaskContentHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const progressPercentage = (completedSubtasks / task.subtasks.length) * 100;

        subtaskContentHtml = /*html*/ `
        <div class="taskCardSubtaskContainer">
            <div class="subtaskProgressbar">
                <div class="subtaskProgressbarFill" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class='subtaskText'>${completedSubtasks}/${task.subtasks.length} Subtasks</div>
        </div>`;
    }
    return subtaskContentHtml;
}

//Task Card Overwiew

function overviewTaskCardHTML(task) {
    return /* html */`
    <div class="background" id="taskCardOverviewBackground">
    <div class="taskCardOverviewBody">
      <div class="taskCardOverviewMain">
        <div class="taskCardOverviewCategoryCloseContainer">
          ${taskCardCategoryHTML(task)}
          <img src="/img/Mobile/Board/closeTask.png" onclick="closeTaskCardOverview()">
        </div>  

        <h2 class="taskCardOverviewTitle">${task.title}</h2>

        <p class="taskCardOverviewDescription">${task.description}</p>

        <div class="taskCardOverviewLabelContainer">
          <p class="taskCardOverviewLabel">Due date:</p>
          <p class="taskCardOverview">${task.date}</p>
      </div>

      <div class="taskCardOverviewLabelContainer">
        <p class="taskCardOverviewLabel">Priority:</p>
        <p class="taskCardOverview">${task.priority.value}</p>
        <img src="${task.priority.imgSrc}">
    </div>

    <div class="taskCardOverviewAssignedContainer">
      <p class="taskCardOverviewLabel">Assigned To:</p>
      <div class="taskCardOverviewAssigneds">
        ${overviewTaskCardAssignedHtml(task)}     
    </div>
    </div>

     <div class="taskCardOverviewSubtaskContainer">
      <div class="taskCardOverviewLabel">Subtasks</div>
      <div class="taskCardOverviewSubtasks">
        ${overviewTaskCardSubtaskHtml(task)}        
      </div>
     </div>

     <div class="taskCardOverviewBtnContainer">
      <button class="taskCardOverviewBtn" id="taskCardOverviewEditBtn" onclick="openEditTask('${task.id}')"><img src="/img/Mobile/Board/editTask.png" >Edit</button>
      <span class="taskCardOverviewSeperator"></span>
      <button class="taskCardOverviewBtn" id="taskCardOverviewDeleteBtn" onclick="deleteTask('${task.id}')"><img src="/img/Mobile/Board/delete.png" >Delete</button>      
     </div>

    </div>
  </div>
</div>
    `;
}

function overviewTaskCardAssignedHtml(task) {
    // Überprüfen, ob task.assigned leer ist
    if (!task.assigned || task.assigned.length === 0) {
        return '';
    }

    let assignedProfilesHtml = '';

    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assignedProfilesHtml += /*html*/ `          
                <div class="taskCardOverviewContact">
                <div class="taskCardOverviewProfileIcon" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>
                <p class="taskCardOverviewAssignedName">${task.assigned[i].name}</p>
              </div>`;
        }
    }

    return assignedProfilesHtml;
}

function overviewTaskCardSubtaskHtml(task) {
    if (task.subtasks && task.subtasks.length > 0) {
        let subtaskHtml = '';
        for (let i = 0; i < task.subtasks.length; i++) {
            subtaskHtml += /*html*/ `
            <div class="taskCardOverviewSubtask">
          <input type="checkbox" name="${task.id}" id="${task.id}">
          <label for="${task.id}">${task.subtasks[i]}</label>
        </div>`;
        }
        return subtaskHtml;
    }
    return '';
}

function taskCardEditHTML(task) {   
    
    return /* html */`
    <div class="background" id="taskCardEditBackground">
    <div class="taskCardEditBody">
    <div class="taskCardEditMain">
        <div class="closeBtnContainer"><img src="/img/Mobile/Board/closeTask.png" onclick="closeEditTask()"></div>
        <form class="editTaskForm">

        <div class="labelInputContainer">
            <label for="title${task.id}">Title</label>
            <input type="text" id="title${task.id}" name="title${task.id}" value="${task.title}" class="inputText">
        </div>

        <div class="labelInputContainer">
            <label for="description${task.id}">Description</label>
            <textarea  id="description${task.id}" name="description${task.id}" class="inputTextarea">${task.description}</textarea>
        </div>
    
        <div class="labelInputContainer">
            <label for="date${task.id}">Due date</label>
            <input type="date" id="date${task.id}" name="date${task.id}" value="${task.date}" class="inputDate inputText">
        </div>

        <div class="labelInputContainer">
            Priority
            <div class = "prioRadioContainer">
                <div class="prioRadio">
                    <input class="inputUrgent" type="radio" id="urgent${task.id}" name="priority${task.id}" value="Urgent" ${task.priority.value === 'Urgent' ? 'checked' : ''} hidden >
                    <label id="labelUrgent" class="prioLabelImg" for="urgent${task.id}">Urgent <img src="/img/Mobile/AddTask/urgentIconAddTask.png" /> </label>
                </div>

                <div class="prioRadio">
                    <input class="inputMedium" type="radio" id="medium${task.id}" name="priority${task.id}" value="Medium" ${task.priority.value === 'Medium' ? 'checked' : ''} hidden >
                    <label id="labelMedium" class="prioLabelImg" for="medium${task.id}">Medium <img src="/img/Mobile/AddTask/mediumIconAddTask.png" /></label>
                </div>

                <div class="prioRadio">
                    <input class="inputLow" type="radio" id="low${task.id}" name="priority${task.id}" value="Low" ${task.priority.value === 'Low' ? 'checked' : ''} hidden >
                    <label id="labelLow" class="prioLabelImg" for="low${task.id}">Low <img src="/img/Mobile/AddTask/lowIconAddTask.png" /> </label>
                </div>
            </div>
        </div>

        <div class="labelInputContainer">
            Assigned to

            <div class="inputImgContainer">
                <input type="text" id="assigned${task.id}" name="assigned${task.id}" placeholder="Select contacts to assign" readonly>
                <img src="/img/Mobile/AddTask/arrowDropDownaa.png">
            </div>

            <div id="profileIconAssingedContainer">
            ${displayAssignedProfileIcons(task)}
            </div>
        </div>

        <div class="labelInputContainer">
        Subtasks
            <div class="inputImgContainer">
                <input type="text" id="subtask${task.id}" name="subtask${task.id}" placeholder="Add new subtask" readonly>
                <img src="/img/Mobile/Board/addSubtask.png">
            </div>
            <ul id="subtaskContainer${task.id}">
                ${displaySubtasksHTML(task)}
            </ul>
        </div>


        </form>
        <div class="taskCardEditBtnContainer">
            <button class="taskCardEditBtn primaryBtn" id="taskCardEditSaveBtn" onclick="saveEditTask('${task.id}')">Ok <img src="/img/Mobile/Board/check.png"></button>
            
        </div>
    </div>
    </div>
    </div>
    `;
}

function displaySubtasksHTML(task) {
    let subtaskHtml = '';
    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            subtaskHtml += /*html*/ `
            <li class="subtaskItem"><input type="text" class="subtaskItemInput" value="${task.subtasks[i]}" readonly>            
            <div class="subtaskItemIconContainer">
            <img src="/img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon">
            <span class="subtaskSeperator"></span>
            <img src="/img/Mobile/AddTask/trashIcon.png" alt="Edit Icon" class="subtaskItemIcon" 
            id="subtaskItemRightIcon"
            >
            </div>
            </li>`;
        }
    }
    return subtaskHtml;
}

function displayAssignedProfileIcons(task) {
    let profileIconHtml = '';
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            profileIconHtml += /*html*/ `
            <div class="profileIcon" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>`;
        }
    }
    return profileIconHtml;
}
