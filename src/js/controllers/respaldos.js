(function(app) {


    /*app.service('RespaldosServices', function ($resource) {

        var resource = $resource('/aut-api/dispositivos', {}, {
            query: {
                method: 'GET',
                headers: [
                    {'Content-Type':'application/json'}],
                isArray: true
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }

        });



        this.getDispositivos = function getDispositivos(){
            return resource.query({}).$promise;
        };


    });*/

    app.controller('RespaldosController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, dispositivos) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };
        $scope.dispositivos = dispositivos;
        //$scope.respaldos = respaldos;
        //$scope.respaldos = respaldos.data;

        $scope.query = [];

        /*$scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 );

            return isIt;
        };*/

        $scope.goBack = function(){
            //$state.go('home');
        }


        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });



    })

        .controller('RespaldosDialog', function ($scope, $mdDialog, estudiovigente, alreadyExists) {

            $scope.estudiovigente = estudiovigente;
            if(alreadyExists){
                $scope.estudiovigente.$$alreadyExists = alreadyExists;
            }

            $scope.saveEstudio = function saveEstudio() {
                $mdDialog.hide($scope.estudiovigente);
            };

            $scope.closeDialog = function () {
                $mdDialog.cancel();
            };

            estudiovigente.nombreDeEstudio

            $scope.canSave = function(){
                if($scope.estudiovigente.nombreDeEstudio && $scope.estudiovigente.precio && $scope.estudiovigente.descripcion){
                    return false;
                }
                return true;
            };

        })
})(networkautomation);
