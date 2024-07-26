function addContactHtml() {
  return /* html */`
    <div class="background backgroundMobile" id="contactAddFormBackground">
        <div class="addContactContainer slideInBottom" id="addContactContainer">
            <div class="addContainerTopContainer">
                <img class="closeBtn" src="/img/Mobile/Contacts/closeWhite.png" onclick="closeAddContact()">
                <h1 class="contactHeadline">Add Contact</h1>
                <span class="contactText">Tasks are bette with a team</span>
                <span class="headlineUnderline"></span>
            </div>            
            <div class="addContactContainerBottom">
                <form onsubmit="return false; saveContact()">
                    <div class="contactProfileIcon">
                        <img src="/img/Mobile/Contacts/personProfileIcon.png">
                    </div>
                    <label for="contactName" class="contactLabel" id="contactLabelName">
                        <input type="text" id="contactName" placeholder="Name" >
                        <img src="/img/Mobile/Contacts/personIconContacts.png">
                    </label>
                    <span id="nameErrorSpan" class="errorMessage"></span>
                    <label for="contactEmail" class="contactLabel" id="contactLabelEmail">
                        <input type="email" id="contactEmail" placeholder="Email">
                        <img src="/img/Mobile/Contacts/mailIconContacts.png">
                    </label>
                    <span id="emailErrorSpan" class="errorMessage"></span>
                    <label for="contactPhone" class="contactLabel" id=contactLabelPhone>
                      <input type="tel" id="contactPhone" placeholder="Phone">
                      <img src="/img/Mobile/Contacts/callIconContacts.png">
                    </label>
                    <span id="phoneErrorSpan" class="errorMessage"></span>
                    <button type="submit" onclick="saveContact()" class="primaryBtn createContactBtn" id="createContactBtn">Create contact <img src="/img/Mobile/Contacts/checkWhite.png"></button>

                </form>
            </div>
        </div>
    </div>
  `;
};


function contactListItemHtml(contact) {
  return /* html */`    
    <div id="contactItem${contact.id}"  class="contactProfileContainer" onclick="openContactView('${contact.id}')">
      <div class="profileIcon" id="profileIconItemInitial${contact.id}" style="background-color: ${contact.profileColor};">${contact.initials}</div>
      <div class="contactNameEmailContainer">
        <p class="contactName" id="contactItemName${contact.id}">${contact.name}</p>
        <p class="contactEmail" id="contactItemEmail${contact.id}">${contact.email}</p>
      </div>
    </div>`;
};


function contactViewHtml(contact) {
  return /* html */`
    <section class="contactView" onclick="closeOption()" id="contactViewContainer${contact.id}">
    <img class="arrowBack" src="/img/Mobile/Contacts/arrowLeftBlue.png" onclick="goToContacts()"/>
    <div class="ContactViewHeader">
      <span class="contactViewHeadline">Contacts</span>
      <span class="contactViewTxt">Better with a team</span>
      <span class="headlineUnderline"></span>
    </div>
    <div class="contactViewBody">
      <div class="contactViewProfileIconName">
        <div class="contactViewProfileIcon" id="contactViewProfileIcon${contact.id}"
        style="background-color:${contact.profileColor};">${contact.initials}</div>
        <div class="contactViewName" id="contactViewName${contact.id}">${contact.name}</div>
      </div>
      <span class="contactViewSubheadline">Contact Information</span>
      <div class="contactViewInfo">
        <div class="contactViewSubContainer">
          <span class="contactViewLabel">Email</span>
          <a href="mailto:${contact.email}" target="_blank" class="contactViewLink" id="contactViewEmail${contact.id}">${contact.email}</a>
        </div>
        <div class="contactViewSubContainer">
          <span class="contactViewLabel">Phone</span>
          <a href="tel:${contact.phone}" class="contactViewLink" id="contactViewPhone${contact.id}">${contact.phone}</a>
        </div>
      </div>
    </div>
    </section>
    <button  class="primaryBtn addContactBtn" onclick="openOption('${contact.id}')">
        <img id="contactBtnImg" src="/img/Mobile/Contacts/contactViewOption.png" />
    </button>
    ${optionHtml(contact)}`;
};


function optionHtml(contact) {
  return `<div class="optionContainer" id="optionContainer">
    <button onclick="openEditContact('${contact.id}')"><img src="/img/Mobile/Contacts/editGrey.png" class="editBtn">Edit</button>
    <button onclick="deleteContact('${contact.id}')"><img src="/img/Mobile/Contacts/trashGrey.png" class="deleteBtn" >Delete</button>
  </div>`;
};


function successfullyHtml() {
  return /* html */`
    <div class="backgroundSuccessfullyMessage">
    <div id="conctactSuccessfully" class="successfullyMessage slideInBottom">
    Contact successfully created
    </div>
    </div>`;
};


