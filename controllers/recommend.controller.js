import { requestGameFromApi } from "../api/api.js";
import { saveGameOnStorage } from "../controllers/savedgames.controller.js";

var game1;
var game2;
var tagsMatch = [];
var platformSelected;
var releaseDate;

export default () => {
  //create the container and load the html on the tab
  const divElement = $("<div>", { class: "container__recommend-section" });
  divElement.load("../views/recommend.html", null, function () {
    getSelectedDate();
    getSelectedPlatform();

    //after loading the html add the listeners to the two inputs which call the searchGame function "onChange".
    const firstSearchInput = $("#search__input--1");
    const secondSearchInput = $("#search__input--2");

    //delay to avoid multiple callbacks each time the user presses a key
    firstSearchInput.on("change keyup paste click", function () {
      delay(async () => {
        game1 = await searchGame(this.id);
      }, 800);
    });
    secondSearchInput.on("change keyup paste click", function () {
      delay(async () => {
        game2 = await searchGame(this.id);
      }, 800);
    });

    // Adds a listener for all platform buttons
    $(".checkbox-platform").on("change", function () {
      if (this.checked) {
        getSelectedPlatform(this.value);
        $(".checkbox-platform").not(this).prop("checked", false);
        $(".checkbox-platform")
          .not(this)
          .parent()
          .removeClass("image-checkbox-active");
        $(this).parent().addClass("image-checkbox-active");
      } else {
        //vuelve el valor por defecto si no hay nada seleccionado
        platformSelected = "18,187,4,1,186,7";
      }
    });

    //listener saves the selected value of the dropdown
    $("#release-date").on("change", function () {
      getSelectedDate(this.value);
    });

    //listener search button, compares the two sets for tag matching and calls the api with the results
    $("#button__search--recommend").on("click", function () {
      if (game1 != undefined && game2 != undefined) {
        searchSimilarGames(game1, game2);
      } else {
        alert("Selecciona al menos dos titulos!");
      }
    });
  });

  return divElement;
};

//receives the id of the modified input and displays a loading screen while the user types
async function searchGame(divID) {
  const searchInput = $("#" + divID);
  const searchInputContainer = searchInput.parent();
  const searchResult = searchInputContainer.find(".search__input--results");

  if (searchInput.val()) {
    searchResult.empty();
    searchResult.append($("<img>").attr("src", "../images/loading-icon.svg"));
    searchResult.show();
    var game = await requestGameFromApi(
      1,
      "games",
      "search",
      searchInput.val(),
      platformSelected,
      releaseDate
    );
    if (game != undefined) {
      searchResult.empty();
      searchResult.load("../views/card-result.html", null, function () {
        searchInputContainer.find(".card-img").attr("src", game.image);
        searchInputContainer.find(".card-title").text(game.name);
      });
      return game;
    } else {
      searchResult.empty();
      alert(`El juego ${searchInput.val()} no se pudo encontrar.`);
    }
  } else if (searchInput.val() == "") {
    searchResult.empty();
    searchResult.hide();
  }
}

//looks for tags in common between the two sets, queries the api and calls the function that adds the divs with each set
async function searchSimilarGames(game1, game2) {
  var resultsContainer = $("#container_recommendation-results");
  resultsContainer.append($("<img>").attr("src", "../images/loading-icon.svg"));

  tagsMatch = [];
  var tagsGame1 = game1.tags;
  var tagsGame2 = game2.tags;

  //compare each tag of the first set with the second set
  tagsGame1.forEach((element1) => {
    tagsGame2.forEach((element2) => {
      if (element1.id == element2.id) {
        tagsMatch.push(element1);
      }
    });
  });
  //sort the array of objects using the id number (larger tag numbers are less useful)
  tagsMatch.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
  var result = tagsMatch.map((a) => a.id).toString();

  //query api for games - receive an array of games.
  var gamesResult = await requestGameFromApi(
    10,
    "games",
    "tags",
    result,
    platformSelected,
    releaseDate
  );
  addRecommendations(gamesResult);
}

//add to the dom the results received from the api
function addRecommendations(gamesResult) {
  if (gamesResult.length > 0) {
    var resultsContainer = $("#container_recommendation-results");
    resultsContainer.empty();

    gamesResult.forEach((element) => {
      //verify that the recommended set is different from the one you are looking for.
      if (element.id != game1.id && element.id != game2.id) {
        var recommendation = $("<div>", {
          class:
            "card card-recommendation bg-dark text-white col-lg-3 col-md-6 col-sm-12",
        });
        recommendation.load(
          "../views/card-recommendation.html",
          null,
          function () {
            recommendation
              .find(".card-img-recommend")
              .attr("src", element.image);
            recommendation.find(".card-title").text(element.name);
            recommendation.find(".card-year").text(element.date).hide();

            //adds a listener for the favorites/save listener

            recommendation.find(".fav-icon").on("click", function () {
              $(this).attr("src", "../images/fav-icon-filled.svg");
              saveGameOnStorage(element);
            });

            var platformsContainer = recommendation.find(".card-platforms");
            element.platforms.forEach((platformElement) => {
              switch (platformElement.platform.id) {
                case 18:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/ps4-icon.svg")
                  );
                  break;
                case 187:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/ps5-icon.svg")
                  );
                  break;
                case 4:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/windows-icon.svg")
                  );
                  break;
                case 1:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/xbox-one-icon.svg")
                  );
                  break;
                case 186:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/xbox-x-icon.svg")
                  );
                  break;
                case 7:
                  platformsContainer.append(
                    $("<img>").attr("src", "../images/nintendo-icon.svg")
                  );
                  break;
                default:
                  break;
              }
            });
          }
        );
        resultsContainer.append(recommendation).hide().fadeIn(2000);
      }
    });
  } else {
    $("#container_recommendation-results").empty();
    alert("No se encontraron recomendaciones");
  }
}

//Validates the selected platform and saves an id preset by the apiid set by the api
function getSelectedPlatform(selectedPlatform) {
  switch (selectedPlatform) {
    case "ps4":
      platformSelected = "18";
      break;
    case "ps5":
      platformSelected = "187";
      break;
    case "pc":
      platformSelected = "4";
      break;
    case "xbox-one":
      platformSelected = "1";
      break;
    case "xbox-x":
      platformSelected = "186";
      break;
    case "nintendo":
      platformSelected = "7";
      break;
    default:
      platformSelected = "18,187,4,1,186,7";
      break;
  }
}

//Obtains the date range of the dropdown and transforms it so that the api understands it
function getSelectedDate(selectedDate) {
  var today = new Date();
  var currentDate =
    today.getFullYear() +
    "-" +
    ("0" + (today.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + today.getDate()).slice(-2);

  //by default the "all" option is taken, the other options subtract the selected years from the current date.
  switch (selectedDate) {
    case "all":
      releaseDate =
        today.getFullYear() -
        30 +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2) +
        "," +
        currentDate;
      break;
    case "last-2":
      releaseDate =
        today.getFullYear() -
        2 +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2) +
        "," +
        currentDate;
      break;
    case "last-5":
      releaseDate =
        today.getFullYear() -
        5 +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        today.getDate() +
        "," +
        currentDate;
      break;
    case "last-10":
      releaseDate =
        today.getFullYear() -
        10 +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2) +
        "," +
        currentDate;
      break;
    default:
      releaseDate =
        today.getFullYear() -
        30 +
        "-" +
        ("0" + (today.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + today.getDate()).slice(-2) +
        "," +
        currentDate;
      break;
  }
}

//function to avoid multiple parallel calls of settimeout
var delay = (function () {
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
