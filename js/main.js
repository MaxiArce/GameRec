// javascript de la funcion principal - Para buscar o el usar el recomendador de juegos 
var gamesDataArray = [];
var tagsMatch = [];
var gamesToRecommend = [];
var game1;
var game2;
var tags = [];

// constructor objeto juego
function Game(id, name, genre, tags, year, platform) {
    this.id = id;
    this.name = name;
    this.genre = genre;
    this.tags = tags;
    this.year = year;
    this.year = platform;
}

//Llena manualmente el Array de juegos - Mas adelante usaria la api 
gamesDataArray.push(new Game(18, "Left 4 Dead", "Action", ["Co-op", "Zombies"], 2011, "PC"))
gamesDataArray.push(new Game(19, "The Forest", "Action", ["Horror"], 2015, "PC"))
gamesDataArray.push(new Game(20, "Dying Light", "Action", ["Horror","Zombies"], 2015, "PC"))
// console.log(gamesDataArray)

//compara los tags de dos juegos y consulta por otro juego con lo tags en común
function SearchForRecommendation(game1, game2) {
    SearchForTagMatch(game1,game2);
    console.log(tagsMatch)
    SearchForGamesToRecommend(tagsMatch)
}

//compara los tags de los dos juegos y los almacena en una variable
function SearchForTagMatch(game1,game2){
    //recorre la lista de tags del primer juego
    game1.tags.forEach(tag1 => {
        console.log("Tag " + tag1 + " coincide con:");
        //compara cada tag del segundo juego con el primero y lo almacena en una variable
        for (let i = 0; i < game2.tags.length; i++) {
            const tag2 = game2.tags[i];
            if (tag1 == tag2){
                tagsMatch.push(tag1); 
                console.log(tag2)
            }
        }
    });
    console.log("Lista de tags que coinciden entre los dos juegos: " + tagsMatch)
}

//usando los tags en comun entre los dos juegos busca juegos con los mismos tags en otro array mas adelante se hara una request con cada tag a la Api
function SearchForGamesToRecommend(tagsMatch){
    //por cada tag guardado hace un for para cada juego en el array 
    tagsMatch.forEach(matchingTag => {
        for (let i = 0; i < gamesDataArray.length; i++) {
            const gameToCompare = gamesDataArray[i];
            //compara los tags guardados con cada uno de los tags de los juegos en el array
            for (let j = 0; j < gameToCompare.tags.length; j++) {
                if (matchingTag == gameToCompare.tags[j]){
                    console.log("JUEGO RECOMENDADO = " + gameToCompare.name);
                }
            }
        }
    });

}

//El usuario ingresaria dos juegos por ahora tengo objetos hasta que implemente una busqueda con la api 

game1 = new Game(10, "7 Days to Die", "Action",["Sandbox", "Co-op", "Zombies"], 2012, "PC");
game2 = new Game(7, "Rust", "Action",["Crafting", "Zombies", "Co-op"], 2012, "PC");
game3 = new Game(3, "Dead By Daylight", "Action",["Horror", "Co-op"], 2012, "PC");
 


//prompt pidiendo que seleccione el juego
gameSelected1 = prompt("Ingrese el numero del juego que quiere seleccionar \n 1. 7 Days to Die \n 2.Rust \n 3.Dead By Daylight");
gameSelected2 = prompt("Ingrese el numero del segundo juego que quiere seleccionar \n 1. 7 Days to Die \n 2.Rust \n 3.Dead By Daylight");

//función temporal para transformar los prompt en objetos.
function GameSelected(gameSelected){
    if (gameSelected == 1){
        return game1;
    }else if(gameSelected == 2){
        return game2;
    }else if(gameSelected == 3){
        return game3;
    }else{
        console.log("Incorrecto")
    }
}

//llama a la función con los dos objetos.
SearchForRecommendation(GameSelected(gameSelected1),GameSelected(gameSelected2));