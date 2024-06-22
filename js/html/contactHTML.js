function addContactHtml() {
    return `
    <div class="background" id="contactAddFormBackground">
            <div class="addContactContainer slideInBottom" id="addContactContainer">
                <div class="addContainerTopContainer">
                    <img class="closeBtn" src="/img/Mobile/Contacts/closeWhite.png" onclick="closeAddContact()">
                    <h1 class="contactHeadline">Add Contact</h1>
                    <span class="contactText">Tasks are bette with a team</span>
                    <span class="headlineUnderline"></span>
                </div>            
                <div class="addContactContainerBottom">
                    <form onsubmit="return false;">
                        <div class="contactProfileIcon">
                            <img src="/img/Mobile/Contacts/personProfileIcon.png">
                        </div>
                        <label for="contactName" class="contactLabel">
                            <input type="text" id="contactName" placeholder="Name" required>
                            <img src="/img/Mobile/Contacts/personIconContacts.png">
                        </label>
                        <label for="contactEmail" class="contactLabel">
                            <input type="email" id="contactEmail" placeholder="Email">
                            <img src="/img/Mobile/Contacts/mailIconContacts.png">
                        </label>
                        <label for="contactPhone" class="contactLabel">
                            <input type="tel" id="contactPhone" placeholder="Phone">
                            <img src="/img/Mobile/Contacts/callIconContacts.png" >
                        </label>
                        <button type="submit" class="primaryBtn createContactBtn" onclick="saveContact()" >Create contact <img src="/img/Mobile/Contacts/checkWhite.png"></button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

function contactListItemHtml(contact) {
    return `    
    <div class="contactProfileContainer" onclick="openContactView('${contact.id}')">
      <div class="profileIcon" style="background-color: ${contact.profileColor};">${contact.initials}</div>
      <div class="contactNameEmailContainer">
        <p class="contactName">${contact.name}</p>
        <p class="contactEmail">${contact.email}</p>
      </div>
    </div>
    `;
}

function contactViewHtml(contact) {
    return `
    <section class="contactView" onclick="closeOption()" id="contactViewContainer${contact.id}">
    <img class="arrowBack" src="/img/Mobile/Contacts/arrowLeftBlue.png" onclick="goToContacts()"/>
    <div class="ContactViewHeader">
      <span class="contactViewHeadline">Contacts</span>
      <span class="contactViewTxt">Better with a team</span>
      <span class="headlineUnderline"></span>
    </div>
    <div class="contactViewBody">
      <div class="contactViewProfileIconName">
        <div class="contactViewProfileIcon" id="contactViewProfileIcon"
        style="background-color:${contact.profileColor};">${contact.initials}</div>
        <div class="contactViewName" id="contactViewName">${contact.name}</div>
      </div>
      <span class="contactViewSubheadline">Contact Information</span>
      <div class="contactViewInfo">
        <div class="contactViewSubContainer">
          <span class="contactViewLabel">Email</span>
          <a href="mailto:${contact.email}" target="_blank" class="contactViewLink" id="contactViewEmail">${contact.email}</a>
        </div>
        <div class="contactViewSubContainer">
          <span class="contactViewLabel">Phone</span>
          <a href="tel:${contact.phone}" class="contactViewLink" id="contactViewPhone">${contact.phone}</a>
        </div>
      </div>
    </div>
    </section>
    <button  class="primaryBtn addContactBtn" onclick="openOption('${contact.id}')">
        <img id="contactBtnImg" src="/img/Mobile/Contacts/contactViewOption.png" />
    </button>
    ${optionHtml(contact)}
    `;
}



function optionHtml(contact){
    return `<div class="optionContainer" id="optionContainer">
    <button onclick="openEditContact('${contact.id}')"><img src="/img/Mobile/Contacts/editGrey.png" class="editBtn">Edit</button>
    <button onclick="deleteContact('${contact.id}')"><img src="/img/Mobile/Contacts/trashGrey.png" class="deleteBtn" >Delete</button>
  </div>`;
}

function successfullyHtml(){
    return `
    <div class="backgroundSuccessfullyMessage">
    <div id="conctactSuccessfully" class="successfullyMessage slideInBottom">
    Contact successfully created
    </div>
    </div>
    `;}

  function contactEditForm(contact){
    return`
    <div class="background " id="contactEditFormBackground">
    <div class="addContactContainer slideInBottom" id="editContactContainer">
        <div class="addContainerTopContainer">
            <img class="closeBtn" src="/img/Mobile/Contacts/closeWhite.png" onclick="closeEditContact()">
            <h1 class="contactHeadline">Add Contact</h1>                
            <span class="headlineUnderline"></span>
        </div>            
        <div class="addContactContainerBottom">
            <form onsubmit="return false;">
                <div class="contactProfileIcon" style="background-color: ${contact.profileColor};">
                  ${contact.initials}
                </div>
                <label for="contactName${contact.id}" class="contactLabel">
                    <input type="text" id="contactName${contact.id}" placeholder="Name" required value="${contact.name}">
                    <img src="/img/Mobile/Contacts/personIconContacts.png">
                </label>
                <label for="contactEmail${contact.id}" class="contactLabel">
                    <input type="email" id="contactEmail${contact.id}" placeholder="Email" value="${contact.email}">
                    <img src="/img/Mobile/Contacts/mailIconContacts.png">
                </label>
                <label for="contactPhone${contact.id}" class="contactLabel">
                    <input type="tel" id="contactPhone${contact.id}" placeholder="Phone" value="${contact.phone}">
                    <img src="/img/Mobile/Contacts/callIconContacts.png" >
                </label>
                <div class="contactEditFormBtnContainer">
                  <button class="secondaryBtn" onclick="deleteContact('${contact.id}')">Delete</button>
                  <button onclick="saveEditContact('${contact.id}')" class="primaryBtn saveContactBtn">Save<img src="/img/Mobile/Contacts/checkWhite.png"></button>
                </div>
            </form>
        </div>
    </div>
</div>
    `;
  }