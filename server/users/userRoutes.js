var userController = require('./userController.js');


module.exports = function (app) {
  // app === userRouter injected from middlware.js
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.get('/signedin', userController.checkAuth)
  app.get('/:id', userController.serveData);  
  app.get('/auth/facebook', passport.authenticate('facebook'))
  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook', {successRedirect: '/app/homepage/homepage.html', 
                      failureRedirect: '/login' }));
};
