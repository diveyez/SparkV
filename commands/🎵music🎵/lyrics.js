const Discord = require("discord.js");
const LyricsFilder = require("lyrics-finder")

exports.run = async (Bot, message, Arguments) => {
  if (!Arguments){
    return message.reply("Please supply the title of the song and artist.").then(m => m.delete({ timeout: 5000 }))
  }
  
  Arguments = Arguments.join()
  
  let lyrics = await LyricsFilder(Arguments, Arguments) || "Not found!"
  
  message.channel.send({
    embed: {
      title: `Lyrics for ${Arguments}`,
      description: lyrics,
      color: "#0099ff",
    }
  })
},

exports.config = {
  enabled: true,
  guild_only: true,
  aliases: ["ly"],
  bot_permissions: ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "VIEW_CHANNEL"]
},
    
exports.help = {
  name: "Lyrics",
  description: "Get any song's lyrics!",
  usage: "<song title or URL>",
  category: "🎵music🎵",
  cooldown: 3
}