function successfullyDesktopHtml() {
  return /* html */`
    <div class="backgroundSuccessfullyMessage">
    <div id="conctactSuccessfully" class="successfullyMessage slideInRightDesktop">
    Contact successfully created
    </div>
    </div>`;
};


function contactEditForm(contact) {
  return /* html */`
    <div class="background " id="contactEditFormBackground">
    <div  class="addContactContainer slideInBottom" id="editContactContainer">
        <div class="addContainerTopContainer">
            <img class="closeBtn" src="/img/Mobile/Contacts/closeWhite.png" onclick="closeEditContact()">
            <h1 class="contactHeadline">Add Contact</h1>                
            <span class="headlineUnderline"></span>
        </div>            
        <div class="addContactContainerBottom">
            <form onsubmit="return false">
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
</div>`;
};


function contactViewDesktop(contact) {
  return /* html */ `  
          <div class="cvdIconName">
            <div id="profileIconDesktop${contact.id}" class="profileIconDesktop" style="background-color: ${contact.profileColor};">${contact.initials}</div>
            <div class="cvdNameBtnContainer">
              <h2 class="cvdName" id="cvdName${contact.id}">${contact.name}</h2>
              <div class="cvdBtns">
                <button
                  class="contactBtnTransparent"
                  id="contactBtnTransparentEdit"                  
                  onclick="openEditContact('${contact.id}')"
                >
                  <img src="/img/Mobile/Contacts/editGrey.png" /> Edit
                </button>
                <button
                  class="contactBtnTransparent"
                  id="contactBtnTransparentTrash"
                  onclick="deleteContact('${contact.id}')"
                >
                  <img src="/img/Mobile/Contacts/trashGrey.png" />Delete
                </button>
              </div>
            </div>
          </div>
          <p class="contactSubheadline">Contact Information</p>
          <div class="cvdEmailPhone">
            <div class="cvdEmail">
              <p class="cvdInfoText">Email</p>
              <a href="mailto:${contact.email}.de" id="cvdEmail${contact.id}">${contact.email}</a>
            </div>
            <div class="cvdPhone">
              <p class="cvdInfoText">Phone</p>
              <a href="tel:${contact.phone}" id="cvdPhone${contact.id}">${contact.phone}</a>
            </div>
          </div>
        `;
};


function editContactDesktop(contact) {
  return /* html */`
    <div class="background" id="background">
      <div class="contactEditDesktopBody">
        <div class="contactEditDesktopLeft">
          <img class="logo55px" src="./img/Desktop/contact/logo55px.png" />
          <div class="contactEditDesktopText">
            <h1>Edit contact</h1>              
            <span class="horizontal"></span>
          </div>
        </div>
        <div class="contactEditDesktopRight">
          <img onclick="closeAddContactDesktop()" class="closeBtn" src="img/Mobile/Board/closeTask.png">
          <div class="contactEditDesktopIconForm">
            <div class="profileIconDesktop" id="profileIconEditDesktop" style="background-color: ${contact.profileColor};">${contact.initials}</div>
            <form class="contactEditDesktopForm" onsubmit="return false;">          
            
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
    </div>
    <div class="backgroundOverlay" id="backgroundOverlay" onclick="closeAddContactDesktop()"></div>
  `;
};


function addContactDesktop() {
  return /* html */`
    <div class="background" id="background">
      <div class="contactEditDesktopBody" id="floatBackground">
        <div class="contactEditDesktopLeft">
          <img  class="logo55px" src="./img/Desktop/contact/logo55px.png" />
          <div class="contactEditDesktopText">
            <h1>Add Contact</h1>
            <p>Tasks are better withe a team!</p>
            <span class="horizontal"></span>
          </div>
        </div>
        <div class="contactEditDesktopRight">
          <img onclick="closeAddContactDesktop()" class="closeBtn" src="img/Mobile/Board/closeTask.png">
          <div class="contactEditDesktopIconForm">
            <img class="userIcon120px" src="/img/Desktop/contact/userLogo120px.png">
            <form class="contactEditDesktopForm" onsubmit="return false;">               
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
                <div class="contactEditDesktopFormBtns">
                  <button class="secondaryBtn" onclick="closeAddContactDesktop()">Cancel <img src="/img/Mobile/AddTask/closeIcon.png"></button>
                  <button onclick="saveContact()" type="submit" class="primaryBtn createContactBtn">Create contact <img src="/img/Mobile/Contacts/checkWhite.png" ></button>
                </div>              
            </form>
          </div>            
        </div>
      </div>
    </div>
    <div class="backgroundOverlay" id="backgroundOverlay" onclick="closeAddContactDesktop()"></div>
  `;
};