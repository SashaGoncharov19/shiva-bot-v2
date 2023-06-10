/**
 * @file Sample autocomplete interaction
 * @author Naman Vrati
 * @since 3.3.0
 * @version 3.3.0
 */

const { QueryType } = require("discord-player");
/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "mplay",

	async execute(interaction) {
		// Preparation for the autocomplete request.

		const focusedValue = interaction.options.getFocused();

		if (focusedValue.startsWith('http://' || 'https://')) return;

		// Extract choices automatically from your choice array (can be dynamic too)!

		const { client } = interaction;

		const result = await client.player.search(focusedValue, {
			requestedBy: interaction.user,
			searchEngine: QueryType.AUTO
		});

		if (!focusedValue.length) return;

		// Filter choices according to user input.

		const tracksArray = result.tracks.map((track) => track.title);

		// Respond the request here.
		await interaction.respond(
			tracksArray.map((choice) => ({ name: choice, value: choice }))
		);

		return;
	},
};
