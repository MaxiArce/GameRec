export default  () =>{  
    const divElement =  $("<div>", {"class": "container__populares-section"});
    divElement.load("../views/home.html")
    fillPopularGames()
    fillLanzamientosGames()
    return divElement;
}

//api request con los 5 juegos mas populares del 2020
function fillPopularGames() {
    const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2020-01-01,2020-12-31&ordering=-added"
    $.ajax({
        type:"GET",
        url: apiUrl,
        dataType: "json",
        success: function(response){
            var popularCards = $(".card-item--populares");
            var gameResults = response.results;
            //recorre el array y por cada juego recibido cambia el source de las img/nombre dentro del div
            for (let i = 0; i < gameResults.length; i++) {
                var image = popularCards.find(".card-img")[i];
                var title = popularCards.find(".card-title")[i];
                image.src = gameResults[i].background_image;
                title.innerHTML = gameResults[i].name;
            }
        }
    });

}

//api request con lanzamientos de diciembre
function fillLanzamientosGames() {
    const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2020-12-01,2020-12-31";

    $.ajax({
        type:"GET",
        url: apiUrl,
        dataType: "json",
        success: function(response){
            var lanzamientosCards = $(".card-item--lanzamientos");
            var gameResults = response.results;
            //recorre el array y por cada juego recibido cambia el source de las img/nombre dentro del div
            for (let i = 0; i < gameResults.length; i++) {
                var image = lanzamientosCards.find(".card-img")[i];
                var title = lanzamientosCards.find(".card-title")[i];
                image.src = gameResults[i].background_image;
                title.innerHTML = gameResults[i].name;
            }
        }
    });

}