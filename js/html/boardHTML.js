function loadEmptyToDoColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks To do</p>
        </div>
    `;
}

function loadEmptyInProgressColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks To do</p>
        </div>
    `;
}

function loadEmptyAwaitFeedbackColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks waiting for feedback</p>
        </div>
    `;
}

function loadEmptyDoneColumn() {
    return /*html*/ `
        <div class="noTasksToDo">
            <p class="noTasksText">No tasks Done</p>
        </div>
    `;
}

function loadTasksHTML(task) {    
    return /*html*/ `
        <div class="taskCard" id="taskCard0" onclick="openTask()" draggable="true" ondragstart="dragTask()">
            <div class="cardBody">
                <p class="userStory">${task.Category}</p>
                <div class="taskHeadline">
                    ${task.title}
                </div>
                <div class="taskDescr">
                    ${task.description}
                </div>
                    ${subtaskProgressbarHTML()}
                <div class="taskFooter">
                    <div class="profiles">
                        <div class="profileIcon" style="background-color:#FFBB2B;">${task.Assigned[0].initials}</div>
                        <div class="profileIcon" style="background-color:#FFA35E;">TM</div>
                        <div class="profileIcon" style="background-color:#1FD7C1;">DM</div>
                    </div>
                    <img class="prioritySymbol" src="./img/Mobile/Board/priorityNormal.png" alt="priority Level">
                </div>
            </div>
        </div>
        
    `;
}

function subtaskProgressbarHTML(){
    return `
    <div class="subtasks">
    <div class="progressBar"></div>
    <div class="progressText">
        <span class="complTasks">2</span>/<span class="totalNumOfTasks">2</span>Subtasks</div>
    </div>
    `;
}