'use strict';

const TIMEOUT = new WeakMap();
const API = new WeakMap();
const SCOPE = new WeakMap();
const Q = new WeakMap();

class MainCtrl {
    constructor ($scope, $state, apiService, $timeout, $q) {
        //creating our private variables
        TIMEOUT.set(this, $timeout);
        API.set(this, apiService);
        SCOPE.set(this, $scope);
        Q.set(this, $q);

        //using debouce so we wont kill github from keyups...
        // This code will be invoked after .5secs after the model changed
        this.lazyFind = _.debounce(function(newVal, oldVal){
            this.findUsers(newVal, oldVal);
        }, 500 );

        var watcher = angular.bind(this, function () {
            return this.searchData;
        });

        SCOPE.get(this).$watch(watcher, (newVal, oldVal) => this.lazyFind(newVal, oldVal) );
    }

    //clearing the states after finding the users
    clearStates(){
        this.repoInfo = null;
        this.contributors = null;
        this.error = false;
    }

    //Fetch the repo and the people involved in that repo
    fetchRepoData( repo ){

        var promises = [
            API.get(this).fetchRepo( repo ),
            API.get(this).fetchContributors( repo )
        ];

        var repoQuery = Q.get(this).all(promises);

        repoQuery.then(data => {

            TIMEOUT.get(this)(() => {

                this.repoInfo = data[0];
                this.contributors = data[1];

            });
        });

    }

    //this will determine the different types of format
    determineFormat( newVal ){
        //- user = userName
        //- repo = userName/repoName
        //- url = https://github.com/someuser/someRepo
        let format;

        if( !newVal.match(/\//) ){
            //user format
            console.log('user format');
            format = 'user';

        }else if( newVal.split('/').length === 2 && newVal.split('/')[1].length > 0){
            //repo format (also checking to make sure the repo is there)
            console.log('repo format');
            format = 'repo';

        }else if( newVal.match('https://github.com')){
            //url format
            console.log('url format');
            format = 'url';

        }else{
            console.log('wrong formatting');
            this.wrongFormat = true;
            return false;
        }

        return format;

    }

    findUsers (newVal, oldVal) {
        var noNewVal = newVal === oldVal;
        var noEmpty = newVal === '';

        if(noNewVal || noEmpty){
            //no new val, no need to send to server
            return;
        }

        console.log('Name changed to ' + newVal);

        //clearing preview states
        this.clearStates();

        let format = this.determineFormat( newVal );

        //if the format is invalid, lets stop there
        if(!format){
            return;
        }

        this.wrongFormat = false;

        //making the query call for the list of repos for a user
        let params = {
            _username: newVal,
            formatType: format
        };

        API.get(this).list( params ).then( data => {
            this.userInfo = data;

            let repoName;

            if(format === 'repo'){
                repoName = newVal.split('/')[1];
            }

            if(format === 'url'){
                repoName = newVal.split('https://github.com/')[1].split('/')[1];
            }

            let repo = _.where(data, {name: repoName})[0];

            if(!repo){
                return;
            }

            this.fetchRepoData(repo);

        }, (error) => {
            console.log(error);
            //simple error state
            this.error = true;

        });

    }
}

MainCtrl.$inject = ['$scope', '$state', 'apiService', '$timeout', '$q'];

export default MainCtrl;
