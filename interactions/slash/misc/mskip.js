const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mskip')
		.setDescription('Пропустити наявний трек.'),

	async execute(interaction, client) {
		const queue = client.player.nodes.get(interaction.guild)

		if (!queue) return interaction.reply('Наразі ніяка пісня не грає.')

		queue.node.skip();
		interaction.reply({embeds: [
				new EmbedBuilder()
					.setColor('#0099ff')
					.setDescription(`Пісня пропущена!`)
					.setTimestamp()
					.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() })
			]})
	},
};
