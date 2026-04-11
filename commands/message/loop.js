const { EmbedBuilder } = require('discord.js');
const shiva = require('../../shiva');

const COMMAND_SECURITY_TOKEN = shiva.SECURITY_TOKEN;

module.exports = {
    name: 'loop',
    aliases: ['repeat', 'l'],
    description: 'Postavi mod ponavljanja (isključeno, pjesma, red)',
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
        
        const mode = args?.toString().toLowerCase();
        const validModes = ['off', 'none', 'track', 'song', 'queue', 'all'];
        
        if (!mode || !validModes.includes(mode)) {
            const embed = new EmbedBuilder().setDescription('❌ Molimo odaberite validan mod ponavljanja!\n**Opcije:** `off`, `track`, `queue`\nPrimjer: `!loop track`');
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

            if (!conditions.hasActivePlayer) {
                const embed = new EmbedBuilder().setDescription('❌ Trenutno ne svira nikakva muzika!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            if (!conditions.sameVoiceChannel) {
                const embed = new EmbedBuilder().setDescription('❌ Morate biti u istom glasovnom kanalu kao bot!');
                return message.reply({ embeds: [embed] })
                    .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
            }

            let loopMode;
            if (mode === 'off' || mode === 'none') loopMode = 'none';
            else if (mode === 'track' || mode === 'song') loopMode = 'track';
            else if (mode === 'queue' || mode === 'all') loopMode = 'queue';

            const player = conditions.player;
            player.setLoop(loopMode);

            const modeEmojis = { none: '➡️', track: '🔂', queue: '🔁' };
            const modeNames = { none: 'Isključeno', track: 'Pjesma', queue: 'Red čekanja' };

            const embed = new EmbedBuilder().setDescription(`${modeEmojis[loopMode]} Mod ponavljanja postavljen na: **${modeNames[loopMode]}**`);
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));

        } catch (error) {
            console.error('Loop command error:', error);
            const embed = new EmbedBuilder().setDescription('❌ Došlo je do greške pri postavljanju moda ponavljanja!');
            return message.reply({ embeds: [embed] })
                .then(m => setTimeout(() => m.delete().catch(() => {}), 3000));
        }
    }
};
