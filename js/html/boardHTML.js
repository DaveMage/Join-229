function displayNoTasksToDo() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks To do</p>
        </div>`
};


function displayNoTasksDone() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Done</p>
        </div>`
};


function displayNoTasksFeedback() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks Await feedback</p>
        </div>`
};


function displayNoTasksProgress() {
    return /*html*/ `
        <div class="noTasks">
            <p class="noTasksText">No tasks In progress</p>
        </div>`
};


function taskCardHTML(task) {
    return /* html */ `
    <div class="taskCard" ${task.status} id=${task.id} draggable="true" ondragstart="startDragging(event, '${task.id}')" onclick="displayOverviewTaskCard('${task.id}')">
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
};


function taskCardCategoryHTML(task) {
    let categoryColor = '';
    let categoryText = '';
    if (task.category) {
        if (task.category === 'Technical Task') {
            categoryColor = 'style="background-color: #1FD7C1"';
        } else {
            categoryColor = 'style="background-color: #0038FF"';
        }
        categoryText = `<div id="editCardCategory" class="taskCardCategory" ${categoryColor}>${task.category}</div>`;
    }
    return categoryText;
};

function overviewTaskCardCategoryHTML(task) {
    let categoryColor = '';
    let categoryText = '';
    if (task.category) {
        if (task.category === 'Technical Task') {
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
};


function subtaskProgressbarHTML(task) {
    let subtaskContentHtml = '';

    if (task.subtasks && task.subtasks.length > 0) {
        let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
        const progressPercentage = (completedSubtasks / task.subtasks.length) * 100;

        subtaskContentHtml = `
            <div class="taskCardSubtaskContainer">
                <div class="subtaskProgressbar">
                    <div class="subtaskProgressbarFill" id="progressbar${task.id}" style="width: ${progressPercentage}%;"></div>
                </div>
                <div class='subtaskText'>${completedSubtasks}/${task.subtasks.length} Subtasks</div>
            </div>`;
    }
    return subtaskContentHtml;
};


//Task Card Overwiew 
function overviewTaskCardHTML(task) {                     
    return /* html */`
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
                    <p class="taskCardOverview priorityLabel fsize20">${task.priority.value}</p>
                    <img class="imgWidth24" src="${task.priority.imgSrc}">
                </div>

            <div class="taskCardOverviewAssignedContainer">
            <p class="taskCardOverviewLabel fsize20">Assigned To:</p>
            <div class="taskCardOverviewAssigneds">
                ${overviewTaskCardAssignedHtml(task)}     
            </div>
            </div>

            <div class="taskCardOverviewSubtaskContainer">
            <div class="taskCardOverviewLabel fsize20">Subtasks</div>
            <div class="taskCardOverviewSubtasks">
                ${overviewTaskCardSubtaskHtml(task)}     
            </div>
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
    // Überprüfen, ob task.assigned leer ist
    if (!task.assigned || task.assigned.length === 0) {
        return '';
    }

    let assignedProfilesHtml = '';

    for (let i = 0; i < task.assigned.length; i++) {
        if (task.assigned[i]) {
            assignedProfilesHtml += /*html*/ `          
                <div class="taskCardOverviewContact">
                <div class="taskCardOverviewProfileIcon profileIcon42" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>
                <p class="taskCardOverviewAssignedName fzise19">${task.assigned[i].name}</p>
              </div>`;
        }
    }
    return assignedProfilesHtml;
};


function overviewTaskCardSubtaskHtml(task) {
    let subtaskItemsHtml = '';
    if (!task.subtasks || task.subtasks.length === 0) {
        return '';
    }

    for (let i = 0; i < task.subtasks.length; i++) {
        let subtaskItem = task.subtasks[i];
        let subtaskItemHtml = `
            <div class="taskCardOverviewSubtask" onclick="toggleSubtask(${i}, '${task.id}')">
                <input type="checkbox" name="subtaskItem${i}" id="subtaskItem${i}" ${subtaskItem.completed ? 'checked' : ''}>
                <label class="subtaskItemInTask" for="subtaskItem${i}" onclick="toggleSubtask(${i}, '${task.id}')">${subtaskItem.name}</label>
            </div>`;
        subtaskItemsHtml += subtaskItemHtml;
    }
    return subtaskItemsHtml;
};


function taskCardEditHTML(task) {
    let assignedContactsString = task.assigned ? task.assigned.map(contact => contact.name).join(', ') : '';
    return /* html */`
    <div class="background" id="taskCardEditBackground">
        <div class="taskCardEditBody" id="taskCardEditBackgroundFloat">
            <div class="taskCardEditMain">
                <div class="closeBtnContainer"><img src="./img/Mobile/Board/closeTask.png" onclick="closeEditTask()"></div>
                <form class="editTaskForm" id="addTaskForm">

                <div class="labelInputContainer">
                    <label for="title${task.id}">Title</label>
                    <input type="text" id="title${task.id}" name="title${task.id}" value="${task.title}" class="inputText focus-border">
                </div>

                <div class="labelInputContainer">
                    <label for="description${task.id}">Description</label>
                    <textarea  id="description${task.id}" name="description${task.id}" class="inputTextarea focus-border">${task.description}</textarea>
                </div>
            
                <div class="labelInputContainer">
                    <label for="date${task.id}">Due date</label>
                    <input type="date" id="date${task.id}" name="date${task.id}" value="${task.date}" class="inputDate inputText focus-border">
                </div>

                <div class="labelInputContainer">
                    Priority
                    <div class = "prioRadioContainer">
                        <div class="prioRadio">
                            <input class="inputUrgent" type="radio" id="urgent${task.id}" name="priority${task.id}" value="Urgent" ${task.priority.value === 'Urgent' ? 'checked' : ''} hidden >
                            <label id="labelUrgent" class="prioLabelImg" for="urgent${task.id}">Urgent <img src="./img/Mobile/AddTask/urgentIconAddTask.png" /> </label>
                        </div>

                        <div class="prioRadio">
                            <input class="inputMedium" type="radio" id="medium${task.id}" name="priority${task.id}" value="Medium" ${task.priority.value === 'Medium' ? 'checked' : ''} hidden >
                            <label id="labelMedium" class="prioLabelImg" for="medium${task.id}">Medium <img src="./img/Mobile/AddTask/mediumIconAddTask.png" /></label>
                        </div>

                        <div class="prioRadio">
                            <input class="inputLow" type="radio" id="low${task.id}" name="priority${task.id}" value="Low" ${task.priority.value === 'Low' ? 'checked' : ''} hidden >
                            <label id="labelLow" class="prioLabelImg" for="low${task.id}">Low <img src="./img/Mobile/AddTask/lowIconAddTask.png" /> </label>
                        </div>
                    </div>
                </div>

                <div class="labelInputContainer">
                
                    Assigned to

                    <div class="inputImgContainer">
                        <input type="text" id="assigned${task.id}" name="assigned${task.id}" placeholder="Select contacts to assign" readonly onclick="toggleEditAssignedDropdown('${task.id}')"
                        value="An: ${assignedContactsString}">
                        <img id="assignedIcon" src="./img/Mobile/AddTask/arrowDropDownaa.png" onclick="toggleEditAssignedDropdown('${task.id}')">
                    </div>

                    <div id="editAssignedDropdown" class="customDropdownBox">
                        ${displayAssignedDropdown(task)}
                    </div>

                    <div id="profileIconAssingedContainer">
                    ${displayAssignedProfileIcons(task)}
                    </div>
                </div>

                <div class="labelInputContainer">
                Subtasks
                    <div class="inputImgContainer">
                        <input type="text" id="subtask${task.id}" name="subtask${task.id}" placeholder="Add new subtask" class="subtaskInput" readonly
                        onclick="focusEditSubtaskInput('${task.id}')"
                        >
                        <div id="subtaskEditInputIconContainer">
                        
                        <img
                        src="./img/Mobile/AddTask/closeIcon.png"
                        id="closeSubtaskIcon"
                        style="display: none"
                        class="subtaskIcon"
                        onclick="emptySubtaskInput('${task.id}')"
                        />

                        <span class="subtaskSeperator" id="subtaskEditInputSeperator" style="display: none;"></span>

                        <img src="./img/Mobile/Board/addSubtask.png" onclick="focusEditSubtaskInput('${task.id}')"
                        id="addEditSubtaskIcon">

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
                    <button class="taskCardEditBtn primaryBtn" id="taskCardEditSaveBtn" onclick="saveEditTask('${task.id}')">Ok <img src="./img/Mobile/Board/check.png"></button>
                    
                </div>
            </div>
        </div>
    </div>
    <div class="backgroundOverlay" id="backgroundOverlayEdit" onclick="closeEditTask()"></div>
    `;
};


function displayAssignedDropdown(task) {
    let assignedDropdownHtml = '';
    // Es wird angenommen, dass task.assigned ein Array von Kontakt-IDs ist, die bereits zugewiesen wurden.
    const assignedIds = task.assigned ? task.assigned.map(contact => contact.id) : [];

    console.log(task)
    for (let i = 0; i < contacts.length; i++) {
        // Überprüfen, ob der aktuelle Kontakt bereits zugewiesen wurde
        const isChecked = assignedIds.includes(contacts[i].id) ? 'checked' : '';

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
    let task = tasks.find(task => task.id === taskId);
    let dropdown = document.getElementById('editAssignedDropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        document.getElementById('assignedIcon').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assignedIcon').style.transform = 'rotate(0deg)';
    }

    displayAssignedDropdown(task);
};


function changeBgColorAssignedItem(contactId) {
    let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
    let contactName = document.getElementById(`contactName${contactId}`);
    let assignedItem = assignedCheckbox.closest('.assignedItem');
    assignedItem.style.backgroundColor = assignedCheckbox.checked ? '#2A3647' : '#fff';
    contactName.style.color = assignedCheckbox.checked ? '#fff' : '#000';
    assignedCheckbox.style.backgroundImage = assignedCheckbox.checked ? 'url(./img/Mobile/Board/checkButtonMobileChecked.png)' : '';
};


function displaySubtasksHTML(task) {
    let subtaskHtml = '';
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
            </li>`;
        }
    }
    return subtaskHtml;
};


