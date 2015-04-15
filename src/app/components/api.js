'use strict';

var moduleName = 'api';

import { default as models } from './models';

const MODEL = new WeakMap();

class ApiService{

    constructor($resource, ModelFactory){

        MODEL.set(this, ModelFactory);

    }

    list( data ){

        var params = data;

        //if type if repo, we need to extract the user name
        if(data.formatType === 'repo'){
            params._username = data._username.split('/')[0]
        }

        //if type if url, we need to extract the user name...
        if(data.formatType === 'url'){
            params._username = data._username.split('https://github.com/')[1].split('/')[0];
        }

        var promise =  MODEL.get(this).getUserRepo().query({}, params ).$promise;

        promise.then((rep) => this.commonSuccess(rep, 'repo list'), this.commonError );

        return promise;
    }

    fetchRepo( repo ){

        var params = {
            _owner: repo.owner.login,
            _repoName: repo.name
        };

        var promise =  MODEL.get(this).getRepo().get({}, params ).$promise;

        promise.then((rep) => this.commonSuccess(rep, 'repo'), this.commonError );

        return promise;
    }

    fetchContributors( repo ){

        var params = {
            _owner: repo.owner.login,
            _repoName: repo.name
        };

        var promise = MODEL.get(this).getContributors().query({}, params ).$promise;

        promise.then((rep) => this.commonSuccess(rep, 'contributors'), this.commonError );

        return promise;
    }

    commonSuccess(response, message){
        console.log(message + ': ', response);
    }

    commonError(error){
        console.error(error);
    }

}

ApiService.$inject = ['$resource', 'ModelFactory'];

angular.module(moduleName, [models])
    .service('apiService', ApiService);

export default moduleName;
