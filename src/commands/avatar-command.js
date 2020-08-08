module.exports = {

    name: 'Avatar command example',

    shouldHandle: function(message) {
        return message.content.toLowerCase().includes('what is my avatar');
    },
    
    handle: function(message) {
        message.reply(message.author.displayAvatarURL());
    },

};

