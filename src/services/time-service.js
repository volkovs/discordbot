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

  log: function () {
    // console.log('Time service:');
    // console.log(this.getCurrentTimeInGmt());
    // console.log('UTC hours:', new Date().getUTCHours(), 'UTC minutes:', new Date().getUTCMinutes());
    console.log("GMT-23", JSON.stringify(this.getCurrentTimeInZone(-23)));
    console.log("GMT-22", JSON.stringify(this.getCurrentTimeInZone(-22)));
    console.log("GMT-21", JSON.stringify(this.getCurrentTimeInZone(-21)));
    console.log("GMT-20", JSON.stringify(this.getCurrentTimeInZone(-20)));
    console.log("GMT-2", JSON.stringify(this.getCurrentTimeInZone(-2)));
    console.log("GMT-1", JSON.stringify(this.getCurrentTimeInZone(-1)));
    console.log("GMT0", JSON.stringify(this.getCurrentTimeInZone(0)));
    console.log("GMT1", JSON.stringify(this.getCurrentTimeInZone(1)));
    console.log("GMT2", JSON.stringify(this.getCurrentTimeInZone(2)));
    console.log("GMT3", JSON.stringify(this.getCurrentTimeInZone(3)));
    console.log("GMT4", JSON.stringify(this.getCurrentTimeInZone(4)));
    console.log("GMT5", JSON.stringify(this.getCurrentTimeInZone(5)));
    console.log("GMT6", JSON.stringify(this.getCurrentTimeInZone(6)));

    console.log(
      "Users with hours 23",
      JSON.stringify(this.getUsersHavingHours(23))
    );

    console.log('Current GMT shift:', this.getGmtShift(19));
  },
};
