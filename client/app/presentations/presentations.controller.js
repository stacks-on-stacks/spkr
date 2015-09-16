angular.module('spkr.presentations', [])
  .controller('PresentationsController', function($scope, $window, $location,
    Auth, Pres) {
    //takes a raw string, seperates them by commas, and chucks them in an array of criteria. 
    var makeCriteria = function(commaDelimitedList, isChecked) {
      var criteria = ['organization', 'clarity', 'volume', 'posture',
        'preparation', 'visual aids', 'connection', 'questions',
        'overall'];
      //If the user has defined custom criteria, parse that into an array of criteria. 
      if (commaDelimitedList !== '' && isChecked) {
        criteria = [];
        criteria = commaDelimitedList.split(',');
        for (var i = 0; i < criteria.length; i++)
          while (criteria[i].indexOf(' ') === 0) {
            criteria[i] = criteria[i].slice(1);
          }
      }
      return criteria;
    };

    $scope.root = window.location.href.slice(0, window.location.href.lastIndexOf(
      '/'));

    $scope.$watch(Auth.isAuth, function(authed) {
      if (authed) {
        $location.path('/presentations');
      } else {
        $location.path('/');
      }
    }, true);

    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName("date")[0].setAttribute('min', today);

    $scope.submit = function(presentation) {

      console.log('final', makeCriteria(presentation.customCriteriaList,
        $scope.customizeChecked));
      // console.log('presentation', presentation);
      Pres.createPresentation(presentation).then(function(data, err) {
        if (err) console.log(err);
        $scope.feedbackUrl = $scope.root + "/feedback-form/" + data.newPresentation
          .presentationid;
        $scope.getData();
        $scope.presentation = {};
      });
    };

    $scope.getData = function() {
      Auth.getAllData()
        .then(function(data) {
          $scope.presentations = data.slice(1);
        })
        .catch(function(error) {
          console.err(error);
        });
    };
    $scope.getData();
  });