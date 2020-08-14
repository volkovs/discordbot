const settingsService = require("../services/settings-service");
const timeService = require('../services/time-service');

const botName = "@PutlerBot";

const fullExample = `${botName} please set @Putler reward time`;
const shortExample = `${botName} set @Putler time`;

let setOtherTimePattern = /.+set.+<@!*(.+)>.+time.+GMT\s*\+*(-*\d+)/i;

module.exports = {
  name: "Show someone else reward time",

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
    
    let user = findUser(client, userId)
    let username = user.username;
    
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

function findUser(client, userId) {

  // console.log('Looking for user: ', userId);
  let result = undefined;

  client.guilds.cache.forEach((guild) => {
    guild.members.cache.forEach((member) => {

      // console.log('Met user: ', member.user.id)
      if (member.user.id === userId) {
        result = member.user;
      }
    });
  });
  return result;
}
