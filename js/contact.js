function openAddContact() {
    document.getElementById('contactMain').innerHTML += addContactHtml();
}

function closeAddContact() {
    document.getElementById('contactWindowBackground').remove();
}

let contact = [];

function addContact(){
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    if(name && email && phone){        
        contact.push({name, email, phone});
        document.getElementById('contactWindowBackground').remove();
    }
}