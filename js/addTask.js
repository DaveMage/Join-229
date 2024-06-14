addTaskToArray = [];

function dateTreshhold() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById("addTaskDueDate").setAttribute('min', today);
};

async function saveTask() {
    let title = document.getElementById('addTaskTitle').value;
    let date = document.getElementById('addTaskDueDate').value;
    let userId = await getUserIdByEmail(); // Wait for the user ID
    let description = document.getElementById('addTaskDescription').value;
    let prio = getSelectedPriority();
    if( title === '' || date === ''){
        titlequery();
        datequery();
        console.log("error")
        return;
    } 

   try {
        await postData('/users/' + userId + '/tasks', { 
            'title': title,
            'date': date,
            'description': description,
            'Priority': prio        
        });
   } catch (error) {
       console.error('Error saving task:', error);
   }    



}

// Funktion, um die ausgewählte Priorität zu ermitteln
function getSelectedPriority() {
    // Holt alle Radio-Buttons mit dem Namen 'priority'
    const priorities = document.getElementsByName('priority');
    let selectedPriority = null; // Variable zur Speicherung des ausgewählten Radio-Buttons

    // Schleife durch alle Prioritäten (Radio-Buttons)
    for (const priority of priorities) {
        // Überprüfen, ob der aktuelle Radio-Button ausgewählt ist
        if (priority.checked) {
            selectedPriority = priority; // Speichere den ausgewählten Radio-Button
            break; // Schleife abbrechen, da wir die Auswahl gefunden haben
        }
    }

    // Überprüfen, ob eine Priorität ausgewählt wurde
    if (selectedPriority) {
        const priorityValue = selectedPriority.value; // Wert des ausgewählten Radio-Buttons
        const priorityLabel = document.querySelector(`label[for=${selectedPriority.id}]`); // Holt das zugehörige Label-Element
        const priorityImgSrc = priorityLabel.querySelector('img').src; // Holt den Bildpfad des Bildes innerhalb des Labels

        // Rückgabe eines Objekts mit dem Wert und dem Bildpfad
        return {
            value: priorityValue,
            imgSrc: priorityImgSrc
        };
    }
}

function titlequery() {
    let title = document.getElementById("addTaskTitle");

    if (title.value === "") {
        title.classList.add('errorLabel');
        document.getElementById('errorSpanTitle').style.display = 'block';
        return false;
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
        return false;
    } else {
        date.classList.remove('errorLabel');
        document.getElementById('errorSpanDate').style.display = 'none';
    }
}

