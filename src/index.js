const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { Guilds } = GatewayIntentBits;
const path = require("path");
const fs = require("fs");

// LOAD TOKEN

// load .env file
require("dotenv").config();
// config writen in .env file of the project
const TOKEN = process.env.TOKEN;
// missing credentials
if (!TOKEN) {
  throw new Error("Missing token, it is required to initialize your bot");
}

// INITIALIZE THE BOT

// Create a new client instance
const client = new Client({ intents: [Guilds] });

// Load commands written in ./commands each file is a command
client.commands = new Collection();

// set path to commands
const commandsPath = path.join(__dirname, "commands");
// get all files with .js
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// load file and set the command
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (_client) => {
  console.log(`Ready! Logged in as ${_client.user.tag}`);
});

// Log in to Discord with your client's token
client.login(TOKEN);

// avoid crashing the bot
process.on("uncaughtException", (error, origin) => {
  console.error(error.message, error.stack);
});

