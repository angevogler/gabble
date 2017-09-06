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


/* ******** EXPORT ******** */
module.exports = {
  createUser: createUser,
  loginUser: loginUser,
};
