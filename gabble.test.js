/* ******** CONGIFURE ******** */
const gabble = require('./gabble');

test('find user by username and password', function() {
  return gabble.loginUser('ange.vogler', 'tucker').then(function(user) {
    expect(user.name).toBe('Ange');
  });
});

test('find user by id', function() {
  return gabble.findUserId(2).then(function(user) {
    expect(user.name).toBe('Ange');
  });
});
