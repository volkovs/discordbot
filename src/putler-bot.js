const Discord = require('discord.js');
const client = new Discord.Client();
const settingsService = require('./services/settings-service');

const avatarCommand = require('./commands/avatar-command');
const embedCommand = require('./commands/embed-command');
const reactCommand = require('./commands/react-command');
const setTimeCommand = require('./commands/set-time-command');
const getMyTimeCommand = require('./commands/get-my-time-command');
const getOtherTimeCommand = require('./commands/get-other-time-command');

let messageHandlers = {
    'timezone-rewards': [avatarCommand, embedCommand, setTimeCommand, getMyTimeCommand, getOtherTimeCommand],
    'open-chat-and-recruitment': [],
    '*': [reactCommand],
};

client.on('ready', () => {
    setUp();
})

client.on('guildMemberAdd', member => {
    let channel = findChannelIn('general', member.guild);
    if (!channel) {
        return;
    }
    
    channel.send(`Welcome to the server, ${member}`);
    // channel.send("Please visit channel '" + rewardChannelName + 
    // "' and specify your reward time, e.g. by starting with `!reward help`")
  });

client.on('message', message => {
    onMessage(message);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
    onMessage(newMessage);
});

function onMessage(message) {

    // ignore bot messages
    if (message.author.bot) {
        return;
    }

    let channelName = message.channel.name;

    let messageHandled = false;
    Object.keys(messageHandlers).forEach(key => {
        if (key === channelName) {
            messageHandled = handleOnDemand(message, messageHandlers[key]);
        }
    });

    if (!messageHandled) {
        messageHandled = handleOnDemand(message, messageHandlers['*']);
    }

  }

  function handleOnDemand(message, messageHandlers) {
    let messageHandled = false;
    messageHandlers.forEach(messageHandler => {
        let shouldHandle = false;
        try {
            console.log(`Should handle '${messageHandler.name}'?`);
            shouldHandle = messageHandler.shouldHandle(message, client);
            console.log(shouldHandle);
        } catch (error) {
            console.log(`Error deciding if message '${message.content}' should be handled by '${messageHandler.name}'`, error);
            return;
        }
        if (shouldHandle) {
            try {
                console.log(`Handler '${messageHandler.name}'?`);
                messageHandler.handle(message, client);
                messageHandled = true;
                console.log('Handled');
            } catch(error) {
                console.log(`Error handling message '${message.content}' by '${messageHandler.name}'`, error);
                return;
            }
        };
    });
    return messageHandled;
  }

bot_token = process.env.BOT_TOKEN
if (!bot_token) {
    console.log('Bot token is NOT defined - please cpecify "bot_token=... npm run dev"')
    return
} else {
    console.log('Bot token is defined - OK')
}

function findChannelIn(channelName, guild) {
    return guild.channels.cache.find(ch => ch.name === channelName);
}

function setUp() {
    settingsService.init();
    client.user.setActivity('with human beings');

    console.log("Servers:");
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name);

        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`);
        });
    });

    // rewardChannelIds.forEach(channelId => {
        // var rewardChannel = client.channels.cache.get(channelId)
        // rewardChannel.send("Hello everybody! How are you doing this fine evening?")
        // rewardChannel.send({files: ['https://www.devdungeon.com/sites/all/themes/devdungeon2/logo.png']})
    // })
}

client.login(bot_token)