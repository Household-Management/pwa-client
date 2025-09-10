import AWS from 'aws-sdk';

export default class ConfigurationService {
    static config = Promise.withResolvers();

    static async loadConfiguration() {
        console.log("Loading configuration...");
        if (import.meta.env.MODE === 'development') {
            console.log("Running in development mode. Loading local configuration.");
            try {
                const response = await fetch('/dev.app_config.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                this.config.resolve(await response.json());
                console.log('Configuration loaded from local file.');
                return;
            } catch (error) {
                console.error('Failed to load configuration from local file:', error);
            }
        }

        try {
            console.log("Loading configuration from AWS AppConfig");
            const appConfig = new AWS.AppConfigData({region: 'us-east-1'});
            const params = {
                ApplicationIdentifier: process.env.APP_CONFIG_APPLICATION_ID,
                EnvironmentIdentifier: process.env.APP_CONFIG_ENVIRONMENT_ID,
                ConfigurationProfileIdentifier: process.env.APP_CONFIG_PROFILE_ID,
            };

            const tokenResponse = await appConfig.startConfigurationSession(params).promise();
            const configResponse = await appConfig.getLatestConfiguration({
                ConfigurationToken: tokenResponse.InitialConfigurationToken,
            }).promise();

            if (configResponse.Content) {
                this.config = JSON.parse(configResponse.Content.toString());
                console.log('Configuration loaded from AWS AppConfig');
                return;
            }
        } catch (error) {
            console.error('Failed to load configuration from AWS AppConfig:', error);
        }

        throw new Error('Unable to load configuration from either local file or AWS AppConfig');
    }

    static async getSimpleFlag(key) {
        const config = await this.config.promise;
        const value = config[key];
        return typeof value === 'boolean' ? value : false;
    }

    static async getVariantFlag(key) {
        const config = await this.config.promise;
        const value = config[key];
        return typeof value === 'boolean' ? value : false;
    }
}