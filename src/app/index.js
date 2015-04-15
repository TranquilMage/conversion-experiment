'use strict';

import { default as mainModule } from './main/main';

import { default as navbarDirective } from './components/navbar/navbar';

angular.module('es6Angular', [
    'ngAnimate',
    'ngCookies',
    'ngTouch',
    'ngSanitize',
    'ngResource',
    'ui.router',
    'ui.bootstrap',

    //modules
    mainModule,

    //components
    navbarDirective
])

.config(function ( $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

});
