/*
    Defines the base API connection URL
    Single source of truth used in multiple API actions.
*/

/* ================================= SETUP ================================= */

<<<<<<< HEAD
const prodUrl = 'https://picnic.glitch.me';
// const devUrl = "http://localhost:3001"; // server url for local install
=======
// const prodUrl = 'https://picnic.glitch.me';
const devUrl = "http://localhost:3001"; // server url for local install
>>>>>>> 6b524d4a91df10a32d71223cf1eba36a058f96e4

/* ================================ EXPORTS ================================ */

// ENVIRONMENT is a global variable defined by weback.config.js
// defaults to DEVELOPMENT

<<<<<<< HEAD
// export const BASE_URL = devUrl;
export const BASE_URL = prodUrl;
=======
export const BASE_URL = devUrl;
// export const BASE_URL = prodUrl;
>>>>>>> 6b524d4a91df10a32d71223cf1eba36a058f96e4

// export const BASE_URL = (ENVIRONMENT === 'PRODUCTION' ? prodUrl : devUrl);
