var networkautomation = angular.module('networkautomation', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router', 'md.data.table',
    'ngResource', 'n3-pie-chart', 'md.time.picker']);

(function(app) {

    app.constant('_',
        window._
    );

    app.directive('listSearch', function() {
        return {
            replace: true,
            scope: {
                searchText: '=',
                disabled: '=ngDisabled',
                placeholder: '@',
                showClearButton: '='
            },
            controller: function ($scope) {
                $scope.clearSearchText = function() {
                    $scope.query= undefined;
                };
            },
            templateUrl: 'partials/list_search.html'
        };
    });

    app.config(['$stateProvider', '$urlRouterProvider', '$qProvider', function($stateProvider, $urlRouterProvider, $qProvider) {

        $qProvider.errorOnUnhandledRejections(false);

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            controller: 'HomeController',
            resolve: {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            }
        })

        .state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            resolve: {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            }
        })


        .state('dispositivos', {
            abstract: true,
            url: '/dispositivos',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('dispositivos.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/dispositivos.html',
                    controller: 'DispositivosController',
                },
            },
            resolve : {
                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('dispositivos.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/dispositivos.record.html',
                    controller: 'DispositivosRecordController',
                },
            },
            resolve: {
                dispositivo: function ($stateParams, DispositivosServices){
                    return DispositivosServices.getDispositivoById($stateParams.subId);
                },
            },
        })

        .state('auditoria', {
            abstract: true,
            url: '/auditoria',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('auditoria.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/auditoria.html',
                    controller: 'AuditoriaController',
                },
            },
            resolve : {

                auditoria: ['$http', function($http) {
                    return $http({
                        method: 'GET',
                        url: '/js/json/auditoria.json'
                    })
                }]
            },
            require: 'js/iic-underscore.js'
        })

        .state('respaldos', {
            abstract: true,
            url: '/respaldos',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('respaldos.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/respaldos.html',
                    controller: 'RespaldosController',
                },
            },
            resolve : {
                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }
            },
            require: 'js/iic-underscore.js'
        })


        .state('monitoreo.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/monitoreo.html',
                    controller: 'MonitoreoController',
                },
            },
            resolve : {
                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('redesprivadas', {
            abstract: true,
            url: '/redesprivadas',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('redesprivadas.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/redesprivadas.html',
                    controller: 'RedesprivadasController',
                },
            },
            resolve : {
                redesprivadas: function (RedesprivadasServices) {
                    return RedesprivadasServices.getRedesprivadas();
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('redesprivadas.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/redesprivadas.record.html',
                    controller: 'RedesprivadasRecordController',
                },
            },
            resolve: {
                redprivada: function ($stateParams, RedesprivadasServices){
                    return RedesprivadasServices.getRedesprivadaById($stateParams.subId);
                },
                dispositivos: function (DispositivosServices){
                    return DispositivosServices.getDispositivos();
                }
            },
        })


        .state('usuarios', {
            abstract: true,
            url: '/usuarios',
            template: '<div ui-view class="page-transition"></div>'
        })

        .state('usuarios.list', {
            url: '/list',
            views: {
                "": {
                    templateUrl: 'partials/usuarios.html',
                    controller: 'UsuariosController',
                },
            },
            resolve : {
                usuarios: function (UsuariosServices){
                    return UsuariosServices.getUsuarios();
                }
            },
            require: 'js/iic-underscore.js'
        })

        .state('usuarios.record', {
            url: '/:subId',
            views: {
                "": {
                    templateUrl: 'partials/usuarios.record.html',
                    controller: 'UsuariosRecordController',
                },
            },
            resolve: {
                usuario: function ($stateParams, UsuariosServices){
                    return UsuariosServices.getUsuariosById($stateParams.subId);
                },
            },
        })


    }]);

    app.controller('AppCtrl', function ($scope, $mdMedia, $mdSidenav, $state, _, $rootScope) {

        if(!$rootScope.logged){
            $state.go('login');
        }

        $scope.currentNavItem = "home";

        $scope.$mdMedia = $mdMedia;

        $scope.$mdSidenav = $mdSidenav;

        $scope.isInState = function isInState(sref) {

            return $state.includes(sref);
        };

        $scope.openSidebar = function() {
            $scope.$mdSidenav('left').toggle();
        };

        $scope.closeSidebar = function() {
            $scope.$mdSidenav('left').close();
        };

        $scope.isSidebarOpen = function() {
            return $scope.$mdSidenav('left').isOpen();
        };

        $scope.goTo = function(state){
            $state.go(state);
        }

    })

    .directive('mainToolbar', function() {
        return {
            replace: true,
            restrict: 'E',
            transclude: true,
            templateUrl: 'partials/main.toolbar.html',
            scope: { 'crumbs': '=' },

            controller: function($scope, $rootScope, $mdSidenav, $mdMedia, $state) {

                $scope.$mdMedia = $mdMedia;

                $scope.$mdSidenav = $mdSidenav;

                $scope.openSidebar = function() {
                    $scope.$mdSidenav('left').toggle();
                };

                $scope.closeSidebar = function() {
                    $scope.$mdSidenav('left').close();
                };

                $scope.isSidebarOpen = function() {
                    return $scope.$mdSidenav('left').isOpen();
                };

            }
        };
    });

})(networkautomation);


