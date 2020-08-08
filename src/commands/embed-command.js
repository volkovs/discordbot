const Discord = require('discord.js');

module.exports = {

    name: 'Embed example',

    shouldHandle: function(message) {
        return message.content.toLowerCase().includes('how to embed');
    },
    
    handle: function(message) {
        
        // Read more https://discord.js.org/#/docs/main/master/class/MessageEmbed
        const embed = new Discord.MessageEmbed()
            // Set the title of the field
            .setTitle('A slick little embed')
            // Set the color of the embed
            .setColor(0xff0000)
            // Set the main content of the embed
            .setDescription('Hello, this is a slick embed!');
        message.channel.send(embed);
    },

};

