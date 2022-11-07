export default  () =>{  
    const divElement =  $("<div>", {"class": "container__populares-section"});
    divElement.load("../views/home.html")
    fillPopularGames()
    fillReleasedGames()
    return divElement;
}

function fillPopularGames() {
    const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2022-01-01,2022-11-07&ordering=-added&key=967c8446ad4b47f5a4d7d6e687abe23f"
    $.ajax({
        type:"GET",
        url: apiUrl,
        dataType: "json",
        success: function(response){
            var popularCards = $(".card-item--populares");
            var gameResults = response.results;
            
            for (let i = 0; i < gameResults.length; i++) {
                var image = popularCards.find(".card-img")[i];
                var title = popularCards.find(".card-title")[i];
                image.src = gameResults[i].background_image;
                title.innerHTML = gameResults[i].name;
            }
        }
    });

}

function fillReleasedGames() {
    const apiUrl = "https://api.rawg.io/api/games?page_size=4&dates=2022-11-01,2022-11-07&key=967c8446ad4b47f5a4d7d6e687abe23f";

    $.ajax({
        type:"GET",
        url: apiUrl,
        dataType: "json",
        success: function(response){
            var lanzamientosCards = $(".card-item--lanzamientos");
            var gameResults = response.results;

            for (let i = 0; i < gameResults.length; i++) {
                var image = lanzamientosCards.find(".card-img")[i];
                var title = lanzamientosCards.find(".card-title")[i];
                image.src = gameResults[i].background_image;
                title.innerHTML = gameResults[i].name;
            }
        }
    });

}