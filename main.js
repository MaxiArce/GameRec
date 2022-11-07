import {router} from './router/router.js';

router(window.location.hash)

//when there is a hash change calls the router 
window.addEventListener('hashchange', () =>{
    router(window.location.hash)
});
