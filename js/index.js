// javascript del index
var savedGamesButton = $("#navbar-saved-games");
var popularContainers = $(".card-item");
var recommendButton = $("#button__recommend");
var searchButton = $("#button__search")
var slider = $("#range");
var output = $("#slider-text");

//Agrega listeners a los bottones
$(savedGamesButton).click(function() { showSavedGames() })

//Lee el local storage y muestra los juegos guardados
function showSavedGames() {

    var savedGamesModal = $('#savedGamesModal')

    if (savedGamesModal.is(":hidden")) {

        savedGamesModal.show();

        if (localStorage.getItem("SavedGames") == null) {
            alert("No hay juegos guardados")
        } else {
            var savedGames = JSON.parse(localStorage.getItem("SavedGames"))
            savedGames.forEach(element => {
                console.log(element)
                savedGamesModal.append("<p>" + element + "</p>");
            })
        }

    } else {
        savedGamesModal.hide();
        savedGamesModal.empty()
    }
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

//cambia el texto del slider con cada cambio del slider
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}

fillPopularGames()