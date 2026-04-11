const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'move',
    aliases: ['mv', 'movetrack'],
    description: 'Premjesti pjesmu na drugu poziciju u redu čekanja',
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
        
        const from = parseInt(args[0]);
        const to = parseInt(args[1]);
        
        if (!from || !to || from < 1 || to < 1) {
            const embed = new EmbedBuilder().setDescription('❌ Molimo unesite validne pozicije! Primjer: `!move 3 1` (premjesti pjesmu 3 na poziciju 1)');
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

            if (from > conditions.queueLength || to > conditions.queueLength) {
                const embed = new EmbedBuilder().setDescription(`❌ Nevažeće pozicije! Red čekanja ima samo ${conditions.queueLength} pjesama.`);
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            const player = conditions.player;
            const queueArray = Array.from(player.queue);

            const track = queueArray.splice(from - 1, 1)[0];
            queueArray.splice(to - 1, 0, track);

            player.queue.clear();
            queueArray.forEach(t => player.queue.add(t));

            const embed = new EmbedBuilder().setDescription(`🔄 Premješteno **${track.info.title}** sa pozicije ${from} na ${to}!`);
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));

        } catch (error) {
            console.error('Move command error:', error);
            const embed = new EmbedBuilder().setDescription('❌ Došlo je do greške pri premještanju pjesme!');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }
    }
};
