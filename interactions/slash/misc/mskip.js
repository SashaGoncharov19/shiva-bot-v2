const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mskip')
		.setDescription('Пропустити наявний трек.'),

	async execute(interaction, client) {
		const queue = client.player.getQueue(interaction.guild)

		if (!queue) return interaction.reply('Наразі ніяка пісня не грає.')

		const currentSong = queue.current;

		queue.skip()
		interaction.reply({embeds: [
				new EmbedBuilder()
					.setColor('#0099ff')
					.setDescription(`**[${currentSong.title}](${currentSong.url})** пропущено.`)
					.setTimestamp()
					.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() })
			]})
	},
};
