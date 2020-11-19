// javascript del index
var savedGamesButton = $("#navbar-saved-games");
var popularContainers = $(".card-item");
var recommendButton = $("#button__recommend");
var searchButton = $("#button__search")
var slider = $("#range");
var outputText = $("#slider-text");

//cambia el texto del slider con cada cambio del slider

slider.on('input',function() {
    outputText.text(this.value);
});

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
                var image = popularContainers.find(".card-img")[i];
                var title = popularContainers.find(".card-title")[i];
                image.src = gameResults[i].background_image;
                title.innerHTML = gameResults[i].name;
            }
        });

}



fillPopularGames()