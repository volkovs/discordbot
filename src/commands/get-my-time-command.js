const settings = require("../services/settings-service");
const timeService = require('../services/time-service');
const setTimeCommand = require("./set-time-command.js");

const botName = "@PutlerBot";
const fullExample = `${botName} what is my reward time?`;
const shortExample = `${botName} get time`;

let getMyTimePattern = /.+(?:what is|when is|get)(?:\s+my)*(?:\s+reward)*\s+time/i;

module.exports = {
  name: "Show my reward time",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;

    // TODO: remove most console.logs
    console.log('Incoming message:', messageContent);

    let botId = client.user.id;
    let botReferencePattern = `^<@!*${botId}>`;
    return (
      messageContent.match(botReferencePattern) &&
      messageContent.match(getMyTimePattern)
    );
  },

  handle: function (message) {
    let userId = message.author.id;
    let username = message.author.username;

    let gmtShift = settings.getUserTime(userId);
    if (gmtShift != undefined) {
      let currentTime = timeService.getCurrentTimeInZone(parseInt(gmtShift));
      let inHours = (20 + 24 - currentTime.hours - 1) % 24;
      let inMinutes = 60 - currentTime.minutes;
      message.channel.send(
        `You have GMT${gmtShift}. Your reward is in ${inHours} hours and ${inMinutes} minutes.`
      );
    } else {
      message.channel.send(
        "You didn't define your reward time. " + setTimeCommand.hint()
      );
    }
  },

  hint: function() {
    return hinter(fullExample, shortExample);
  },
};

function hinter(fullExample, shortExample) {
  return `To get your reward time try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}
