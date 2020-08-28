const setTimeCommand = require("./set-time-command");
const getMyTimeCommand = require("./get-my-time-command");
const getOtherTimeCommand = require("./get-other-time-command");
const setOtherTimeCommand = require("./set-other-time-command");
const unsetOtherTimeCommand = require("./unset-other-time-command");
const exportCommand = require("./export-command");
const clientService = require("../services/client-service");

const botName = "@PutlerBot";
const adminRole = 'WD Leader';
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

    if (clientService.userHasRole(message.author.id, adminRole)) {
      message.channel.send(setOtherTimeCommand.hint());
      message.channel.send(unsetOtherTimeCommand.hint());
      message.channel.send(exportCommand.hint());
    }
  },
};

function hint(fullExample, shortExample) {
  return `To get help try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}
