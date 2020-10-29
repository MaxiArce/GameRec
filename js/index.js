// javascript del index

// variables de las tabs
var tabButtons = document.querySelectorAll(".button_select-tab");
var tabContent = document.querySelectorAll(".tab-content");
//variables slider años
var slider = document.getElementById("range");
var output = document.getElementById("slider-text");
output.innerHTML = slider.value;
slider.oninput = function() {
    output.innerHTML = this.value;
}

//funcion ocultar/mostrar tabs
function showTabContent(tab) {
    //make selected button white color
    tabButtons.forEach(element => element.style.color = "grey");
    tabButtons[tab].style.color = "white";

    //hide all tabs except the selected one
    tabContent.forEach(element => element.style.display = "none");
    tabContent[tab].style.display = "block";
}