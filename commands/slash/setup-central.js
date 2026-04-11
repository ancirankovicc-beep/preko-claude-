const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js');
const Server = require('../../models/Server');
const CentralEmbedHandler = require('../../utils/centralEmbed');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-central')
        .setDescription('Postavi centralni muzički sistem u trenutnom kanalu')
        .addChannelOption(option =>
            option.setName('voice-channel')
                .setDescription('Glasovni kanal za muziku (opciono)')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(false))
        .addRoleOption(option =>
            option.setName('allowed-role')
                .setDescription('Uloga kojoj je dozvoljena upotreba centralnog sistema (opciono)')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    securityToken: COMMAND_SECURITY_TOKEN,

    async execute(interaction, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('❌ Sistemsko jezgro je offline - Komanda nedostupna')
                .setColor('#FF0000');
            return interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
        }

        interaction.shivaValidated = true;
        interaction.securityToken = COMMAND_SECURITY_TOKEN;

        await interaction.deferReply({ ephemeral: true });

        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;
        const voiceChannel = interaction.options.getChannel('voice-channel');
        const allowedRole = interaction.options.getRole('allowed-role');

        try {
            let serverConfig = await Server.findById(guildId);
            
            if (serverConfig?.centralSetup?.enabled) {
                return interaction.editReply({
                    content: '❌ Centralni muzički sistem je već postavljen! Koristite `/disable-central` da ga resetujete.',
                    ephemeral: true
                });
            }

            const botMember = interaction.guild.members.me;
            const channel = interaction.channel;
            
            if (!channel.permissionsFor(botMember).has(['SendMessages', 'EmbedLinks', 'ManageMessages'])) {
                return interaction.editReply({
                    content: '❌ Potrebne su mi dozvole `Slanje poruka`, `Embed linkovi` i `Upravljanje porukama` u ovom kanalu!',
                    ephemeral: true
                });
            }

            const centralHandler = new CentralEmbedHandler(client);
            const embedMessage = await centralHandler.createCentralEmbed(channelId, guildId);
            
            if (!embedMessage) {
                return interaction.editReply({
                    content: '❌ Neuspješno kreiranje centralnog embeda!',
                    ephemeral: true
                });
            }

            const setupData = {
                _id: guildId,
                centralSetup: {
                    enabled: true,
                    channelId: channelId,
                    embedId: embedMessage.id,
                    vcChannelId: voiceChannel?.id || null,
                    allowedRoles: allowedRole ? [allowedRole.id] : [],
                    deleteMessages: true
                }
            };

            await Server.findByIdAndUpdate(guildId, setupData, { 
                upsert: true, 
                new: true 
            });

            const successEmbed = new EmbedBuilder()
                .setTitle('✅ Centralni muzički sistem uspješno postavljen!')
                .setDescription(`Centralna muzička kontrola je postavljena u <#${channelId}>`)
                .addFields(
                    { name: '📍 Kanal', value: `<#${channelId}>`, inline: true },
                    { name: '🔊 Glasovni kanal', value: voiceChannel ? `<#${voiceChannel.id}>` : 'Nije postavljen', inline: true },
                    { name: '👥 Dozvoljena uloga', value: allowedRole ? `<@&${allowedRole.id}>` : 'Svi', inline: true }
                )
                .setColor(0x00FF00)
                .setFooter({ text: 'Korisnici sada mogu upisati naziv pjesme u kanal da puštaju muziku!' });

            await interaction.editReply({ embeds: [successEmbed] });

            setTimeout(async () => {
                try {
                    const usageEmbed = new EmbedBuilder()
                        .setTitle('🎵 Centralni muzički sistem je aktivan!')
                        .setDescription(
                            '• Upišite bilo koji **naziv pjesme** da pustite muziku\n' +
                            '• Linkovi (YouTube, Spotify) su podržani\n' +
                            '• Ostale poruke će biti automatski obrisane\n' +
                            '• Koristite normalne komande (`!play`, `/play`) u drugim kanalima\n\n' +
                            '⚠️ Ova poruka će biti automatski obrisana za 10 sekundi!'
                        )
                        .setColor(0x1DB954)
                        .setFooter({ text: 'Uživajte u muzici!' });
            
                    const msg = await channel.send({ embeds: [usageEmbed] });
                    setTimeout(() => { msg.delete().catch(() => {}); }, 10000);
            
                } catch (error) {
                    console.error('Error sending usage instructions:', error);
                }
            }, 2000);

        } catch (error) {
            console.error('Error setting up central system:', error);
            await interaction.editReply({
                content: '❌ Došlo je do greške pri postavljanju centralnog muzičkog sistema!',
                ephemeral: true
            });
        }
    }
};
