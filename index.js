const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName('countdown')
    .setDescription('Lance un countdown vers 19h00')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log('Commandes enregistrees!');
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
    const countdownTime = new Date('2026-06-06T19:00:00').getTime();

    await interaction.reply('Countdown lance!');

    const interval = setInterval(async () => {
      const now = new Date().getTime();
      const diff = countdownTime - now;

      if (diff <= 0) {
        await interaction.editReply('LS CUSTOM EST OUVERT!');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      await interaction.editReply(hours + 'h ' + minutes + 'm ' + seconds + 's');
    }, 1000);
  }
});

client.login(TOKEN);
