import Game from "../objects/game.js";

//search in the api for the game by parameter and return it
export async function requestGameFromApi(
  pagesize,
  endPoint,
  qParameters,
  input,
  platforms,
  dates
) {
  const apiKey = "key=967c8446ad4b47f5a4d7d6e687abe23f";

  const apiData = {
    url: "https://api.rawg.io/api/",
    endPoint: endPoint,
    queryParameters: qParameters,
    searchInput: input.replace(/\s/g, "%20"),
    pagesize: pagesize,
    platforms: platforms,
    dates: dates,
  };

  //if qParameters is "search" 1 game is searched for and returned as a game object
  if (qParameters == "search") {
    var game = null;

    const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters}=${apiData.searchInput}&pagesize=${pagesize}&${apiKey}`;

    let gameData = await $.ajax({
      type: "GET",
      url: apiUrl,
      dataType: "json",
      success: function (response) {
        return response;
      },
    });

    if (gameData.results.length > 0) {
      var id = gameData.results[0].id;
      var name = gameData.results[0].name;
      var image = gameData.results[0].background_image;
      var tags = gameData.results[0].tags;
      var platform = gameData.results[0].platforms;
      var date = gameData.results[0].released;
      game = new Game(id, name, image, tags, platform, date);
    }

    return game;
  }
  //if qParameters is "tags" all the sets with the received parameters are searched and returned as an array.
  else if (qParameters == "tags") {
    var gamesArray = [];

    //crea la url de la api
    const apiUrl = `${apiData.url}${apiData.endPoint}?${apiData.queryParameters}=${apiData.searchInput}&pagesize=${pagesize}&platforms=${platforms}&dates=${dates}&${apiKey}`;

    console.log(apiUrl);
    let arrayData = await $.ajax({
      type: "GET",
      url: apiUrl,
      dataType: "json",
      success: function (response) {
        return response;
      },
    });

    var gameResults = arrayData.results;

    //adds each returned item as an array of "game" objects
    gameResults.forEach((element) => {
      gamesArray.push(
        new Game(
          element.id,
          element.name,
          element.background_image,
          element.tags,
          element.platforms,
          element.released
        )
      );
    });

    return gamesArray;
  }
}
