'use strict';

import MainCtrl from './main.controller';

import { default as apiService } from '../components/api';


var moduleName = 'main';

var moduleConfig = function ($stateProvider) {
    $stateProvider
        .state('home', {
            url: '/:sso',
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl as mainCtrl'
        });

};

angular.module(moduleName, [ apiService ])
    .controller('MainCtrl', MainCtrl)
    .config(moduleConfig);

export default moduleName;
