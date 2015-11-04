angular.module('spkr.background', [])
  .controller('BackgroundController', function ($scope, $rootScope, $route, $routeParams, $window, $location, Auth) {
  $rootScope.withBackground = true;
  $rootScope.withBackgroundPaths = ['/signup', '/login', '/'];
  $rootScope.$on('$locationChangeStart', function(event, next, current){
  	$rootScope.withBackground = true;
    var next = next.split('#')[1];
    if($rootScope.withBackgroundPaths.indexOf(next) === -1){
      $rootScope.withBackground = false;
    }
  });
});