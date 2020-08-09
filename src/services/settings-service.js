const fs = require('fs');

const userSettingsFile = './user-settings.json';

module.exports = {

    init: function() {
        if (fs.existsSync(userSettingsFile)) {
            console.log('Reading user settings from file system');
            let userSettingsString = fs.readFileSync(userSettingsFile);
            userSettings = JSON.parse(userSettingsString);
            console.log('User settings successfully initialized', userSettings);
        } else {
            console.log('User settings not found on file system', userSettingsFile);
        }
    },

    setUserTime: function(user, gmt) {
        let userId = user.id;
        let userName = user.username;

        // remove from previous GMT key if any
        let existingGmt = userSettings.gmts[userId];
        if (existingGmt) {
            let users = userSettings.gmtUsers[existingGmt];
            userSettings.gmtUsers[existingGmt] = users.filter(user => user.userId !== userId);
        }

        userSettings.gmts[userId] = gmt;
        userSettings.userNames[userId] = userName;

        theGmtUsers = (userSettings.gmtUsers[gmt] || []);
        theGmtUsers.push({userId, userName});
        userSettings.gmtUsers[gmt] = theGmtUsers;

        console.log(JSON.stringify(userSettings));

        fs.writeFileSync(userSettingsFile, JSON.stringify(userSettings));
    },

    // -5
    getUserTime: function(userId) {
        return userSettings.gmts[userId];
    },

    // userName
    getUserName: function(userId) {
        return userSettings.userNames[userId];
    },

    // [{userId, userName}]
    getUsersFor(gmt) {
        return userSettings.gmtUsers[gmt];
    },

}

let userSettings = {

    // {'123456790': 5}
    gmts: {},

    // {'123456789': 'userName'}
    userNames: {},

    // {5: [{userId, userName}]}
    gmtUsers: {}
};