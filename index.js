```javascript
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const client = new Client({
intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
console.log('Bot est connecté!');
});

client.login(process.env.DISCORD_TOKEN);
```