function displayAssignedProfileIcons(task) {
    let profileIconHtml = '';
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
                    <!-- linker teil für desktop version-->
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
                        <!-- dropdown Box Assigned -->
                        Assigned To
                        <div class="addTaskInputIconContainer">
                        <input id="addTaskFormAssignedInput" type="text" placeholder="Select contacts to assign"
                            class="addTaskInput focus-border" onclick="toggleAssignedDropdown()" readonly />
                        <img class="dropdownIcon" id="assignedDropdownArrow" src="./img/Mobile/AddTask/arrowDropDownaa.png" />
                        </div>
                        <div class="customDropdownAssigned customDropdownBox" id="dropdownAssigned">
                        <!-- Assigend Item with Checkbox -->
                        </div>
                    </label>
                    </div>
                    <span class="addTaskDesktopSeperator"></span>
                    <div class="addTaskDesktopColumns">
                    <!-- rechter teil für desktop version-->
                    <label for="addTaskDueDate" class="addTaskLabel">
                        <!--Due Date -->
                        <p>Due Date<span class="required">*</span></p>
                        <input type="date" class="addTaskInput focus-border" id="addTaskDueDate" placeholder="Select a Date"
                        onblur="datequery()" />
                        <span id="errorSpanDate" class="errorSpan">This field is required</span>
                    </label>
                    <label for="addTaskPriority" class="addTaskLabelPriority">
                        Priority
                    </label>
                    <!-- Priority -->
                    <div class="prioContainer">
                        <!-- Prio input Radio als btn -->
                        <input type="radio" id="urgent" name="priority" value="Urgent" hidden />
                        <!-- Prio input Radio Urgent -->
                        <label for="urgent" class="prioLabel" id="prioUrgent">
                        Urgent
                        <img src="./img/Mobile/AddTask/urgentIconAddTask.png" />
                        </label>
                        <input type="radio" id="medium" name="priority" value="Medium" hidden checked />
                        <!-- Prio input Radio Medium -->
                        <label for="medium" class="prioLabel" id="prioMedium">
                        Medium
                        <img src="./img/Mobile/AddTask/mediumIconAddTask.png" />
                        </label>
                        <input type="radio" id="low" name="priority" value="Low" hidden />
                        <!-- Prio input Radio Low -->
                        <label for="low" class="prioLabel" id="prioLow">
                        Low
                        <img src="./img/Mobile/AddTask/lowIconAddTask.png" />
                        </label>
                    </div>
                    <label for="addTaskCategory" class="addTaskLabel">
                        <!-- Category -->
                        Category
                        <div class="addTaskInputIconContainer">
                        <input id="addTaskCategory" type="text" placeholder="Select a Category" class="addTaskInput focus-border"
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
                        <!-- Subtasks -->
                        Subtasks
                        <div class="addTaskInputIconContainer">
                        <input id="addTaskSubtask" type="text" placeholder="Add new subtasks" class="addTaskInput focus-border"
                            readonly onclick="focusSubtaskInput()" />
                        <div class="addTaskSubtaskIconContainer" id="addTaskSubtaskIconContainer">
                            <img src="./img/Mobile/AddTask/closeIcon.png" id="closeSubtaskIcon" style="display: none"
                            class="subtaskIcon" onclick="emptySubtaskInput()" />
                            <span class="subtaskSeperator" id="subtaskEditInputSeperator" style="display: none"></span>
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
                    <!-- Buttons-->
                    <p><span class="required">*</span>This field is required</p>
                    <div class="addTaskDesktopBtnArea">
                    <button onclick="addTaskClearTask()" class="addTaskClearBtn">
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
    return /* html */`
      <div class="backgroundSuccessfullyMessage" id="background">
      <div id="conctactSuccessfully" class="successfullyMessage slideInRightDesktop">
      Task added to board
      <img src="./img/Mobile/AddTask/addTaskBoardIcons.png">
      </div>
      </div>`;
};

