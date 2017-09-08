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
        // display number of likes
        let promises = [];

        for (let i = 0; i < messages.length; i++) {
          if (req.session.who.id === messages[i].user.id) {
            messages[i].author = true;
          } else{
            messages[i].author = false;
          }
          // display # of likes
          const likeProm = gabble.findLikes(messages[i].id).then(function (num) {
            messages[i].likes = num; // update each message with number of likes
          });

          const hasLikedProm = gabble.hasUserLiked(req.session.who.id, messages[i].id).then(function (hasLiked) {
            messages[i].liked = hasLiked;
          })

          promises.push(likeProm);
          promises.push(hasLikedProm);
        }

        Promise.all(promises).then(function () {
          res.render('home', {
            messages: messages,
            loggedIn: true,
          });
        })
      })
    } else {
      res.redirect('/');
    }
  });

  // refresh all messages
  app.post('/messages/refresh', function(req, res) {
    res.redirect('/home');
  });

  // delete message
  app.post('/messages/:messageId/delete', function(req, res) {
    const messageId = parseInt(req.params.messageId);
    console.log(messageId);

    gabble.findMessageId(messageId).then(function(messages) {
      console.log(messages.user);
      if (req.session.who.id === messages.user.id) {
        console.log('before');
        gabble.deleteMessage(messageId).then(function() {
          console.log('hi');
          res.redirect('/home');
        })
      };
    });
  });

  /* ******** CREATE NEW USER ******** */
  // load form to create user
  app.get('/users/new', function(req, res) {
    res.render('new_user');
  });

  // create user
  app.post('/users/new', function(req, res) {
    if ((req.body.name.length !== 0) && (req.body.username.length !== 0) && (req.body.password.length !== 0)) {
      gabble.createUser(req.body.name, req.body.username, req.body.password)
        .then(function(user){
          req.session.who = user;
          console.log(req.session.who.username + ' has registered');
          res.redirect('/home');
        })
    } else {
        console.log('user not created');
        res.render('new_user', {
          error: true,
        });
    }
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

  /* ******** LIKES ******** */
  // create new like on home page
  app.post('/likes/:messageId', function(req, res) {
    const messageId = parseInt(req.params.messageId);
    // if the current user has not already liked the message
    gabble.hasUserLiked(req.session.who.id, messageId)
      .then(function (hasLiked) {
          if (hasLiked) {
            res.redirect('/home');
          } else {
            gabble.createLike(req.session.who.id, messageId)
              .then(function(like) {
                res.redirect('/home');
              }).catch(function(like) {
                res.send('error');
              });
          }
      });
  });

  // create new like when viewing message
  app.post('/likes/:messageId/message', function(req, res) {
    const messageId = parseInt(req.params.messageId);
    // if the current user has not already liked the message
    gabble.hasUserLiked(req.session.who.id, messageId)
      .then(function (hasLiked) {
          if (hasLiked) {
            res.redirect('/messages/:messageId/view');
          } else {
            gabble.createLike(req.session.who.id, messageId)
              .then(function(like) {
                res.redirect('/messages/:messageId/view');
              }).catch(function(like) {
                res.send('error');
              });
          }
      });
  });

  // delete like when user unlikes message on home page
  app.post('/likes/:messageId/delete', function(req, res) {
    const messageId = parseInt(req.params.messageId);
    // if the current user has not already liked the message
    gabble.hasUserLiked(req.session.who.id, messageId)
      .then(function (hasLiked) {
        gabble.unlike(req.session.who.id, messageId)
          .then(function(like) {
          if (hasLiked) {
            res.redirect('/home');
          } else {
              res.redirect('/home');
              }
          })
      });
  });

  // delete like when user unlikes message when viewing message
  app.post('/likes/:messageId/delete/message', function(req, res) {
    const messageId = parseInt(req.params.messageId);
    // if the current user has not already liked the message
    gabble.hasUserLiked(req.session.who.id, messageId)
      .then(function (hasLiked) {
        gabble.unlike(req.session.who.id, messageId)
          .then(function(like) {
          if (hasLiked) {
            res.redirect('/messages/:messageId/view');
          } else {
              res.redirect('/messages/:messageId/view');
              }
          })
      });
  });

  /* ******** VIEW MESSAGE ******** */
  app.get('/messages/:messageId/view', function (req, res) {
    const messageId = parseInt(req.params.messageId);

    // gabble.likedBy(messageId).then(function(likes) {
    //   console.log(likes[0].);
    // });

    if (req.session.who != null) {
      gabble.findMessageId(messageId).then(function(messages) {
        // gabble.likedBy(messages.id);
        let promises = [];

          // display delete button
          if (req.session.who.id === messages.user.id) {
            messages.author = true;
          } else{
            messages.author = false;
          }
          // display # of likes
          const likeProm = gabble.findLikes(messages.id).then(function (num) {
            messages.likes = num; // update each message with number of likes
          });

          const hasLikedProm = gabble.hasUserLiked(req.session.who.id, messages.id).then(function (hasLiked) {
            messages.liked = hasLiked;
          })

          const likedByProm = gabble.likedBy(messages.id).then(function (who) {
            messages.likedBy = who;
            console.log(who);
          })

          promises.push(likeProm);
          promises.push(hasLikedProm);
          promises.push(likedByProm);

        Promise.all(promises).then(function () {
          console.log('success');
          res.render('view_message', {
            messages: messages,
          });
        })
      })
    } else {
      res.redirect('/');
    }
  });

};

module.exports = createRoutes;
