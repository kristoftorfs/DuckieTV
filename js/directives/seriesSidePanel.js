angular.module('DuckieTV.directives.sidepanel', ['DuckieTV.providers.favorites', 'DuckieTV.providers.episodeaired'])

.directive('sidepanel', function(FavoritesService, EpisodeAiredService, SceneNameResolver) {

    return {
        restrict: 'E',
        templateUrl: 'templates/sidepanel/sidepanel.html',
        link: function($scope, iElement, $rootScope) {

            $scope.state = '';
            $scope.serie = null;
            $scope.season = null;
            $scope.seasons = null;
            $scope.episode = null;

            $scope.isShowing = false;
            $scope.isExpanded = false;

            $scope.toggle = function() {
                $scope.isShowing ? $scope.hide() : $scope.show();

            };
            $scope.show = function() {
                $scope.isShowing = true;
                $scope.contract();
                $scope.zoomOut();
                iElement.addClass('active');
            };
            $scope.hide = function() {
                $scope.isShowing = false;
                $scope.zoomIn();
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

            $scope.showSerie = function() {
                $scope.expand();
                $scope.state = 'serie';
                setTimeout(function() {
                    $rootScope.$broadcast('calendar:zoomoutmore');
                }, 50);
            };

            $scope.showEpisodes = function() {
                $scope.expand();
                $scope.state = 'episodes';

                setTimeout(function() {
                    $rootScope.$broadcast('calendar:zoomoutmore');
                }, 50);

                $scope.serie.getSeasons().then(function(result) {
                    $scope.seasons = result;
                    $scope.serie.getLatestSeason().then(function(result) {
                        $scope.activeSeason = result;
                        fetchEpisodes(result);
                    });
                });
            };

            var allSeasons = [];


            function fetchEpisodes(season) {
                if (!season) return;
                $scope.season = season;

                var episodes = season.getEpisodes().then(function(data) {
                    $scope.episodes = data.map(function(el) {
                        $scope.$on('magnet:select:' + el.TVDB_ID, function(evt, magnet) {
                            this.magnetHash = magnet;
                            this.Persist();
                        }.bind(el));
                        return el;
                    });

                });
            };


            $scope.autoDownload = function() {
                EpisodeAiredService.autoDownload($scope.serie, $scope.episode);
            };

            $scope.getSearchString = function(serie, episode) {
                var serieName = SceneNameResolver.getSceneName(serie.TVDB_ID) || serie.name;
                return serieName.replace(/\(([12][09][0-9]{2})\)/, '').replace(' and ', ' ') + ' ' + SceneNameResolver.getSearchStringForEpisode(serie, episode);
            };

            $scope.zoomOut = function() {
                setTimeout(function() {
                    $rootScope.$broadcast('calendar:zoomout');
                }, 50);
            };

            $scope.zoomIn = function() {
                setTimeout(function() {
                    $rootScope.$broadcast('calendar:zoomin');
                }, 50);
            }

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