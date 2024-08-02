function displayNoTasksToDo() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks To do</p>
        </div>`;
};


function displayNoTasksDone() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Done</p>
        </div>`;
};


function displayNoTasksFeedback() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Await feedback</p>
        </div>`;
};


function displayNoTasksProgress() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks In progress</p>
        </div>`;
};


function menuMoveToHtml(taskId) {
    return /*html*/ `
    <div class="menuMoveTo" id="moveToMenu${taskId}">
            <div class="moveToHeader">
                <span class="menuMoveToText">move to:</span>
                <img src="./img/Mobile/Board/closeTask.png" onclick="event.stopPropagation(); closeMoveToMenu('${taskId}')">
            </div>
        <div class="menuMoveToContainer">
            <div class="menuMoveToItem" onclick="event.stopPropagation();moveToClick('open', '${taskId}')">To do</div>
            <div class="menuMoveToItem" onclick="event.stopPropagation();moveToClick('inProgress', '${taskId}')">In progress</div>
            <div class="menuMoveToItem" onclick="event.stopPropagation();moveToClick('awaitFeedback', '${taskId}')">Await feedback</div>
            <div class="menuMoveToItem" onclick="event.stopPropagation();moveToClick('done', '${taskId}')">Done</div>
        </div>
    </div>
    `;
};


function taskCardHTML(task) {
    return /* html */ `
    <div class="taskCard" ${task.status} id=${task.id} draggable="true"
    ondragstart="startDragging(event, '${task.id}')" onclick="displayOverviewTaskCard('${task.id}')">
        <div class="taskCardMain">
            <div class="taskCardCategoryImg">
                ${taskCardCategoryHTML(task)}
                <img id="movoToMenuImg" src="./img/Mobile/Board/3dotsMenu32px.png" onclick="event.stopPropagation(); displayMoveToMenu('${task.id}')">
            </div>
        <div class="taskCardTitleDescriptionContainer">
            <div class="taskCardTitle">${task.title}</div>
            <div class="taskCardDescription">${task.description}</div>
        </div>      
        ${subtaskProgressbarHTML(task)}
        <div class="taskCardAssingedPrio">
            <div class="taskCardAssigned">
                ${assingedProfileIconHtml(task)} 
            </div>
        <div class="taskCardPriority"><img src="${task.prio.imgSrc}"></div>  
        </div> 
        </div>
    </div>
  `;
};


function taskCardCategoryHTML(task) {
    let categoryColor = "";
    let categoryText = "";
    if (task.category) {
        if (task.category === "Technical Task") {
            categoryColor = 'style="background-color: #1FD7C1"';
        } else {
            categoryColor = 'style="background-color: #0038FF"';
        }
        categoryText = `<div id="editCardCategory" class="taskCardCategory" ${categoryColor}>${task.category}</div>`;
    }
    return categoryText;
};


function overviewTaskCardCategoryHTML(task) {
    let categoryColor = "";
    let categoryText = "";
    if (task.category) {
        if (task.category === "Technical Task") {
            categoryColor = 'style="background-color: #1FD7C1"';
        } else {
            categoryColor = 'style="background-color: #0038FF"';
        }
        categoryText = `<div id="editCardCategory" class="taskCardCategory fsize23 px4y24" ${categoryColor}>${task.category}</div>`;
    }
    return categoryText;
};


function assingedProfileIconHtml(task) {
    // Überprüfen, ob task.assigned leer ist
    if (!task.assigned || task.assigned.length === 0) {
        return "";
    }
    let assignedProfilesHtml = "";
    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assignedProfilesHtml += /*html*/ `          
                <div class="taskCardProfileIcon" style="background-color:${task.assigned[i].profileColor};">
                ${task.assigned[i].initials}</div>`;
        }
    }
    return assignedProfilesHtml;
};


