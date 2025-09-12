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
            const responseJson = await response.json();
            this.config.resolve(responseJson);
            console.log('Configuration loaded from remote source.');
            return;
        } catch (error) {
            console.error('Failed to load configuration from local file:', error);
        }

        throw new Error('Unable to load configuration from either local file or AWS AppConfig');
    }

    static async getSimpleFlag(key) {
        if(!this.config) {
            throw new Error("No configuration value!")
        }
        const config = await this.config.promise;
        console.log(config);
        const value = config[key]?.enabled;
        return !!value;
    }

    static async getVariantFlag(key) {
        const config = await this.config.promise;
        const value = config[key];
        return typeof value === 'boolean' ? value : false;
    }
}