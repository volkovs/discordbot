let client = undefined;

module.exports = {
  init: function (clientArg) {
    client = clientArg;
  },
  findUser: function (userId) {
    let result = undefined;

    client.guilds.cache.forEach((guild) => {
      guild.members.cache.forEach((member) => {
        if (member.user.id === userId) {
          result = member.user;
        }
      });
    });
    return result;
  },
  userHasRole: function (userId, roleName) {
    let result = false;

    client.guilds.cache.forEach((guild) => {
      guild.roles.cache.forEach((role) => {
        if (role.name === roleName)
          role.members.forEach((member) => {
            if (member.user.id === userId) {
              result = true;
            }
          });
      });
    });
    return result;
  },
};