function subtaskProgressbarHTML(task) {
    let subtaskContentHtml = "";

    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(
            (subtask) => subtask.completed
        ).length;
        const progressPercentage = (completedSubtasks / task.subtasks.length) * 100;

        subtaskContentHtml = /*html*/ `
        <div class="taskCardSubtaskContainer">
            <div class="subtaskProgressbar">
                <div class="subtaskProgressbarFill" id="progressbar${task.id}" style="width: ${progressPercentage}%;"></div>
            </div>
            <div class='subtaskText'>${completedSubtasks}/${task.subtasks.length} Subtasks</div>
        </div>
        `;
    }

    return subtaskContentHtml;
};


function overviewTaskCardHTML(task) {
    return /* html */ `
    <div class="background" id="taskCardOverviewBackground">
        <div class="taskCardOverviewBody" id="taskCardOverviewBodyId">
            <div class="taskCardOverviewMain">
                <div class="taskCardOverviewCategoryCloseContainer">
                    ${overviewTaskCardCategoryHTML(task)}
                    <img src="./img/Mobile/Board/closeTask.png" onclick="closeTaskCardOverview()">
                </div>

                <h2 id="editCardTitle" class="taskCardOverviewTitle">${task.title}</h2>
                <p id="editCardDescription" class="taskCardOverviewDescription fsize20">${task.description}</p>
                <div class="taskCardOverviewLabelContainer">
                    <p class="taskCardOverviewLabel fsize20">Due date:</p>
                    <p id="editCardDate" class="taskCardOverview fsize20">${task.date}</p>
                </div>

                <div class="taskCardOverviewLabelContainer">
                    <p class="taskCardOverviewLabel fsize20">Priority:</p>
                    <p class="taskCardOverview priorityLabel fsize20">${task.prio.value}</p>
                    <img class="imgWidth24" src="${task.prio.imgSrc}">
                </div>

                <div class="taskCardOverviewAssignedContainer">
                    <p class="taskCardOverviewLabel fsize20">Assigned To:</p>
                    <div class="taskCardOverviewAssigneds">
                        ${overviewTaskCardAssignedHtml(task)}     
                    </div>
                </div>

                <div class="taskCardOverviewSubtaskContainer">
                    <div class="taskCardOverviewLabel fsize20">Subtasks</div>
                    <div class="taskCardOverviewSubtasks">${overviewTaskCardSubtaskHtml(task)}</div>
                </div>
                    <div class="taskCardOverviewBtnContainer">
                        <button class="taskCardOverviewBtn" id="taskCardOverviewDeleteBtn" onclick="deleteTask('${task.id}')"><img src="./img/Mobile/Board/delete.png">Delete</button>
                        <span class="taskCardOverviewSeperator"></span>
                        <button class="taskCardOverviewBtn" id="taskCardOverviewEditBtn" onclick="openEditTask('${task.id}')"><img src="./img/Mobile/Board/editTask.png">Edit</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="backgroundOverlay" id="backgroundOverlay" onclick="closeTaskCardOverview()"></div>
    `;
};


function overviewTaskCardAssignedHtml(task) {
    if (!task.assigned || task.assigned.length === 0) {
        return "";
    }

    let assignedProfilesHtml = "";

    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assignedProfilesHtml += /*html*/ `          
        <div class="taskCardOverviewContact">
            <div class="taskCardOverviewProfileIcon profileIcon42" style="background-color:${task.assigned[i].profileColor};">
                ${task.assigned[i].initials}
            </div>
            <p class="taskCardOverviewAssignedName fzise19">
                ${task.assigned[i].name}
            </p>
        </div>`;
        }
    }
    return assignedProfilesHtml;
};


function overviewTaskCardSubtaskHtml(task) {
    let subtaskItemsHtml = "";
    if (!task.subtasks || task.subtasks.length === 0) {
        return "";
    }

    for (let i = 0; i < task.subtasks.length; i++) {
        let subtaskItem = task.subtasks[i];
        let subtaskItemHtml = /* html */ `
            <div class="taskCardOverviewSubtask" onclick="toggleSubtask(${i}, '${task.id}')">
                <input type="checkbox" name="subtaskItem${i}" class="subtaskEditTask" id="subtaskItem${i}" ${subtaskItem.completed ? "checked" : ""}>
                <label class="subtaskItemInTask" for="subtaskItem${i}" onclick="toggleSubtask(${i}, '${task.id}')">${subtaskItem.name}</label>
            </div>
        `;
        subtaskItemsHtml += subtaskItemHtml;
    }

    return subtaskItemsHtml;
};


