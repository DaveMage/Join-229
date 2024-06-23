function headerMobileHtml(){
   return `
   <img src="/img/Mobile/generalElements/joinLogoMobile.png" alt="Join Logo">
   <div class="headerProfileIcon" onclick="displayMobileLogout()">
       <span id="profileInitial"></span> 
    </div>
    ${logoutMobileHtml()}`; 
}


function menuMobileHtml(){
   return `
   <a class="menuMobile" href="/summary.html" id="summaryLink">
       <img src="/img/Mobile/generalElements/summaryIconGray.png" alt="Summary Icon" id="summaryMobileIcon}">
       <p>Summary</p>
   </a>   
   <a class="menuMobile" href="/board.html" id="boardLink">
       <img src="/img/Mobile/generalElements/boardIconGray.png" alt="Board Icon" id="boardMobileIcon">
       <p>Board</p>
   </a>
   <a class="menuMobile" href="/addTask.html" id="addTaskLink">
       <img src="/img/Mobile/generalElements/addTaskIconGray.png" alt="Add Task Icon" id="addTaskMobileIcon">
       <p>Add Task</p>
   </a>
   <a class="menuMobile" href="/contacts.html" id="contactsLink">
       <img src="/img/Mobile/generalElements/contactsIconGray.png" alt="Contacs Icon" id="contactsMobileIcon">
       <p>Contacts</p>
   </a>
`;
}

function logoutMobileHtml(){
   return `
   <div class="logoutContainer" id="logout">
      <a href="/help.html">Help</a>
      <a href="/legalNotice.html">Legal Notice</a>
      <a href="/privacyPolice.html">Privacy Policy</a>
      <a href="#" onclick="logout()">Log out</a>
    </div>
`;
}

function greetingHTML(user){
    return `
    <section class="greetingBackground">
    <div class="greetingContainer">
      <div class="greetingText" id="greetingText">Good morning,</div>
      <div class="greetingText" id="greetingName">${user.name}</div>
    </div>
  </section>
    `;
}