// /**
//  * Displays a message indicating that there are no tasks to do.
//  * @returns {string} HTML string for the "No tasks To do" message.
//  */
// function displayNoTasksToDo() {
//     return /*html*/ `
//         <div class="noTasks">
//             <p class="noTasksText">No tasks To do</p>
//         </div>`
// };


// /**
//  * Displays a message indicating that there are no tasks done.
//  * @returns {string} HTML string for the "No tasks Done" message.
//  */
// function displayNoTasksDone() {
//     return /*html*/ `
//         <div class="noTasks">
//             <p class="noTasksText">No tasks Done</p>
//         </div>`
// };


// /**
//  * Displays a message indicating that there are no tasks awaiting feedback.
//  * @returns {string} HTML string for the "No tasks Await feedback" message.
//  */
// function displayNoTasksFeedback() {
//     return /*html*/ `
//         <div class="noTasks">
//             <p class="noTasksText">No tasks Await feedback</p>
//         </div>`
// };


// /**
//  * Displays a message indicating that there are no tasks in progress.
//  * @returns {string} HTML string for the "No tasks In progress" message.
//  */
// function displayNoTasksProgress() {
//     return /*html*/ `
//         <div class="noTasks">
//             <p class="noTasksText">No tasks In progress</p>
//         </div>`
// };


