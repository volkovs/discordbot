const settings = require('../services/settings-service');

const botName = '@PutlerBot';
const fullExample = `${botName} please set my reward time to GMT -5`;
const shortExample = `${botName} set time GMT+8`;

let setTimeIntentPattern = /.+set.+time/
let setTimePattern = /.+set.+time.+GMT\s*\+*(-*\d+)/;

module.exports = {

    name: 'Set reward time',

    shouldHandle: function(message, client) {
        let messageContent = message.content;
        let botId = client.user.id;
        let botReference = `<@!${botId}>`;
        return messageContent.startsWith(botReference)
            && messageContent.match(setTimeIntentPattern);
    },
    
    handle: function(message) {
        let messageContent = message.content;
        let gmt = messageContent.match(setTimePattern);
        if (gmt) {
            let userId = message.author.id;
            let username = message.author.username;
            let gmtShift = parseInt(gmt[1]);
            message.channel.send('User ' + username + ' ' + userId + ' has GMT' + gmtShift);

            settings.setUserTime(message.author, gmtShift);
        } else {
            message.reply(hint());
        }
        
    },

    hint: function() {
        return hinter(fullExample, shortExample);
    },

};

function hinter(fullExample, shortExample) {
    return `To set your reward time try:\n    \`${fullExample}\`\n    \`${shortExample}\``;
}