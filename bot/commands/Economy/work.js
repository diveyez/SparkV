const Discord = require("discord.js");

const cmd = require("../../templates/command");

module.exports = new cmd(
async (bot, message) => {
    await message.replyT(`${bot.config.Emojis.error} | You don't have a job noob. You have to go get one to work lol.`);
  },
  {
    description: "Work for your job and earn some Ch1llBucks.",
    dirname: __dirname,
    aliases: ["job"],
    usage: ``,
  },
);
