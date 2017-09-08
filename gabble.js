/* ******** DATABASE STUFF ******** */
const Sequelize = require('sequelize');

// create new database
const db = new Sequelize ('gabble', 'angelavogler', '', {
  dialect: 'postgres',
});

// create user schema
const Users = db.define('user', {
    name: { type: Sequelize.STRING(25), allowNull: false },
    username: { type: Sequelize.STRING(25), allowNull: false, unique: true },
    password: { type: Sequelize.STRING(25), allowNull: false },
});

// create messages schema
const Messages = db.define('messages', {
  message: { type: Sequelize.STRING(140), allowNull: false },
});

// create likes schema
const Likes = db.define('likes', {
});

// connect likes schema to users and messages
Likes.belongsTo(Users);
Likes.belongsTo(Messages);

// connect messages schema to users
Messages.belongsTo(Users);

// sync user schema
Users.sync().then(function () {
    console.log('users syncd');
});

// sync messages schemas
Messages.sync().then(function() {
  console.log('messages syncd');
});

// sync likes schema
Likes.sync().then(function(){
  console.log('likes syncd');
});

/* ******** FUNCTIONS ******** */

// register new user
function createUser(name, username, password) {
  return Users.create({
    name: name,
    username: username,
    password: password,
  });
};

// log user in
function loginUser(username, password) {
  return Users.find({
    where: {
      username: username,
      password: password,
    }
  });
};

// find user by id
function findUserId(id) {
  return Users.find({
    where: {
      id: id,
    }
  }).then(function(result) {
    if (result === null) {
      return Promise.reject();
    } else {
      return result;
    }
  });
};

// write new message
function writeMessage(userId, message) {
  return findUserId(userId).then(function(user) {
    return Messages.create({
      userId: userId,
      message: message,
    }).then(function() {
      return findUserId(userId);
    });
  });
};


// find all gabs with their correct display name
function findAllGabs() {
  return Messages.findAll({
    include: [
      {
        model: Users,
      }
    ],
    order: [
      ['createdAt', 'DESC']
    ]
  })
};

// find message by id
function findMessageId(id) {
  return Messages.find({
    where: {
      id: id,
    }
  }).then(function(result) {
    if (result === null) {
      return Promise.reject();
    } else {
      return result;
    }
  });
};

// create like
function createLike(userId, messageId){
  return findUserId(userId).then(function(user) {
    return findMessageId(messageId).then(function(message) {
      return Likes.create({
        userId: userId,
        messageId: messageId,
      }).then(function() {
        return findMessageId(messageId).then(function() {
          return findUserId(userId);
        })
      })
    })
  })
};

// get the number of likes associated with a message
function findLikes(messageId) {
  return Likes.findAll({
    where: {
      messageId: messageId,
    }
  }).then(function(likes) {
    return likes.length;
  });
};

// has user liked the message
function hasUserLiked(userId, messageId) {
  return Likes.find({
    where: {
      userId: userId,
      messageId: messageId,
    }
  }).then(function(liked) {
    if (liked !== null ) {
      return true;
    } else {
      return false;
    }
  })
};

// delete like
function unlike(userId, messageId) {
  return findUserId(userId).then(function(user) {
    return findMessageId(messageId).then(function(message) {
      return Likes.destroy({
        where: {
          userId: userId,
          messageId: messageId,
        }
      }).then(function() {
        return findMessageId(messageId).then(function() {
          return findUserId(userId);
        })
      })
    })
  })
};

/* ******** EXPORT ******** */
module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  findUserId: findUserId,
  writeMessage: writeMessage,
  findAllGabs: findAllGabs,
  findMessageId: findMessageId,
  createLike: createLike,
  findLikes: findLikes,
  hasUserLiked: hasUserLiked,
  unlike: unlike,
};
