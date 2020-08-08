const botName = '@PutlerBot'
const fullExample = `${botName} please set my reward time to GMT -5`;
const shortExample = `${botName} set time GMT+8`;

module.exports = {

    name: 'Reward time settings',

    shouldHandle: function(message, client) {
        // Check if the bot's user was tagged in the message
        let messageContent = message.content;
        let botId = client.user.id;
        let botReference = `<@!${botId}>`;
        return messageContent.startsWith(botReference)
            && messageContent.includes('set')
            && messageContent.includes('time');
    },
    
    handle: function(message) {

        let messageContent = message.content;

        let setTimeIntentPattern = /.+set.+time/
        let setTimePattern = /.+set.+time.+GMT\s*\+*(-*\d+)/;

        if (messageContent.match(setTimeIntentPattern)) {
            let gmt = messageContent.match(setTimePattern)
            if (gmt) {
                // TODO: save setting for current user
                let userId = message.author.id;
                let username = message.author.username;
                message.channel.send('User ' + username + ' ' + userId + ' has GMT' + gmt[1]);
            } else {
                message.reply(hint(fullExample, shortExample));
            }
        }
        
    },

};

function hint(fullExample, shortExample) {
    return `I didn't get it. Please try:\n\`${fullExample}\`\n or just \n\`${shortExample}\``;
}