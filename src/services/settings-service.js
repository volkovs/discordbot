module.exports = {

    setUserTime: function(user, gmt) {
        let userId = user.id;
        let userName = user.username;
        settings[userId] = gmt;
        userNames[userId] = userName;
        gmts[gmt] = {userId, userName};
    },

    getUserTime: function(userId) {
        return settings[userId];
    },

    getUserName: function(userId) {
        return userNames[userId];
    },

    getUsersFor(gmt) {
        return gmts[gmt];
    },

}

const settings = {};
const userNames = {};
const gmts = {};