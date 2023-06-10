const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moptions')
		.setDescription('Включити фільтри.')
		.addStringOption((string) =>
			string.setName('effect')
				.setDescription('Вибір фільтру.')
				.setRequired(true)
				.addChoices(
					{ name: 'Bass Boost Max', value: 'bassboost_high' },
					{ name: 'Bass Boost Medium', value: 'bassboost' },
					{ name: 'Bass Boost Low', value: 'bassboost_low' },
					{ name: 'Nightcore', value: 'nightcore' },
					{ name: '8D', value: '8D' },
					{ name: 'Mono', value: 'mono' },
					{ name: 'Замідлення', value: 'vaporwave' },
					{ name: 'Звук лучів бластеру', value: 'phaser' },
					{ name: 'Долітаючий звук', value: 'tremolo' },
				)),

	async execute(interaction, client) {
		await interaction.deferReply();
		const queue = client.player.nodes.get(interaction.guild);

		const filter = interaction.options.getString('effect');

		if (!queue) return interaction.followUp('Наразі ніяка пісня не грає.')

		await queue.filters.ffmpeg.toggle(filter)

		await interaction.followUp('Фільт включено/виключено!');
	},
};
