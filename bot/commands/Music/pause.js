const Discord = require(`discord.js`);

const command = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
  if (!message.member.voice.channel) {
    return message
      .reply(`${bot.config.bot.Emojis.error} | You must be in a __**voice channel**__ to use this command!`)
      .then(m => m.delete({ timeout: 5000 }));
  }

    let queue = await bot.distube.getQueue(message);

    if (!queue) {
        return message.reply(
            `${bot.config.bot.Emojis.error} | There is nothing in the queue right now! Try playing some songs.`
        );
    }

  bot.distube.pause(message);
  message.reply(`${bot.config.bot.Emojis.music} | I paused the song for you!`);
}

module.exports = new command(execute, {
  description: `Pauses the current song playing.`,
  usage: "",
  aliases: ["softstop"],
  perms: ["EMBED_LINKS"],
});
