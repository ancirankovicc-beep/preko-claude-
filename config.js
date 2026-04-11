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
                host: EnvironmentVariableProcessor.LAVALINK_HOST || "87.106.62.92", 
                port: EnvironmentVariableProcessor.LAVALINK_PORT || 9258,       
                password: EnvironmentVariableProcessor.LAVALINK_PASSWORD || "zenkai-og", 
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
                defaultStatus: "🎵 Ready for music!"
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
/**
 * Export configuration for application-wide utilization
 * 
 * @type {Object} Comprehensive application configuration object
 */
module.exports = primaryApplicationConfiguration;
/**
 * =========================================
 * 📚 CONFIGURATION GUIDE FOR USERS
 * =========================================
 * 
 * 🔑 REQUIRED SETUP (YOU MUST DO THESE):
 * 1. Add your Discord bot token to "discord.token"
 * 2. Add your MongoDB connection URI to "mongodb.uri" 
 * 3. Add your Discord user ID to "bot.ownerIds" array
 * 
 * 🎛️ OPTIONAL CUSTOMIZATION:
 * - Change bot prefix in "bot.prefix"
 * - Modify embed color in "bot.embedColor" 
 * - Update support server link in "bot.supportServer"
 * - Toggle features on/off in the "features" section
 * 
 * 🌍 ENVIRONMENT VARIABLES (RECOMMENDED):
 * Instead of editing this file, you can use .env file:
 * TOKEN=your_bot_token_here
 * MONGODB_URI=your_mongodb_uri_here
 * BOT_PREFIX=!
 * 
 * ⚠️ SECURITY WARNING:
 * Never share your bot token or database URI publicly!
 * Use environment variables in production!
 */
