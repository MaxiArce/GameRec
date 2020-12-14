import {router} from './router/router.js';

//llama por primera vez al router para cargar la pagina 
router(window.location.hash)

//consulta a router.js cuando se detecta un cambio en el hash
window.addEventListener('hashchange', () =>{
    router(window.location.hash)
});
