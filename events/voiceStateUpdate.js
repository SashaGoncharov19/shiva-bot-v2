const { ChannelType } = require("discord-api-types/v10");
module.exports = {
	name: "voiceStateUpdate",

	async execute(oldState, newState, client) {
		const newUserChannel = newState.channelId;

		const guildsData = await client.db.get('serversData');
		const guild = guildsData.filter(x => x.guild === newState.guild.id)[0];

		if (newUserChannel === guild?.vcID) {
			const user = await newState.guild.members.fetch(newState.id);

			const category = newState.guild.channels.cache.get(guild.categoryID);
			const channel = await category.children.create({ name: `${user.user.username}`, type: ChannelType.GuildVoice });

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
