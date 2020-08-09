const settingsService = require("./settings-service");

module.exports = {
  getCurrentTimeInGmt: function () {
    return new Date();
  },

  getCurrentTimeInZone: function (gmtShift) {
    let now = new Date();
    return {
      hours: (now.getUTCHours() + 24 + gmtShift) % 24,
      minutes: now.getUTCMinutes(),
    };
  },

  getUsersHavingHours: function (hours) {
    let usersHavingGivenHours = [];
    let users = settingsService.getAllUsers();
    users.forEach((user) => {
      if (this.getCurrentTimeInZone(user.gmt).hours === hours) {
        usersHavingGivenHours.push(user);
      }
    });
    return usersHavingGivenHours;
  },

  getGmtShift(localHours) {
    let now = new Date();
    return localHours - now.getUTCHours();
  },

};
