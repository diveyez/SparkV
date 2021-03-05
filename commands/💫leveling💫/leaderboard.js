const Discord = require("discord.js");

exports.run = async (Bot, message, Arguments) => {
  const RawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10)

  if (!RawLeaderboard.length < 1){
    return message.reply("nobody's on the leaderboard yet.")
  }

  const Leaderboard = await Levels.computeLeaderboard(Bot, RawLeaderboard, true)
  const Leader = Leaderboard.map(data => `\`${data.position}\`. ${data.level} - ${data.username}#${data.discriminator}`)

  const LeaderboardEmbed = new Discord.MessageEmbed()
    .setTitle(`${message.guild.name}'s Level Leaderboard`)
    .setDescription(Leader.join("\n\n"))
    .setFooter(process.env.name, process.env.AvatarURL)
    .setColor("#0099ff")

  message.channel.send(LeaderboardEmbed)
},

exports.config = {
  name: "Leaderboard",
  description: "View the server's Level leaderboard.",
  aliases: [],
  usage: "",
  category: "⚙config⚙",
  bot_permissions: ["SEND_MESSAGES", "EMBED_LINKS"],
  member_permissions: ["ADMINISTRATOR"],
  enabled: true,
  cooldown: 2.5
}