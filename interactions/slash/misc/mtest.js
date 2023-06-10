const { SlashCommandBuilder } = require("discord.js");
const { ChannelType } = require("discord-api-types/v10");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Search discordjs.guide!')
		.addStringOption(option =>
			option.setName('query')
				.setDescription('Phrase to search for')
				.setAutocomplete(true)),

	async execute(interaction, client) {
		const focusedValue = interaction.options.getFocused();
		const choices = ['Popular Topics: Threads', 'Sharding: Getting started', 'Library: Voice Connections', 'Interactions: Replying to slash commands', 'Popular Topics: Embed preview'];
		const filtered = choices.filter(choice => choice.startsWith(focusedValue));
		await interaction.respond(
			filtered.map(choice => ({ name: choice, value: choice })),
		);
	},
};