// /**
//  * Generates the HTML for a task card.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the task card.
//  */
// function taskCardHTML(task) {
//     return /* html */ `
//     <div class="taskCard" ${task.status} id=${task.id} draggable="true" ondragstart="startDragging(event, '${task.id}')" onclick="displayOverviewTaskCard('${task.id}')">
//     <div class="taskCardMain">
//     ${taskCardCategoryHTML(task)}
//       <div class="taskCardTitleDescriptionContainer">
//         <div class="taskCardTitle">${task.title}</div>
//         <div class="taskCardDescription">${task.description}</div>
//       </div>      
//       ${subtaskProgressbarHTML(task)}
//       <div class="taskCardAssingedPrio">
//       <div class="taskCardAssigned">
//       ${assingedProfileIconHtml(task)} 
//       </div>
//       <div class="taskCardPriority"><img src="${task.priority.imgSrc}"></div>  
//     </div> 
//     </div>
//   </div>`;
// };


// /**
//  * Generates the HTML for the category section of a task card.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the task card category.
//  */
// function taskCardCategoryHTML(task) {
//     let categoryColor = '';
//     let categoryText = '';
//     if (task.category) {
//         if (task.category === 'Technical Task') {
//             categoryColor = 'style="background-color: #1FD7C1"';
//         } else {
//             categoryColor = 'style="background-color: #0038FF"';
//         }
//         categoryText = `<div id="editCardCategory" class="taskCardCategory" ${categoryColor}>${task.category}</div>`;
//     }
//     return categoryText;
// };


