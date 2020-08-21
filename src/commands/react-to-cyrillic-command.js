module.exports = {

    name: 'React to mentioning',

    shouldHandle: function(message, client) {
        // Check if the bot's user was tagged in the message
        let messageContent = message.content;
        let cyrillicPattern = /[а-я]{2,}/;
        return messageContent.match(cyrillicPattern);
    },
    
    handle: function(message) {
        
        // send command to translator bot
        message.react("🇺🇸")
    },

};

