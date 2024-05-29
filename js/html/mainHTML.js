function headerMobileHtml(){
   return `
   <img src="/img/Mobile/generalElements/joinLogoMobile.png" alt="Join Logo">
   <div class="profileIcon" onclick="displayLogout()">
       <span>SM</span> 
    </div>
    ${logoutMobileHtml()}`; 
}


function menuMobileHtml(){
   return `
   <a class="menuMobile" href="/summary.html">
       <img src="/img/Mobile/generalElements/summaryIconGray.png" alt="Summary Icon" id="summaryMobileIcon">
       <p>Summary</p>
   </a>
   <a class="menuMobile" href="/addTask.html">
       <img src="/img/Mobile/generalElements/addTaskIconGray.png" alt="Add Task Icon" id="addTaskMobileIcon">
       <p>Add Task</p>
   </a>
   <a class="menuMobile" href="/board.html">
       <img src="/img/Mobile/generalElements/boardIconGray.png" alt="Board Icon" id="boardMobileIcon">
       <p>Board</p>
   </a>
   <a class="menuMobile" href="/contacts.html">
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
      <a href="login.html">Log out</a>
    </div>
`;
}

