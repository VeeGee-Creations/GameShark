import searchCatalog from './searchCatalog.js';
import {} from 'dotenv/config';
import * as Discord from 'discord.js';

(function GameShark() {
    const client = new Discord.Client();
    const prefix = '!';

    client.once('ready', ()=> {
        console.log('GameShark is online!');
    });

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(' ');
        const command = args.shift().toLocaleLowerCase();

        switch (command) {
            case 'ping':
                message.channel.send('pong');
                break;
            default:
                break;
        }
        return;
    });
    searchCatalog();





    client.login(process.env.TOKEN);
})();