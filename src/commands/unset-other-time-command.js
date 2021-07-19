const settingsService = require("../services/settings-service");
const timeService = require('../services/time-service');
const clientService = require('../services/client-service');

const botName = "@PutlerBot";
const adminRole = 'Family Lead';

const fullExample = `${botName} please reset @Putler reward time`;
const shortExample = `${botName} unset \`@ExPlayer\` time`;

let unsetOtherTimePattern = /.+(?:un|re)set.+<@!*(.+)>.+time.*/i;

module.exports = {
  name: "Clear someone else reward time",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;
    let botId = client.user.id;
    let botReferencePattern = `^<@!*${botId}>`;

    return (
      messageContent.match(botReferencePattern) &&
      messageContent.match(unsetOtherTimePattern)
    );
  },

  handle: function (message, client) {
    let hasPermission = clientService.userHasRole(message.author.id, adminRole);
    if (!hasPermission) {
      message.channel.send(`You don't have permissions (role \`${adminRole}\`)`);
      return;
    }

    let messageContent = message.content;
    let match = messageContent.match(unsetOtherTimePattern);
    let userId = match[1];

    let user = clientService.findUser(userId)
    let username = user.username;

    settingsService.unsetUserTime(user);

    message.channel.send(`User ${message.author.username} cleared time for ${username}`);
  },

  hint: function() {
    return hinter(fullExample, shortExample);
  },
};

function hinter(fullExample, shortExample) {
  return `To unset someone else reward time try:\n    \`\`${fullExample}\`\`\n    \`\`${shortExample}\`\``;
}
