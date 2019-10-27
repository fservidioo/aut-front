(function(app) {

    app.controller('RespaldosController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, dispositivos) {

        'use strict';

        $scope.showSimpleToast = function(text) {
ç
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

        $scope.goBack = function(){
            //$state.go('home');
        }

        $scope.openFile = function(ip){
            var url ="localhost:8081/" + ip + ".txt";

            window.open(url);
        }


        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });



    })
})(networkautomation);
