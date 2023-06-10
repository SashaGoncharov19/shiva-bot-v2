const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mshuffle')
		.setDescription('Перемішати чергу.'),

	async execute(interaction, client) {
		const queue = client.player.nodes.get(interaction.guild)

		if (!queue)
			return interaction.reply('Наразі ніяка пісня не грає.')

		queue.tracks.shuffle()
		interaction.reply(`🎶 | Черга з ${queue.tracks.lenght} пісень перемішана!`)
	},
};
