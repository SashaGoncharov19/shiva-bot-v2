const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { useMasterPlayer } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mplay")
		.setDescription(
			"Включити музику."
		)
		.addStringOption((option) =>
			option.setName('url')
				.setDescription('Введіть URL або назву')
				.setRequired(true)
				.setAutocomplete(true)),

	async execute(interaction, client) {
		await interaction.deferReply();

		await client.player.extractors.loadDefault();

		const player = useMasterPlayer();
		const query = interaction.options.getString("url", true);

		const queue = await player.nodes.create(interaction.guild, {
			ytdlOptions: {
				filter: 'audioonly',
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
			metadata: {
				channel: interaction.channel,
				client: interaction.guild.members.me,
				requestedBy: interaction.user
			},
			leaveOnEmpty: false
		});

		try {
			if (!queue.connection) await queue.connect(interaction.member.voice.channel);
		} catch {
			queue.delete();
			return await interaction.followUp('Неможливо приєднатись до голосового каналу!');
		}

		try {
			const result = await player.search(query, { requestedBy: interaction.user });

			if (!result) return await interaction.followUp(`Трек ${query} не знайдено!`);

			result.playlist ? queue.addTrack(result.tracks) : queue.addTrack(result.tracks[0]);

			if (!queue.node.isPlaying()) await queue.node.play();

			const isPlayList = !!result.playlist;
			const songList = isPlayList ? result.playlist : result.tracks[0];

			const msgEmbed = isPlayList ? `**${result.tracks.length} пісень | [${songList.title}](${songList.url})** плейлист добавлений в чергу.`
				: `**[${songList.title}](${songList.url})** добавлено в чергу.`;

			const embed = new EmbedBuilder()
				.setColor('#0099ff')
				.setDescription(msgEmbed)
				.setTimestamp()
				.setFooter({ text: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: interaction.user.avatarURL() });

			await interaction.followUp({ embeds: [embed] });

		} catch (e) {
			console.log(e);
		}

		},
};
