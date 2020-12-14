import home from '../controllers/home.controller.js'
import recommend from '../controllers/recommend.controller.js'
import saved from '../controllers/savedgames.controller.js'


//main content
const content = $('#root');

//
const router = (route) =>{
    //limpia el contenido por cada cambio de hash - y agrega la vista favoritos pero oculta.
    content.empty();
    $('.nav-link').removeClass('active');
    content.append(saved())

    switch (route) {
        case '':{
            $('#navbar-home').addClass('active');
            return content.append(home());
        }
        case '#/':{
            $('#navbar-home').addClass('active');
            return content.append(home());
        }
        case '#/recommendations':{
            $('#navbar-recommend').addClass('active');
            return content.append(recommend());
        }
        default:
            content.empty();
            console.log("404");
    }
}

export {router};