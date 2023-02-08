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
				))
		.addStringOption((string) =>
			string.setName('boolean')
				.setDescription('Включити або виключити фільтр.')
				.setRequired(true)
				.addChoices(
					{ name: 'Включити', value: '1' },
					{ name: 'Виключити', value: '0' },
				)),

	async execute(interaction, client) {
		await interaction.deferReply();
		const queue = client.player.getQueue(interaction.guild);

		const filter = interaction.options.getString('effect');
		const status = interaction.options.getString('boolean');

		if (!queue) return interaction.followUp('Наразі ніяка пісня не грає.')

		client.filters[filter] = status === '1';

		await queue.setFilters(client.filters)

		const user = client.users.cache.find(account => account.id === client.application.id);

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle('Список задіяних фільтрів.')
			.setThumbnail(user.avatarURL())
			.setTimestamp()
			.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() });

		const array = [];

		for (const [key, index] of Object.entries(client.filters)) {
			array.push({name: key, value: index.toString()})
		}

		embed.addFields(...array);

		await interaction.followUp({embeds: [embed]});
	},
};
