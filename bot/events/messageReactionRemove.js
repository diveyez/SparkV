const Discord = require("discord.js");

module.exports = {
	once: false,
	async execute(bot, reaction, user) {
		if (reaction.message?.partial) await reaction.message.fetch();
		if (reaction?.partial) await reaction.fetch();

		const message = reaction.message;

		if (reaction.emoji.name !== "⭐") return;

		const data = await bot.database.getGuild(message.guildId);

		if (!data.plugins?.starboard) return;

		const channel = message.guild.channels.cache.find(c => c.id === data.plugins.starboard);

		if (!channel) return;

		const fetchedMessages = await channel.messages.fetch({ limit: 100 });
		const stars = fetchedMessages.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));

		if (stars) {
			const star = /^\⭐\s([0-9]{1,3})\s\|\s([0-9]{17,20})/.exec(stars.embeds[0].footer.text);
			const foundStar = stars.embeds[0];

			const embed = new Discord.MessageEmbed()
				.setDescription(foundStar.description || "No content...")
				.setAuthor({
					name: message.author.tag,
					iconURL: message.author.displayAvatarURL({ dynamic: true })
				})
				.setImage(message.attachments.first()?.url || null)
				.addField("Source", `[Jump to Message!](${message.url})`, true)
				.setFooter(`⭐ ${parseInt(star[1]) + 1} | ${message.id}`)
				.setColor(foundStar.color)
				.setTimestamp();

			const starMsg = await channel.messages.fetch(stars.id);
			await starMsg.edit({ content: `⭐ **${parseInt(star[1]) - 1}** ${message.channel}`, embeds: [embed] });

			if (parseInt(star[1] - 1) === 0) return setTimeout(() => starMsg.delete(), 3 * 1000);
		}
	},
};
