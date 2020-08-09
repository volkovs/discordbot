const timeService = require("./time-service");

const notificationTimeHours = 19;

module.exports = {
  init: function (channels) {
    setInterval(() => scheduleRewardTime(channels), 1000 * 60);
  },
};

let lastSchedulerHours;

function scheduleRewardTime(channels) {
  let now = new Date();
  let hours = now.getUTCHours();

  // show once an hour most (preferably in the hour beginning)
  if (hours === lastSchedulerHours) {
    return;
  }
  lastSchedulerHours = hours;

  // do not spam if there is no users affected
  let users = timeService.getUsersHavingHours(notificationTimeHours);
  if (!users || users.length === 0) {
    return;
  }

  let currentGmtShift = timeService.getGmtShift(notificationTimeHours);
  let message = `GMT${currentGmtShift}: These Players have reward in the next hour:\n`;
  users.forEach((user) => {
    message += ` - ${user.userName}\n`;
  });

  channels.forEach((channel) => {
    channel.send(message);
  });

  console.log(
    `Current hours is ${hours}. These Players have awards in the next hour: ${JSON.stringify(
      users
    )}`
  );
}
