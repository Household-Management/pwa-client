import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";

export default class ConfigurationService {
    static config = Promise.withResolvers();

    static async loadConfiguration() {
        if(!import.meta.env.VITE_APP_CONFIG_URL) {
            throw new Error("No configuration source defined");
        }

        const auth = await fetchAuthSession()
        console.log("Loading configuration...");
        try {
            const response = await fetch(import.meta.env.VITE_APP_CONFIG_URL, {
                // credentials: "include",
                headers: {
                    "authorization": `Bearer ${auth.tokens.idToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.config.resolve(await response.json());
            console.log('Configuration loaded from remote source.');
            return;
        } catch (error) {
            console.error('Failed to load configuration from local file:', error);
        }

        // try {
        //     console.log("Loading configuration from AWS AppConfig");
        //     const appConfig = new AppConfigDataClient({region: 'us-east-1'}); // TODO: Externalize region
        //     const params = {
        //         ApplicationIdentifier: import.meta.env.VITE_APP_CONFIG_APPLICATION_ID,
        //         EnvironmentIdentifier: import.meta.env.VITE_APP_CONFIG_ENVIRONMENT_ID,
        //         ConfigurationProfileIdentifier: import.meta.env.VITE_APP_CONFIG_PROFILE_ID
        //     };
        //
        //     const sessionStart = new StartConfigurationSessionCommand(params);
        //
        //     await appConfig.send(sessionStart);
        //
        //     const latestConfiguration = new GetLatestConfigurationCommand(params);
        //
        //     const configResponse = await appConfig.send(latestConfiguration);
        //
        //     if (configResponse.Content) {
        //         this.config = JSON.parse(configResponse.Content.toString());
        //         console.log('Configuration loaded from AWS AppConfig');
        //         return;
        //     }
        // } catch (error) {
        //     console.error('Failed to load configuration from AWS AppConfig:', error);
        // }

        throw new Error('Unable to load configuration from either local file or AWS AppConfig');
    }

    static async getSimpleFlag(key) {
        const config = await this.config.promise;
        const value = config[key]?.enabled;
        return !!value;
    }

    static async getVariantFlag(key) {
        const config = await this.config.promise;
        const value = config[key];
        return typeof value === 'boolean' ? value : false;
    }
}