function taskCardEditHTML(task) {
    let assignedContactsString = task.assigned ? task.assigned.map((contact) => contact.name).join(", ") : "";
    return /* html */ `
    <div class="background" id="taskCardEditBackground">
        <div class="taskCardEditBody" id="taskCardEditBackgroundFloat">
            <div class="taskCardEditMain">
                <div class="closeBtnContainer"><img src="./img/Mobile/Board/closeTask.png" class="closeTaskBtnEditTask" onclick="closeEditTask()"></div>
                <form class="editTaskForm" id="addTaskForm">
                    <div class="labelInputContainer">
                        <label for="title${task.id}">Title</label>
                        <input type="text" id="title${task.id}" name="title${task.id}"
                        value="${task.title}" class="inputText focus-border">
                    </div>

                    <div class="labelInputContainer">
                        <label for="description${task.id}">Description</label>
                        <textarea  id="description${task.id}" name="description${task.id}" class="inputTextarea focus-border">${task.description}</textarea>
                    </div>
            
                    <div class="labelInputContainer">
                        <label for="date${task.id}">Due date</label>
                        <input type="date" id="date${task.id}" name="date${task.id}" value="${task.date}"
                        class="inputDate inputText focus-border">
                    </div>

                    <div class="labelInputContainer">
                        Priority
                        <div class = "prioRadioContainer">
                            <div class="prioRadio">
                                <input class="inputUrgent" type="radio" id="urgent${task.id}" name="priority${task.id}" value="Urgent"
                                    ${task.prio.value === "Urgent" ? "checked" : ""} hidden >
                                <label id="labelUrgent" class="prioLabelImg" for="urgent${task.id}">
                                    <span class="editTextPrio">Urgent</span>
                                    <img src="./img/Mobile/AddTask/urgentIconAddTask.png" />
                                </label>
                            </div>

                            <div class="prioRadio">
                                <input class="inputMedium" type="radio" id="medium${task.id}" name="priority${task.id}" value="Medium"
                                    ${task.prio.value === "Medium" ? "checked" : ""} hidden >
                                <label id="labelMedium" class="prioLabelImg" for="medium${task.id}">
                                    <span class="editTextPrio">Medium</span>
                                    <img src="./img/Mobile/AddTask/mediumIconAddTask.png" />
                                </label>
                            </div>

                            <div class="prioRadio">
                                <input class="inputLow" type="radio" id="low${task.id}" name="priority${task.id}" value="Low"
                                ${task.prio.value === "Low" ? "checked" : ""} hidden >
                                <label id="labelLow" class="prioLabelImg" for="low${task.id}">
                                    <span class="editTextPrio">Low</span>
                                    <img src="./img/Mobile/AddTask/lowIconAddTask.png" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="labelInputContainer">
                        Assigned to
                        <div class="inputImgContainer">
                            <input type="text" id="assigned${task.id}" name="assigned${task.id}" placeholder="Select contacts to assign"
                            readonly onclick="toggleEditAssignedDropdown('${task.id}')"
                            value="An: ${assignedContactsString}">
                            <img id="assignedIcon" src="./img/Mobile/AddTask/arrowDropDownaa.png"
                            onclick="toggleEditAssignedDropdown('${task.id}')">
                        </div>

                        <div id="editAssignedDropdown" class="customDropdownBox editTaskDropdownBox">
                            ${displayAssignedDropdown(task)}
                        </div>

                        <div id="profileIconAssingedContainer">
                            ${displayAssignedProfileIcons(task)}
                        </div>
                    </div>

                    <div class="labelInputContainer">
                        Subtasks
                        <div class="inputImgContainer">
                            <input type="text" id="subtask${task.id}" name="subtask${task.id}" placeholder="Add new subtask"
                            class="subtaskInput" readonly onclick="focusEditSubtaskInput('${task.id}')">
                            <div id="subtaskEditInputIconContainer">
                            
                            <img
                            src="./img/Mobile/AddTask/closeIcon.png"
                            id="closeSubtaskIcon"
                            style="display: none"
                            class="subtaskIcon"
                            onclick="emptySubtaskInput('${task.id}')"
                            />

                            <span class="subtaskSeperator" id="subtaskEditInputSeparator" style="display: none;"></span>

                            <img src="./img/Mobile/Board/addSubtask.png" onclick="focusEditSubtaskInput('${task.id}')" id="addEditSubtaskIcon">

                            <img
                            src="/img/Mobile/AddTask/checkIcon.png"
                            id="checkSubtaskIcon"
                            style="display: none"
                            class="subtaskIcon"
                            onclick="addEditSubtask('${task.id}')"
                            />
                            
                            </div>
                        </div>
                        <ul id="subtaskContainer${task.id}">
                            ${displaySubtasksHTML(task)}
                        </ul>
                    </div>
                </form>
                <div class="taskCardEditBtnContainer">
                    <button class="taskCardEditBtn primaryBtn" id="taskCardEditSaveBtn" onclick="saveEditTask('${task.id}')">
                      Ok
                      <img src="./img/Mobile/Board/check.png">
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="backgroundOverlay" id="backgroundOverlayEdit" onclick="closeEditTask()"></div>
    `;
}

