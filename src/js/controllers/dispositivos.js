(function(app) {


    app.service('DispositivosServices', function ($resource) {


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

        var resource2 = $resource('/aut-api/dispositivos/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getDispositivos = function getDispositivos(){
            return resource.query({}).$promise;
        };
        this.createDispositivo = function createDispositivo(dispositivo){
            return resource.create(dispositivo).$promise;
        };
        this.deleteDispositivoById = function deleteDispositivoById(id){
            return resource2.delete({id: id});
        };
        this.updateDispositivo = function updateDispositivo(dispositivo){
            return resource.update(dispositivo).$promise;
        }
        this.getDispositivoById = function getDispositivoById(id){
            return resource2.get({id: id}).$promise;
        }

    });

    app.controller('DispositivosController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, dispositivos, DispositivosServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.dispositivos = dispositivos;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.hostname).indexOf(angular.lowercase($scope.query) || '') !== -1 );

            return isIt;
        };

        $scope.goTo = function goTo(dispositivoId) {
            $state.go('dispositivos.record', {subId: dispositivoId}, {reload:true});
        };

        $scope.goBack = function(){
            //$state.go('home');
        };

        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });

        $scope.createNew = function (ev) {

            var dispositivo = {

                fechaCreacion: Date.now()
            };

            $scope.showDetails(ev, dispositivo);
        };

        $scope.showDetails = function (ev, dispositivo) {
            $mdDialog.show({
                templateUrl: 'partials/dispositivos.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'DispositivosDialog',
                escapeToClose: true,
                locals: {dispositivo: dispositivo},
                focusOnOpen: true
            }).then(function (dispositivo) {

                DispositivosServices.createDispositivo(dispositivo).then(function (data) {
                    DispositivosServices.getDispositivos().then(function (data){
                        $scope.dispositivos = data;
                    })
                });

                $scope.showSimpleToast("Dispositivo Creado");

            });

        };

    })

    .controller('DispositivosDialog', function ($scope, $mdDialog, dispositivo) {

        $scope.dispositivos = dispositivo;

        $scope.saveDispositivo = function saveDispositivo() {
            $mdDialog.hide($scope.dispositivo);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.canSave = function(){
            if($scope.dispositivo.ip && $scope.dispositivo.hostname){
                return false;
            }
            return true;
        };

    })

    app.controller('DispositivosRecordController', function($scope, $resource, $state, dispositivo, $stateParams, _, $mdToast, DispositivosServices) {

        'use strict';

        $scope.dispositivo = dispositivo;

        $scope.dispositivoOriginal = angular.copy($scope.dispositivo);

        $scope.$watch('dispositivo', function(newValue){
            if (!angular.equals(newValue, $scope.dispositivoOriginal)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.$watch('dispositivoOriginal', function(newValue){
            if (!angular.equals(newValue, $scope.dispositivo)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.goBack = function(){
            $state.go('dispositivos.list');
        };

        $scope.updateDispositivo = function (){
            DispositivosServices.updateDispositivo($scope.dispositivo).then(function (response) {
                $scope.dispositivo = response;

                $scope.dispositivoOriginal = angular.copy($scope.dispositivo);
            });

            $scope.showSimpleToast("Cambios guardados!");

        }

    });

})(networkautomation);
