const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mplay")
		.setDescription(
			"Включити музику."
		)
		.addStringOption((option) =>
			option.setName('url')
				.setDescription('Введіть URL або назву')
				.setRequired(true)),

	async execute(interaction, client) {
		await interaction.deferReply();

		console.log('hi');

		const query = interaction.options.getString("url");
		const queue = await client.player.createQueue(interaction.guild, {
			ytdlOptions: {
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: interaction.channel
		});

		console.log('hi 2');

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.destroy();
			return await interaction.followUp('Неможливо приєднатись до голосового каналу!');
		}

		console.log('hi 3');

		try {
			const result = await client.player.search(query, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO
			});

			console.log('hi 4');

			if (!result) return await interaction.followUp(`Трек ${query} не знайдено!`);

			console.log('hi 5');

			result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

			console.log('hi 6');

			if (!queue.playing) await queue.play();

			const isPlayList = !!result.playlist;
			const songList = isPlayList ? result.playlist : result.tracks[0];

			console.log('hi 7');

			const msgEmbed = isPlayList ? `**${result.tracks.length} пісень | [${songList.title}](${songList.url})** плейлист добавлений в чергу.`
				: `**[${songList.title}](${songList.url})** добавлено в чергу.`;

			console.log('hi 8');

			const embed = new EmbedBuilder()
				.setColor('#0099ff')
				.setDescription(msgEmbed)
				.setTimestamp()
				.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() });

			await interaction.followUp({ embeds: [embed] });

			console.log('hi 9');
		} catch (e) {
			console.log(e);
		}

		},
};
