const setTimeCommand = require("./set-time-command");
const getMyTimeCommand = require("./get-my-time-command");
const getOtherTimeCommand = require("./get-other-time-command");

const botName = "@PutlerBot";
const fullExample = `${botName} please help`;
const shortExample = `${botName} help`;

let helpPattern = /<@!*.+>\s+(?:please\s+)*help/i;

module.exports = {
  name: "Help",

  shouldHandle: function (message, client) {
    // Check if the bot's user was tagged in the message
    let messageContent = message.content;
    let botId = client.user.id;
    let botReferencePattern = `^<@!*${botId}>`;
    return (
      messageContent.match(botReferencePattern) &&
      messageContent.match(helpPattern)
    );
  },

  handle: function (message) {
    message.channel.send(setTimeCommand.hint());
    message.channel.send(getMyTimeCommand.hint());
    message.channel.send(getOtherTimeCommand.hint());
  },
};

function hint(fullExample, shortExample) {
  return `To get help try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}
