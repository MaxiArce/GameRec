import { requestGameFromApi } from "../api/api.js"
import { saveGameOnStorage }  from "../controllers/savedgames.controller.js"

var game1;
var game2;
var tagsMatch = [];
var platformSelected ;
var releaseDate ;


export default () => {
    //crea el contenedor y carga el html de esa pestaña
    const divElement = $("<div>", { "class": "container__recommend-section" });

    //carga el html
    divElement.load("../views/recommend.html", null, function() {
        
        //inicializa  releaseDate y Platform con los valores por defecto
        getSelectedDate();
        getSelectedPlatform();

        //luego de cargado el html agrega los listeners a los dos inputs los cuales llaman a la funcion searchGame "onChange"
        const firstSearchInput = $("#search__input--1");
        const secondSearchInput = $("#search__input--2");

        //delay para evitar multiples callbacks cada vez que el usuario presiona una tecla
        firstSearchInput.on('change keyup paste click', ( function() {
            delay(async() => { 
                game1 = await searchGame(this.id);
            }, 800);
        }));
        secondSearchInput.on('change keyup paste click', function() {
            delay(async () => { 
                game2 = await searchGame(this.id) 
            }, 800);
        });

        // Agrega un listener para todos los botones de platformas
        $('.checkbox-platform').on('change', function() {
            if (this.checked){
                getSelectedPlatform(this.value)
                $('.checkbox-platform').not(this).prop('checked', false);  
                $('.checkbox-platform').not(this).parent().removeClass('image-checkbox-active');
                $(this).parent().addClass('image-checkbox-active');

            }else{
                //vuelve el valor por defecto si no hay nada seleccionado
                platformSelected = "18,187,4,1,186,7";
            }

        });

        //listener guarda el valor seleccionado del dropdown
        $('#release-date').on('change', function(){
            getSelectedDate(this.value);
        });

        //listener boton de busqueda, compara los dos juegos en busca de coincidencia de tags y llama a la api con los resultados
        $('#button__search--recommend').on('click', function(){
            if (game1 != undefined && game2 != undefined){
                searchSimilarGames(game1,game2);
            }else{
                alert("Selecciona al menos dos titulos!");
            }
        });

    });

    return divElement;
}

//recibe el id del input modificado y muestra una pantalla de carga mientras el usuario escribe 
async function searchGame(divID) {
    const searchInput = $("#" + divID);
    const searchInputContainer = searchInput.parent();
    const searchResult = searchInputContainer.find(".search__input--results");

    //valida que no este vacio
    if (searchInput.val()) {
        searchResult.empty();
        searchResult.append(($("<img>")).attr('src',"../images/loading-icon.svg"));
        searchResult.show();
        var game = await requestGameFromApi(1,"games", "search", searchInput.val(),platformSelected,releaseDate);
        if (game != undefined){
            searchResult.empty();
            //carga el html con el div que contiene la card
            searchResult.load("../views/card-result.html", null, function() {
                //completa los campos correspodientes en el div/input desde le que se activo en keyup.
                searchInputContainer.find('.card-img').attr("src", game.image);
                searchInputContainer.find('.card-title').text(game.name);
            });
            return game;
        }else{
            searchResult.empty();
            alert(`El juego ${searchInput.val()} no se pudo encontrar.`)
        }

    } else if (searchInput.val() == "") {
        searchResult.empty();
        searchResult.hide();
    }

}

//busca tags en comun entre los dos juegos, consulta la api y llama a la funcion que agrega los divs con cada juego
async function searchSimilarGames(game1, game2) {
    //agrega icono de carga al div 
    var resultsContainer = $("#container_recommendation-results");
    resultsContainer.append(($("<img>")).attr('src',"../images/loading-icon.svg"));

    tagsMatch = [];
    var tagsGame1 = game1.tags;
    var tagsGame2 = game2.tags;

    //compara cada tag del primer juego con el segundo 
    tagsGame1.forEach(element1 => {
        tagsGame2.forEach(element2 => {
            if (element1.id == element2.id) {
                tagsMatch.push(element1)
            }
        });
    });
    //ordena el array de objetos usando el numero de id (los numeros mas grandes de tags son los menos utiles)
    tagsMatch.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
    var result = (tagsMatch.map(a => a.id)).toString();

    //consulta a la api por los juegos - recibe un array de juegos.
    var gamesResult = await requestGameFromApi(10,"games","tags",result, platformSelected ,releaseDate);
    addRecommendations(gamesResult)
}

