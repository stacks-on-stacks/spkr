angular.module('spkr.previous-pres', ['ngRoute'])
  .controller('PrevPresController', function ($scope, $location, $routeParams, Pres, Auth, Vis) {

    Auth.getAllData()
        .then(function(data){
          $scope.allPresentations = data.slice(1);
          $scope.selectedOption = $scope.allPresentations[0];
          console.log($scope.selectedOption._id);


    $scope.updateChart = function() {
          console.log("hello");
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

          var criteria = data.criteria;
              //create an array or arrays filled with zeroes
              var distData = [];
              for (var i = 0; i <= 100; i++) {
                distData[i] = [];
                for (var j = 0; j < criteria.length; j++) {
                  distData[i][j] = 0;
                }
              }
              //count the number of times each score was given for each criteria
              data.feedbacks.forEach(function(feedback){
                feedback.scores.forEach(function(score,i){
                  distData[score][i]++;
                });
              });
              //call the presentationGraph factory function (this is where d3 happens)
              Vis.presentationGraph(criteria, distData);
            }
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
