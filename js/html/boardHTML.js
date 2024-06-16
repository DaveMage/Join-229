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

function loadTasksHTML() {
    return /*html*/ `
        <div class="taskCard" id="taskCard0" onclick="openTask()" draggable="true" ondragstart="dragTask()">
            <div class="cardBody">
                <p class="userStory">User Story</p>
                <div class="taskHeadline">
                    Kochwelt Page & Recipe Recommender
                </div>
                <div class="taskDescr">
                    Build start page with recipe recommendation...
                </div>
                <div class="subtasks">
                    <div class="progressBar"></div>
                    <div class="progressText">
                        <span class="complTasks">2</span>/<span class="totalNumOfTasks">2</span>Subtasks</div>
                </div>
                <div class="taskFooter">
                    <div class="profiles">
                        <div class="profileIcon" style="background-color:#FFBB2B;">AM</div>
                        <div class="profileIcon" style="background-color:#FFA35E;">TM</div>
                        <div class="profileIcon" style="background-color:#1FD7C1;">DM</div>
                    </div>
                    <img class="prioritySymbol" src="./img/Mobile/Board/priorityNormal.png" alt="priority Level">
                </div>
            </div>
        </div>
        <div class="taskCard" id="taskCard1" onclick="openTask()" draggable="true" ondragstart="dragTask()">
            <div class="cardBody">
                <p class="technicalTask">Technical Task</p>
                <div class="taskHeadline">
                    HTML Base Template Creation
                </div>
                <div class="taskDescr">
                    Create reusable HTML base templates...
                </div>
                <div class="subtasks">
                    <div class="progressBar"></div>
                    <div class="progressText">
                        <span class="complTasks">2</span>/<span class="totalNumOfTasks">2</span>Subtasks
                    </div>
                </div>
                <div class="taskFooter">
                    <div class="profiles">
                        <div class="profileIcon" style="background-color:#FFBB2B;">AM</div>
                        <div class="profileIcon" style="background-color:#FFA35E;">TM</div>
                        <div class="profileIcon" style="background-color:#1FD7C1;">DM</div>
                    </div>
                    <img class="prioritySymbol" src="./img/Mobile/Board/priorityImportant.png" alt="">
                </div>
            </div>
        </div>
    `;
}