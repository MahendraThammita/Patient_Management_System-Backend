// var session = require('express-session');
// var Keycloak = require('keycloak-connect');

// let _keycloak;

// var keycloakConfig = {
//     clientId: 'spm',
//     bearerOnly: true,
//     serverUrl: 'http://keycloak-1307686978.us-east-1.elb.amazonaws.com/auth/',
//     realm: 'Dspm',
//     credentials: {
//         secret: '63fd9f4d-a693-40cb-acf1-2ff729047d58'
//     }
// };

// function initKeycloak() {
//     if (_keycloak) {
//         console.warn("Trying to init Keycloak again!");
//         return _keycloak;
//     } 
//     else {
//         console.log("Initializing Keycloak...");
//         var memoryStore = new session.MemoryStore();
//         _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
//         return _keycloak;
//     }
// }

// function getKeycloak() {
//     if (!_keycloak){
//         console.error('Keycloak has not been initialized. Please called init first.');
//     } 
//     return _keycloak;
// }

// module.exports = {
//     initKeycloak,
//     getKeycloak
// };