const settingsService = require("../services/settings-service");
const timeService = require('../services/time-service');
const clientService = require('../services/client-service');

const botName = "@PutlerBot";
const adminRole = 'WD Leader';

const fullExample = `${botName} please export all users`;
const shortExample = `${botName} export sort by GMT`;

let exportPattern = /<@!*.+>\s+(?:please\s+)*export/i;

module.exports = {
  name: "Export every user time settings",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;
    let botId = client.user.id;
    let botReferencePattern = `^<@!*${botId}>`;
    return (
      messageContent.match(botReferencePattern) &&
      messageContent.match(exportPattern)
    );
  },

  handle: function (message) {
    let hasPermission = clientService.userHasRole(message.author.id, adminRole);
    if (!hasPermission) {
      message.channel.send(`You don't have permissions (role \`${adminRole}\`)`);
      return;
    }

    let msg = `User name : GMT:\n`;
    let allUsers = settingsService.getAllUsers();
    if (message.content.includes('GMT')) {
      allUsers.sort(compareByGmtAndUserName);
    } else {
      allUsers.sort(compareByUserName);
    }

    allUsers.forEach(user => {
      msg += `    - \`${user.userName}\` : \`GMT${user.gmt}\`\n`;
    })
    message.channel.send(msg);
  },

  hint: function() {
    return hinter(fullExample, shortExample);
  },
};

function hinter(fullExample, shortExample) {
  return `To export every user time settings:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}

function compareByUserName(user1, user2) {
  let userName1 = user1.userName.toLowerCase;
  let userName2 = user2.userName.toLowerCase;
  if ( userName1 < userName2 ){
    return -1;
  }
  if ( userName1 > userName2 ){
    return 1;
  }
  return 0;
}

function compareByGmtAndUserName(user1, user2) {
  if ( user1.gmt < user2.gmt ){
    return 1;
  }
  if ( user1.gmt > user2.gmt ){
    return -1;
  }
  return compareByUserName(user1, user2);
}
