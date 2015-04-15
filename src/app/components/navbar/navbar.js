'use strict';

var moduleName = 'navbar';

class NavbarCtrl {
    constructor ($scope) {
        console.log($scope)
        this.restrict='AE';
        this.templateUrl = 'app/components/navbar/navbar.html';
        this.scope = {};

    }

    controller($scope){
        $scope.date = new Date();

    }

    link(scope, elem, attrs){

    }
}

NavbarCtrl.$inject = ['$scope'];

angular.module(moduleName, [])
    // module.directive() method expects a factory function
    // rather than a constructor
    .directive('navbar', () => new NavbarCtrl());


export default moduleName;