// /**
//  * Generates the HTML for the category section of an overview task card.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the overview task card category.
//  */
// function overviewTaskCardCategoryHTML(task) {
//     let categoryColor = '';
//     let categoryText = '';
//     if (task.category) {
//         if (task.category === 'Technical Task') {
//             categoryColor = 'style="background-color: #1FD7C1"';
//         } else {
//             categoryColor = 'style="background-color: #0038FF"';
//         }
//         categoryText = `<div id="editCardCategory" class="taskCardCategory fsize23 px4y24" ${categoryColor}>${task.category}</div>`;
//     }
//     return categoryText;
// };


// /**
//  * Generates the HTML for the profile icons of assigned users in a task card.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the assigned profile icons.
//  */
// function assingedProfileIconHtml(task) {
//     if (!task.assigned || task.assigned.length === 0) {
//         return '';
//     }
//     let assignedProfilesHtml = '';
//     for (let i = 0; i < task.assigned.length; i++) {
//         if (task.assigned[i]) {
//             assignedProfilesHtml += /*html*/ `          
//                 <div class="taskCardProfileIcon" style="background-color:${task.assigned[i].profileColor};">
//                 ${task.assigned[i].initials}</div>`;
//         }
//     }
//     return assignedProfilesHtml;
// };


// /**
//  * Generates the HTML for the subtask progress bar in a task card.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the subtask progress bar.
//  */
// function subtaskProgressbarHTML(task) {
//     let subtaskContentHtml = '';
//     if (task.subtasks && task.subtasks.length > 0) {
//         let completedSubtasks = task.subtasks.filter(subtask => subtask.completed).length;
//         const progressPercentage = (completedSubtasks / task.subtasks.length) * 100;

//         subtaskContentHtml = `
//             <div class="taskCardSubtaskContainer">
//                 <div class="subtaskProgressbar">
//                     <div class="subtaskProgressbarFill" id="progressbar${task.id}" style="width: ${progressPercentage}%;"></div>
//                 </div>
//                 <div class='subtaskText'>${completedSubtasks}/${task.subtasks.length} Subtasks</div>
//             </div>`;
//     }
//     return subtaskContentHtml;
// };


