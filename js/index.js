// javascript del index
// variables divs populares
var popularContainers = document.querySelectorAll(".card-item");
// variables de las tabs
var tabButtons = document.querySelectorAll(".button_select-tab");
var tabContent = document.querySelectorAll(".tab-content");
//variables slider años
var slider = document.getElementById("range");
var output  = document.getElementById("slider-text");

//funcion para hacer una api request con los 5 juegos mas populares del 2020
function fillPopularGames(){
              
        const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2020-01-01,2020-12-31&ordering=-added"

        //request obtiene el json y lo recibe un promise como objeto
        fetch(apiUrl)
            .then((data)=> data.json())
            .then((dataObject)=>{      
                var gameResults = dataObject.results;
                //recorre el array y por cada juego recibido cambia el source de las img/nombre dentro del div
                for (let i = 0; i < gameResults.length; i++){
                    var image = popularContainers[i].getElementsByClassName("card-img");
                    var title = popularContainers[i].getElementsByClassName("card-title"); 
                    image.item(0).src = gameResults[i].background_image;
                    title.item(0).innerHTML = gameResults[i].name;  
                }
            });

}

//cambia el texto del slider con cada cambio del slider
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
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

fillPopularGames()