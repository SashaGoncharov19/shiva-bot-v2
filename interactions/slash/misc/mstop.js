const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mstop")
		.setDescription(
			"Виключити музику."
		),

	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.getQueue(interaction.guild);

		if (!queue)
			return interaction.followUp('Наразі ніяка пісня не включена.')

		queue.stop()

		await interaction.followUp('Музику виключено.');

	},
};
