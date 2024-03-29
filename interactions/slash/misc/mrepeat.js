const { SlashCommandBuilder } = require("discord.js");
const { QueueRepeatMode } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mrepeat")
		.setDescription(
			"Виключити музику."
		).addStringOption((string) =>
			string.setName('status')
				.setDescription('Виберіть пункт повторювання.')
				.setRequired(true)
				.addChoices(
					{ name: 'Повторювати весь плейлист', value: '2' },
					{ name: 'Повторювати цю музику', value: '1' },
					{ name: 'Виключити', value: '0' }
				)),

	async execute(interaction, client) {
		await interaction.deferReply();

		const queue = client.player.nodes.get(interaction.guild);
		const status = parseInt(interaction.options.getString('status'));

		if (!queue)
			return interaction.followUp('Наразі ніяка пісня не включена.')

		switch (status) {
			case 0:
				queue.setRepeatMode(0)
				break
			case 1:
				queue.setRepeatMode(1)
				break
			case 2:
				queue.setRepeatMode(2)
				break
		}

		await interaction.followUp('Статус повтору змінено!');

	},
};
