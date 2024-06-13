addTaskToArray = [];

function dateTreshhold() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("addTaskDueDate").setAttribute('min', today);
};

function saveTask() {
    titlequery();
    datequery();
}

function titlequery() {
    let title = document.getElementById("addTaskTitle");

    if (title.value === "") {
        title.classList.add('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'block';
        return;
    } else {
        title.classList.remove('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'none';
    }
}

function datequery() {
    let date = document.getElementById("addTaskDueDate");

    if (date.value === "") {
        date.classList.add('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'block';
        return;
    } else {
        title.classList.remove('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'none';
    }
}