const settings = require("../services/settings-service");
const settingsService = require("../services/settings-service");

const botName = "@PutlerBot";

const fullExample = `${botName} what is @Putler reward time?`;
const shortExample = `${botName} get @Putler time`;

let getOtherTimePattern = /.+(?:what is|when is|get) <@!(.+)>(?: reward)*\s+time/i;

module.exports = {
  name: "Show someone else reward time",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;
    let botId = client.user.id;
    let botReference = `<@!${botId}>`;
    return (
      messageContent.startsWith(botReference) &&
      messageContent.match(getOtherTimePattern)
    );
  },

  handle: function (message) {
    let messageContent = message.content;

    let userId = messageContent.match(getOtherTimePattern)[1];

    let gmtShift = settingsService.getUserTime(userId);
    let username = settingsService.getUserName(userId);

    if (gmtShift != undefined) {
      message.channel.send(
        "User " + username + " " + userId + " has GMT" + gmtShift + '.'
      );
    } else {
      message.channel.send(
        "User <@!" + userId + "> hasn't defined her reward time."
      );
    }
  },
  hint: function() {
    return hinter(fullExample, shortExample);
  },
};

function hinter(fullExample, shortExample) {
  return `To get someone else reward time try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}
