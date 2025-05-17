/**
 * Load environment variables from .env file
 *
 * This function tries to find and load a .env file in the current directory
 * or any parent directory up to a certain depth.
 */
export declare function loadEnv(): void;
/**
 * Get a required environment variable
 *
 * @param key - The name of the environment variable
 * @param defaultValue - Optional default value to use if the variable is not set
 * @returns The value of the environment variable
 * @throws Error if the variable is not set and no default value is provided
 */
export declare function getEnv(key: string, defaultValue?: string): string;
/**
 * Get an optional environment variable
 *
 * @param key - The name of the environment variable
 * @param defaultValue - Default value to use if the variable is not set
 * @returns The value of the environment variable or the default value
 */
export declare function getOptionalEnv(key: string, defaultValue: string): string;
export declare const env: {
    DATABASE_URL: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_USERNAME: string;
    SUPER_ADMIN_NAME: string;
    SUPER_ADMIN_PASSWORD: string;
    APP_NAME: string;
    APP_DESCRIPTION: string;
    NODE_ENV: string;
    IS_PRODUCTION: boolean;
    IS_DEVELOPMENT: boolean;
};
//# sourceMappingURL=env.d.ts.map