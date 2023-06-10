const { SlashCommandBuilder } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vc")
		.setDescription(
			"Виключити музику."
		).addStringOption((string) =>
			string.setName('option')
				.setDescription('Тип операції')
				.setRequired(true)
				.addChoices(
					{ name: 'Ініціалізація голосового функціоналу', value: 'init' }
				)),

	async execute(interaction, client) {
		await interaction.deferReply();

		const option = interaction.options.getString('option');

		let answer;

		switch (option) {
			case 'init':
				const guild = await client.database.servers.findUnique({
					where: {
						guild: interaction.guild.id
					}
				});

				if (!guild) {
					const category = await interaction.guild.channels.create({ name: "Shiva Bot", type: ChannelType.GuildCategory });

					const channel = await category.children.create({ name: "[+]", type: ChannelType.GuildVoice });

					await client.database.servers.create({
						data: {
							guild: channel.guild.id,
							vcID: channel.id,
							categoryID: category.id
						}
					})

					answer = 'Готово.'
				} else {
					answer = 'На сервері вже встановлено голосові канали.'
				}
				break
		}

		await interaction.followUp(answer);
	},
};
