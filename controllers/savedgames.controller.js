//returns the modal with the saved games

export default () => {
  //creates the container for saved games and hides it
  const containerSavedGames = $("<div>", { class: "container__saved-games" });
  containerSavedGames.hide();
  $("#navbar-saved-games").off();

  //adds a listener that shows/hides the modal
  $("#navbar-saved-games").on("click", function () {
    if (containerSavedGames.is(":hidden")) {
      $("html, body").animate({ scrollTop: "0px" }, 300);
      $(this).addClass("active");
      containerSavedGames.empty();
      loadSavedGames();
      containerSavedGames.fadeIn(500);
    } else {
      $(this).removeClass("active");
      containerSavedGames.hide(500);
    }
  });

  return containerSavedGames;
};

//loads the localstorage games to the container
function loadSavedGames() {
  var savedGames = JSON.parse(localStorage.getItem("SavedGames"));

  if (savedGames != null) {
    savedGames.forEach((element) => {
      var savedGameDiv = $("<div>", { class: "card__saved-game" });
      savedGameDiv.load("../views/saved-games.html", null, function () {
        savedGameDiv.find(".card__saved-game-image").attr("src", element.image);
        savedGameDiv.find(".card__saved-game-title").text(element.name);
        $(".container__saved-games").append(savedGameDiv);
      });
    });
  } else {
    $(".container__saved-games").append(
      '<p style="text-align: center;">There are no saved games.</p>'
    );
  }
}

//handles the game to be saved
export function saveGameOnStorage(game) {
  var savedGames = [];

  if (localStorage.getItem("SavedGames") == null) {
    savedGames.push(game);
    localStorage.setItem("SavedGames", JSON.stringify(savedGames));
  } else {
    savedGames = JSON.parse(localStorage.getItem("SavedGames"));

    if (!savedGames.some((element) => element.name == game.name)) {
      savedGames.push(game);
      localStorage.setItem("SavedGames", JSON.stringify(savedGames));
    }
  }
}
