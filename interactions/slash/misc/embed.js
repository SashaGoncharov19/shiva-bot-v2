const { Events, EmbedBuilder, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require("discord.js");
const isUrlValid = require('url-validation');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("embed")
		.setDescription(
			"Create custom embed"
		)
        .addBooleanOption((e) =>
			e
				.setName("timestamp")
				.setDescription("Add timestamp?")
                .setRequired(false)
		)
        .addBooleanOption((e) =>
			e
				.setName("footer")
				.setDescription("Add footer?")
                .setRequired(false)
		)
        .addStringOption((e) =>
			e
				.setName("text")
				.setDescription("Add text to display above embed")
                .setRequired(false)
		)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    
	async execute(interaction, client ) {

        // modal builder
        const MODAL = new ModalBuilder()
            .setCustomId('modal')
            .setTitle('Embed Builder');

        const modalBody = new TextInputBuilder()
            .setCustomId('body')
            .setLabel("Specify embed description")
            .setPlaceholder('Embed content')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        const actionBody = new ActionRowBuilder().addComponents(modalBody);

        const modalTitle = new TextInputBuilder()
			.setCustomId('title')
			.setLabel("Specify embed title")
            .setPlaceholder('Embed title')
            .setRequired(false)
			.setStyle(TextInputStyle.Short);
        const actionTitle = new ActionRowBuilder().addComponents(modalTitle);

        const modalColor = new TextInputBuilder()
			.setCustomId('color')
			.setLabel("Specify embed color")
            .setRequired(false)
            .setValue('#FFFF00')
			.setStyle(TextInputStyle.Short);
        const actionColor = new ActionRowBuilder().addComponents(modalColor);

        const modalThumbnail = new TextInputBuilder()
			.setCustomId('thumbnail')
			.setLabel("Specify embed thumbnail URL")
            .setPlaceholder('Embed thumbnail URL')
            .setRequired(false)
			.setStyle(TextInputStyle.Short);
        const actionThumbnail= new ActionRowBuilder().addComponents(modalThumbnail);

        const modalImages = new TextInputBuilder()
			.setCustomId('images')
			.setLabel("Specify embed images (separate with comma)")
            .setPlaceholder('Embed images links')
            .setRequired(false)
			.setStyle(TextInputStyle.Paragraph);
        const actionImages= new ActionRowBuilder().addComponents(modalImages);

        // slash command input
        const footer = interaction.options.getBoolean('footer') ?? false;    
        const timestamp = interaction.options.getBoolean('timestamp') ?? false;
        const text = interaction.options.getString('text')

        MODAL.addComponents(actionBody, actionTitle, actionColor, actionThumbnail, actionImages);

        // modal popup
        await interaction.showModal(MODAL); 

        client.on(Events.InteractionCreate, async modalInteraction => {
            if (!modalInteraction.isModalSubmit()) return;

            const title = modalInteraction.fields.getTextInputValue('title')
            const body = modalInteraction.fields.getTextInputValue('body')
            const color = modalInteraction.fields.getTextInputValue('color') ?? '#FFFF00'
            const images = modalInteraction.fields.getTextInputValue('images')
            const thumbnail = modalInteraction.fields.getTextInputValue('thumbnail')

            let imagesValid = isUrlValid(images)
            let thumbnailValid = isUrlValid(thumbnail)

                // embed builder
            const embed = new EmbedBuilder()
                .setDescription(body)
                .setColor(color)

                // optional values
            // timestamp
            timestamp ? embed.setTimestamp() : null

            // // title
            title ? embed.setTitle(title) : null

            // // thumbnail
            thumbnail && thumbnailValid ? embed.setThumbnail(thumbnail) : null

            // image
            images && imagesValid ? embed.setImage(images) : null

            // // images
            // if (images) {
            //     var imagesA = [];
            //     let img = images.split(',')
            //     img.forEach(e => imagesA.push(e))
            //     for (i in imagesA) {embed.setImage(i)}
            // }

            // footer
            if (footer) {
                let user = await interaction.user;
                let obj = { text: user.username, iconURL: user.avatarURL() }
                embed.setFooter(obj);
            }
                
            // reply
            thumbnailValid && imagesValid ? 
            await modalInteraction.channel.send({content: text, embeds: [embed] }) : 
            modalInteraction.reply({content: 'Thumbnail or Image URL is not valid', ephemeral: true})
        })
	},
};