//agrega al dom los resultados recibidos desde la api 
function addRecommendations(gamesResult){

    if (gamesResult.length > 0){

        var resultsContainer = $("#container_recommendation-results");
        resultsContainer.empty()
        
        //por cada juego recibido crea un nuevo div y hace un load con un archivo html
        gamesResult.forEach(element => {
            //verifica que el recomendado sea distinto a los juegos buscados
            if (element.id != game1.id && element.id != game2.id){

                var recommendation = $("<div>", { "class": "card card-recommendation bg-dark text-white col-lg-3 col-md-6 col-sm-12" });
                recommendation.load("../views/card-recommendation.html", null, function() {
    
                    //carga la informacion en la card
                    recommendation.find('.card-img-recommend').attr("src",element.image);
                    recommendation.find('.card-title').text(element.name);
                    recommendation.find('.card-year').text(element.date).hide();

                    //agrega un listener para el de favoritos/guardar
                    recommendation.find('.fav-icon').on('click', function(){
                        $(this).attr('src',"../images/fav-icon-filled.svg");
                        saveGameOnStorage(element);
                    });
                    
                    //carga img con las plataformas dependiendo de cada elemento.
                    var platformsContainer =  recommendation.find('.card-platforms');
                    element.platforms.forEach(platformElement => {
    
                        switch (platformElement.platform.id) {
                            case 18:
                                platformsContainer.append($("<img>").attr("src","../images/ps4-icon.svg"))
                                break;
                            case 187:
                                platformsContainer.append($("<img>").attr("src","../images/ps5-icon.svg"))
                                break; 
                            case 4:
                                platformsContainer.append($("<img>").attr("src","../images/windows-icon.svg"))
                                break;   
                            case 1:
                                platformsContainer.append($("<img>").attr("src","../images/xbox-one-icon.svg"))
                                break;   
                            case 186:
                                platformsContainer.append($("<img>").attr("src","../images/xbox-x-icon.svg"))
                                break;
                            case 7:
                                platformsContainer.append($("<img>").attr("src","../images/nintendo-icon.svg"))
                                break;
                            default:
                                break;
                        }
    
                    });
    
                });
                resultsContainer.append(recommendation).hide().fadeIn(2000);
            }
            
        });
        
    }else{
        $("#container_recommendation-results").empty()
        alert("No se encontraron recomendaciones")
    }

}

//Valida la plataforma seleccionada y guarda un id predeterminado por la api
function getSelectedPlatform(selectedPlatform) {

    switch (selectedPlatform) {
        case 'ps4':
            platformSelected = "18";
            break;
        case 'ps5':
            platformSelected = "187";
            break;
        case 'pc':
            platformSelected = "4";
            break;
        case 'xbox-one':
            platformSelected = "1";
            break;
        case 'xbox-x':
            platformSelected = "186";
            break;
        case 'nintendo':
            platformSelected = "7";
            break;
        default:
            platformSelected = "18,187,4,1,186,7";
            break;
    }
}

//Obtiene el rango de fechas del dropdown y lo transforma para que la api lo entienda 
function getSelectedDate(selectedDate){
    var today = new Date();
    var currentDate = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

    //por defecto de toma la opcion "all"  en las otras opciones se restan los años seleccionados a la fecha actual 
    switch (selectedDate) {
        case 'all':
            releaseDate = (today.getFullYear()-30) + "-" + (today.getMonth()+1) + "-" + today.getDate() + "," + currentDate;
            break;
        case 'last-2':
            releaseDate = (today.getFullYear()-2) + "-" + (today.getMonth()+1) + "-" + today.getDate() + "," + currentDate;
            break;
        case 'last-5':
            releaseDate = (today.getFullYear()-5) + "-" + (today.getMonth()+1) + "-" + today.getDate() + "," + currentDate;
            break;
        case 'last-10':
            releaseDate = (today.getFullYear()-10) + "-" + (today.getMonth()+1) + "-" + today.getDate() + "," + currentDate;
            break;
        default:
            releaseDate = (today.getFullYear()-30) + "-" + (today.getMonth()+1) + "-" + today.getDate() + "," + currentDate;
            break;
    }
}

//funcion para evitar varias llamadas en paralelo del settimeout 
var delay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
