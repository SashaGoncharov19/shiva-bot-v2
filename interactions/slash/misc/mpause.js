const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mpause")
		.setDescription(
			"Зупинити музику."
		).addStringOption((string) =>
			string.setName('status')
				.setDescription('Пауза/Плей для музики.')
				.setRequired(true)
				.addChoices(
					{ name: 'Зупинити', value: '1' },
					{ name: 'Запустити', value: '0'},
				)),

	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.nodes.get(interaction.guild);
		const status = !!parseInt(interaction.options.getString('status'));

		if (!queue)
			return interaction.followUp('Наразі ніяка пісня не включена.')

		status ? queue.node.pause() : queue.node.resume();

		await interaction.followUp(status ? '⏸' : '▶');

	},
};