function displayAssignedDropdown(task) {
    let assignedDropdownHtml = "";

    const assignedIds = task.assigned ? task.assigned.map((contact) => contact.id) : [];

    for (let i = 0; i < contacts.length; i++) {

        const isChecked = assignedIds.includes(contacts[i].id) ? "checked" : "";

        assignedDropdownHtml += /*html*/ `
        <div class="assignedItem" id="wrapper${contacts[i].id}">
            <label class="assignedIconNameContainer" for="assignedCheckbox${contacts[i].id}" class="customDropdownItem">
                <div class="profileIcon" style="background-color:${contacts[i].profileColor};">${contacts[i].initials}</div>
                <p data-value="${contacts[i].name}" class="contactName" id="contactName${contacts[i].id}">${contacts[i].name}</p>
            </label>
            <input class="assignedCheckbox" type="checkbox" id="assignedCheckbox${contacts[i].id}" name="contact${contacts[i].id}" data-value="${contacts[i].id}"
            ${isChecked} onchange="changeBgColorAssignedItem('${contacts[i].id}'); updateSelectedAssignedAndInputField('${task.id}')">
        </div>
    `;
    }

    return assignedDropdownHtml;
};


function toggleEditAssignedDropdown(taskId) {
    let task = tasks.find((task) => task.id === taskId);
    let dropdown = document.getElementById("editAssignedDropdown");
    let icon = document.getElementById("assignedIcon");

    dropdown.classList.toggle("show");
    if (dropdown.classList.contains("show")) {
        icon.style.transform = "rotate(180deg)";
        setTimeout(() => {
            document.addEventListener("click", handleClickOutsideEdit);
        }, 0);
    } else {
        icon.style.transform = "rotate(0deg)";
        document.removeEventListener("click", handleClickOutsideEdit);
        // openEditTask(taskId)
    }

    displayAssignedDropdown(task);
    // displayAssignedProfileIcons(task)
};


function handleClickOutsideEdit(event) {
    let dropdown = document.getElementById("editAssignedDropdown");
    let icon = document.getElementById("assignedIcon");

    if (!dropdown.contains(event.target) && !icon.contains(event.target)) {
        dropdown.classList.remove("show");
        icon.style.transform = "rotate(0deg)";
        document.removeEventListener("click", handleClickOutsideEdit);
    }
};


