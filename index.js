```javascript
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const commands = [
new SlashCommandBuilder()
.setName('countdown')
.setDescription('Lance un countdown')
.addStringOption(option =>
option.setName('date')
.setDescription('Date et heure (YYYY-MM-DD HH:MM:SS)')
.setRequired(true))
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
try {
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
console.log('Commandes enregistrées!');
} catch (error) {
console.error(error);
}
})();

client.once('ready', () => {
console.log('Bot en ligne!');
});

client.on('interactionCreate', async interaction => {
if (!interaction.isChatInputCommand()) return;
if (interaction.commandName === 'countdown') {
const dateStr = interaction.options.getString('date');
const countdownTime = new Date(dateStr).getTime();

if (isNaN(countdownTime)) {
await interaction.reply('Format invalide! Utilise: YYYY-MM-DD HH:MM:SS');
return;
}

await interaction.reply(`⏳ Countdown lancé pour ${dateStr}`);

const interval = setInterval(async () => {
const now = new Date().getTime();
const diff = countdownTime - now;

if (diff <= 0) {
await interaction.editReply('🎉 C\'EST PARTI!');
clearInterval(interval);
return;
}

const hours = Math.floor(diff / 3600000);
const minutes = Math.floor((diff % 3600000) / 60000);
const seconds = Math.floor((diff % 60000) / 1000);

await interaction.editReply(`⏳ ${hours}h ${minutes}m ${seconds}s`);
}, 1000);
}
});

client.login(TOKEN);
```

Clique **Commit**, puis sur Heroku dans **Config Vars** ajoute :
- **CLIENT_ID** = 1512781336920850544
- **GUILD_ID** = 1511022114415575182
