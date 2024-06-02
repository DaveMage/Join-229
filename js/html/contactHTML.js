function addContactHtml() {
    return `
    <div class="background" id="contactWindowBackground">
            <div class="addContactContainer">
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
                            <input type="text" id="contactName" placeholder="Name">
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
                        <button class="primaryBtn createContactBtn" onclick="addContact()">Create contact <img src="/img/Mobile/Contacts/checkWhite.png"></button>
                    </form>
                </div>
            </div>
        </div>
    `;
}