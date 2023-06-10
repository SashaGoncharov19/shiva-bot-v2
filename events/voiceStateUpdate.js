const { ChannelType } = require("discord-api-types/v10");
const { PermissionsBitField } = require("discord.js");

module.exports = {
	name: "voiceStateUpdate",

	async execute(oldState, newState, client) {
		const newUserChannel = newState.channelId;

		//TODO: Optimization
		const guild = await client.database.servers.findUnique({
			where: {
				guild: newState.guild.id
			}
		});

		if (newUserChannel === guild.vcID) {
			const user = await newState.guild.members.fetch(newState.id);

			const category = newState.guild.channels.cache.get(guild.categoryID);
			const channel = await category.children.create({
				name: `${user.user.username}`,
				type: ChannelType.GuildVoice,
				permissionOverwrites: [
					{
						id: user.id,
						allow: [PermissionsBitField.Flags.ManageChannels],
					}
					] });

			await newState.member.voice.setChannel(channel);

			const deleteChannelInterval = setInterval(() => {
				if (!channel.members.map(member => member.id).length) {
					channel.delete();
					clearInterval(deleteChannelInterval);
				}
			}, 5000)
		}
	},
};
