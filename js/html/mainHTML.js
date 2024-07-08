function headerMobileHtml() {
    return /*html*/ `
    <img class="headerMobileLogo" src="/img/Mobile/generalElements/joinLogoMobile.png" alt="Join Logo">
    <span class="headerDesktopText">Kanban Project Management Tool</span>
    
    <div class="headerProfileMenu">
        <a href="./help.html"><img src="./img/Desktop/header/helpIconSmall.png" alt="Help Icon" class="helpIcon"></a>
        <div class="headerProfileIcon" onclick="displayMobileLogout()">
           <span id="profileInitial"></span>
        </div>
    </div>
    ${logoutMobileHtml()}`;
};


function menuMobileHtml() {
    return /* html */`
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
   </a>`;
};


function logoutMobileHtml() {
    return /* html */`
   <div class="logoutContainer slideInRight" id="logout">
      <a href="/help.html">Help</a>
      <a href="/legalNotice.html">Legal Notice</a>
      <a href="/privacyPolice.html">Privacy Policy</a>
      <a href="#" onclick="logout()">Log out</a>
    </div>`;
};


function greetingHTML(user) {
    return /* html */`
    <section class="greetingBackground">
        <div class="greetingContainer">
            <div class="greetingText" id="greetingText">Good morning,</div>
            <div class="greetingText" id="greetingName">${user.name}</div>
        </div>
    </section>`;
};


function menuDesktopHtml() {            // -- Desktop -- //
    return /*html*/ `
        <div class="logoLinks">
            <img src="./img/Desktop/sidebar/joinLogoDesktop.png" alt="Join Logo" class="joinLogoDesktop">
            <div class="quickNavLinks">
                <a class="menuDesktop" href="/summary.html" id="summaryLinkDesktop">
                    <img src="./img/Desktop/sidebar/summaryIconDesktop.png" alt="Summary Icon" id="summaryDesktopIcon" class="iconSidebar">
                    <p>Summary</p>
                </a>
                <a class="menuDesktop" href="/addTask.html" id="addTaskLinkDesktop">
                    <img src="./img/Desktop/sidebar/addTaskIconDesktop.png" alt="Add Task Icon" id="addTaskDesktopIcon" class="iconSidebar">
                    <p>Add Task</p>
                </a>
                <a class="menuDesktop" href="/board.html" id="boardLinkDesktop">
                    <img src="./img/Desktop/sidebar/boardIconDesktop.png" alt="Board Icon" id="boardDesktopIcon" class="iconSidebar">
                    <p>Board</p>
                </a>
                <a class="menuDesktop" href="/contacts.html" id="contactsLinkDesktop">
                    <img src="./img/Desktop/sidebar/contactsIconDesktop.png" alt="Contacs Icon" id="contactsDesktopIcon" class="iconSidebar">
                    <p>Contacts</p>
                </a>
            </div>
        </div>

        <div class="contentLinksPolicyLegalNotice">
            <a href="./privacyPolice.html" id="privacyLink" class="linksPrivacyLegal">Privacy Policy</a>
            <a href="./legalNotice.html" id="legalLink" class="linksPrivacyLegal">Legal notice</a>
        </div>`;
};