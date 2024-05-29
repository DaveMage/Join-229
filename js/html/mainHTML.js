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
</footer>`;
}

function templateMobileHtml(){
    return `
    ${headerMobileHtml()}
    ${menuMobileHtml()}
    `
}