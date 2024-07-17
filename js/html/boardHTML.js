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
        categoryText = `<div class="taskCardCategory" ${categoryColor}>${task.category}</div>`;
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
                    <div class="subtaskProgressbarFill" style="width: ${progressPercentage}%;"></div>
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
    <div class="taskCardOverviewBody">
      <div class="taskCardOverviewMain">
        <div class="taskCardOverviewCategoryCloseContainer">
          ${taskCardCategoryHTML(task)}
          <img src="./img/Mobile/Board/closeTask.png" onclick="closeTaskCardOverview()">
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
     <button class="taskCardOverviewBtn" id="taskCardOverviewDeleteBtn" onclick="deleteTask('${task.id}')"><img src="./img/Mobile/Board/delete.png" >Delete</button>
      
      <span class="taskCardOverviewSeperator"></span>
      <button class="taskCardOverviewBtn" id="taskCardOverviewEditBtn" onclick="openEditTask('${task.id}')"><img src="./img/Mobile/Board/editTask.png" >Edit</button>
            
     </div>

    </div>
  </div>
</div>`;
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
                <div class="taskCardOverviewProfileIcon" style="background-color:${task.assigned[i].profileColor};">${task.assigned[i].initials}</div>
                <p class="taskCardOverviewAssignedName">${task.assigned[i].name}</p>
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
            <div class="taskCardOverviewSubtask" onclick="saveEditSubtask('${i}', '${task.id}')">
                <input type="checkbox" name="subtaskItem${i}" id="subtaskItem${i}">
                <label for="subtaskItem${i}">${subtaskItem}</label>
            </div>`;
        subtaskItemsHtml += subtaskItemHtml;
    }
    return subtaskItemsHtml;
}


function taskCardEditHTML(task) {
    let assignedContactsString = task.assigned ? task.assigned.map(contact => contact.name).join(', ') : '';
    return /* html */`
    <div class="background" id="taskCardEditBackground">
    <div class="taskCardEditBody" >
    <div class="taskCardEditMain">
        <div class="closeBtnContainer"><img src="./img/Mobile/Board/closeTask.png" onclick="closeEditTask()"></div>
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
                <input type="text" id="assigned${task.id}" name="assigned${task.id}" placeholder="Select contacts to assign" readonly onclick="toogleEditAssignedDropdown()"
                value="An: ${assignedContactsString}">
                <img id="assignedIcon" src="./img/Mobile/AddTask/arrowDropDownaa.png" onclick="toogleEditAssignedDropdown()">
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
                <div id="subtaskEditInputIconContainer" >
                
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
    </div>`;
};


function displayAssignedDropdown(task) {
    let assignedDropdownHtml = '';
    // Es wird angenommen, dass task.assigned ein Array von Kontakt-IDs ist, die bereits zugewiesen wurden.
    const assignedIds = task.assigned ? task.assigned.map(contact => contact.id) : [];

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


function toogleEditAssignedDropdown() {
    let dropdown = document.getElementById('editAssignedDropdown');
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        document.getElementById('assignedIcon').style.transform = 'rotate(180deg)';
    } else {
        document.getElementById('assignedIcon').style.transform = 'rotate(0deg)';
    }
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
                <input type="text" class="subtaskItemInput" value="${task.subtasks[i]}" readonly id="subtaskEditInput">            
                    <div class="subtaskItemIconContainer">
                        <img src="./img/Mobile/AddTask/editIcon.png" alt="Edit Icon" class="subtaskItemIcon" id="subtaskItemLeftIcon">
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


function addNewTaskOnBoardHtml() {
    return /*html*/ `
        <div class="floatingAddTask" id="addTaskChard">
            <div class="addTaskBoardDesktop">
                <div class="headerAddTaskOnBoard">
                    <h1 class="addTaskHeadline">Add Task</h1>
                    <img src="./img/Desktop/board/closeAddTask.png" class="closeButtonAddTask" onclick="closeAddTaskOnBoardX()">
                </div>
                <form onsubmit="return false;" class="addTaskForm">
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
                    <label class="addTaskLabel">
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
                    <button onclick="saveTaskOnBoard()" class="primaryBtn createTaskBtn">
                        Create Task
                        <img src="./img/Mobile/AddTask/checkMarkIconAddTask.png" />
                    </button>
                    </div>
                </div>
                
                </form>
            </div>
        </div>
    `;
}