angular.module('DuckieTV.directives.sidepanel', [])

.directive('sidepanel', function(FavoritesService) {

    return {
        restrict: 'E',
        templateUrl: 'templates/sidepanel.html',
        link: function($scope, iElement, $rootScope) {

            $scope.serie = null;
            $scope.season = null;
            $scope.episode = null;

            $scope.isShowing = false;
            $scope.isExpanded = false;
            $scope.toggle = function() {
                $scope.isShowing ? $scope.hide() : $scope.show();
            };
            $scope.show = function() {
                $scope.isShowing = true;
                $scope.contract();
                iElement.addClass('active');
            };
            $scope.hide = function() {
                $scope.isShowing = false;
                iElement.removeClass('active');
            };

            $scope.expand = function() {
                $scope.show();
                $scope.isExpanded = true;
                iElement.addClass('expanded');
            };
            $scope.contract = function() {
                $scope.isExpanded = false;
                iElement.removeClass('expanded');
            }
        },
        controller: function($scope, $rootScope) {

            $rootScope.$on('serie:select', function() {

            });

            $scope.showSerie = function() {
                $scope.expand();
            };  

            $rootScope.$on('episode:select', function(event, serie, episode) {
                console.log("Select episode!", serie, episode);
                $scope.serie = serie;
                $scope.episode = episode;
                $scope.show();
                setTimeout($scope.$digest, 50);
            });

            $rootScope.$on('season:select', function() {

            });
        }
    };
});