function changeBgColorAssignedItem(contactId) {
    let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
    let contactName = document.getElementById(`contactName${contactId}`);
    let assignedItem = assignedCheckbox.closest(".assignedItem");

    assignedItem.style.backgroundColor = assignedCheckbox.checked ? "#2A3647" : "#fff";
    contactName.style.color = assignedCheckbox.checked ? "#fff" : "#000";
    assignedCheckbox.style.backgroundImage = assignedCheckbox.checked ? "url(./img/Mobile/Board/checkButtonMobileChecked.png)" : "";
};


function displaySubtasksHTML(task) {
    let subtaskHtml = "";

    if (task.subtasks && task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            subtaskHtml += /*html*/ `
            <li class="subtaskItem">
                <input type="text" class="subtaskItemInput" value="${task.subtasks[i].name}"  id="subtaskEditInput${task.id}-${i}">            
                    <div class="subtaskItemIconContainer">
                        <img src="./img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon" onclick="editSubtask('${task.id}', '${i}')">
                        <span class="subtaskSeperator"></span>
                        <img src="./img/Mobile/AddTask/trashIcon.png" alt="Trash Icon" class="subtaskItemIcon" id="subtaskItemRightIcon" onclick="deleteSubtask('${task.id}', ${i})">
                    </div>
            </li>
        `;
        }
    }

    return subtaskHtml;
};


function displayAssignedProfileIcons(task) {
    let profileIconHtml = "";
    if (task.assigned && task.assigned.length > 0) {
        for (let i = 0; i < task.assigned.length; i++) {
            profileIconHtml += /*html*/ `
            <div class="profileIcon" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>`;
        }
    }
    return profileIconHtml;
};


