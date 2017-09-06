const gabble = require('./gabble');

function createRoutes(app) {
  /* ******** HOME PAGES ******** */
  // original root
  app.get('/', function(req, res) {
    res.render('home', {
      loggedIn: false,
    });
  });

  // home page
  app.get('/home', function(req, res) {
    res.render('home', {
      loggedIn: true,
    });
  });

  /* ******** CREATE NEW USER ******** */
  // load form to create user
  app.get('/users/new', function(req, res) {
    res.render('new_user');
  });

  // create user
  app.post('/users/new', function(req, res) {
    gabble.createUser(req.body.name, req.body.username, req.body.password)
      .then(function(user){
        req.session.who = user;
        console.log(req.session.who.username + ' has registered');
        res.redirect('/home');
      }).catch(function(user){
        res.render('new_user', {
          error: true,
        });
      });
  });

  /* ******** LOG IN ******** */
  // load login form
  app.get('/users/login', function(req, res) {
    res.render('login');
  });

  // log user in
  app.post('/users/login', function(req, res) {
    gabble.loginUser(req.body.username, req.body.password)
      .then(function(user){
        req.session.who = user;
        console.log(req.session.who.username + ' has logged in');
        res.redirect('/home');
      }).catch(function(user){
        res.render()
      })
  });

  /* ******** LOG OUT ******** */
  // log user out
  app.post('/users/logout', function(req, res) {
    console.log(req.session.who.username + ' has logged out');
    req.session.destroy;
    res.redirect('/');
  });

};

module.exports = createRoutes;
