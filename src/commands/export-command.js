const settingsService = require("../services/settings-service");
const timeService = require('../services/time-service');
const clientService = require('../services/client-service');

const botName = "@PutlerBot";
const adminRole = 'WD Leader';

const fullExample = `${botName} please export all users`;
const shortExample = `${botName} export`;

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
