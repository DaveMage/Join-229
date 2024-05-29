function headerMobileHtml(){
   return `<header class="header-menu">
   <img src="/img/Mobile/generalElements/joinLogoMobile.png" alt="Join Logo">
   <div class="profileIcon">
       <span>SM</span> 
        </div>
        </header>` 
}


function menuMobileHtml(){
   return `<footer>
   <div class="menuMobile">
       <img src="/img/Mobile/generalElements/summaryIconGray.png" alt="Summary Icon" id="summaryMobileIcon">
       <p>Summary</p>
   </div>
   <div class="menuMobile">
       <img src="/img/Mobile/generalElements/addTaskIconGray.png" alt="Add Task Icon" id="addTaskMobileIcon">
       <p>Add Task</p>
   </div>
   <div class="menuMobile">
       <img src="/img/Mobile/generalElements/boardIconGray.png" alt="Board Icon" id="boardMobileIcon">
       <p>Board</p>
   </div>
   <div class="menuMobile">
       <img src="/img/Mobile/generalElements/contactsIconGray.png" alt="Contacs Icon" id="contactsMobileIcon">
       <p>Contacts</p>
   </div>
</footer>`;
}

function templateMobileHtml(){
    return `
    ${headerMobileHtml()}
    ${menuMobileHtml()}
    `
}