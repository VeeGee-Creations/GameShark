require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');

(function GameShark() {
    const client = new Discord.Client();
    const { TOKEN, prefix } = process.env;

    client.commands = new Discord.Collection();

    const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        
        client.commands.set(command.name, command);
    }

    client.once('ready', ()=> {
        console.log('GameShark is online!');
    });

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift().toLocaleLowerCase();

        switch (command) {
            case 'ping':
                client.commands.get('ping').execute(message, args);
                break;
            case 'epic':
                client.commands.get('epic').execute(message, args, Discord);
                break;
            default:
                break;
        }
        return;
    });





    client.login(TOKEN);
})();