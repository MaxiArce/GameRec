//devuelve el modal con los juegos guardados 
export default () => {
    //crea el contenedor de los juegos guardados y lo esconde
    const containerSavedGames = $("<div>", { "class": "container__saved-games" });
    containerSavedGames.hide();

    //remueve listener de otras pantallas
    $('#navbar-saved-games').off()

    //agrega un listener que muestra/oculta el modal 
    $('#navbar-saved-games').on('click', function() {
        if (containerSavedGames.is(":hidden")) {
            $('html, body').animate({scrollTop: '0px'}, 300)
            $(this).addClass('active');
            containerSavedGames.empty()
            loadSavedGames();
            containerSavedGames.fadeIn(500)
        } else {
            $(this).removeClass('active');
            containerSavedGames.hide(500)
        }
    });

    return containerSavedGames;
}

//carga los juegos del localstorage al div contendor
function loadSavedGames() {

    var savedGames = JSON.parse(localStorage.getItem("SavedGames"));

    if (savedGames != null) {
        savedGames.forEach(element => {
            var savedGameDiv = $("<div>", { "class": "card__saved-game" })
            savedGameDiv.load("../views/saved-games.html", null, function() {
                savedGameDiv.find('.card__saved-game-image').attr('src', element.image);
                savedGameDiv.find('.card__saved-game-title').text(element.name)
                $('.container__saved-games').append(savedGameDiv);
            });
        });
    } else {
        $('.container__saved-games').append('<p style="text-align: center;">No hay juegos guardados.</p>')
    }
}

//recibe el juego a guardar - verifica si el arrray esta vacio o no y lo guarda en localStorage
export function saveGameOnStorage(game) {

    var savedGames = [];

    if (localStorage.getItem("SavedGames") == null) {
        savedGames.push(game)
        localStorage.setItem("SavedGames", JSON.stringify(savedGames))
    } else {
        savedGames = JSON.parse(localStorage.getItem("SavedGames"))

        //verifica que el juego no exista ya en favoritos
        if (!(savedGames.some(element => element.name == game.name))) {
            savedGames.push(game)
            localStorage.setItem("SavedGames", JSON.stringify(savedGames))
        }

    }
}