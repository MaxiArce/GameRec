import Game from "../objects/game.js"
//busca en la api el juego por parametro y lo retorna 
export async function requestGameFromApi(pagesize ,endPoint, qParameters, input , platforms, dates) {
    
    const apiKey = "key=967c8446ad4b47f5a4d7d6e687abe23f"

    const apiData = {
        url: "https://api.rawg.io/api/",
        endPoint: endPoint,
        queryParameters: qParameters,
        searchInput: input.replace(/\s/g, "%20"),
        pagesize: pagesize,
        platforms: platforms,
        dates: dates
    }

    //si qParameters es search se busca 1 juego y se lo devuelve como un objeto game
    if (qParameters == "search"){
        var game = null;
        //crea la url de la api
        const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters
        }=${apiData.searchInput}&pagesize=${pagesize}&${apiKey}`;


        let gameData = await $.ajax({
            type:"GET",
            url: apiUrl,
            dataType: "json",
            success: function(response){
                return response;
            }
        });
        
        //valida que no este vacio.
        if(gameData.results.length > 0){
            var id = gameData.results[0].id;
            var name = gameData.results[0].name;
            var image = gameData.results[0].background_image;
            var tags = (gameData.results[0].tags);
            var platform = (gameData.results[0].platforms);
            var date = gameData.results[0].released;
            game = new Game(id, name, image, tags , platform, date); 
        }

        return game;
    }
    //si qParameters es tags se buscan todos los juegos con los parametros recibidos   y se lo devuelve como un array
    else if(qParameters == "tags"){
        var gamesArray = [];
        
        //crea la url de la api
        const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters
        }=${apiData.searchInput}&pagesize=${pagesize}&platforms=${platforms}&dates=${dates}&${apiKey}`;

        console.log(apiUrl)
        let arrayData = await $.ajax({
            type:"GET",
            url: apiUrl,
            dataType: "json",
            success: function(response){
                return response;
            }
        });
        
        var gameResults = arrayData.results ;

        //agrega cada elemento devuelto como un array de objetos "game"
        gameResults.forEach( element => {
            gamesArray.push(new Game(element.id,element.name,element.background_image,element.tags,element.platforms,element.released));
        });
        
        return gamesArray;

    }   

}
