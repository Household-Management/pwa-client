import {getCurrentUser, fetchAuthSession} from "aws-amplify/auth";
import {get} from "aws-amplify/api";

export default class ConfigurationService {
    static config = Promise.withResolvers();

    static async loadConfiguration() {
        if (!import.meta.env.VITE_APP_CONFIG_URL) {
            throw new Error("No configuration source defined");
        }

        // TODO: Local caching of configuration

        const auth = await fetchAuthSession()
        console.log("Loading configuration...");
        try {
            let headers = {};
            let path;
            // TODO: Use a single url and select the configuration programmatically in there
            if (auth?.tokens?.accessToken) {
                console.log("Getting configuration for authenticated user");
                headers["Authorization"] = `Bearer ${auth.tokens.idToken}`;
                path = "config/2j0vk1v/eyvmk0e/2vkz6hj"
            } else {
                console.log("Getting public configuration");
                path = "config/2j0vk1v/eyvmk0e"
            }
            const response = await get({
                apiName: "Household Service",
                path,
                options: { headers }
            }).response;
            if (response.statusCode !== 200) {
                throw new Error(`HTTP error! status: ${response.statusCode}`);
            }
            const responseJson = await response.body.json();
            this.config.resolve(responseJson);
            console.log('Configuration loaded from remote source.');
            return;
        } catch (error) {
            console.error('Failed to load configuration from local file:', error);
        }

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