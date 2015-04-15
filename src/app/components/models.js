'use strict';

var moduleName = 'models';

const RESOURCE = new WeakMap();
const API_BASE = 'https://api.github.com';

class ModelFactory{

    constructor($resource){

        RESOURCE.set(this, $resource);
    }

    getUserRepo(){

        let paramDefaults = {
            username:'@_username'
        };

        return RESOURCE.get(this)(API_BASE + '/users/:username/repos', paramDefaults);
    }

    getRepo(){

        let paramDefaults = {
            owner:'@_owner',
            repo:'@_repoName'
        };

        return RESOURCE.get(this)(API_BASE + '/repos/:owner/:repo', paramDefaults);
    }

    getContributors(){

        let paramDefaults = {
            owner:'@_owner',
            repo:'@_repoName'
        };

        return RESOURCE.get(this)(API_BASE + '/repos/:owner/:repo/contributors', paramDefaults);
    }

    static instance($resource){

        return new ModelFactory($resource);
    }

}

ModelFactory.instance.$inject = ['$resource'];


angular.module(moduleName, [])
    .factory('ModelFactory', ModelFactory.instance)

export default moduleName;
