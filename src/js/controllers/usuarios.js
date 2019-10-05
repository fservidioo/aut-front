(function(app) {


    app.service('UsuariosServices', function ($resource) {


        var resource = $resource('/eye-tracking-api/usuarios', {}, {
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

        var resource2 = $resource('/eye-tracking-api/usuarios/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getUsuarios = function getUsuarios(){
            return resource.query({}).$promise;
        };
        this.createUsuarios = function createUsuarios(usuario){
            return resource.create(usuario).$promise;
        };
        this.deleteUsuariosById = function deleteUsuariosById(id){
            return resource2.delete({id: id});
        };
        this.updateUsuarios = function updateUsuarios(usuario){
            return resource.update(usuario).$promise;
        }
        this.getUsuariosById = function getUsuariosById(id){
            return resource2.get({id: id}).$promise;
        }

    });

    app.controller('UsuariosController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, usuarios, UsuariosServices) {

        'use strict';

        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.usuarios = usuarios;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombre).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.email).indexOf(angular.lowercase($scope.query) || '') !== -1 );
            return isIt;
        };

        $scope.goTo = function goTo(usuarioId) {
            $state.go('usuarios.record', {subId: usuarioId}, {reload:true});
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

            var usuario = {

                fechaCreacion: Date.now()
            };

            $scope.showDetails(ev, usuario);
        };

        $scope.showDetails = function (ev, usuario) {
            $mdDialog.show({
                templateUrl: 'partials/usuarios.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'UsuariosDialog',
                escapeToClose: true,
                locals: {usuario: usuario},
                focusOnOpen: true
            }).then(function (usuario) {

                UsuariosServices.createUsuarios(usuario).then(function (data) {
                    UsuariosServices.getUsuarios().then(function (data){
                        $scope.usuarios = data;
                    })
                });

                $scope.showSimpleToast("usuario Creado");

            });

        };

    })

        .controller('UsuariosDialog', function ($scope, $mdDialog, usuario) {

            $scope.usuario = usuario;

            $scope.saveUsuario = function saveUsuario() {
                $mdDialog.hide($scope.usuario);
            };

            $scope.closeDialog = function () {
                $mdDialog.cancel();
            };

            $scope.canSave = function(){
                if($scope.usuario.nombre && $scope.usuario.password){
                    return false;
                }
                return true;
            };

        })

    app.controller('UsuariosRecordController', function($scope, $resource, $state, usuario, $stateParams, _, $mdToast, UsuariosServices) {

        'use strict';

        $scope.usuario = usuario;

        $scope.usuarioOriginal = angular.copy($scope.usuario);

        $scope.$watch('usuario', function(newValue){
            if (!angular.equals(newValue, $scope.usuarioOriginal)){
                $scope.allowedToSave = true;
            }else{
                $scope.allowedToSave = false;
            }
        }, true);

        $scope.$watch('usuarioOriginal', function(newValue){
            if (!angular.equals(newValue, $scope.usuario)){
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
            $state.go('usuarios.list');
        };

        $scope.updateUsuarios = function (){
            UsuariosServices.updateUsuarios($scope.usuario).then(function (response) {
                $scope.usuario = response;

                $scope.usuarioOriginal = angular.copy($scope.usuario);
            });

            $scope.showSimpleToast("Cambios guardados!");

        }

    });

})(networkautomation);