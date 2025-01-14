const Discord = require(`discord.js`);

const cmd = require("../../templates/musicCommand");

async function execute(bot, message, args, command, data) {
	const queue = bot.distube.getQueue(message);
	if (!queue) return message.channel.send(`${bot.config.emojis.error} | There is nothing in the queue right now!`);
	if (queue.length < 2) return message.channel.send(`${bot.config.emojis.error} | There is only one song in the queue!`);

	queue.shuffle();

	await message.replyT(`${bot.config.emojis.music} | Okay, I'll shuffle the queue.`);
}

module.exports = new cmd(execute, {
	description: `Shuffles the queue.`,
	dirname: __dirname,
	usage: "",
	aliases: ["shufflequeue", "shuffleq", "squeue"],
	perms: ["EMBED_LINKS"],
});