// /**
//  * Generates the HTML for the task card overview.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the task card overview.
//  */
// function overviewTaskCardHTML(task) {                     
//     return /* html */`
//     <div class="background" id="taskCardOverviewBackground">
//         <div class="taskCardOverviewBody" id="taskCardOverviewBodyId">
//             <div class="taskCardOverviewMain">
//                 <div class="taskCardOverviewCategoryCloseContainer">
//                 ${overviewTaskCardCategoryHTML(task)}
//                 <img src="./img/Mobile/Board/closeTask.png" onclick="closeTaskCardOverview()">
//                 </div>  
//                 <h2 id="editCardTitle" class="taskCardOverviewTitle">${task.title}</h2>
//                 <p id="editCardDescription" class="taskCardOverviewDescription fsize20">${task.description}</p>
//                 <div class="taskCardOverviewLabelContainer">
//                 <p class="taskCardOverviewLabel fsize20">Due date:</p>
//                 <p id="editCardDate" class="taskCardOverview fsize20">${task.date}</p>
//                 </div>
//                 <div class="taskCardOverviewLabelContainer">
//                     <p class="taskCardOverviewLabel fsize20">Priority:</p>
//                     <p class="taskCardOverview priorityLabel fsize20">${task.priority.value}</p>
//                     <img class="imgWidth24" src="${task.priority.imgSrc}">
//                 </div>
//             <div class="taskCardOverviewAssignedContainer">
//             <p class="taskCardOverviewLabel fsize20">Assigned To:</p>
//             <div class="taskCardOverviewAssigneds">
//                 ${overviewTaskCardAssignedHtml(task)}     
//             </div>
//             </div>
//             <div class="taskCardOverviewSubtaskContainer">
//             <div class="taskCardOverviewLabel fsize20">Subtasks</div>
//             <div class="taskCardOverviewSubtasks">
//                 ${overviewTaskCardSubtaskHtml(task)}     
//             </div>
//             </div>
//             <div class="taskCardOverviewBtnContainer">
//             <button class="taskCardOverviewBtn" id="taskCardOverviewDeleteBtn" onclick="deleteTask('${task.id}')"><img src="./img/Mobile/Board/delete.png">Delete</button>
//             <span class="taskCardOverviewSeperator"></span>
//             <button class="taskCardOverviewBtn" id="taskCardOverviewEditBtn" onclick="openEditTask('${task.id}')"><img src="./img/Mobile/Board/editTask.png">Edit</button>
//             </div>
//             </div>
//             </div>
//         </div>
//     <div class="backgroundOverlay" id="backgroundOverlay" onclick="closeTaskCardOverview()"></div>
//     `;
// };


// /**
//  * Generates the HTML for the profile icons of assigned users in a task card overview.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the assigned profile icons in the task card overview.
//  */
// function overviewTaskCardAssignedHtml(task) {
//     if (!task.assigned || task.assigned.length === 0) {
//         return '';
//     }
//     let assignedProfilesHtml = '';
//     for (let i = 0; i < task.assigned.length; i++) {
//         if (task.assigned[i]) {
//             assignedProfilesHtml += /*html*/ `          
//                 <div class="taskCardOverviewContact">
//                 <div class="taskCardOverviewProfileIcon profileIcon42" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>
//                 <div class="taskCardOverviewProfileName fsize20">${task.assigned[i].name}</div>
//                 </div>`;
//         }
//     }
//     return assignedProfilesHtml;
// };


// /**
//  * Generates the HTML for the subtasks in a task card overview.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the subtasks in the task card overview.
//  */
// function overviewTaskCardSubtaskHtml(task) {
//     if (!task.subtasks || task.subtasks.length === 0) {
//         return '';
//     }
//     let subtasksHtml = '';
//     for (let i = 0; i < task.subtasks.length; i++) {
//         const checked = task.subtasks[i].completed ? 'checked' : '';
//         subtasksHtml += /*html*/ `
//             <div class="taskCardOverviewSubtask fsize20">
//                 <input type="checkbox" ${checked} disabled>
//                 <span>${task.subtasks[i].name}</span>
//             </div>`;
//     }
//     return subtasksHtml;
// };


