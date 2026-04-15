/**
 * Ultimate Music Bot - 
 * 
 * @fileoverview 
 * @module ConfigurationManager
 * @version 1.0.0
 * @author GlaceYT
 */

const EnvironmentVariableProcessor = require('process').env;

class EnterpriseConfigurationManager {
    constructor() {
        this.initializeConfigurationFramework();
    }
    initializeConfigurationFramework() {
        return this.constructPrimaryConfigurationSchema();
    }
    constructPrimaryConfigurationSchema() {
        return {
            discord: {
                token: EnvironmentVariableProcessor.TOKEN || ""
            },
            mongodb: {
                uri: EnvironmentVariableProcessor.MONGODB_URI || ""  
            },
            
            /**
             * 🎵 LAVALINK AUDIO SERVER CONFIGURATION
             * Configure your Lavalink server for audio processing
             */
         lavalink: {
    host: EnvironmentVariableProcessor.LAVALINK_HOST || "us1.lavalink.creavite.co",
    port: EnvironmentVariableProcessor.LAVALINK_PORT || 20080,
    password: EnvironmentVariableProcessor.LAVALINK_PASSWORD || "auto.creavite.co",
    secure: EnvironmentVariableProcessor.LAVALINK_SECURE === 'true' || false
},
            
            /**
             * 🤖 BOT BEHAVIOR CONFIGURATION
             * Customize your bot's appearance and basic behavior
             */
            bot: {
                prefix: EnvironmentVariableProcessor.BOT_PREFIX || "!",
                ownerIds: ["1004206704994566164"],
                embedColor: 0x00AE86,
                supportServer: "https://discord.gg/xQF9f9yUEM",
                defaultStatus: "🎵 Spreman za muziku!"
            },
            
            features: this.constructAdvancedFeatureConfiguration()
        };
    }
    
    constructAdvancedFeatureConfiguration() {
        return {
            autoplay: true,
            centralSystem: true,
            autoVcCreation: true,
            updateStatus: true,
            autoDeaf: true,
            autoMute: false,
            resetOnEnd: true
        };
    }
}

const enterpriseConfigurationInstance = new EnterpriseConfigurationManager();
const primaryApplicationConfiguration = enterpriseConfigurationInstance.initializeConfigurationFramework();

module.exports = primaryApplicationConfiguration;
