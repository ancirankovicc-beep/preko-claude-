const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'remove',
    aliases: ['rm', 'delete', 'del'],
    description: 'Ukloni pjesmu iz reda čekanja',
    securityToken: COMMAND_SECURITY_TOKEN,
    
    async execute(message, args, client) {
        if (!shiva || !shiva.validateCore || !shiva.validateCore()) {
            const embed = new EmbedBuilder()
                .setDescription('❌ Sistemsko jezgro je offline - Komanda nedostupna')
                .setColor('#FF0000');
            return message.reply({ embeds: [embed] }).catch(() => {});
        }

        message.shivaValidated = true;
        message.securityToken = COMMAND_SECURITY_TOKEN;

        setTimeout(() => {
            message.delete().catch(() => {});
        }, 4000);
        
        const position = parseInt(args[0]);
        
        if (!position || position < 1) {
            const embed = new EmbedBuilder().setDescription('❌ Molimo unesite validan broj pozicije! Primjer: `!remove 3`');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }

        const ConditionChecker = require('../../utils/checks');
        const checker = new ConditionChecker(client);
        
        try {
            const conditions = await checker.checkMusicConditions(
                message.guild.id, 
                message.author.id, 
                message.member.voice?.channelId
            );

            if (!conditions.hasActivePlayer || conditions.queueLength === 0) {
                const embed = new EmbedBuilder().setDescription('❌ Red čekanja je prazan!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            if (position > conditions.queueLength) {
                const embed = new EmbedBuilder().setDescription(`❌ Nevažeća pozicija! Red čekanja ima samo ${conditions.queueLength} pjesama.`);
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            const player = conditions.player;
            const removedTrack = player.queue.remove(position - 1);

            const embed = new EmbedBuilder().setDescription(`🗑️ Uklonjeno: **${removedTrack.info.title}**`);
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));

        } catch (error) {
            console.error('Remove command error:', error);
            const embed = new EmbedBuilder().setDescription('❌ Došlo je do greške pri uklanjanju pjesme!');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }
    }
};
