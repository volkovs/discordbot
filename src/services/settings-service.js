const fs = require("fs");

const userSettingsFile = 'user-settings.json';
let userSettingsPath = './';

module.exports = {

  setUserTime: function (user, gmt) {
    let userId = user.id;
    let userName = user.username;

    // remove from previous GMT key if any
    let existingGmt = userSettings.gmts[userId];
    if (existingGmt) {
      let users = userSettings.gmtUsers[existingGmt];
      userSettings.gmtUsers[existingGmt] = users.filter(
        (user) => user.userId !== userId
      );
    }

    userSettings.gmts[userId] = gmt;
    userSettings.userNames[userId] = userName;

    theGmtUsers = userSettings.gmtUsers[gmt] || [];
    theGmtUsers.push({ userId, userName });
    userSettings.gmtUsers[gmt] = theGmtUsers;

    console.log(JSON.stringify(userSettings));

    fs.writeFileSync(userSettingsPath, JSON.stringify(userSettings));
  },

  // -5
  getUserTime: function (userId) {
    return userSettings.gmts[userId];
  },

  // userName
  getUserName: function (userId) {
    return userSettings.userNames[userId];
  },

  // [{userId, userName}]
  getUsersFor(gmt) {
    return userSettings.gmtUsers[gmt];
  },

  getAllUsers() {
    let allUsers = [];
    Object.keys(userSettings.gmts).forEach(userId => {
      let userName = userSettings.userNames[userId];
      let gmt = userSettings.gmts[userId];
      allUsers.push({userId, userName, gmt});
    });
    return allUsers;
  },

  init: function () {
    let storagePath = process.env.BOT_STORAGE_PATH;
    if (!storagePath) {
        let errorMessage = 'Bot storage path is NOT defined - please cpecify "BOT_STORAGE_PATH=... npm run dev"';
      console.log(errorMessage);
      throw errorMessage;
    } else {
      console.log("Bot storage is defined - OK");
    }

    userSettingsPath = storagePath + userSettingsFile;
    if (fs.existsSync(userSettingsPath)) {
      console.log("Reading user settings from file system");
      let userSettingsString = fs.readFileSync(userSettingsPath);
      userSettings = JSON.parse(userSettingsString);
      console.log("User settings successfully initialized", userSettings);
    } else {
      console.log("User settings not found on file system", userSettingsPath);
    }
  },
};

let userSettings = {
  // {'123456790': 5}
  gmts: {},

  // {'123456789': 'userName'}
  userNames: {},

  // {5: [{userId, userName}]}
  gmtUsers: {},
};
