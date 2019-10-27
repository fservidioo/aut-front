(function(app) {


    app.service('RedesprivadasServices', function ($resource) {


        var resource = $resource('/aut-api/redesprivadas', {}, {
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

        var resource2 = $resource('/aut-api/redesprivadas/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        var resource3 = $resource('/aut-api/redesprivadas/:id/connect/:deviceid', {}, {

            connect:{
                url: 'aut-api/redesprivadas/:id/connect',
                headers: [
                    {'Content-Type':'application/json'}],
                params: { "id": "@id"},
                method: 'POST'
            },
        });

        this.getRedesprivadas = function getRedesprivadas(){
            return resource.query({}).$promise;
        };
        this.createRedesprivada = function createRedesprivada(redesprivada){
            return resource.create(redesprivada).$promise;
        };
        this.deleteRedesprivadaById = function deleteRedesprivadaById(id){
            return resource2.delete({id: id});
        };
        this.updateRedesprivada = function updateRedesprivada(redesprivada){
            return resource.update(redesprivada).$promise;
        }
        this.getRedesprivadaById = function getRedesprivadaById(id){
            return resource2.get({id: id}).$promise;
        }

        this.connectToDevices = function connectToDevices(id, deviceid){
            return resource3.connect({id: id}, deviceid).$promise
        };

    });

    app.controller('RedesprivadasController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, redesprivadas, RedesprivadasServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.redesprivadas = redesprivadas;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombreVlan).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.tagVlan).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.ipAddress).indexOf(angular.lowercase($scope.query) || '') !== -1);

            return isIt;
        };

        $scope.goTo = function goTo(redesprivadaId) {
            $state.go('redesprivadas.record', {subId: redesprivadaId}, {reload:true});
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

            var redprivada = {

                fechaCreacion: Date.now()
            };

            $scope.showDetails(ev, redprivada);
        };

        $scope.showDetails = function (ev, redprivada) {
            $mdDialog.show({
                templateUrl: 'partials/redesprivadas.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'RedesprivadasDialog',
                escapeToClose: true,
                locals: {redprivada: redprivada},
                focusOnOpen: true
            }).then(function (redprivada) {

                RedesprivadasServices.createRedesprivada(redprivada).then(function (data) {
                    RedesprivadasServices.getRedesprivadas().then(function (data){
                        $scope.redesprivadas = data;
                    })
                });

                $scope.showSimpleToast("Red Privada Creada");

            });

        };

    })

    .controller('RedesprivadasDialog', function ($scope, $mdDialog, redprivada) {

        $scope.redprivada = redprivada;

        $scope.saveRedesprivada = function saveRedesprivada() {
            $mdDialog.hide($scope.redprivada);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.canSave = function(){
            if($scope.redprivada.tagVlan && $scope.redprivada.nombreVlan){
                return false;
            }
            return true;
        };

    })

    .controller('ConnectDevicesDialog', function ($scope, $mdDialog, dispositivos, redprivada) {

        $scope.redprivada = redprivada;
        $scope.dispositivos = dispositivos;

        $scope.selectedDevices = [];

        $scope.devicesToSubmit = function devicesToSubmit() {
            $mdDialog.hide($scope.selectedDevices);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.canSubmit = function(){
            if(selectedDevices.length > 0){
                return false;
            }
            return true;
        };

    });

    app.controller('RedesprivadasRecordController', function($scope, $resource, $state, redprivada, $stateParams, _, $mdToast, RedesprivadasServices, dispositivos,$mdDialog) {

        'use strict';

        $scope.redprivada = redprivada;
        $scope.dispositivos = dispositivos;
        $scope.query = [];

        $scope.redesprivadaOriginal = angular.copy($scope.redprivada);

        $scope.$watch('redprivada', function(newValue){
            if (!angular.equals(newValue, $scope.redesprivadaOriginal)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.$watch('redesprivadaOriginal', function(newValue){
            if (!angular.equals(newValue, $scope.redprivada)){
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

        $scope.connectToDevices = function(ev, dispositivos, redprivada){
            $mdDialog.show({
                templateUrl: 'partials/redesprivadas.dialog.dis.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'ConnectDevicesDialog',
                escapeToClose: true,
                locals: {dispositivos: $scope.dispositivos, redprivada: $scope.redprivada},
                focusOnOpen: true
            }).then(function (selectedDevices) {
            //llamada a connect
                selectedDevices.forEach(function(device){
                    RedesprivadasServices.connectToDevices($stateParams.subId, device.id).then(function (success) {
                        $scope.showSimpleToast("Dispositivo " + device.hostname + " conectado");
                    })
                });

            });
        }

        $scope.goBack = function(){
            $state.go('redesprivadas.list');
        };

        $scope.updateRedesprivada = function (){
            RedesprivadasServices.updateRedesprivada($scope.redprivada).then(function (response) {
                $scope.redprivada = response;

                $scope.redesprivadaOriginal = angular.copy($scope.redprivada);
            });

            $scope.showSimpleToast("Cambios guardados!");

        }

    });

})(networkautomation);
