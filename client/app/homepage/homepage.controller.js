angular.module('spkr.homepage', []).controller('HomepageController', function($scope, $window, $location, Auth, Vis) {
  $scope.$watch(Auth.isAuth, function(authed) {
    if (authed) {
      $location.path('/data-profile');
    } else {
      $location.path('/')
    }
  }, true);
  //get all the user's data
  Auth.getAllData().then(function(data) {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      //the first element of the array conatains the username, 
      //the remaining elements are presentations
    $scope.user = data[0].username;
    console.log(data)
    if (data.length > 1) { //if the user has any presentations
      //get the criteria list from the first presentation (since they are all the same)
      var criteriaHeaders = [];
      for (var i = 1; i < data.length; i++) {
        criteriaHeaders = criteriaHeaders.concat(data[i].criteriaHeaders)
      }
      console.log('before', criteriaHeaders);
      criteriaHeaders = criteriaHeaders.filter(onlyUnique)
      console.log('after', criteriaHeaders);
      //create an array of objects for each presentation which includes the date, title, and average score for each criteria
      var scoresData = [];
      var sums = {};
      sums.samples = {};
      for (var j = 0; j < criteriaHeaders.length; j++) {
        console.log("criteriaHeaders[j]", criteriaHeaders[j])
        sums[criteriaHeaders[j]] = 0;
        sums.samples[criteriaHeaders[j]] = 0;
      }
      var presentationsComments = [];
      for (var i = 1; i < data.length; i++) {
        var scoreValues = [];
        if (data[i].feedbacks.length > 0) { //only add the presentations with feedbacks
          // set up a sum for each feedback
          var feedbacksComments = [];
          data[i].feedbacks.forEach(function(feedback) {
            console.log("feedback", feedback)
              //if there's comments, add them to array
            if (feedback.comments) {
              feedbacksComments.push(feedback.comments)
            }
            for (var i = 0; i < feedback.scores.length; i++) {
              var syncIndex = criteriaHeaders.indexOf(feedback.scores[i].name);
              console.log("criteriaHeaders.indexOf(feedback.scores[i].name);", criteriaHeaders.indexOf(feedback.scores[i].name))

              scoreValues[syncIndex] = (feedback.scores[i].value)
            }
          });
          console.log("sums", sums);
          presentationsComments.push({
            date: data[i].date.slice(0, 10),
            feedbackComments: feedbacksComments
          });
          scoresData.push({
            date: data[i].date.slice(0, 10),
            title: data[i].title,
            scores: scoreValues
          });
        }
      }
      //sort the scoresData by date
      scoresData.sort(function(a, b) {
        if (a.date > b.date) {
          return 1;
        }
        if (a.date < b.date) {
          return -1;
        }
        return 0;
      });
      if (scoresData.length === 0) { //if there are no presentations with feedbacks
        $("#fallbackMessage").append("<h2>Oh no!</h2><p>It looks like you haven't recieved any feedback yet." +
          "  Make sure to give out your <a href='/#/presentations'>feedback form URL</a> to start recieving feedback!</p>")
      } else {
        //call the homepageGraph factory function (this is where d3 happens)
        console.log("scoresData", scoresData);
        Vis.homepageGraph(criteriaHeaders, scoresData, presentationsComments);
      }
    } else { //if the user doesn't have any presentations
      $("#fallbackMessage").append(
        "<h2>Oh no!</h2><p>It looks like you haven't made any presentations yet.  <a href='/#/presentations'>Create</a> your first presentation to start recieving feedback!</p>"
      )
    }
  }).catch(function(error) {
    console.err(error)
  })
});