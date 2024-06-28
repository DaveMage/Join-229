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
          <div class="taskCardOverviewCategory"></div>
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
      <button class="taskCardOverviewBtn" id="taskCardOverviewEditBtn"><img src="/img/Mobile/Board/editTask.png" >Edit</button>
      <span class="taskCardOverviewSeperator"></span>
      <button class="taskCardOverviewBtn" id="taskCardOverviewDeleteBtn"><img src="/img/Mobile/Board/delete.png" onclick="deleteTaskCard('${task.id}')">Delete</button>      
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




