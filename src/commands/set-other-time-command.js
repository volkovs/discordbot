const settingsService = require("../services/settings-service");
const timeService = require('../services/time-service');
const clientService = require('../services/client-service');

const botName = "@PutlerBot";
const adminRole = 'Family Lead';

const fullExample = `${botName} please set @Putler reward time`;
const shortExample = `${botName} set @Putler time`;

let setOtherTimePattern = /.+\s+set.+<@!*(.+)>.+time.+GMT\s*\+*(-*\d+)/i;

module.exports = {
  name: "Set someone else reward time",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;
    let botId = client.user.id;
    let botReferencePattern = `^<@!*${botId}>`;

    return (
      messageContent.match(botReferencePattern) &&
      messageContent.match(setOtherTimePattern)
    );
  },

  handle: function (message, client) {

    let messageContent = message.content;
    let match = messageContent.match(setOtherTimePattern);
    let userId = match[1];
    let gmtShift = parseInt(match[2]);

    let user = clientService.findUser(userId)
    let username = user.username;

    // do not ask for permission if target user is you
    let targetUserIsAuthor = message.author.id == userId;
    let hasPermission = clientService.userHasRole(message.author.id, adminRole) || message.author.username === 'Путлер';
    if (!targetUserIsAuthor && !hasPermission) {
      message.channel.send(`You don't have permissions (role \`${adminRole}\`)`);
      return;
    }

    settingsService.setUserTime(user, gmtShift);

    message.channel.send(`User ${message.author.username} set time for ${username} to GMT${gmtShift}`);
  },

  hint: function() {
    return hinter(fullExample, shortExample);
  },
};

function hinter(fullExample, shortExample) {
  return `To set someone else reward time try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}
