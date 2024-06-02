function onloadInit() {
    displayMobileHeader();
    displayMobileMenu();
    loadGuestLogin();
}


function displayMobileHeader() {
    document.getElementById("header").innerHTML = headerMobileHtml();
}


function displayMobileMenu() {
    document.getElementById("menu").innerHTML = menuMobileHtml();
}


function displayMobileLogout() {
    let logout = document.getElementById("logout");
    if (logout.style.display === "flex") {
        logout.style.display = "none";
    } else {
        logout.style.display = "flex";
    }
}

function back() {
    window.history.back();
}

function loadGuestLogin(){
    if(localStorage.getItem('guestLoggedIn') === 'true'){
        document.getElementById('profileInitial').innerHTML = 'G';

    }
}

//Summary Content

 /**
   * This function switches the navbar on or out if the user clicks on the circle in the top corner.
   */
 function openNavbar() {
    document.getElementById('navbar').classList.toggle('d-none');
  }
  
  /**
   * This function hides the navbar if the user clicks on the main container.
   */
  function closeNavbar() {
    document.getElementById('navbar').classList.add('d-none');
  }

  /**functions goes to Board */
function goToBoardUsual(mark) {
    window.location.href = `./board.html#${mark}`;
  }

  /**
 * function goes to the board and at the same time searches for the task
 * which id is stored
 */
function goToBoard() {
    window.location.href =
      "./board.html?findtaskbyid=" + encodeURIComponent(holdTaskId);
  }