angular.module('spkr.presentations', [])
  .controller('PresentationsController', function($scope, $window, $location,
    Auth, Pres) {
    //takes a raw string, seperates them by commas, and chucks them in an array of criteria. 


  $scope.criteria = [
    {name:'organization', prompt: 'Was the presentation organized well?'},
    {name:'clarity', prompt: 'Was the message clear?'},
    {name:'volume', prompt: 'Was the speaker loud enough?'},
    {name:'posture', prompt: 'Did the speaker have appropriate posture?'},
    {name:'preparation', prompt: 'Did the speaker appear well prepared?'},
    {name:'visual aids', prompt: 'Were the visual aids helpful?'},
    {name:'connection', prompt: 'Did the speaker connect with the audience?'},
    {name:'questions', prompt: 'Did the speaker answer questions appropriately?'},
    {name:'overall', prompt: 'How would you rate the overall presentation?'}
  ];
  
  $scope.addNewCriterion = function() {
    console.log('scope.newHeader', $scope.newHeader);
    var newCriterion = {}
    newCriterion.name = $scope.newHeader;
    newCriterion.prompt = $scope.newPrompt;
    $scope.criteria.push(newCriterion);
    $scope.confirmAdd = 'Successfully Added'
    console.log(JSON.stringify($scope.criteria));
  };
    
  $scope.removeCriterion = function(criterionIndex) {
    console.log('$scope.criteria before', $scope.criteria);
    $scope.criteria.splice(criterionIndex, 1);
    console.log('$scope.criteria after', $scope.criteria);
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

      //presentation.customCriteria = makeCriteria(presentation.customCriteriaList,$scope.customizeChecked);
      // console.log('presentation', presentation);
      console.log('submit');
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