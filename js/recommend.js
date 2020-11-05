// javascript de la funcion principal - Para buscar o el usar el recomendador de juegos 
window.onload = function() {
    var buttonSearch = document.getElementById("button__search--recommend").addEventListener("click", searchGame);
    var gamesDataArray = [];
    
    // constructor objeto juego
    function Game(id, name, image, tags) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.tags = tags;
    }

    //recibe la informacion de los inputs y consulta la api
    function searchGame() {
        gamesDataArray = [];
        var inputGame1 = document.getElementById("input-search--game1").value;
        var inputGame2 = document.getElementById("input-search--game2").value;
        //valida los inputs
        if (inputGame1 != "" && inputGame2 != "") {
            getGameFromApi(inputGame1, 0)
            getGameFromApi(inputGame2, 1)

        } else {
            alert("Ingrese un juego en cada campo")
        }
    }

    //busca en la api el juego por nombre y lo guarda en el array
    function getGameFromApi(name, cardPosition) {

        const apiData = {
            url: " https://api.rawg.io/api/",
            endPoint: "games",
            queryParameters: "search",
            searchInput: name.replace(/\s/g, "%20")
        }
        const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters
        }=${apiData.searchInput}`;
        console.log(apiUrl);

        fetch(apiUrl)
            .then((data) => data.json())
            .then((dataObj) => {
                var id = dataObj.results[0].id;
                var name = dataObj.results[0].name;
                var image = dataObj.results[0].background_image;
                var tags = (dataObj.results[0].tags);
                // console.log(dataObj.results[0].tags[0].id)
                var game = new Game(id,name,image,tags)
                gamesDataArray.push(game);
                fillCard(cardPosition)
            });
    }
    //Rellena los dos resultados de busqueda con la informacion del array de juegos //todo async?
    function fillCard(cardPosition) {
        var card = document.getElementById("card-list-results");
        var cardName = document.getElementById(`card-title-results-${cardPosition}`);
        var cardImage = document.getElementById(`card-img-results-${cardPosition}`);
        cardName.innerHTML = gamesDataArray[cardPosition].name;
        cardImage.src = gamesDataArray[cardPosition].image;
        card.style.visibility = "visible";
    }

    // function findMatchingTags(){
    //     console.log(gamesDataArray)
    // }
    // findMatchingTags()
} 