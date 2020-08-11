const timeService = require('./time-service');
const settingsService = require('./settings-service');

const notificationTimeHours = 19;

let lastSchedulerHours;

module.exports = {
  init: function (client) {
    lastSchedulerHours = settingsService.getLastHours();
    setInterval(() => scheduleRewardTime(client), 1000 * 60);
  },
};

function scheduleRewardTime(client) {
  let now = new Date();
  let hours = now.getUTCHours();

  // show once an hour most (preferably in the hour beginning)
  if (hours === lastSchedulerHours) {
    return;
  }
  lastSchedulerHours = hours;
  settingsService.setLastHours(lastSchedulerHours);

  // do not spam if there is no users affected
  let users = timeService.getUsersHavingHours(notificationTimeHours);
  if (!users || users.length === 0) {
    return;
  }

  let channels = findChannels("timezone-rewards", client);

  let currentGmtShift = timeService.getGmtShift(notificationTimeHours);
  let message = `GMT${currentGmtShift}: These Players have reward in the next hour:\n`;
  users.forEach((user) => {
    message += `     - ${user.userName}\n`;
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

function findChannelIn(channelName, guild) {
  return guild.channels.cache.find((ch) => ch.name === channelName);
}

function findChannels(channelName, client) {
  let channels = [];
  client.guilds.cache.forEach((guild) => {
    let channel = findChannelIn(channelName, guild);
    if (channel) {
      channels.push(channel);
    }
  });
  return channels;
}
