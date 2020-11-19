// javascript de la funcion principal - Para buscar o el usar el recomendador de juegos 
window.onload = function() {
    var buttonSearch = $("#button__search--recommend").click(function() { searchGame() });
    var game1;
    var game2;
    var tagsMatch = [];
    var savedGames = [];

    // constructor objeto juego
    function Game(id, name, image, tags) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.tags = tags;
    }

    //recibe la informacion de los inputs y consulta la api
    async function searchGame() {
        var inputGame1 = $("#input-search--game1").val();
        var inputGame2 = $("#input-search--game2").val();
        //limpia los resultados anteriores
        $("#container__results--match").empty()
        //valida los inputs
        if (inputGame1 != "" && inputGame2 != "") {
            game1 = await getGameFromApi("games", "search", inputGame1);
            fillCard(game1, 0);
            game2 = await getGameFromApi("games", "search", inputGame2);
            fillCard(game2, 1);
            findTagsMatch(game1, game2)
            searchGameResults()
        } else {
            alert("Ingrese un juego en cada campo")
        }
    }

    //busca en la api el juego por parametro y lo guarda
    async function getGameFromApi(endPoint, qParameters, Input) {
        const apiData = {
            url: " https://api.rawg.io/api/",
            endPoint: endPoint,
            queryParameters: qParameters,
            searchInput: Input.replace(/\s/g, "%20")
        }
        const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters
        }=${apiData.searchInput}`;

        let dataObj = await fetch(apiUrl).then(resp => resp.json());
        var id = dataObj.results[0].id;
        var name = dataObj.results[0].name;
        var image = dataObj.results[0].background_image;
        var tags = (dataObj.results[0].tags);
        var game = new Game(id, name, image, tags)
        return game;
    }

    //Rellena los dos resultados de busqueda con la informacion del array de juegos 
    function fillCard(game, cardPosition) {
        var card = $(`#card-item-${cardPosition}`);
        var cardName = $(`#card-title-results-${cardPosition}`);
        var cardImage = $(`#card-img-results-${cardPosition}`);
        cardName.text(game.name)
        cardImage.attr("src", game.image)
        card.show()
    }

    //busca coincidencias  de tags entre los dos juegos
    function findTagsMatch(game1, game2) {
        tagsMatch = [];
        var tagsGame1 = game1.tags;
        var tagsGame2 = game2.tags;
        tagsGame1.forEach(element1 => {
            tagsGame2.forEach(element2 => {
                if (element1.id == element2.id) {
                    tagsMatch.push(element1)
                }
            });
        });
        console.log(tagsMatch)
    }

    //hace un request a la api con el id del juego por cada tag
    //falta filtrar duplicados
    function searchGameResults() {
        tagsMatch.forEach(async element => {
            var gameResult = await getGameFromApi("games", "tags", `${(element.id)}`);
            addGameToResults(gameResult)
        });
    }


    function addGameToResults(gameResult) {
        var resultsContainer = $("#container__results--match");

        var cardContainer = $("<div>", {"class": "card card-item card-item-match-results card-background"});
        
        var cardImage = $("<img>", {"class": "card-img"} );
        cardImage.attr("src", gameResult.image);
        cardContainer.append(cardImage);
        
        var cardGradient = $("<div>", {"class": "card-gradient"});
        cardContainer.append(cardGradient);

        var cardOverlay = $("<div>", {"class": "card-img-overlay d-flex align-items-start flex-column"});
        cardContainer.append(cardOverlay);

        var cardTitle = $("<h2>", {"class": "card-title titulo mt-auto"});
        cardTitle.text(gameResult.name);
        cardOverlay.append(cardTitle);

        var cardSaveButton =  $("<a>", {"class": "btn-save"});
        cardSaveButton.click(function() {saveGameOnStorage(gameResult)});
        cardSaveButton.text("Guardar");
        cardOverlay.append(cardSaveButton);

        resultsContainer.append(cardContainer);
    }

    //guarda los juegos en localStorage
    function saveGameOnStorage(gameResult){
        if (localStorage.getItem("SavedGames") == null){
            savedGames.push(gameResult.name)
            localStorage.setItem("SavedGames",JSON.stringify(savedGames))
        }else{
            savedGames = JSON.parse(localStorage.getItem("SavedGames"))
            console.log(typeof(savedGames))
            savedGames.push(gameResult.name)
            localStorage.setItem("SavedGames",JSON.stringify(savedGames))
        }
    }
}