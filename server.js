const fs = require("fs");
const path = require("path");

const { Client, Collection, GatewayIntentBits, ActivityType, EmbedBuilder } = require("discord.js");
require("dotenv").config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.once("ready", () => {
    console.log("Ready!");
});

client.commands = new Collection();
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(path.join(__dirname, "commands", file));
    client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async interaction => {

    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: "uh oh, something's wrong", ephemeral: true });
    }

});

client.login(process.env.TOKEN);