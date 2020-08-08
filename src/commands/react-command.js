module.exports = {

    name: 'React to mentioning',

    shouldHandle: function(message, client) {
        // Check if the bot's user was tagged in the message
        let messageContent = message.content;
        let botId = client.user.id;
        let botReference = `<@!${botId}>`;
        return messageContent.includes(botId) && !messageContent.startsWith(botReference);
    },
    
    handle: function(message) {
        
        // Send acknowledgement message
        if (message.content.endsWith('?')) {
            message.reply('did you want something?')
        } else {
            message.react("👍")
        }
    },

};

