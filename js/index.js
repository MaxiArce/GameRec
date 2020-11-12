// javascript del index
var savedGamesButton = document.getElementById("navbar-saved-games");
var popularContainers = document.querySelectorAll(".card-item");
var recommendButton = document.getElementById("button__recommend")
var searchButton = document.getElementById("button__search")
var tabButtons = document.querySelectorAll(".button_select-tab");
var tabContent = document.querySelectorAll(".tab-content");
var slider = document.getElementById("range");
var output = document.getElementById("slider-text");

//cambia el texto del slider con cada cambio del slider
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}

//Agrega listeners a los bottones
recommendButton.addEventListener("click", function() { showTabContent(0) });
searchButton.addEventListener("click", function() { showTabContent(1) });
savedGamesButton.addEventListener("click", showSavedGames);

//Lee el local storage y muestra los juegos guardados
function showSavedGames(){
    var savedGamesModal = document.getElementById("savedGamesModal");

    if (localStorage.getItem("SavedGames") == null){
        alert("No hay juegos guardados")
    }else{
        var savedGames = JSON.parse(localStorage.getItem("SavedGames"))
        savedGames.forEach(element =>{
            var gameName = document.createElement('p');
            gameName.innerHTML = element;
            savedGamesModal.appendChild(gameName);
        })
    }

    if (savedGamesModal.style.visibility === "hidden") {
        savedGamesModal.style.visibility = "visible";
      } else {
        savedGamesModal.style.visibility = "hidden";
        savedGamesModal.innerHTML = ""
      }
    
}


//funcion ocultar/mostrar tabs
function showTabContent(tab) {
    //make selected button white color
    tabButtons.forEach(element => element.style.color = "grey");
    tabButtons[tab].style.color = "white";

    //hide all tabs except the selected one
    tabContent.forEach(element => element.style.display = "none");
    tabContent[tab].style.display = "block";
}


//funcion para hacer una api request con los 5 juegos mas populares del 2020
function fillPopularGames() {

    const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2020-01-01,2020-12-31&ordering=-added"

    //request obtiene el json y lo recibe un promise como objeto
    fetch(apiUrl)
        .then((data) => data.json())
        .then((dataObject) => {
            var gameResults = dataObject.results;
            //recorre el array y por cada juego recibido cambia el source de las img/nombre dentro del div
            for (let i = 0; i < gameResults.length; i++) {
                var image = popularContainers[i].getElementsByClassName("card-img");
                var title = popularContainers[i].getElementsByClassName("card-title");
                image.item(0).src = gameResults[i].background_image;
                title.item(0).innerHTML = gameResults[i].name;
            }
        });

}

fillPopularGames()