// /**
//  * Generates the HTML for the task card edit form.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the task card edit form.
//  */
// function taskCardEditHTML(task) {
//     let assignedContactsString = task.assigned ? task.assigned.map(contact => contact.name).join(', ') : '';
//     return /* html */ `
//     <div class="background" id="taskCardEditBackground">
//         <div class="taskCardEditBody" id="taskCardEditBackgroundFloat">
//             <div class="taskCardEditMain">
//                 <div class="closeBtnContainer"><img src="./img/Mobile/Board/closeTask.png" onclick="closeEditTask()"></div>
//                 <form class="editTaskForm" id="addTaskForm">
//                 <div class="labelInputContainer">
//                     <label for="title${task.id}">Title</label>
//                     <input type="text" id="title${task.id}" name="title${task.id}" value="${task.title}" class="inputText focus-border">
//                 </div>
//                 <div class="labelInputContainer">
//                     <label for="description${task.id}">Description</label>
//                     <textarea id="description${task.id}" name="description${task.id}" class="inputTextarea focus-border">${task.description}</textarea>
//                 </div>
//                 <div class="labelInputContainer">
//                     <label for="date${task.id}">Due date</label>
//                     <input type="date" id="date${task.id}" name="date${task.id}" value="${task.date}" class="inputDate inputText focus-border">
//                 </div>
//                 <div class="labelInputContainer">
//                     Priority
//                     <div class="prioRadioContainer">
//                         <div class="prioRadio">
//                             <input class="inputUrgent" type="radio" id="urgent${task.id}" name="priority${task.id}" value="Urgent" ${task.priority.value === 'Urgent' ? 'checked' : ''} hidden>
//                             <label id="labelUrgent" class="prioLabelImg" for="urgent${task.id}">Urgent <img src="./img/Mobile/AddTask/urgentIconAddTask.png" /></label>
//                         </div>
//                         <div class="prioRadio">
//                             <input class="inputMedium" type="radio" id="medium${task.id}" name="priority${task.id}" value="Medium" ${task.priority.value === 'Medium' ? 'checked' : ''} hidden>
//                             <label id="labelMedium" class="prioLabelImg" for="medium${task.id}">Medium <img src="./img/Mobile/AddTask/mediumIconAddTask.png" /></label>
//                         </div>
//                         <div class="prioRadio">
//                             <input class="inputLow" type="radio" id="low${task.id}" name="priority${task.id}" value="Low" ${task.priority.value === 'Low' ? 'checked' : ''} hidden>
//                             <label id="labelLow" class="prioLabelImg" for="low${task.id}">Low <img src="./img/Mobile/AddTask/lowIconAddTask.png" /></label>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="labelInputContainer">
//                     Assigned to
//                     <div class="inputImgContainer">
//                         <input type="text" id="assigned${task.id}" name="assigned${task.id}" placeholder="Select contacts to assign" readonly onclick="toggleEditAssignedDropdown('${task.id}')"
//                         value="An: ${assignedContactsString}">
//                         <img id="assignedIcon" src="./img/Mobile/AddTask/arrowDropDownaa.png" onclick="toggleEditAssignedDropdown('${task.id}')">
//                     </div>
//                     <div id="editAssignedDropdown" class="customDropdownBox">
//                         ${displayAssignedDropdown(task)}
//                     </div>
//                     <div id="profileIconAssingedContainer">
//                         ${displayAssignedProfileIcons(task)}
//                     </div>
//                 </div>
//                 <div class="labelInputContainer">
//                     Subtasks
//                     <div class="inputImgContainer">
//                         <input type="text" id="subtask${task.id}" name="subtask${task.id}" placeholder="Add new subtask" class="subtaskInput" readonly
//                         onclick="focusEditSubtaskInput('${task.id}')">
//                         <div id="subtaskEditInputIconContainer">
//                             <img src="./img/Mobile/AddTask/closeIcon.png" id="closeSubtaskIcon" style="display: none" class="subtaskIcon" onclick="emptySubtaskInput('${task.id}')"/>
//                             <span class="subtaskSeperator" id="subtaskEditInputSeperator" style="display: none;"></span>
//                             <img src="./img/Mobile/Board/addSubtask.png" onclick="focusEditSubtaskInput('${task.id}')" id="addEditSubtaskIcon">
//                             <img src="/img/Mobile/AddTask/checkIcon.png" id="checkSubtaskIcon" style="display: none" class="subtaskIcon" onclick="addEditSubtask('${task.id}')"/>
//                         </div>
//                     </div>
//                     <ul id="subtaskContainer${task.id}">
//                         ${displaySubtasksHTML(task)}
//                     </ul>
//                 </div>
//                 </form>
//                 <div class="taskCardEditBtnContainer">
//                     <button class="taskCardEditBtn primaryBtn" id="taskCardEditSaveBtn" onclick="saveEditTask('${task.id}')">Ok <img src="./img/Mobile/Board/check.png"></button>
//                 </div>
//             </div>
//         </div>
//     </div>
//     <div class="backgroundOverlay" id="backgroundOverlayEdit" onclick="closeEditTask()"></div>`;
// }


