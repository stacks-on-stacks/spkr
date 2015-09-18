angular.module('spkr.previous-pres', ['ngRoute'])
  .controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth, Vis) {

    Auth.getAllData()
        .then(function(data){
          $scope.allPresentations = data.slice(1);

          // Let's check to see if the user got here by clicking on a presentation,
          // and if they did, let's find the index of that in our presentation array.
          if($routeParams.id) {
            var index = $scope.allPresentations.map(function(x) {return x._id; }).indexOf($routeParams.id)
          } else {
            var index = 0;
          }

          // Default selection is either the presentation they clicked on, or the first
          // presentation they added.
          $scope.selectedOption = $scope.allPresentations[index];


    $scope.updateChart = function() {
            //get the data for selected presentation
          Pres.getData($scope.selectedOption._id)
          .then(function(data){
            $scope.title = data.title;
            $scope.date  = data.date.slice(0,10);
            $scope.feedbacks = data.feedbacks.length;
            $scope.comments = [];
            if ($scope.feedbacks > 0) { //if the presentation has any feedbacks
              for (var i = 0; i < $scope.feedbacks; i++) {
                if (data.feedbacks[i].comments){
                  $scope.comments.push(data.feedbacks[i].comments)
              }
            }              

          var criteriaHeaders = data.criteriaHeaders;
              //create an array or arrays filled with zeroes
              var distData = [];
              for (var i = 0; i <= 100; i++) {
                distData[i] = [];
                for (var j = 0; j < criteriaHeaders.length; j++) {
                  distData[i][j] = 0;
                }
              }
              //count the number of times each score was given for each criteria
              data.feedbacks.forEach(function(feedback){
                feedback.scores.forEach(function(score,i){
                  distData[score.value][i]++;
                });
              });
            } else {
              criteria = [];
              distData = [];
            }
              //call the presentationGraph factory function (this is where d3 happens)
              Vis.presentationGraph(criteriaHeaders, distData);
              delete $routeParams.id;
          })
          .catch(function(error){
            $location.path('/data-profile')
          })
    }



    $scope.$watch(function () {return $scope.selectedOption;}, function(authed) {
      if (authed) {
        $scope.updateChart();
      } else {
        $location.path('/')
      }
    }, true);

   
        });
    

  });
