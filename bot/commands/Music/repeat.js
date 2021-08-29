const Discord = require(`discord.js`);

const command = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
  if (!message.member.voice.channel) {
    return message
      .reply(`${bot.config.bot.Emojis.error} | You must be in a __**voice channel**__ to use this command!`)
      .then(m => m.delete({ timeout: 5000 }));
  }

  if (!bot.distube.isPlaying(message)) {
    return message
      .reply(`${bot.config.bot.Emojis.error} | A song must be playing to use this command!`)
      .then(m => m.delete({ timeout: 5000 }));
  }

  const Queue = bot.distube.getQueue(message);
  var mode;

  if (args[0].toLowerCase() === `song`) {
    mode = 1;
  } else if (args[0].toLowerCase() === `queue`) {
    if (!Queue) {
      return message
        .reply(`${bot.config.bot.Emojis.error} | There must be more than 2 songs in the queue to use this command!`)
        .then(m => m.delete({ timeout: 5000 }));
    }

    mode = 2;
  } else {
    mode = 0;
  }

  mode = bot.distube.setRepeatMode(message, mode);
  mode = mode ? (mode === 2 ? `repeat the Queue` : `repeat the currently playing song`) : `turn repeat mode off`;

  message.reply(`${bot.config.bot.Emojis.music} | Okay, I'll ${mode}.`);
}

module.exports = new command(execute, {
  description: `Replays the currently playing song.`,
  usage: "<song or queue: leave empty to deactivate>",
  aliases: ["replay", "loop"],
  perms: ["EMBED_LINKS"],
});