// /**
//  * Generates the HTML for the assigned dropdown.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the assigned dropdown.
//  */
// function displayAssignedDropdown(task) {
//     let assignedDropdownHtml = '';
//     const assignedIds = task.assigned ? task.assigned.map(contact => contact.id) : [];

//     for (let i = 0; i < contacts.length; i++) {
//         const isChecked = assignedIds.includes(contacts[i].id) ? 'checked' : '';

//         assignedDropdownHtml += /*html*/ `
//         <div class="assignedItem" id="wrapper${contacts[i].id}">
//             <label class="assignedIconNameContainer" for="assignedCheckbox${contacts[i].id}" class="customDropdownItem">
//                 <div class="profileIcon" style="background-color:${contacts[i].profileColor};">${contacts[i].initials}</div>
//                 <p data-value="${contacts[i].name}" class="contactName" id="contactName${contacts[i].id}">${contacts[i].name}</p>
//             </label>
//             <input class="assignedCheckbox" type="checkbox" id="assignedCheckbox${contacts[i].id}" name="contact${contacts[i].id}" data-value="${contacts[i].id}"
//             ${isChecked} onchange="changeBgColorAssignedItem('${contacts[i].id}'); updateSelectedAssignedAndInputField('${task.id}')">
//         </div>`;
//     }
//     return assignedDropdownHtml;
// }


// /**
//  * Toggles the visibility of the assigned dropdown.
//  * @param {string} taskId - The ID of the task.
//  */
// function toggleEditAssignedDropdown(taskId) {
//     let dropdown = document.getElementById('editAssignedDropdown');
//     dropdown.classList.toggle('show');
//     if (dropdown.classList.contains('show')) {
//         document.getElementById('assignedIcon').style.transform = 'rotate(180deg)';
//     } else {
//         document.getElementById('assignedIcon').style.transform = 'rotate(0deg)';
//     }
// }


// /**
//  * Changes the background color of the assigned item based on its checked status.
//  * @param {string} contactId - The ID of the contact.
//  */
// function changeBgColorAssignedItem(contactId) {
//     let assignedCheckbox = document.getElementById(`assignedCheckbox${contactId}`);
//     let contactName = document.getElementById(`contactName${contactId}`);
//     let assignedItem = assignedCheckbox.closest('.assignedItem');
//     assignedItem.style.backgroundColor = assignedCheckbox.checked ? '#2A3647' : '#fff';
//     contactName.style.color = assignedCheckbox.checked ? '#fff' : '#000';
//     assignedCheckbox.style.backgroundImage = assignedCheckbox.checked ? 'url(./img/Mobile/Board/checkButtonMobileChecked.png)' : '';
// }


// /**
//  * Generates the HTML for the subtasks.
//  * @param {Object} task - The task object containing task details.
//  * @returns {string} HTML string for the subtasks.
//  */
// function displaySubtasksHTML(task) {
//     let subtaskHtml = '';
//     if (task.subtasks && task.subtasks.length > 0) {
//         for (let i = 0; i < task.subtasks.length; i++) {
//             subtaskHtml += /*html*/ `
//             <li class="subtaskItem">
//                 <input type="text" class="subtaskItemInput" value="${task.subtasks[i].name}" readonly id="subtaskEditInput">            
//                 <div class="subtaskItemIconContainer">
//                     <img src="./img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon">
//                     <span class="subtaskSeperator"></span>
//                     <img src="./img/Mobile/AddTask/trashIcon.png" alt="Trash Icon" class="subtaskItemIcon" id="subtaskItemRightIcon" onclick="deleteSubtask('${task.id}', ${i})">
//                 </div>
//             </li>`;
//         }
//     }
//     return subtaskHtml;
// }
