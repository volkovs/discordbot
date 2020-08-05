const Discord = require('discord.js')
const client = new Discord.Client()

const rewardChannelName = 'timezone-rewards';
var rewardChannelIds = [];

client.on('ready', () => {

    console.log("Connected as " + client.user.tag)

    client.user.setActivity('with human beings')

    console.log("Servers:")
    client.guilds.cache.forEach((guild) => {
        console.log(" - " + guild.name)

        // List all channels
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
            if (channel.name === rewardChannelName) {
                console.log('Identified Reward Time channel');
                rewardChannelIds.push(channel.id);
            }
        })
    })

    console.log('Will send reward time to following channels: ', rewardChannelIds)

    rewardChannelIds.forEach(channelId => {
        var rewardChannel = client.channels.cache.get(channelId)
        rewardChannel.send("Hello everybody! How are you doing this fine evening?")

        rewardChannel.send({files: ['https://www.devdungeon.com/sites/all/themes/devdungeon2/logo.png']})
    })
})

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general')
    if (!channel) {
        return
    }
    
    channel.send(`Welcome to the server, ${member}`);
    channel.send("Please visit channel '" + rewardChannelName + 
    "' and specify your reward time, e.g. by starting with `!reward help`")
  });

client.on('message', message => {
    onMessage(message)
})

client.on('messageUpdate', (oldMessage, newMessage) => {
    onMessage(newMessage)
})

function onMessage(message) {

    console.log('Message on ', message.channel.name, ' from ', message.author.toString());

    // listen to only specific channel ?
    if (message.channel.name != rewardChannelName) {
        return;
    }

    // ignore bot messages
    if (message.author.bot) {
        return;
    }

    // command 'what is my avatar'
    if (message.content.includes('what is my avatar')) {
      message.reply(message.author.displayAvatarURL());
    }

    if (message.content.includes('how to embed')) {
        // We can create embeds using the MessageEmbed constructor
        // Read more about all that you can do with the constructor
        // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
        const embed = new Discord.MessageEmbed()
          // Set the title of the field
          .setTitle('A slick little embed')
          // Set the color of the embed
          .setColor(0xff0000)
          // Set the main content of the embed
          .setDescription('Hello, this is a slick embed!');
        // Send the embed to the same channel as the message
        message.channel.send(embed);
    }

    if (message.content.startsWith("!")) {
        processCommand(message)
        return
    }

    // Check if the bot's user was tagged in the message
    if (message.content.includes(client.user.id)) {
        // Send acknowledgement message
        if (message.content.endsWith('?')) {
            message.reply('did you want something?')
        } else {
            message.react("👍")
        }
    }

  }

  function processCommand(message) {

    console.log('Message received: ', message.content)

    let fullCommand = message.content.substr(1) 
    let splitCommand = fullCommand.split(" ")
    if (fullCommand.length < 1) {
        return;
    }
    let primaryCommand = splitCommand[0]
    let arguments = splitCommand.slice(1)

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments)

    if (primaryCommand == "help") {
        helpCommand(arguments, message)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, message)
    } else if (message.content.includes(client.user.id)) {
        message.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

// setInterval(() => {
//     let channel = client.channels.cache.find(ch => ch.name === rewardChannelName)
//     if (channel) {
//         channel.send('Opa: ' + new Date());
//     }
// }, 5000)

bot_token = process.env.BOT_TOKEN
if (!bot_token) {
    console.log('Bot token is NOT defined - please cpecify "bot_token=... npm run dev"')
    return
} else {
    console.log('Bot token is defined - OK')
}

client.login(bot_token)