function addNewTaskOnBoardHtml(taskStatus) {
    return /*html*/ `
        <div class="floatingAddTask" id="addTaskChard">
            <div class="addTaskBoardDesktop" id="forAnimationFloating">
                <div class="headerAddTaskOnBoard">
                    <h1 class="addTaskHeadline">Add Task</h1>
                    <img src="./img/Desktop/board/closeAddTask.png" class="closeButtonAddTask" onclick="closeAddTaskOnBoard()">
                </div>
                <form onsubmit="return false" id="addTaskForm" class="addTaskForm">
                    <div class="formInputsContainer">
                        <div class="addTaskDesktopColumns">
                            <label for="addTaskTitle" class="addTaskLabel">
                                <p>Title<span class="required">*</span></p>
                                <input type="text" placeholder="Enter a Title" class="addTaskInput focus-border" id="addTaskTitle"
                                onblur="titlequery()" />
                                <span id="errorSpanTitle" class="errorSpan">This field is required</span>
                            </label>

                            <label for="addTaskDescription" class="addTaskLabel" id="addTaskLabelDescription">
                                Description
                                <textarea placeholder="Enter a Description" class="addTaskInput addTaskDescription focus-border"
                                id="addTaskDescription" rows="4"></textarea>
                            </label>

                            <label for="addTaskFormAssignedInput" class="addTaskLabel">
                                Assigned To
                                <div class="addTaskInputIconContainer">
                                    <input id="addTaskFormAssignedInput" type="text" placeholder="Select contacts to assign"
                                        class="addTaskInput focus-border" onclick="toggleAssignedDropdown()" readonly />
                                    <img class="dropdownIcon" id="assignedDropdownArrow" src="./img/Mobile/AddTask/arrowDropDownaa.png" />
                                </div>
                                <div class="customDropdownAssigned customDropdownBox" id="dropdownAssigned"></div>
                            </label>
                        </div>

                        <span class="addTaskDesktopSeperator"></span>
                        <div class="addTaskDesktopColumns">
                            <label for="addTaskDueDate" class="addTaskLabel">
                                
                                <p>Due Date<span class="required">*</span></p>
                                <input type="date" class="addTaskInput focus-border" id="addTaskDueDate" placeholder="Select a Date"
                                onblur="datequery()" />
                                <span id="errorSpanDate" class="errorSpan">This field is required</span>
                            </label>
                            
                            <div class="addTaskLabelPriority">
                                <span>Priority</span>
                            </div>
                            
                            <div class="prioContainer">
                                <input type="radio" id="urgent" name="priority" value="Urgent" hidden />
                                <label for="urgent" class="prioLabel" id="prioUrgent">
                                    Urgent
                                    <img src="./img/Mobile/AddTask/urgentIconAddTask.png" />
                                </label>
                                <input type="radio" id="medium" name="priority" value="Medium" hidden checked />
                                <label for="medium" class="prioLabel" id="prioMedium">
                                    Medium
                                    <img src="./img/Mobile/AddTask/mediumIconAddTask.png" />
                                </label>
                                <input type="radio" id="low" name="priority" value="Low" hidden />
                                <label for="low" class="prioLabel" id="prioLow">
                                    Low
                                    <img src="./img/Mobile/AddTask/lowIconAddTask.png" />
                                </label>
                            </div>
                            <label for="addTaskCategory" class="addTaskLabel">
                                Category
                                <div class="addTaskInputIconContainer">
                                    <input id="addTaskCategory" type="text" placeholder="Select a Category" class="addTaskInput addTaskCategoryContainer focus-border"
                                        readonly onclick="toggleCategoryDropdown()" />
                                    <img class="dropdownIcon" id="categoryDropdownArrow" src="./img/Mobile/AddTask/arrowDropDownaa.png" />
                                </div>
                                <div class="customDropdownCategory customDropdownBox" id="dropdownCategory">
                                    <div class="dropdownItemCategory" onclick="selectCategory(this)">
                                        Technical Task
                                    </div>
                                    <div class="dropdownItemCategory" onclick="selectCategory(this)">
                                        User Story
                                    </div>
                                </div>
                            </label>
                            <label class="addTaskLabel addSubtaskLabel">
                                Subtasks
                                <div class="addTaskInputIconContainer">
                                    <input id="addTaskSubtask" type="text" placeholder="Add new subtasks" class="addTaskInput focus-border"
                                        readonly onclick="focusSubtaskInput()" />
                                    <div class="addTaskSubtaskIconContainer" id="addTaskSubtaskIconContainer">
                                        <img src="./img/Mobile/AddTask/closeIcon.png" id="closeSubtaskIcon" style="display: none"
                                        class="subtaskIcon" onclick="emptySubtaskInput()" />
                                        <span class="subtaskSeperator" id="subtaskEditInputSeparator" style="display: none"></span>
                                        <img src="./img/Mobile/Board/addSubtask.png" onclick="focusSubtaskInput()" id="addEditSubtaskIcon"
                                        class="subtaskIcon" />
                                        <img src="./img/Mobile/AddTask/checkIcon.png" id="checkSubtaskIcon" style="display: none"
                                        class="subtaskIcon" onclick="addSubtaskItem()" />
                                    </div>
                                </div>
                            </label>
                            <ul class="subtaskList" id="subtaskContainer"></ul>
                        </div>
                    </div>
                    <div class="addTaskBtnContainer">
                            <p><span class="required">*</span>This field is required</p>
                            <div class="addTaskDesktopBtnArea">
                            <button onclick="clearForm()" class="addTaskClearBtn">
                                Clear x
                            </button>
                            <button onclick="saveTask('${taskStatus}')" class="primaryBtn createTaskBtn">
                                Create Task
                                <img src="./img/Mobile/AddTask/checkMarkIconAddTask.png" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="backgroundOverlay" id="backgroundOverlay" onclick="closeAddTaskOnBoard()"></div>
    `;
};


function successfullyTaskDesktopHtml() {
    return /* html */ `
      <div class="backgroundSuccessfullyMessage" id="background">
      <div id="conctactSuccessfully" class="successfullyMessage slideInRightDesktop">
      Task added to board
      <img src="./img/Mobile/AddTask/addTaskBoardIcons.png">
      </div>
      </div>
      `;
};