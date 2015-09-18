angular.module('spkr.feedback-form', ['ngRoute'])
  .controller('FeedbackController', function ($scope, $location, $routeParams, FeedbackService, Pres, Auth) {

    var presId = $routeParams.id;
    $scope.loggedIn = Auth.isAuth(),
    $scope.title,
    $scope.date,
    $scope.expiration,
    $scope.today,
    $scope.user,
    // another reference
    $scope.presentation= {
      // date: 'guest',
      // name: 'guest',
      comments: '',
      values: []
    }



    
  // add in submitFeedback function to be able to call it on feedbackForm.html for ng-click Submit
    $scope.submitFeedback = function (presentation) {
      console.log('Scope criteria ', $scope.fbCriteria);
      presentation.presId = presId;
      presentation.values = $scope.fbCriteria;
      console.log('presentation', presentation)
      FeedbackService.submitFeedback(presentation) // inputs may be changed
        .then (function (data) {
          console.log(data)
          $scope.feedbackSuccess = data.data
        })
        .catch (function (error) {
          console.log(error)
        })
    },

    $scope.getData = function(){
      Pres.getData(presId)
      .then(function(data){
        $scope.user = data._presenter.username;
        $scope.title = data.title;
        $scope.date  = data.date.slice(0,10);
        $scope.today = new Date().toISOString().split('T')[0];
        $scope.expiration = data.expiration.slice(0,10);
        $scope.fbCriteria = [];

        for (var i = 0; i < data.criteriaHeaders.length; i++){
          $scope.fbCriteria[i] = {
            name: data.criteriaHeaders[i],
            prompt: data.criteriaPrompts[i],
          }
        }
      })
      .catch(function(error){
        $location.path('/data-profile')
      })
    }

    $scope.getData();
  });


