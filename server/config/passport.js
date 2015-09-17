 var FacebookStrategy = require('passport-facebook').Strategy;
 var configAuth = require('../../client/app/auth/facebook-auth.js');
 var Users = require('../users/userModel.js');
 var mongoose = require('mongoose');
 var passport = require('passport');

 module.exports = function(passport) {

   passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

  // used to deserialize the user
  // Checks to see what your user ID is on each page
  // and makes sure that gets the entire row
    passport.deserializeUser(function(id, done) {
      Users.find({_id: id}).then(function(user) { done(null, user[0])}); 
        //done(null, id);
});
 

    passport.use(new FacebookStrategy({

      // pull in our app id and secret from our auth.js file
      clientID          : configAuth.facebookAuth.clientID,
      clientSecret      : configAuth.facebookAuth.clientSecret,
      callbackURL       : configAuth.facebookAuth.callbackURL,
      passReqToCallback : true
    },

  // facebook will send back the token and profile
  function(req, accessToken, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {

    //user is not logged in yet
    if (!req.user) {

      Users.find({'fb_id': profile.id}).then(
        function(user) {

          console.log('user: ', user);
        // if the user is found, then log them in
        if (user.length) {
          return done(null, user[0]); // user found, return that user
        } else {
          // if there is no user found with that facebook id, create them
          var newUser            = new Object();

          // set all of the facebook information in our user model
          newUser.fb_id    = profile.id; // set the users facebook id                   
          newUser.fb_token = accessToken; // we will save the token that facebook provides to the user                    
          newUser.username = profile.displayName; // look at the passport user profile to see how names are returned

          console.log('Users object: ', Users);
          // save our user to the database
          Users.signupFacebook(profile.displayName, profile.id, accessToken).then(function(userRow) {
            newUser.id = userRow[0];
            return done(null, newUser);
          });
        }
        })
        .catch(function(err) { return done(err); }); 
    //user is logged in and needs to be merged
        } else {
          // This is actually broken. There was supposed to be a
          // "connect to facebook" button on the dashboard for already
          // locally signed-up users.
          var user = req.user;

          user.fb_id = profile.id;
          user.fb_token = accessToken;

          Users.updateFacebook(profile.id, accessToken, user.id);
     }
    })
  }
))
};

 