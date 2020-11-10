// javascript de la funcion principal - Para buscar o el usar el recomendador de juegos 
window.onload = function() {
    var buttonSearch = document.getElementById("button__search--recommend").addEventListener("click", searchGame);
    var game1;
    var game2;
    var tagsMatch = [];

    // constructor objeto juego
    function Game(id, name, image, tags) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.tags = tags;
    }

    //recibe la informacion de los inputs y consulta la api
    async function searchGame() {
        var inputGame1 = document.getElementById("input-search--game1").value;
        var inputGame2 = document.getElementById("input-search--game2").value;
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

    //Rellena los dos resultados de busqueda con la informacion del array de juegos //todo async?
    function fillCard(game, cardPosition) {
        var card = document.getElementById("card-list-results");
        var cardName = document.getElementById(`card-title-results-${cardPosition}`);
        var cardImage = document.getElementById(`card-img-results-${cardPosition}`);
        cardName.innerHTML = game.name;
        cardImage.src = game.image;
        card.style.visibility = "visible";
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
    function searchGameResults() {
        tagsMatch.forEach(async element => {
            var gameResult = await getGameFromApi("games", "tags", `${(element.id)}`);
            addGameToResults(gameResult)
        });
    }

    function addGameToResults(gameResult) {
        var resultsContainer = document.getElementById("container__results--recommend");
        var cardContainer = document.createElement('p');
        cardContainer.innerHTML = gameResult.name;
        resultsContainer.appendChild(cardContainer);
    }
}