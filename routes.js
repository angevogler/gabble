const gabble = require('./gabble');

function createRoutes(app) {
  /* ******** HOME PAGES ******** */
  // original root
  app.get('/', function(req, res) {
    res.render('home', {
      loggedIn: false,
    });
  });

  // home page -- find all gabs
  app.get('/home', function(req, res) {
    if (req.session.who != null) {
      gabble.findAllGabs().then(function(messages) {
        gabble.findAllUsers().then(function(users) {
          console.log(messages);
          console.log(users);
          res.render('home', {
            users: users,
            messages: messages,
            loggedIn: true,
          });
        })
      })
    } else {
      res.redirect('/');
    }
  });

  app.post('/messages/refresh', function(req, res) {
    res.redirect('/home');
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

  /* ******** WRITE NEW MESSAGE ******** */
  // load new message form
  app.get('/messages/new', function(req, res) {
    if (req.session.who != null) {
      res.render('new_gab');
    } else {
      res.redirect('/');
    }
  });

  // create new message
  app.post('/messages/new', function(req, res) {
    if (req.session.who != null) {
      gabble.writeMessage(req.session.who.id, req.body.newgab)
        .then(function(message) {
          console.log(req.session.who.username + ' posted a new gab');
          res.redirect('/home');
        })
    } else {
      res.redirect('/');
    };
  });

};

module.exports = createRoutes;
